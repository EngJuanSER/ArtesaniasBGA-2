"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder, createPayPalOrder, capturePayPalOrder } from "@/data/actions/order-actions"; 
import { CartType } from "@/types/cart"; 
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { serverCleanCart } from "@/data/actions/cart-actions";

interface PayPalButtonProps {
  cart: CartType;
  quantities: { [key: string]: number };
  onSuccess?: () => void;
}

export default function PayPalButton({ cart, quantities, onSuccess }: PayPalButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const EXCHANGE_RATE = 1/4360.69;


  const items = cart.cartItems.map(item => {
    const priceUsd = Number(
      (item.offer && item.priceOffer ? item.priceOffer : item.price)
    ) * EXCHANGE_RATE;
    
    return {
      name: item.productName,
      unit_amount: {
        currency_code: "USD",
        value: priceUsd.toFixed(2)
      },
      quantity: (quantities[item.id] || item.quantity).toString(),
      category: "PHYSICAL_GOODS" as const
    };
  });

  // Total PayPal
  const totalUsd = items.reduce((sum, item) => (
    sum + (Number(item.unit_amount.value) * Number(item.quantity))
  ), 0);

  // Total en moneda local (para registro interno)
  const total = cart.cartItems.reduce((sum, item) => {
    const price = item.offer && item.priceOffer ? item.priceOffer : item.price;
    return sum + (price * (quantities[item.id] || item.quantity));
  }, 0);
  

  return (
    <div className="max-h-[48vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <PayPalButtons
      style={{
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "checkout",
      }}
      forceReRender={[items, totalUsd]}
      createOrder={async () => {
        console.log("Creating PayPal order:", { items, totalUsd });
        try {
          const order = await createPayPalOrder(items, totalUsd);
          if (!order || !order.id) {
            throw new Error("Failed to create PayPal order");
          }
          return order.id;
        } catch (error) {
          console.error("Error creating PayPal order:", error);
          toast({
            title: "Error",
            description: "Error al crear la orden de PayPal",
            variant: "destructive"
          });
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          console.log("PayPal onApprove data:", data);
          
          const captureData = await capturePayPalOrder(data.orderID);
          console.log("PayPal capture result:", captureData);

          if (!captureData || captureData.status !== 'COMPLETED') {
            throw new Error(captureData.message || 'Error al procesar el pago');
          }

          const orderResult = await createOrder({
            items: cart.cartItems,
            total,
            paymentID: data.orderID,
            paymentState: "exito",
            state: "procesando",
            shippingAddres: captureData.purchase_units?.[0]?.shipping || {}
          });

          if (!orderResult) {
            throw new Error("Error al crear la orden");
          }

          await serverCleanCart();
          toast({
            title: "¡Compra exitosa!",
            description: "Tu orden ha sido procesada correctamente."
          });

          if (onSuccess) await onSuccess();
          router.push('/success');

        } catch (error) {
          console.error("Error:", error);
          toast({
            title: "Error",
            description: "Error procesando el pago",
            variant: "destructive"
          });
        }
      }}
    />
  </div>
);
}

"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder } from "@/data/actions/order-actions"; 
import { CartType } from "@/types/cart"; 
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface PayPalButtonProps {
  cart: CartType;
  quantities: { [key: string]: number };
  onSuccess?: () => void;
}

export default function PayPalButton({ cart, quantities, onSuccess }: PayPalButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const EXCHANGE_RATE = 1/4360.69;


  // Calculamos items primero
  const items = cart.cartItems.map(item => {
    const priceUsd = (item.offer && item.priceOffer ? item.priceOffer : item.price) * EXCHANGE_RATE;
    const quantity = quantities[item.id] || item.quantity;
    return {
      name: item.productName,
      unit_amount: {
        currency_code: "USD",
        value: priceUsd.toFixed(2)
      },
      quantity: quantity.toString()
    };
  });

  // Calculamos el total sumando (precio * cantidad) de cada item
  const totalUsd = items.reduce((sum, item) => {
    return sum + (parseFloat(item.unit_amount.value) * parseInt(item.quantity));
  }, 0).toFixed(2);

  // Calculamos el total en pesos colombianos
  const total = cart.cartItems.reduce((sum, item) => {
    const price = item.offer && item.priceOffer ? item.priceOffer : item.price;
    return sum + (price * (quantities[item.id] || item.quantity));
  }, 0);
  
  return (
    <div className="max-h-[48vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <PayPalButtons
      style={{
        layout: "vertical",
        color: "black",
        shape: "rect",
        label: "checkout",
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: "USD",
              value: totalUsd,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: totalUsd
                }
              }
            },
            items: items
          }],
          application_context: {
            shipping_preference: "NO_SHIPPING"
          }
        });
      }}
      onApprove={async (data, actions) => {
        try {
          const order = await actions.order?.capture();
          if (!order) throw new Error("No order data");

          await createOrder({
            items: cart.cartItems.map(item => ({
              ...item,
              quantity: quantities[item.id] || item.quantity
            })),
            total: total,
            paymentID: order.id ?? "",
            paymentState: "exito",
            state: "procesando",
            shippingAddres: order.purchase_units?.[0]?.shipping
          });

          if (onSuccess) await onSuccess();
          
          toast({
            title: "¡Compra exitosa!",
            description: "Tu orden ha sido procesada correctamente."
          });

          router.push("/success");
        } catch (error) {
          console.error("PayPal Error:", error);
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
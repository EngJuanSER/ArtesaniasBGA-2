"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CartType } from "@/types/cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serverUpdateCartItemQuantity, serverDeleteCartItem } from "@/data/actions/cart-actions";
import { useRouter } from "next/navigation";
import PayPalButton from "./paypal-button";



interface CartClientProps {
  cart: CartType | null;
}

export default function CartClient({ cart }: CartClientProps) {
  const EXCHANGE_RATE = 1/4360.69;
  const router = useRouter();
  const { toast } = useToast();
  const [localCart, setLocalCart] = useState<CartType | null>(cart);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [localQuantities, setLocalQuantities] = useState<{[key: string]: number}>(
    cart?.cartItems.reduce((acc, item) => ({ 
      ...acc, 
      [item.id]: item.quantity 
    }), {}) || {}
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!localCart) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-primary">
          Inicia sesión para ver tu carrito de compras
        </h2>
      </div>
    );
  }

  if (localCart.cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-primary">Tu carrito está vacío</h2>
      </div>
    );
  }

  const handleQuantityAdjust = (itemId: number, currentQuantity: number, increment: boolean) => {
    // Asegurar que currentQuantity sea número
    const current = Number(currentQuantity);
    const newQuantity = increment ? current + 1 : current - 1;
    
    if (newQuantity < 1 || newQuantity > 999) {
      toast({ description: "Cantidad inválida" }); 
      return;
    }
    
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };
  
  const handleConfirmPurchase = async () => {
    setIsUpdating(true);
    try {
      for (const [itemId, quantity] of Object.entries(localQuantities)) {
        console.log(`Actualizando item ${itemId} a cantidad ${quantity}`);
        
        const result = await serverUpdateCartItemQuantity(
          Number(itemId), 
          Number(quantity)
        );
  
        if (!result.ok) {
          throw new Error(`Error al actualizar item ${itemId}: ${result.error}`);
        }
      }
  
      // Log de la información de compra
      const purchaseInfo = localCart?.cartItems.map(item => ({
        productName: item.productName,
        quantity: localQuantities[item.id] || item.quantity,
        price: item.offer && item.priceOffer ? item.priceOffer : item.price,
        total: (item.offer && item.priceOffer ? item.priceOffer : item.price) * 
               Number(localQuantities[item.id] || item.quantity)
      }));
  
      console.log("Información de compra actualizada:", {
        items: purchaseInfo,
        totalCompra: calculateTotal(localCart?.cartItems || [], localQuantities)
      });
  
      toast({ 
        description: "Cantidades actualizadas correctamente",
        variant: "default"
      });
      
      setShowConfirmDialog(false);
    } catch (error: any) {
      console.error("Error en confirmación:", error);
      toast({ 
        description: error.message,
        variant: "default"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) return;
  
    setIsUpdating(true);
    try {
      const result = await serverDeleteCartItem(itemId);
      if (!result.ok) throw new Error(result.error);
  
      // Actualizar estado local del carrito
      setLocalCart(prev => prev ? {
        ...prev,
        cartItems: prev.cartItems.filter(item => item.id !== itemId)
      } : null);
      
      // Limpiar cantidad del item eliminado
      setLocalQuantities(prev => {
        const { [itemId]: removedQuantity, ...rest } = prev;
        return rest;
      });
  
      toast({ description: "Producto eliminado" });
    } catch (error: any) {
      toast({ description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 w-5/6 items-center justify-center mx-auto">
      <h1 className="text-2xl font-bold text-primary">Mi Carrito</h1>
      <ul className="divide-y bg-popover p-4 px-14 rounded-xl">
        {localCart?.cartItems.map((item) => (
          <li key={item.id} className="py-6 flex items-center gap-4 text-primary">
            <div className="relative w-44 h-44">
              <Image
                src={item.images?.[0]?.url || "/placeholder.png"}
                alt={item.productName}
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
            
            <div className="flex-1 p-8">
                <h3 onClick={() => router.push(`/product/${item.productSlug}`)} className="w-max font-medium text-2xl cursor-pointer hover:text-white transition-colors duration-100">
                {item.productName.split("").map((char, index) => (
                  <span
                  key={index}
                  className="inline-block transition-colors duration-100"
                  style={{ transitionDelay: `${index * 35}ms` }}
                  >
                  {char === " " ? "\u00A0" : char}
                  </span>
                ))}
                </h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityAdjust(item.id, localQuantities[item.id] || item.quantity, false)}
                    disabled={isUpdating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                
                  <span className="w-12 text-center font-medium">
                    {localQuantities[item.id] || item.quantity}
                  </span>
                
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityAdjust(item.id, localQuantities[item.id] || item.quantity, true)}
                    disabled={isUpdating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-medium text-2xl">
                ${item.offer && item.priceOffer
                  ? (item.priceOffer * (localQuantities[item.id] || item.quantity)).toFixed(2)
                  : (item.price * (localQuantities[item.id] || item.quantity)).toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="py-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-primary">
          Total: ${calculateTotal(localCart?.cartItems || [], localQuantities)}
        </span>
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogTrigger asChild>
            <Button 
              disabled={isUpdating || !localCart?.cartItems.length}
              className="bg-primary hover text-muted"
            >
              Comprar Ahora
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Confirmar Compra</DialogTitle>
              <DialogDescription>
                Por favor revisa tu orden antes de proceder al pago
              </DialogDescription>
            </DialogHeader>
                      
            {/* Resumen de productos */}
            <div className="space-y-2 py-4">
                {localCart?.cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productName} × {localQuantities[item.id] || item.quantity}</span>
                    <span>
                      ${
                        (
                          (item.offer && item.priceOffer ? item.priceOffer : item.price) *
                          (localQuantities[item.id] || item.quantity)
                        ).toFixed(2)
                      }
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total (USD):</span>
                    <span>
                    ${(
                      Number(calculateTotal(localCart?.cartItems, localQuantities)) *
                      EXCHANGE_RATE
                    ).toFixed(2)}
                    </span>
                </div>
              </div>

              {/* Botón de PayPal */}
              <PayPalButton
                cart={localCart}
                quantities={localQuantities}
                onSuccess={() => {
                  setShowConfirmDialog(false);
                  setLocalCart(null);
                }}
              />

              <Button className="bg-gray-400 hover:bg-gray-800" variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Volver al Carrito
              </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function calculateTotal(items: CartType['cartItems'], quantities: {[key: string]: number}) {
  return items.reduce((sum, item) => {
    const price = item.offer && item.priceOffer ? item.priceOffer : item.price;
    const quantity = quantities[item.id] || item.quantity;
    return sum + (price * quantity);
  }, 0).toFixed(2);
}
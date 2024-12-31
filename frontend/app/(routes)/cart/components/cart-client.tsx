"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CartType } from "@/types/cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { serverUpdateCartItemQuantity, serverDeleteCartItem } from "@/data/actions/cart-actions";



interface CartClientProps {
  cart: CartType | null;
}

export default function CartClient({ cart }: CartClientProps) {
  const { toast } = useToast();
  const [localCart, setLocalCart] = useState<CartType | null>(cart);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [localQuantities, setLocalQuantities] = useState<{[key: string]: number}>({});

  if (!localCart) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">
          Inicia sesión para ver tu carrito de compras
        </h2>
      </div>
    );
  }

  if (localCart.cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
      </div>
    );
  }

  const handleQuantityAdjust = async (cartItemId: number, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1 || newQuantity > 999) {
      toast({ description: "Cantidad inválida" }); 
      return;
    }
  
    setIsUpdating(true);
    try {
      const result = await serverUpdateCartItemQuantity(cartItemId, newQuantity);
      
      if (!result.ok) {
        throw new Error(result.error);
      }
  
      setLocalCart(result.data);
      toast({ description: "Cantidad actualizada" });
    } catch (error: any) {
      toast({ description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };
  

  
  const handleDeleteItem = async (cartItemId: number) => {
    if (!cartItemId) return toast({ description: "Slug inválido" });

    setIsUpdating(true);
    try {
      const result = await serverDeleteCartItem(cartItemId);
      
      if (!result.ok) {
        throw new Error(result.error);
      }

      setLocalCart(result.data);
      toast({ description: "Producto eliminado" });
    } catch (error: any) {
      toast({ description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Mi Carrito</h1>
      <ul className="divide-y">
        {localCart?.cartItems.map((item) => (
          <li key={item.id} className="py-6 flex items-center gap-4">
            <div className="relative w-24 h-24">
              <Image
                src={item.images?.[0]?.url || "/placeholder.png"}
                alt={item.productName}
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-lg">{item.productName}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityAdjust(item.id, item.quantity, false)}
                    disabled={isUpdating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                
                  <span className="w-12 text-center">{item.quantity}</span>
                
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityAdjust(item.id, item.quantity, true)}
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
                  <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-medium text-lg">
                ${item.offer && item.priceOffer
                  ? (item.priceOffer * item.quantity).toFixed(2)
                  : (item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="py-4 text-right">
        <span className="text-lg font-bold">
          Total: ${localCart?.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
"use client";

import { CartType } from "@/types/cart";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  cart: CartType | null;
}

export default function CartClient({ cart }: Props) {
  const { toast } = useToast();
  const [localCart, setLocalCart] = useState<CartType | null>(cart);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast({
        title: "Error",
        description: "La cantidad debe ser al menos 1.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      const authToken = localStorage.getItem("authToken"); // Asegúrate de almacenar el token correctamente
      if (!authToken) {
        toast({
          title: "Error",
          description: "No autenticado",
          variant: "destructive"
        });
        setIsUpdating(false);
        return;
      }

      const response = await fetch(`https://tu-dominio.com/api/cart-items/${cartItemId}`, { // Reemplaza con tu dominio y ruta correcta
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No se pudo actualizar la cantidad");
      }

      const data = await response.json();

      setLocalCart({
        ...localCart,
        total: data.total,
        cartItems: data.cartItems.map((item: any) => ({
          id: item.id, // ID del CartItem
          productId: item.product.id,
          productName: item.product.productName,
          price: item.product.offer ? item.product.priceOffer : item.product.price,
          quantity: item.quantity,
          offer: item.product.offer,
          priceOffer: item.product.priceOffer
        }))
      });

      toast({
        title: "Actualizado",
        description: "Cantidad actualizada en el carrito"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la cantidad",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Mi Carrito</h1>
      <ul className="divide-y">
        {localCart.cartItems.map((item) => (
          <li key={item.id} className="py-4 flex justify-between items-center">
            <div>
              <span className="text-lg font-medium">{item.productName}</span>
              <div className="flex items-center space-x-2 mt-1">
                <label htmlFor={`quantity-${item.id}`} className="text-sm">Cantidad:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  name="quantity"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  className="border rounded px-2 py-1 w-16"
                  disabled={isUpdating}
                />
              </div>
            </div>
            <span className="font-medium">
              ${item.offer && item.priceOffer ? (item.priceOffer * item.quantity).toFixed(2) : (item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="py-4 text-right">
        <span className="text-lg font-bold">
          Total: ${localCart.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
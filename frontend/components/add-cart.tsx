"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { serverAddToCartAction } from "@/data/actions/cart-actions";
import { useActionState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const INITIAL_CART_STATE = {
  ok: false,
  error: null,
};

interface AddToCartButtonProps {
  productSlug: string;
}

export function AddToCartButton({ productSlug }: AddToCartButtonProps) {
  const [cartState, formAction] = useActionState(
    serverAddToCartAction,
    INITIAL_CART_STATE
  );

  useEffect(() => {
    if (cartState.ok) {
      toast({
        description: "Producto agregado al carrito",
        variant:"default",
        duration: 1000,
      });
    } else if (cartState.error) {
      toast({
        description: cartState.error,
        variant: "default",
      });
    }
  }, [cartState]);

  return (
    <form action={formAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="quantity" value="1" />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="rounded-full bg-white dark flex items-center text-muted border shadow-md p-2 hover:scale-110 transition"
        aria-label="Añadir al carrito"
      >
        <ShoppingCart size={20} />
      </Button>
    </form>
  );
}
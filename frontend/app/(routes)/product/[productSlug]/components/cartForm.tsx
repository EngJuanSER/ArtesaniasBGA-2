"use client";

import { serverAddToCartAction } from "@/data/actions/cart-actions";
import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";

const INITIAL_CART_STATE = {
  ok: false,
  error: null,
};

interface AddToCartFormProps {
  productSlug: string;
}

export function AddToCartForm({ productSlug }: AddToCartFormProps) {
  const [cartState, formAction] = useActionState(
    serverAddToCartAction,
    INITIAL_CART_STATE
  );

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) setQuantity(value);
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <div className="flex items-center space-x-2 mb-2">
        <label htmlFor="quantity" className="text-sm">Cantidad:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="border rounded px-2 py-1 w-16"
        />
      </div>
      <SubmitButton text="Agregar al Carrito" loadingText="Cargando" />
      {cartState.error && (
        <p className="text-red-500 text-sm mt-2">Error: {cartState.error}</p>
      )}
    </form>
  );
}
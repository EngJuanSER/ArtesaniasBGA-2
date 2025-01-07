"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { serverAddToWishlist } from "@/data/actions/wishlist-actions";

const INITIAL_STATE = {
    ok: false,
    error: null,
  };
  

interface WishlistFormProps {
  productSlug: string;
}

export function WishlistForm({ productSlug }: WishlistFormProps) {
  const { toast } = useToast();
  const [wishlistState, formAction] = useActionState(
    serverAddToWishlist,
    INITIAL_STATE
  );

  useEffect(() => {
    if (wishlistState.ok) {
      toast({
        description: "Producto agregado a favoritos",
        variant:"default",
      });
    } else if (wishlistState.error) {
      toast({
        description: wishlistState.error,
        variant: "default",
      });
    }
  }, [wishlistState, toast]);

  return (
    <form action={formAction}>
      <input type="hidden" name="productSlug" value={productSlug} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Heart
          width={30}
          strokeWidth={1}
          className="transition duration-300 hover:fill-primary"
        />
      </Button>
    </form>
  );
}
"use client";

import { useState } from "react";
import { WishlistType } from "@/types/wishlist";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { Trash2 } from "lucide-react";
import { serverRemoveFromWishlist } from "@/data/actions/wishlist-actions";

interface WishlistClientProps {
  wishlist: WishlistType | null;
}

export default function WishlistClient({ wishlist }: WishlistClientProps) {
  const { toast } = useToast();
  const [localWishlist, setLocalWishlist] = useState<WishlistType | null>(wishlist);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!localWishlist) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-primary">
          Inicia sesión para ver tu lista de deseos
        </h2>
      </div>
    );
  }

  if (!localWishlist?.wishItems?.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Tu lista de deseos está vacía</h2>
      </div>
    );
  }
  
  const handleDeleteProduct = async (wishItemId: number) => {
    if (!wishItemId) return;
  
    setIsUpdating(true);
    try {
      const result = await serverRemoveFromWishlist(wishItemId);
      if (!result.ok) throw new Error(result.error);
  
      setLocalWishlist(prev => prev ? {
        ...prev,
        wishItems: prev.wishItems.filter(item => item.id !== wishItemId)
      } : null);
      
      toast({ description: "Producto eliminado de favoritos" });
    } catch (error: any) {
      toast({ description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Mis Favoritos</h1>
      <ul className="divide-y bg-popover p-4 pr-8 rounded-xl">
        {localWishlist.wishItems.map((item) => (
          <li key={item.id} className="py-6 flex items-center gap-4">
              <div className="relative w-24 h-24">
              <Image
                src={item.product.images?.[0]?.url || "/placeholder.png"}
                alt={item.product.productName}
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-lg">{item.product.productName}</h3>
              <p className="text-sm text-muted-foreground">
                {item.product.offer 
                  ? formatPrice(item.product.priceOffer!) 
                  : formatPrice(item.product.price)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteProduct(item.id)}
                disabled={isUpdating}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
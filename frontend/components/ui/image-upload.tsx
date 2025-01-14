"use client";

import { useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      
      if (!file) {
        throw new Error('No se seleccionó ningún archivo');
      }

      // Validaciones
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagen muy grande (máx 5MB)');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten imágenes');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Error al obtener URL');
      }

      onChange(urlData.publicUrl);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al subir imagen"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
              className="absolute z-10 top-2 right-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <img
              className="w-full h-full object-cover"
              alt="Product image"
              src={url}
            />
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          disabled={disabled || loading}
          variant="secondary"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {loading ? "Subiendo..." : "Subir Imagen"}
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
}
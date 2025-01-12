"use client";

import { useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // Generar nombre único para la imagen
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError); // Debug
          throw uploadError;
        }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      console.log('URL data:', urlData); // Debug


      if (urlData?.publicUrl) {
        onChange(urlData.publicUrl);
      } else {
        throw new Error('No se pudo obtener la URL pública');
      }
  

    } catch (error) {
      console.error('Error uploading:', error);
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
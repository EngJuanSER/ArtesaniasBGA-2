"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageType, ProductType } from "@/types/product";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/services/apiService";
import { useGetCategories } from "@/hooks/useGetCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serverCreateProduct, serverUpdateProduct } from "@/data/actions/product-actions";


const origins = [
  "Usaquén",
  "Chapinero",
  "Santa Fe",
  "San Cristóbal",
  "Usme",
  "Tunjuelito",
  "Bosa",
  "Kennedy",
  "Fontibón",
  "Engativá",
  "Suba",
  "Barrios Unidos",
  "Teusaquillo",
  "Los Mártires",
  "Antonio Nariño",
  "Puente Aranda",
  "La Candelaria",
  "Rafael Uribe Uribe",
  "Ciudad Bolívar",
  "Sumapaz"
];

const formSchema = z.object({
  productName: z.string().min(1, "Nombre requerido"),
  description: z.string().min(1, "Descripción requerida"),
  price: z.number().min(0, "Precio debe ser mayor a 0"),
  stock: z.number().min(0, "Stock debe ser mayor o igual a 0"),
  origin: z.string().min(1, "Origen requerido"),
  category: z.number().nullable(),
  active: z.boolean(),
  images: z.array(z.custom<ImageType>()).optional(),
});

interface ProductFormProps {
  product?: ProductType | null;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
      const { toast } = useToast(); 
      const { result: categories } = useGetCategories();
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {
          ...product,
          category: product.category?.id || null,
          price: Number(product.price),
          stock: Number(product.stock),
        } : {
          productName: "",
          description: "",
          price: 0,
          stock: 0,
          origin: "",
          category: null,
          active: true,
          images: [],
        },
      });
  
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const productData: Partial<ProductType> = {
            ...values,
            slug: values.productName.toLowerCase().replace(/ /g, '-'),
            stock: BigInt(values.stock),
            images: values.images?.map(img => ({
              ...img,
              url: img.url,
            })) as ImageType[],
            category: values.category ? { id: values.category, slug: '', categoryName: '' } : null
          };

          if (product) {
            const result = await serverUpdateProduct(product.id, productData);
            if (!result.ok) throw new Error(result.error || "Error al actualizar");
            toast({
              title: "Éxito",
              description: "Producto actualizado correctamente",
            });
          } else {
            const result = await serverCreateProduct(productData);
            if (!result.ok) throw new Error(result.error || "Error al crear");
            toast({
              title: "Éxito",
              description: "Producto creado correctamente",
            });
          }
          onClose();
          window.location.reload();
        } catch (error: any) {
          console.error('Form error:', error);
          toast({
            title: "Error",
            description: error.message || "Error al guardar el producto",
            variant: "destructive",
          });
        }
      };
  
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product ? "Editar Producto" : "Crear Producto"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origen</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un origen" />
                        </SelectTrigger>
                        <SelectContent>
                          {origins.map((origin) => (
                            <SelectItem key={origin} value={origin}>
                              {origin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id.toString()}
                            >
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
  
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Activo</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imágenes</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value?.map(image => 
                          image.url.startsWith('http') 
                            ? image.url 
                            : `${API_BASE_URL}${image.url}`
                        ) || []}
                        onChange={(url) => field.onChange([...(field.value || []), { url }])}
                        onRemove={(url) => field.onChange(
                          field.value?.filter(image => 
                            (image.url.startsWith('http') ? image.url : `${API_BASE_URL}${image.url}`) !== url
                          ) || []
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {product ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
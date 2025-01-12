"use client";

import { useGetAllProducts } from "@/hooks/useGetAllProducts";
import { ProductType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProductForm } from "./product-form";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export function ProductList() {
  const { result: products, loading } = useGetAllProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  console.log(products);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={products || []}
        onRowClick={(row) => setSelectedProduct(row)}
      />

      {/* Modal/Dialog para crear/editar producto */}
      {(selectedProduct || isCreating) && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
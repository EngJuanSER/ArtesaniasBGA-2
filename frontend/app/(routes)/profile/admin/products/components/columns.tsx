"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductType } from "@/types/product";
import { serverDeleteProduct } from "@/data/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";


export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "productName",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "origin",
    header: "Origen",
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => (row.getValue("active") ? "Activo" : "Inactivo"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const product = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={async (e) => {
            e.stopPropagation();
            if (confirm("¿Estás seguro de eliminar este producto?")) {
              try {
                const result = await serverDeleteProduct(product.slug);
                if (!result.ok) throw new Error(result.error || 'Error desconocido');
                window.location.reload();
              } catch (error: any) {
                console.error("Error al eliminar:", error);
                toast({
                  title: "Error",
                  description: error.message || "Error al eliminar el producto",
                  variant: "destructive",
                });
              }
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
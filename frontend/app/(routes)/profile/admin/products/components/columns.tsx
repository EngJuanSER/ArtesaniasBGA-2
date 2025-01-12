"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductType } from "@/types/product";


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
];
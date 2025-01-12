import { ProductList } from "./components/product-list";

export default function AdminProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
      </div>
      <ProductList />
    </div>
  );
}
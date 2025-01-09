"use client"

import { useGetProductBySlug } from "@/hooks/useGetProductBySlug";
import { useParams } from "next/navigation"
import SkeletonProduct from "./components/skeleton-product";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const { result, loading, error } = useGetProductBySlug(params.productSlug || "");
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    color: "",
    size: "",
    material: "",
    details: "",
    quantity: "",
    referenceProduct: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí se manejará el envío del formulario
    console.log("Formulario enviado:", formData);
    setShowDialog(false);
  };

  if (loading || !result) {
    return <SkeletonProduct />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="max-w-6xl py-4 px-16 mx-auto sm:py-16 sm:px-10 lg:min-h-[80vh]">
      <div className="grid sm:grid-cols-2">
        <div>
          <CarouselProduct images={{ data: result[0].images }} />
        </div>

        <div className="sm:px-12 relative min-h-[400px]">
          <InfoProduct product={result[0]} />
          <button
          className="absolute text-popover bottom-0 right-0 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          onClick={() => setShowDialog(true)}
          >
            Consultar Producto Similar
          </button>
        </div>
      </div>

      {showDialog && (
      <div className="pt-8 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg my-8">
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 dark:text-black ">Consulta Producto Similar</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color deseado</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tamaño deseado</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Material preferido</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cantidad deseada</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Detalles específicos</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mensaje adicional</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full dark:bg-white text-black"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDialog(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Enviar consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
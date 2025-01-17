"use client";

import { useGetCategories } from "@/hooks/useGetCategories"; 
import { ResponseType } from "@/types/response";
import { CategoryType } from "@/types/category";
import Link from "next/link";


const ChooseCategory = () => {
  const { result, loading, error }: ResponseType<CategoryType> = useGetCategories();

  if (loading) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <h3 className="px-6 pb-4 text-3xl sm:pb-8">Elige tu categoría favorita</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
          <div className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
          <div className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <h3 className="px-6 pb-4 text-3xl sm:pb-8">Elige tu categoría favorita</h3>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-0 sm:px-24">
      <h3 
        className="w-max px-6 pb-4 font-semibold text-3xl sm:pb-8 text-primary hover:text-white transition-colors duration-100"
        aria-label="Elige tu categoría favorita"
        onMouseEnter={() => {}}
      >
        {"Elige tu categoría favorita".split("").map((char: string, index: number) => (
          <span 
        key={index}
        className="inline-block transition-colors duration-100"
        style={{ transitionDelay: `${index * 25}ms` }}
          >
        {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h3>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {result !== null &&
          result.map((category: CategoryType) => {
            if (!category.slug || !category.categoryName) {
              console.warn(`La categoría con id ${category.id} tiene datos incompletos.`);
              return null;
            }

            const imageUrl = category.mainImage?.url.startsWith('http')
              ? category.mainImage.url
              : `${process.env.NEXT_PUBLIC_BACKEND_URL}${category.mainImage?.url}`;

            return (
                <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg"
                >
                <img
                  src={imageUrl}
                  alt={category.categoryName}
                  className="w-full h-full object-cover transition duration-300 ease-in-out rounded-lg hover:scale-110"
                />
                <p className="absolute w-full py-2 text-lg font-bold text-center text-white bottom-5 backdrop-blur-lg">
                  {category.categoryName}
                </p>
                </Link>
            );
          })}
      </div>
    </div>
  );
};

export default ChooseCategory;
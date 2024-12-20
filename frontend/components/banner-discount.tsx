'use client'

import Link from "next/link";
import { buttonVariants } from "./ui/button";

const BannerDiscount = () => {
    return (
        <div className="p-5 sm:p-10 text-center">
            <h2 
              className="w-max mx-auto px-6 uppercase font-black text-2xl text-primary hover:text-white  transition-colors duration-100"
              onMouseEnter={() => {}}
            >
              {"Consigue hasta un -25%".split("").map((char: string, index: number) => (
                <span 
                  key={index}
                  className="inline-block transition-colors duration-100"
                  style={{ transitionDelay: `${index * 25}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <p className="text-primary-700">En todos los productos en oferta de la tienda</p>
            <div className="max-w-md mx-auto sm:flex justify-center gap-8 mt-5">
                <Link href="offers" className={`${buttonVariants()} dark:text-accent hover:opacity-80`}>Comprar</Link>
            </div>
        </div>
    );
}

export default BannerDiscount;
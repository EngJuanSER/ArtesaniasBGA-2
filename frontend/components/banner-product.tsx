import Link from "next/link";
import { buttonVariants } from "./ui/button";

const BannerProduct = () => {
    return (
        <>
            <div className="pt-16 mt-4 text-center">
                <p>Descubre la belleza de las artesanías</p>
                <h4 className="mt-2 text-5xl font-extrabold uppercase">Artesanías únicas</h4>
                <p className="my-2 text-lg">Añade un toque único a tu hogar</p>
                <Link href="shop" className={buttonVariants()}>Comprar</Link>
            </div>
            <div className="h-[350px] bg-cover lg:h-[600px] bg-[url('/artesanias-image.jpg')] dark:bg-[url('/artesanias-image2.jpg')] bg-center mt-5" />
        </>
    );
}

export default BannerProduct;
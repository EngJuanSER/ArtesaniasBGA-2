import Link from "next/link";
import { Separator } from "./ui/separator";

const Footer = () => {
    return (
        <footer className="mt-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <Separator className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

                <span className="block text-primary text-gray-500 sm:text-center dark:text-primary">
                    &copy; 2024
                    <Link href="#"> ArtesaniasBGA.</Link>
                </span>
            </div>
        </footer>
    );
}

export default Footer;
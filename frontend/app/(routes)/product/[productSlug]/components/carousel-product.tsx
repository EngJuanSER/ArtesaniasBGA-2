/* eslint-disable @next/next/no-img-element */
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
  } from "@/components/ui/carousel";
  
  interface CarouselProductProps {
    images: {
      data: {
        id: number;
        url: string;
      }[];
    };
  }
  
  const CarouselProduct = (props: CarouselProductProps) => {
    const { images } = props;
  
    console.log(images);

    return (
      <div className="sm:px-16">
        <Carousel>
          <CarouselContent>
            {images.data.map((image) => (
                <CarouselItem key={image.id}>
                <img
                  src={image.url.startsWith('http') ? image.url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${image.url}`}
                  alt="Image product"
                  className="rounded-lg w-full"
                />
                </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  };
  
  export default CarouselProduct;
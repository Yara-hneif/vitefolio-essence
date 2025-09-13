import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";

interface CarouselProps {
  images: string[];
  className?: string;
}

export default function Carousel({ images, className }: CarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-muted rounded-lg">
        <span className="text-muted-foreground">No images</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1 }, // mobile
          640: { slidesPerView: 2 }, // tablet
          1024: { slidesPerView: 3 }, // desktop
        }}
        className="rounded-lg"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="rounded-lg object-cover w-full h-64"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// ZofyCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { useInView } from "react-intersection-observer";

const data = [
  { title: "Clear your mind, unlock your vision.", desc: "Zofy helps you cut through mental clutter by prioritizing what truly matters. With personalized guidance, you’ll experience the clarity needed to focus on your goals without distractions." },
  { title: "Master the art of fulfillment.", desc: "Zofy aligns your daily actions with your personal values, ensuring that success doesn’t just look good—it feels meaningful and deeply satisfying." },
  { title: "Do more of what drives results.", desc: "Zofy optimizes your time by identifying high-impact tasks and aligning them with your goals. Stop wasting energy on busywork and start making meaningful progress." },
  { title: "Feel energized to take on anything.", desc: "By integrating habits that boost energy and reduce stress, Zofy ensures you stay physically and mentally fueled to achieve your aspirations." },
  { title: "Stay inspired, no matter what.", desc: "Through tailored encouragement and actionable insights, Zofy keeps you motivated—even on tough days—by showing how every step contributes to your big picture." },
];

const ZofyCarousel = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="py-20 pl-16 bg-white ">
      <h2 className="text-2xl md:text-4xl max-w-lg w-full font-bold mb-6 px-4">
        Everything You Need to Achieve Your Full Potential
      </h2>
      <p className="text-gray-600 mb-12 px-4 max-w-2xl ">
        Zofy empowers you to turn ambitions into achievements with a personalized, holistic approach to growth. By addressing mental clarity, alignment, energy, and motivation, Zofy transforms the way you pursue your goals, ensuring you stay focused, fulfilled, and inspired every step of the way.
      </p>

      {inView && (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
  <div className="bg-gray-100 rounded-xl shadow-md p-6 h-[200px] flex flex-col justify-start items-start transition-transform duration-500 hover:scale-105">
    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
    <p className="text-gray-600 overflow-hidden text-ellipsis">{item.desc}</p>
  </div>
</SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ZofyCarousel;

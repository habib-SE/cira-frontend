import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Carousel1 from '../../assets/Carousel1.jpg';
import Carousel2 from '../../assets/Carousel 2.jpeg';
import Carousel3 from '../../assets/carousel 3 .jpeg';

export default function HowCiraWorksSection() {
  const steps = [
    {
      number: "01",
      description: "Cira AI Nurse asks about your symptoms through natural conversation.",
      highlight: "asks about your symptoms",
    },
    {
      number: "02",
      description: "Gather comprehensive information including medical history, symptoms, and health data.",
      highlight: "Gather comprehensive information",
    },
    {
      number: "03",
      description: "Receive a detailed summary with patient info, measurements, top 3 conditions, confidence above 85%, and self-care tips.",
      highlight: "detailed summary",
    },
    {
      number: "04",
      description: "Download two reports: Doctor report (reduces inquiry time) and SOAP notes for medical documentation.",
      highlight: "two reports",
    },
  ];

  // Carousel images
  const carouselImages = [
   
    { id: 1, src: Carousel2, alt: 'Step 2 - Health Consultation' },
    { id:3, src: Carousel1, alt: 'Step 1 - Cira AI Nurse' },
    { id: 2, src: Carousel3, alt: 'Step 3 - SOAP Notes Report' },
 
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span 
          key={index} 
          className="text-pink-600 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.section
      className="relative py-8 md:py-12 lg:py-32 px-4 md:px-6 overflow-hidden bg-white"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-0 text-xl xs:text-2xl sm:text-2xl md:text-5xl font-serif font-normal text-gray-950 tracking-wide text-center flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            How <span className="text-pink-400 relative inline-flex items-center whitespace-nowrap">Cira</span> Works
          </h2>
          <p className="mt-2 pl-2 text-[9px] md:text-[14px] text-gray-600 font-normal leading-5 md:leading-6">
            Get health insights in just a few simple steps
          </p>
        </motion.div>

        {/* Two Column Layout: Steps on Left, Carousel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Steps List */}
          <motion.div 
            className="flex flex-col gap-4 md:gap-6"
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className={`flex flex-col gap-1 md:gap-2 ${index === 0 ? 'mt-0 md:mt-4' : ''}`}
              >
                {/* Number - on separate row with gradient */}
                <motion.div
                  className="text-3xl md:text-4xl font-bold leading-none"
                  variants={numberVariants}
                >
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                    {step.number}
                  </span>
                </motion.div>

                {/* Description */}
                <motion.div 
                  className="flex-1 min-w-0"
                  variants={textVariants}
                >
                  <p 
                    className=" pl-2 text-[9px] md:text-[14px] text-gray-600 font-normal leading-5 md:leading-6"
                  >
                    {highlightText(step.description, step.highlight)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full carousel-container rounded-2xl shadow-[0_8px_40px_rgba(236,72,153,0.15)] p-2 bg-white"
          >
            <style>{`
              .carousel-container .swiper-button-next,
              .carousel-container .swiper-button-prev {
                width: 48px;
                height: 48px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                color: #ec4899;
                transition: all 0.3s ease;
              }
              .carousel-container .swiper-button-next {
                right: 5px;
              }
              .carousel-container .swiper-button-prev {
                left: 5px;
              }
              .carousel-container .swiper-button-next:hover,
              .carousel-container .swiper-button-prev:hover {
                background: linear-gradient(to right, #ec4899, #a855f7);
                color: white;
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
                transform: scale(1.1);
              }
              .carousel-container .swiper-button-next:active,
              .carousel-container .swiper-button-prev:active {
                transform: scale(0.95);
              }
              .carousel-container .swiper-button-next::after,
              .carousel-container .swiper-button-prev::after {
                font-size: 20px;
                font-weight: bold;
              }
              .carousel-container .swiper-button-disabled {
                opacity: 0.35;
                cursor: not-allowed;
              }
              .carousel-container .swiper-pagination-bullet {
                width: 10px;
                height: 10px;
                background: #d1d5db;
                opacity: 1;
                transition: all 0.3s ease;
              }
              .carousel-container .swiper-pagination-bullet-active {
                background: linear-gradient(to right, #ec4899, #a855f7);
                width: 24px;
                border-radius: 5px;
              }
            `}</style>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              navigation={true}
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {carouselImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div 
                    className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden bg-white"
                    
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

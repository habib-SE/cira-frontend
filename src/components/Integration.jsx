import React from "react";
import { motion } from "framer-motion";

const integrationCards = [
  {
    label: "Mobile App",
    heading: "Stay connected anywhere.",
    image:
      "https://framerusercontent.com/images/tgU4QYB4cWD482On8OPJkNxSRvI.png?scale-down-to=2048",
  },
  {
    label: "Apple Watch",
    heading: "Designed for your daily rhythm.",
    image: "https://framerusercontent.com/images/kJGS0xo3qec6aFVnncQDuik9v0.png",
  },
  {
    label: "Browser Extension",
    heading: "Displayed where it matters most.",
    image: "https://framerusercontent.com/images/g1u7u0Y3f8cp9GqLd8TwQVgyRc.png",
  },
];

export default function IntegrationScrollSection() {
  return (
    <div className="relative w-full flex bg-white">
      {/* Sticky Left Section */}
      <div className="w-[40%] sticky top-0 h-[35vh] flex flex-col gap-6 px-20 py-20 z-10">
        <a
          className="bg-[#ECE0D9] rounded-md px-4 py-1 w-fit text-sm font-medium text-[#1a1a1a]"
          href="#"
        >
          Integration
        </a>
        <h4 className="text-left text-3xl md:text-5xl font-bold text-[#1a1a1a] leading-snug">
          Zofy seamlessly integrates <br /> into your routine.
        </h4>
      </div>

      {/* Scrollable Cards Section */}
      <div className="w-[60%] mt-1">
        <div className="flex flex-col">
          {integrationCards.map((item, index) => {
            const isMiddle = index === 1;
            const isSideCard = index === 0 || index === 2;

            return (
              <section
                key={index}
                className={`w-[80vh] h-screen bg-cover bg-center rounded-2xl shadow-lg relative ${
                  isMiddle ? "ml-[-25vw]" : isSideCard ? "ml-[12vw]" : ""
                } ${index !== 0 ? "mt-[1vh]" : ""}`}
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              >
                <div
                  className={`p-12 flex flex-col h-full ${
                    isMiddle ? "justify-center" : "justify-end"
                  }`}
                >
                  <motion.p
                    className="text-white text-xs bg-blue-300 rounded-md px-4 py-1 w-fit font-medium tracking-wide capitalize"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.label}
                  </motion.p>

                  <motion.h2
                    className="text-white text-3xl md:text-5xl font-semibold leading-snug"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    {item.heading}
                  </motion.h2>
                </div>
              </section>
            );
          })}
        </div>
        
        {/* Next Section Placeholder - this will appear after last card scrolls up */}
        <div className="h-[10vh] w-full bg-white"></div>
      </div>
    </div>
  );
}
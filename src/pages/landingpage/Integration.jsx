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

export default function IntegrationSection() {
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
                <motion.section
                key={index}
                initial={{ rotateY: 80, opacity: 0 }}
                whileInView={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className={`w-[80vh] h-screen bg-cover bg-center rounded-2xl shadow-lg relative transform-style-preserve-3d ${
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
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Next Section Placeholder */}
        <div className="h-[10vh] w-full bg-white"></div>
      </div>
    </div>
  );
}
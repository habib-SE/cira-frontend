import React from "react";
import { motion } from "framer-motion";

export default function ExperienceSection() {
  return (
    <section className="w-full  px-4 py-20 flex justify-center items-center h-screen">
      <div className="w-full max-w-full h-full rounded-3xl overflow-hidden relative">
        {/* Background layer (blurred) */}
        <div
          className="w-full h-full bg-cover bg-center blur-md scale-105"
          style={{
            backgroundImage: `url('https://framerusercontent.com/images/XsMhAXmXhYfj9Yl5DCy1TmLzRk.webp')`,
            height: "100vh",
          }}
        />
        {/* Foreground content layer */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/65 backdrop-blur-md rounded-3xl p-10 flex flex-col justify-center items-center space-y-10"
        >
          {/* Heading */}
          <motion.h2
            className="text-white text-center text-4xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Be among the first to experience the <br /> future of personal growth
          </motion.h2>
          {/* CTA Button */}
          <motion.a
            href="./waitlist"
            className="bg-white text-black font-medium px-6 py-2 rounded-full border border-black"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Join Beta Testing
          </motion.a>
          {/* Cards + Count */}
          <div className="flex justify-center items-center flex-wrap">
            {[
              "https://framerusercontent.com/images/ogQiH9aNZVAabZoZUF7AxzDY2kc.png",
              "https://framerusercontent.com/images/QTJxQZNRWkSqhw9lcGnMZtxOL10.png",
              "https://framerusercontent.com/images/IwYGDkOmGG0pHDFv6guT58q4H9w.png",
            ].map((src, index) => (
              <div key={index} className="w-14 h-14 rounded-full overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-14 h-14 rounded-full bg-[#594FEE] text-white text-sm font-medium">
              <p className="mt-5 ml-2">+1000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import React from "react";

export default function ExperienceSection() {
  return (
    <section className="w-full px-4 py-20 flex justify-center items-center h-screen">
      <div className="w-full max-w-full h-full rounded-3xl overflow-hidden relative">
        {/* Background layer (blurred) */}
        <div
          className="w-full h-full bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://framerusercontent.com/images/XsMhAXmXhYfj9Yl5DCy1TmLzRk.webp')`,
            height: "100vh",
          }}
        />
        {/* Foreground content layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/75 rounded-3xl p-10 flex flex-col justify-center items-center space-y-10">
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
          <div className="flex justify-center items-center relative">
            <div className="flex">
              {[
                "https://framerusercontent.com/images/ogQiH9aNZVAabZoZUF7AxzDY2kc.png",
                "https://framerusercontent.com/images/QTJxQZNRWkSqhw9lcGnMZtxOL10.png",
                "https://framerusercontent.com/images/IwYGDkOmGG0pHDFv6guT58q4H9w.png",
              ].map((src, index) => (
                <motion.div 
                  key={index} 
                  className="w-14 h-14 rounded-full overflow-hidden border-2 border-white"
                  style={{
                    marginLeft: index > 0 ? '-12px' : '0',
                    zIndex: 3 - index
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="w-14 h-14 rounded-full bg-[#594FEE] text-white text-sm font-medium flex items-center justify-center border-2 border-white"
              style={{
                marginLeft: '-12px',
                zIndex: 0
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              +1000
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
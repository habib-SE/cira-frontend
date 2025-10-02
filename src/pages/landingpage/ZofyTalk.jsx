import React from 'react';

export default function ZofyTalk() {
  return (
    <section className="p-6 rounded-2xl">
      <div
        className="w-full min-h-screen flex flex-col justify-between bg-cover bg-center rounded-2xl"
        style={{
          backgroundImage: `url('https://framerusercontent.com/images/FCP1RxmFvT5P0zqmYcdcQHEl1I.png')`,
        }}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center justify-center text-center px-4 pt-40 gap-4 flex-1">
          <motion.div
            className="bg-[#ECE0D9] text-black text-sm px-4 py-1 rounded font-semibold inline-block"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Let&apos;s talk
          </motion.div>

          <motion.h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            Ask Zofy Anything About <br />
            <span className="text-gray-300">Herself…</span>
          </motion.h1>
        </div>

        {/* Center Floating Logo */}
        <motion.div
          className="w-full flex justify-center -mb-52"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          <motion.img
            src="https://framerusercontent.com/images/OeBv0fgO9IamOd83wYdqECRWZuA.png"
            className="w-[30%] md:w-[15%]"
            alt="Ellipse"
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Bottom Section (Blurred BG) */}
        <motion.div
          className="backdrop-blur-lg bg-white/10 w-full flex flex-col items-center justify-center pt-40 pb-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.h4
            className="text-white text-sm font-semibold uppercase -mt-52 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Available in 5 Days
          </motion.h4>
        </motion.div>
      </div>
    </section>
  );
}

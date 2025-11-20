// components/Footer.tsx
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const container = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const iconHover = { scale: 1.2, transition: { duration: 0.2, ease: 'easeOut' } };

  return (
    <motion.footer
      className="py-16 px-6 bg-white border-t border-gray-100"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-5xl mx-auto text-center">

        {/* Logo + Name */}
        <motion.div className="flex items-center justify-center gap-3 mb-8" variants={container}>
          <div className="flex-shrink-0 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ff9fd1, #ff76a2)",
              }}
            >
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <p className='text-2xl font-bold'>Cira</p>
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div className="flex justify-center gap-8 mb-10" variants={container}>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Facebook className="w-6 h-6" />
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Instagram className="w-6 h-6" />
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Twitter className="w-6 h-6" />
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Linkedin className="w-6 h-6" />
          </motion.a>
        </motion.div>

        {/* Copyright */}
        <motion.p
          className="text-sm text-gray-500"
          variants={container}
        >
          © 2025 Cira. All rights reserved
        </motion.p>
      </div>
    </motion.footer>
  );
}

// components/FriendlyExplanationSection.tsx
import { motion } from 'framer-motion';
import FriendlyNurse from '../../assets/FriendlyNurse.png';

export default function FriendlyExplanationSection() {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="pt-3 pb-12 px-4 md:pt-3 md:pb-20 md:px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* Headline */}
        <motion.h1
          className="text-xl xs:text-2xl sm:text-2xl md:text-5xl font-serif font-normal text-gray-950 tracking-wide text-center flex flex-wrap items-center justify-center gap-1 sm:gap-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent font-serif bg-clip-text">
                Cira 
              </span>listens like a friend,<br />
          <span className="text-gray-950">explains like a Nurse.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
      className="mt-6 md:mt-8 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Speak naturally, and I'll break down health topics, medications, and lifestyle
          choices in a way that actually makes sense so you're never left guessing
          about your health again.
        </motion.p>
      </div>

      {/* Avatar + Listening Indicator */}
      <motion.div
        className="flex flex-col items-center mt-8 md:mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <img src={FriendlyNurse} alt="FriendlyNurse" className="w-[90%] md:w-[50%]" />
      </motion.div>
    </section>
  );
}

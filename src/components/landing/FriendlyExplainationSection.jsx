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
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Cira listens like a friend,<br />
          <span className="text-gray-800">explains like a Nurse.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="mt-8 text-md md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Speak naturally, and I’ll break down health topics, medications, and lifestyle
          choices in a way that actually makes sense so you’re never left guessing
          about your health again.
        </motion.p>
      </div>

      {/* Avatar + Listening Indicator */}
      <motion.div
        className="flex flex-col items-center mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <img src={FriendlyNurse} alt="FriendlyNurse" className="w-[40%] rounded-xl shadow-lg" />
      </motion.div>
    </section>
  );
}

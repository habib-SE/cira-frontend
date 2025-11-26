// components/PrivacySection.tsx
import { Lock, Shield, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacySection() {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-normal font-serif text-gray-950 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Don’t worry, everything is private,<br />
          GDPR secure, and your data is<br />
          <span className="text-pink-400">yours</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="mt-10 text-normal md:text-md text-gray-400 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Every conversation, diagnosis, and health detail is encrypted and stored securely. 
          I never use your chat data for AI training and only share data with your doctor 
          if you want me to.
        </motion.p>

        {/* Trust Icons Row */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row gap-10 justify-center items-center text-gray-700"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Each Icon */}
          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-purple-600" />
            </div>
            <p className="font-medium">256-bit Encryption</p>
          </motion.div>

          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-teal-600" />
            </div>
            <p className="font-medium">GDPR Compliant</p>
          </motion.div>

          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-10 h-10 text-pink-600" />
            </div>
            <p className="font-medium">You Own Your Data</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// components/DoctorConnectionSection.tsx
import { Check, ClipboardList, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorConnectionSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-8 px-4 md:py-10 md:px-6 min-h-[90vh] flex items-center">
      <div className="max-w-4xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-serif font-normal text-gray-950 tracking-tight leading-tight px-2 md:px-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          When we're done chatting, I can<br />
          connect you to a human doctor for<br />
          <span className="text-pink-400">just £49</span>
        </motion.h2>

        {/* 24/7 Badge */}
        <motion.button
          className="mt-6 md:mt-10 inline-flex items-center text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-gray-100 text-xs md:text-sm font-medium px-4 py-1.5 md:px-8 md:py-4 rounded-full transition-all duration-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Appointments available instantly, 24/7
        </motion.button>

        {/* Description */}
        <motion.p
          className="mt-6 md:mt-10 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          If you want, you can book a follow up with one of our doctors to get your
          prescriptions, talk about our AI findings, confirm a diagnosis, or get specialist
          help, all from the comfort of your phone.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          className="mt-10 md:mt-16 flex flex-col gap-4 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 max-w-lg w-full space-y-3 md:space-y-4">
            <ul className="space-y-4 md:space-y-6 text-left">
              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">Private GP and Specialist Doctors</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">Experienced. Skilled. Trustworthy.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">Full service care</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">Prescriptions, referrals & treatment</p>
                </div>
              </li>

              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">No insurance needed</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">All notes available in The Wellness</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

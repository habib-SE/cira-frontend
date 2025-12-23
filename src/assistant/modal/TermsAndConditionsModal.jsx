import React, { useState } from "react";
import { motion } from "framer-motion";
// import { ShieldCheck, ScrollText } from "lucide-react";
import { ShieldCheck, ScrollText, ArrowRight } from "lucide-react";

export default function TermsAndConditionsModal({ onAccept, onStartConversation }) {
  const [checked, setChecked] = useState(false);

  const handleAgree = () => {
    if (!checked) return;
    onAccept();
    if (onStartConversation) onStartConversation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
       className="relative bg-white/40 backdrop-blur-md rounded-3xl p-6 w-full max-w-[600px] md:max-w-[700px] max-h-[90vh] border border-white/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center items-center gap-3 mb-3">
            <ScrollText className="w-12 h-12 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h2>
          <p className="text-gray-700 mt-1 text-sm">
            Please review and accept our HIPAA & GDPR compliance terms before using Cira Assistant.
          </p>
        </div>

       {/* Scrollable Content */}
<div className="flex-1 overflow-y-auto pr-3 space-y-4 text-left custom-scrollbar">
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">🏥 HIPAA Compliance</h3>
    <ul className="text-sm text-gray-700 pl-5 space-y-1">
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Your health data is encrypted and stored securely.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Cira does not share medical information without consent.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Only authorized healthcare providers can access your records.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        We comply with all HIPAA privacy and security rules.
      </li>
    </ul>
  </section>

  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">🌍 GDPR Compliance</h3>
    <ul className="text-sm text-gray-700 pl-5 space-y-1">
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        You control your data — view, update, or delete anytime.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Personal information is used only for healthcare purposes.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        We follow strict EU data protection and consent principles.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        No profiling or automated decisions without your approval.
      </li>
    </ul>
  </section>

  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">💡 User Responsibilities</h3>
    <ul className="text-sm text-gray-700 pl-5 space-y-1">
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Provide accurate health details during consultation.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Understand Cira is an AI assistant and not a licensed doctor.
      </li>
      <li className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-pink-500 before:rounded-full before:block">
        Consult a healthcare provider for medical emergencies.
      </li>
    </ul>
  </section>

  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">🔒 Data Privacy Commitment</h3>
    <p className="text-sm text-gray-700 leading-relaxed">
      We value your trust. All data collected is encrypted, stored securely,
      and never shared without explicit permission. For more details, please refer to our Privacy Policy.
    </p>
  </section>
</div>

        {/* Agreement Section */}
        <div className="mt-4 flex items-center gap-2">
          <input
            id="agree"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I have read and agree to the Terms & Conditions.
          </label>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-center items-center">
          <button
            disabled={!checked}
            onClick={handleAgree}
            className={` py-3 flex justify-center items-center text-nowrap px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              checked
                ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
             <span>Agree & Continue</span>
             <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(192, 132, 252, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(192, 132, 252, 0.7);
        }
      `}</style>
    </motion.div>
  );
}

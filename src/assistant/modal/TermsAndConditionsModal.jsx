import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ScrollText } from "lucide-react";

export default function TermsAndConditionsModal({ onAccept }) {
  const [checked, setChecked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* 🩵 Transparent Background - Assistant remains visible */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative bg-white/40 backdrop-blur-md rounded-3xl p-6 max-w-lg w-full max-h-[90vh] border border-white/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <ShieldCheck className="w-14 h-14 mx-auto text-pink-600 mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            Terms & Conditions
          </h2>
          <p className="text-gray-700 mt-1 text-sm">
            Please review and accept our HIPAA & GDPR compliance terms before using Cira Assistant.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 px-2 text-left">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              🏥 HIPAA Compliance
            </h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Your health data is encrypted and stored securely.</li>
              <li>Cira does not share medical information without consent.</li>
              <li>Only authorized healthcare providers can access your records.</li>
              <li>We comply with all HIPAA privacy and security rules.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              🌍 GDPR Compliance
            </h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>You control your data — view, update, or delete anytime.</li>
              <li>Personal information is used only for healthcare purposes.</li>
              <li>We follow strict EU data protection and consent principles.</li>
              <li>No profiling or automated decisions without your approval.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              💡 User Responsibilities
            </h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Provide accurate health details during the consultation.</li>
              <li>Understand Cira is an AI assistant and not a licensed doctor.</li>
              <li>Consult a healthcare provider for medical emergencies.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              🔒 Data Privacy Commitment
            </h3>
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
        <div className="mt-6">
          <button
            disabled={!checked}
            onClick={onAccept}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              checked
                ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Agree & Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

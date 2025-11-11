// modal/DoctorRecommendationPopUp.jsx
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, X } from "lucide-react";

const DoctorRecommendationPopUp = ({
  condition,
  recommendedSpecialty,
  onFindDoctor,
  onSkip,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5">
        {/* Header + Content in one left-aligned block beside icon */}
        <div className="flex gap-3 mb-4 items-start">
          {/* Icon */}
          <div className="bg-pink-100 p-2 rounded-full flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-pink-600" />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-800 text-xl leading-tight mb-3 mt-1">
              Doctor Recommendation
            </h3>

            <p className="text-sm text-gray-700 mb-2">
              Based on your symptoms, it may relate to{" "}
              <span className="font-semibold">{condition}</span>.
            </p>
            <p className="text-sm text-gray-700">
              I recommend seeing a{" "}
              <span className="font-semibold text-pink-600">
                {recommendedSpecialty}
              </span>
              .
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onSkip}
            className="text-pink-500 hover:text-pink-600 transition-colors ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onFindDoctor}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <Stethoscope size={16} />
            Find Specialist Doctor
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorRecommendationPopUp;

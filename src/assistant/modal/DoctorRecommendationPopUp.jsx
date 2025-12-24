import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Stethoscope, X } from "lucide-react";

const DoctorRecommendationPopUp = ({
  condition = "your condition",
  recommendedSpecialty = "Specialist",
  onFindDoctor,
  onSkip,
  stopConversation,
  conversationSummary = null, // Default to null instead of empty object
}) => {
  const handleFindDoctorClick = async () => {
    if (stopConversation) {
      await stopConversation();
    }
    onFindDoctor?.();
  };

  // Safe extraction of summary data with proper null handling
  const { clinicalSummary } = conversationSummary || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto z-50 w-full md:max-w-md md:w-auto px-4 md:px-0 pb-4 md:pb-0"
    >
      <div className="bg-white rounded-2xl md:rounded-2xl shadow-xl border border-gray-200 p-4 md:p-5 max-h-[85vh] md:max-h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="flex gap-2 md:gap-3 mb-3 md:mb-4 items-start">
          <div className="bg-pink-100 p-1.5 md:p-2 rounded-full flex-shrink-0">
            <Stethoscope className="w-4 h-4 md:w-5 md:h-5 text-pink-600" />
          </div>

          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-2 md:mb-3 mt-0 md:mt-1">
              Doctor Recommendation
            </h3>

            <p className="text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2">
              Based on your symptoms, your condition may relate to{" "}
              <span className="font-semibold">{condition}</span>.
            </p>

            <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
              I recommend consulting a{" "}
              <span className="font-semibold text-pink-600">{recommendedSpecialty}</span>.
            </p>
          </div>

          <button
            onClick={onSkip}
            className="text-pink-500 hover:text-pink-600 transition-colors ml-1 md:ml-2 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        {/* CLINICAL SUMMARY FROM AI PROMPT */}
        {clinicalSummary && (
          <div className="mt-2 pt-2 border-t border-gray-200 flex-1 overflow-y-auto max-h-48 md:max-h-64">
            <h4 className="font-semibold text-gray-800 text-sm md:text-md mb-2 md:mb-3">
              Clinical Summary
            </h4>

            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{clinicalSummary}</p>

            <p className="text-[9px] md:text-[10px] text-gray-400 mt-2 md:mt-3">
              This summary is informational only and not a substitute for professional medical advice.
            </p>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-2 mt-3 md:mt-4">
          <button
            onClick={handleFindDoctorClick}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 md:py-2 px-4 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Find Specialist Doctor
          </button>

          <button
            onClick={onSkip}
            className="px-4 py-2.5 md:py-2 text-gray-600 hover:text-gray-800 font-medium text-xs md:text-sm transition-colors text-center"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorRecommendationPopUp;
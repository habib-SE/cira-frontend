// modal/DoctorRecommendationPopUp.jsx
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, X } from "lucide-react";

const DoctorRecommendationPopUp = ({ condition, recommendedSpecialty, onFindDoctor, onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-pink-100 p-2 rounded-full">
            <Stethoscope className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Doctor Recommendation</h3>
            <p className="text-sm text-gray-600">Based on your symptoms</p>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Based on your symptoms, it may relate to <span className="font-semibold">{condition}</span>.
          </p>
          <p className="text-sm text-gray-700">
            I recommend seeing a <span className="font-semibold text-pink-600">{recommendedSpecialty}</span>.
          </p>
        </div>

        {/* Actions */}
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
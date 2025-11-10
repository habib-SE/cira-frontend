import React from 'react';
import { Scan } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Welcome Scan Modal - Shows immediately when route loads
 */
function FacialScanModal({ onStartScan, onSkipScan, isScanning  }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      {/* Glassmorphism Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/40 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/30 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-purple-200/60 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="w-10 h-10 text-pink-700" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 drop-shadow-sm">
            {isScanning ? "Facial Scan in Progress" : " Facial Scan – Get Your Personalized Health Analysis"}
          </h3>
          <p className="text-gray-700 text-lg">
            {isScanning
              ? "Please remain still while we analyze your vital signs through facial recognition..."
              : "Before connecting you with the doctor, let's perform a quick facial scan to measure your vitals. Would you like to proceed?"}
          </p>
        </div>

        {!isScanning && (
          <div className="flex flex-col gap-3">
            <button
            onClick={onStartScan}
            disabled={isScanning}
              className="bg-gradient-to-r from-pink-500 to-purple-600  hover:from-pink-600 hover:to-purple-700 transition-allbg-pink-400 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-lg shadow-md"
            >
              <Scan size={24} />
              Yes, Scan My Vitals
            </button>
            <button
              onClick={onSkipScan}
              className="bg-white/40 backdrop-blur-sm text-gray-800 py-4 rounded-xl font-semibold hover:bg-white/90 border border-gray-300 transition-colors text-lg"
            >
              No, Skip Scan For Now
            </button>
          </div>
        )}

        {isScanning && (
          <div className="text-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-pink-700 font-medium text-lg">
              Analyzing health data...
            </p>
            <p className="text-gray-600 text-sm mt-2">
              This will take just a few seconds
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default FacialScanModal;
// modal/FacialScanPopUp.jsx
import React from "react";
import { motion } from "framer-motion";
import { Scan, X } from "lucide-react";

const FacialScanPopUp = ({ onStartScan, onSkipScan, isScanning }) => {
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
          <div className="bg-blue-100 p-2 rounded-full">
            <Scan className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Facial Scan</h3>
            <p className="text-sm text-gray-600">Measure your vitals</p>
          </div>
          <button
            onClick={onSkipScan}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            "Before connecting you with the doctor, let's perform a quick facial scan to measure your vitals."
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onStartScan}
            disabled={isScanning}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan size={16} />
                Start Facial Scan
              </>
            )}
          </button>
          <button
            onClick={onSkipScan}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
          >
            Skip Scan
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FacialScanPopUp;
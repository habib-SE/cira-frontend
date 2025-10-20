import React from 'react';
import { X, Heart, Activity, Thermometer, Eye } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Vital Signs Display Component
 */
function VitalSignsDisplay({ vitals, onClose, onStartConversation }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/30 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-pink-500">Vital Signs Scan</h3>
          <button
            onClick={onClose}
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center shadow">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Heart Rate</p>
            <p className="text-2xl font-bold text-gray-800">{vitals.heartRate} BPM</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center shadow">
            <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-620">Oxygen</p>
            <p className="text-2xl font-bold text-gray-800">{vitals.oxygen}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center shadow">
            <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-2xl font-bold text-gray-800">{vitals.temperature}°F</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center shadow">
            <Eye className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Stress Level</p>
            <p className="text-2xl font-bold text-gray-800">{vitals.stressLevel}</p>
          </div>
        </div>

        <button
          onClick={onStartConversation}
          className="w-full bg-pink-400 text-white py-3 rounded-lg font-semibold hover:bg-pink-500 transition-colors shadow-md"
        >
          Start Conversation
        </button>
      </motion.div>
    </motion.div>
  );
}

export default VitalSignsDisplay;
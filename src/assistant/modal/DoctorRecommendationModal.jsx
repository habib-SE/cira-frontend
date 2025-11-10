// modal/DoctorRecommendationModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { X, Star, Clock, DollarSign } from "lucide-react";

const DoctorRecommendationModal = ({ 
  condition, 
  recommendedSpecialty, 
  onSelectDoctor, 
  onSkip 
}) => {
  // Mock doctor data - in real app this would come from API
  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Aisha Khan",
      specialty: "Cardiologist",
      rating: 4.8,
      cost: 40,
      experience: "12 years",
      availability: "Today"
    },
    {
      id: 2,
      name: "Dr. Ahmed Raza",
      specialty: "General Physician",
      rating: 4.6,
      cost: 25,
      experience: "8 years",
      availability: "Today"
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      specialty: "Dermatologist",
      rating: 4.7,
      cost: 35,
      experience: "10 years",
      availability: "Tomorrow"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🩺 Doctor Recommendation</h2>
              <p className="text-pink-100 mt-1">
                Based on your symptoms, we recommend consulting a {recommendedSpecialty}
              </p>
            </div>
            <button
              onClick={onSkip}
              className="text-white hover:text-pink-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Summary
            </h3>
            <p className="text-gray-600">
              Based on your symptoms, this may relate to {condition}. 
              Consulting a specialist can provide proper diagnosis and treatment.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Available Doctors
            </h3>
            
            {availableDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectDoctor(doctor)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {doctor.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{doctor.experience}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">
                          ${doctor.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      {doctor.availability}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip for Now
            </button>
            <p className="text-sm text-gray-500">
              {availableDoctors.length} doctors available
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorRecommendationModal;
import React from "react";
import { motion } from "framer-motion";
import { X, Star, Clock, DollarSign, Stethoscope, Info } from "lucide-react";

const DoctorRecommendationModal = ({
  condition,
  recommendedSpecialty,
  onSelectDoctor,
  onSkip,
}) => {
  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Aisha Khan",
      specialty: "Cardiologist",
      rating: 4.8,
      cost: 40,
      experience: "12 years",
      availability: "Today",
    },
    {
      id: 2,
      name: "Dr. Ahmed Raza",
      specialty: "General Physician",
      rating: 4.6,
      cost: 25,
      experience: "8 years",
      availability: "Today",
    },
    {
      id: 3,
      name: "Dr. Sara Malik",
      specialty: "Dermatologist",
      rating: 4.7,
      cost: 35,
      experience: "10 years",
      availability: "Tomorrow",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/40 backdrop-blur-md rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] border border-white/30 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-pink-600" />
              Doctor Recommendation
            </h2>
            <p className="text-gray-700 mt-1 ml-8">
             We recommend consulting a{" "} 
              <span className="font-semibold text-pink-600">
                {recommendedSpecialty}
              </span>
            </p>
          </div>
          <button
            onClick={onSkip}
            className="text-pink-600 hover:text-pink-700  transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overflow-x-hidden max-h-[60vh] space-y-6 px-6">
 {/* Summary Section */}
{/* <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-transparent border border-pink-100 rounded-2xl p-4 mb-6 flex gap-3 items-start"
>
  <div className="bg-white/30 p-2 rounded-full shadow-sm">
    <Info className="w-5 h-5 text-pink-600" />
  </div>
  <div className="text-left">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">
      Summary
    </h3>
    <p className="text-gray-700 text-sm leading-relaxed">
      Based on your symptoms, this may relate to{" "}
      <span className="font-semibold">{condition}</span>. Consulting a{" "}
      <span className="font-semibold text-pink-600">
        {recommendedSpecialty}
      </span>{" "}
      can help ensure accurate diagnosis and effective treatment.
    </p>
  </div>
</motion.div> */}


          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Available Doctors</h3>
            {availableDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer bg-white/60"
                onClick={() => onSelectDoctor(doctor)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{doctor.name}</h4>
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
                        <span className="text-sm font-semibold text-green-600">${doctor.cost}</span>
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
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={onSkip}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Skip for Now
          </button>
          <p className="text-sm text-gray-600">
            {availableDoctors.length} doctors available
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorRecommendationModal;

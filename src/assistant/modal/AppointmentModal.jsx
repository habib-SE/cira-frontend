import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, Star, Calendar1 } from "lucide-react";

const AppointmentModal = ({ doctor, onBookingSuccess, onBack, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    { id: 1, time: "09:00 AM", date: "Today", available: true },
    { id: 2, time: "10:30 AM", date: "Today", available: true },
    { id: 3, time: "02:00 PM", date: "Today", available: false },
    { id: 4, time: "03:30 PM", date: "Today", available: true },
    { id: 5, time: "09:00 AM", date: "Tomorrow", available: true },
    { id: 6, time: "11:00 AM", date: "Tomorrow", available: true },
    { id: 7, time: "04:00 PM", date: "Tomorrow", available: true },
  ];

  const defaultDoctor = {
    name: "Dr. Ahmed Raza",
    specialty: "General Physician",
    rating: "4.6",
  };

  const currentDoctor = doctor || defaultDoctor;

  const handleBookAppointment = () => {
    if (selectedSlot) {
      onBookingSuccess({
        doctor: currentDoctor,
        slot: selectedSlot,
        confirmationId: `CONF-${Date.now()}`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Glassmorphism Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/40 backdrop-blur-md rounded-3xl p-6 max-w-md w-full max-h-[90vh] border border-white/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              📅 Book Appointment
            </h2>
            <p className="text-gray-700 mt-1">
              {currentDoctor.name} - {currentDoctor.specialty}
            </p>
          </div>
          <button
            onClick={onClose || onBack}
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-white/60 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentDoctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentDoctor.name}</h3>
              <p className="text-gray-600 text-sm">{currentDoctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{currentDoctor.rating}</span>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar1 className="w-5 h-5" />
              Available Time Slots
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
  key={slot.id}
  onClick={() => slot.available && setSelectedSlot(slot)}
  disabled={!slot.available}
  className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
    selectedSlot?.id === slot.id
      ? "border-pink-500 bg-pink-50 shadow-md text-pink-700"
      : slot.available
      ? "border-gray-200 bg-white hover:border-pink-400 hover:bg-pink-50 hover:shadow-sm text-gray-800"
      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
  }`}
>
  <div className="font-medium text-sm">{slot.time}</div>
  <div className="text-xs mt-1 text-gray-600">{slot.date}</div>
  {selectedSlot?.id === slot.id && (
    <Check className="w-4 h-4 mx-auto mt-1 text-pink-500" />
  )}
</button>
              ))}
            </div>
          </div>

          {!selectedSlot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-700 text-sm text-center">
                Please select a time slot for your appointment
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex-shrink-0">
          <button
            onClick={handleBookAppointment}
            disabled={!selectedSlot}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
              !selectedSlot
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            }`}
          >
            Confirm Appointment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentModal;

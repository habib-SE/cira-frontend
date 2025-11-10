import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, User, MapPin } from "lucide-react";

const BookingConfirmationModal = ({ bookingDetails, onClose }) => {
  const defaultBookingDetails = {
    doctor: {
      name: "Dr. Smith",
      specialty: "General Physician",
    },
    slot: {
      date: "Today",
      time: "09:00 AM",
    },
    confirmationId: `CONF-${Date.now()}`,
  };

  const currentBooking = bookingDetails || defaultBookingDetails;

  const bookingItems = [
    {
      icon: <User className="w-5 h-5 text-white" />,
      label: "Doctor",
      value: currentBooking.doctor.name,
      subValue: currentBooking.doctor.specialty,
      bgColor: "bg-pink-500",
    },
    {
      icon: <Calendar className="w-5 h-5 text-white" />,
      label: "Date & Time",
      value: `${currentBooking.slot.date}, ${currentBooking.slot.time}`,
      bgColor: "bg-purple-500",
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      label: "Duration",
      value: "30 minutes",
      bgColor: "bg-green-500",
    },
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      label: "Consultation Type",
      value: "Video Call",
      bgColor: "bg-blue-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white/40 backdrop-blur-md rounded-3xl max-w-md w-full max-h-[90vh] border border-white/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center p-6 rounded-t-3xl">
          <CheckCircle className="w-16 h-16 text-green-500 mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">Appointment Confirmed!</h2>
          <p className="text-green-700 mt-1 text-sm">
            Your consultation has been successfully booked
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Booking Details */}
          <div className="space-y-4">
            {bookingItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/60 rounded-xl p-3 shadow-sm">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${item.bgColor}`}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="font-semibold text-gray-900">{item.value}</p>
                  {item.subValue && <p className="text-sm text-gray-500">{item.subValue}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation ID */}
          <div className="mt-2 p-4 bg-white/70 rounded-xl text-center shadow-inner">
            <p className="text-sm text-gray-600">Confirmation ID</p>
            <p className="font-mono font-bold text-gray-900 text-lg">
              {currentBooking.confirmationId}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-blue-50/70 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>You'll receive a confirmation email shortly</li>
              <li>Join the video call 5 minutes before your appointment</li>
              <li>Have your ID and insurance card ready</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingConfirmationModal;

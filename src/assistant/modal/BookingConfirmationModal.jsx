import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, User, MapPin } from "lucide-react";

const BookingConfirmationModal = ({ bookingDetails, onClose }) => {
  // Default booking details in case prop is undefined
  const defaultBookingDetails = {
    doctor: {
      name: "Dr. Smith",
      specialty: "General Physician"
    },
    slot: {
      date: "Today",
      time: "09:00 AM"
    },
    confirmationId: `CONF-${Date.now()}`
  };

  const currentBooking = bookingDetails || defaultBookingDetails;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center rounded-t-2xl">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Appointment Confirmed!</h2>
          <p className="text-green-100 mt-1">
            Your consultation has been successfully booked
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-semibold text-gray-900">
                  {currentBooking.doctor.name}
                </p>
                <p className="text-sm text-gray-500">
                  {currentBooking.doctor.specialty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-900">
                  {currentBooking.slot.date}, {currentBooking.slot.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">30 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Consultation Type</p>
                <p className="font-semibold text-gray-900">Video Call</p>
              </div>
            </div>
          </div>

          {/* Confirmation ID */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Confirmation ID
            </p>
            <p className="font-mono font-bold text-gray-900 text-center text-lg">
              {currentBooking.confirmationId}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Join the video call 5 minutes before your appointment</li>
              <li>• Have your ID and insurance card ready</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmationModal;
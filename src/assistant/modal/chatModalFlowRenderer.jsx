import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

import VitalSignsDisplay from "./VitalSignsDisplay";
import DoctorRecommendationModal from "./DoctorRecommendationModal";
import PaymentModal from "./PaymentModal";
import AppointmentModal from "./AppointmentModal";
import BookingConfirmationModal from "./BookingConfirmationModal";
import DoctorRecommendationPopUp from "./DoctorRecommendationPopUp";
import FacialScanModal from "./FacialScanModal";

export default function ModalFlowRenderer({
  isAnyModalOpen,
  showDoctorRecommendationPopUp,
  doctorRecommendationData,
  showFacialScanPopUp,
  isScanning,
  showVitals,
  vitalsData,
  showDoctorRecommendation,
  selectedDoctor,
  showPayment,
  showAppointment,
  showConfirmation,
  bookingDetails,
  conversationSummary,
  onFindDoctor,
  onSkipDoctorRecommendation,
  onStartScan,
  onSkipScan,
  onCloseVitals,
  onStartConversation,
  onSelectDoctor,
  onSkipDoctor,
  onPaymentSuccess,
  onPaymentBack,
  onBookingSuccess,
  onAppointmentBack,
  onConfirmationClose
}) {
  return (
    <AnimatePresence>
      {isAnyModalOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {showDoctorRecommendationPopUp && (
            <DoctorRecommendationPopUp
              condition={
                doctorRecommendationData?.condition || "your health concerns"
              }
              recommendedSpecialty={
                doctorRecommendationData?.specialty || "General Physician"
              }
              onFindDoctor={onFindDoctor}
              onSkip={onSkipDoctorRecommendation}
              conversationSummary={conversationSummary}
            />
          )}

          {showFacialScanPopUp && (
            <FacialScanModal
              onStartScan={onStartScan}
              onSkipScan={onSkipScan}
              isScanning={isScanning}
            />
          )}

          {showVitals && vitalsData && (
            <VitalSignsDisplay
              vitals={vitalsData}
              onClose={onCloseVitals}
              onStartConversation={onStartConversation}
            />
          )}

          {showDoctorRecommendation && doctorRecommendationData && (
            <DoctorRecommendationModal
              condition={doctorRecommendationData.condition}
              recommendedSpecialty={doctorRecommendationData.specialty}
              onSelectDoctor={onSelectDoctor}
              onSkip={onSkipDoctor}
            />
          )}

          {showPayment && selectedDoctor && (
            <PaymentModal
              doctor={selectedDoctor}
              onPaymentSuccess={onPaymentSuccess}
              onBack={onPaymentBack}
            />
          )}

          {showAppointment && selectedDoctor && (
            <AppointmentModal
              doctor={selectedDoctor}
              onBookingSuccess={onBookingSuccess}
              onBack={onAppointmentBack}
            />
          )}

          {showConfirmation && bookingDetails && (
            <BookingConfirmationModal
              bookingDetails={bookingDetails}
              onClose={onConfirmationClose}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
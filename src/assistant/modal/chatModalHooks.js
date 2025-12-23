import { useState } from 'react';

export function useModalFlow() {
  // 🔹 Modal state management
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
  const [doctorRecommendationData, setDoctorRecommendationData] = useState(null);
  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);
  const [showDoctorRecommendation, setShowDoctorRecommendation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Check if any modal is open
  const isAnyModalOpen =
    showDoctorRecommendationPopUp ||
    showFacialScanPopUp ||
    showVitals ||
    showDoctorRecommendation ||
    showPayment ||
    showAppointment ||
    showConfirmation;

  // 🔹 Modal flow handlers
  const handleFindDoctorSpecialistClick = (condition) => {
    const primaryCondition = condition || "your health concerns";
    
    setDoctorRecommendationData({
      condition: primaryCondition,
      specialty: "General Physician",
    });
    setShowDoctorRecommendationPopUp(true);
  };

  const handleFindSpecialistDoctorClick = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowFacialScanPopUp(true);
  };

  const handleSkipDoctorRecommendation = () => {
    setShowDoctorRecommendationPopUp(false);
  };

  const handleStartFacialScan = () => {
    setIsScanning(true);
    setShowFacialScanPopUp(false);

    // Simulate facial scan/vitals API call
    setTimeout(() => {
      setIsScanning(false);
      setVitalsData({
        heartRate: 80,
        spo2: 98,
        temperature: 36.8,
      });
      setShowVitals(true);
    }, 1500);
  };

  const handleSkipFacialScan = () => {
    setShowFacialScanPopUp(false);
  };

  const handleContinueFromVitals = () => {
    setShowVitals(false);
    setShowDoctorRecommendation(true);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorRecommendation(false);
    setShowPayment(true);
  };

  const handleSkipDoctor = () => {
    setShowDoctorRecommendation(false);
  };

  const handlePaymentSuccess = (details) => {
    setShowPayment(false);
    setBookingDetails(details);
    setShowAppointment(true);
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowDoctorRecommendation(true);
  };

  const handleBookingSuccess = (details) => {
    setShowAppointment(false);
    setBookingDetails(details);
    setShowConfirmation(true);
  };

  const handleAppointmentBack = () => {
    setShowAppointment(false);
    setShowPayment(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedDoctor(null);
    setBookingDetails(null);
  };

  // Reset all modals
  const resetAllModals = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowFacialScanPopUp(false);
    setIsScanning(false);
    setShowVitals(false);
    setShowDoctorRecommendation(false);
    setShowPayment(false);
    setShowAppointment(false);
    setShowConfirmation(false);
    setDoctorRecommendationData(null);
    setSelectedDoctor(null);
    setBookingDetails(null);
    setVitalsData(null);
  };

  return {
    // Modal states
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
    isAnyModalOpen,
    
    // State setters (for external control if needed)
    setDoctorRecommendationData,
    setVitalsData,
    setSelectedDoctor,
    setBookingDetails,
    setConversationSummary: () => {}, // Placeholder, should be implemented in component
    
    // Modal handlers
    handleFindDoctorSpecialistClick,
    handleFindSpecialistDoctorClick,
    handleSkipDoctorRecommendation,
    handleStartFacialScan,
    handleSkipFacialScan,
    handleContinueFromVitals,
    handleSelectDoctor,
    handleSkipDoctor,
    handlePaymentSuccess,
    handlePaymentBack,
    handleBookingSuccess,
    handleAppointmentBack,
    handleConfirmationClose,
    resetAllModals
  };
}
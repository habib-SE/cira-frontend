// modal/modalHooks.js - UPDATED
import { useState } from 'react';

export function useModalLogic() {
  // Pop-up states (NEW)
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  
  // Existing modal states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);
  const [showDoctorRecommendation, setShowDoctorRecommendation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [doctorRecommendationData, setDoctorRecommendationData] = useState(null);

  // Generate dummy vital data
  const generateDummyVitals = () => ({
    heartRate: Math.floor(Math.random() * 40) + 60,
    oxygen: Math.floor(Math.random() * 6) + 95,
    temperature: (Math.random() * 2 + 97.5).toFixed(1),
    stressLevel: ["Low", "Normal", "Moderate"][Math.floor(Math.random() * 3)],
    respiratoryRate: Math.floor(Math.random() * 8) + 12,
    bloodPressure: `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 20) + 70}`
  });

  // NEW: Show doctor recommendation pop-up (first step) - FIXED NAME
  const triggerDoctorRecommendationPopUp = (condition, specialty) => {
    setDoctorRecommendationData({ condition, specialty });
    setShowDoctorRecommendationPopUp(true);
  };

  // NEW: Handle "Find Specialist Doctor" click
  const handleFindSpecialistDoctor = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowVitals(false);
    // Show facial scan pop-up next
    setShowFacialScanPopUp(true);
  };

  // NEW: Handle skip doctor recommendation
  const handleSkipDoctorRecommendation = () => {
    setShowDoctorRecommendationPopUp(false);
    setDoctorRecommendationData(null);
  };

  // NEW: Handle start facial scan
  const handleStartFacialScan = () => {
    setShowWelcomeModal(false);
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const dummyVitals = generateDummyVitals();
      setVitalsData(dummyVitals);
         setIsScanning(false);
      setShowWelcomeModal(false);
      setShowVitals(true);

    }, 3000);
  };

  // NEW: Handle continue from vitals (when user clicks "Continue" in vitals modal)
  const handleContinueFromVitals = () => {
    setShowVitals(false);
    // Show doctor list after vitals
    setShowDoctorRecommendation(true);
  };


  // NEW: Handle skip facial scan
  const handleSkipFacialScan = () => {
    setShowFacialScanPopUp(false);
    // Skip to doctor list directly
    setShowDoctorRecommendation(true);
  };

  // Existing handlers (updated)
  const handleScanAccept = (onScanComplete) => {
    setIsScanning(true);
    setTimeout(() => {
      const dummyVitals = generateDummyVitals();
      setVitalsData(dummyVitals);
      setIsScanning(false);
      setShowWelcomeModal(false);
      setShowVitals(true);
      if (onScanComplete) onScanComplete(dummyVitals);
    }, 3000);
  };

  const handleScanDecline = (onConversationStart) => {
    setShowWelcomeModal(false);
    if (onConversationStart) onConversationStart();
  };

  const handleCloseVitals = () => {
    setShowVitals(false);

  };

  const handleStartFromVitals = (onConversationStart) => {
    setShowVitals(false);
    if (onConversationStart) onConversationStart();
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorRecommendation(false);
    setShowPayment(true);
  };

  const handleSkipDoctor = () => {
    setShowDoctorRecommendation(false);
    setDoctorRecommendationData(null);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowAppointment(true);
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowDoctorRecommendation(true);
  };

  const handleBookingSuccess = (details) => {
    setBookingDetails({
      ...details,
      confirmationId: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      bookedAt: new Date().toISOString()
    });
    setShowAppointment(false);
    setShowConfirmation(true);
  };

  const handleAppointmentBack = () => {
    setShowAppointment(false);
    setShowPayment(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setBookingDetails(null);
    setSelectedDoctor(null);
    setDoctorRecommendationData(null);
  };

  const isAnyModalOpen = () => {
    return showWelcomeModal || showVitals || showDoctorRecommendation || 
           showPayment || showAppointment || showConfirmation ||
           showDoctorRecommendationPopUp || showFacialScanPopUp; // NEW
  };

  const resetModalStates = () => {
    setShowWelcomeModal(false);
    setIsScanning(false);
    setShowVitals(false);
    setVitalsData(null);
    setShowDoctorRecommendation(false);
    setShowPayment(false);
    setShowAppointment(false);
    setShowConfirmation(false);
    setSelectedDoctor(null);
    setBookingDetails(null);
    setDoctorRecommendationData(null);
    // NEW: Reset pop-ups
    setShowDoctorRecommendationPopUp(false);
    setShowFacialScanPopUp(false);
  };

  return {
    // States
    showWelcomeModal,
    isScanning,
    showVitals,
    vitalsData,
    showDoctorRecommendation,
    showPayment,
    showAppointment,
    showConfirmation,
    selectedDoctor,
    bookingDetails,
    doctorRecommendationData,
    // NEW: Pop-up states
    showDoctorRecommendationPopUp,
    showFacialScanPopUp,
    
    // State setters
    setShowWelcomeModal,
    setIsScanning,
    setShowVitals,
    setVitalsData,
    setShowDoctorRecommendation,
    setShowPayment,
    setShowAppointment,
    setShowConfirmation,
    setSelectedDoctor,
    setBookingDetails,
    setDoctorRecommendationData,
    
    // Actions
    generateDummyVitals,
    handleScanAccept,
    handleScanDecline,
    handleCloseVitals,
    handleStartFromVitals,
    resetModalStates,
    
    // NEW: Pop-up actions - FIXED NAMES
    triggerDoctorRecommendationPopUp, // Changed from showDoctorRecommendationPopUp
    handleFindSpecialistDoctor,
    handleSkipDoctorRecommendation,
    handleStartFacialScan,
    handleSkipFacialScan,
    handleContinueFromVitals,
    
    // Doctor flow actions
    handleSelectDoctor,
    handleSkipDoctor,
    handlePaymentSuccess,
    handlePaymentBack,
    handleBookingSuccess,
    handleAppointmentBack,
    handleConfirmationClose,
    
    // Utility functions
    isAnyModalOpen,
  };
}
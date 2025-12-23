// modal/modalHooks.js - CLEANED UP
import { useState } from 'react';

export function useModalLogic() {
  // Pop-up states
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  
  // Existing modal states
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

  // Show doctor recommendation pop-up (first step)
  const triggerDoctorRecommendationPopUp = (condition, specialty) => {
    setDoctorRecommendationData({ condition, specialty });
    setShowDoctorRecommendationPopUp(true);
  };

  // Handle "Find Specialist Doctor" click
  const handleFindSpecialistDoctor = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowVitals(false);
    setShowFacialScanPopUp(true);
  };

  // Handle skip doctor recommendation
  const handleSkipDoctorRecommendation = () => {
    setShowDoctorRecommendationPopUp(false);
    setDoctorRecommendationData(null);
  };

  // Handle start facial scan
  const handleStartFacialScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const dummyVitals = generateDummyVitals();
      setVitalsData(dummyVitals);
      setIsScanning(false);
      setShowFacialScanPopUp(false); // Hide facial scan popup after completion
      setShowVitals(true);
    }, 3000);
  };

  // Handle continue from vitals
  const handleContinueFromVitals = () => {
    setShowVitals(false);
    setShowDoctorRecommendation(true);
  };

  // Handle skip facial scan
  const handleSkipFacialScan = () => {
    setShowFacialScanPopUp(false);
    setShowDoctorRecommendation(true);
  };

  // Handle select doctor
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorRecommendation(false);
    setShowPayment(true);
  };

  // Handle skip doctor
  const handleSkipDoctor = () => {
    setShowDoctorRecommendation(false);
    setDoctorRecommendationData(null);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowAppointment(true);
  };

  // Handle payment back
  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowDoctorRecommendation(true);
  };

  // Handle booking success
  const handleBookingSuccess = (details) => {
    setBookingDetails({
      ...details,
      confirmationId: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      bookedAt: new Date().toISOString()
    });
    setShowAppointment(false);
    setShowConfirmation(true);
  };

  // Handle appointment back
  const handleAppointmentBack = () => {
    setShowAppointment(false);
    setShowPayment(true);
  };

  // Handle confirmation close
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setBookingDetails(null);
    setSelectedDoctor(null);
    setDoctorRecommendationData(null);
  };

  // Check if any modal is open
  const isAnyModalOpen = () => {
    return showVitals || showDoctorRecommendation || 
           showPayment || showAppointment || showConfirmation ||
           showDoctorRecommendationPopUp || showFacialScanPopUp;
  };

  // Reset all modal states
  const resetModalStates = () => {
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
    setShowDoctorRecommendationPopUp(false);
    setShowFacialScanPopUp(false);
  };

  return {
    // States
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
    showDoctorRecommendationPopUp,
    showFacialScanPopUp,
    
    // Actions
    triggerDoctorRecommendationPopUp,
    handleFindSpecialistDoctor,
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
    resetModalStates,
    
    // Utility functions
    isAnyModalOpen,
  };
}
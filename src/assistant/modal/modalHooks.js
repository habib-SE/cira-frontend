import { useState } from 'react';

/**
 * Custom hook for managing modal states and vital data
 */
export function useModalLogic() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);
  const [scanCompleted, setScanCompleted] = useState(false);

  /**
   * Generate dummy vital data
   */
  const generateDummyVitals = () => ({
    heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
    oxygen: Math.floor(Math.random() * 6) + 95, // 95-100%
    temperature: (Math.random() * 2 + 97.5).toFixed(1), // 97.5-99.5°F
    stressLevel: ["Low", "Normal", "Moderate"][Math.floor(Math.random() * 3)],
    respiratoryRate: Math.floor(Math.random() * 8) + 12, // 12-20
    bloodPressure: `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 20) + 70}`
  });

  /**
   * Handle scan acceptance
   */
  const handleScanAccept = (onScanComplete) => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const dummyVitals = generateDummyVitals();
      setVitalsData(dummyVitals);
      setIsScanning(false);
      setShowWelcomeModal(false);
      setShowVitals(true);
      setScanCompleted(true);
      
      if (onScanComplete) onScanComplete(dummyVitals);
    }, 3000);
  };

  /**
   * Handle scan decline
   */
  const handleScanDecline = (onConversationStart) => {
    setShowWelcomeModal(false);
    setScanCompleted(true);
    if (onConversationStart) onConversationStart();
  };

  /**
   * Close vitals display
   */
  const handleCloseVitals = () => {
    setShowVitals(false);
  };

  /**
   * Start conversation from vitals
   */
  const handleStartFromVitals = (onConversationStart) => {
    setShowVitals(false);
    if (onConversationStart) onConversationStart();
  };

  /**
   * Reset all modal states
   */
  const resetModalStates = () => {
    setShowWelcomeModal(true);
    setIsScanning(false);
    setShowVitals(false);
    setVitalsData(null);
    setScanCompleted(false);
  };

  return {
    // States
    showWelcomeModal,
    isScanning,
    showVitals,
    vitalsData,
    scanCompleted,
    
    // State setters
    setShowWelcomeModal,
    setIsScanning,
    setShowVitals,
    setVitalsData,
    setScanCompleted,
    
    // Actions
    generateDummyVitals,
    handleScanAccept,
    handleScanDecline,
    handleCloseVitals,
    handleStartFromVitals,
    resetModalStates
  };
}
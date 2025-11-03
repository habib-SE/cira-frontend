import React, { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted avatar component
import NurseAvatar from "./nurseAvatar/NurseAvatar";

// Modals & Hooks
import WelcomeScanModal from "./modal/WelcomeScanModal";
import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import PaymentModal from "./modal/PaymentModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import { useModalLogic } from "./modal/modalHooks";

/* --------------------------- Main CiraAssistant --------------------------- */

export default function CiraAssistant() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneme, setPhoneme] = useState(null);

  // Modal flow states
  const [currentStep, setCurrentStep] = useState("initial");
  const [showDoctorPopUp, setShowDoctorPopUp] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showFacialScanPopup, setShowFacialScanPopup] = useState(false);
  const [showVitalSignsDisplay, setShowVitalSignsDisplay] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBookingConfirmationModal, setShowBookingConfirmationModal] = useState(false);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const [recommendationData, setRecommendationData] = useState({
    condition: "general health concern",
    recommendedSpecialty: "General Physician"
  });

  const {
    showWelcomeModal,
    isScanning,
    showVitals,
    vitalsData,
    handleScanAccept,
    handleScanDecline,
    handleCloseVitals,
    handleStartFromVitals,
    resetModalStates,
  } = useModalLogic();

  /* ----------- Flow Control ----------- */

  const goToNextStep = (step) => {
    // close all modals before switching
    setShowDoctorPopUp(false);
    setShowDoctorModal(false);
    setShowFacialScanPopup(false);
    setShowVitalSignsDisplay(false);
    setShowAppointmentModal(false);
    setShowPaymentModal(false);
    setShowBookingConfirmationModal(false);
    setCurrentStep(step);

    switch (step) {
      case "doctor_popup":
        setShowDoctorPopUp(true);
        break;
      case "facial_scan":
        setShowFacialScanPopup(true);
        break;
      case "choose_doctor":
        setShowDoctorModal(true);
        break;
      case "vitals":
        setShowVitalSignsDisplay(true);
        break;
      case "appointment":
        setShowAppointmentModal(true);
        break;
      case "payment":
        setShowPaymentModal(true);
        break;
      case "confirmation":
        setShowBookingConfirmationModal(true);
        break;
      default:
        break;
    }
  };

  const handleFindDoctor = () => goToNextStep("facial_scan");
  const handleSkipDoctor = () => setShowDoctorPopUp(false);

  // ✅ FIX: After facial scan, open doctor recommendation list modal directly
  const handleScanCompleted = () => {
    goToNextStep("choose_doctor");
  };

  const handleDoctorSelected = (doctor) => {
    setSelectedDoctor(doctor);
    goToNextStep("appointment");
  };

  const handleAppointmentBooked = (bookingData) => {
    setBookingDetails(bookingData);
    goToNextStep("payment");
  };

  const handlePaymentSuccess = () => goToNextStep("confirmation");

  const conversation = useConversation({
    clientTools: {
      openModal: async (params) => {
        const {
          showDoctorRecommendationPopup,
          showDoctorRecommendation, 
          showFacialScan,
          showVitalSigns,
          showAppointment,
          showPayment,
          showBookingConfirmation,
        } = params || {};

        let opened = null;
        if (showDoctorRecommendationPopup) {
          opened = "doctor_popup";
          setRecommendationData({
            condition: params.condition || "general health concern",
            recommendedSpecialty: params.specialty || "General Physician",
          });
        } else if (showFacialScan) opened = "scan";
        else if (showVitalSigns) opened = "vitals";
        else if (showDoctorRecommendation ) opened = "choose_doctor";
        else if (showPayment) opened = "payment";
        else if (showAppointment) opened = "appointment";
        else if (showBookingConfirmation) opened = "confirmation";

        if (opened) goToNextStep(opened === "scan" ? "facial_scan" : opened);
        return { success: true, opened };
      },
    },
    onConnect: () => setIsConnected(true),
    onDisconnect: () => setIsConnected(false),
    onMessage: (m) => {
      if (m.message?.includes("headache")) {
        setRecommendationData({ condition: "headache", recommendedSpecialty: "Neurologist" });
      } else if (m.message?.includes("stomach")) {
        setRecommendationData({ condition: "stomach issue", recommendedSpecialty: "Gastroenterologist" });
      }
    },
    onPhoneme: (p) => {
      setPhoneme(p);
      setTimeout(() => setPhoneme(null), 80);
    },
    onError: (err) => setErrorMessage(err?.message || "Conversation error occurred"),
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch {
        setErrorMessage("Microphone access denied");
      }
    })();
  }, []);

  const handleStartConversation = async () => {
    try {
      resetModalStates();
      setCurrentStep("initial");
      setSelectedDoctor(null);
      setBookingDetails(null);
      await conversation.startSession({ agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID });
      await conversation.setVolume({ volume: 1 });
      setIsConnected(true);
    } catch {
      setErrorMessage("Failed to start conversation");
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      setCurrentStep("initial");
      setSelectedDoctor(null);
      setBookingDetails(null);
      setShowDoctorPopUp(false);
    } catch {}
  };

  const toggleMute = async () => {
    await conversation.setVolume({ volume: isMuted ? 1 : 0 });
    setIsMuted(!isMuted);
  };

  return (
    <div
      style={{ background: "linear-gradient(180deg,#FFFBFD 0%,#FDE4F8 28%,#FFF7EA 100%)" }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative"
    >
      {/* Backdrop */}
      <AnimatePresence>
        {(showFacialScanPopup || showVitalSignsDisplay || showAppointmentModal ||
          showPaymentModal || showBookingConfirmationModal || showDoctorModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Avatar */}
      <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full p-[4px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{ background: "conic-gradient(from 0deg,#ff69b4,#8a8af1,#f5cba7,#ff69b4)" }}
        />
        <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg">
          <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
            <directionalLight position={[2, 5, 3]} intensity={1.2} />
            <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1.2} />
            <OrbitControls enableZoom={false} />
            <NurseAvatar isSpeaking={isSpeaking} isConnected={isConnected} phoneme={phoneme} />
          </Canvas>
        </div>
      </div>

      {/* Controls */}
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {status === "connected" && (
        <p className="text-green-600 mb-2">{isSpeaking ? "Cira is speaking..." : "Listening..."}</p>
      )}

      {isConnected ? (
        <div className="flex gap-4 mt-2">
          <button onClick={handleEndConversation} className="bg-red-600 text-white p-3 rounded-full">
            <MicOff />
          </button>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-green-500"} text-white`}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>
      ) : (
        <button
          onClick={handleStartConversation}
          disabled={!hasPermission}
          className={`mt-6 flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium ${
            hasPermission ? "bg-gradient-to-r from-pink-500 to-pink-600" : "bg-gray-400"
          }`}
        >
          <PhoneOff className="w-5 h-5" />
          <span>Start Conversation</span>
        </button>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showDoctorPopUp && currentStep === "doctor_popup" && (
          <DoctorRecommendationPopUp
            condition={recommendationData.condition}
            recommendedSpecialty={recommendationData.recommendedSpecialty}
            onFindDoctor={handleFindDoctor}
            onSkip={handleSkipDoctor}
          />
        )}

        {showFacialScanPopup && currentStep === "facial_scan" && (
          <WelcomeScanModal
            onAccept={() => {
              handleScanAccept();
              handleScanCompleted(); // ✅ Opens doctor modal directly
            }}
            onDecline={() => setShowFacialScanPopup(false)}
            isScanning={isScanning}
          />
        )}

        {showDoctorModal && currentStep === "choose_doctor" && (
          <DoctorRecommendationModal
            onClose={() => setShowDoctorModal(false)}
            onDoctorSelected={(doctor) => {
              handleDoctorSelected(doctor);
              setSelectedDoctor(doctor);
              // ✅ Move to appointment step automatically
              setShowDoctorModal(false);
              setShowAppointmentModal(true);
              setCurrentStep("appointment");
            }}
            isSelectionMode={true}
          />
        )}

        {showAppointmentModal && currentStep === "appointment" && (
          <AppointmentModal
            doctor={selectedDoctor}
            onClose={() => setShowAppointmentModal(false)}
            onBookingSuccess={(bookingData) => {
              handleAppointmentBooked(bookingData);
              setBookingDetails(bookingData);
              // ✅ Move to confirmation step automatically
              setShowAppointmentModal(false);
              setShowBookingConfirmationModal(true);
              setCurrentStep("confirmation");
            }}
            onBack={() => {
              setShowAppointmentModal(false);
              setShowDoctorModal(true);
              setCurrentStep("choose_doctor");
            }}
          />
        )}

        {showPaymentModal && currentStep === "payment" && (
          <PaymentModal
            doctor={selectedDoctor}
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => goToNextStep("appointment")}
          />
        )}

        {showBookingConfirmationModal && currentStep === "confirmation" && (
          <BookingConfirmationModal
            bookingDetails={bookingDetails}
            onClose={() => {
              setShowBookingConfirmationModal(false);
              setCurrentStep(""); // reset
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useEffect, useState, useRef } from "react";
import { useConversation } from "@11labs/react";
import {
  TestTube,
  StopCircle,
  Play,
  Pause,
  Rocket,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import NurseAvatar from "./nurseAvatar/NurseAvatar";

// Import modals
import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import PaymentModal from "./modal/PaymentModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import FacialScanModal from "./modal/FacialScanModal";
import TermsAndConditionsModal from "./modal/TermsAndConditionsModal";

import { useModalLogic } from "./modal/modalHooks";

export default function CiraAssistant() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneme, setPhoneme] = useState(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [showEndOfConversationPopup, setShowEndOfConversationPopup] =
    useState(false);
  const [isAutoStarting, setIsAutoStarting] = useState(false);

  const lastSpokenText = useRef("");

  const {
    showDoctorRecommendationPopUp,
    showFacialScanPopUp,
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
    resetModalStates,
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
    isAnyModalOpen,
  } = useModalLogic();

  // 🧠 Setup conversation with ElevenLabs
  const conversation = useConversation({
    clientTools: {
      openModal: async (params) => {
        const {
          showDoctorRecommendationPopup,
          condition = "your health concerns",
          specialty = "General Physician",
        } = params || {};

        if (showDoctorRecommendationPopup) {
          triggerDoctorRecommendationPopUp(condition, specialty);
          setShowEndOfConversationPopup(true);

          await conversation.endSession();
          setIsConnected(false);
          setConversationEnded(false);
          setShowEndOfConversationPopup(false);
          return { success: true, opened: "doctor_popup" };
        }

        return { success: true, opened: null };
      },
    },
    onConnect: () => {
      console.log("✅ Connected");
      setConversationEnded(false);
      setShowEndOfConversationPopup(false);
      lastSpokenText.current = "";
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected");
      setIsConnected(false);
      setConversationEnded(true);
    },
    onSpeakStart: (data) => {
      if (data?.text) lastSpokenText.current = data.text;
    },
    onSpeakEnd: async () => {
      const phrase = lastSpokenText.current.toLowerCase();
      if (
        phrase.includes("book an appointment") ||
        phrase.includes("see a doctor") ||
        phrase.includes("visit a doctor")
      ) {
        triggerDoctorRecommendationPopUp("your health concerns", "General Physician");
        setShowEndOfConversationPopup(true);
        await conversation.endSession();
        setIsConnected(false);
        setConversationEnded(false);
        setShowEndOfConversationPopup(false);
      }
    },
    onPhoneme: (p) => {
      setPhoneme(p);
      setTimeout(() => setPhoneme(null), 80);
    },
    onError: (err) => {
      console.error("Conversation error:", err);
      setErrorMessage("Conversation error occurred");
    },
  });

  const { status, isSpeaking } = conversation;

  // 🎤 Microphone permission
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

  // 🚀 Start conversation
  const handleStartConversationDirectly = async () => {
    try {
      setIsMuted(false);
      console.log("🎬 Starting conversation...");
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
      await conversation.setVolume({ volume: 1 });
      setIsConnected(true);
      setShowEndOfConversationPopup(false);
    } catch (err) {
      console.error("❌ Failed to start conversation:", err);
      setErrorMessage("Failed to start conversation");
    }
  };

  // 🔇 Mute toggle (simulate pause/resume behavior)
const toggleMute = async () => {
  try {
    const newMuteState = !isMuted;

    if (newMuteState) {
      // Stop listening + mute voice output
      await conversation.setVolume({ volume: 0 });
      if (conversation?.stopListening) await conversation.stopListening();
      console.log("🔇 Conversation muted (paused)");
    } else {
      // Resume listening + unmute
      await conversation.setVolume({ volume: 1 });
      if (conversation?.startListening) await conversation.startListening();
      console.log("🔊 Conversation resumed");
    }

    setIsMuted(newMuteState);
  } catch (err) {
    console.error("Failed to toggle mute:", err);
  }
};


  // 🛑 End conversation manually
  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      setConversationEnded(false);
      setShowEndOfConversationPopup(false);
    } catch (err) {
      console.error("❌ Failed to end conversation:", err);
      setErrorMessage("Failed to end conversation");
    }
  };

  // Auto-start conversation immediately after accepting terms
  useEffect(() => {
    if (hasAgreed && isAutoStarting) {
      const start = async () => {
        await handleStartConversationDirectly();
        setIsAutoStarting(false);
      };
      start();
    }
  }, [hasAgreed, isAutoStarting]);

  // 🧪 Test modal manually
  const handleTestFlow = () => {
    resetModalStates();
    triggerDoctorRecommendationPopUp("test condition", "Test Specialist");
    setShowEndOfConversationPopup(true);
    setTimeout(() => {
      setIsConnected(false);
      setConversationEnded(false);
      setShowEndOfConversationPopup(false);
    }, 3000);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
      }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-x-hidden"
    >
      {/* Avatar */}
{/* Avatar Section with Always-Visible Ring */}
<div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
  {/* 🌈 Dynamic Animated Ring */}
<motion.div
  className="absolute inset-0 rounded-full p-[4px]"
  animate={
    isMuted
      ? {
          scale: [1.0, 0.95],
          opacity: [0.9, 0.7],
        }
      : !isConnected
      ? {
          scale: [0.95, 1.02, 0.95], // 🔹 tiny smooth pulse (very subtle)
          opacity: [1, 0.85, 0], // slow fade away
        }
      : {
          rotate: 360,
          opacity: 1,
          scale: 1,
        }
  }
  transition={
    isMuted
      ? {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }
      : !isConnected
      ? {
          duration: 8, // ⏳ very slow and smooth
          ease: "easeInOut",
          repeat: Infinity, // fades once
        }
      : {
          rotate: {
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          },
        }
  }
  style={{
    background: isMuted
      ? "conic-gradient(from 0deg, #b399ff, #d4c8ff, #b399ff)"
      : !isConnected
      ? "conic-gradient(from 0deg, #b3d8ff, #f3b7ff, #b3d8ff)"
      : isSpeaking
      ? "conic-gradient(from 0deg, #ff4fa3, #ff9ed8, #ff4fa3)"
      : "conic-gradient(from 0deg, #00c88f, #72f0c7, #00c88f)",
    filter: "blur(0.5px)",
    opacity: 1,
    boxShadow: !isConnected
      ? "0 0 25px rgba(255, 200, 255, 0.5)"
      : "0 0 15px rgba(255, 255, 255, 0.5)",
  }}
/>


  {/* 🩷 Avatar Canvas */}
  <div
    className={`relative h-[280px] w-[280px] rounded-full overflow-hidden shadow-xl transition-all duration-700 ${
      isMuted ? "bg-gray-100" : "bg-pink-50"
    }`}
  >
    <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
      <directionalLight position={[2, 5, 3]} intensity={1.2} />
      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0xffe0f0}
        intensity={0.6}
      />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <OrbitControls enableZoom={false} />
      <NurseAvatar
        isSpeaking={isSpeaking && !isMuted}
        isConnected={isConnected}
        phoneme={phoneme}
        isMuted={isMuted}
      />
    </Canvas>
  </div>
</div>

{/* 🩵 Assistant Status Indicator */}
{status === "connected" && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    key={isMuted ? "paused" : isSpeaking ? "speaking" : "listening"}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="mb-2"
  >
    {isMuted ? (
      <p className="text-gray-600 font-medium flex items-center justify-center gap-2 transition-colors duration-500">
        🔇 <span>Cira is paused</span>
      </p>
    ) : isSpeaking ? (
      <p className="text-pink-600 font-medium flex items-center justify-center gap-2 animate-pulse transition-colors duration-500">
        🗣️ <span>Cira is speaking...</span>
      </p>
    ) : (
      <p className="text-green-600 font-medium flex items-center justify-center gap-2 transition-colors duration-500">
        🎧 <span>Cira is listening...</span>
      </p>
    )}
  </motion.div>
)}



      {showEndOfConversationPopup && (
        <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Consultation Complete
        </div>
      )}

      {/* Controls */}
      {isConnected && !showEndOfConversationPopup && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleEndConversation}
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
          >
            <StopCircle />
          </button>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90 transition-colors`}
          >
            {isMuted ? <Play /> : <Pause />}
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {!isConnected && hasAgreed && !conversationEnded && !isAutoStarting && (
          <button
            onClick={handleStartConversationDirectly}
            disabled={!hasPermission}
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
              hasPermission
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Rocket className="w-5 h-5" />
            <span className="text-lg">Start Conversation</span>
          </button>
        )}

        <button
          onClick={handleTestFlow}
          className="flex items-center gap-2 rounded-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <TestTube className="w-5 h-5" />
          <span className="text-lg">Test Modal Flow</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {!hasAgreed && (
          <TermsAndConditionsModal
            onAccept={() => {
              setHasAgreed(true);
              setIsAutoStarting(true);
            }}
          />
        )}

        {showDoctorRecommendationPopUp && (
          <DoctorRecommendationPopUp
            condition={doctorRecommendationData?.condition || "your health concerns"}
            recommendedSpecialty={doctorRecommendationData?.specialty || "General Physician"}
            onFindDoctor={handleFindSpecialistDoctor}
            onSkip={handleSkipDoctorRecommendation}
          />
        )}

        {showFacialScanPopUp && (
          <FacialScanModal
            onStartScan={handleStartFacialScan}
            onSkipScan={handleSkipFacialScan}
            isScanning={isScanning}
          />
        )}

        {showVitals && vitalsData && (
          <VitalSignsDisplay
            vitals={vitalsData}
            onClose={handleContinueFromVitals}
             onStartConversation={handleContinueFromVitals}
          />
        )}

        {showDoctorRecommendation && doctorRecommendationData && (
          <DoctorRecommendationModal
            condition={doctorRecommendationData.condition}
            recommendedSpecialty={doctorRecommendationData.specialty}
            onSelectDoctor={handleSelectDoctor}
            onSkip={handleSkipDoctor}
          />
        )}

        {showPayment && selectedDoctor && (
          <PaymentModal
            doctor={selectedDoctor}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handlePaymentBack}
          />
        )}

        {showAppointment && selectedDoctor && (
          <AppointmentModal
            doctor={selectedDoctor}
            onBookingSuccess={handleBookingSuccess}
            onBack={handleAppointmentBack}
          />
        )}

        {showConfirmation && bookingDetails && (
          <BookingConfirmationModal
            bookingDetails={bookingDetails}
            onClose={handleConfirmationClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

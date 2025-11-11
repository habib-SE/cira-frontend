// import React, { useEffect, useState, useRef } from "react";
// import { useConversation } from "@11labs/react";
// import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { motion, AnimatePresence } from "framer-motion";
// import NurseAvatar from "./nurseAvatar/NurseAvatar";

// // Import modals and pop-ups
// import VitalSignsDisplay from "./modal/VitalSignsDisplay";
// import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
// import PaymentModal from "./modal/PaymentModal";
// import AppointmentModal from "./modal/AppointmentModal";
// import BookingConfirmationModal from "./modal/BookingConfirmationModal";
// import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
// import FacialScanPopUp from "./modal/FacialScanPopUp";
// import { useModalLogic } from "./modal/modalHooks";

// export default function CiraAssistant() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [phoneme, setPhoneme] = useState(null);
//   const [conversationEnded, setConversationEnded] = useState(false);
//   const [showEndOfConversationPopup, setShowEndOfConversationPopup] = useState(false);

//   // Ref to store the last spoken text (for fallback detection)
//   const lastSpokenText = useRef("");

//   const {
//     showDoctorRecommendationPopUp,
//     showFacialScanPopUp,
//     isScanning,
//     showVitals,
//     vitalsData,
//     showDoctorRecommendation,
//     showPayment,
//     showAppointment,
//     showConfirmation,
//     selectedDoctor,
//     bookingDetails,
//     doctorRecommendationData,
//     resetModalStates,
//     triggerDoctorRecommendationPopUp,
//     handleFindSpecialistDoctor,
//     handleSkipDoctorRecommendation,
//     handleStartFacialScan,
//     handleSkipFacialScan,
//     handleContinueFromVitals,
//     handleSelectDoctor,
//     handleSkipDoctor,
//     handlePaymentSuccess,
//     handlePaymentBack,
//     handleBookingSuccess,
//     handleAppointmentBack,
//     handleConfirmationClose,
//     isAnyModalOpen,
//   } = useModalLogic();

//   const conversation = useConversation({
//     clientTools: {
//       openModal: async (params) => {
//         const {
//           showDoctorRecommendationPopup,
//           condition = "your health concerns",
//           specialty = "General Physician",
//         } = params || {};

//         if (showDoctorRecommendationPopup) {
//           await conversation.endSession();
//           // await conversation.interrupt();
//       setIsConnected(false);
//       setConversationEnded(true);
//           setShowEndOfConversationPopup(true);
//           triggerDoctorRecommendationPopUp(condition, specialty);
//           return { success: true, opened: "doctor_popup" };
//         }
//         return { success: true, opened: null };
//       },
//     },
//     onConnect: () => {
//       console.log("✅ Connected");
//       setConversationEnded(false);
//       setShowEndOfConversationPopup(false);
//       lastSpokenText.current = "";
//     },
//     onDisconnect: () => {
//       console.log("🔌 Disconnected");
//       setIsConnected(false);
//       setConversationEnded(true);
//     },
//     onSpeakStart: (data) => {
//       if (data?.text) {
//         lastSpokenText.current = data.text;
//         console.log("🗣 Speaking:", data.text);
//       }
//     },
//     onSpeakEnd: async () => {
//       console.log("🔇 Speaking ended. Last phrase:", lastSpokenText.current);

//       // 🔥 Fallback: if last spoken phrase includes doctor recommendation cue
//       const phrase = lastSpokenText.current.toLowerCase();
//       if (
//         phrase.includes("please book an appointment with a doctor") ||
//         phrase.includes("book an appointment with a doctor") ||
//         phrase.includes("see a doctor") ||
//         phrase.includes("visit a doctor")
//       ) {
//         console.log("🩺 Auto-triggering Doctor Recommendation Popup (fallback triggered)");
//         setShowEndOfConversationPopup(true);
//         triggerDoctorRecommendationPopUp("your health concerns", "General Physician");
//         await conversation.stopSpeaking();
//       }
//     },
//     onPhoneme: (p) => {
//       setPhoneme(p);
//       setTimeout(() => setPhoneme(null), 80);
//     },
//     onError: (error) => {
//       console.error("Conversation error:", error);
//       setErrorMessage("Conversation error occurred");
//     },
//   });

//   const { status, isSpeaking } = conversation;

//   // Microphone access check
//   useEffect(() => {
//     (async () => {
//       try {
//         await navigator.mediaDevices.getUserMedia({ audio: true });
//         setHasPermission(true);
//       } catch {
//         setErrorMessage("Microphone access denied");
//       }
//     })();
//   }, []);

//   const handleStartConversationDirectly = async () => {
//     try {
//       console.log("Starting conversation...");
//       await conversation.startSession({
//         agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
//       });
//       await conversation.setVolume({ volume: 1 });
//       setIsConnected(true);
//       setShowEndOfConversationPopup(false);
//     } catch (err) {
//       console.error("Failed to start conversation:", err);
//       setErrorMessage("Failed to start conversation");
//     }
//   };

//   const handleStartConversation = async () => {
//     resetModalStates();
//     setShowEndOfConversationPopup(false);
//     await handleStartConversationDirectly();
//   };

//   const handleEndConversation = async () => {
//     try {
//       console.log("Ending conversation...");
//       await conversation.endSession();
//       setIsConnected(false);
//       setConversationEnded(false);
//       setShowEndOfConversationPopup(false);
//     } catch (err) {
//       console.error("Failed to end conversation:", err);
//       setErrorMessage("Failed to end conversation");
//     }
//   };

//   const toggleMute = async () => {
//     try {
//       await conversation.setVolume({ volume: isMuted ? 1 : 0 });
//       setIsMuted(!isMuted);
//     } catch (err) {
//       console.error("Failed to change volume:", err);
//     }
//   };

//   const handleFindSpecialistDoctorOverride = () => {
//     setShowEndOfConversationPopup(false);
//     handleFindSpecialistDoctor();
//   };

//   const handleSkipDoctorRecommendationOverride = () => {
//     setShowEndOfConversationPopup(false);
//     handleSkipDoctorRecommendation();
//   };

//   return (
//     <div
//       style={{
//         background:
//           "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
//       }}
//       className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative"
//     >
//       <AnimatePresence>
//         {isAnyModalOpen() && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//           />
//         )}
//       </AnimatePresence>

//       <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
//         <motion.div
//           className="absolute inset-0 rounded-full p-[4px]"
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
//           style={{
//             background:
//               "conic-gradient(from 0deg,#ff69b4,#8a8af1,#f5cba7,#ff69b4)",
//           }}
//         />
//         <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg">
//           <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
//             <directionalLight position={[2, 5, 3]} intensity={1.2} />
//             <hemisphereLight
//               skyColor={0xffffff}
//               groundColor={0xffe0f0}
//               intensity={0.6}
//             />
//             <directionalLight position={[3, 5, 2]} intensity={1.2} />
//             <OrbitControls enableZoom={false} />
//             <NurseAvatar
//               isSpeaking={isSpeaking}
//               isConnected={isConnected}
//               phoneme={phoneme}
//             />
//           </Canvas>
//         </div>
//       </div>

//       {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

//       {status === "connected" && (
//         <p className="text-green-600 mb-2">
//           {isSpeaking ? "Cira is speaking..." : "Cira is listening..."}
//         </p>
//       )}

//       {showEndOfConversationPopup && (
//         <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//           Consultation Complete
//         </div>
//       )}

//       {isConnected && !showEndOfConversationPopup && (
//         <div className="flex gap-4 mt-2">
//           <button
//             onClick={handleEndConversation}
//             className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
//           >
//             <MicOff />
//           </button>
//           <button
//             onClick={toggleMute}
//             className={`p-3 rounded-full ${
//               isMuted ? "bg-red-500" : "bg-green-500"
//             } text-white hover:opacity-90 transition-colors`}
//           >
//             {isMuted ? <VolumeX /> : <Volume2 />}
//           </button>
//         </div>
//       )}

//       {!isConnected && !conversationEnded && (
//         <button
//           onClick={handleStartConversation}
//           disabled={!hasPermission}
//           className={`flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
//             hasPermission
//               ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           <PhoneOff className="w-5 h-5" />
//           <span className="text-lg">Start Conversation</span>
//         </button>
//       )}

//       {showEndOfConversationPopup && (
//         <button
//           onClick={handleStartConversation}
//           disabled={!hasPermission}
//           className={`flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
//             hasPermission
//               ? "bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 hover:shadow-lg active:scale-95"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           <PhoneOff className="w-5 h-5" />
//           <span className="text-lg">Start New Conversation</span>
//         </button>
//       )}

//       <AnimatePresence>
//        {/* STEP 1: Doctor Recommendation Pop-up */}
// {showDoctorRecommendationPopUp && (
//   <DoctorRecommendationPopUp
//     condition={doctorRecommendationData?.condition || "your health concerns"}
//     recommendedSpecialty={doctorRecommendationData?.specialty || "General Physician"}
//     onFindDoctor={handleFindSpecialistDoctorOverride}
//     onSkip={handleSkipDoctorRecommendationOverride}
//   />
// )}


//         {showFacialScanPopUp && (
//           <FacialScanPopUp
//             onStartScan={handleStartFacialScan}
//             onSkipScan={handleSkipFacialScan}
//             isScanning={isScanning}
//           />
//         )}

//         {showVitals && vitalsData && (
//           <VitalSignsDisplay
//             vitals={vitalsData}
//             onClose={handleContinueFromVitals}
//             onStartConversation={handleContinueFromVitals}
//           />
//         )}

//         {showDoctorRecommendation && doctorRecommendationData && (
//           <DoctorRecommendationModal
//             condition={doctorRecommendationData.condition}
//             recommendedSpecialty={doctorRecommendationData.specialty}
//             onSelectDoctor={handleSelectDoctor}
//             onSkip={handleSkipDoctor}
//           />
//         )}

//         {showPayment && selectedDoctor && (
//           <PaymentModal
//             doctor={selectedDoctor}
//             onPaymentSuccess={handlePaymentSuccess}
//             onBack={handlePaymentBack}
//           />
//         )}

//         {showAppointment && selectedDoctor && (
//           <AppointmentModal
//             doctor={selectedDoctor}
//             onBookingSuccess={handleBookingSuccess}
//             onBack={handleAppointmentBack}
//           />
//         )}

//         {showConfirmation && bookingDetails && (
//           <BookingConfirmationModal
//             bookingDetails={bookingDetails}
//             onClose={handleConfirmationClose}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX, TestTube } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import NurseAvatar from "./nurseAvatar/NurseAvatar";

// Import modals and pop-ups
import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import PaymentModal from "./modal/PaymentModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import { useModalLogic } from "./modal/modalHooks";
import FacialScanModal from "./modal/FacialScanModal";
import TermsAndConditionsModal from "./modal/TermsAndConditionsModal";

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

  // 🧠 Conversation setup
  const conversation = useConversation({
    clientTools: {
      openModal: async (params) => {
        const {
          showDoctorRecommendationPopup,
          condition = "your health concerns",
          specialty = "General Physician",
        } = params || {};

        if (showDoctorRecommendationPopup) {
          // 🩺 End conversation after showing popup (3s delay)
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
      if (data?.text) {
        lastSpokenText.current = data.text;
        console.log("🗣 Speaking:", data.text);
      }
    },
    onSpeakEnd: async () => {
      console.log("🔇 Speaking ended. Last phrase:", lastSpokenText.current);

      const phrase = lastSpokenText.current.toLowerCase();
      if (
        phrase.includes("please book an appointment with a doctor") ||
        phrase.includes("book an appointment with a doctor") ||
        phrase.includes("see a doctor") ||
        phrase.includes("visit a doctor")
      ) {
        console.log(
          "🩺 Auto-triggering Doctor Recommendation Popup (fallback triggered)"
        );
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
    onError: (error) => {
      console.error("Conversation error:", error);
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
      console.log("Starting conversation...");
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
      await conversation.setVolume({ volume: 1 });
      setIsConnected(true);
      setShowEndOfConversationPopup(false);
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setErrorMessage("Failed to start conversation");
    }
  };

  const handleStartConversation = async () => {
    resetModalStates();
    setShowEndOfConversationPopup(false);
    await handleStartConversationDirectly();
  };

  // 🛑 End conversation manually
  const handleEndConversation = async () => {
    try {
      console.log("Ending conversation...");
      await conversation.endSession();
      setIsConnected(false);
      setConversationEnded(false);
      setShowEndOfConversationPopup(false);
    } catch (err) {
      console.error("Failed to end conversation:", err);
      setErrorMessage("Failed to end conversation");
    }
  };

  // 🔇 Mute toggle
  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Failed to change volume:", err);
    }
  };

  const handleFindSpecialistDoctorOverride = () => {
    setShowEndOfConversationPopup(false);
    handleFindSpecialistDoctor();
  };

  const handleSkipDoctorRecommendationOverride = () => {
    setShowEndOfConversationPopup(false);
    handleSkipDoctorRecommendation();
  };

  // 🧪 Test modal manually
  const handleTestFlow = () => {
    console.log("🧪 Testing modal flow...");
    resetModalStates();
    triggerDoctorRecommendationPopUp("test health condition", "Test Specialist");
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
      <AnimatePresence>
        {isAnyModalOpen() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>

      {/* Avatar */}
      <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full p-[4px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg,#ff69b4,#8a8af1,#f5cba7,#ff69b4)",
          }}
        />
        <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg">
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
              isSpeaking={isSpeaking}
              isConnected={isConnected}
              phoneme={phoneme}
            />
          </Canvas>
        </div>
      </div>

      {/* Status */}
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {status === "connected" && (
        <p className="text-green-600 mb-2">
          {isSpeaking ? "Cira is speaking..." : "Cira is listening..."}
        </p>
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
            <MicOff />
          </button>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90 transition-colors`}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-4">
        {!isConnected && (
          <button
            onClick={handleStartConversation}
            disabled={!hasPermission}
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
              hasPermission
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-lg">
              {conversationEnded ? "Start New Conversation" : "Start Conversation"}
            </span>
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
      {/* 🪟 Transparent Terms Modal appears on top */}
      <AnimatePresence>
        {!hasAgreed && (
          <TermsAndConditionsModal onAccept={() => setHasAgreed(true)} />
        )}
        {showDoctorRecommendationPopUp && (
          <DoctorRecommendationPopUp
            condition={doctorRecommendationData?.condition || "your health concerns"}
            recommendedSpecialty={doctorRecommendationData?.specialty || "General Physician"}
            onFindDoctor={handleFindSpecialistDoctorOverride}
            onSkip={handleSkipDoctorRecommendationOverride}
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

// import React, { useEffect, useState } from "react";
// import { useConversation } from "@11labs/react";
// import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
// import { motion } from "framer-motion";
// import {
//   useRive,
//   useStateMachineInput,
//   useViewModel,
//   useViewModelInstance,
//   useViewModelInstanceColor,
// } from "@rive-app/react-canvas";
// import orbFile from "../assets/orb.riv";

// const CiraAssistant = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [glowColor, setGlowColor] = useState("rgb(237, 90, 188)"); // 🌸 pink glow

//   // 🎙 ask mic permission
//   useEffect(() => {
//     const requestMicPermission = async () => {
//       try {
//         await navigator.mediaDevices.getUserMedia({ audio: true });
//         setHasPermission(true);
//       } catch {
//         setErrorMessage("Microphone access denied");
//       }
//     };
//     requestMicPermission();
//   }, []);

//   // 💬 ElevenLabs conversation
//   const conversation = useConversation({
//     onConnect: () => console.log("✅ Connected"),
//     onDisconnect: () => console.log("🔌 Disconnected"),
//     onSpeakStart: () => console.log("🗣 Speaking..."),
//     onSpeakEnd: () => console.log("🔇 Done speaking"),
//     onMessage: (m) => console.log("💬 Assistant:", m.message),
//   });

//   const { status, isSpeaking } = conversation;

//   const handleStartConversation = async () => {
//     try {
//       await conversation.startSession({
//         agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
//       });
//       await conversation.setVolume({ volume: 1 });
//       setIsConnected(true);
//     } catch (err) {
//       console.error("Error starting conversation:", err);
//       setErrorMessage("Failed to start conversation");
//     }
//   };

//   const handleEndConversation = async () => {
//     try {
//       await conversation.endSession();
//       setIsConnected(false);
//     } catch {
//       setErrorMessage("Failed to end conversation");
//     }
//   };

//   const toggleMute = async () => {
//     try {
//       await conversation.setVolume({ volume: isMuted ? 1 : 0 });
//       setIsMuted(!isMuted);
//     } catch {
//       setErrorMessage("Failed to change volume");
//     }
//   };

//   // 🟣 Rive orb setup
//   const stateMachine = "default";
//   const { rive, RiveComponent } = useRive({
//     src: orbFile,
//     stateMachines: stateMachine,
//     autoplay: true,
//   });

//   // 🟢 make orb fully pink (remove blue)
//   const viewModel = useViewModel(rive, { useDefault: true });
//   const viewModelInstance = useViewModelInstance(viewModel, {
//     rive,
//     useDefault: true,
//   });
//   const { setRgb } = useViewModelInstanceColor("color", viewModelInstance);

//   useEffect(() => {
//     if (setRgb) {
//       // 🌸 full pink
//       setRgb(237 / 255, 90 / 255, 188 / 255);
//     }
//   }, [setRgb]);

//   const listeningInput = useStateMachineInput(rive, stateMachine, "listening");
//   const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");

//   useEffect(() => {
//     if (listeningInput) listeningInput.value = status === "connected" && !isSpeaking;
//     if (speakingInput) speakingInput.value = isSpeaking;
//   }, [status, isSpeaking, listeningInput, speakingInput]);

//   return (
//     <div style={{
//       background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)'}} className="flex flex-col items-center justify-center min-h-screen text-center p-6">
//       {/* Orb + glowing background */}
//       <div className="relative h-84 w-96 mb-6 flex items-center justify-center">
//         <motion.div
//           className="absolute inset-0 z-0 rounded-full blur-[20px]"
//           // style={{ background: glowColor }}
//           animate={{
//             scale: [0.9, 0.9, 0.9],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//         <RiveComponent className="h-full w-full" />
//       </div>

//       {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
//       {status === "connected" && (
//         <p className="text-green-600 mb-2">
//           {isSpeaking ? "Speaking..." : "Listening..."}
//         </p>
//       )}

//       <div className="flex gap-4 mt-2">
//         {isConnected ? (
//           <>
//             <button
//               onClick={handleEndConversation}
//               className="bg-red-600 text-white p-3 rounded-full"
//               title="End Conversation"
//             >
//               <MicOff />
//             </button>
//             <button
//               onClick={toggleMute}
//               className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-green-500"
//                 } text-white`}
//               title={isMuted ? "Unmute" : "Mute"}
//             >

//               {isMuted ? <VolumeX /> : <Volume2 />}
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={handleStartConversation}
//             disabled={!hasPermission}
//             title="Start Conversation"
//             className={`mt-8 flex items-center gap-1 rounded-full px-3 py-3 text-white font-medium transition-all duration-300
//     ${hasPermission
//                 ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
//                 : "bg-gray-400 cursor-not-allowed"
//               }`}
//           >
//             <PhoneOff className="w-5 h-5" />
//             <span className="text-xl">Start</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CiraAssistant;

// import React, { useEffect, useRef, useState } from "react";
// import { useConversation } from "@11labs/react";
// import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
// import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "three";
// import { motion } from "framer-motion";

// function NurseAvatar({ isSpeaking, isConnected }) {
//   const avatar = useLoader(GLTFLoader, "/nurse6.glb");
//   const blinkTimer = useRef(0);
//   const isBlinking = useRef(false);
//   const mouthOpenRef = useRef(0);
//   const headRef = useRef();
//   const speechTimer = useRef(0);
//   const lastSpeechChange = useRef(0);
//   const speechIntensity = useRef(0);

//   // Change clothes to full blue and add sunlight effect
//   useEffect(() => {
//     avatar.scene.traverse((child) => {
//       if (child.isMesh) {
//         // Full blue clothes
//         if (
//           child.name === "Wolf3D_Outfit_Top" ||
//           child.name === "Wolf3D_Outfit_Bottom" ||
//           child.name === "Wolf3D_Outfit_Footwear"
//         ) {
//           if (child.material.map) child.material.map = null;
//           child.material.color = new THREE.Color("#8a8af1");
//           child.material.roughness = 0.4;
//           child.material.metalness = 0.1;
//           child.material.needsUpdate = true;
//         }

//         // Hair shine
//         if (child.name === "Wolf3D_Hair") {
//           child.material.metalness = 0.5;
//           child.material.roughness = 0.2;
//           child.material.needsUpdate = true;
//         }

//         // Face/body enhancement for sunlight
//         if (child.name === "Wolf3D_Body") {
//           child.material.metalness = 0.05;
//           child.material.roughness = 0.4;
//           child.material.needsUpdate = true;
//         }
//       }
//     });
//   }, [avatar]);

//   // Reset mouth when conversation ends
//   useEffect(() => {
//     if (!isConnected) {
//       mouthOpenRef.current = 0;
//       speechIntensity.current = 0;
//       if (headRef.current && headRef.current.morphTargetInfluences) {
//         // Reset all mouth-related morph targets
//         for (let i = 0; i < headRef.current.morphTargetInfluences.length; i++) {
//           headRef.current.morphTargetInfluences[i] = 0;
//         }
//       }
//     }
//   }, [isConnected]);

//   useFrame((_, delta) => {
//     if (!headRef.current) {
//       const head = avatar.scene.getObjectByName("Wolf3D_Head");
//       if (head && head.morphTargetInfluences) headRef.current = head;
//     }

//     if (headRef.current && headRef.current.morphTargetInfluences) {
//       speechTimer.current += delta;
      
//       if (isConnected && isSpeaking) {
//         // Gradually increase speech intensity when speaking starts
//         speechIntensity.current = Math.min(speechIntensity.current + delta * 2, 1);
        
//         // More natural speech pattern with varied mouth movements
//         if (speechTimer.current - lastSpeechChange.current > 0.12 + Math.random() * 0.1) {
//           // Create more varied mouth shapes for different speech sounds
//           const speechPattern = Math.sin(speechTimer.current * 7) * 0.4 + 0.4;
//           mouthOpenRef.current = Math.min(speechPattern, 0.6);
//           lastSpeechChange.current = speechTimer.current;
//         }
//       } else {
//         // Gradually decrease speech intensity when not speaking
//         speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
//         // Smoothly close mouth when not speaking
//         mouthOpenRef.current = Math.max(mouthOpenRef.current - delta * 3, 0);
//       }
      
//       // Apply mouth movement to mouth-related morph targets
//       // These indices might need adjustment based on your specific model
//       const mouthOpenIndex = 0;     // Typically the mouthOpen morph target
//       const mouthCloseIndex = 1;    // Often the mouthClose
//       const mouthSmileIndex = 2;    // Smile - we'll reduce this significantly
//       const mouthFrownIndex = 3;    // Frown
//       const aaSoundIndex = 4;       // Often the "Ah" sound
//       const eeSoundIndex = 5;       // Often the "Ee" sound
//       const ooSoundIndex = 6;       // Often the "Oo" sound
      
//       // Cycle through different mouth shapes for more natural speech
//       const speechPhase = speechTimer.current * 6;
      
//       // Mouth open/close - primary movement
//       if (headRef.current.morphTargetInfluences[mouthOpenIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthOpenIndex] = mouthOpenRef.current * speechIntensity.current;
//       }
      
//       if (headRef.current.morphTargetInfluences[mouthCloseIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthCloseIndex] = (1 - mouthOpenRef.current) * 0.3 * speechIntensity.current;
//       }
      
//       // Drastically reduce smiling - only slight smile during speech
//       if (headRef.current.morphTargetInfluences[mouthSmileIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthSmileIndex] = 0.1 + (isSpeaking ? 0.1 : 0);
//       }
      
//       // Vowel sounds - activate based on speech phase
//       if (headRef.current.morphTargetInfluences[aaSoundIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[aaSoundIndex] = 
//           Math.max(0, Math.sin(speechPhase) * 0.4) * speechIntensity.current;
//       }
      
//       if (headRef.current.morphTargetInfluences[eeSoundIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[eeSoundIndex] = 
//           Math.max(0, Math.sin(speechPhase + 0.7) * 0.3) * speechIntensity.current;
//       }
      
//       if (headRef.current.morphTargetInfluences[ooSoundIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[ooSoundIndex] = 
//           Math.max(0, Math.sin(speechPhase + 1.4) * 0.35) * speechIntensity.current;
//       }
      
//       // Slight frown to counterbalance smile and create more neutral expression
//       if (headRef.current.morphTargetInfluences[mouthFrownIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthFrownIndex] = 0.05;
//       }
//     }

//     // Eye blinking every ~2-4s for more natural look
//     blinkTimer.current += delta;
//     const eyeLeft = avatar.scene.getObjectByName("EyeLeft");
//     const eyeRight = avatar.scene.getObjectByName("EyeRight");

//     if (blinkTimer.current > (2 + Math.random() * 2) && !isBlinking.current) {
//       isBlinking.current = true;
//       blinkTimer.current = 0;

//       if (eyeLeft && eyeRight) {
//         eyeLeft.scale.y = 0.1;
//         eyeRight.scale.y = 0.1;
//       }

//       setTimeout(() => {
//         if (eyeLeft && eyeRight) {
//           eyeLeft.scale.y = 1;
//           eyeRight.scale.y = 1;
//         }
//         isBlinking.current = false;
//       }, 100 + Math.random() * 50); // Varied blink duration
//     }
//   });

//   return (
//     <primitive
//       object={avatar.scene}
//       scale={8}
//       position={[0, -14.7, -1]}
//       rotation={[-0.4, 0, 0]}
//     />
//   );
// }

// export default function CiraAssistant() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // mic permission
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

//   // elevenlabs
//   const conversation = useConversation({
//     onConnect: () => console.log("✅ Connected"),
//     onDisconnect: () => console.log("🔌 Disconnected"),
//     onSpeakStart: () => console.log("🗣 Speaking..."),
//     onSpeakEnd: () => console.log("🔇 Done speaking"),
//     onMessage: (m) => console.log("💬 Assistant:", m.message),
//   });

//   const { status, isSpeaking } = conversation;

//   const handleStartConversation = async () => {
//     try {
//       await conversation.startSession({
//         agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
//       });
//       await conversation.setVolume({ volume: 1 });
//       setIsConnected(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Failed to start conversation");
//     }
//   };

//   const handleEndConversation = async () => {
//     try {
//       await conversation.endSession();
//       setIsConnected(false);
//     } catch {
//       setErrorMessage("Failed to end conversation");
//     }
//   };

//   const toggleMute = async () => {
//     try {
//       await conversation.setVolume({ volume: isMuted ? 1 : 0 });
//       setIsMuted(!isMuted);
//     } catch {
//       setErrorMessage("Failed to change volume");
//     }
//   };

//   return (
//     <div
//       style={{
//         background:
//           "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
//       }}
//       className="flex flex-col items-center justify-center min-h-screen text-center p-6"
//     >
//      {/* Avatar with animated gradient border */}
// <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
//   {/* Rotating gradient ring */}
//   <motion.div
//     className="absolute inset-0 rounded-full p-[4px]"
//     animate={{ rotate: 360 }}
//     transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
//     style={{
//       background: "conic-gradient(from 0deg, #ff69b4, #8a8af1, #f5cba7, #ff69b4)",
//     }}
//   >
  
//   </motion.div>

//   {/* Static avatar container */}
//   <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg">
//     <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
//       {/* Lights */}
//       <directionalLight position={[2, 5, 3]} intensity={1.2} castShadow />
//       <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />
//       <directionalLight position={[3, 5, 2]} intensity={1.2} color={0xfff1c2} />

//       <OrbitControls enableZoom={false} />
//       <NurseAvatar isSpeaking={isSpeaking} isConnected={isConnected} />
//     </Canvas>
//   </div>
// </div>

//       {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
//       {status === "connected" && (
//         <p className="text-green-600 mb-2">{isSpeaking ? "Speaking..." : "Listening..."}</p>
//       )}

//       <div className="flex gap-4 mt-2">
//         {isConnected ? (
//           <>
//             <button
//               onClick={handleEndConversation}
//               className="bg-red-600 text-white p-3 rounded-full"
//               title="End Conversation"
//             >
//               <MicOff />
//             </button>
//             <button
//               onClick={toggleMute}
//               className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-green-500"} text-white`}
//               title={isMuted ? "Unmute" : "Mute"}
//             >
//               {isMuted ? <VolumeX /> : <Volume2 />}
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={handleStartConversation}
//             disabled={!hasPermission}
//             title="Start Conversation"
//             className={`mt-8 flex items-center gap-1 rounded-full px-3 py-3 text-white font-medium transition-all duration-300 ${
//               hasPermission
//                 ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <PhoneOff className="w-5 h-5" />
//             <span className="text-xl">Start</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


// 

import React, { useEffect, useRef, useState } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted components and hooks
import WelcomeScanModal from "./modal/WelcomeScanModal";
import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import { useModalLogic } from "./modal/modalHooks";

/**
 * Nurse Avatar with lip sync + blinking
 */
function NurseAvatar({ isSpeaking, isConnected, phoneme }) {
  const avatar = useLoader(GLTFLoader, "/nurse6.glb");
  const headRef = useRef();
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);

  const mouthOpenRef = useRef(0);
  const speechIntensity = useRef(0);

  // Phoneme → morph mapping
  const visemeMap = {
    AA: { open: 1.0, smile: 0.0 },
    AE: { open: 1.0, smile: 0.2 },
    AH: { open: 0.8, smile: 0.0 },
    AO: { open: 0.9, smile: 0.0 },
    UW: { open: 0.8, smile: 0.0 },
    EH: { open: 0.7, smile: 0.6 },
    IY: { open: 0.6, smile: 0.8 },
    IH: { open: 0.6, smile: 0.5 },
    M: { open: 0.2, smile: 0.2 },
    P: { open: 0.2, smile: 0.2 },
    B: { open: 0.2, smile: 0.2 },
    F: { open: 0.4, smile: 0.5 },
    V: { open: 0.4, smile: 0.5 },
  };

  // Style adjustments
  useEffect(() => {
    avatar.scene.traverse((child) => {
      if (child.isMesh) {
        if (
          child.name === "Wolf3D_Outfit_Top" ||
          child.name === "Wolf3D_Outfit_Bottom" ||
          child.name === "Wolf3D_Outfit_Footwear"
        ) {
          if (child.material.map) child.material.map = null;
          child.material.color = new THREE.Color("#8a8af1");
          child.material.roughness = 0.4;
          child.material.metalness = 0.1;
        }
        if (child.name === "Wolf3D_Hair") {
          child.material.metalness = 0.5;
          child.material.roughness = 0.2;
        }
        if (child.name === "Wolf3D_Body") {
          child.material.metalness = 0.05;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [avatar]);

  // Main animation loop
  useFrame((_, delta) => {
    if (!headRef.current) {
      const head = avatar.scene.getObjectByName("Wolf3D_Head");
      if (head && head.morphTargetInfluences) headRef.current = head;
    }

    if (headRef.current && headRef.current.morphTargetInfluences) {
      const morphs = headRef.current.morphTargetInfluences;

      if (!isConnected) {
        morphs[0] = THREE.MathUtils.lerp(morphs[0], 0, 0.3);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], 0, 0.3);
        speechIntensity.current = 0;
        return;
      }

      for (let i = 0; i < morphs.length; i++) {
        morphs[i] = THREE.MathUtils.lerp(morphs[i], 0, 0.5);
      }

      if (phoneme && visemeMap[phoneme]) {
        const { open, smile } = visemeMap[phoneme];
        morphs[0] = THREE.MathUtils.lerp(morphs[0], open, 0.6);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], smile, 0.6);
      } else if (isSpeaking) {
        speechIntensity.current = Math.min(
          speechIntensity.current + delta * 2,
          1
        );
        mouthOpenRef.current =
          0.5 + Math.sin(Date.now() * 0.018) * 0.25;
        morphs[0] = THREE.MathUtils.lerp(
          morphs[0],
          mouthOpenRef.current * speechIntensity.current,
          0.6
        );
      } else {
        speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
        morphs[0] = THREE.MathUtils.lerp(morphs[0], 0, 0.6);
        morphs[1] = THREE.MathUtils.lerp(morphs[1], 0, 0.6);
      }
    }

    // Blinking
    blinkTimer.current += delta;
    const eyeLeft = avatar.scene.getObjectByName("EyeLeft");
    const eyeRight = avatar.scene.getObjectByName("EyeRight");

    if (blinkTimer.current > 2.5 + Math.random() * 2 && !isBlinking.current) {
      isBlinking.current = true;
      blinkTimer.current = 0;

      if (eyeLeft && eyeRight) {
        eyeLeft.scale.y = 0.1;
        eyeRight.scale.y = 0.1;
      }

      setTimeout(() => {
        if (eyeLeft && eyeRight) {
          eyeLeft.scale.y = 1;
          eyeRight.scale.y = 1;
        }
        isBlinking.current = false;
      }, 150 + Math.random() * 100);
    }
  });

  return (
    <primitive
      object={avatar.scene}
      scale={8}
      position={[0, -14.7, -1]}
      rotation={[-0.4, 0, 0]}
    />
  );
}

/**
 * Main Cira Assistant UI
 */
export default function CiraAssistant() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneme, setPhoneme] = useState(null);
  const [conversationEnded, setConversationEnded] = useState(false);

  // Use modal logic hook
  const {
    showWelcomeModal,
    isScanning,
    showVitals,
    vitalsData,
    handleScanAccept,
    handleScanDecline,
    handleCloseVitals,
    handleStartFromVitals
  } = useModalLogic();

  // Initialize conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected");
      setConversationEnded(false);
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected");
      setIsConnected(false);
      setConversationEnded(true);
    },
    onSpeakStart: () => {
      console.log("🗣 Speaking started");
    },
    onSpeakEnd: () => {
      console.log("🔇 Speaking ended");
    },
    onMessage: (m) => {
      console.log("💬 Assistant message:", m.message);
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

  // Mic permission - check when component mounts
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
      console.log("Starting conversation...");
      // Show modal again when starting conversation
      console.log("Welcome modal shown - waiting for user choice");
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setErrorMessage("Failed to start conversation");
    }
  };

  const handleStartConversationDirectly = async () => {
    try {
      console.log("Starting conversation directly...");
      
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
      await conversation.setVolume({ volume: 1 });
      setIsConnected(true);
      console.log("Conversation started successfully");
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setErrorMessage("Failed to start conversation");
    }
  };

  const handleEndConversation = async () => {
    try {
      console.log("Ending conversation...");
      await conversation.endSession();
      setIsConnected(false);
      setConversationEnded(true);
    } catch (err) {
      console.error("Failed to end conversation:", err);
      setErrorMessage("Failed to end conversation");
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Failed to change volume:", err);
      setErrorMessage("Failed to change volume");
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
      }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative"
    >
      {/* Background blur when modal is open */}
      <AnimatePresence>
        {(showWelcomeModal || showVitals) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Avatar + rotating border */}
      <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full p-[4px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg, #ff69b4, #8a8af1, #f5cba7, #ff69b4)",
          }}
        ></motion.div>

        <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg">
          <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
            <directionalLight position={[2, 5, 3]} intensity={1.2} castShadow />
            <hemisphereLight
              skyColor={0xffffff}
              groundColor={0xffe0f0}
              intensity={0.6}
            />
            <directionalLight
              position={[3, 5, 2]}
              intensity={1.2}
              color={0xfff1c2}
            />
            <OrbitControls enableZoom={false} />
            <NurseAvatar
              isSpeaking={isSpeaking}
              isConnected={isConnected}
              phoneme={phoneme}
            />
          </Canvas>
        </div>
      </div>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      
      {status === "connected" && (
        <p className="text-green-600 mb-2">
          {isSpeaking ? "Speaking..." : "Listening..."}
        </p>
      )}

      {/* Controls - Only show when conversation is active */}
      {isConnected && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleEndConversation}
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
            title="End Conversation"
          >
            <MicOff />
          </button>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90 transition-colors`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>
      )}

      {/* Start Conversation button - Only show when conversation has ended */}
      {conversationEnded && (
        <button
          onClick={handleStartConversation}
          disabled={!hasPermission}
          title="Start Conversation"
          className={`mt-8 flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
            hasPermission
              ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-lg">Start Conversation</span>
        </button>
      )}

      {/* Welcome Modal - Shows immediately on first load and when restarting conversation */}
      <AnimatePresence>
        {showWelcomeModal && (
          <WelcomeScanModal
            onAccept={() => handleScanAccept()}
            onDecline={() => handleScanDecline(handleStartConversationDirectly)}
            isScanning={isScanning}
          />
        )}
        
        {showVitals && vitalsData && (
          <VitalSignsDisplay
            vitals={vitalsData}
            onClose={handleCloseVitals}
            onStartConversation={() => handleStartFromVitals(handleStartConversationDirectly)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
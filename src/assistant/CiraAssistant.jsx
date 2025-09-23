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

import React, { useEffect, useRef, useState } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

function NurseAvatar({ isSpeaking, isConnected }) {
  const avatar = useLoader(GLTFLoader, "/nurse6.glb");
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);
  const mouthOpenRef = useRef(0);
  const headRef = useRef();
  const speechTimer = useRef(0);
  const lastSpeechChange = useRef(0);
  const speechIntensity = useRef(0);

  // Change clothes to full blue and add sunlight effect
  useEffect(() => {
    avatar.scene.traverse((child) => {
      if (child.isMesh) {
        // Full blue clothes
        if (
          child.name === "Wolf3D_Outfit_Top" ||
          child.name === "Wolf3D_Outfit_Bottom" ||
          child.name === "Wolf3D_Outfit_Footwear"
        ) {
          if (child.material.map) child.material.map = null;
          child.material.color = new THREE.Color("#8a8af1");
          child.material.roughness = 0.4;
          child.material.metalness = 0.1;
          child.material.needsUpdate = true;
        }

        // Hair shine
        if (child.name === "Wolf3D_Hair") {
          child.material.metalness = 0.5;
          child.material.roughness = 0.2;
          child.material.needsUpdate = true;
        }

        // Face/body enhancement for sunlight
        if (child.name === "Wolf3D_Body") {
          child.material.metalness = 0.05;
          child.material.roughness = 0.4;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [avatar]);

  // Reset mouth when conversation ends
  useEffect(() => {
    if (!isConnected) {
      mouthOpenRef.current = 0;
      speechIntensity.current = 0;
      if (headRef.current && headRef.current.morphTargetInfluences) {
        // Reset all mouth-related morph targets
        for (let i = 0; i < headRef.current.morphTargetInfluences.length; i++) {
          headRef.current.morphTargetInfluences[i] = 0;
        }
      }
    }
  }, [isConnected]);

  useFrame((_, delta) => {
    if (!headRef.current) {
      const head = avatar.scene.getObjectByName("Wolf3D_Head");
      if (head && head.morphTargetInfluences) headRef.current = head;
    }

    if (headRef.current && headRef.current.morphTargetInfluences) {
      speechTimer.current += delta;
      
      if (isConnected && isSpeaking) {
        // Gradually increase speech intensity when speaking starts
        speechIntensity.current = Math.min(speechIntensity.current + delta * 2, 1);
        
        // More natural speech pattern with varied mouth movements
        if (speechTimer.current - lastSpeechChange.current > 0.12 + Math.random() * 0.1) {
          // Create more varied mouth shapes for different speech sounds
          const speechPattern = Math.sin(speechTimer.current * 7) * 0.4 + 0.4;
          mouthOpenRef.current = Math.min(speechPattern, 0.6);
          lastSpeechChange.current = speechTimer.current;
        }
      } else {
        // Gradually decrease speech intensity when not speaking
        speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
        // Smoothly close mouth when not speaking
        mouthOpenRef.current = Math.max(mouthOpenRef.current - delta * 3, 0);
      }
      
      // Apply mouth movement to mouth-related morph targets
      // These indices might need adjustment based on your specific model
      const mouthOpenIndex = 0;     // Typically the mouthOpen morph target
      const mouthCloseIndex = 1;    // Often the mouthClose
      const mouthSmileIndex = 2;    // Smile - we'll reduce this significantly
      const mouthFrownIndex = 3;    // Frown
      const aaSoundIndex = 4;       // Often the "Ah" sound
      const eeSoundIndex = 5;       // Often the "Ee" sound
      const ooSoundIndex = 6;       // Often the "Oo" sound
      
      // Cycle through different mouth shapes for more natural speech
      const speechPhase = speechTimer.current * 6;
      
      // Mouth open/close - primary movement
      if (headRef.current.morphTargetInfluences[mouthOpenIndex] !== undefined) {
        headRef.current.morphTargetInfluences[mouthOpenIndex] = mouthOpenRef.current * speechIntensity.current;
      }
      
      if (headRef.current.morphTargetInfluences[mouthCloseIndex] !== undefined) {
        headRef.current.morphTargetInfluences[mouthCloseIndex] = (1 - mouthOpenRef.current) * 0.3 * speechIntensity.current;
      }
      
      // Drastically reduce smiling - only slight smile during speech
      if (headRef.current.morphTargetInfluences[mouthSmileIndex] !== undefined) {
        headRef.current.morphTargetInfluences[mouthSmileIndex] = 0.1 + (isSpeaking ? 0.1 : 0);
      }
      
      // Vowel sounds - activate based on speech phase
      if (headRef.current.morphTargetInfluences[aaSoundIndex] !== undefined) {
        headRef.current.morphTargetInfluences[aaSoundIndex] = 
          Math.max(0, Math.sin(speechPhase) * 0.4) * speechIntensity.current;
      }
      
      if (headRef.current.morphTargetInfluences[eeSoundIndex] !== undefined) {
        headRef.current.morphTargetInfluences[eeSoundIndex] = 
          Math.max(0, Math.sin(speechPhase + 0.7) * 0.3) * speechIntensity.current;
      }
      
      if (headRef.current.morphTargetInfluences[ooSoundIndex] !== undefined) {
        headRef.current.morphTargetInfluences[ooSoundIndex] = 
          Math.max(0, Math.sin(speechPhase + 1.4) * 0.35) * speechIntensity.current;
      }
      
      // Slight frown to counterbalance smile and create more neutral expression
      if (headRef.current.morphTargetInfluences[mouthFrownIndex] !== undefined) {
        headRef.current.morphTargetInfluences[mouthFrownIndex] = 0.05;
      }
    }

    // Eye blinking every ~2-4s for more natural look
    blinkTimer.current += delta;
    const eyeLeft = avatar.scene.getObjectByName("EyeLeft");
    const eyeRight = avatar.scene.getObjectByName("EyeRight");

    if (blinkTimer.current > (2 + Math.random() * 2) && !isBlinking.current) {
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
      }, 100 + Math.random() * 50); // Varied blink duration
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

export default function CiraAssistant() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // mic permission
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

  // elevenlabs
  const conversation = useConversation({
    onConnect: () => console.log("✅ Connected"),
    onDisconnect: () => console.log("🔌 Disconnected"),
    onSpeakStart: () => console.log("🗣 Speaking..."),
    onSpeakEnd: () => console.log("🔇 Done speaking"),
    onMessage: (m) => console.log("💬 Assistant:", m.message),
  });

  const { status, isSpeaking } = conversation;

  const handleStartConversation = async () => {
    try {
      await conversation.startSession({
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
      });
      await conversation.setVolume({ volume: 1 });
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to start conversation");
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
    } catch {
      setErrorMessage("Failed to end conversation");
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch {
      setErrorMessage("Failed to change volume");
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
      }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6"
    >
      {/* Avatar */}
      <div className="relative h-[300px] w-[300px] mb-6 flex items-center justify-center rounded-full border-2 border-pink-400 bg-pink-50 overflow-hidden shadow-lg">
        <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
          {/* Key light from front-left */}
          <directionalLight
            position={[2, 5, 3]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Fill light from right */}
          <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />

          {/* Warm sunlight on right side */}
          <directionalLight
            position={[3, 5, 2]}
            intensity={1.2}
            color={0xfff1c2}
            castShadow
          />

          <OrbitControls enableZoom={false} />
          <NurseAvatar isSpeaking={isSpeaking} isConnected={isConnected} />
        </Canvas>
      </div>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {status === "connected" && (
        <p className="text-green-600 mb-2">{isSpeaking ? "Speaking..." : "Listening..."}</p>
      )}

      <div className="flex gap-4 mt-2">
        {isConnected ? (
          <>
            <button
              onClick={handleEndConversation}
              className="bg-red-600 text-white p-3 rounded-full"
              title="End Conversation"
            >
              <MicOff />
            </button>
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-green-500"} text-white`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
          </>
        ) : (
          <button
            onClick={handleStartConversation}
            disabled={!hasPermission}
            title="Start Conversation"
            className={`mt-8 flex items-center gap-1 rounded-full px-3 py-3 text-white font-medium transition-all duration-300 ${
              hasPermission
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xl">Start</span>
          </button>
        )}
      </div>
    </div>
  );
}
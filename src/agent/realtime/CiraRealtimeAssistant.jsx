// import React, { useEffect, useRef, useState } from "react";
// import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
// import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "three";
// import { motion } from "framer-motion";
// import useRealtimeAgent from "./useRealtimeAgent";

// // === 3D Avatar ===
// function NurseAvatar({ isSpeaking, isConnected }) {
//   const avatar = useLoader(GLTFLoader, "/nurse6.glb");
//   const blinkTimer = useRef(0);
//   const isBlinking = useRef(false);
//   const mouthOpenRef = useRef(0);
//   const headRef = useRef();
//   const speechTimer = useRef(0);
//   const lastSpeechChange = useRef(0);
//   const speechIntensity = useRef(0);

//   useEffect(() => {
//     avatar.scene.traverse((child) => {
//       if (child.isMesh) {
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
//         if (child.name === "Wolf3D_Hair") {
//           child.material.metalness = 0.5;
//           child.material.roughness = 0.2;
//           child.material.needsUpdate = true;
//         }
//         if (child.name === "Wolf3D_Body") {
//           child.material.metalness = 0.05;
//           child.material.roughness = 0.4;
//           child.material.needsUpdate = true;
//         }
//       }
//     });
//   }, [avatar]);

//   useEffect(() => {
//     if (!isConnected) {
//       mouthOpenRef.current = 0;
//       speechIntensity.current = 0;
//       if (headRef.current && headRef.current.morphTargetInfluences) {
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
//         speechIntensity.current = Math.min(speechIntensity.current + delta * 2, 1);
//         if (speechTimer.current - lastSpeechChange.current > 0.12 + Math.random() * 0.1) {
//           const speechPattern = Math.sin(speechTimer.current * 7) * 0.4 + 0.4;
//           mouthOpenRef.current = Math.min(speechPattern, 0.6);
//           lastSpeechChange.current = speechTimer.current;
//         }
//       } else {
//         speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
//         mouthOpenRef.current = Math.max(mouthOpenRef.current - delta * 3, 0);
//       }

//       const mouthOpenIndex = 0;
//       const mouthCloseIndex = 1;
//       const mouthSmileIndex = 2;
//       const mouthFrownIndex = 3;
//       const aaSoundIndex = 4;
//       const eeSoundIndex = 5;
//       const ooSoundIndex = 6;

//       const speechPhase = speechTimer.current * 6;

//       if (headRef.current.morphTargetInfluences[mouthOpenIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthOpenIndex] =
//           mouthOpenRef.current * speechIntensity.current;
//       }
//       if (headRef.current.morphTargetInfluences[mouthCloseIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthCloseIndex] =
//           (1 - mouthOpenRef.current) * 0.3 * speechIntensity.current;
//       }
//       if (headRef.current.morphTargetInfluences[mouthSmileIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthSmileIndex] = 0.1 + (isSpeaking ? 0.1 : 0);
//       }
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
//       if (headRef.current.morphTargetInfluences[mouthFrownIndex] !== undefined) {
//         headRef.current.morphTargetInfluences[mouthFrownIndex] = 0.05;
//       }
//     }

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
//       }, 100 + Math.random() * 50);
//     }
//   });

//   return (
//     <primitive object={avatar.scene} scale={8} position={[0, -14.7, -1]} rotation={[-0.4, 0, 0]} />
//   );
// }

// // === Main UI ===
// export default function CiraRealtimeAssistant({
//   // model = "gpt-4o-realtime-preview",
//   model = "gpt-realtime",
//   tokenUrl = "http://127.0.0.1:3001/api/realtime/token",
// }) {
//   const {
//     status,
//     isMicOn,
//     isSpeakerMuted,
//     isAssistantTalking,
//     lastEvent,
//     connect,
//     disconnect,
//     toggleMic,
//     toggleSpeaker,
//     audioElRef,
//   } = useRealtimeAgent({ model, tokenUrl });

//   const [hasPermission, setHasPermission] = useState(false);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         await navigator.mediaDevices.getUserMedia({ audio: true });
//         setHasPermission(true);
//       } catch {
//         setErr("Microphone access denied");
//       }
//     })();
//   }, []);

//   return (
//     <div
//       style={{
//         background: "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
//       }}
//       className="flex flex-col items-center justify-center min-h-screen text-center p-6"
//     >
//       {/* Avatar ring */}
//       <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
//         <motion.div
//           className="absolute inset-0 rounded-full p-[4px]"
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
//           style={{
//             background:
//               "conic-gradient(from 0deg, #ff69b4, #8a8af1, #f5cba7, #ff69b4)",
//           }}
//         />
//         <div className="relative h=[280px] w=[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg"
//              style={{ height: 280, width: 280, borderRadius: "9999px" }}>
//           <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
//             <directionalLight position={[2, 5, 3]} intensity={1.2} castShadow />
//             <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />
//             <directionalLight position={[3, 5, 2]} intensity={1.2} color={0xfff1c2} />
//             <OrbitControls enableZoom={false} />
//             <NurseAvatar isSpeaking={isAssistantTalking} isConnected={status === "connected"} />
//           </Canvas>
//         </div>
//       </div>

//       {err && <p className="text-red-500 mb-2">{err}</p>}

//       <p className="text-sm mb-2">
//         {status === "connected" && (isAssistantTalking ? " Speaking" : "Listening")}
//       </p>

//       {/* Controls */}
//       <div className="flex gap-3 mt-2">
//         {status !== "connected" ? (
//           <button
//             onClick={connect}
//             disabled={!hasPermission}
//             title="Start Conversation"
//             className={`mt-2 flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
//               hasPermission
//                 ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <PhoneOff className="w-5 h-5" />
//             <span className="text-lg">Start</span>
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={disconnect}
//               className="bg-red-600 text-white p-3 rounded-full"
//               title="End Conversation"
//             >
//               <MicOff />
//             </button>

//             <button
//               onClick={toggleSpeaker}
//               className={`p-3 rounded-full ${isSpeakerMuted ? "bg-red-500" : "bg-green-500"} text-white`}
//               title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
//             >
//               {isSpeakerMuted ? <VolumeX /> : <Volume2 />}
//             </button>

//             <button
//               onClick={toggleMic}
//               className={`p-3 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"} text-white`}
//               title={isMicOn ? "Mute Mic" : "Unmute Mic"}
//             >
//               {isMicOn ? "🎙️" : "🔇"}
//             </button>
//           </>
//         )}
//       </div>

//       {/* Hidden audio element for model audio */}
//       <audio ref={audioElRef} autoPlay playsInline />
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { motion } from "framer-motion";
import useRealtimeAgent from "./useRealtimeAgent";

// === 3D Avatar ===
function NurseAvatar({ isSpeaking, isConnected }) {
  const avatar = useLoader(GLTFLoader, "/nurse6.glb");
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);
  const mouthOpenRef = useRef(0);
  const headRef = useRef();
  const speechTimer = useRef(0);
  const lastSpeechChange = useRef(0);
  const speechIntensity = useRef(0);

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

  useEffect(() => {
    if (!isConnected) {
      mouthOpenRef.current = 0;
      speechIntensity.current = 0;
      if (headRef.current?.morphTargetInfluences) {
        headRef.current.morphTargetInfluences.fill(0);
      }
    }
  }, [isConnected]);

  useFrame((_, delta) => {
    if (!headRef.current) {
      const head = avatar.scene.getObjectByName("Wolf3D_Head");
      if (head?.morphTargetInfluences) headRef.current = head;
    }

    if (headRef.current?.morphTargetInfluences) {
      speechTimer.current += delta;

      if (isConnected && isSpeaking) {
        speechIntensity.current = Math.min(speechIntensity.current + delta * 2, 1);
        if (speechTimer.current - lastSpeechChange.current > 0.12 + Math.random() * 0.1) {
          const speechPattern = Math.sin(speechTimer.current * 7) * 0.4 + 0.4;
          mouthOpenRef.current = Math.min(speechPattern, 0.6);
          lastSpeechChange.current = speechTimer.current;
        }
      } else {
        speechIntensity.current = Math.max(speechIntensity.current - delta * 3, 0);
        mouthOpenRef.current = Math.max(mouthOpenRef.current - delta * 3, 0);
      }

      const mouthOpenIndex = 0;
      if (headRef.current.morphTargetInfluences[mouthOpenIndex] !== undefined) {
        headRef.current.morphTargetInfluences[mouthOpenIndex] =
          mouthOpenRef.current * speechIntensity.current;
      }
    }

    // blinking
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
      }, 120);
    }
  });

  return (
    <primitive object={avatar.scene} scale={8} position={[0, -14.7, -1]} rotation={[-0.4, 0, 0]} />
  );
}

// === Main UI ===
export default function CiraRealtimeAssistant({
  model = "gpt-realtime",
  tokenUrl = "http://127.0.0.1:3001/api/realtime/token",
}) {
  const {
    status,
    isMicOn,
    isSpeakerMuted,
    isAssistantTalking,
    userPhrases,
    assistantPhrases,
    connect,
    disconnect,
    toggleMic,
    toggleSpeaker,
    audioElRef,
  } = useRealtimeAgent({ model, tokenUrl });

  const [hasPermission, setHasPermission] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch {
        setErr("Microphone access denied");
      }
    })();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)",
      }}
      className="flex flex-col items-center justify-center min-h-screen text-center p-6"
    >
      {/* Avatar ring */}
      <div className="relative h-[290px] w-[290px] mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full p-[4px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          style={{
            background: "conic-gradient(from 0deg, #ff69b4, #8a8af1, #f5cba7, #ff69b4)",
          }}
        />
        <div
          className="relative h=[280px] w=[280px] rounded-full overflow-hidden bg-pink-50 shadow-lg"
          style={{ height: 280, width: 280, borderRadius: "9999px" }}
        >
          <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
            <directionalLight position={[2, 5, 3]} intensity={1.2} castShadow />
            <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1.2} color={0xfff1c2} />
            <OrbitControls enableZoom={false} />
            <NurseAvatar isSpeaking={isAssistantTalking} isConnected={status === "connected"} />
          </Canvas>
        </div>
      </div>

      {err && <p className="text-red-500 mb-2">{err}</p>}

   <p className="text-sm mb-2">
  {status === "connected" &&
    (isAssistantTalking ? "Speaking..." : "Listening...")}
</p>

      {/* Controls */}
      <div className="flex gap-3 mt-2">
        {status !== "connected" ? (
          <button
            onClick={connect}
            disabled={!hasPermission}
            title="Start Conversation"
            className={`mt-2 flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 ${
              hasPermission
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-lg">Start</span>
          </button>
        ) : (
          <>
            <button
              onClick={disconnect}
              className="bg-red-600 text-white p-3 rounded-full"
              title="End Conversation"
            >
              <MicOff />
            </button>

            <button
              onClick={toggleSpeaker}
              className={`p-3 rounded-full ${isSpeakerMuted ? "bg-red-500" : "bg-green-500"} text-white`}
              title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
            >
              {isSpeakerMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"} text-white`}
              title={isMicOn ? "Mute Mic" : "Unmute Mic"}
            >
              {isMicOn ? "🎙️" : "🔇"}
            </button>
          </>
        )}
      </div>

      {/* Conversation log */}
    {/* Conversation log */}
<div className="...">
  {[...new Set(assistantPhrases)].map((text, i) => (
    <div key={`a-${i}`} className="mb-1 text-purple-700">
      <b>🤖 Assistant:</b> {text}
    </div>
  ))}
</div>

      {/* Hidden audio element */}
      <audio ref={audioElRef} autoPlay playsInline />
    </div>
  );
}

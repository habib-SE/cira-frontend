import React, { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import {
  useRive,
  useStateMachineInput,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
} from "@rive-app/react-canvas";
import orbFile from "../assets/orb.riv";

const CiraAssistant = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [glowColor, setGlowColor] = useState("rgb(237, 90, 188)"); // 🌸 pink glow

  // 🎙 ask mic permission
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch {
        setErrorMessage("Microphone access denied");
      }
    };
    requestMicPermission();
  }, []);

  // 💬 ElevenLabs conversation
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
      console.error("Error starting conversation:", err);
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

  // 🟣 Rive orb setup
  const stateMachine = "default";
  const { rive, RiveComponent } = useRive({
    src: orbFile,
    stateMachines: stateMachine,
    autoplay: true,
  });

  // 🟢 make orb fully pink (remove blue)
  const viewModel = useViewModel(rive, { useDefault: true });
  const viewModelInstance = useViewModelInstance(viewModel, {
    rive,
    useDefault: true,
  });
  const { setRgb } = useViewModelInstanceColor("color", viewModelInstance);

  useEffect(() => {
    if (setRgb) {
      // 🌸 full pink
      setRgb(237 / 255, 90 / 255, 188 / 255);
    }
  }, [setRgb]);

  const listeningInput = useStateMachineInput(rive, stateMachine, "listening");
  const speakingInput = useStateMachineInput(rive, stateMachine, "speaking");

  useEffect(() => {
    if (listeningInput) listeningInput.value = status === "connected" && !isSpeaking;
    if (speakingInput) speakingInput.value = isSpeaking;
  }, [status, isSpeaking, listeningInput, speakingInput]);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)'}} className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {/* Orb + glowing background */}
      <div className="relative h-84 w-96 mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 z-0 rounded-full blur-[20px]"
          // style={{ background: glowColor }}
          animate={{
            scale: [0.9, 0.9, 0.9],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <RiveComponent className="h-full w-full" />
      </div>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {status === "connected" && (
        <p className="text-green-600 mb-2">
          {isSpeaking ? "Speaking..." : "Listening..."}
        </p>
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
              className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-green-500"
                } text-white`}
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
            className={`mt-8 flex items-center gap-1 rounded-full px-3 py-3 text-white font-medium transition-all duration-300
    ${hasPermission
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
};

export default CiraAssistant;

import React, { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";

const CiraAssistant = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setHasLoaded(true);
  }, 1000); // Match `dripIn` duration
  return () => clearTimeout(timer);
}, []);

  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected");
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected");
    },
    onSpeakStart: () => {
      console.log("🗣 Speaking...");
    },
    onSpeakEnd: () => {
      console.log("🔇 Done speaking");
    },
    onMessage: (message) => {
      console.log("💬 Assistant:", message.message);
    },
  });

  const { status, isSpeaking } = conversation;

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
<div
  className={`orb-container ${!hasLoaded ? "orb-drip-in" : status === "connected"
    ? isSpeaking
      ? "orb-fast"
      : "orb-slow"
    : "orb-idle"
    }`}
/>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {status === "connected" && (
        <p className="text-green-600 mb-2">
          {isSpeaking ? "Speaking..." : "Listening..."}
        </p>
      )}

      <div className="flex gap-4 mt-4">
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
  className={`p-3 mt-8 rounded-full text-pink-500 ${
    hasPermission
      ? "bg-gradient-to-r from-pink-200 jump-animation"
      : "bg-gray-400 cursor-not-allowed"
  }`}
  title="Start Conversation"
>
  <PhoneOff />
</button>


        )}
      </div>
    </div>
  );
};

export default CiraAssistant;

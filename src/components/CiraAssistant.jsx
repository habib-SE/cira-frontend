import React, { useState } from "react";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { talkToAgent } from "../utills/elevenLabsAgent"; // Make sure this file exists

const CiraAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");

  const handleMicrophoneClick = async () => {
    setIsListening(true);

    // Simulate listening & sending a message to agent
    const res = await talkToAgent("I need a medical consultation");
    setResponse(res.text || "No response");

    setIsListening(false);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-pink-100 via-pink-50 to-yellow-100 py-8 px-4">
      {/* Orb Animation or Image */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className={`w-60 h-60 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 ${isListening ? 'bg-pink-300' : 'bg-pink-200'}`}>
          <img
            src="/src/assets/orb.png"
            alt="Orb"
            className="w-full h-full object-contain"
          />
        </div>

        {response && (
          <div className="mt-6 text-center text-gray-800 text-sm bg-white rounded-lg p-4 shadow-md max-w-md">
            {response}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <button className="bg-white p-3 rounded-full shadow-md">
          <FaKeyboard className="text-gray-600 text-xl" />
        </button>

        <button
          className="bg-pink-100 p-4 rounded-full shadow-lg"
          onClick={handleMicrophoneClick}
          disabled={isListening}
        >
          <FaMicrophone
            className={`text-2xl ${isListening ? "text-pink-400 animate-pulse" : "text-pink-600"}`}
          />
        </button>

        <button className="bg-white p-3 rounded-full shadow-md">
          <IoClose className="text-gray-600 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CiraAssistant;

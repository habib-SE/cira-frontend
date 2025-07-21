import React from "react";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const CiraAssistant = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-pink-100 via-pink-50 to-yellow-100 py-8 px-4">
      {/* Orb Animation or Image */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-60 h-60 bg-pink-200 rounded-full flex items-center justify-center shadow-2xl relative">
          <img
            src="/src/assets/orb.png" // Replace with your orb image or Rive animation
            alt="Orb"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <button className="bg-white p-3 rounded-full shadow-md">
          <FaKeyboard className="text-gray-600 text-xl" />
        </button>

        <div className="bg-pink-100 p-4 rounded-full shadow-lg">
          <FaMicrophone className="text-pink-600 text-2xl" />
        </div>

        <button className="bg-white p-3 rounded-full shadow-md">
          <IoClose className="text-gray-600 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CiraAssistant;

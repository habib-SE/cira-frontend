// CiraMobileBanner.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/doctor.png";

const CiraMobileBanner = () => {
  const navigate = useNavigate();

  const handleAskCira = () => {
    navigate("/assistant");
  };

  return (
    <div className="flex flex-col items-center justify-between bg-[#fefcfd] h-screen px-6 pt-10 pb-6 overflow-y-auto">
      {/* Logo and Heading */}
      <div className="w-full">
        <h1 className="text-[36px] font-bold text-black leading-tight">
          <span className="text-black">Ci</span>
          <span className="text-pink-500">r</span>
          <span className="text-black">a</span>
        </h1>
        <p className="text-[20px] font-medium text-gray-800 leading-snug mt-3">
          Word Class,<br />
          Doctor Consultation<br />
          Easier <span className="text-red-500 font-semibold">than</span> before
        </p>

        {/* Ask Cira Button */}
        <div className="mt-4">
          <button
            onClick={handleAskCira}
            className="inline-block bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md"
          >
            Ask Cira
          </button>
        </div>
      </div>

      {/* Doctor Image */}
      <div className="w-full flex justify-center mt-6">
        <img
          src={doctorImage}
          alt="Doctor"
          className="w-4/5 max-w-xs object-contain"
        />
      </div>
    </div>
  );
};

export default CiraMobileBanner;

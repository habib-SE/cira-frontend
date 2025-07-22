import { div } from "framer-motion/m";
import React from "react";

export default function BackgroundVideoCard() {
  return (
    <div className="p-6 mt-6">
    <div className="relative mx-auto w-full h-[60vh] rounded-4xl bg-[#FAFAFA] overflow-hidden flex flex-col ">
      {/* Video Container */}
      <video
        className="w-full h-full object-cover"
        src="https://framerusercontent.com/assets/PSkogucpBZ93U3mPrXD365A8xo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-[rgba(15,15,15,0.7)] opacity-70 pointer-events-none" />
    </div>
    </div>
  );
}

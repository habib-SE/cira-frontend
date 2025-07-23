import React from "react";

const YoutubeBackground = () => {
  return (
    <div className="relative h-screen mt-16 mx-3 overflow-hidden">
    
      <div>
      <video
        autoPlay
        loop
        muted
        playsInline
      className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        src="https://framerusercontent.com/assets/fPtrUscopc4S3tX6elWB2S5HyQ.mp4"
        title="YouTube video background"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
     

     
      <div className="absolute rounded-3xl inset-0 bg-[rgba(15,15,15,0.7)] opacity-70 pointer-events-none" />
       </div>

    
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h2 className="text-4xl md:text-5xl max-w-5xl font-bold mb-6">Proactive New⎯Gen AI designed to 
Support Personal Growth</h2>
        <button className="bg-white hover:bg-blue-700 text-black  font-semibold py-3 px-6 rounded-full transition duration-300">
          Join Beta Testing
        </button>
      </div>
    </div>
  );
};

export default YoutubeBackground;


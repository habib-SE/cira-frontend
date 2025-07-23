import React from "react";

const YoutubeBackground = () => {
  return (
    <div className="relative bg-white h-screen mt-16 mx-3 overflow-hidden">
      {/* YouTube iframe */}
      <iframe
      className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        src="https://www.youtube.com/embed/NZ1EBaqDL0M?autoplay=1&mute=1&loop=1&playlist=NZ1EBaqDL0M&controls=0&showinfo=0&modestbranding=1&rel=0"
        title="YouTube video background"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>

      {/* Dark overlay */}
      {/* <div className="absolute inset-0  bg-opacity-50"></div> */}

      {/* Centered Content */}
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


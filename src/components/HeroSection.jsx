import React from "react";
import { Link } from "react-router-dom";
import Doctor from '../assets/doctorImage.png'

export default function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)'}} className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Tagline */}
      <div className="text-center mt-20">
        <span className="text-pink-400 text-lg font-medium">
          #1 AI Doctor Worldwide
        </span>
      </div>

      {/* Main Heading */}
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-medium text-gray-900 leading-tight">
          From Voice to Diagnosis in Seconds: Meet Cira, Your AI Doctor
        </h1>
      </div>

      {/* Description */}
      <div className="text-center mb-12 max-w-3xl">
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
          Cira is an AI-powered voice assistant that captures vital signs through facial analysis and delivers instant, clinically sound diagnoses. Designed for speed, accuracy, and ease, Cira brings the future of healthcare to any device.
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
        <Link
          to="#learn-more"
          className="text-gray-700 hover:text-gray-900 text-lg font-medium relative group transition-all duration-300 ease-in-out"
        >
          <span className="relative z-10">Learn More</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
        </Link>
        <Link
          to="/assistant"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-3xl text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group"
        >
          <span className="relative z-10">Get Started</span>
          <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
        </Link>
      </div>

      {/* Doctor Image */}
      <div className="relative max-w-2xl w-full">
        <div className="relative overflow-hidden rounded-lg ">
          <img
            src={Doctor}
            alt="Doctor"
            className="w-full h-auto"
          />
          {/* Bottom blur/fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}

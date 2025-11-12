import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TrustedSection from "../components/TrustedSection";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-y-hidden">
      <HeroSection />
      <TrustedSection />
    </div>
  );
}

export default LandingPage;

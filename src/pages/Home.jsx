import React from "react";
import HeroSection from "../components/landing/HeroSection";
import FriendlyExplanationSection from "../components/landing/FriendlyExplainationSection";
import DoctorConnectionSection from "../components/landing/DoctorConnectionSection";
import PrivacySection from "../components/landing/PrivacySection";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-y-hidden">
      <HeroSection />
      <FriendlyExplanationSection />
      <DoctorConnectionSection />
      <PrivacySection />
      <Footer />
    </div>
  );
}

export default LandingPage;

// App.jsx
import React, { useState } from "react";
import AdvanceTechDesgin from "./landingpage/AdvanceTechDesign";
import IntegrationSection from "./landingpage/Integration";
import ExperienceSection from "./landingpage/Experience";
import InsightsSection from "./landingpage/Insights";
import BackgroundVideoCard from "./landingpage/BGVedio";
import Footer from "./landingpage/Footer";
import ZofyTalk from "./landingpage/ZofyTalk";
import ZofyIntro from "./landingpage/ZofyIntro";
import YoutubeBackground from "./landingpage/YoutubeBackground";
import ZofyCarousel from "./landingpage/ZofySection";

function LandingPage() {
//   const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
    <YoutubeBackground />
    <ZofyIntro />
    <ZofyCarousel />
      <ZofyTalk />
      <AdvanceTechDesgin />
      <IntegrationSection />
   <ExperienceSection />
   <InsightsSection />
   <BackgroundVideoCard />
   <Footer />
    </>
  );
}

export default LandingPage;

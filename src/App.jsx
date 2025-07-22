// App.jsx
import React, { useState } from "react";
import CiraMobileBanner from "./pages/landingpage/CiraMobileBanner";
import CiraAssistant from "./pages/landingpage/CiraAssistant";
import ZofyTalkSection from "./pages/landingpage/ZofyTalk";
import IntegrationSection from "./pages/landingpage/Integration";
import ExperienceSection from "./pages/landingpage/Experience";
import InsightsSection from "./pages/landingpage/Insights";
import BackgroundVideoCard from "./pages/landingpage/BGVedio";
import Footer from "./pages/landingpage/Footer";
import AdvanceTechDesgin from "./pages/landingpage/AdvanceTechDesign";
import { PlaneLanding } from "lucide-react";
import LandingPage from "./pages/LandingPage";

function App() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
     <LandingPage />
    </>
  );
}

export default App;

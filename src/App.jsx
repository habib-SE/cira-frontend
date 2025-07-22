// App.jsx
import React, { useState } from "react";
import CiraMobileBanner from "./components/CiraMobileBanner";
import CiraAssistant from "./components/CiraAssistant";
import ZofyTalkSection from "./components/ZofyTalk";
import IntegrationSection from "./components/Integration";
import ExperienceSection from "./components/Experience";
import InsightsSection from "./components/Insights";
import BackgroundVideoCard from "./components/BGVedio";
import Footer from "./components/Footer";
import AdvanceTechDesgin from "./components/AdvanceTechDesign";

function App() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      {/* {showAssistant ? (
        <CiraAssistant onClose={() => setShowAssistant(false)} />
      ) : (
        <CiraMobileBanner onAskCira={() => setShowAssistant(true)} />
      )} */}
      <ZofyTalkSection />
      <AdvanceTechDesgin />
      <IntegrationSection />
   <ExperienceSection/>
   <InsightsSection />
   <BackgroundVideoCard />
   <Footer />
    </>
  );
}

export default App;

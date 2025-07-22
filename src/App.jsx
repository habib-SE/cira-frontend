// App.jsx
import React, { useState } from "react";
import CiraMobileBanner from "./components/CiraMobileBanner";
import CiraAssistant from "./components/CiraAssistant";
import ZofyIntro from "./pages/landingpage/ZofyIntro";
import YoutubeBackground from "./pages/landingpage/YoutubeBackground";
import ZofySection from "./pages/landingpage/ZofySection";

function App() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      {/* {showAssistant ? (
        <CiraAssistant onClose={() => setShowAssistant(false)} />
      ) : (
        <CiraMobileBanner onAskCira={() => setShowAssistant(true)} />
      )} */}
      <YoutubeBackground />
      <ZofyIntro />
      <ZofySection />
    </>
  );
}

export default App;

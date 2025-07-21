// App.jsx
import React, { useState } from "react";
import CiraMobileBanner from "./components/CiraMobileBanner";
import CiraAssistant from "./components/CiraAssistant";

function App() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      {showAssistant ? (
        <CiraAssistant onClose={() => setShowAssistant(false)} />
      ) : (
        <CiraMobileBanner onAskCira={() => setShowAssistant(true)} />
      )}
    </>
  );
}

export default App;

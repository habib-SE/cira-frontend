// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CiraMobileBanner from "./pages/landingpage/CiraMobileBanner";
import CiraAssistant from "./pages/landingpage/CiraAssistant";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CiraMobileBanner />} />
        <Route path="/assistant" element={<CiraAssistant />} />
        <Route path="/landing-page" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;

// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";;
import LandingPage from "./pages/LandingPage";
import CiraMobileBanner from "./assistant/CiraMobileBanner";
import CiraAssistant from "./assistant/CiraAssistant";

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

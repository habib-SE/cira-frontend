// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/Home";
import CiraMobileBanner from "./assistant/CiraMobileBanner";
import CiraAssistant from "./assistant/CiraAssistant";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<CiraMobileBanner />} /> */}
        <Route path="/assistant" element={<CiraAssistant />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;

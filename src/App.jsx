// App.jsx
import React from "react";
import MainRouter from "./routes/MainRouter";
import Header from "./components/Header";
import LandingPage from "./pages/Home";
import CiraAssistant from "./assistant/CiraAssistant";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/assistant"
          element={
            <>
              <Header />
              <CiraAssistant />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Header />
              <LandingPage />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/*" element={<MainRouter />} />

        {/* Default redirect to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

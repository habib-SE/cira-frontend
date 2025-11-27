// // App.jsx
// import React from "react";
// import MainRouter from "./routes/MainRouter";
// import Header from "./components/Header";
// import LandingPage from "./pages/Home";
// import CiraAssistant from "./assistant/CiraAssistant";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import CiraRealtimeAssistant from "./agent/realtime/CiraRealtimeAssistant";
// import { AuthProvider } from "./context/AuthContext";
// import CiraChatAssistant from "./assistant/CiraChatAssistant";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Public routes */}
//           <Route
//             path="/assistant"
//             element={
//               <>
//                 <Header />
//                 <CiraAssistant />
//               </>
//             }
//           />
//             <Route path="/cira-chat-assistant" element={<CiraChatAssistant />} />
//             <Route
//               path="/ai-assistant"
//               element={
//                 <>
//                   <Header />
//                   <CiraRealtimeAssistant />
//                 </>
//               }
//             />
//             <Route
//               path="/home"
//               element={
//                 <>
//                   <Header />
//                   <LandingPage />
//                 </>
//               }
//             />

//             {/* Admin routes */}
//             <Route path="/*" element={<MainRouter />} />

//             {/* Default redirect to home */}
//             <Route path="/" element={<Navigate to="/home" replace />} />
//           </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
// App.jsx
import React from "react";
import MainRouter from "./routes/MainRouter";
import Header from "./components/Header";
import LandingPage from "./pages/Home";
import CiraAssistant from "./assistant/CiraAssistant";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CiraRealtimeAssistant from "./agent/realtime/CiraRealtimeAssistant";
import { AuthProvider } from "./context/AuthContext";
import CiraChatAssistant from "./assistant/CiraChatAssistant";

// ✅ Layout with fixed header
const FixedHeaderLayout = ({ children }) => {
  return (
    <div className="min-h-screen ">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Page content pushed down by header height (adjust pt-20 if needed) */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
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

          <Route path="/cira-chat-assistant" element={<CiraChatAssistant />} />

          <Route
            path="/ai-assistant"
            element={
              <>
                <Header />
                <CiraRealtimeAssistant />
              </>
            }
          />

          {/* ✅ Landing page with fixed header */}
          <Route
            path="/home"
            element={
              <FixedHeaderLayout>
                <LandingPage />
              </FixedHeaderLayout>
            }
          />

          {/* Admin routes */}
          <Route path="/*" element={<MainRouter />} />

          {/* Default redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

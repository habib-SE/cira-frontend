
// import React, { useEffect, useState } from "react";
// import HeroSection from "../components/landing/HeroSection";
// import FriendlyExplanationSection from "../components/landing/FriendlyExplainationSection";
// import DoctorConnectionSection from "../components/landing/DoctorConnectionSection";
// import PrivacySection from "../components/landing/PrivacySection";
// import Footer from "../components/landing/Footer";
// import CiraChatAssistant from "../assistant/CiraChatAssistant";

// function LandingPage() {
//   const [showChat, setShowChat] = useState(false);
//   const [initialMessage, setInitialMessage] = useState("");

//   const handleStartChat = (message) => {
//     setInitialMessage(message); // pass first message into chat
//     setShowChat(true);          // switch to full-page Cira chat
//   };

//   // 🔒 Lock page scroll when chat is open
//   useEffect(() => {
//     if (showChat) {
//       document.documentElement.style.overflow = "hidden";
//       document.body.style.overflow = "hidden";
//     } else {
//       document.documentElement.style.overflow = "";
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.documentElement.style.overflow = "";
//       document.body.style.overflow = "";
//     };
//   }, [showChat]);

//   return (
//     <div className="min-h-screen bg-[#FFFEF9]">
//       {/* Landing content */}
//       {!showChat && (
//         <div className="w-full max-w-4xl mx-auto px-4 py-2 md:px-4 md:py-6">
//           <HeroSection onStartChat={handleStartChat} />
//           <FriendlyExplanationSection />
//           <DoctorConnectionSection />
//           <PrivacySection />
//           <Footer />
//         </div>
//       )}

//       {/* 🔹 FULL-SCREEN OVERLAY CHAT (no page scroll) */}
//       {showChat && (
//         <div className="fixed inset-0 z-40">
//           <CiraChatAssistant initialMessage={initialMessage} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default LandingPage;
import React, { useEffect, useState } from "react";
import HeroSection from "../components/landing/HeroSection";
import FriendlyExplanationSection from "../components/landing/FriendlyExplainationSection";
import DoctorConnectionSection from "../components/landing/DoctorConnectionSection";
import PrivacySection from "../components/landing/PrivacySection";
import Footer from "../components/landing/Footer";
import CiraChatAssistant from "../assistant/CiraChatAssistant";
import Header from "../components/Header";

function LandingPage() {
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const handleStartChat = (message) => {
    setInitialMessage(message); // pass first message into chat
    setShowChat(true);          // switch to full-page Cira chat
  };

  // 🔒 Lock page scroll when chat is open
  useEffect(() => {
    if (showChat) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showChat]);

  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      {/* 🔹 FIXED HEADER (shared for landing + chat) */}
      <div className="fixed top-0 left-0 right-0 z-50 md:z-0">
        <Header />
      </div>

      {/* Landing content (pushed down below header) */}
      {!showChat && (
        <div className="pt-20 w-full max-w-4xl mx-auto px-4 py-2 md:px-4 md:py-6">
          <HeroSection onStartChat={handleStartChat} />
          <FriendlyExplanationSection />
          <DoctorConnectionSection />
          <PrivacySection />
          <Footer />
        </div>
      )}

      {/* 🔹 FULL-SCREEN CHAT BELOW FIXED HEADER */}
      {showChat && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-[#FFFEF9] overflow-y-auto">
          <CiraChatAssistant initialMessage={initialMessage} />
        </div>
      )}
    </div>
  );
}

export default LandingPage;


// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useConversation } from "@11labs/react";
// import { motion } from "framer-motion";

// import AgentAvatar from "../assets/nurse.png";
// import ChatInput from "../components/landing/ChatInput";
// import Header from "../components/Header";
// import stars from "../assets/stars.svg";

// const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// // 🔎 Helper to extract conditions + confidence from the AI summary text
// function parseConditionsAndConfidence(summary) {
//   if (!summary) return { conditions: [], confidence: null };

//   const conditions = [];
//   let confidence = null;

//   // 1) Overall confidence, e.g. "I am about 85% confident..."
//   const confMatch = summary.match(/(\d+)\s*%[^.\n]*confident/i);
//   if (confMatch) {
//     confidence = Number(confMatch[1]);
//   }

//   // 2) Block "Top 3 possible conditions..."
//   const topBlockMatch = summary.match(
//     /top\s*3\s*possible\s*conditions[^:]*:\s*([\s\S]+)/i
//   );

//   if (topBlockMatch) {
//     const lines = topBlockMatch[1]
//       .split("\n")
//       .map((l) => l.trim())
//       .filter(Boolean);

//     for (const line of lines) {
//       const m = line.match(/(\d+)\s*%\s*(.+)/);
//       if (!m) break; // stop once we leave the percentage block
//       conditions.push({
//         percentage: Number(m[1]),
//         name: m[2].replace(/\.$/, ""),
//       });
//     }
//   }

//   return { conditions, confidence };
// }

// // 🧼 Helper to remove the "Top 3 possible conditions" text block
// function stripTopConditionsFromSummary(summary) {
//   if (!summary) return "";

//   const pattern =
//     /Top\s*3\s*possible\s*conditions[^:]*:\s*([\s\S]*?)(?=\n\s*\n|For self-care|Please book an appointment|Please book|Take care of yourself|$)/i;

//   return summary.replace(pattern, "").trim();
// }

// // 🧼 Helper to pull out the "For self-care..." paragraph and leave rest
// function splitOutSelfCare(summary) {
//   if (!summary) return { cleaned: "", selfCare: "" };

//   const pattern =
//     /(For self-care[^]*?)(?=\n\s*\n|Please book an appointment|Please book|Take care of yourself|$)/i;

//   const match = summary.match(pattern);
//   if (!match) {
//     return { cleaned: summary.trim(), selfCare: "" };
//   }

//   const selfCare = match[1].trim();
//   const before = summary.slice(0, match.index);
//   const after = summary.slice(match.index + match[0].length);
//   const cleaned = (before + after).trim();

//   return { cleaned, selfCare };
// }

// export default function CiraChatAssistant({ initialMessage: initialMessageProp }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [hasAgreed, setHasAgreed] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState("");

//   const msgIdRef = useRef(1);
//   const nextId = () => `msg-${msgIdRef.current++}`;

//   const [messages, setMessages] = useState([]);
//   const initialSentRef = useRef(false);

//   const [consultSummary, setConsultSummary] = useState(null);
//   const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

//   const [isThinking, setIsThinking] = useState(false);

//   const scrollAreaRef = useRef(null);
//   const [hasStartedChat, setHasStartedChat] = useState(false);

//   const conversation = useConversation({
//     textOnly: true,
//     onConnect: () => {
//       console.log("✅ Connected to chat_cira");
//       setIsConnected(true);
//       setError("");
//     },
//     onDisconnect: () => {
//       console.log("🔌 Disconnected from chat_cira");
//       setIsConnected(false);
//     },
//     onMessage: (payload) => {
//       let text = "";
//       let role = "unknown";

//       if (typeof payload === "string") {
//         text = payload;
//       } else if (payload) {
//         text =
//           payload.message ||
//           payload.text ||
//           payload.formatted?.text ||
//           payload.formatted?.transcript ||
//           "";
//         role = payload.role || payload.source || "unknown";
//       }

//       if (!text || !text.trim()) return;

//       const isAssistant =
//         role === "assistant" || role === "ai" || role === "agent";

//       if (!isAssistant) {
//         console.log("💬 Non-assistant message from SDK:", payload);
//         return;
//       }

//       const trimmedText = text.trim();
//       const lower = trimmedText.toLowerCase();

//       const looksLikeSummary =
//         lower.includes("please consider booking an appointment with a doctor") ||
//         lower.includes("please book an appointment with a doctor") ||
//         lower.includes("take care of yourself") ||
//         trimmedText.length > 300;

//       setIsThinking(false);

//       if (looksLikeSummary) {
//         console.log("📝 Captured consult summary.");
//         setConsultSummary(trimmedText);
//         setSummaryCreatedAt(new Date());
//         return;
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: nextId(),
//           role: "assistant",
//           text: trimmedText,
//         },
//       ]);
//     },
//     onError: (err) => {
//       console.error("❌ ElevenLabs chat error:", err);
//       setError("Something went wrong while talking to Cira. Please try again.");
//       setIsThinking(false);
//     },
//   });

//   const { status, sendUserMessage } = conversation;

//   const ensureConnected = useCallback(
//     async () => {
//       if (status === "connected" || isConnecting) return;

//       try {
//         setIsConnecting(true);
//         const convId = await conversation.startSession({
//           agentId: CHAT_AGENT_ID,
//         });
//         console.log("🧵 Chat session started:", convId);
//         setIsConnected(true);
//       } catch (err) {
//         console.error("Failed to start chat session:", err);
//         setError("Couldn’t connect to Cira. Please refresh and try again.");
//       } finally {
//         setIsConnecting(false);
//       }
//     },
//     [status, isConnecting, conversation]
//   );

//   const locationInitialMessage = location.state?.initialMessage;
//   const effectiveInitialMessage = initialMessageProp ?? locationInitialMessage;

//   useEffect(() => {
//     if (!effectiveInitialMessage) return;
//     if (initialSentRef.current) return;
//     initialSentRef.current = true;

//     const sendInitial = async () => {
//       const trimmed = effectiveInitialMessage.trim();
//       if (!trimmed) return;

//       setMessages((prev) => [
//         ...prev,
//         { id: nextId(), role: "user", text: trimmed },
//       ]);

//       setIsThinking(true);

//       try {
//         await ensureConnected();
//         if (sendUserMessage) sendUserMessage(trimmed);
//         else setIsThinking(false);
//       } catch (err) {
//         console.error("Error sending initial message:", err);
//         setError("Could not send your message. Please try again.");
//         setIsThinking(false);
//       }
//     };

//     sendInitial();
//   }, [effectiveInitialMessage, ensureConnected, sendUserMessage]);

//   // Auto-scroll messages
//   useEffect(() => {
//     const c = scrollAreaRef.current;
//     if (!c) return;

//     c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
//   }, [messages, isThinking, consultSummary]);

//   const startedTime = new Date();
//   const startedLabel = startedTime.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const summaryDateLabel =
//     summaryCreatedAt &&
//     summaryCreatedAt.toLocaleString([], {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   // 🔄 Parse summary into pieces
//   const parsedSummary = consultSummary
//     ? parseConditionsAndConfidence(consultSummary)
//     : { conditions: [], confidence: null };

//   let displaySummary = "";
//   let selfCareText = "";

//   if (consultSummary) {
//     const withoutTop = stripTopConditionsFromSummary(consultSummary);
//     const split = splitOutSelfCare(withoutTop);
//     displaySummary = split.cleaned;
//     selfCareText = split.selfCare;

//     displaySummary = displaySummary
//       .replace(/^\s*Here are the[^\n]*\n?/gim, "")
//       .replace(/Take care of yourself,[^\n]*\n?/gi, "")
//       .trim();

//     // 🔧 remove big vertical gaps between paragraphs
//     displaySummary = displaySummary.replace(/\n{3,}/g, "\n\n");

//   }

//   // const handleUserMessage = async (text) => {
//   //   if (!hasAgreed) return;
//   //   const trimmed = text.trim();
//   //   if (!trimmed) return;

//   //   setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
//   //   setIsThinking(true);

//   //   try {
//   //     await ensureConnected();
//   //     if (sendUserMessage) sendUserMessage(trimmed);
//   //     else setIsThinking(false);
//   //   } catch (err) {
//   //     console.error("Error sending user message:", err);
//   //     setError("Could not send your message. Please try again.");
//   //     setIsThinking(false);
//   //   }
//   // };

//   const handleUserMessage = async (text) => {
//     if (!hasAgreed) return;
//     const trimmed = text.trim();
//     if (!trimmed) return;

//     setMessages((prev) => [
//       ...prev,
//       { id: nextId(), role: "user", text: trimmed },
//     ]);

//     // 👇 mark that chat has started (hide TOS block)
//     setHasStartedChat(true);

//     setIsThinking(true);

//     try {
//       await ensureConnected();
//       if (sendUserMessage) sendUserMessage(trimmed);
//       else setIsThinking(false);
//     } catch (err) {
//       console.error("Error sending user message:", err);
//       setError("Could not send your message. Please try again.");
//       setIsThinking(false);
//     }
//   };

//   const handleExit = () => {
//     try {
//       conversation.endSession?.();
//     } catch (e) {
//       console.warn("Error ending session:", e);
//     }
//     navigate("/");
//   };

//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "auto"; // ← CHANGED HERE
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 w-full flex flex-col" style={{
//       background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 68%, #FFF7EA 100%)'}}>
//         {/* Header: now transparent */}
//   <header className="fixed top-0 left-0 right-0 z-20">
//     <Header className="bg-transparent shadow-none border-none" />
//   </header>
//       {/* Scroll area: header + messages + summary */}
//       <motion.div
//         ref={scrollAreaRef}
//         className="flex-1 overflow-y-auto px-4 pt-6 pb-8 flex justify-center"
//         initial={{ opacity: 0, y: 60 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <div className="w-full max-w-xl">

//           {/* --- header and messages remain unchanged --- */}

//           <header className="mb-6 px-4 pt-24">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold">
//                   <img src={stars} alt="stars" />
//                 </div>
//                 <div className="flex -space-x-2">
//                   <img
//                     src={AgentAvatar}
//                     alt="Clinician 2"
//                     className="w-8 h-8 rounded-full border border-white object-cover"
//                   />
//                 </div>
//               </div>
//             </div>

//             <h1 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-2">
//               Cira Consult
//             </h1>
//             <p className="text-sm mt-5 text-gray-500 mb-1">
//               Consult started: Today, {startedLabel}
//             </p>
//             <p className="text-xs mt-5 text-black font-bold">
//               If this is an emergency, call 999 or your local emergency number.
//             </p>
//           </header>

//           {error && (
//             <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
//               {error}
//             </div>
//           )}
//           <div className=" border border-gray-200 mb-5"></div>
//           <div className="space-y-4 pb-24">
//             {messages.map((m) => {
//               const isAssistant = m.role === "assistant";
//               return (
//                 <div
//                   key={m.id}
//                   className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
//                     }`}
//                 >
//                   <div className="flex items-center">
//                     <div
//                       className={`
//               px-4 py-4 text-sm
//               ${isAssistant
//                           ? "rounded-2xl text-gray-800"
//                           : "rounded-2xl rounded-tr-none bg-pink-500 text-white"
//                         }
//             `}
//                     >
//                       {m.text}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {isThinking && (
//               <div className="flex w-full justify-start">
//                 <div className="flex items-center">
//                   <div className="flex w-full justify-start">
//                     <div className="flex items-center gap-2 max-w-[80%]">
//                       <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500">
//                         <span className="inline-flex gap-1 items-center">
//                           <span
//                             className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                             style={{
//                               animation: "dotWave 1.2s infinite ease-in-out",
//                               animationDelay: "0s",
//                             }}
//                           />
//                           <span
//                             className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                             style={{
//                               animation: "dotWave 1.2s infinite ease-in-out",
//                               animationDelay: "0.15s",
//                             }}
//                           />
//                           <span
//                             className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                             style={{
//                               animation: "dotWave 1.2s infinite ease-in-out",
//                               animationDelay: "0.3s",
//                             }}
//                           />
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>


//           {/* SUMMARY */}
//           {consultSummary && (
//             <section className="w-full mt-6 mb-2">
//               <div className="bg-white rounded-2xl shadow-sm border border-[#E3E3F3] px-5 py-6">
//                 <div className="w-full flex justify-center my-4">
//                   <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
//                     <img
//                       src={AgentAvatar}
//                       alt=""
//                       className="w-32 h-32 rounded-full mb-3"
//                     />
//                     <p className="text-xs text-gray-500">Your AI clinician assistant, Cira</p>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-1">AI Consult Summary</h2>
//                   {summaryDateLabel && <p className="text-xs text-gray-400">{summaryDateLabel}</p>}
//                 </div>

//                 {/* Narrative summary WITHOUT "Top 3..." and WITHOUT self-care / stray lines */}
//                 <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
//                   {displaySummary}
//                 </p>

//                 {/* 🔹 Conditions with percentages */}
//                 {parsedSummary.conditions.length > 0 && (
//                   <div className="mt-4 border-t border-gray-100 pt-4">
//                     <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                       Conditions Matching
//                     </h3>

//                     <div className="space-y-3">
//                       {parsedSummary.conditions.map((c, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center justify-between text-sm"
//                         >
//                           <div className="flex items-center gap-2">
//                             <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
//                             <span className="text-gray-800 truncate">
//                               {c.name}
//                             </span>
//                           </div>
//                           <span className="font-medium text-gray-900">
//                             {c.percentage}%
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* 🔹 Assessment confidence bar */}
//                 {parsedSummary.confidence != null && (
//                   <div className="mt-5">
//                     <p className="text-xs text-gray-500 mb-1">
//                       Assessment confidence
//                     </p>

//                     <div className="flex items-center justify-between text-xs mb-1">
//                       <span className="font-medium text-emerald-600">
//                         {parsedSummary.confidence >= 80
//                           ? "Pretty sure"
//                           : parsedSummary.confidence >= 60
//                             ? "Somewhat sure"
//                             : "Low confidence"}
//                       </span>
//                       <span className="text-gray-600">
//                         {parsedSummary.confidence}%
//                       </span>
//                     </div>

//                     <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
//                       <div
//                         className="h-full rounded-full bg-emerald-500"
//                         style={{
//                           width: `${Math.min(
//                             parsedSummary.confidence,
//                             100
//                           )}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* 🔹 Self-care / when to seek help (dynamic from summary) */}
//                 <div className="mt-5 border-t border-gray-100 pt-4">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-1">
//                     Self-care & when to seek help
//                   </h3>

//                   {selfCareText ? (
//                     <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
//                       {selfCareText}
//                     </p>
//                   ) : (
//                     <p className="text-xs text-gray-600 mb-2">
//                       Home care with rest, fluids, and over-the-counter pain
//                       relievers is usually enough for most mild illnesses. If
//                       your fever rises, breathing becomes difficult, or your
//                       symptoms last more than a few days or suddenly worsen,
//                       contact a doctor or urgent care.
//                     </p>
//                   )}

//                   <p className="text-[11px] text-gray-400">
//                     These are rough estimates and do not replace medical advice.
//                     Always consult a healthcare professional if you&apos;re
//                     worried.
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                   <button
//                     type="button"
//                     className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
//                       hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
//                   >
//                     Download Report Note (PDF)
//                   </button>
//                   <button className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5">
//                     Find Doctor Specialist
//                   </button>
//                 </div>
//               </div>
//             </section>
//           )}
//         </div>
//       </motion.div>

//       <motion.footer
//         className="w-full flex-shrink-0 flex justify-center pb-4 px-4"
//         initial={{ y: -60, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
//       >
//         <div className="w-full pt-4 pb-2 max-w-xl bg-white rounded-2xl space-y-3">
//           {/* ✅ Only show TOS before first message */}
//           {!hasStartedChat && (
//             <div className="flex items-start gap-2 text-[11px] text-gray-600 px-4">
//               <input
//                 id="tos"
//                 type="checkbox"
//                 checked={hasAgreed}
//                 onChange={(e) => setHasAgreed(e.target.checked)}
//                 className="mt-0.5"
//               />
//               <label htmlFor="tos">
//                 I agree to the{" "}
//                 <button type="button" className="underline text-pink-500">
//                   The Cira Terms of Service
//                 </button>{" "}
//                 and will discuss all The Cira output with a doctor.
//               </label>
//             </div>
//           )}

//           <ChatInput
//             onSendMessage={handleUserMessage}
//             label="" // already hiding label
//             disabled={!hasAgreed}
//             submitText=""
//             showMic={false} 
//             placeholder="Reply to Cira..."
//           />
//         </div>
//       </motion.footer>

//     </div>
//   );
// }

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";

import AgentAvatar from "../assets/nurse.png";
import ChatInput from "../components/landing/ChatInput";
import Header from "../components/Header";
import stars from "../assets/stars.svg";

// ⬇️ Adjust these import paths to your actual file locations
import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import PaymentModal from "./modal/PaymentModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import FacialScanModal from "./modal/FacialScanModal";


const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// 🔎 Helper to extract conditions + confidence from the AI summary text
function parseConditionsAndConfidence(summary) {
  if (!summary) return { conditions: [], confidence: null };

  const conditions = [];
  let confidence = null;

  // 1) Overall confidence, e.g. "I am about 85% confident..."
  const confMatch = summary.match(/(\d+)\s*%[^.\n]*confident/i);
  if (confMatch) {
    confidence = Number(confMatch[1]);
  }

  // 2) Block "Top 3 possible conditions..."
  const topBlockMatch = summary.match(
    /top\s*3\s*possible\s*conditions[^:]*:\s*([\s\S]+)/i
  );

  if (topBlockMatch) {
    const lines = topBlockMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const m = line.match(/(\d+)\s*%\s*(.+)/);
      if (!m) break; // stop once we leave the percentage block
      conditions.push({
        percentage: Number(m[1]),
        name: m[2].replace(/\.$/, ""),
      });
    }
  }

  return { conditions, confidence };
}

// 🧼 Helper to remove the "Top 3 possible conditions" text block
function stripTopConditionsFromSummary(summary) {
  if (!summary) return "";

  const pattern =
    /Top\s*3\s*possible\s*conditions[^:]*:\s*([\s\S]*?)(?=\n\s*\n|For self-care|Please book an appointment|Please book|Take care of yourself|$)/i;

  return summary.replace(pattern, "").trim();
}

// 🧼 Helper to pull out the "For self-care..." paragraph and leave rest
function splitOutSelfCare(summary) {
  if (!summary) return { cleaned: "", selfCare: "" };

  const pattern =
    /(For self-care[^]*?)(?=\n\s*\n|Please book an appointment|Please book|Take care of yourself|$)/i;

  const match = summary.match(pattern);
  if (!match) {
    return { cleaned: summary.trim(), selfCare: "" };
  }

  const selfCare = match[1].trim();
  const before = summary.slice(0, match.index);
  const after = summary.slice(match.index + match[0].length);
  const cleaned = (before + after).trim();

  return { cleaned, selfCare };
}

export default function CiraChatAssistant({ initialMessage: initialMessageProp }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [hasAgreed, setHasAgreed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const msgIdRef = useRef(1);
  const nextId = () => `msg-${msgIdRef.current++}`;

  const [messages, setMessages] = useState([]);
  const initialSentRef = useRef(false);

  const [consultSummary, setConsultSummary] = useState(null);
  const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

  const [isThinking, setIsThinking] = useState(false);

  const scrollAreaRef = useRef(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  // 🧩 Extra state for modal flow
  const [conversationSummary, setConversationSummary] = useState("");
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
  const [doctorRecommendationData, setDoctorRecommendationData] = useState(null);

  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);

  const [showDoctorRecommendation, setShowDoctorRecommendation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);


  const isAnyModalOpen =
  showDoctorRecommendationPopUp ||
  showFacialScanPopUp ||
  showVitals ||
  showDoctorRecommendation ||
  showPayment ||
  showAppointment ||
  showConfirmation;

  const conversation = useConversation({
    textOnly: true,
    onConnect: () => {
      console.log("✅ Connected to chat_cira");
      setIsConnected(true);
      setError("");
    },
    onDisconnect: () => {
      console.log("🔌 Disconnected from chat_cira");
      setIsConnected(false);
    },
    onMessage: (payload) => {
      let text = "";
      let role = "unknown";

      if (typeof payload === "string") {
        text = payload;
      } else if (payload) {
        text =
          payload.message ||
          payload.text ||
          payload.formatted?.text ||
          payload.formatted?.transcript ||
          "";
        role = payload.role || payload.source || "unknown";
      }

      if (!text || !text.trim()) return;

      const isAssistant =
        role === "assistant" || role === "ai" || role === "agent";

      if (!isAssistant) {
        console.log("💬 Non-assistant message from SDK:", payload);
        return;
      }

      const trimmedText = text.trim();
      const lower = trimmedText.toLowerCase();

      const looksLikeSummary =
        lower.includes("please consider booking an appointment with a doctor") ||
        lower.includes("please book an appointment with a doctor") ||
        lower.includes("take care of yourself") ||
        trimmedText.length > 300;

      setIsThinking(false);

      if (looksLikeSummary) {
        console.log("📝 Captured consult summary.");
        setConsultSummary(trimmedText);
        setSummaryCreatedAt(new Date());
        setConversationSummary(trimmedText);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: trimmedText,
        },
      ]);
    },
    onError: (err) => {
      console.error("❌ ElevenLabs chat error:", err);
      setError("Something went wrong while talking to Cira. Please try again.");
      setIsThinking(false);
    },
  });

  const { status, sendUserMessage } = conversation;

  const ensureConnected = useCallback(
    async () => {
      if (status === "connected" || isConnecting) return;

      try {
        setIsConnecting(true);
        const convId = await conversation.startSession({
          agentId: CHAT_AGENT_ID,
        });
        console.log("🧵 Chat session started:", convId);
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to start chat session:", err);
        setError("Couldn’t connect to Cira. Please refresh and try again.");
      } finally {
        setIsConnecting(false);
      }
    },
    [status, isConnecting, conversation]
  );

  const locationInitialMessage = location.state?.initialMessage;
  const effectiveInitialMessage = initialMessageProp ?? locationInitialMessage;

  useEffect(() => {
    if (!effectiveInitialMessage) return;
    if (initialSentRef.current) return;
    initialSentRef.current = true;

    const sendInitial = async () => {
      const trimmed = effectiveInitialMessage.trim();
      if (!trimmed) return;

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: trimmed },
      ]);

      setIsThinking(true);

      try {
        await ensureConnected();
        if (sendUserMessage) sendUserMessage(trimmed);
        else setIsThinking(false);
      } catch (err) {
        console.error("Error sending initial message:", err);
        setError("Could not send your message. Please try again.");
        setIsThinking(false);
      }
    };

    sendInitial();
  }, [effectiveInitialMessage, ensureConnected, sendUserMessage]);

  // Auto-scroll messages
  useEffect(() => {
    const c = scrollAreaRef.current;
    if (!c) return;

    c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, consultSummary]);

  const startedTime = new Date();
  const startedLabel = startedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const summaryDateLabel =
    summaryCreatedAt &&
    summaryCreatedAt.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // 🔄 Parse summary into pieces
  const parsedSummary = consultSummary
    ? parseConditionsAndConfidence(consultSummary)
    : { conditions: [], confidence: null };

  let displaySummary = "";
  let selfCareText = "";

  if (consultSummary) {
    const withoutTop = stripTopConditionsFromSummary(consultSummary);
    const split = splitOutSelfCare(withoutTop);
    displaySummary = split.cleaned;
    selfCareText = split.selfCare;

    displaySummary = displaySummary
      .replace(/^\s*Here are the[^\n]*\n?/gim, "")
      .replace(/Take care of yourself,[^\n]*\n?/gi, "")
      .trim();

    // 🔧 remove big vertical gaps between paragraphs
    displaySummary = displaySummary.replace(/\n{3,}/g, "\n\n");
  }

  const handleUserMessage = async (text) => {
    if (!hasAgreed) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed },
    ]);

    // 👇 mark that chat has started (hide TOS block)
    setHasStartedChat(true);

    setIsThinking(true);

    try {
      await ensureConnected();
      if (sendUserMessage) sendUserMessage(trimmed);
      else setIsThinking(false);
    } catch (err) {
      console.error("Error sending user message:", err);
      setError("Could not send your message. Please try again.");
      setIsThinking(false);
    }
  };

  const handleExit = () => {
    try {
      conversation.endSession?.();
    } catch (e) {
      console.warn("Error ending session:", e);
    }
    navigate("/");
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 🔘 When user clicks "Find Doctor Specialist" in summary
  const handleFindDoctorSpecialistClick = () => {
    if (!consultSummary) return;

    const primaryCondition =
      parsedSummary.conditions[0]?.name || "your health concerns";

    setDoctorRecommendationData({
      condition: primaryCondition,
      specialty: "General Physician",
    });
    setConversationSummary(consultSummary);
    setShowDoctorRecommendationPopUp(true);
  };

  // 🌡️ Modal flow handlers
  const handleFindSpecialistDoctorClick = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowDoctorRecommendation(true);
  };

  const handleSkipDoctorRecommendation = () => {
    setShowDoctorRecommendationPopUp(false);
  };

  const handleStartFacialScan = () => {
    setIsScanning(true);
    setShowFacialScanPopUp(false);

    // TODO: Replace this with your real facial scan / vitals API
    setTimeout(() => {
      setIsScanning(false);
      setVitalsData({
        heartRate: 80,
        spo2: 98,
        temperature: 36.8,
      });
      setShowVitals(true);
    }, 1500);
  };

  const handleSkipFacialScan = () => {
    setShowFacialScanPopUp(false);
  };

  const handleContinueFromVitals = () => {
    setShowVitals(false);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorRecommendation(false);
    setShowPayment(true);
  };

  const handleSkipDoctor = () => {
    setShowDoctorRecommendation(false);
  };

  const handlePaymentSuccess = (details) => {
    setShowPayment(false);
    setBookingDetails(details);
    setShowAppointment(true);
  };

  const handlePaymentBack = () => {
    setShowPayment(false);
    setShowDoctorRecommendation(true);
  };

  const handleBookingSuccess = (details) => {
    setShowAppointment(false);
    setBookingDetails(details);
    setShowConfirmation(true);
  };

  const handleAppointmentBack = () => {
    setShowAppointment(false);
    setShowPayment(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedDoctor(null);
    setBookingDetails(null);
  };

return (
    <>
      <div
        className="fixed bg-[#FFFEF9] inset-0 w-full flex flex-col pt-12"
      >
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-20">
          <Header className="bg-transparent shadow-none border-none" />
        </header>

        {/* Scroll area covering entire screen except fixed footer */}
        <motion.div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto pt-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full flex justify-center min-h-full pb-48">
            <div className="w-full max-w-xl">
              {/* Content area */}
              <div className="px-4 pt-6 pb-8">
                <header className="mb-6 px-4 pt-24">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold">
                        <img src={stars} alt="stars" />
                      </div>
                      <div className="flex -space-x-2">
                        <img
                          src={AgentAvatar}
                          alt="Clinician 2"
                          className="w-8 h-8 rounded-full border border-white object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-2">
                    Cira Consult
                  </h1>
                  <p className="text-sm mt-5 text-gray-500 mb-1">
                    Consult started: Today, {startedLabel}
                  </p>
                  <p className="text-xs mt-5 text-black font-bold">
                    If this is an emergency, call 999 or your local emergency
                    number.
                  </p>
                </header>

                {error && (
                  <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
                    {error}
                  </div>
                )}

                <div className="border border-gray-200 mb-5" />

                <div className="space-y-4">
                  {messages.map((m) => {
                    const isAssistant = m.role === "assistant";
                    return (
                      <div
                        key={m.id}
                        className={`flex w-full ${
                          isAssistant ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`
                              px-4 py-4 text-sm
                              ${
                                isAssistant
                                  ? "rounded-2xl text-gray-800"
                                  : "rounded-2xl rounded-tr-none bg-pink-500 text-white"
                              }
                            `}
                          >
                            {m.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isThinking && (
                    <div className="flex w-full justify-start">
                      <div className="flex items-center">
                        <div className="flex w-full justify-start">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500">
                              <span className="inline-flex gap-1 items-center">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                  style={{
                                    animation:
                                      "dotWave 1.2s infinite ease-in-out",
                                    animationDelay: "0s",
                                  }}
                                />
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                  style={{
                                    animation:
                                      "dotWave 1.2s infinite ease-in-out",
                                    animationDelay: "0.15s",
                                  }}
                                />
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                  style={{
                                    animation:
                                      "dotWave 1.2s infinite ease-in-out",
                                    animationDelay: "0.3s",
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUMMARY */}
                {consultSummary && (
                  <section className="w-full mt-6 mb-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E3E3F3] px-5 py-6">
                      <div className="w-full flex justify-center my-4">
                        <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
                          <img
                            src={AgentAvatar}
                            alt=""
                            className="w-32 h-32 rounded-full mb-3"
                          />
                          <p className="text-xs text-gray-500">
                            Your AI clinician assistant, Cira
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          AI Consult Summary
                        </h2>
                        {summaryDateLabel && (
                          <p className="text-xs text-gray-400">
                            {summaryDateLabel}
                          </p>
                        )}
                      </div>

                      {/* Narrative summary WITHOUT "Top 3..." and WITHOUT self-care / stray lines */}
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                        {displaySummary}
                      </p>

                      {/* 🔹 Conditions with percentages */}
                      {parsedSummary.conditions.length > 0 && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Conditions Matching
                          </h3>

                          <div className="space-y-3">
                            {parsedSummary.conditions.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                  <span className="text-gray-800 truncate">
                                    {c.name}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  {c.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 🔹 Assessment confidence bar */}
                      {parsedSummary.confidence != null && (
                        <div className="mt-5">
                          <p className="text-xs text-gray-500 mb-1">
                            Assessment confidence
                          </p>

                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-emerald-600">
                              {parsedSummary.confidence >= 80
                                ? "Pretty sure"
                                : parsedSummary.confidence >= 60
                                ? "Somewhat sure"
                                : "Low confidence"}
                            </span>
                            <span className="text-gray-600">
                              {parsedSummary.confidence}%
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${Math.min(
                                  parsedSummary.confidence,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* 🔹 Self-care / when to seek help (dynamic from summary) */}
                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          Self-care & when to seek help
                        </h3>

                        {selfCareText ? (
                          <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
                            {selfCareText}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-600 mb-2">
                            Home care with rest, fluids, and over-the-counter pain
                            relievers is usually enough for most mild illnesses. If
                            your fever rises, breathing becomes difficult, or your
                            symptoms last more than a few days or suddenly worsen,
                            contact a doctor or urgent care.
                          </p>
                        )}

                        <p className="text-[11px] text-gray-400">
                          These are rough estimates and do not replace medical
                          advice. Always consult a healthcare professional if
                          you&apos;re worried.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                            hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
                        >
                          Download Report Note (PDF)
                        </button>
                        <button
                          type="button"
                          onClick={handleFindDoctorSpecialistClick}
                          className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5"
                        >
                          Find Doctor Specialist
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fixed footer */}
        <motion.footer
          className="w-full flex-shrink-0 flex justify-center px-4 bg-transparent fixed bottom-0"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="w-full pt-4 pb-2 max-w-xl bg-white rounded-xl space-y-3 shadow-lg">
            {/* ✅ Only show TOS before first message */}
            {!hasStartedChat && (
              <div className="flex items-start gap-2 text-[11px] text-gray-600 px-4">
                <input
                  id="tos"
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="tos">
                  I agree to the{" "}
                  <button type="button" className="underline text-pink-500">
                    The Cira Terms of Service
                  </button>{" "}
                  and will discuss all The Cira output with a doctor.
                </label>
              </div>
            )}

            <ChatInput
              onSendMessage={handleUserMessage}
              label=""
              disabled={!hasAgreed}
              submitText=""
              showMic={false}
              placeholder="Reply to Cira..."
            />
          </div>
        </motion.footer>
      </div>

      {/* Modals with overlay – block background interaction */}
      <AnimatePresence>
        {isAnyModalOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* All modals render inside this overlay */}
            {showDoctorRecommendationPopUp && (
              <DoctorRecommendationPopUp
                condition={
                  doctorRecommendationData?.condition || "your health concerns"
                }
                recommendedSpecialty={
                  doctorRecommendationData?.specialty || "General Physician"
                }
                onFindDoctor={handleFindSpecialistDoctorClick}
                onSkip={handleSkipDoctorRecommendation}
                conversationSummary={conversationSummary}
              />
            )}

            {showFacialScanPopUp && (
              <FacialScanModal
                onStartScan={handleStartFacialScan}
                onSkipScan={handleSkipFacialScan}
                isScanning={isScanning}
              />
            )}

            {showVitals && vitalsData && (
              <VitalSignsDisplay
                vitals={vitalsData}
                onClose={handleContinueFromVitals}
                onStartConversation={handleContinueFromVitals}
              />
            )}

            {showDoctorRecommendation && doctorRecommendationData && (
              <DoctorRecommendationModal
                condition={doctorRecommendationData.condition}
                recommendedSpecialty={doctorRecommendationData.specialty}
                onSelectDoctor={handleSelectDoctor}
                onSkip={handleSkipDoctor}
              />
            )}

            {showPayment && selectedDoctor && (
              <PaymentModal
                doctor={selectedDoctor}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={handlePaymentBack}
              />
            )}

            {showAppointment && selectedDoctor && (
              <AppointmentModal
                doctor={selectedDoctor}
                onBookingSuccess={handleBookingSuccess}
                onBack={handleAppointmentBack}
              />
            )}

            {showConfirmation && bookingDetails && (
              <BookingConfirmationModal
                bookingDetails={bookingDetails}
                onClose={handleConfirmationClose}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

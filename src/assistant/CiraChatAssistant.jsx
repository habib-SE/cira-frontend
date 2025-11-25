
// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useConversation } from "@11labs/react";
// import AgentAvatar from "../assets/nurse.png";
// import ChatInput from "../components/landing/ChatInput";
// import { motion } from "framer-motion"; 
// const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

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

//   // 🔹 Dynamic consult summary
//   const [consultSummary, setConsultSummary] = useState(null);
//   const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

//   // Scroll refs
//   const messagesContainerRef = useRef(null);
//   const endOfMessagesRef = useRef(null);

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

//       if (looksLikeSummary) {
//         console.log("📝 Captured consult summary from assistant (not adding to chat).");
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

//   // Use prop initialMessage first, fallback to location.state
//   const locationInitialMessage = location.state?.initialMessage;
//   const effectiveInitialMessage = initialMessageProp ?? locationInitialMessage;

//   // Initial message (from Hero or route)
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

//       try {
//         await ensureConnected();
//         if (sendUserMessage) {
//           sendUserMessage(trimmed);
//         } else {
//           console.warn("sendUserMessage is not available on conversation");
//         }
//       } catch (err) {
//         console.error("Error sending initial message:", err);
//       }
//     };

//     sendInitial();
//   }, [effectiveInitialMessage, ensureConnected, sendUserMessage]);

//   // Auto-scroll
//   useEffect(() => {
//     if (endOfMessagesRef.current) {
//       endOfMessagesRef.current.scrollIntoView({
//         behavior: "auto",
//         block: "end",
//       });
//     } else if (messagesContainerRef.current) {
//       const el = messagesContainerRef.current;
//       el.scrollTop = el.scrollHeight;
//     }
//   }, [messages]);

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

//   // 🔹 Called by ChatInput when user sends a message
//   const handleUserMessage = async (text) => {
//     if (!hasAgreed) return;
//     const trimmed = text.trim();
//     if (!trimmed) return;

//     const userMsg = {
//       id: nextId(),
//       role: "user",
//       text: trimmed,
//     };
//     setMessages((prev) => [...prev, userMsg]);

//     try {
//       await ensureConnected();
//       if (sendUserMessage) {
//         sendUserMessage(trimmed);
//       } else {
//         console.warn("sendUserMessage is not available on conversation");
//       }
//     } catch (err) {
//       console.error("Error sending user message:", err);
//       setError("Could not send your message. Please try again.");
//     }
//   };

//   const handleExit = () => {
//     try {
//       conversation.endSession?.();
//     } catch (e) {
//       console.warn("Error ending session on exit:", e);
//     }
//     navigate("/");
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       {/* ─────────────────────────────
//           Top header (Doctronic-style)
//           ───────────────────────────── */}
//          <motion.header
//         className="w-full px-4 pt-6 pb-4 flex justify-center"
//         initial={{ y: 80, opacity: 0 }}             // start lower, near center
//         animate={{ y: 0, opacity: 1 }}              // slide up to top
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <div className="w-full max-w-xl">
//           {/* Logo + avatars row */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold">
//                 C
//               </div>

//               <div className="flex -space-x-2">
//                 <img
//                   src={AgentAvatar}
//                   alt="Clinician 1"
//                   className="w-8 h-8 rounded-full border border-white object-cover"
//                 />
//                 <img
//                   src={AgentAvatar}
//                   alt="Clinician 2"
//                   className="w-8 h-8 rounded-full border border-white object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111827] mb-1">
//             Cira Consult
//           </h1>
//           <p className="text-sm text-gray-500 mb-1">
//             Consult started: Today, {startedLabel}
//           </p>
//           <p className="text-xs text-black">
//             If this is an emergency, call 999 or your local emergency number.
//           </p>
//         </div>
//       </motion.header>



//       {/* ─────────────────────────────
//           Main content
//           ───────────────────────────── */}
//       <main className="flex-1 flex flex-col items-center px-4 pt-4 pb-28">
//         {error && (
//           <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
//             {error}
//           </div>
//         )}

//         {/* Chat + summary */}
//         <div className="w-full max-w-4xl flex-1 flex flex-col items-center">
//           {/* Chat messages */}
//           <div
//             ref={messagesContainerRef}
//             className="w-full max-w-xl flex-1 overflow-y-auto space-y-4 pr-1"
//           >
//             {messages.map((m) => {
//               const isAssistant = m.role === "assistant";
//               return (
//                 <div
//                   key={m.id}
//                   className={`flex w-full ${
//                     isAssistant ? "justify-start" : "justify-end"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 max-w-[80%]">
//                     {isAssistant && (
//                       <img
//                         src={AgentAvatar}
//                         alt="Cira avatar"
//                         className="w-7 h-7 rounded-full flex-shrink-0"
//                       />
//                     )}

//                     <div
//                       className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
//                         isAssistant
//                           ? "bg-white text-gray-800"
//                           : "bg-pink-500 text-white"
//                       }`}
//                     >
//                       {m.text}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             <div ref={endOfMessagesRef} />
//           </div>

//           {/* AI Consult Summary */}
//           {consultSummary && (
//             <section className="w-full max-w-xl mt-6 mb-2">
//               <div className="bg-white rounded-2xl shadow-sm border border-[#E3E3F3] px-5 py-6">
//                 <div className="w-full flex justify-center my-4">
//                   <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
//                     <img
//                       src={AgentAvatar}
//                       alt="Cira avatar"
//                       className="w-32 h-32 rounded-full object-cover mb-3"
//                     />
//                     <p className="text-xs text-gray-500">
//                       Your AI clinician assistant, Cira
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-1">
//                     AI Consult Summary
//                   </h2>
//                   {summaryDateLabel && (
//                     <p className="text-xs text-gray-400">{summaryDateLabel}</p>
//                   )}
//                 </div>

//                 <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
//                   {consultSummary}
//                 </p>

//                 <div className="mt-4 flex flex-col sm:flex-row gap-3">
//                   <button
//                     type="button"
//                     className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
//                       hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
//                   >
//                     Download Reports Note (PDF)
//                   </button>
//                   <button
//                     type="button"
//                     className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-[#E4ECFF] text-[#2F4EBB] py-2.5 hover:bg-[#D4E0FF] transition-colors"
//                   >
//                     Share Summary
//                   </button>
//                 </div>
//               </div>
//             </section>
//           )}
//         </div>
//       </main>

//       {/* Fixed footer with TOS + ChatInput */}
//    <motion.footer
//         className=" px-4 py-3 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
//         initial={{ y: -80, opacity: 0 }}            // start higher, near center
//         animate={{ y: 0, opacity: 1 }}              // slide down to bottom
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <div className="max-w-xl bg-white mx-auto space-y-3">
//           <div className="flex items-start gap-2 text-[11px] text-gray-600">
//             <input
//               id="tos"
//               type="checkbox"
//               checked={hasAgreed}
//               onChange={(e) => setHasAgreed(e.target.checked)}
//               className="mt-0.5"
//             />
//             <label htmlFor="tos">
//               I agree to the{" "}
//               <button
//                 type="button"
//                 className="underline text-pink-500 hover:text-pink-600"
//               >
//                 The Cira Terms of Service
//               </button>{" "}
//               and will discuss all The Cira output with a doctor.
//             </label>
//           </div>

//           <ChatInput
//             onSendMessage={handleUserMessage}
//             disabled={!hasAgreed}
//             label={null}
//             placeholder="Describe how you're feeling or what you're worried about..."
//             submitText=""   // only arrow icon
//           />
//         </div>
//       </motion.footer>

//     </div>
//   );
// }
// src/assistant/CiraChatAssistant.jsx
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { motion } from "framer-motion";

import AgentAvatar from "../assets/nurse.png";
import ChatInput from "../components/landing/ChatInput";
import Header from "../components/Header";
import stars from "../assets/stars.svg"
const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

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

      // stop thinking when assistant responds
      setIsThinking(false);

      if (looksLikeSummary) {
        console.log("📝 Captured consult summary from assistant (not adding to chat).");
        setConsultSummary(trimmedText);
        setSummaryCreatedAt(new Date());
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

  // initial message from hero / route
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
        if (sendUserMessage) {
          sendUserMessage(trimmed);
        } else {
          console.warn("sendUserMessage is not available on conversation");
          setIsThinking(false);
        }
      } catch (err) {
        console.error("Error sending initial message:", err);
        setError("Could not send your message. Please try again.");
        setIsThinking(false);
      }
    };

    sendInitial();
  }, [effectiveInitialMessage, ensureConnected, sendUserMessage]);

  // auto-scroll header+messages area
  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
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

  const handleUserMessage = async (text) => {
    if (!hasAgreed) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: nextId(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      await ensureConnected();
      if (sendUserMessage) {
        sendUserMessage(trimmed);
      } else {
        console.warn("sendUserMessage is not available on conversation");
        setIsThinking(false);
      }
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
      console.warn("Error ending session on exit:", e);
    }
    navigate("/");
  };
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-[#FFFDF9] overflow-hidden">
      {/* 🔹 Cira logo + Login header – shown only on chat page */}
      <Header />
      {/* Scroll area: header + messages + summary */}
      <motion.div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 pt-6 pb-8 flex justify-center"
        initial={{ opacity: 0, y: 60 }}          // ⬅️ start lower (near footer)
        animate={{ opacity: 1, y: 0 }}          // ⬅️ move up to normal position
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-xl">
          {/* Cira Consult header */}
          <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold">
                  <img src={stars} alt="stars" />
                </div>
                <div className="flex -space-x-2">
                  <img
                    src={AgentAvatar}
                    alt="Clinician 1"
                    className="w-8 h-8 rounded-full border border-white object-cover"
                  />
                  <img
                    src={AgentAvatar}
                    alt="Clinician 2"
                    className="w-8 h-8 rounded-full border border-white object-cover"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111827] mb-1">
              Cira Consult
            </h1>
            <p className="text-sm text-gray-500 mb-1">
              Consult started: Today, {startedLabel}
            </p>
            <p className="text-xs text-black">
              If this is an emergency, call 999 or your local emergency number.
            </p>
          </header>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
              {error}
            </div>
          )}

          {/* Messages + thinking bubble */}
          <div className="space-y-4">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
                    }`}
                >
                  <div className="flex items-center gap-2 max-w-[80%]">
                    {isAssistant && (
                      <img
                        src={AgentAvatar}
                        alt="Cira avatar"
                        className="w-7 h-7 rounded-full flex-shrink-0"
                      />
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAssistant
                          ? "bg-white text-gray-800"
                          : "bg-pink-500 text-white"
                        }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <img
                    src={AgentAvatar}
                    alt="Cira avatar"
                    className="w-7 h-7 rounded-full flex-shrink-0"
                  />
                  <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white text-gray-500">
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Consult Summary */}
          {consultSummary && (
            <section className="w-full mt-6 mb-2">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E3E3F3] px-5 py-6">
                <div className="w-full flex justify-center my-4">
                  <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
                    <img
                      src={AgentAvatar}
                      alt="Cira avatar"
                      className="w-32 h-32 rounded-full object-cover mb-3"
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
                    <p className="text-xs text-gray-400">{summaryDateLabel}</p>
                  )}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                  {consultSummary}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 
                      hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
                  >
                    Download Reports Note (PDF)
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-[#E4ECFF] text-[#2F4EBB] py-2.5 hover:bg-[#D4E0FF] transition-colors"
                  >
                    Share Summary
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </motion.div>

      {/* Fixed footer with TOS + input */}
      <motion.footer
        className="w-full flex-shrink-0 flex justify-center pb-6 px-4"
        initial={{ y: -60, opacity: 0 }}        // ⬅️ start higher (towards middle)
        animate={{ y: 0, opacity: 1 }}          // ⬅️ move down to bottom
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="w-full max-w-xl bg-white mx-auto space-y-3">
          <div className="flex items-start gap-2 text-[11px] text-gray-600">
            <input
              id="tos"
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="tos">
              I agree to the{" "}
              <button
                type="button"
                className="underline text-pink-500 hover:text-pink-600"
              >
                The Cira Terms of Service
              </button>{" "}
              and will discuss all The Cira output with a doctor.
            </label>
          </div>

          <ChatInput
            onSendMessage={handleUserMessage}
            disabled={!hasAgreed}
            label={null}
            placeholder="Describe how you're feeling or what you're worried about..."
            submitText="" // only arrow icon
          />
        </div>
      </motion.footer>
    </div>
  );
}

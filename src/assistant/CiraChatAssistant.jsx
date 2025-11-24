// import React, {
//     useCallback,
//     useEffect,
//     useRef,
//     useState,
// } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { Send } from "lucide-react";
// import { useConversation } from "@11labs/react";
// import Stars from "../assets/stars.svg"
// // 👇 import your agent avatar image
// import AgentAvatar from "../assets/avatar.png"; // <-- update path if needed

// const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// export default function CiraChatAssistant() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [hasAgreed, setHasAgreed] = useState(false);
//     const [input, setInput] = useState("");

//     const [isConnecting, setIsConnecting] = useState(false);
//     const [isConnected, setIsConnected] = useState(false);
//     const [error, setError] = useState("");

//     const msgIdRef = useRef(1);
//     const nextId = () => `msg-${msgIdRef.current++}`;

//     const [messages, setMessages] = useState([
//         {
//             id: nextId(),
//             role: "assistant",
//             text: "Hello! I’m here to help. If you have any questions or concerns about weight management or anything else, feel free to share.",
//         },
//     ]);

//     const initialSentRef = useRef(false);

//     // Scroll container + end-of-list refs
//     const messagesContainerRef = useRef(null);
//     const endOfMessagesRef = useRef(null);

//     const conversation = useConversation({
//         textOnly: true,
//         onConnect: () => {
//             console.log("✅ Connected to chat_cira");
//             setIsConnected(true);
//             setError("");
//         },
//         onDisconnect: () => {
//             console.log("🔌 Disconnected from chat_cira");
//             setIsConnected(false);
//         },
//         onMessage: (payload) => {
//             let text = "";
//             let role = "unknown";

//             if (typeof payload === "string") {
//                 text = payload;
//             } else if (payload) {
//                 text =
//                     payload.message ||
//                     payload.text ||
//                     payload.formatted?.text ||
//                     payload.formatted?.transcript ||
//                     "";
//                 role = payload.role || payload.source || "unknown";
//             }

//             if (!text || !text.trim()) return;

//             const isAssistant =
//                 role === "assistant" || role === "ai" || role === "agent";

//             if (!isAssistant) {
//                 console.log("💬 Non-assistant message from SDK:", payload);
//                 return;
//             }

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     id: nextId(),
//                     role: "assistant",
//                     text: text.trim(),
//                 },
//             ]);
//         },
//         onError: (err) => {
//             console.error("❌ ElevenLabs chat error:", err);
//             setError("Something went wrong while talking to Cira. Please try again.");
//         },
//     });

//     const { status, sendUserMessage } = conversation;

//     const ensureConnected = useCallback(
//         async () => {
//             if (status === "connected" || isConnecting) return;

//             try {
//                 setIsConnecting(true);
//                 const convId = await conversation.startSession({
//                     agentId: CHAT_AGENT_ID,
//                 });
//                 console.log("🧵 Chat session started:", convId);
//                 setIsConnected(true);
//             } catch (err) {
//                 console.error("Failed to start chat session:", err);
//                 setError("Couldn’t connect to Cira. Please refresh and try again.");
//             } finally {
//                 setIsConnecting(false);
//             }
//         },
//         [status, isConnecting, conversation]
//     );

//     // Initial message from hero
//     useEffect(() => {
//         const initialMessage = location.state?.initialMessage;
//         if (!initialMessage) return;
//         if (initialSentRef.current) return;
//         initialSentRef.current = true;

//         const sendInitial = async () => {
//             const trimmed = initialMessage.trim();
//             if (!trimmed) return;

//             setMessages((prev) => [
//                 ...prev,
//                 { id: nextId(), role: "user", text: trimmed },
//             ]);

//             try {
//                 await ensureConnected();
//                 if (sendUserMessage) {
//                     sendUserMessage(trimmed);
//                 } else {
//                     console.warn("sendUserMessage is not available on conversation");
//                 }
//             } catch (err) {
//                 console.error("Error sending initial message:", err);
//             }
//         };

//         sendInitial();
//     }, [location.state?.initialMessage, ensureConnected, sendUserMessage]);

//     // Auto-scroll to bottom whenever messages change
//     useEffect(() => {
//         if (endOfMessagesRef.current) {
//             endOfMessagesRef.current.scrollIntoView({
//                 behavior: "auto",
//                 block: "end",
//             });
//         } else if (messagesContainerRef.current) {
//             const el = messagesContainerRef.current;
//             el.scrollTop = el.scrollHeight;
//         }
//     }, [messages]);

//     const startedTime = new Date();
//     const startedLabel = startedTime.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//     });

//     const handleSend = async (e) => {
//         e.preventDefault();
//         const trimmed = input.trim();
//         if (!trimmed || !hasAgreed) return;

//         const userMsg = {
//             id: nextId(),
//             role: "user",
//             text: trimmed,
//         };
//         setMessages((prev) => [...prev, userMsg]);
//         setInput("");

//         try {
//             await ensureConnected();
//             if (sendUserMessage) {
//                 sendUserMessage(trimmed);
//             } else {
//                 console.warn("sendUserMessage is not available on conversation");
//             }
//         } catch (err) {
//             console.error("Error sending user message:", err);
//             setError("Could not send your message. Please try again.");
//         }
//     };

//     const handleExit = () => {
//         try {
//             conversation.endSession?.();
//         } catch (e) {
//             console.warn("Error ending session on exit:", e);
//         }
//         navigate("/");
//     };

//     return (
//         <div className="h-screen flex flex-col bg-[#FFFDF9]">
//             {/* Top bar */}
//             <header className="flex items-center justify-between px-6 py-4 border-b border-[#F2E6D9]">
//                 <div className="flex-shrink-0 flex gap-2 items-center">

//                     <img src={Stars} alt="stars logo" />
//                     <Link
//                         to="/"
//                         className="text-2xl font-semibold text-gray-900"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                     >
//                         Cira
//                     </Link>

//                 </div>

//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                     {isConnecting && <span>Connecting…</span>}
//                     {/* {isConnected && !isConnecting && <span>Online</span>} */}
//                     <button
//                         onClick={handleExit}
//                         className="text-sm text-gray-500 hover:text-gray-700"
//                     >
//                         Exit
//                     </button>
//                 </div>
//             </header>

//             {/* Main content */}
//             <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-28">
//                 <div className="text-center mb-8">
//                     <p className="text-xs text-gray-500 mb-1">
//                         Started Today, {startedLabel}
//                     </p>
//                     <p className="text-[11px] text-gray-400">
//                         If this is an emergency, call 999 or your local emergency number.
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
//                         {error}
//                     </div>
//                 )}

//                 {/* Chat messages container */}
//                 <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
//                     <div
//                         ref={messagesContainerRef}
//                         className="w-full max-w-3xl flex-1 overflow-y-auto space-y-4 pr-1"
//                     >
//                         {messages.map((m) => {
//                             const isAssistant = m.role === "assistant";
//                             return (
//                                 <div
//                                     key={m.id}
//                                     className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
//                                         }`}
//                                 >
//                                     <div className="flex items-center gap-2  max-w-[80%]">
//                                         {/* Avatar only for assistant */}
//                                         {isAssistant && (
//                                             <img
//                                                 src={AgentAvatar}
//                                                 alt="Cira avatar"
//                                                 className="w-7 h-7 rounded-full flex-shrink-0"
//                                             />
//                                         )}

//                                         {/* Bubble */}
//                                         <div
//                                             className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAssistant
//                                                     ? "bg-white text-gray-800"
//                                                     : "bg-pink-500 text-white"
//                                                 }`}
//                                         >
//                                             {m.text}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}

//                         {/* Sentinel element to scroll into view */}
//                         <div ref={endOfMessagesRef} />
//                     </div>
//                 </div>
//             </main>

//             {/* Fixed footer with input */}
//             <footer className="border-t border-[#F2E6D9] bg-[#FFF7EA] px-4 py-3 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
//                 <div className="max-w-3xl mx-auto space-y-3">
//                     <div className="flex items-start gap-2 text-[11px] text-gray-600">
//                         <input
//                             id="tos"
//                             type="checkbox"
//                             checked={hasAgreed}
//                             onChange={(e) => setHasAgreed(e.target.checked)}
//                             className="mt-0.5"
//                         />
//                         <label htmlFor="tos">
//                             I agree to the{" "}
//                             <button
//                                 type="button"
//                                 className="underline text-pink-500 hover:text-pink-600"
//                             >
//                                 The Wellness Terms of Service
//                             </button>{" "}
//                             and will discuss all The Wellness output with a doctor.
//                         </label>
//                     </div>

//                     <form
//                         onSubmit={handleSend}
//                         className="flex items-center gap-2 bg-white rounded-md px-4 py-2 shadow-sm border border-[#F2E6D9]"
//                     >
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Ask me anything about your health..."
//                             className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
//                             disabled={!hasAgreed}
//                         />
//                         <button
//                             type="submit"
//                             disabled={!hasAgreed || !input.trim()}
//                             className="w-9 h-9 rounded-full flex items-center justify-center bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
//                         >
//                             <Send className="w-4 h-4" />
//                         </button>
//                     </form>
//                 </div>
//             </footer>
//         </div>
//     );
// }



import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { useConversation } from "@11labs/react";
import Stars from "../assets/stars.svg";
import AgentAvatar from "../assets/avatar.png";

const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

export default function CiraChatAssistant() {
    const location = useLocation();
    const navigate = useNavigate();

    const [hasAgreed, setHasAgreed] = useState(false);
    const [input, setInput] = useState("");

    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState("");

    const msgIdRef = useRef(1);
    const nextId = () => `msg-${msgIdRef.current++}`;

    const [messages, setMessages] = useState([]);

    const initialSentRef = useRef(false);

    // 🔹 Dynamic consult summary (from the last long assistant message)
    const [consultSummary, setConsultSummary] = useState(null);
    const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

    // Scroll container + end-of-list refs
    const messagesContainerRef = useRef(null);
    const endOfMessagesRef = useRef(null);

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

            // 🔍 Detect if this looks like the final clinical summary
            const lower = trimmedText.toLowerCase();
            const looksLikeSummary =
                lower.includes(
                    "please consider booking an appointment with a doctor"
                ) ||
                lower.includes("please book an appointment with a doctor") ||
                lower.includes("take care of yourself") ||
                trimmedText.length > 300; // fallback: long paragraph

            if (looksLikeSummary) {
                console.log("📝 Captured consult summary from assistant (not adding to chat).");
                setConsultSummary(trimmedText);
                setSummaryCreatedAt(new Date());
                // ❗ Do NOT add this message to chat bubbles
                return;
            }

            // Normal assistant messages go into chat
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

    // Initial message from hero
    useEffect(() => {
        const initialMessage = location.state?.initialMessage;
        if (!initialMessage) return;
        if (initialSentRef.current) return;
        initialSentRef.current = true;

        const sendInitial = async () => {
            const trimmed = initialMessage.trim();
            if (!trimmed) return;

            setMessages((prev) => [
                ...prev,
                { id: nextId(), role: "user", text: trimmed },
            ]);

            try {
                await ensureConnected();
                if (sendUserMessage) {
                    sendUserMessage(trimmed);
                } else {
                    console.warn("sendUserMessage is not available on conversation");
                }
            } catch (err) {
                console.error("Error sending initial message:", err);
            }
        };

        sendInitial();
    }, [location.state?.initialMessage, ensureConnected, sendUserMessage]);

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
        } else if (messagesContainerRef.current) {
            const el = messagesContainerRef.current;
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

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

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || !hasAgreed) return;

        const userMsg = {
            id: nextId(),
            role: "user",
            text: trimmed,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            await ensureConnected();
            if (sendUserMessage) {
                sendUserMessage(trimmed);
            } else {
                console.warn("sendUserMessage is not available on conversation");
            }
        } catch (err) {
            console.error("Error sending user message:", err);
            setError("Could not send your message. Please try again.");
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

    return (
        <div className="h-screen flex flex-col bg-[#FFFDF9]">
            {/* Top bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#F2E6D9]">
                <div className="flex-shrink-0 flex gap-2 items-center">
                    <img src={Stars} alt="stars logo" />
                    <Link
                        to="/"
                        className="text-2xl font-semibold text-gray-900"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                        Cira
                    </Link>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                    {isConnecting && <span>Connecting…</span>}
                    <button
                        onClick={handleExit}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Exit
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-28">
                {/* Top notice */}
                <div className="text-center mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                        Started Today, {startedLabel}
                    </p>
                    <p className="text-[11px] text-gray-400">
                        If this is an emergency, call 999 or your local emergency number.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
                        {error}
                    </div>
                )}

                {/* Chat + summary */}
                <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
                    {/* Chat messages */}
                    <div
                        ref={messagesContainerRef}
                        className="w-full max-w-3xl flex-1 overflow-y-auto space-y-4 pr-1"
                    >
                        {messages.map((m) => {
                            const isAssistant = m.role === "assistant";
                            return (
                                <div
                                    key={m.id}
                                    className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 max-w-[80%]">
                                        {/* Avatar only for assistant */}
                                        {isAssistant && (
                                            <img
                                                src={AgentAvatar}
                                                alt="Cira avatar"
                                                className="w-7 h-7 rounded-full flex-shrink-0"
                                            />
                                        )}

                                        {/* Bubble */}
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

                        {/* Sentinel element to scroll into view */}
                        <div ref={endOfMessagesRef} />
                    </div>

                    {/* 🔹 AI Consult Summary BELOW the chat */}
                    {consultSummary && (
                        <section className="w-full max-w-3xl mt-6 mb-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#E3E3F3] px-5 py-6">
                                {/* Title + time */}
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

                                {/* Dynamic summary from chat */}
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                    {consultSummary}
                                </p>

                                {/* Center avatar image */}
                                <div className="w-full flex justify-center my-4">
                                    <div className="rounded-xl overflow-hidden bg-[#F5F5FF] border border-[#E2E4FF] px-6 py-4 flex flex-col items-center">
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

                                {/* Optional: action buttons */}
                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-[#2F6BFF] text-white py-2.5 hover:bg-[#2557CC] transition-colors"
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
            </main>

            {/* Fixed footer with input */}
            <footer className="border-t border-[#F2E6D9] bg-[#FFF7EA] px-4 py-3 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
                <div className="max-w-3xl mx-auto space-y-3">
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

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 bg-white rounded-md px-4 py-2 shadow-sm border border-[#F2E6D9]"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about your health..."
                            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                            disabled={!hasAgreed}
                        />
                        <button
                            type="submit"
                            disabled={!hasAgreed || !input.trim()}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}

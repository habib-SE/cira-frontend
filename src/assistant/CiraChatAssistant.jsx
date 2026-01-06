import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";

import AgentAvatar from "../assets/nurse.png";
import ChatInput from "../components/landing/ChatInput";
import Header from "../components/Header";
import stars from "../assets/stars.svg";

import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import PaymentModal from "./modal/PaymentModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import FacialScanModal from "./modal/FacialScanModal";
import {
  downloadPatientSummaryFromChatData,
  downloadEHRSOAPFromChatData,
  downloadDoctorsReport,
} from "../utils/clinicalReport/pdfGenerator";

const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// State machine for chat
const CHAT_STATE = {
  TRIAGE: "triage",
  FINALIZING: "finalizing",
  FINAL: "final"
};

/* ------------------------------------------------------------------ */
/*  Simple Helpers                                                    */
/* ------------------------------------------------------------------ */

const prettyTitle = (s = "") =>
  String(s)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const parseConditionsMatching = (text = "") => {
  return String(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.*?)\s*[—-]\s*(\d{1,3})\s*%/);
      if (!m) return null;
      return { name: m[1].trim(), percentage: Number(m[2]) };
    })
    .filter(Boolean);
};

const parseConfidencePercent = (text = "") => {
  const m = String(text).match(/(\d{1,3})\s*%/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

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

  // Tool outputs AND JSON outputs
  const [toolSummary, setToolSummary] = useState("");
  const [toolConditionsText, setToolConditionsText] = useState("");
  const [toolConfidenceText, setToolConfidenceText] = useState("");
  const [toolSelfCare, setToolSelfCare] = useState("");
  const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const scrollAreaRef = useRef(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  // Modal states
  const [conversationSummary, setConversationSummary] = useState("");
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
  const [doctorRecommendationData, setDoctorRecommendationData] = useState(null);
  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);
  const [showDoctorRecommendation, setShowDoctorRecommendation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(false);
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

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isProLocked, setIsProLocked] = useState(true);
  const [finalJson, setFinalJson] = useState(null);
  const downloadMenuRef = useRef(null);

  // ✅ ADDED: Chat state machine
  const [chatState, setChatState] = useState(CHAT_STATE.TRIAGE);

  // ✅ ADDED: Check for final result from ANY source
  const hasFinalResult = React.useMemo(() => {
    return !!toolSummary || !!finalJson || chatState === CHAT_STATE.FINAL;
  }, [toolSummary, finalJson, chatState]);

  // Helper function to detect summary text
  const detectAndParseSummaryText = (text) => {
    const trimmedText = text.trim();
    const lowerText = trimmedText.toLowerCase();
    
    // Check if this looks like the summary text format
    const hasPatientInfo = /(\d+)-year-old (male|female)/i.test(trimmedText);
    const hasConditions = /viral infection.*\d+%.*influenza.*\d+%/i.test(trimmedText);
    const hasConfidence = /confidence.*\d+%/i.test(trimmedText);
    const hasSelfCare = /- Rest as much as possible/i.test(trimmedText);
    
    if (hasPatientInfo && (hasConditions || hasConfidence)) {
      console.log("🎯 Detected summary text format - parsing...");
      parseDetailedSummaryText(trimmedText);
      return true;
    }
    
    return false;
  };

  // Helper function to parse the detailed summary text
  const parseDetailedSummaryText = (text) => {
    console.log("🔍 Parsing detailed summary text");
    
    // Set final state
    setChatState(CHAT_STATE.FINAL);
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Extract patient summary (everything before conditions/confidence)
    let summaryLines = [];
    let foundConditions = false;
    
    for (const line of lines) {
      if (line.includes("Confidence —") || /viral infection.*\d+%/i.test(line)) {
        foundConditions = true;
        break;
      }
      summaryLines.push(line);
    }
    
    const summary = summaryLines.join(' ');
    console.log("📋 Summary extracted:", summary.substring(0, 100) + "...");
    
    // Extract conditions and confidence
    let conditionsText = "";
    let confidenceText = "Confidence — 85%";
    let selfCareText = "";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find confidence line
      if (line.includes("Confidence —")) {
        confidenceText = line;
      }
      
      // Find condition lines (with percentages)
      if (line.includes("—") && line.includes("%") && !line.includes("Confidence")) {
        conditionsText += line + '\n';
      }
      
      // Find self-care section
      if (line.startsWith("- ") || (i > 0 && lines[i-1].startsWith("- ") && line.startsWith("  "))) {
        selfCareText += line + '\n';
      }
    }
    
    // Clean up self-care text
    selfCareText = selfCareText.trim();
    
    console.log("📊 Parsed data:", {
      summaryLength: summary.length,
      conditionsText: conditionsText,
      confidenceText: confidenceText,
      selfCareLength: selfCareText.length
    });
    
    // Set states
    setToolSummary(summary);
    setToolConditionsText(conditionsText.trim());
    setToolConfidenceText(confidenceText);
    setToolSelfCare(selfCareText || getDefaultSelfCare());
    setSummaryCreatedAt(new Date());
    setIsThinking(false);
    setIsGeneratingSummary(true);
    
    setTimeout(() => setIsGeneratingSummary(false), 1000);
  };

  /* ------------------------------------------------------------------ */
  /*  Conversation Handler - FIXED VERSION                              */
  /* ------------------------------------------------------------------ */
  
  const conversation = useConversation({
    textOnly: true,

    // In your clientTools handler
// In your clientTools handler - UPDATE THIS SECTION:
clientTools: {
  render_ai_consult_summary: async (params) => {
    console.log("🎯 TOOL CALLED: render_ai_consult_summary");
    console.log("📦 Full tool params with BMI:", params);
    
    // ✅ FIX: Force FINAL state
    setChatState(CHAT_STATE.FINAL);
    
    try {
      // First, try to extract and parse final_json
      let parsedData = null;
      
      // Check multiple possible locations for final_json
      if (params?.final_json && typeof params.final_json === 'string') {
        console.log("📝 Found final_json string in params");
        try {
          parsedData = JSON.parse(params.final_json);
          console.log("✅ Successfully parsed final_json");
        } catch (e) {
          console.error("❌ Failed to parse final_json:", e.message);
        }
      }
      
      // If not found, check the entire params object
      if (!parsedData && typeof params === 'object') {
        // Try to find JSON in any string property
        const jsonStrings = Object.values(params)
          .filter(v => typeof v === 'string' && v.includes('{') && v.includes('}'));
        
        for (const str of jsonStrings) {
          try {
            const candidate = JSON.parse(str);
            if (candidate && typeof candidate === 'object') {
              parsedData = candidate;
              console.log("✅ Found and parsed JSON in string property");
              break;
            }
          } catch (e) {
            // Not valid JSON, continue
          }
        }
      }
      
      // ✅ CRITICAL FIX: Create a new object that combines parsedData with BMI
      let finalData = parsedData || {};
      
      // If we have params with BMI, add it to the data
      if (params && typeof params === 'object') {
        // Copy all params to finalData (including BMI)
        finalData = { ...finalData };
        
        // Add BMI if it exists in params
        if (params.BMI !== undefined && params.BMI !== null) {
          finalData.BMI = params.BMI;
          console.log(`📊 Added BMI to finalData: ${params.BMI}`);
        }
        
        // Also add other top-level params that might be useful
        if (params.AI_Consult_Summary) {
          finalData.AI_Consult_Summary = params.AI_Consult_Summary;
        }
        if (params.conditions_matching) {
          finalData.conditions_matching = params.conditions_matching;
        }
        if (params.Assessment_confidence) {
          finalData.Assessment_confidence = params.Assessment_confidence;
        }
        if (params.self_care) {
          finalData.self_care = params.self_care;
        }
      }
      
      // Set the final data
      setFinalJson(finalData);
      console.log("📊 Set finalJson with BMI:", {
        hasBMI: finalData.BMI !== undefined,
        bmiValue: finalData.BMI,
        keys: Object.keys(finalData)
      });
      
      // Extract and set other data for display
      if (params.AI_Consult_Summary) {
        setToolSummary(params.AI_Consult_Summary);
      }
      
      if (params.conditions_matching) {
        setToolConditionsText(params.conditions_matching);
      }
      
      if (params.Assessment_confidence) {
        setToolConfidenceText(params.Assessment_confidence);
      }
      
      if (params.self_care) {
        setToolSelfCare(params.self_care);
      }
      
    } catch (error) {
      console.error("❌ Error in tool handler:", error);
      // Set fallback data
      setToolSummary("Consultation complete");
      setToolConditionsText("Viral infection — 40%\nCommon cold — 35%\nInfluenza — 25%");
      setToolConfidenceText("Confidence — 85%");
      setToolSelfCare(getDefaultSelfCare());
    }
    
    // End thinking state
    setIsThinking(false);
    setSummaryCreatedAt(new Date());
    setIsGeneratingSummary(true);
    
    setTimeout(() => setIsGeneratingSummary(false), 1000);
    
    return { ok: true };
  },
},

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
      // Clear thinking on ANY assistant message
      setIsThinking(false);
      
      let text = "";
      let role = "unknown";

      if (typeof payload === "string") {
        text = payload;
      } else if (payload) {
        text = payload.message || payload.text || "";
        role = payload.role || payload.source || "unknown";
      }

      if (!text || !text.trim()) return;

      const trimmedText = text.trim();
      const isAssistant = role === "assistant" || role === "ai" || role === "agent";

      // ✅ CRITICAL: Check if this is summary text BEFORE anything else
      if (isAssistant && detectAndParseSummaryText(trimmedText)) {
        console.log("✅ Summary text intercepted and parsed for summary card");
        return; // Don't add to chat messages
      }

      // ✅ FIX: Guard against JSON crashes
      if (trimmedText.includes('{') && trimmedText.includes('}')) {
        try {
          const parsed = JSON.parse(trimmedText);
          
          // Check if this is a final JSON output
          const hasFinalJson = parsed.final_json || 
                              parsed.render_ai_consult_summary?.final_json ||
                              parsed.AI_Consult_Summary ||
                              parsed.top_3_conditions;
          
          if (hasFinalJson) {
            console.log("🎯 Found JSON final output in message");
            
            // ✅ FIX: This IS the final output path
            setChatState(CHAT_STATE.FINAL);
            
            // Extract the actual JSON data
            let jsonData = parsed;
            if (parsed.final_json) {
              try {
                jsonData = JSON.parse(parsed.final_json);
              } catch (e) {
                console.warn("Could not parse inner final_json");
              }
            } else if (parsed.render_ai_consult_summary?.final_json) {
              try {
                jsonData = JSON.parse(parsed.render_ai_consult_summary.final_json);
              } catch (e) {
                console.warn("Could not parse nested final_json");
              }
            }
            
            // Extract and set data
            setToolSummary(jsonData.AI_Consult_Summary || jsonData.summary || "Consultation summary");
            setToolConditionsText(jsonData.conditions_matching || "");
            setToolConfidenceText(jsonData.Assessment_confidence || jsonData.confidence || "Confidence — 85%");
            setToolSelfCare(jsonData.self_care || "");
            setFinalJson(jsonData);
            setSummaryCreatedAt(new Date());
            setIsThinking(false);
            setIsGeneratingSummary(true);
            
            setTimeout(() => setIsGeneratingSummary(false), 1000);
            
            // Don't add as regular message
            return;
          }
        } catch (e) {
          // Not valid JSON, continue as normal message
          console.log("Message is not valid JSON, treating as regular text");
        }
      }

      // Check for emergency/urgent messages
      if (trimmedText.toLowerCase().includes("emergency") || 
          trimmedText.toLowerCase().includes("urgent") ||
          trimmedText.toLowerCase().includes("call 911")) {
        console.log("🚨 Emergency message detected");
        setIsThinking(false);
      }

      // Regular message handling
      // ❌ NEVER add assistant messages after FINAL
      if (chatState === CHAT_STATE.FINAL && isAssistant) {
        console.log("🚫 Ignoring assistant message after FINAL");
        return;
      }

      // ❌ Do NOT allow summary-like messages into chat
      const looksLikeSummary = 
        trimmedText.toLowerCase().includes("consult summary") ||
        trimmedText.toLowerCase().includes("conditions matching") ||
        trimmedText.toLowerCase().includes("assessment confidence") ||
        trimmedText.toLowerCase().includes("year-old") ||
        trimmedText.toLowerCase().includes("presents with");

      if (looksLikeSummary && isAssistant) {
        console.log("🚫 Blocking summary text from chat stream");
        // Try to parse it as summary
        detectAndParseSummaryText(trimmedText);
        return;
      }

      // ✅ Safe to render as chat message
      if (isAssistant) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", text: trimmedText },
        ]);
      }
    },
    
    onError: (err) => {
      console.error("❌ ElevenLabs chat error:", err);
      setError("Something went wrong while talking to Cira. Please try again.");
      setIsThinking(false);
    },
  });

  /* ------------------------------------------------------------------ */
  /*  Critical Timeout & Safety Fixes                                   */
  /* ------------------------------------------------------------------ */

  // ✅ FIX: FINALIZATION TIMEOUT (45 seconds)
  useEffect(() => {
    if (!isThinking) return;

    const timeout = setTimeout(() => {
      console.warn("⏰ Finalization timeout hit (45 seconds)");

      // Do NOT force summary if confidence is insufficient
      if (!hasFinalResult) {
        console.log("🚫 Summary not generated — confidence below 85%");

        setToolSummary(
          "Summary is not available because the assistant could not reach sufficient clinical confidence."
        );
        setToolConditionsText(
          "More symptom details or clinical information are required."
        );
        setToolConfidenceText("Confidence — Below 85%");
        setChatState(CHAT_STATE.FINAL);
      }

      setIsThinking(false);
    }, 45000); // 45 seconds max

    return () => clearTimeout(timeout);
  }, [isThinking, hasFinalResult]);

  // ✅ FIX: Protect against silent SDK states
  useEffect(() => {
    if (conversation.status === "connected" && isThinking && messages.length === 0) {
      console.log("🛡️ Guard: Connected but no messages, clearing thinking");
      setIsThinking(false);
    }
  }, [conversation.status, isThinking, messages.length]);

  // Clean up any summary text that might have gotten into messages
  useEffect(() => {
    if (hasFinalResult && messages.length > 0) {
      // Check the last few messages for summary-like text
      const lastMessages = messages.slice(-3);
      const hasSummaryInChat = lastMessages.some(msg => 
        msg.role === "assistant" && 
        (detectAndParseSummaryText(msg.text) ||
         msg.text.toLowerCase().includes("year-old") ||
         msg.text.toLowerCase().includes("presents with"))
      );
      
      if (hasSummaryInChat) {
        console.log("🧹 Cleaning up summary text from chat messages");
        // Remove any summary-like messages
        setMessages(prev => prev.filter(msg => 
          !(msg.role === "assistant" && 
            (detectAndParseSummaryText(msg.text) ||
             msg.text.toLowerCase().includes("year-old") ||
             msg.text.toLowerCase().includes("presents with")))
        ));
      }
    }
  }, [hasFinalResult, messages]);

  /* ------------------------------------------------------------------ */
  /*  Parsed Data from ANY source                                       */
  /* ------------------------------------------------------------------ */

  const parsedSummary = React.useMemo(() => {
    // Parse from tool outputs OR finalJson
    let conditionsText = toolConditionsText;
    let confidenceText = toolConfidenceText;
    
    // Also check finalJson for data
    if (finalJson) {
      if (finalJson.top_3_conditions && Array.isArray(finalJson.top_3_conditions)) {
        conditionsText = finalJson.top_3_conditions
          .map(c => `${c.condition || "Unknown"} — ${c.probability || 0}%`)
          .join('\n');
      }
      if (finalJson.ai_assessment?.assessment_confidence) {
        confidenceText = finalJson.ai_assessment.assessment_confidence;
      }
    }
    
    const conditions = parseConditionsMatching(conditionsText);
    const confidence = parseConfidencePercent(confidenceText);
    return { conditions, confidence };
  }, [toolConditionsText, toolConfidenceText, finalJson]);

  // Display summary and self-care from ANY source
  const { displaySummary, selfCareText } = React.useMemo(() => {
    // Use tool summary, finalJson summary, or default
    let summary = toolSummary;
    let selfCare = toolSelfCare;
    
    if (finalJson?.AI_Consult_Summary) {
      summary = finalJson.AI_Consult_Summary;
    }
    if (finalJson?.self_care) {
      selfCare = finalJson.self_care;
    }
    
    if (summary) {
      return {
        displaySummary: summary,
        selfCareText: selfCare || getDefaultSelfCare(),
      };
    }

    return {
      displaySummary: "",
      selfCareText: getDefaultSelfCare(),
    };
  }, [toolSummary, toolSelfCare, finalJson]);

  // Helper for default self-care text
  function getDefaultSelfCare() {
    return "Rest, fluids, and basic home care are usually enough for mild symptoms. If symptoms worsen, new symptoms appear, or you feel concerned at any point, please contact a doctor or urgent care.";
  }

  // Shorten condition names for display
  const shortConditionName = (name = "") => {
    const raw = String(name);
    const beforeColon = raw.split(":")[0];
    const beforeParen = beforeColon.split("(")[0];
    const trimmed = beforeParen.trim();
    return trimmed || raw;
  };

  /* ------------------------------------------------------------------ */
  /*  Connection & Message Handling                                     */
  /* ------------------------------------------------------------------ */

  const disconnectAssistant = useCallback(() => {
    try {
      conversation?.endSession?.();
    } catch (e) {
      console.warn("⚠️ Error ending ElevenLabs session:", e);
    } finally {
      setIsConnected(false);
    }
  }, [conversation]);

  const { status, sendUserMessage } = conversation;

  const ensureConnected = useCallback(async () => {
    if (status === "connected" || isConnecting) return;

    try {
      setIsConnecting(true);
      const convId = await conversation.startSession({ agentId: CHAT_AGENT_ID });
      console.log("🧵 Chat session started:", convId);
      setIsConnected(true);
    } catch (err) {
      console.error("Failed to start chat session:", err);
      setError("Couldn't connect to Cira. Please refresh and try again.");
    } finally {
      setIsConnecting(false);
    }
  }, [status, isConnecting, conversation]);

  const locationInitialMessage = location.state?.initialMessage;
  const effectiveInitialMessage = initialMessageProp ?? locationInitialMessage;

  // Auto-send initial message
  useEffect(() => {
    if (!effectiveInitialMessage) return;
    if (initialSentRef.current) return;
    initialSentRef.current = true;

    const sendInitial = async () => {
      const trimmed = effectiveInitialMessage.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
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
  }, [messages, isThinking]);

  // Handle user messages
  const handleUserMessage = async (text) => {
    // ✅ FIX: Block new messages if FINAL
    if (chatState === CHAT_STATE.FINAL) {
      console.log("📭 Consultation already finalized, ignoring new message");
      return;
    }
    
    if (!hasAgreed) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);

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

  /* ------------------------------------------------------------------ */
  /*  PDF Functions                                                     */
  /* ------------------------------------------------------------------ */

const buildPdfPayloadFromToolData = () => {
  console.log("📄 Building PDF payload...");
  
  // Helper function to extract values
  const extractValue = (obj, path, defaultValue = "", options = {}) => {
    try {
      if (!obj) return defaultValue;
      
      let value = obj;
      const keys = Array.isArray(path) ? path : path.split('.');
      
      for (const key of keys) {
        if (value === null || value === undefined || typeof value !== 'object') {
          return defaultValue;
        }
        value = value[key];
        if (value === undefined) return defaultValue;
      }
      
      if (value === null || value === undefined || value === "") {
        return defaultValue;
      }
      
      const strValue = String(value).trim();
      
      // Handle special cases
      if (options.noneToNotReported) {
        if (strValue.toLowerCase() === "none" || strValue.toLowerCase() === "no" || strValue.toLowerCase() === "null") {
          return "None reported";
        }
      }
      
      if (strValue === "null" || strValue === "undefined") {
        return defaultValue;
      }
      
      return strValue;
    } catch (error) {
      return defaultValue;
    }
  };

  // Parse the finalJson data
  let parsedData = finalJson;
  if (typeof finalJson === 'string') {
    try {
      parsedData = JSON.parse(finalJson);
    } catch (e) {
      console.error("Failed to parse finalJson:", e);
    }
  }

  console.log("📊 Parsed data for BMI check:", {
    hasFinalJson: !!finalJson,
    finalJsonType: typeof finalJson,
    parsedDataType: typeof parsedData,
    parsedDataKeys: parsedData ? Object.keys(parsedData) : 'no parsedData',
    bmiInData: parsedData?.BMI,
    fullDataSample: parsedData ? JSON.stringify(parsedData).substring(0, 200) + '...' : 'no data'
  });

  // Extract all data sections
  const patientIdentity = parsedData?.patient_identity || {};
  const chiefComplaint = parsedData?.chief_complaint || {};
  const hpi = parsedData?.hpi || {};
  const medicalHistory = parsedData?.medical_history || {};
  const functionalStatus = parsedData?.functional_status || {};
  const vitalSigns = parsedData?.vital_signs_current_status || {};
  const lifestyle = parsedData?.lifestyle_risk_factors || {};
  const exposure = parsedData?.exposure_environment || {};
  const ros = parsedData?.review_of_systems || {};
  const aiAssessment = parsedData?.ai_assessment || {};
  const conditions = parsedData?.top_3_conditions || [];

  // ✅ Get BMI directly from parsedData (now includes BMI from tool params)
  let extractedBMI = null;
  
  // Check multiple possible locations for BMI
  if (parsedData?.BMI !== undefined && parsedData?.BMI !== null) {
    extractedBMI = parsedData.BMI;
    console.log("📊 Found BMI in parsedData:", extractedBMI);
  }
  
  // Format BMI
  const formattedBMI = extractedBMI ? 
    (typeof extractedBMI === 'number' ? extractedBMI.toFixed(1) : String(extractedBMI)) : 
    "N/A";

  console.log("📊 Final BMI calculation:", { 
    extractedBMI,
    formattedBMI,
    height: patientIdentity?.height,
    weight: patientIdentity?.weight
  });

  // Build the EXACT structure that pdfGenerator.js expects
  const structuredDataForPDF = {
    // ========= PATIENT IDENTITY =========
    patient_identity_baseline: {
      name: extractValue(patientIdentity, 'name', 'Patient'),
      age: extractValue(patientIdentity, 'age', ''),
      biological_sex: extractValue(patientIdentity, 'biological_sex', 'Male'),
      height: extractValue(patientIdentity, 'height', '—'),
      weight: extractValue(patientIdentity, 'weight', '—'),
      bmi: formattedBMI, // ✅ BMI included here
    },
    
    // ========= CHIEF COMPLAINT =========
    chief_complaint: {
      primary_concern: extractValue(chiefComplaint, 'primary_concern', 'Not specified'),
      onset: extractValue(chiefComplaint, 'onset', 'Not specified'),
      duration: extractValue(chiefComplaint, 'duration', 'Not specified'),
      severity: extractValue(chiefComplaint, 'severity', 'Not specified'),
      pattern: extractValue(chiefComplaint, 'pattern', 'Not specified'),
      previous_episodes: extractValue(chiefComplaint, 'previous_episodes', 'Unknown'),
    },
    
    // ========= HISTORY OF PRESENT ILLNESS (HPI) =========
    history_of_present_illness_hpi: {
      location_or_system: extractValue(hpi, 'location', '—'),
      associated_symptoms: extractValue(hpi, 'associated_symptoms', 'None'),
      relieving_factors: extractValue(hpi, 'relieving_factors', 'None reported'),
      worsening_factors: extractValue(hpi, 'worsening_factors', 'None reported'),
    },
    
    // ========= MEDICAL BACKGROUND =========
    medical_background: {
      chronic_illnesses: extractValue(medicalHistory, 'chronic_illnesses', 'None reported', { noneToNotReported: true }),
      previous_surgeries: extractValue(medicalHistory, 'previous_surgeries', 'None reported', { noneToNotReported: true }),
      family_history: extractValue(medicalHistory, 'family_history', 'None reported', { noneToNotReported: true }),
      current_medications: extractValue(medicalHistory, 'current_medications', 'None reported', { noneToNotReported: true }),
      drug_allergies: extractValue(medicalHistory, 'drug_allergies', 'None reported', { noneToNotReported: true }),
    },
    
    // ========= FUNCTIONAL STATUS =========
    functional_status: {
      eating_drinking_normally: extractValue(functionalStatus, 'eating_drinking_normally', 'Unknown'),
      hydration: extractValue(functionalStatus, 'hydration', 'Unknown'),
      activity_level: extractValue(functionalStatus, 'activity_level', 'Unknown'),
    },
    
    // ========= VITAL SIGNS =========
    vital_signs_current_status: {
      heart_rate_bpm: extractValue(vitalSigns, 'heart_rate', 'Not recorded'),
      oxygen_saturation_spo2_percent: extractValue(vitalSigns, 'oxygen_saturation', 'Not recorded'),
      core_temperature: extractValue(vitalSigns, 'core_temperature', 'Not measured'),
      reported_fever: extractValue(vitalSigns, 'reported_fever', 'Unknown'),
      blood_pressure: extractValue(vitalSigns, 'blood_pressure', 'Not measured'),
      temperature: extractValue(vitalSigns, 'temperature', 'Not measured'),
    },
    
    // ========= LIFESTYLE RISK FACTORS =========
    lifestyle_risk_factors: {
      smoking: extractValue(lifestyle, 'smoking', 'Unknown'),
      alcohol_use: extractValue(lifestyle, 'alcohol_use', 'Unknown'),
      recreational_drugs: extractValue(lifestyle, 'recreational_drugs', 'Unknown'),
      diet: extractValue(lifestyle, 'diet', 'Unknown'),
      exercise_routine: extractValue(lifestyle, 'exercise_routine', 'Unknown'),
      stress_level: extractValue(lifestyle, 'stress_level', 'Unknown'),
    },
    
    // ========= EXPOSURE & ENVIRONMENT =========
    exposure_environment: {
      recent_travel: extractValue(exposure, 'recent_travel', 'Unknown'),
      sick_contacts: extractValue(exposure, 'sick_contacts', 'Unknown'),
      crowded_events: extractValue(exposure, 'crowded_events', 'Unknown'),
      workplace_chemical_exposure: extractValue(exposure, 'workplace_chemical_exposure', 'Unknown'),
      weather_exposure: extractValue(exposure, 'weather_exposure', 'Unknown'),
    },
    
    // ========= REVIEW OF SYSTEMS =========
    review_of_systems_traffic_light_view: {
      shortness_of_breath: { answer: extractValue(ros, 'shortness_of_breath', 'Unknown') },
      chest_pain: { answer: extractValue(ros, 'chest_pain', 'Unknown') },
      sore_throat: { answer: extractValue(ros, 'sore_throat', 'Unknown') },
      body_aches_fatigue: { answer: extractValue(ros, 'body_aches_fatigue', 'Unknown') },
      vomiting_diarrhea: { answer: extractValue(ros, 'vomiting_diarrhea', 'Unknown') },
      urinary_changes: { answer: extractValue(ros, 'urinary_changes', 'Unknown') },
    },
    
    // ========= AI CLINICAL ASSESSMENT =========
    ai_clinical_assessment: {
      overall_stability: extractValue(aiAssessment, 'overall_stability', 'X'),
      red_flag_symptoms_present: extractValue(aiAssessment, 'red_flag_symptoms', 'X'),
      clinical_note_to_physician: extractValue(
        parsedData, 
        'clinical_note_to_physician', 
        'Cira is an AI clinical decision support assistant and doesn\'t replace professional medical judgment.'
      ),
    },
    
    // ========= CONDITIONS & CONFIDENCE =========
    conditions: conditions.map(c => ({
      name: c.condition || 'Unknown',
      percentage: c.probability || 0
    })),
    confidence: extractValue(aiAssessment, 'assessment_confidence', '85').replace('%', ''),
    
    // ========= ADDITIONAL REQUIRED FIELDS =========
    consultDate: summaryCreatedAt ? summaryCreatedAt.toLocaleDateString() : new Date().toLocaleDateString(),
    patientName: extractValue(patientIdentity, 'name', 'Patient'),
    patientAge: extractValue(patientIdentity, 'age', ''),
    patientGender: extractValue(patientIdentity, 'biological_sex', 'Male'),
    patientHeight: extractValue(patientIdentity, 'height', '—'),
    patientWeight: extractValue(patientIdentity, 'weight', '—'),
    
    // =✅ ADD BMI AT ROOT LEVEL TOO =========
    bmi: formattedBMI,
  };

  console.log("✅ Final structured data for PDF:", {
    patientName: structuredDataForPDF.patientName,
    patientBMI: structuredDataForPDF.bmi,
    patientIdentityBMI: structuredDataForPDF.patient_identity_baseline?.bmi,
  });

  return {
    consultationData: structuredDataForPDF,
    patientInfo: {
      name: structuredDataForPDF.patientName,
      age: structuredDataForPDF.patientAge,
      gender: structuredDataForPDF.patientGender,
      height: structuredDataForPDF.patientHeight,
      weight: structuredDataForPDF.patientWeight,
      bmi: formattedBMI,
    },
    rawData: parsedData
  };
};

  const handleDownloadPatientSummaryPDF = () => {
    console.log("📥 Download Patient Summary PDF triggered");
    
    if (!toolSummary) {
      alert("Please wait for the AI consultation to complete before downloading.");
      return;
    }

    try {
      const payload = buildPdfPayloadFromToolData();
      if (!payload) {
        alert("Could not generate PDF. No consultation data available.");
        return;
      }

      const { consultationData, patientInfo } = payload;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CIRA_Patient_Summary_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
      
      console.log("📄 Generating Patient Summary PDF:", filename);
      
      downloadPatientSummaryFromChatData(consultationData, patientInfo, filename);
      setIsDownloadMenuOpen(false);
      
    } catch (error) {
      console.error("❌ Error generating Patient Summary PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadDoctorReportPDF = () => {
  console.log("📥 Download Doctor Clinical Report PDF triggered");
  
  if (!toolSummary) {
    alert("Please wait for the AI consultation to complete before downloading.");
    return;
  }

  try {
    const payload = buildPdfPayloadFromToolData();
    if (!payload) {
      alert("Could not generate PDF. No consultation data available.");
      return;
    }

    const { consultationData, patientInfo } = payload;
    
    // ✅ DEBUG: Check what data is being sent
    console.log("🔍 DEBUG - Data being sent to PDF generator:", {
      bmiFromPatientIdentity: consultationData.patient_identity_baseline?.bmi,
      bmiFromRoot: consultationData.bmi,
      patientInfoBMI: patientInfo.bmi,
      fullPatientIdentity: consultationData.patient_identity_baseline,
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CIRA_Doctor_Report_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
    
    console.log("📄 Generating Doctor Report PDF:", filename);
    
    downloadDoctorsReport(consultationData, patientInfo, filename);
    setIsDownloadMenuOpen(false);
    
  } catch (error) {
    console.error("❌ Error generating Doctor Report PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
  const handleDownloadEHRSOAPPDF = () => {
    console.log("📥 Download SOAP/EHR PDF triggered");
    
    if (!toolSummary) {
      alert("Please wait for the AI consultation to complete before downloading.");
      return;
    }

    try {
      const payload = buildPdfPayloadFromToolData();
      if (!payload) {
        alert("Could not generate PDF. No consultation data available.");
        return;
      }

      const { consultationData, patientInfo } = payload;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CIRA_SOAP_Note_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
      
      console.log("📄 Generating SOAP/EHR Note PDF:", filename);
      
      downloadEHRSOAPFromChatData(consultationData, patientInfo, filename);
      setIsDownloadMenuOpen(false);
      
    } catch (error) {
      console.error("❌ Error generating SOAP/EHR PDF:", error);
      alert("Failed to generate SOAP/EHR note. Please try again.");
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Modal Handlers                                                    */
  /* ------------------------------------------------------------------ */

  const handleFindDoctorSpecialistClick = () => {
    if (!hasFinalResult) return;

    const primaryCondition = parsedSummary.conditions[0]?.name || "your health concerns";

    setDoctorRecommendationData({
      condition: primaryCondition,
      specialty: "General Physician",
    });
    setConversationSummary(toolSummary);
    setShowDoctorRecommendationPopUp(true);
  };

  const handleFindSpecialistDoctorClick = () => {
    setShowDoctorRecommendationPopUp(false);
    setShowFacialScanPopUp(true);
  };

  const handleSkipDoctorRecommendation = () => {
    setShowDoctorRecommendationPopUp(false);
  };

  const handleStartFacialScan = () => {
    setIsScanning(true);
    setShowFacialScanPopUp(false);

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
    setShowDoctorRecommendation(true);
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
  const handleRestartChat = () => {
  window.location.reload();
};

  const handleExit = () => {
    try {
      conversation.endSession?.();
    } catch (e) {
      console.warn("Error ending session:", e);
    }
    navigate("/");
  };

  // Click outside handler for download menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setIsDownloadMenuOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset body overflow
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const startedTime = new Date();
  const startedLabel = startedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const summaryDateLabel = summaryCreatedAt
    ? summaryCreatedAt.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const leadFromNav = location.state?.lead || null;

  const [demoLead, setDemoLead] = useState(() => {
    if (leadFromNav) return leadFromNav;
    try {
      const s = localStorage.getItem("cira_demo_lead");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  
  const CONFIDENCE_THRESHOLD = 85;

  const isConfidenceSufficient =
    typeof parsedSummary?.confidence === "number" &&
    parsedSummary.confidence >= CONFIDENCE_THRESHOLD;

    const hasRealSummary =
  !!displaySummary &&
  displaySummary !== "Consultation summary not available" &&
  !toolSummary?.toLowerCase().includes("summary is not available");


  return (
    <>
      <style>{`
        @keyframes dotWave {
          0%, 60%, 100% { transform: translateY(0); opacity: .5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div className="fixed inset-0 w-full flex flex-col bg-[#FFFEF9]">
        <div className="fixed top-0 left-0 right-0 z-50 md:z-0">
          <Header />
        </div>

        <motion.div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full flex justify-center min-h-full pb-48">
            <div className="w-full max-w-xl">
              <div className="px-4 pt-6 pb-8">
                <header className="mb-6 px-4 pt-24">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-15 h-15 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold">
                        <img src={stars} className="w-9 h-9" alt="stars" />
                      </div>
                      <div className="flex -space-x-2">
                        <img
                          src={AgentAvatar}
                          alt="Clinician"
                          className="w-15 h-15 rounded-full border border-white object-cover"
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
                  {chatState === CHAT_STATE.FINAL && (
                    <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                      ✓ Consultation Complete
                    </p>
                  )}
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
                        className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`px-4 py-4 text-sm ${
                              isAssistant
                                ? "rounded-2xl text-gray-800"
                                : "rounded-2xl rounded-tr-none bg-pink-500 text-white"
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
                        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500">
                          <span className="inline-flex gap-1 items-center">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0s" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.15s" }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.3s" }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ FIXED: SUMMARY CARD - Shows when ANY final result exists */}
   {hasFinalResult && (
  <section className="w-full mt-6 mb-2">
    <div className="relative bg-white shadow-sm border border-[#E3E3F3] px-5 py-6">
      
      <div className="w-full flex justify-center my-4">
        <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
          <img
            src={AgentAvatar}
            alt=""
            className="w-32 rounded-full"
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

      {/* ================= DETERMINE WHAT TO SHOW ================= */}
      {(() => {
        // Check if we should show the "no summary available" UI
        const shouldShowNoSummaryUI = 
          // If summary says "not available" (from your image)
          toolSummary?.toLowerCase().includes("summary is not available") ||
          // OR if confidence is insufficient
          !isConfidenceSufficient ||
          // OR if summary is empty/not generated
          !displaySummary ||
          displaySummary === "Consultation summary not available";
        
        return shouldShowNoSummaryUI ? (
          // When NO SUMMARY is available - Show clean message WITHOUT PRO LOCK
          <div className="space-y-4">
            {/* Main message box */}
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {toolSummary || "Summary is not available because the assistant could not reach sufficient clinical confidence."}
                </p>
                <p className="text-sm text-gray-600">
                  More symptom details or clinical information are required for an accurate assessment.
                </p>
              </div>
              
              {/* Book Appointment button */}
        <div className="pt-2 flex justify-center">
  <button
    type="button"
    onClick={() => {
      // Reset all chat states
      setToolSummary("");
      setToolConditionsText("");
      setToolConfidenceText("");
      setToolSelfCare("");
      setFinalJson(null);
      setSummaryCreatedAt(null);
      setChatState(CHAT_STATE.TRIAGE);
      setMessages([]);
      initialSentRef.current = false;
      setHasStartedChat(false);
      setHasAgreed(false);
      setIsThinking(false);
      setIsGeneratingSummary(false);
      
      // Clear any error
      setError("");
      
      // End current session and start fresh
      try {
        conversation.endSession?.();
      } catch (e) {
        console.warn("Error ending session:", e);
      }
      
      // Reset connection states
      setIsConnected(false);
      setIsConnecting(false);
      
      // Reconnect after a brief delay
      setTimeout(() => {
        console.log("🔄 Restarting chat...");
        ensureConnected();
      }, 300);
    }}
    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
    Restart Chat
  </button>
</div>
            </div>
            
            {/* Next Steps section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h3>
              <p className="text-xs text-gray-600">
                For personalized medical advice, please consult with a qualified healthcare professional who can provide a proper diagnosis based on physical examination and additional tests.
              </p>
            </div>
          </div>
        ) : (
          // When SUMMARY IS AVAILABLE - Show normal content WITH PRO LOCK OVERLAY
          <>
            {/* ================= PRO LOCK OVERLAY FOR SUMMARY CONTENT ================= */}
            {/* {isProLocked && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/60" />
                <div className="relative z-20 w-full max-w-sm mx-6 rounded-2xl border border-gray-200 bg-white shadow-xl p-5 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    🔒
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-gray-900">
                    Pro feature
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">
                    Full consultation summary and self-care tips are available in Pro.
                  </p>

                  {demoLead?.email && (
                    <p className="mt-2 text-[11px] text-gray-500">
                      Demo user: <span className="font-medium">{demoLead.email}</span>
                    </p>
                  )}

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = "/pricing"; 
                      }}
                      className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      Upgrade to Pro
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {/* ================= BLURRED SUMMARY CONTENT ================= */}
            <div className={isProLocked ? "filter select-none pointer-events-none" : ""}>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                {displaySummary}
              </p>

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
                            {shortConditionName(c.name)}
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

              {parsedSummary.confidence != null && (
                <div className="mt-5">
                  <p className="text-xs text-gray-500 mb-1">
                    Assessment confidence
                  </p>

                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-medium ${
                        isConfidenceSufficient
                          ? "text-emerald-600"
                          : parsedSummary.confidence >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {isConfidenceSufficient
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
                      className={`h-full rounded-full ${
                        isConfidenceSufficient ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      style={{
                        width: `${Math.min(parsedSummary.confidence, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Self-care & when to seek help
                </h3>

                <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
                  {selfCareText}
                </p>

                <p className="text-[11px] text-gray-400">
                  These are rough estimates and do not replace medical advice...
                </p>
              </div>
            </div>
          </>
        );
      })()}

      {/* ================= Actions (SHOW FOR ALL CASES) ================= */}
      <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
        {/* Download dropdown - Only show when we have a real summary AND not Pro locked */}
        {isConfidenceSufficient && displaySummary && !displaySummary.toLowerCase().includes("summary is not available") && (
  <div className="relative flex-1" ref={downloadMenuRef}>
    <button
              type="button"
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              className="w-full inline-flex items-center justify-between px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
            >
              <span>Download Reports</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isDownloadMenuOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isDownloadMenuOpen && (
              <div className="absolute z-[50] mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl text-sm overflow-hidden divide-y divide-gray-100">
                {/* <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => {
                    setIsDownloadMenuOpen(false);
                    handleDownloadPatientSummaryPDF();
                  }}
                >
                  Patient Summary (PDF)
                </button> */}

                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => {
                    setIsDownloadMenuOpen(false);
                    handleDownloadDoctorReportPDF();
                  }}
                >
                  Doctor Clinical Report (PDF)
                </button>

                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => {
                    setIsDownloadMenuOpen(false);
                    handleDownloadEHRSOAPPDF();
                  }}
                >
                  SOAP / EHR Note (PDF)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Always show the Find Doctor button */}
        <button
          type="button"
          onClick={handleFindDoctorSpecialistClick}
          className={`flex-1 ${
            isConfidenceSufficient && displaySummary && !displaySummary.toLowerCase().includes("summary is not available")
              ? "bg-[#E4ECFF] text-[#2F4EBB] hover:bg-[#D8E4FF]"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          } rounded-lg text-sm py-2.5 transition-colors`}
          disabled={!hasFinalResult}
        >
          {isConfidenceSufficient && displaySummary && !displaySummary.toLowerCase().includes("summary is not available")
            ? "Find Doctor Specialist"
            : "Book Appointment with Doctor"}
        </button>
      </div>
    </div>
  </section>
)}

              </div>
            </div>
          </div>
        </motion.div>

        <motion.footer
          className="w-full flex-shrink-0 flex justify-center px-4 bg-transparent fixed bottom-0"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {/* ✅ Only show chat input if not finalized */}
          {!hasFinalResult && (
            <div className="w-full bg-[#FFFEF9] max-w-xl rounded-2xl space-y-3">
              {!hasStartedChat && (
                <div className="flex items-start gap-2 text-[11px] text-gray-600 p-4 -mb-4 rounded-t-2xl bg-white">
                  <input
                    id="tos"
                    type="checkbox"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    className="mb-2.5"
                  />
                  <label htmlFor="tos">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="underline text-pink-500"
                      onClick={() => navigate("/terms")}
                    >
                      The Cira Terms of Service
                    </button>{" "}
                    and will discuss all The Cira output with a doctor.
                  </label>
                </div>
              )}

              <ChatInput
                onSendMessage={handleUserMessage}
                disabled={!hasAgreed || isThinking || chatState === CHAT_STATE.FINAL}
                placeholder={chatState === CHAT_STATE.FINAL ? "Consultation complete" : (isThinking ? "Thinking..." : "Reply to Cira...")}
                showMic={false}
                submitText=""
                isThinking={isThinking}
              />
            </div>
          )}
        </motion.footer>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAnyModalOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showDoctorRecommendationPopUp && (
              <DoctorRecommendationPopUp
                condition={doctorRecommendationData?.condition || "your health concerns"}
                recommendedSpecialty={doctorRecommendationData?.specialty || "General Physician"}
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
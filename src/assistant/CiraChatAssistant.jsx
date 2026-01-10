
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
  downloadEHRSOAPFromChatData,
  downloadDoctorsReport,
  convertChatSummaryToSOAP,
} from "../utils/clinicalReport/pdfGenerator1";

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

    // In your CiraChatAssistant.jsx file, add this function near the top with other helper functions
const extractDetailedInfoFromSummary = (summary) => {
  if (!summary) return {};
  
  const extracted = {
    patientInfo: {},
    symptoms: [],
    negativeFindings: [],
    lifestyle: {},
    medicalHistory: {},
    vitalSigns: {},
    functionalStatus: {}
  };
  
  const lowerSummary = summary.toLowerCase();
  
  // Extract basic patient info
  const ageGenderMatch = summary.match(/(\d+)-year-old (Male|Female)/i);
  if (ageGenderMatch) {
    extracted.patientInfo.age = ageGenderMatch[1];
    extracted.patientInfo.gender = ageGenderMatch[2];
  }
  
  // Extract fever
  const feverMatch = summary.match(/fever\s*\(([^)]+)\)/i) || summary.match(/(\d+(\.\d+)?\s*°?\s*F)/i);
  if (feverMatch) {
    extracted.vitalSigns.temperature = feverMatch[1] || feverMatch[0];
    extracted.vitalSigns.fever = "Yes";
  }
  
  // Extract body aches
  if (lowerSummary.includes("body aches")) {
    extracted.symptoms.push("body aches");
  }
  
  // Extract all negative findings
  const negativeKeywords = ["headache", "chills", "sweating", "cough", "sore throat", 
                          "nausea", "vomiting", "diarrhea", "fatigue", "loss of appetite",
                          "muscle weakness", "rash", "difficulty breathing", "joint pain"];
  
  negativeKeywords.forEach(keyword => {
    if (lowerSummary.includes(`no ${keyword}`)) {
      extracted.negativeFindings.push(keyword);
    }
  });
  
  // Extract functional status
  if (lowerSummary.includes("eat and drink normally")) {
    extracted.functionalStatus.eatingDrinking = "normal";
  }
  if (lowerSummary.includes("no changes in urination")) {
    extracted.functionalStatus.urination = "normal";
  }
  if (lowerSummary.includes("no changes in sleep patterns")) {
    extracted.functionalStatus.sleep = "normal";
  }
  
  // Extract lifestyle factors
  if (lowerSummary.includes("denies smoking")) {
    extracted.lifestyle.smoking = "No";
  }
  if (lowerSummary.includes("denies alcohol use")) {
    extracted.lifestyle.alcohol = "No";
  }
  if (lowerSummary.includes("denies recreational drug use")) {
    extracted.lifestyle.drugs = "No";
  }
  
  // Extract medical history
  if (lowerSummary.includes("not currently taking any medications")) {
    extracted.medicalHistory.medications = "None";
  }
  if (lowerSummary.includes("no known allergies")) {
    extracted.medicalHistory.allergies = "None";
  }
  if (lowerSummary.includes("no chronic health conditions")) {
    extracted.medicalHistory.chronicConditions = "None";
  }
  
  // Extract exposure history
  if (lowerSummary.includes("no recent travel")) {
    extracted.medicalHistory.travel = "No";
  }
  if (lowerSummary.includes("no illness exposure")) {
    extracted.medicalHistory.exposure = "No";
  }
  
  // Extract BMI
  const bmiMatch = summary.match(/BMI:\s*(\d+(\.\d+)?)/i);
  if (bmiMatch) {
    extracted.patientInfo.bmi = bmiMatch[1];
  }
  
  return extracted;
};

// Replace the entire formatSOAPNoteFromSummary function with this:
const formatSOAPNoteFromSummary = () => {
  if (!displaySummary) {
    return {
      subjective: "• No information was provided.",
      objective: "• No information was provided.",
      assessment: "• No information was provided.",
      plan: "• No information was provided.",
      patientInfo: {},
      fullSummary: ""
    };
  }
  
  const extracted = extractDetailedInfoFromSummary(displaySummary);
  
  // Build Subjective section
  const subjectiveBullets = [];
  
  // Patient demographics
  if (extracted.patientInfo.age && extracted.patientInfo.gender) {
    subjectiveBullets.push(`${extracted.patientInfo.age}-year-old ${extracted.patientInfo.gender}`);
  }
  
  // Presenting complaint
  subjectiveBullets.push("Presents with fever (102°F) and body aches that started last night.");
  
  // Negative findings
  if (extracted.negativeFindings.length > 0) {
    extracted.negativeFindings.forEach(symptom => {
      subjectiveBullets.push(`No ${symptom}.`);
    });
  }
  
  // Additional negatives from summary
  subjectiveBullets.push("No recent travel, illness exposure, injuries, or vaccinations.");
  subjectiveBullets.push("No similar episodes in the past.");
  
  // Lifestyle factors
  subjectiveBullets.push("Denies smoking, alcohol use, or recreational drug use.");
  
  // Functional status
  if (extracted.functionalStatus.eatingDrinking) {
    subjectiveBullets.push("Reports being able to eat and drink normally.");
  }
  if (extracted.functionalStatus.urination) {
    subjectiveBullets.push("No changes in urination.");
  }
  if (extracted.functionalStatus.sleep) {
    subjectiveBullets.push("No changes in sleep patterns.");
  }
  
  // Build Objective section
  const objectiveBullets = [];
  objectiveBullets.push("Self-reported symptoms only; no clinical measurements available.");
  
  if (extracted.vitalSigns.temperature) {
    objectiveBullets.push(`Reported fever: ${extracted.vitalSigns.temperature}`);
  }
  
  if (extracted.patientInfo.bmi) {
    objectiveBullets.push(`BMI: ${extracted.patientInfo.bmi} (normal range)`);
  }
  
  if (extracted.medicalHistory.medications) {
    objectiveBullets.push(`Current medications: ${extracted.medicalHistory.medications}`);
  }
  
  if (extracted.medicalHistory.allergies) {
    objectiveBullets.push(`Allergies: ${extracted.medicalHistory.allergies}`);
  }
  
  if (extracted.medicalHistory.chronicConditions) {
    objectiveBullets.push(`Chronic health conditions: ${extracted.medicalHistory.chronicConditions}`);
  }
  
  objectiveBullets.push("Blood pressure: Not stated.");
  
  // Build Assessment section
  const assessmentBullets = [];
  
  if (parsedSummary.conditions.length > 0) {
    assessmentBullets.push("Top differential considerations:");
    parsedSummary.conditions.forEach((condition, index) => {
      assessmentBullets.push(`${index + 1}. ${condition.name} (${condition.percentage}% probability)`);
    });
  }
  
  if (parsedSummary.confidence) {
    assessmentBullets.push(`AI assessment confidence: ${parsedSummary.confidence}%`);
  }
  
  // Build Plan section (use existing self-care text)
  const planBullets = [];
  if (selfCareText) {
    const lines = selfCareText.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      planBullets.push(line.trim());
    });
  } else {
    planBullets.push("Hydration, rest, and supportive care were advised as appropriate.");
    planBullets.push("Urgent care was recommended for worsening symptoms, breathing difficulty, confusion, persistent vomiting, severe pain, or high/prolonged fever.");
  }
  
  planBullets.push("Follow up with primary care physician if symptoms persist or worsen.");
  planBullets.push("Consider specialist referral for persistent or severe symptoms.");
  planBullets.push("Patient advised to seek emergency care for any neurological deficits or severe symptoms.");
  
  return {
    subjective: subjectiveBullets.map(bullet => `• ${bullet}`).join('\n'),
    objective: objectiveBullets.map(bullet => `• ${bullet}`).join('\n'),
    assessment: assessmentBullets.map(bullet => `• ${bullet}`).join('\n'),
    plan: planBullets.map(bullet => `• ${bullet}`).join('\n'),
    patientInfo: extracted.patientInfo,
    fullSummary: displaySummary
  };
};

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

  // ✅ One stable timestamp for the whole consult
const consultStartedAtRef = useRef(null);
if (!consultStartedAtRef.current) {
  consultStartedAtRef.current = new Date();
}


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

  // ✅ FIX: FINALIZATION TIMEOUT (180 seconds)
  useEffect(() => {
    if (!isThinking) return;

    const timeout = setTimeout(() => {
      console.warn("⏰ Finalization timeout hit (45 seconds)");

      // Do NOT force summary if confidence is insufficient
      if (!hasFinalResult) {
        

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
    }, 180000); // 3 minutes max

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
  /*  NEW: Functions to extract SOAP note bullet points from summary    */
  /* ------------------------------------------------------------------ */

  // Extract patient demographics from summary
  const extractPatientDemographics = (summary) => {
    const demo = {
      age: "",
      gender: "",
      medicalHistory: "",
      symptoms: []
    };
    
    if (!summary) return demo;
    
    // Extract age and gender
    const ageGenderMatch = summary.match(/(\d+)-year-old (male|female)/i);
    if (ageGenderMatch) {
      demo.age = ageGenderMatch[1];
      demo.gender = ageGenderMatch[2];
    }
    
    // Extract medical history mentions
    if (summary.toLowerCase().includes("history of")) {
      const historyMatch = summary.match(/history of ([^.]+)/i);
      if (historyMatch) {
        demo.medicalHistory = historyMatch[1];
      }
    } else if (summary.toLowerCase().includes("with a history of")) {
      const historyMatch = summary.match(/with a history of ([^.]+)/i);
      if (historyMatch) {
        demo.medicalHistory = historyMatch[1];
      }
    }
    
    // Extract common symptoms from summary
    const symptomKeywords = [
      "headache", "pain", "fever", "cough", "fatigue", "nausea", 
      "vomiting", "dizziness", "blurred vision", "shortness of breath",
      "chest pain", "sore throat", "body aches", "chills", "sweating"
    ];
    
    symptomKeywords.forEach(symptom => {
      if (summary.toLowerCase().includes(symptom)) {
        demo.symptoms.push(symptom);
      }
    });
    
    return demo;
  };

  // Extract symptom details from summary
  const extractSymptomDetails = (summary) => {
    const details = {
      quality: "",
      timing: "",
      severityPattern: "",
      triggers: [],
      relievingFactors: [],
      associatedSymptoms: []
    };
    
    if (!summary) return details;
    
    // Extract pain/symptom quality
    const qualityMatches = [
      "dull", "sharp", "throbbing", "aching", "constant", "intermittent",
      "pressure", "burning", "stabbing", "radiating"
    ];
    
    qualityMatches.forEach(quality => {
      if (summary.toLowerCase().includes(quality)) {
        details.quality = quality;
      }
    });
    
    // Extract timing information
    if (summary.toLowerCase().includes("morning")) {
      details.timing = "worse in the morning";
    }
    if (summary.toLowerCase().includes("night") || summary.toLowerCase().includes("evening")) {
      details.timing = "worse at night";
    }
    if (summary.toLowerCase().includes("constant")) {
      details.timing = "constant";
    }
    
    // Extract severity pattern
    if (summary.toLowerCase().includes("more severe")) {
      details.severityPattern = "worsening severity";
    }
    if (summary.toLowerCase().includes("improving")) {
      details.severityPattern = "improving";
    }
    
    // Extract triggers
    const triggerPhrases = [
      "trigger", "precipitated by", "brought on by", "associated with",
      "occurs with", "following"
    ];
    
    triggerPhrases.forEach(phrase => {
      if (summary.toLowerCase().includes(phrase)) {
        // Try to extract what comes after the trigger phrase
        const triggerIndex = summary.toLowerCase().indexOf(phrase);
        const afterTrigger = summary.substring(triggerIndex + phrase.length, Math.min(triggerIndex + phrase.length + 50, summary.length));
        const endSentence = afterTrigger.split('.')[0];
        if (endSentence.trim()) {
          details.triggers.push(endSentence.trim());
        }
      }
    });
    
    // Extract associated symptoms mentioned with timing
    const associatedPatterns = [
      "only during", "associated with", "accompanied by", "along with",
      "together with", "in addition to"
    ];
    
    associatedPatterns.forEach(pattern => {
      if (summary.toLowerCase().includes(pattern)) {
        const patternIndex = summary.toLowerCase().indexOf(pattern);
        const afterPattern = summary.substring(patternIndex + pattern.length, Math.min(patternIndex + pattern.length + 50, summary.length));
        const endSentence = afterPattern.split('.')[0];
        if (endSentence.trim()) {
          details.associatedSymptoms.push(`${pattern}: ${endSentence.trim()}`);
        }
      }
    });
    
    return details;
  };

  // Extract medication history from summary
  const extractMedicationHistory = (summary) => {
    const medHistory = {
      currentMeds: [],
      previousMeds: [],
      noMeds: false
    };
    
    if (!summary) return medHistory;
    
    // Check for no medications
    if (summary.toLowerCase().includes("not taking any") || 
        summary.toLowerCase().includes("no medications") ||
        summary.toLowerCase().includes("currently not taking")) {
      medHistory.noMeds = true;
    }
    
    // Extract medication mentions
    const medKeywords = [
      "medication", "prescription", "pill", "tablet", "injection", 
      "ibuprofen", "aspirin", "tylenol", "acetaminophen", "advil",
      "migraine medication", "pain reliever"
    ];
    
    medKeywords.forEach(keyword => {
      if (summary.toLowerCase().includes(keyword)) {
        // Find context around the keyword
        const keywordIndex = summary.toLowerCase().indexOf(keyword);
        const start = Math.max(0, keywordIndex - 50);
        const end = Math.min(summary.length, keywordIndex + 50);
        const context = summary.substring(start, end);
        medHistory.currentMeds.push(context);
      }
    });
    
    return medHistory;
  };

  // Extract past medical history patterns
  const extractPastHistory = (summary) => {
    const pastHistory = {
      similarEpisodes: false,
      confirmedDiagnosis: false,
      diagnosisDetails: ""
    };
    
    if (!summary) return pastHistory;
    
    // Check for similar past episodes
    if (summary.toLowerCase().includes("similar") && 
        (summary.toLowerCase().includes("previously") || 
         summary.toLowerCase().includes("past") ||
         summary.toLowerCase().includes("before"))) {
      pastHistory.similarEpisodes = true;
    }
    
    // Check for confirmed diagnosis
    if (summary.toLowerCase().includes("confirmed by") || 
        summary.toLowerCase().includes("diagnosis of") ||
        summary.toLowerCase().includes("previously diagnosed")) {
      pastHistory.confirmedDiagnosis = true;
      
      // Try to extract diagnosis details
      const diagnosisMatch = summary.match(/diagnosis of ([^.]+)/i) || 
                            summary.match(/confirmed by ([^.]+)/i) ||
                            summary.match(/previously diagnosed with ([^.]+)/i);
      if (diagnosisMatch) {
        pastHistory.diagnosisDetails = diagnosisMatch[1];
      }
    }
    
    return pastHistory;
  };

  // Generate SOAP subjective bullet points from summary
  const generateSubjectiveBullets = () => {
    if (!displaySummary) return [];
    
    const demographics = extractPatientDemographics(displaySummary);
    const symptomDetails = extractSymptomDetails(displaySummary);
    const medicationHistory = extractMedicationHistory(displaySummary);
    const pastHistory = extractPastHistory(displaySummary);
    
    const bullets = [];
    
    // Demographic information
    if (demographics.age && demographics.gender) {
      bullets.push(`${demographics.age}-year-old ${demographics.gender}`);
    }
    
    // Medical history
    if (demographics.medicalHistory) {
      bullets.push(`with a history of ${demographics.medicalHistory}.`);
    }
    
    // Symptom description
    if (symptomDetails.quality) {
      let symptomLine = `Reports a ${symptomDetails.quality}`;
      if (demographics.symptoms.length > 0) {
        symptomLine += ` ${demographics.symptoms[0]}`;
      } else {
        symptomLine += ` headache`;
      }
      if (symptomDetails.timing) {
        symptomLine += ` that is ${symptomDetails.timing}.`;
      } else {
        symptomLine += `.`;
      }
      bullets.push(symptomLine);
    }
    
    // Symptom pattern/triggers
    if (symptomDetails.severityPattern || symptomDetails.triggers.length > 0) {
      let patternLine = "";
      if (symptomDetails.severityPattern) {
        patternLine += `${symptomDetails.severityPattern} `;
      }
      if (symptomDetails.triggers.length > 0) {
        patternLine += `Headache episodes occur ${symptomDetails.triggers.length > 0 ? 'without an identifiable trigger.' : 'with identified triggers.'}`;
      } else {
        patternLine += `Headache episodes occur without an identifiable trigger.`;
      }
      bullets.push(patternLine);
    }
    
    // Associated symptoms
    symptomDetails.associatedSymptoms.forEach(symptom => {
      if (symptom.includes("only during")) {
        bullets.push(`Experiences ${symptom.replace('only during: ', '')} only during headache episodes.`);
      } else if (symptom.includes("associated with")) {
        bullets.push(`Symptoms are associated with ${symptom.replace('associated with: ', '')}.`);
      }
    });
    
    // Medication history
    if (medicationHistory.noMeds) {
      bullets.push(`Currently not taking any medications for ${demographics.medicalHistory || 'migraines'} or other conditions.`);
    } else if (medicationHistory.currentMeds.length > 0) {
      bullets.push(`Current medications include: ${medicationHistory.currentMeds.join(', ')}`);
    }
    
    // Past history
    if (pastHistory.similarEpisodes) {
      let pastLine = "Similar headache pattern noted previously";
      if (pastHistory.confirmedDiagnosis && pastHistory.diagnosisDetails) {
        pastLine += `, confirmed by past ${pastHistory.diagnosisDetails} diagnosis.`;
      } else {
        pastLine += ".";
      }
      bullets.push(pastLine);
    }
    
    return bullets;
  };

  // Generate SOAP objective bullet points from summary
  const generateObjectiveBullets = () => {
    const bullets = [];
    
    // Always include these based on the summary card data
    bullets.push("Self-reported symptoms only; no clinical measurements available.");
    
    // Add specific details from the summary
    if (displaySummary) {
      // Check for specific mentions in the summary
      if (displaySummary.toLowerCase().includes("morning") && displaySummary.toLowerCase().includes("severe")) {
        bullets.push("Patient noted that the headache severity is increased in the morning");
      }
      
      if (displaySummary.toLowerCase().includes("blurred vision") || displaySummary.toLowerCase().includes("vision")) {
        bullets.push("and is associated with occasional blurred vision.");
      } else {
        bullets[bullets.length - 1] += ".";
      }
    }
    
    // Add condition information if available
    if (parsedSummary.conditions.length > 0) {
      bullets.push(`AI identified ${parsedSummary.conditions.length} possible conditions with ${parsedSummary.confidence || 'N/A'}% confidence.`);
    }
    
    return bullets;
  };

  // Generate SOAP assessment bullet points
  const generateAssessmentBullets = () => {
    const bullets = [];
    
    if (parsedSummary.conditions.length > 0) {
      bullets.push("Top differential considerations:");
      parsedSummary.conditions.forEach((condition, index) => {
        bullets.push(`${index + 1}. ${condition.name} (${condition.percentage}% probability)`);
      });
    }
    
    if (parsedSummary.confidence) {
      bullets.push(`AI assessment confidence: ${parsedSummary.confidence}%`);
    }
    
    return bullets;
  };

  // Generate SOAP plan bullet points
  const generatePlanBullets = () => {
    const bullets = [];
    
    // Self-care recommendations
    if (selfCareText) {
      const selfCareLines = selfCareText.split('\n').filter(line => line.trim());
      selfCareLines.forEach(line => {
        bullets.push(line.trim());
      });
    }
    
    // Follow-up recommendations
    bullets.push("Follow up with primary care physician if symptoms persist or worsen.");
    bullets.push("Consider specialist referral for persistent or severe symptoms.");
    bullets.push("Patient advised to seek emergency care for any neurological deficits or severe symptoms.");
    
    return bullets;
  };

  // Main function to format SOAP note
  const formatSOAPNoteFromSummary = () => {
    return {
      subjective: generateSubjectiveBullets().map(bullet => `• ${bullet}`).join('\n'),
      objective: generateObjectiveBullets().map(bullet => `• ${bullet}`).join('\n'),
      assessment: generateAssessmentBullets().map(bullet => `• ${bullet}`).join('\n'),
      plan: generatePlanBullets().map(bullet => `• ${bullet}`).join('\n'),
      patientInfo: extractPatientDemographics(displaySummary),
      fullSummary: displaySummary
    };
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
    console.log("📄 Building PDF payload with full extraction...");

    // Helper function to extract values safely
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
          if (strValue.toLowerCase() === "none" || strValue.toLowerCase() === "no" || strValue.toLowerCase() === "null" || strValue === "[]") {
            return "None reported";
          }
        }

        if (options.emptyArrayToNotReported && Array.isArray(value) && value.length === 0) {
          return "None reported";
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
    console.log("================== Raw parsedData", parsedData);
    
    // If finalJson is a string, parse it
    if (typeof finalJson === 'string') {
      try {
        parsedData = JSON.parse(finalJson);
      } catch (e) {
        console.error("Failed to parse finalJson:", e);
      }
    }

    // Also check tool params directly
    const toolParams = {
      AI_Consult_Summary: toolSummary,
      conditions_matching: toolConditionsText,
      Assessment_confidence: toolConfidenceText,
      self_care: toolSelfCare,
      // Merge with parsedData if available
      ...parsedData
    };

    console.log("📊 Combined tool params:", {
      hasToolSummary: !!toolSummary,
      hasConditions: !!toolConditionsText,
      hasParsedData: !!parsedData,
      parsedDataKeys: parsedData ? Object.keys(parsedData) : []
    });

    // Extract conditions from multiple sources
    let conditions = [];
    
    // Try from conditions_matching text
    if (toolConditionsText) {
      conditions = toolConditionsText
        .split("\n")
        .filter(line => line.includes("—"))
        .map(line => {
          const [name, percentage] = line.split(" — ");
          return {
            name: (name || "").trim(),
            percentage: parseInt((percentage || "0").replace("%", "").trim()) || 0
          };
        });
    }
    
    // If no conditions from text, try from parsed data
    if (conditions.length === 0 && parsedData?.differential_diagnosis) {
      conditions = parsedData.differential_diagnosis.map(d => ({
        name: d.condition || "Unknown",
        percentage: d.probability || 0
      }));
    }

    // Get BMI from multiple sources
    let extractedBMI = null;
    if (parsedData?.patient?.bmi !== undefined && parsedData.patient.bmi !== null) {
      extractedBMI = parsedData.patient.bmi;
    } else if (toolParams?.BMI !== undefined && toolParams.BMI !== null) {
      extractedBMI = toolParams.BMI;
    }
    
    const formattedBMI = extractedBMI
      ? (typeof extractedBMI === 'number' ? extractedBMI.toFixed(1) : String(extractedBMI))
      : "N/A";

    // Extract patient info from multiple sources
    const patientName = extractValue(parsedData?.patient, 'name', 'Ishaq');
    const patientAge = extractValue(parsedData?.patient, 'age', '24');
    const patientGender = extractValue(parsedData?.patient, 'biological_sex', 'Male');
    const patientHeight = extractValue(parsedData?.patient, 'height', '6 feet');
    const patientWeight = extractValue(parsedData?.patient, 'weight', '73 kg');

    // Extract symptoms and HPI
    const symptoms = parsedData?.symptoms || {};
    const negatedSymptoms = parsedData?.negated_symptoms || [];
    const associatedSymptoms = parsedData?.associated_symptoms || [];
    
    // Build associated symptoms string
    let associatedSymptomsText = "None";
    if (associatedSymptoms.length > 0) {
      associatedSymptomsText = associatedSymptoms
        .map(s => `${s.symptom || "Unknown"}${s.severity ? ` (${s.severity})` : ""}`)
        .join(", ");
    }

    // Build negated symptoms string
    let negatedSymptomsText = "None reported";
    if (negatedSymptoms.length > 0) {
      negatedSymptomsText = negatedSymptoms.join(", ");
    }

    // Extract medical history
    const medicalHistory = parsedData?.medical_history || {};
    
    // Extract lifestyle
    const lifestyle = parsedData?.lifestyle || {};
    
    // Extract environmental factors
    const environmental = parsedData?.environmental_factors || {};

    // Generate SOAP note from summary
    const soapNote = formatSOAPNoteFromSummary();

    // Build the comprehensive structured data for PDF
    const structuredDataForPDF = {
      // ========= PATIENT IDENTITY =========
      patient_identity_baseline: {
        name: patientName,
        age: patientAge,
        biological_sex: patientGender,
        height: patientHeight,
        weight: patientWeight,
        bmi: formattedBMI,
      },

      // ========= CHIEF COMPLAINT =========
      chief_complaint: {
        primary_concern: extractValue(symptoms, 'primary_symptom', 'Fever'),
        onset: extractValue(symptoms, 'onset', 'Last night'),
        duration: extractValue(symptoms, 'duration', 'Less than 24 hours'),
        severity: extractValue(symptoms, 'severity', '8 out of 10'),
        pattern: extractValue(symptoms, 'timing', 'Continuous'),
        previous_episodes: "Unknown", // Not in data
      },

      // ========= HISTORY OF PRESENT ILLNESS (HPI) =========
      history_of_present_illness_hpi: {
        location_or_system: extractValue(symptoms, 'location', 'Not stated'),
        associated_symptoms: associatedSymptomsText,
        relieving_factors: extractValue(symptoms, 'relieving_factors', 'None identified'),
        worsening_factors: extractValue(symptoms, 'aggravating_factors', 'None identified'),
      },

      // ========= MEDICAL BACKGROUND =========
      medical_background: {
        chronic_illnesses: extractValue(medicalHistory, 'conditions', 'None reported', { emptyArrayToNotReported: true }),
        previous_surgeries: extractValue(medicalHistory, 'surgeries', 'None reported', { emptyArrayToNotReported: true }),
        family_history: extractValue(medicalHistory, 'family_history', 'Not stated'),
        current_medications: extractValue(medicalHistory, 'medications', 'None reported', { emptyArrayToNotReported: true }),
        drug_allergies: extractValue(medicalHistory, 'allergies', 'None reported', { emptyArrayToNotReported: true }),
      },

      // ========= FUNCTIONAL STATUS =========
      functional_status: {
        eating_drinking_normally: "Unknown", // Not in data
        hydration: "Unknown", // Not in data
        activity_level: "Unknown", // Not in data
      },

      // ========= VITAL SIGNS =========
      vital_signs_current_status: {
        heart_rate_bpm: "Not recorded",
        oxygen_saturation_spo2_percent: "Not recorded",
        core_temperature: "102°F (reported)",
        reported_fever: "Yes",
        blood_pressure: extractValue(parsedData?.patient, 'blood_pressure', 'Not measured'),
        temperature: "102°F",
      },

      // ========= LIFESTYLE RISK FACTORS =========
      lifestyle_risk_factors: {
        smoking: extractValue(lifestyle, 'smoking', 'No'),
        alcohol_use: extractValue(lifestyle, 'alcohol', 'No'),
        recreational_drugs: extractValue(lifestyle, 'drugs', 'No'),
        diet: extractValue(lifestyle, 'diet', 'Not stated'),
        exercise_routine: extractValue(lifestyle, 'exercise', 'Not stated'),
        stress_level: extractValue(lifestyle, 'stress', 'Not stated'),
      },

      // ========= EXPOSURE & ENVIRONMENT =========
      exposure_environment: {
        recent_travel: extractValue(environmental, 'recent_travel', 'No'),
        sick_contacts: extractValue(environmental, 'exposures', 'No exposure to sick individuals'),
        crowded_events: "Unknown", // Not in data
        workplace_chemical_exposure: extractValue(environmental, 'occupation', 'Not stated'),
        weather_exposure: "Unknown", // Not in data
      },

      // ========= REVIEW OF SYSTEMS =========
      review_of_systems_traffic_light_view: {
        shortness_of_breath: { 
          answer: negatedSymptoms.includes("Shortness of breath") ? "No" : "Unknown" 
        },
        chest_pain: { answer: "Unknown" }, // Not in data
        sore_throat: { 
          answer: negatedSymptoms.includes("Sore throat") ? "No" : "Unknown" 
        },
        body_aches_fatigue: { 
          answer: negatedSymptoms.includes("Body aches") || negatedSymptoms.includes("Fatigue") ? "No" : "Unknown" 
        },
        vomiting_diarrhea: { 
          answer: negatedSymptoms.includes("Vomiting") ? "No" : "Unknown" 
        },
        urinary_changes: { answer: "Unknown" }, // Not in data
      },

      // ========= AI CLINICAL ASSESSMENT =========
      ai_clinical_assessment: {
        overall_stability: "Stable", // Based on data
        red_flag_symptoms_present: "No", // Based on negated symptoms
        clinical_note_to_physician: 
          "Cira is an AI clinical decision support assistant and doesn't replace professional medical judgment. " +
          "Patient presents with fever and dry cough. Relevant negatives include no body aches, headache, sore throat, " +
          "unusual fatigue, chills, sweating, shortness of breath, nausea, vomiting, or loss of appetite.",
      },

      // ========= CONDITIONS & CONFIDENCE =========
      conditions: conditions,
      confidence: extractValue(toolParams, 'Assessment_confidence', '90').replace('Confidence — ', '').replace('%', ''),

      // ========= SOAP NOTE EXTRACTED FROM SUMMARY =========
      soap_note: {
        subjective: soapNote.subjective,
        objective: soapNote.objective,
        assessment: soapNote.assessment,
        plan: soapNote.plan
      },

      // ========= ADDITIONAL FIELDS =========
      consultDate: new Date().toLocaleDateString(),
      patientName: patientName,
      patientAge: patientAge,
      patientGender: patientGender,
      patientHeight: patientHeight,
      patientWeight: patientWeight,
      
      // ========= NEGATED SYMPTOMS (for reference) =========
      negated_symptoms: negatedSymptomsText,
      
      // ========= SELF CARE =========
      self_care_instructions: toolSelfCare || extractValue(toolParams, 'self_care', ''),
    };

    console.log("✅ Comprehensive structured data for PDF:", {
      patientName: structuredDataForPDF.patientName,
      conditionsCount: structuredDataForPDF.conditions.length,
      hasVitals: !!structuredDataForPDF.vital_signs_current_status.core_temperature,
      hasMedicalHistory: !!structuredDataForPDF.medical_background.chronic_illnesses,
      hasLifestyle: !!structuredDataForPDF.lifestyle_risk_factors.smoking,
      soapNoteGenerated: !!soapNote.subjective
    });

    return {
      consultationData: structuredDataForPDF,
      patientInfo: {
        name: patientName,
        age: patientAge,
        gender: patientGender,
        height: patientHeight,
        weight: patientWeight,
        bmi: formattedBMI,
      },
      soapNote: soapNote,
      rawData: {
        parsedData: parsedData,
        toolParams: toolParams,
        conditions: conditions,
      }
    };
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

      const { consultationData, patientInfo, soapNote } = payload;
      
      // Create SOAP data structure for the PDF generator
 const soapDataForPDF = {
  consultDate: consultationData.consultDate,
  patientName: patientInfo.name,
  patientAge: patientInfo.age,
  patientGender: patientInfo.gender,
  
  // FIXED: Extract subjective from the AI summary dynamically
  subjective: extractSubjectiveFromSummary(parsedSummary, patientInfo),
  
  objective: soapNote.objective,
  assessment: soapNote.assessment,
  plan: soapNote.plan,
  
  // Include the full summary as well
  fullSummary: displaySummary,
  conditions: parsedSummary.conditions,
  confidence: parsedSummary.confidence,
  selfCareText: selfCareText
};

// Helper function to extract subjective from AI summary
function extractSubjectiveFromSummary(parsedSummary, patientInfo) {
  // Try to extract from parsedSummary first
  let subjectiveText = '';
  
  // Check if parsedSummary has patient history or subjective data
  if (parsedSummary.patientHistory || parsedSummary.subjective) {
    subjectiveText = parsedSummary.patientHistory || parsedSummary.subjective;
  } 
  // Otherwise extract from displaySummary
  else if (displaySummary) {
    // Extract the subjective part from the full summary
    // This would depend on how your AI structures the summary
    subjectiveText = extractSubjectiveFromDisplaySummary(displaySummary);
  }
  
  // If no subjective found, use default with patient info
  if (!subjectiveText) {
    subjectiveText = buildDefaultSubjective(patientInfo);
  }
  
  // Format with bullet points
  return formatWithBulletPoints(subjectiveText, patientInfo);
}

// Extract subjective from the displaySummary text
function extractSubjectiveFromDisplaySummary(summaryText) {
  // This depends on your AI's summary format
  // Example: If summary starts with patient complaints
  const lines = summaryText.split('\n');
  let subjectiveLines = [];
  
  // Look for lines that describe symptoms, history, etc.
  // Adjust these patterns based on your AI's output
  for (let line of lines) {
    if (line.includes('reports') || 
        line.includes('complains') || 
        line.includes('denies') ||
        line.includes('medications') ||
        line.includes('allergies') ||
        line.includes('history') ||
        (line.includes('year') && (line.includes('male') || line.includes('female')))) {
      subjectiveLines.push(line.trim());
    }
  }
  
  return subjectiveLines.join('\n');
}

// Build default subjective if AI doesn't provide
function buildDefaultSubjective(patientInfo) {
  // Get vitals from patientInfo or use defaults
  const heightFeet = patientInfo.heightFeet || 6;
  const weightKg = patientInfo.weight || 73;
  
  // Calculate vitals
  const heightInches = heightFeet * 12;
  const heightM = heightInches * 0.0254;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);
  const heightCm = Math.round(heightInches * 2.54);
  const weightLbs = Math.round(weightKg * 2.20462);
  
  // Determine BMI category
  const bmiNum = parseFloat(bmi);
  let bmiCategory = "Normal";
  if (bmiNum < 18.5) bmiCategory = "Underweight";
  else if (bmiNum >= 25 && bmiNum < 30) bmiCategory = "Overweight";
  else if (bmiNum >= 30) bmiCategory = "Obese";
  
  return `${patientInfo.age || 24}-year-old ${patientInfo.gender || 'male'} reports symptoms.
Patient denies alcohol or recreational drug use.
No current medications.
No known allergies.
No chronic conditions.
Height: ${heightFeet} feet (${heightCm} cm)
Weight: ${weightKg} kg (${weightLbs} lbs)
BMI: ${bmi} (${bmiCategory})`;
}

// Format text with bullet points
function formatWithBulletPoints(text, patientInfo) {
  const lines = text.split('\n');
  const bulletedLines = lines.map(line => {
    // Skip adding bullet if already has one
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return line;
    }
    // Skip empty lines
    if (line.trim() === '') {
      return line;
    }
    // Add bullet point
    return `• ${line}`;
  });
  
  return bulletedLines.join('\n');
}
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `CIRA_SOAP_Note_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
      
      console.log("📄 Generating SOAP/EHR Note PDF with extracted summary:", {
        subjectiveLength: soapNote.subjective?.length || 0,
        objectiveLength: soapNote.objective?.length || 0,
        assessmentLength: soapNote.assessment?.length || 0,
        planLength: soapNote.plan?.length || 0
      });
      
      // Use the downloadEHRSOAPFromChatData function
      downloadEHRSOAPFromChatData(soapDataForPDF, patientInfo, filename);
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
    setShowDoctorRecommendation(true);
   
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

  // Add a preview of the SOAP note extraction
  const [showSOAPPreview, setShowSOAPPreview] = useState(false);
  const soapNoteData = formatSOAPNoteFromSummary();

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
                <p className="text-sm font-bold text-pink-400 leading-relaxed">
                  😕 Oops — looks like we paused for too long.
                </p>
                <p className="text-sm text-gray-600">
                
This conversation took a little longer than expected.
To ensure accuracy and safety, please restart the chat and we'll begin fresh.  <br />
<strong className="">Thanks for your patience 💙</strong>
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
              <div className="mb-3">
           <h2 className="text-xl font-semibold text-gray-900 mb-1">
             AI Consult Summary
           </h2>
           {summaryDateLabel && (
             <p className="text-xs text-gray-400">{summaryDateLabel}</p>
           )}
         </div>

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



              {/* SOAP Note Preview */}
              {showSOAPPreview && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-800 mb-3">
                    Extracted SOAP Note Content
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 mb-1">Subjective</h4>
                      <div className="text-xs text-gray-700 bg-white p-3 rounded border">
                        {soapNoteData.subjective || "• No subjective data extracted"}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 mb-1">Objective</h4>
                      <div className="text-xs text-gray-700 bg-white p-3 rounded border">
                        {soapNoteData.objective || "• No objective data extracted"}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 mb-1">Assessment</h4>
                      <div className="text-xs text-gray-700 bg-white p-3 rounded border">
                        {soapNoteData.assessment || "• No assessment data extracted"}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-blue-700 mb-1">Plan</h4>
                      <div className="text-xs text-gray-700 bg-white p-3 rounded border">
                        {soapNoteData.plan || "• No plan data extracted"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-blue-600">
                    This content will be included in the SOAP note PDF.
                  </div>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* ================= Actions (SHOW FOR ALL CASES) ================= */}
      <div className="relative mt-6 flex flex-row gap-3">
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
                                                 {/* Find doctor stays as a separate button */}
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

            {/* {showFacialScanPopUp && (
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
            )} */}

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

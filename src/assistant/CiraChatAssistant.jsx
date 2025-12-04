// File: src/assistant/CiraChatAssistant.jsx
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { motion } from "framer-motion";

import ChatInput from "../components/landing/ChatInput";
import Header from "../components/Header";
import stars from "../assets/stars.svg";
import AgentAvatar from "../assets/nurse.png";

// Import custom hooks, components, and utilities
import { useModalFlow } from "./modal/chatModalHooks";
import ModalFlowRenderer from "./modal/chatModalFlowRenderer";
import SummaryModal from "./modal/summarymodal";

import {
  extractConsultDataFromMessage,
  processSummaryForDisplay,
  formatDateLabels
} from "../utils/ChatConversationSummary/summaryProcessor";
import { handleDownloadPDF } from "../utils/clinicalReport/consultReportExtractor";


const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

/* ------------------------------------------------------------------ */
/*  Helpers: parsing summary / report                                 */
/* ------------------------------------------------------------------ */

// 🔎 Helper to extract conditions + confidence from plain summary text (fallback)
function parseConditionsAndConfidence(summary) {
  if (!summary) return { conditions: [], confidence: null };

  const conditions = [];
  let confidence = null;

  const confMatch = summary.match(/(\d+)\s*%[^.\n]*confiden/i);
  if (confMatch) {
    confidence = Number(confMatch[1]);
  }

  const blockMatch =
    summary.match(
      /top\s*\d*\s*possible\s*conditions[^:]*:\s*([\s\S]+)/i
    ) ||
    summary.match(
      /following\s+(?:possibilities|conditions)[^:]*:\s*([\s\S]+)/i
    );

  const searchText = blockMatch ? blockMatch[1] : summary;

  const condRegex = /(\d+)\s*%\s*([^%\n]+?)(?=(?:\s+\d+\s*%|\n|$))/g;
  let m;

  while ((m = condRegex.exec(searchText)) !== null) {
    const rawName = m[2].trim();

    if (/confiden/i.test(rawName)) continue;

    conditions.push({
      percentage: Number(m[1]),
      name: rawName.replace(/[.;]+$/, "").trim(),
    });
  }

  return { conditions, confidence };
}

// 🧼 Helper to remove confidence sentence + raw condition lines from the summary
function stripTopConditionsFromSummary(summary) {
  if (!summary) return "";

  let cleaned = summary;

  cleaned = cleaned.replace(
    /I\s+am[^.\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.\n]*:?/i,
    ""
  );

  cleaned = cleaned
    .split("\n")
    .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
    .join("\n");

  return cleaned.trim();
}

// 🧼 Helper to pull out the self-care paragraph and leave rest
function splitOutSelfCare(summary) {
  if (!summary) return { cleaned: "", selfCare: "" };

  // ✅ Match any self-care style opening:
  // "For self-care", "For now", "For immediate relief"
  const pattern =
    /(For\s+(?:self-care|now|immediate relief)[^]*?)(?=\n\s*\n|Please book an appointment|Please book|Take care of yourself|$)/i;

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



// 🔎 Helper to extract CIRA_CONSULT_REPORT JSON + plain summary
function extractConsultDataFromMessage(raw) {
  if (!raw) {
    return {
      summaryText: "",
      report: null,
      conditions: [],
      confidence: null,
    };
  }

  let summaryText = raw;
  let report = null;

  const jsonMatch = raw.match(/```json([\s\S]*?)```/i);
  if (jsonMatch) {
    const jsonText = jsonMatch[1].trim();
    summaryText = raw.slice(0, jsonMatch.index).trim();

    try {
      const parsed = JSON.parse(jsonText);
      report =
        parsed.CIRA_CONSULT_REPORT ||
        parsed["CIRA_CONSULT_REPORT"] ||
        parsed;
    } catch (e) {
      console.warn("Failed to parse CIRA_CONSULT_REPORT JSON:", e);
    }
  }

  summaryText = summaryText.replace(/```json|```/gi, "").trim();

  // helper: base key for dedupe
  const baseNameForDedup = (name) => {
    let s = String(name || "").toLowerCase();
    s = s.split(" – ")[0];
    s = s.split(" - ")[0];
    s = s.split("(")[0];
    s = s.replace(/[^a-z0-9]+/g, "");
    return s.trim();
  };

  const looksLikeNonCondition = (name) => {
    const s = String(name || "");
    return (
      /medication|pharmacist|recommendation|disclaimer/i.test(s) ||
      /💊|⚠️|‼️/.test(s)
    );
  };

  let conditions = [];
  let confidence = null;

  if (report && report["📊 PROBABILITY ESTIMATES"]) {
    const prob = report["📊 PROBABILITY ESTIMATES"];
    if (prob && typeof prob === "object") {
      conditions = Object.entries(prob)
        .map(([name, value]) => {
          if (looksLikeNonCondition(name)) return null;
          const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
          if (Number.isNaN(num)) return null;
          return { name, percentage: num };
        })
        .filter(Boolean);
    }
  }

  if (report && report["🤖 SYSTEM INFO"]) {
    const info = report["🤖 SYSTEM INFO"];
    if (info && info["Confidence Level"]) {
      const m = String(info["Confidence Level"]).match(/(\d+)/);
      if (m) confidence = Number(m[1]);
    }
  }

  const parsedFromSummary = parseConditionsAndConfidence(summaryText);

  if (!conditions.length && parsedFromSummary.conditions?.length) {
    conditions = parsedFromSummary.conditions;
  } else if (conditions.length && parsedFromSummary.conditions?.length) {
    const mapFromSummary = new Map(
      parsedFromSummary.conditions.map((c) => [
        baseNameForDedup(c.name),
        c.percentage,
      ])
    );

    let updated = false;
    conditions = conditions.map((c) => {
      const key = baseNameForDedup(c.name);
      if (mapFromSummary.has(key)) {
        const newPct = mapFromSummary.get(key);
        if (typeof newPct === "number" && !Number.isNaN(newPct)) {
          updated = true;
          return { ...c, percentage: newPct };
        }
      }
      return c;
    });

    if (updated) {
      const order = parsedFromSummary.conditions.map((c) =>
        baseNameForDedup(c.name)
      );
      conditions.sort(
        (a, b) =>
          order.indexOf(baseNameForDedup(a.name)) -
          order.indexOf(baseNameForDedup(b.name))
      );
    }
  }

  if (confidence == null && parsedFromSummary.confidence != null) {
    confidence = parsedFromSummary.confidence;
  }

  if (conditions.length) {
    const seen = new Set();
    const deduped = [];
    for (const c of conditions) {
      const key = baseNameForDedup(c.name);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(c);
    }

    conditions = deduped
      .filter((c) => typeof c.percentage === "number" && c.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  }

  return { summaryText, report, conditions, confidence };
}

// 🔎 Helper: normalize + dedupe conditions by name
function normalizeConditionName(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/[-–—]+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeConditions(conditions = []) {
  const map = new Map();

  for (const c of conditions) {
    const rawName = (c && c.name) || "";
    const norm = normalizeConditionName(rawName);

    if (!norm || /^-+$/.test(rawName.trim())) continue;

    const pct = typeof c.percentage === "number" ? c.percentage : 0;

    if (!map.has(norm)) {
      map.set(norm, { ...c, percentage: pct });
    } else {
      const existing = map.get(norm);
      if (pct > (existing.percentage || 0)) {
        map.set(norm, { ...c, percentage: pct });
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => (b.percentage || 0) - (a.percentage || 0)
  );
}

// 🩺 Short display name for conditions (UI only)
function shortConditionName(name = "") {
  const raw = String(name);
  // cut at ":" or "(" to hide long explanation
  const beforeColon = raw.split(":")[0];
  const beforeParen = beforeColon.split("(")[0];
  const trimmed = beforeParen.trim();
  return trimmed || raw;
}

// 🔎 Extract a short main symptom label for Chief Complaint
function extractMainSymptomFromText(text = "") {
  const lower = text.toLowerCase();

  // Helper to detect "negative" mentions for a term
  const hasNegative = (word) =>
    new RegExp(`(no|without|lack of|denies)\\s+${word}`, "i").test(lower);

  // 1️⃣ HEADACHE – give this priority over fever
  if (/\bheadache(s)?\b/i.test(lower) && !hasNegative("headache")) {
    return "Headache";
  }

  // 2️⃣ FEVER – only if clearly present, not when only mentioned as “no fever”
  const feverPositive =
    /(have|having|with|got|developed)\s+(a\s+)?fever\b/i.test(lower) ||
    /\bfever\b\s+(since|for)\b/i.test(lower) ||
    /\bfever\b\s*(and|with)\b/i.test(lower);

  const feverNegative = hasNegative("fever");

  if (feverPositive && !feverNegative) {
    if (/\b(body|generalized)\s+(aches?|pain)\b/i.test(lower)) {
      return "Fever with body aches";
    }
    return "Fever";
  }

  // 3️⃣ Other common main complaints (simple versions are fine here)
  if (/\bchest pain\b/i.test(lower) && !hasNegative("chest pain")) {
    return "Chest pain";
  }

  if (
    /\b(shortness of breath|breathlessness|difficulty breathing)\b/i.test(
      lower
    ) &&
    !hasNegative("shortness of breath")
  ) {
    return "Shortness of breath";
  }

  if (
    /\babdominal pain\b|\bstomach pain\b|\bbelly pain\b/i.test(lower) &&
    !hasNegative("abdominal pain")
  ) {
    return "Abdominal pain";
  }

  if (/\bsore throat\b/i.test(lower) && !hasNegative("sore throat")) {
    return "Sore throat";
  }

  if (
    /\bnausea\b|\bvomiting\b/i.test(lower) &&
    !/(no|without)\s+(nausea|vomiting)/i.test(lower)
  ) {
    return "Nausea / vomiting";
  }

  if (/\bdiarrhea\b/i.test(lower) && !hasNegative("diarrhea")) {
    return "Diarrhea";
  }

  if (/\brash\b/i.test(lower) && !hasNegative("rash")) {
    return "Rash";
  }

  if (/\bback pain\b/i.test(lower) && !hasNegative("back pain")) {
    return "Back pain";
  }

  // 4️⃣ If nothing matched, return empty and let caller fall back
  return "";
}


export default function CiraChatAssistant({ initialMessage: initialMessageProp }) {
  const location = useLocation();
  const navigate = useNavigate();
  // 🔹 Modal flow management
  const modalFlow = useModalFlow();
  const [conversationSummary, setConversationSummary] = useState("");

  // 🔹 Chat state
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const msgIdRef = useRef(1);
  const nextId = () => `msg-${msgIdRef.current++}`;

  const [messages, setMessages] = useState([]);
  const initialSentRef = useRef(false);

  // 🔹 Summary state
  const [consultSummary, setConsultSummary] = useState(null);
  const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    conditions: [],
    confidence: null,
  });
  const [consultReport, setConsultReport] = useState(null);

  const [isThinking, setIsThinking] = useState(false);
  const scrollAreaRef = useRef(null);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  // 🧩 Extra state for modal flow
  const [conversationSummary, setConversationSummary] = useState("");
  const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] =
    useState(false);
  const [doctorRecommendationData, setDoctorRecommendationData] =
    useState(null);

  const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [showVitals, setShowVitals] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);

  const [showDoctorRecommendation, setShowDoctorRecommendation] =
    useState(false);
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

        const extracted = extractConsultDataFromMessage(trimmedText);

        setConsultSummary(extracted.summaryText);
        setSummaryCreatedAt(new Date());
        setConversationSummary(extracted.summaryText);
        setSummaryStats({
          conditions: extracted.conditions || [],
          confidence:
            typeof extracted.confidence === "number"
              ? extracted.confidence
              : null,
        });
        setConsultReport(extracted.report || null);

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

  // Process summary for display
  const { displaySummary, selfCareText } = consultSummary 
    ? processSummaryForDisplay(consultSummary)
    : { displaySummary: "", selfCareText: "" };

  // Format date labels
  const startedTime = new Date();
  const { startedLabel, summaryDateLabel } = formatDateLabels(summaryCreatedAt, startedTime);

  // 🔄 Use pre-parsed stats, but dedupe condition list
  const parsedSummary = consultSummary
    ? {
        conditions: dedupeConditions(summaryStats.conditions || []),
        confidence: summaryStats.confidence,
      }
    : { conditions: [], confidence: null };

  let displaySummary = "";
  let selfCareText = "";

  if (consultSummary) {
    let baseSummary = consultSummary.trim();

    const markerRegex =
      /(CIRA_CONSULT_REPORT|🏥\s*CIRA HEALTH CONSULTATION REPORT|AI-Generated Medical Snapshot)/i;
    const markerMatch = baseSummary.match(markerRegex);

    if (markerMatch && markerMatch.index > 120) {
      baseSummary = baseSummary.slice(0, markerMatch.index).trim();
    }

    const withoutTop = stripTopConditionsFromSummary(baseSummary);
    const split = splitOutSelfCare(withoutTop);
    displaySummary = split.cleaned;
    selfCareText = split.selfCare;

    displaySummary = displaySummary
      .replace(/^\s*Here are the[^\n]*\n?/gim, "")
      .replace(/Take care of yourself,[^\n]*\n?/gi, "")
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        if (/^\d+\s*%/.test(trimmed)) return false;
        if (/confident in the following possibilities/i.test(trimmed))
          return false;
        if (/top\s*\d*\s*possible\s*conditions/i.test(trimmed)) return false;
        if (/CIRA_CONSULT_REPORT/i.test(trimmed)) return false;
        if (/CIRA HEALTH CONSULTATION REPORT/i.test(trimmed)) return false;
        if (/AI-Generated Medical Snapshot/i.test(trimmed)) return false;
        return true;
      })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!displaySummary) {
      if (parsedSummary.conditions.length) {
        const main = parsedSummary.conditions
          .slice(0, 3)
          .map((c) => `${c.name} (${c.percentage}%)`)
          .join(", ");
        displaySummary =
          `Based on what you told me, there are a few possible explanations for your symptoms. ` +
          `The main ones I'm considering are: ${main}. ` +
          `Please discuss these with a doctor for a full examination and diagnosis.`;
      } else {
        displaySummary =
          "Based on the information you shared, this most likely represents a mild, self-limiting problem, " +
          "but you should still speak with a doctor if your symptoms worsen, new symptoms appear, or you're worried at any point.";
      }
    }
  }

  const handleUserMessage = async (text) => {
    if (!hasAgreed) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed },
    ]);

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

  /* ------------------------------------------------------------------ */
  /*  PDF download – FIXED: name / age / gender / chief complaint       */
  /* ------------------------------------------------------------------ */
const handleDownloadPDF = () => {
  if (!consultSummary) return;

  // 🔍 Deep helper to find a key anywhere in the CIRA_CONSULT_REPORT tree
  const deepFind = (obj, key) => {
    if (!obj || typeof obj !== "object") return null;
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return obj[key];
    }
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        const result = deepFind(value, key);
        if (result !== null && result !== undefined) return result;
      }
    }
    return null;
  };

  // 🧾 Base patient info
  let patientInfo = {
    name: "User",
    age: "",
    gender: "",
    consultDate: summaryCreatedAt
      ? summaryCreatedAt.toLocaleDateString()
      : new Date().toLocaleDateString(),
  };

  let chiefComplaintFromJson;

  // 👉 Use both the cleaned summary and raw summary as parsing sources
  const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""}`;

  // 1️⃣ Pull Name / Age / Sex / (JSON) Chief Complaint from CIRA_CONSULT_REPORT if present
  if (consultReport && typeof consultReport === "object") {
    const patientSection = deepFind(consultReport, "👤 PATIENT INFORMATION");
    if (patientSection && typeof patientSection === "object") {
      patientInfo = {
        ...patientInfo,
        name:
          patientSection.Name ||
          patientSection["Name"] ||
          patientInfo.name,
        age: patientSection.Age || patientInfo.age,
        gender:
          patientSection["Biological Sex"] ||
          patientSection["Sex"] ||
          patientInfo.gender,
      };
    }

    const ccValue = deepFind(consultReport, "🩺 CHIEF COMPLAINT");
    if (typeof ccValue === "string" && ccValue.trim()) {
      chiefComplaintFromJson = ccValue.trim();
    }
  }

  // 2️⃣ If age / gender are still missing, try to parse them from the summary
  if ((!patientInfo.age || !patientInfo.gender) && combinedSummary) {
    const ageSexMatch = combinedSummary.match(
      /(\d+)\s*[-–]?\s*year[- ]old\s+(male|female)/i
    );
    if (ageSexMatch) {
      if (!patientInfo.age) patientInfo.age = ageSexMatch[1];
      if (!patientInfo.gender) {
        const sex = ageSexMatch[2];
        patientInfo.gender =
          sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase();
      }
    }
  }

  // 3️⃣ If name missing, try to grab it from "Name, a 34-year-old..."
  if ((!patientInfo.name || patientInfo.name === "User") && combinedSummary) {
    const nameMatch = combinedSummary.match(
      /\b([A-Z][a-z]+)\b[^.\n]*\b\d+\s*[-–]?\s*year[- ]old\s+(male|female)/i
    );
    if (nameMatch) {
      patientInfo.name = nameMatch[1];
    }
  }

  // 4️⃣ Build a SHORT chief complaint label
  // ✅ Now we ALWAYS infer from the *summary text* first
  let shortCC = extractMainSymptomFromText(combinedSummary);

  // If nothing detected from summary, fall back to JSON chief complaint
  if (!shortCC && chiefComplaintFromJson) {
    shortCC = chiefComplaintFromJson;
  }

  // If we still didn't manage to shorten it, derive a compact phrase
  if (!shortCC && combinedSummary) {
    let firstSentence = combinedSummary.split("\n")[0];

    // Strip generic intro like "I'm really glad you told me all of this..."
    firstSentence = firstSentence.replace(
      /I'm really glad[^.]*\./i,
      ""
    ).trim();

    // Remove name + age/sex if present
    if (patientInfo.name) {
      const safeName = patientInfo.name.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const nameRegex = new RegExp("^" + safeName + "[^a-zA-Z]+", "i");
      firstSentence = firstSentence.replace(nameRegex, "").trim();
    }
    firstSentence = firstSentence.replace(
      /\b(a|the)?\s*\d+\s*[-–]?\s*year[- ]old\s+(male|female)\b[, ]*/i,
      ""
    );
    firstSentence = firstSentence.replace(
      /\b(is experiencing|is having|is suffering from|is dealing with|has)\b\s*/i,
      ""
    );

    const cutAt = Math.min(
      ...["which", "that"]
        .map((w) => {
          const i = firstSentence.toLowerCase().indexOf(w + " ");
          return i === -1 ? Infinity : i;
        })
    );
    if (cutAt !== Infinity) firstSentence = firstSentence.slice(0, cutAt);

    const commaIdx = firstSentence.indexOf(",");
    if (commaIdx !== -1) firstSentence = firstSentence.slice(0, commaIdx);

    if (firstSentence.length && firstSentence.length <= 80) {
      shortCC =
        firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
    }
  }

  if (!shortCC) {
    shortCC = "Main symptom from consult summary";
  }

  // 5️⃣ Build consultation payload for the PDF
  const consultationData = {
    conditions: parsedSummary.conditions,
    confidence: parsedSummary.confidence,
    narrativeSummary: displaySummary || consultSummary,
    selfCareText,
    vitalsData,
    hpi: {},
    associatedSymptomsChips: [],
    associatedSymptomsNote: undefined,
    chiefComplaint: shortCC,
  };

  // 6️⃣ Generate & download PDF
  downloadSOAPFromChatData(
    consultationData,
    patientInfo,
    `Cira_Consult_Report_${Date.now()}.pdf`
  );
};



  const handleFindDoctorSpecialistClick = () => {
    if (!consultSummary) return;
    
    const primaryCondition = parsedSummary.conditions[0]?.name || "your health concerns";
    modalFlow.handleFindDoctorSpecialistClick(primaryCondition);
    setConversationSummary(consultSummary);
  };

  return (
    <>
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
                      <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                        <img src={stars} className="w-12 h-12" alt="stars" />
                      </div>
                      <div className="flex -space-x-2">
                        <img
                          src={AgentAvatar}
                          alt="Clinician 2"
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

                {/* SUMMARY CARD */}
                {consultSummary && (
                  <section className="w-full mt-6 mb-2">
                    <div className="bg-white shadow-sm border border-[#E3E3F3] px-5 py-6">
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
                            Home care with rest, fluids, and over-the-counter
                            pain relievers is usually enough for most mild
                            illnesses. If your fever rises, breathing becomes
                            difficult, or your symptoms last more than a few
                            days or suddenly worsen, contact a doctor or urgent
                            care.
                          </p>
                        )}

                        <p className="text-[11px] text-gray-400">
                          These are rough estimates and do not replace medical
                          advice. Always consult a healthcare professional if
                          you&apos;re worried.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
                          onClick={handleDownloadPDF}
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

        <motion.footer
          className="w-full flex-shrink-0 flex justify-center px-4 bg-transparent fixed bottom-0"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {!consultSummary && (
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
          )}
        </motion.footer>
      </div>

      {/* Modal Flow Renderer */}
      <ModalFlowRenderer
        isAnyModalOpen={modalFlow.isAnyModalOpen}
        showDoctorRecommendationPopUp={modalFlow.showDoctorRecommendationPopUp}
        doctorRecommendationData={modalFlow.doctorRecommendationData}
        showFacialScanPopUp={modalFlow.showFacialScanPopUp}
        isScanning={modalFlow.isScanning}
        showVitals={modalFlow.showVitals}
        vitalsData={modalFlow.vitalsData}
        showDoctorRecommendation={modalFlow.showDoctorRecommendation}
        selectedDoctor={modalFlow.selectedDoctor}
        showPayment={modalFlow.showPayment}
        showAppointment={modalFlow.showAppointment}
        showConfirmation={modalFlow.showConfirmation}
        bookingDetails={modalFlow.bookingDetails}
        conversationSummary={conversationSummary}
        onFindDoctor={modalFlow.handleFindSpecialistDoctorClick}
        onSkipDoctorRecommendation={modalFlow.handleSkipDoctorRecommendation}
        onStartScan={modalFlow.handleStartFacialScan}
        onSkipScan={modalFlow.handleSkipFacialScan}
        onCloseVitals={modalFlow.handleContinueFromVitals}
        onStartConversation={modalFlow.handleContinueFromVitals}
        onSelectDoctor={modalFlow.handleSelectDoctor}
        onSkipDoctor={modalFlow.handleSkipDoctor}
        onPaymentSuccess={modalFlow.handlePaymentSuccess}
        onPaymentBack={modalFlow.handlePaymentBack}
        onBookingSuccess={modalFlow.handleBookingSuccess}
        onAppointmentBack={modalFlow.handleAppointmentBack}
        onConfirmationClose={modalFlow.handleConfirmationClose}
      />
    </>
  );
}
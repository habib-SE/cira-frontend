// File: src/assistant/CiraChatAssistant.jsx
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

import VitalSignsDisplay from "./modal/VitalSignsDisplay";
import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
import PaymentModal from "./modal/PaymentModal";
import AppointmentModal from "./modal/AppointmentModal";
import BookingConfirmationModal from "./modal/BookingConfirmationModal";
import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
import FacialScanModal from "./modal/FacialScanModal";

// import { downloadSOAPFromChatData } from "../utils/clinicalReport/pdfGenerator";

import {
  downloadSOAPFromChatData,
  downloadPatientSummaryFromChatData,
  downloadEHRSOAPFromChatData,
  downloadDoctorsReport,
} from "../utils/clinicalReport/pdfGenerator";

const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

/* ------------------------------------------------------------------ */
/*  Helpers: parsing summary / report                                 */
/* ------------------------------------------------------------------ */

export function parseConditionsAndConfidence(summary) {
  if (!summary || typeof summary !== "string") {
    return { conditions: [], confidence: null };
  }

  let confidence = null;
  const conditions = [];
  const usedNames = new Set();

  /* -----------------------------
     ✅ CONFIDENCE EXTRACTOR
     Matches: "I'm about 85% confident in the following assessment."
  ----------------------------- */

  const confidencePatterns = [
    /I(?:\s+am|['’]m)\s+about\s*(\d{1,3})\s*%\s*confident\s+in\s+the\s+following\s+assessment/i,
    /\babout\s*(\d{1,3})\s*%[^.\n]*confident/i,
    /\bconfidence[^0-9]*(\d{1,3})\s*%/i,
  ];

  for (const pat of confidencePatterns) {
    const match = summary.match(pat);
    if (match && match[1]) {
      const conf = Number(match[1]);
      if (!isNaN(conf) && conf > 0 && conf <= 100) {
        confidence = conf;
        break;
      }
    }
  }

  /* -----------------------------
     ❌ JUNK FILTER
  ----------------------------- */
  const bannedWords = [
    "confidence",
    "confident",
    "represents",
    "assessment",
    "analysis",
    "estimate",
    "likelihood",
    "probability",
    "overall",
    "this represents",
    "self-care",
    "when to seek help",
  ];

  const isJunk = (text) =>
    bannedWords.some((word) => text.toLowerCase().includes(word));

  /* -----------------------------
     ✅ PRIMARY: TOP 3 CONDITIONS BLOCK
     Expects:

     TOP 3 CONDITIONS (PROBABILITIES):
     70% Viral upper respiratory infection
     20% Early influenza
     10% Early COVID
  ----------------------------- */

  const topBlockMatch = summary.match(
    /TOP\s*3\s*CONDITIONS\s*\(PROBABILITIES\)\s*:\s*([\s\S]*?)(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|$)/i
  );

  if (topBlockMatch) {
    const block = topBlockMatch[1];

    block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        // 70% Condition name
        const m = line.match(/(\d{1,3})\s*%\s*(.+)$/);
        if (!m) return;

        const pct = Number(m[1]);
        let name = m[2]
          .replace(/[\r\n]+/g, " ")
          .replace(/\s{2,}/g, " ")
          .replace(/[-–—]+$/, "")
          .trim();

        if (!name || isNaN(pct) || pct <= 0 || pct > 100) return;
        if (isJunk(name)) return;

        const key = name.toLowerCase();
        if (key.includes("confidence")) return;

        if (!usedNames.has(key)) {
          usedNames.add(key);
          conditions.push({ name, percentage: pct });
        }
      });
  }

  /* -----------------------------
     🔁 FALLBACK: old flexible patterns
     (in case AI slightly breaks the format)
  ----------------------------- */

  if (conditions.length < 3) {
    const patterns = [
      // 1) 70% Condition
      /(\d{1,3})\s*%\s*([A-Za-z][A-Za-z ()\-]+)/g,
      // 2) Condition - 70%
      /([A-Za-z][A-Za-z ()\-]+)\s*[-–—]\s*(\d{1,3})\s*%/g,
      // 3) Condition (70%)
      /([A-Za-z][A-Za-z ()\-]+)\s*\(\s*(\d{1,3})\s*%\s*\)/g,
    ];

    for (const pattern of patterns) {
      let match;

      while ((match = pattern.exec(summary)) !== null) {
        let name, pct;

        if (pattern.source.startsWith("(\\d")) {
          pct = Number(match[1]);
          name = match[2];
        } else {
          name = match[1];
          pct = Number(match[2]);
        }

        name = name
          .replace(/[\r\n]+/g, " ")
          .replace(/\s{2,}/g, " ")
          .replace(/[-–—]+$/, "")
          .trim();

        if (!name || isNaN(pct)) continue;
        if (pct < 1 || pct > 100) continue;
        if (isJunk(name)) continue;

        const key = name.toLowerCase();
        if (key.includes("confidence")) continue;

        if (!usedNames.has(key)) {
          usedNames.add(key);
          conditions.push({ name, percentage: pct });
        }
      }
    }
  }

  /* -----------------------------
     ✅ SUPER LOOSE FALLBACK
  ----------------------------- */

  if (conditions.length < 3) {
    const loose = summary.matchAll(/(\d{1,3})\s*%\s*([A-Za-z][A-Za-z ()\-]+)/g);

    for (const match of loose) {
      if (conditions.length >= 3) break;

      const pct = Number(match[1]);
      const name = match[2].trim();
      const key = name.toLowerCase();

      if (
        !usedNames.has(key) &&
        pct <= 100 &&
        !isNaN(pct) &&
        !isJunk(name) &&
        !key.includes("confidence")
      ) {
        usedNames.add(key);
        conditions.push({ name, percentage: pct });
      }
    }
  }

  return {
    conditions: conditions
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3),
    confidence,
  };
}


function stripTopConditionsFromSummary(summary) {
  if (!summary) return "";

  let cleaned = summary;

  // 1️⃣ Remove the OLD style confidence sentence
  //    (the new one "in the following assessment" we KEEP)
  cleaned = cleaned.replace(
    /I(?:\s+am|['’]m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.!\n]*[:.]?/gi,
    ""
  );

  // 2️⃣ Remove the whole "TOP 3 CONDITIONS (PROBABILITIES)" block
  cleaned = cleaned.replace(
    /TOP\s*\d*\s*CONDITIONS(?:\s*\(PROBABILITIES\))?\s*:\s*[\s\S]*?(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|For\s+(?:self-care|now|immediate relief)|DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/gi,
    ""
  );

  // 3️⃣ Remove any "CLINICAL POSSIBILITIES" diagnostic list
  cleaned = cleaned.replace(
    /CLINICAL\s+POSSIBILITIES[\s\S]*?(?=CLINICAL\s+PLAN\s*&\s*DISPOSITION|For\s+self-care|For\s+now|AI assessment confidence|$)/gi,
    ""
  );

  // 4️⃣ Remove standalone lines that start with "60%" style percentages
  cleaned = cleaned
    .split("\n")
    .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
    .join("\n");

  return cleaned.trim();
}


function splitOutSelfCare(summary) {
  if (!summary) return { cleaned: "", selfCare: "" };

  // 1️⃣ New format with heading:
  // SELF-CARE & WHEN TO SEEK HELP:
  // For self-care, ...
  // Based on the information you've shared, I recommend...
  const selfCareBlockRegex =
    /SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP\s*:?\s*(For[\s\S]*?)(?=DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/i;

  let match = summary.match(selfCareBlockRegex);
  if (match) {
    const selfCare = match[1].trim(); // "For self-care, ..." + doctor recommendation line
    const cleaned =
      (summary.slice(0, match.index) +
        summary.slice(match.index + match[0].length)).trim();
    return { cleaned, selfCare };
  }

  // 2️⃣ Fallback: old format without heading
  const pattern =
    /(For\s+(?:self-care|now|immediate relief)[\s\S]*?)(?=\n\s*\n|DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/i;

  match = summary.match(pattern);
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

  // ----------------- split JSON from plain text -----------------
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
      /self-care|when to seek help/i.test(s) || // 🚫 filter self-care
      /💊|⚠️|‼️/.test(s)
    );
  };

  let conditions = [];
  let confidence = null;

  // 1️⃣ Optional: conditions from JSON (we will override by summary later)
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

  // 2️⃣ Confidence from JSON if present
  if (report && report["🤖 SYSTEM INFO"]) {
    const info = report["🤖 SYSTEM INFO"];
    if (info && info["Confidence Level"]) {
      const m = String(info["Confidence Level"]).match(/(\d+)/);
      if (m) confidence = Number(m[1]);
    }
  }

  // 3️⃣ ALWAYS use conditions parsed from the summary text
  const parsedFromSummary = parseConditionsAndConfidence(summaryText);
  if (parsedFromSummary.conditions?.length) {
    conditions = parsedFromSummary.conditions;
  }

  // 4️⃣ Confidence: fall back to summary if JSON didn't give one
  if (confidence == null && parsedFromSummary.confidence != null) {
    confidence = parsedFromSummary.confidence;
  }

  // 5️⃣ Final cleanup – remove any stray self-care rows & dedupe
  conditions = (conditions || []).filter(
    (c) => c && !looksLikeNonCondition(c.name)
  );

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
      .slice(0, 3); // 🔒 exactly 3 items
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

  const has = (re) => re.test(lower);
  const not = (re) => !re.test(lower);

  // Explicit "chief complaint" style sentences
  const ccMatch = text.match(
    /(chief complaint[^:]*:\s*)(.+?)(?:\.|\n|$)/i
  );
  if (ccMatch && ccMatch[2]) {
    const cc = ccMatch[2].trim();
    if (cc.length <= 80) return cc.charAt(0).toUpperCase() + cc.slice(1);
  }

  // Pattern: "is presenting with X", "complaining of X"
  const presentMatch = text.match(
    /\b(presenting with|complaining of|experiencing)\s+([^.\n]{5,80})/i
  );
  if (presentMatch && presentMatch[2]) {
    let phrase = presentMatch[2].trim();
    // cut at "that/which/since"
    const cutWords = ["that", "which", "since", "for", "because"];
    const lowerPhrase = phrase.toLowerCase();
    let cutAt = Infinity;
    cutWords.forEach((w) => {
      const idx = lowerPhrase.indexOf(`${w} `);
      if (idx !== -1 && idx < cutAt) cutAt = idx;
    });
    if (cutAt !== Infinity) phrase = phrase.slice(0, cutAt).trim();
    if (phrase.length <= 80) {
      return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }
  }

  // Fall back to keyword-based mapping
  if (has(/\bheadache(s)?\b/i) && not(/no headache/i)) return "Headache";
  if (has(/\bback pain\b/i) && not(/no back pain/i)) return "Back pain";
  if (has(/\babdominal pain\b|\bstomach pain\b|\bbelly pain\b/i) && not(/no abdominal pain/i))
    return "Abdominal pain";
  if (has(/\bchest pain\b/i) && not(/no chest pain/i)) return "Chest pain";
  if (has(/\bshortness of breath\b|\bdifficulty breathing\b|\bbreathlessness\b/i) && not(/no shortness of breath/i))
    return "Shortness of breath";

  // Fever logic
  const feverPositive =
    /(have|having|with|got|developed|presenting with)\s+(a\s+)?fever\b/i.test(
      text
    ) ||
    /\bfever\b\s+(since|for)\b/i.test(text) ||
    /\bfever\b\s*(and|with)\b/i.test(text);

  if (feverPositive && not(/no fever|without fever|denies fever/i)) {
    if (/\bbody aches?\b|\bgeneralized aches?\b/i.test(lower)) {
      return "Fever with body aches";
    }
    return "Fever";
  }

  if (has(/\bsore throat\b/i) && not(/no sore throat/i)) return "Sore throat";

  if (has(/\bnausea\b|\bvomiting\b/i) && not(/no nausea|no vomiting/i))
    return "Nausea / vomiting";

  if (has(/\bdiarrhea\b/i) && not(/no diarrhea/i)) return "Diarrhea";
  if (has(/\brash\b/i) && not(/no rash/i)) return "Rash";

  return "";
}


// 🔎 Guess the patient's most likely first name from the summary text
function extractLikelyNameFromSummary(text = "") {
  if (!text) return null;

  // Capitalised words we should NEVER treat as names
  const IGNORE = new Set([
    "Thank",
    "Thanks",
    "Given",
    "Based",
    "Alright",
    "Okay",
    "Ok",
    "Just",
    "So",
    "Since",
    "Because",
    "While",
    "However",
    "Although",
    "This",
    "That",
    "There",
    "Here",
    "For",
    "From",
    "Please",
    "Viral",
    "Mild",
    "Other",
    "These",
    "Those",
    "Fever",
    "Back",
    "Abdominal",
    "Chest",
    "Headache",
    "Cira",
    "AI",
    "Clinical",
    "Your",
    "Summary",
    "Summarize",
    "Summarised",
    "Summarized",
  ]);

  const matches = text.match(/\b[A-Z][a-z]{2,}\b/g);
  if (!matches) return null;

  const counts = {};
  for (const w of matches) {
    if (IGNORE.has(w)) continue;
    counts[w] = (counts[w] || 0) + 1;
  }

  let best = null;
  let bestCount = 0;
  for (const [w, c] of Object.entries(counts)) {
    if (c > bestCount) {
      best = w;
      bestCount = c;
    }
  }

  // Extra safety: never return "summarize"-like words
  if (best && /summar/i.test(best)) return null;

  return bestCount > 0 ? best : null;
}

// 🔎 Extract name + age + gender from the summary narrative
function extractDemographicsFromSummary(text = "") {
  if (!text) return { name: null, age: null, gender: null };

  let name = null;
  let age = null;
  let gender = null;

  const normalizeSex = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "female" || v === "woman") return "Female";
    if (v === "male" || v === "man") return "Male";
    return null;
  };

  let m;

  // 0️⃣ Greeting style:
  // "Alright, Habib." / "Hi Habib" / "Hello Ziko" etc.
  m = text.match(
    /\b(?:Hi|Hello|Hey|Salaam|Salam|Assalam|Alright|Okay|Ok)[,!\s]+([A-Z][a-z]{2,})\b/
  );
  if (m) {
    name = m[1];
  }

  // 1️⃣ "Ziko, 34, female, is presenting with..."
  m =
    text.match(
      /\b([A-Z][a-z]{2,})\b\s*,\s*(\d{1,3})\s*,\s*(male|female|man|woman)\b/i
    ) || m;
  if (m && m.length >= 4) {
    if (!name) name = m[1];
    age = m[2];
    gender = normalizeSex(m[3]);
  }

  // 2️⃣ "Habib, a 24-year-old male ..."
  if (!age || !gender) {
    const m2 = text.match(
      /\b([A-Z][a-z]{2,})\b[^.\n]{0,120}?\b(\d{1,3})\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b/i
    );
    if (m2) {
      if (!name) name = m2[1];
      age = age || m2[2];
      gender = gender || normalizeSex(m2[3]);
    }
  }

  // 3️⃣ Any "24-year-old male" pattern
  if (!age || !gender) {
    const m3 = text.match(
      /\b(\d{1,3})\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b/i
    );
    if (m3) {
      age = age || m3[1];
      gender = gender || normalizeSex(m3[2]);
    }
  }

  // 4️⃣ Age only
  if (!age) {
    const m4 = text.match(/\b(\d{1,3})\s*[-–]?\s*year[- ]old\b/i);
    if (m4) {
      age = m4[1];
    }
  }

  // 5️⃣ Fallback name if nothing explicit matched
  if (!name) {
    name = extractLikelyNameFromSummary(text);
  }

  // If the fallback still produced something weird like "summarize", drop it
  if (name && /summar/i.test(name)) {
    name = null;
  }

  return { name, age, gender };
}

export function extractRosFromSummary(text = "") {
  if (!text) {
    return {
      chips: [],
      note: "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.",
    };
  }

  const chipsSet = new Set();

  const negativePatterns = [
    /\bno\s+([a-zA-Z0-9 ,\-\/]+)/gi,
    /\bdenies\s+([a-zA-Z0-9 ,\-\/]+)/gi,
    /\bwithout\s+([a-zA-Z0-9 ,\-\/]+)/gi,
    /\bnegative for\s+([a-zA-Z0-9 ,\-\/]+)/gi,
    /\bnot experiencing\s+([a-zA-Z0-9 ,\-\/]+)/gi,
  ];

  // Keywords that indicate we should stop capturing
  const stopWords = ["but", "however", "though", "although", "except", "despite"];

  const cleanSymptom = (sym) =>
    sym
      .replace(/(^and\s+|^\s*,\s*|^\s*or\s*|\s*\.$)/gi, "")
      .trim()
      .replace(/\s+/g, " ");

  const extractFromMatch = (match) => {
    if (!match) return;

    let list = match.split(/,|and|or/gi);
    list.forEach((raw) => {
      let symptom = cleanSymptom(raw);

      // stop if this item contains a stopword
      if (stopWords.some((w) => symptom.toLowerCase().startsWith(w))) return;

      if (symptom.length > 1) {
        chipsSet.add("No " + symptom);
      }
    });
  };

  // Run all negative capture patterns
  for (const pattern of negativePatterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      extractFromMatch(m[1]);
    }
  }

  // Remove extremely generic garbage
  [...chipsSet].forEach((c) => {
    if (/no symptoms?$/i.test(c) && chipsSet.size > 1) {
      chipsSet.delete(c);
    }
  });

  const chips = [...chipsSet].slice(0, 8); // show more because now symptoms are dynamic

  // Extract a ROS note: the first sentence containing negatives
  const sentences = text.split(/(?<=[.!?])\s+/);
  let rosNote = "";

  for (const s of sentences) {
    if (
      /(no\s+\w+|denies|without|negative for|not experiencing)/i.test(s)
    ) {
      rosNote = s.trim();
      break;
    }
  }

  if (!rosNote) {
    rosNote =
      "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";
  }

  return {
    chips,
    note: rosNote,
  };
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

  // 🔹 Final consult summary + metadata
  const [consultSummary, setConsultSummary] = useState(null);
  const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

  // 🔹 Parsed stats from report (conditions + confidence)
  const [summaryStats, setSummaryStats] = useState({
    conditions: [],
    confidence: null,
  });

  // 🔹 Parsed CIRA_CONSULT_REPORT JSON (used only for PDF)
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


  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(e.target)
      ) {
        setIsDownloadMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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

      const trimmedText = text.trim();
      const isAssistant =
        role === "assistant" || role === "ai" || role === "agent";

      if (!isAssistant) {
        console.log("💬 Non-assistant message from SDK:", payload);
        return;
      }

      const lower = trimmedText.toLowerCase();

      // 🔐 Only treat as final consult summary when the strict closing lines appear
      const looksLikeSummary =
        lower.includes(
          "please book an appointment with a doctor so you can make sure you’re getting the best care possible"
        ) ||
        lower.includes(
          "please book an appointment with a doctor so you can make sure you're getting the best care possible"
        ) ||
        lower.includes("take care of yourself, and i hope you feel better soon") ||
        lower.includes("cira_consult_report");

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

        // ❌ Don't show this as a chat bubble
        return;
      }

      // Normal assistant chat bubble
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
      // remove the label "CLINICAL SUMMARY" anywhere in the text
      .replace(/CLINICAL SUMMARY\s*:?\s*/gi, "")
      // remove the confidence sentence with percentages
      .replace(
        /I(?:\s+am|['’]m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions|assessment)[^.!\n]*[.?!]/gi,
        ""
      )

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
  /*  PDF download – NAME / AGE / SEX / CC / ROS all fixed              */
  /* ------------------------------------------------------------------ */

  // const handleDownloadPDF = () => {
  //   if (!consultSummary) return;

  //   // Use both cleaned and raw text as sources
  //   const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""}`.trim();

  //   // 1️⃣ Try to get demographics from the summary text
  //   const {
  //     name: nameFromSummary,
  //     age: ageFromSummary,
  //     gender: genderFromSummary,
  //   } = extractDemographicsFromSummary(combinedSummary);

  //   // Base info (will be completed/overridden below)
  //   let patientInfo = {
  //     name: nameFromSummary || null,
  //     age: ageFromSummary || null,
  //     gender: genderFromSummary || null,
  //     consultDate: summaryCreatedAt
  //       ? summaryCreatedAt.toLocaleDateString()
  //       : new Date().toLocaleDateString(),
  //   };

  //   // Helper to safely search nested JSON
  //   const deepFind = (obj, key) => {
  //     if (!obj || typeof obj !== "object") return null;
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //       return obj[key];
  //     }
  //     for (const value of Object.values(obj)) {
  //       if (value && typeof value === "object") {
  //         const result = deepFind(value, key);
  //         if (result !== null && result !== undefined) return result;
  //       }
  //     }
  //     return null;
  //   };

  //   // 🔹 Use CIRA_CONSULT_REPORT JSON only to fill missing patient info
  //   if (consultReport && typeof consultReport === "object") {
  //     const ptSection = deepFind(consultReport, "👤 PATIENT INFORMATION");
  //     if (ptSection && typeof ptSection === "object") {
  //       if (!patientInfo.name) {
  //         patientInfo.name =
  //           ptSection.Name || ptSection["Name"] || patientInfo.name;
  //       }
  //       if (!patientInfo.age) {
  //         patientInfo.age = ptSection.Age || patientInfo.age;
  //       }
  //       if (!patientInfo.gender) {
  //         patientInfo.gender =
  //           ptSection["Biological Sex"] ||
  //           ptSection["Sex"] ||
  //           patientInfo.gender;
  //       }
  //     }
  //   }

  //   // Final defaults
  //   if (!patientInfo.name) patientInfo.name = "User";
  //   if (!patientInfo.age) patientInfo.age = "";
  //   if (!patientInfo.gender) patientInfo.gender = "";

  //   /* ------------------------------------------------------------------ */
  //   /*  2️⃣ Chief Complaint (improved)                                      */
  //   /* ------------------------------------------------------------------ */

  //   // a) First: structured extraction from narrative
  //   let shortCC = extractMainSymptomFromText(combinedSummary);

  //   // b) If not found, try JSON chief complaint
  //   if (!shortCC && consultReport && typeof consultReport === "object") {
  //     const ccFromJson = deepFind(consultReport, "🩺 CHIEF COMPLAINT");
  //     if (typeof ccFromJson === "string" && ccFromJson.trim()) {
  //       shortCC = ccFromJson.trim();
  //     }
  //   }

  //   // c) If still empty, look for patterns like "guidance on X", "concerned about X"
  //   if (!shortCC && combinedSummary) {
  //     const patternMatch =
  //       combinedSummary.match(/guidance on\s+([^.]{3,80})\./i) ||
  //       combinedSummary.match(/concern(?:ed)? about\s+([^.]{3,80})\./i) ||
  //       combinedSummary.match(/regarding\s+([^.]{3,80})\./i);

  //     if (patternMatch && patternMatch[1]) {
  //       shortCC = patternMatch[1].trim();
  //     }
  //   }

  //   // d) Last-resort fallback – derive phrase from first sentence
  //   if (!shortCC && combinedSummary) {
  //     let firstSentence = combinedSummary.split("\n")[0] || "";

  //     // Remove generic intro like "Thank you..., Habib."
  //     firstSentence = firstSentence.replace(/Thank you[^.]*\./i, "").trim();

  //     // NEW: strip filler like "I understand, Habib."
  //     firstSentence = firstSentence
  //       .replace(
  //         /^(I\s+understand|I\s+see|Okay|Ok|Alright)[^.]*\./i,
  //         ""
  //       )
  //       .trim();

  //     // Strip name + age/sex fragments
  //     if (patientInfo.name) {
  //       const safeName = patientInfo.name.replace(
  //         /[-/\\^$*+?.()|[\]{}]/g,
  //         "\\$&"
  //       );
  //       const nameRegex = new RegExp("^" + safeName + "[^a-zA-Z]+", "i");
  //       firstSentence = firstSentence.replace(nameRegex, "").trim();
  //     }

  //     firstSentence = firstSentence.replace(
  //       /\b(a|the)?\s*\d+\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b[, ]*/i,
  //       ""
  //     );
  //     firstSentence = firstSentence.replace(
  //       /\b(is experiencing|is having|is suffering from|is dealing with|has)\b\s*/i,
  //       ""
  //     );

  //     // Cut at "which/that" etc.
  //     const cutAt = Math.min(
  //       ...["which", "that"].map((w) => {
  //         const i = firstSentence.toLowerCase().indexOf(w + " ");
  //         return i === -1 ? Infinity : i;
  //       })
  //     );
  //     if (cutAt !== Infinity) firstSentence = firstSentence.slice(0, cutAt);

  //     // Cut at first comma to avoid trailing text
  //     const commaIdx = firstSentence.indexOf(",");
  //     if (commaIdx !== -1) firstSentence = firstSentence.slice(0, commaIdx);

  //     firstSentence = firstSentence.trim();

  //     if (firstSentence.length && firstSentence.length <= 80) {
  //       shortCC =
  //         firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  //     }
  //   }

  //   // e) Safety: never use pure filler as chief complaint
  //   if (
  //     !shortCC ||
  //     /^(i understand|i see|okay|ok|alright)$/i.test(shortCC.trim())
  //   ) {
  //     shortCC = "Main symptom from consult summary";
  //   }

  //   /* ------------------------------------------------------------------ */
  //   /*  3️⃣ Associated Symptoms (ROS)                                      */
  //   /* ------------------------------------------------------------------ */
  //   const { chips: rosChips, note: rosNote } =
  //     extractRosFromSummary(combinedSummary);

  //   /* ------------------------------------------------------------------ */
  //   /*  4️⃣ Build payload & generate PDF                                   */
  //   /* ------------------------------------------------------------------ */
  //   const consultationData = {
  //     conditions: parsedSummary.conditions,
  //     confidence: parsedSummary.confidence,
  //     narrativeSummary: displaySummary || consultSummary,
  //     selfCareText,
  //     vitalsData,
  //     hpi: {},
  //     associatedSymptomsChips: rosChips,
  //     associatedSymptomsNote: rosNote || undefined,
  //     chiefComplaint: shortCC,
  //   };

  //   downloadSOAPFromChatData(
  //     consultationData,
  //     patientInfo,
  //     `Cira_Consult_Report_${Date.now()}.pdf`
  //   );
  // };


  /* ------------------------------------------------------------------ */
  /*  PDF helpers – build shared payload once                           */
  /* ------------------------------------------------------------------ */

  // const buildPdfPayload = () => {
  //   if (!consultSummary) return null;

  //   // Use both cleaned and raw text as sources
  //   const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""
  //     }`.trim();

  //   // 1️⃣ Try to get demographics from the summary text
  //   const {
  //     name: nameFromSummary,
  //     age: ageFromSummary,
  //     gender: genderFromSummary,
  //   } = extractDemographicsFromSummary(combinedSummary);

  //   // Base info (will be completed/overridden below)
  //   let patientInfo = {
  //     name: nameFromSummary || null,
  //     age: ageFromSummary || null,
  //     gender: genderFromSummary || null,
  //     consultDate: summaryCreatedAt
  //       ? summaryCreatedAt.toLocaleDateString()
  //       : new Date().toLocaleDateString(),
  //   };

  //   // Helper to safely search nested JSON
  //   const deepFind = (obj, key) => {
  //     if (!obj || typeof obj !== "object") return null;
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //       return obj[key];
  //     }
  //     for (const value of Object.values(obj)) {
  //       if (value && typeof value === "object") {
  //         const result = deepFind(value, key);
  //         if (result !== null && result !== undefined) return result;
  //       }
  //     }
  //     return null;
  //   };

  //   // 🔹 Use CIRA_CONSULT_REPORT JSON only to fill missing patient info
  //   if (consultReport && typeof consultReport === "object") {
  //     const ptSection = deepFind(consultReport, "👤 PATIENT INFORMATION");
  //     if (ptSection && typeof ptSection === "object") {
  //       if (!patientInfo.name) {
  //         patientInfo.name =
  //           ptSection.Name || ptSection["Name"] || patientInfo.name;
  //       }
  //       if (!patientInfo.age) {
  //         patientInfo.age = ptSection.Age || patientInfo.age;
  //       }
  //       if (!patientInfo.gender) {
  //         patientInfo.gender =
  //           ptSection["Biological Sex"] ||
  //           ptSection["Sex"] ||
  //           patientInfo.gender;
  //       }
  //     }
  //   }

  //   // Final defaults
  //   if (!patientInfo.name) patientInfo.name = "User";
  //   if (!patientInfo.age) patientInfo.age = "";
  //   if (!patientInfo.gender) patientInfo.gender = "";

  //   /* ------------------------------------------------------------------ */
  //   /*  Chief Complaint                                                   */
  //   /* ------------------------------------------------------------------ */

  //   // a) From narrative
  //   let shortCC = extractMainSymptomFromText(combinedSummary);

  //   // b) From JSON if needed
  //   if (!shortCC && consultReport && typeof consultReport === "object") {
  //     const ccFromJson = deepFind(consultReport, "🩺 CHIEF COMPLAINT");
  //     if (typeof ccFromJson === "string" && ccFromJson.trim()) {
  //       shortCC = ccFromJson.trim();
  //     }
  //   }

  //   // c) Other patterns
  //   if (!shortCC && combinedSummary) {
  //     const patternMatch =
  //       combinedSummary.match(/guidance on\s+([^.]{3,80})\./i) ||
  //       combinedSummary.match(/concern(?:ed)? about\s+([^.]{3,80})\./i) ||
  //       combinedSummary.match(/regarding\s+([^.]{3,80})\./i);

  //     if (patternMatch && patternMatch[1]) {
  //       shortCC = patternMatch[1].trim();
  //     }
  //   }

  //   // d) Fallback from first sentence
  //   if (!shortCC && combinedSummary) {
  //     let firstSentence = combinedSummary.split("\n")[0] || "";

  //     firstSentence = firstSentence.replace(/Thank you[^.]*\./i, "").trim();
  //     firstSentence = firstSentence
  //       .replace(/^(I\s+understand|I\s+see|Okay|Ok|Alright)[^.]*\./i, "")
  //       .trim();

  //     if (patientInfo.name) {
  //       const safeName = patientInfo.name.replace(
  //         /[-/\\^$*+?.()|[\]{}]/g,
  //         "\\$&"
  //       );
  //       const nameRegex = new RegExp("^" + safeName + "[^a-zA-Z]+", "i");
  //       firstSentence = firstSentence.replace(nameRegex, "").trim();
  //     }

  //     firstSentence = firstSentence.replace(
  //       /\b(a|the)?\s*\d+\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b[, ]*/i,
  //       ""
  //     );
  //     firstSentence = firstSentence.replace(
  //       /\b(is experiencing|is having|is suffering from|is dealing with|has)\b\s*/i,
  //       ""
  //     );

  //     const cutAt = Math.min(
  //       ...["which", "that"].map((w) => {
  //         const i = firstSentence.toLowerCase().indexOf(w + " ");
  //         return i === -1 ? Infinity : i;
  //       })
  //     );
  //     if (cutAt !== Infinity) firstSentence = firstSentence.slice(0, cutAt);

  //     const commaIdx = firstSentence.indexOf(",");
  //     if (commaIdx !== -1) firstSentence = firstSentence.slice(0, commaIdx);

  //     firstSentence = firstSentence.trim();

  //     if (firstSentence.length && firstSentence.length <= 80) {
  //       shortCC =
  //         firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  //     }
  //   }

  //   if (
  //     !shortCC ||
  //     /^(i understand|i see|okay|ok|alright)$/i.test(shortCC.trim())
  //   ) {
  //     shortCC = "Main symptom from consult summary";
  //   }

  //   /* ------------------------------------------------------------------ */
  //   /*  Associated Symptoms (ROS)                                         */
  //   /* ------------------------------------------------------------------ */
  //   const { chips: rosChips, note: rosNote } =
  //     extractRosFromSummary(combinedSummary);

  //   /* ------------------------------------------------------------------ */
  //   /*  Build unified chatData payload                                    */
  //   /* ------------------------------------------------------------------ */
  //   const consultationData = {
  //     conditions: parsedSummary.conditions,
  //     confidence: parsedSummary.confidence,
  //     narrativeSummary: displaySummary || consultSummary,
  //     selfCareText,
  //     vitalsData,
  //     hpi: {},
  //     associatedSymptomsChips: rosChips,
  //     associatedSymptomsNote: rosNote || undefined,
  //     chiefComplaint: shortCC,
  //      stripFollowupLines: true,
  //   };

  //   return { consultationData, patientInfo };
  // };
const buildPdfPayload = () => {
  if (!consultSummary) {
    console.warn("❌ No consultSummary available");
    return null;
  }

  console.log("📝 Building PDF payload for Doctor Report...");
  
  // Use both cleaned and raw text as sources
  const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""}`.trim();

  // ------------------------------------------------------------------
  // ADD THIS FUNCTION: Extract current issue data from summary
  // ------------------------------------------------------------------
  const extractCurrentIssueFromSummary = (text) => {
    if (!text) return null;
    
    const currentIssue = {
      primarySymptom: "Not specified",
      onset: "Not specified",
      pattern: "Not specified",
      severity: "Not specified",
      recentInjury: "No",
      associatedFactors: "None reported"
    };
    
    // Extract primary symptom - try to find the main complaint
    const symptomKeywords = ['headache', 'pain', 'fever', 'cough', 'sore throat', 'nausea', 
                            'fatigue', 'dizziness', 'shortness of breath', 'chest pain'];
    
    for (const keyword of symptomKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        // Try to get the full phrase
        const regex = new RegExp(`([^.!?]*${keyword}[^.!?]*[.!?])`, 'i');
        const match = text.match(regex);
        if (match) {
          currentIssue.primarySymptom = match[0].trim();
          break;
        } else {
          currentIssue.primarySymptom = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        }
      }
    }
    
    // If no symptom found, use the first sentence
    if (currentIssue.primarySymptom === "Not specified") {
      const firstSentence = text.split(/[.!?]/)[0].trim();
      if (firstSentence.length > 10) {
        currentIssue.primarySymptom = firstSentence;
      }
    }
    
    // Extract onset time
    const onsetPatterns = [
      /(\d+)\s+(day|week|month|hour)s?\s+ago/i,
      /(?:since|for)\s+(\d+)\s+(day|week|month|hour)/i,
      /(?:onset|started|began)\s+(?:about|approximately)?\s*(\d+)\s+(day|week|month|hour)/i,
      /last\s+(night|evening|morning|afternoon|week|month)/i,
      /yesterday/i,
      /today/i
    ];
    
    for (const pattern of onsetPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (pattern.toString().includes('last')) {
          currentIssue.onset = `Last ${match[1]}`;
        } else if (match[0].toLowerCase() === 'yesterday') {
          currentIssue.onset = "Yesterday";
        } else if (match[0].toLowerCase() === 'today') {
          currentIssue.onset = "Today";
        } else {
          const num = match[1];
          const unit = match[2];
          currentIssue.onset = `Approximately ${num} ${unit}${parseInt(num) > 1 ? 's' : ''} ago`;
        }
        break;
      }
    }
    
    // Extract pattern (persistent vs intermittent)
    if (text.toLowerCase().includes('constant') || 
        text.toLowerCase().includes('persistent') || 
        text.toLowerCase().includes('continuous')) {
      currentIssue.pattern = "Constant";
    } else if (text.toLowerCase().includes('intermittent') || 
               text.toLowerCase().includes('comes and goes') || 
               text.toLowerCase().includes('on and off')) {
      currentIssue.pattern = "Intermittent";
    } else if (text.toLowerCase().includes('worse') && text.toLowerCase().includes('better')) {
      currentIssue.pattern = "Waxing and waning";
    }
    
    // Extract severity/pain score
    const severityPatterns = [
      /(\d+(?:\.\d+)?)\s*\/\s*10/i,
      /pain\s*(?:level|score|scale)?\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
      /severity\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
      /(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i
    ];
    
    for (const pattern of severityPatterns) {
      const match = text.match(pattern);
      if (match) {
        currentIssue.severity = `${match[1]} / 10`;
        break;
      }
    }
    
    // If no numeric severity found, look for descriptive terms
    if (currentIssue.severity === "Not specified") {
      if (text.toLowerCase().includes('mild')) {
        currentIssue.severity = "Mild (2-3/10)";
      } else if (text.toLowerCase().includes('moderate')) {
        currentIssue.severity = "Moderate (4-6/10)";
      } else if (text.toLowerCase().includes('severe') || text.toLowerCase().includes('severe')) {
        currentIssue.severity = "Severe (7-9/10)";
      }
    }
    
    // Check for injury mention
    const injuryKeywords = ['injury', 'trauma', 'fell', 'fall', 'accident', 'hit', 'struck', 'injured'];
    for (const keyword of injuryKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        currentIssue.recentInjury = "Yes";
        break;
      }
    }
    
    // Check for associated factors
    const associatedFactors = [];
    
    // Light sensitivity
    if (text.toLowerCase().includes('light') || 
        text.toLowerCase().includes('bright') || 
        text.toLowerCase().includes('photophobia') ||
        text.toLowerCase().includes('sensitivity to light')) {
      associatedFactors.push("Light sensitivity");
    }
    
    // Sound sensitivity
    if (text.toLowerCase().includes('sound') || 
        text.toLowerCase().includes('noise') || 
        text.toLowerCase().includes('phonophobia')) {
      associatedFactors.push("Sound sensitivity");
    }
    
    // Nausea/vomiting
    if (text.toLowerCase().includes('nausea') || text.toLowerCase().includes('vomit')) {
      associatedFactors.push("Nausea");
    }
    
    // Fever/chills
    if (text.toLowerCase().includes('fever') || text.toLowerCase().includes('chill')) {
      associatedFactors.push("Fever/chills");
    }
    
    // Movement related
    if (text.toLowerCase().includes('move') && text.toLowerCase().includes('worse')) {
      associatedFactors.push("Worse with movement");
    }
    
    if (associatedFactors.length > 0) {
      currentIssue.associatedFactors = associatedFactors.join(", ");
    }
    
    return currentIssue;
  };
  
  // Extract current issue data
  const currentIssueData = extractCurrentIssueFromSummary(combinedSummary);
  console.log("📋 Extracted current issue data:", currentIssueData);

  // ------------------------------------------------------------------
  // 1️⃣ PATIENT INFORMATION - Extract from both sources
  // ------------------------------------------------------------------
  const { name: nameFromSummary, age: ageFromSummary, gender: genderFromSummary } = 
    extractDemographicsFromSummary(combinedSummary);

  let patientInfo = {
    name: nameFromSummary || null,
    age: ageFromSummary || null,
    gender: genderFromSummary || null,
    consultDate: summaryCreatedAt
      ? summaryCreatedAt.toLocaleDateString()
      : new Date().toLocaleDateString(),
  };

  // Helper to safely search nested JSON
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

  // Initialize JSON structure
  let jsonData = {
    patient_identity_baseline: {},
    chief_complaint: {},
    history_of_present_illness_hpi: {},
    medical_background: {},
    vital_signs_current_status: {},
    lifestyle_risk_factors: {},
    exposure_environment: {},
    functional_status: {},
    review_of_systems_traffic_light_view: {},
    ai_clinical_assessment: {}
  };

  // 🔹 Extract from JSON report if available
  if (consultReport && typeof consultReport === "object") {
    console.log("📊 Extracting from JSON report:", consultReport);
    
    // Merge JSON data
    jsonData = {
      ...jsonData,
      ...consultReport
    };
  }

  // ------------------------------------------------------------------
  // 2️⃣ ENHANCE DATA WITH EXTRACTED INFO
  // ------------------------------------------------------------------
  
  // Patient Identity Baseline
  jsonData.patient_identity_baseline = {
    name: jsonData.patient_identity_baseline?.name || 
          deepFind(jsonData, "name") || 
          nameFromSummary || 
          "User",
    age: jsonData.patient_identity_baseline?.age || 
         deepFind(jsonData, "age") || 
         ageFromSummary || 
         "",
    biological_sex: jsonData.patient_identity_baseline?.biological_sex || 
                   deepFind(jsonData, "biological_sex") || 
                   deepFind(jsonData, "gender") || 
                   genderFromSummary || 
                   "",
    weight: jsonData.patient_identity_baseline?.weight || 
            deepFind(jsonData, "weight") || 
            deepFind(jsonData, "Weight") || 
            "Not specified",
    height: jsonData.patient_identity_baseline?.height || 
            deepFind(jsonData, "height") || 
            deepFind(jsonData, "Height") || 
            "Not specified"
  };

  // Chief Complaint
  const extractedCC = extractMainSymptomFromText(combinedSummary);
  jsonData.chief_complaint = {
    primary_concern: jsonData.chief_complaint?.primary_concern || 
                     deepFind(jsonData, "primary_concern") || 
                     deepFind(jsonData, "chief_complaint") || 
                     extractedCC || 
                     (currentIssueData?.primarySymptom || "Not specified"), // Use current issue data as fallback
    onset: jsonData.chief_complaint?.onset || 
           deepFind(jsonData, "onset") || 
           (currentIssueData?.onset || "Not specified"), // Use current issue data as fallback
    duration: jsonData.chief_complaint?.duration || 
              deepFind(jsonData, "duration") || 
              "Not specified",
    previous_episodes: jsonData.chief_complaint?.previous_episodes || 
                       deepFind(jsonData, "previous_episodes") || 
                       "None reported"
  };

  // HPI - Use current issue data to enhance this section
  jsonData.history_of_present_illness_hpi = {
    location_or_system: jsonData.history_of_present_illness_hpi?.location_or_system || 
                        deepFind(jsonData, "location") || 
                        "General-systems",
    severity_0_to_10: jsonData.history_of_present_illness_hpi?.severity_0_to_10 || 
                      (currentIssueData?.severity ? 
                        currentIssueData.severity.replace(/[^0-9.]/g, '').split('/')[0] : 
                        null) ||
                      deepFind(jsonData, "severity") || 
                      null,
    progression_pattern: jsonData.history_of_present_illness_hpi?.progression_pattern || 
                         (currentIssueData?.pattern || "Recent onset"),
    associated_symptoms: jsonData.history_of_present_illness_hpi?.associated_symptoms || 
                         (currentIssueData?.associatedFactors ? 
                           [currentIssueData.associatedFactors] : []) ||
                         (deepFind(jsonData, "associated_symptoms") ? 
                           Array.isArray(deepFind(jsonData, "associated_symptoms")) 
                             ? deepFind(jsonData, "associated_symptoms")
                             : [deepFind(jsonData, "associated_symptoms")] 
                           : []),
    relieving_factors: jsonData.history_of_present_illness_hpi?.relieving_factors || null,
    worsening_factors: jsonData.history_of_present_illness_hpi?.worsening_factors || null
  };

  // Medical Background
  jsonData.medical_background = {
    chronic_illnesses: jsonData.medical_background?.chronic_illnesses || 
                       deepFind(jsonData, "chronic_conditions") || 
                       deepFind(jsonData, "chronicIllnesses") || 
                       "None reported",
    previous_surgeries: jsonData.medical_background?.previous_surgeries || null,
    current_medications: jsonData.medical_background?.current_medications || 
                         deepFind(jsonData, "currentMedications") || 
                         "None reported",
    drug_allergies: jsonData.medical_background?.drug_allergies || 
                    deepFind(jsonData, "allergies") || 
                    "None reported",
    family_history: jsonData.medical_background?.family_history || null,
    pregnancy_status: jsonData.medical_background?.pregnancy_status || "Not_applicable"
  };

  // Vital Signs
  jsonData.vital_signs_current_status = {
    heart_rate_bpm: jsonData.vital_signs_current_status?.heart_rate_bpm || 
                    (vitalsData?.heartRate ? `${vitalsData.heartRate}` : null),
    oxygen_saturation_spo2_percent: jsonData.vital_signs_current_status?.oxygen_saturation_spo2_percent || 
                                    (vitalsData?.spo2 ? `${vitalsData.spo2}` : null),
    core_temperature: jsonData.vital_signs_current_status?.core_temperature || 
                      (vitalsData?.temperature ? `${vitalsData.temperature}` : null),
    reported_fever: jsonData.vital_signs_current_status?.reported_fever || 
                    (vitalsData?.hasFever ? "Yes" : "No"),
    blood_pressure: jsonData.vital_signs_current_status?.blood_pressure || "Not measured",
    blood_pressure_measured: jsonData.vital_signs_current_status?.blood_pressure_measured || "No",
    temperature_measured: jsonData.vital_signs_current_status?.temperature_measured || "Yes"
  };

  // Lifestyle Factors
  jsonData.lifestyle_risk_factors = {
    smoking: jsonData.lifestyle_risk_factors?.smoking || 
             deepFind(jsonData, "smoking") || 
             "No",
    alcohol_use: jsonData.lifestyle_risk_factors?.alcohol_use || 
                 deepFind(jsonData, "alcoholUse") || 
                 "No",
    recreational_drugs: jsonData.lifestyle_risk_factors?.recreational_drugs || "No",
    diet: jsonData.lifestyle_risk_factors?.diet || "Normal",
    exercise_routine: jsonData.lifestyle_risk_factors?.exercise_routine || "Not specified",
    stress_level: jsonData.lifestyle_risk_factors?.stress_level || "Mild"
  };

  // Exposure & Environment
  jsonData.exposure_environment = {
    recent_travel: jsonData.exposure_environment?.recent_travel || "No",
    sick_contacts: jsonData.exposure_environment?.sick_contacts || "No",
    crowded_events: jsonData.exposure_environment?.crowded_events || "No",
    workplace_chemical_exposure: jsonData.exposure_environment?.workplace_chemical_exposure || "No",
    weather_exposure: jsonData.exposure_environment?.weather_exposure || "None",
    food_water_hygiene_concern: jsonData.exposure_environment?.food_water_hygiene_concern || "No"
  };

  // Functional Status
  jsonData.functional_status = {
    eating_drinking_normally: jsonData.functional_status?.eating_drinking_normally || "Yes",
    hydration: jsonData.functional_status?.hydration || "Adequate",
    activity_level: jsonData.functional_status?.activity_level || "Normal"
  };

  // Review of Systems
  const { chips: rosChips } = extractRosFromSummary(combinedSummary);
  jsonData.review_of_systems_traffic_light_view = {
    shortness_of_breath: {
      present: false,
      answer: rosChips.some(chip => chip.toLowerCase().includes('breath')) ? "No" : "Unknown",
      flag_level: "green"
    },
    chest_pain: {
      present: false,
      answer: rosChips.some(chip => chip.toLowerCase().includes('chest')) ? "No" : "Unknown",
      flag_level: "green"
    },
    sore_throat: {
      present: false,
      answer: rosChips.some(chip => chip.toLowerCase().includes('throat')) ? "No" : "Unknown",
      flag_level: "green"
    },
    body_aches_fatigue: {
      present: false,
      answer: rosChips.some(chip => chip.toLowerCase().includes('ache') || chip.toLowerCase().includes('fatigue')) ? "No" : "Unknown",
      flag_level: "green"
    },
    vomiting_diarrhea: {
      present: false,
      answer: rosChips.some(chip => chip.toLowerCase().includes('vomit') || chip.toLowerCase().includes('diarrhea')) ? "No" : "Unknown",
      flag_level: "green"
    }
  };

  // AI Clinical Assessment
  const { selfCare } = splitOutSelfCare(consultSummary || "");
  jsonData.ai_clinical_assessment = {
    overall_stability: jsonData.ai_clinical_assessment?.overall_stability || "Stable",
    red_flag_symptoms: jsonData.ai_clinical_assessment?.red_flag_symptoms || "None identified",
    clinical_note_to_physician: jsonData.ai_clinical_assessment?.clinical_note_to_physician || 
                                deepFind(jsonData, "clinicalAssessment") || 
                                displaySummary || 
                                "Clinical assessment based on patient-reported symptoms."
  };

  // Final defaults for patient info
  if (!patientInfo.name) patientInfo.name = jsonData.patient_identity_baseline.name || "User";
  if (!patientInfo.age) patientInfo.age = jsonData.patient_identity_baseline.age || "";
  if (!patientInfo.gender) patientInfo.gender = jsonData.patient_identity_baseline.biological_sex || "";

  // ------------------------------------------------------------------
  // 3️⃣ BUILD FINAL CONSULTATION DATA
  // ------------------------------------------------------------------
  const consultationData = {
    // Include all JSON data
    ...jsonData,
    
    // Patient info for PDF header
    patientName: patientInfo.name,
    patientAge: patientInfo.age,
    patientGender: patientInfo.gender,
    consultDate: patientInfo.consultDate,
    
    // ADD THIS: Current issue data
    currentIssueData: currentIssueData || {
      primarySymptom: jsonData.chief_complaint?.primary_concern || "Not specified",
      onset: jsonData.chief_complaint?.onset || "Not specified",
      pattern: jsonData.history_of_present_illness_hpi?.progression_pattern || "Constant",
      severity: jsonData.history_of_present_illness_hpi?.severity_0_to_10 ? 
                `${jsonData.history_of_present_illness_hpi.severity_0_to_10} / 10` : 
                "Not specified",
      recentInjury: "No",
      associatedFactors: jsonData.history_of_present_illness_hpi?.associated_symptoms?.join(", ") || "None reported"
    },
    
    // Additional clinical data
    conditions: parsedSummary.conditions || [],
    confidence: parsedSummary.confidence || null,
    narrativeSummary: displaySummary || consultSummary || "",
    selfCareText: selfCare || selfCareText || "",
    vitalsData: vitalsData || {},
    chiefComplaint: jsonData.chief_complaint.primary_concern,
    
    // Associated symptoms
    associatedSymptomsChips: rosChips,
    associatedSymptomsNote: extractRosFromSummary(combinedSummary).note,
    
    // Flags
    stripFollowupLines: true,
    includeComprehensiveData: true
  };

  console.log("✅ Built Doctor Report PDF payload:", {
    patientInfo,
    hasJSONData: !!consultationData.patient_identity_baseline,
    chiefComplaint: consultationData.chief_complaint,
    conditionsCount: consultationData.conditions?.length,
    currentIssueData: consultationData.currentIssueData // Log current issue data
  });

  return { consultationData, patientInfo };
};

  const handleDownloadPatientSummaryPDF = () => {
    const payload = buildPdfPayload();
    if (!payload) return;
    const { consultationData, patientInfo } = payload;

    downloadPatientSummaryFromChatData(
      consultationData,
      patientInfo,
      `Cira_Patient_Summary_${Date.now()}.pdf`
    );
  };

// const handleDownloadDoctorReportPDF = () => {
//   const payload = buildPdfPayload();
//   if (!payload) return;

//   const { consultationData, patientInfo } = payload;
//   downloadSOAPFromChatData(
//     consultationData,
//     patientInfo,
//     `Cira_Consult_Report_${Date.now()}.pdf`
//   );
// };

const handleDownloadDoctorReportPDF = () => {
  console.log("🏥 Downloading NEW Doctor Clinical Report...");
  console.log("📊 consultReport data:", consultReport); // Check if this exists
  console.log("📊 consultationSummary:", consultSummary); // Check raw summary
  
  const payload = buildPdfPayload();
  if (!payload) {
    console.warn("❌ No payload available for doctor report");
    return;
  }
  
  const { consultationData, patientInfo } = payload;
  
  console.log("📋 consultationData to send:", consultationData);
  console.log("📋 Does it have clinicalSummary?", consultationData.clinicalSummary);
  
  // Call the NEW function
  downloadDoctorsReport(
    consultationData,
    patientInfo,
    `CIRA_Clinical_Intake_Report_${Date.now()}.pdf`
  );
};

  const handleDownloadEHRSOAPPDF = () => {
    const payload = buildPdfPayload();
    if (!payload) return;
    const { consultationData, patientInfo } = payload;

    downloadEHRSOAPFromChatData(
      consultationData,
      patientInfo,
      `Cira_SOAP_Note_${Date.now()}.pdf`
    );
  };





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
                      <div className="w-15 h-15 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold">
                        <img src={stars} className="w-9 h-9" alt="stars" />
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
                        className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
                          }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`px-4 py-4 text-sm ${isAssistant
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

                      {/* Primary actions */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        {/* Download Reports dropdown */}
                        <div className="relative flex-1" ref={downloadMenuRef}>
                          <button
                            type="button"
                            onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                            className="w-full inline-flex items-center justify-between px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
                          >
                            <span>Download Reports</span>
                            {/* simple chevron */}
                            <svg
                              className={`w-4 h-4 ml-2 transition-transform ${isDownloadMenuOpen ? "rotate-180" : ""
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
                            <div
                              className="
      absolute z-20 mt-2 w-full rounded-xl border border-gray-200
      bg-white shadow-xl text-sm overflow-hidden
      divide-y divide-gray-100
    "
                            >
                              <button
                                type="button"
                                className="
        group w-full flex items-center justify-between
        px-4 py-2.5
        hover:bg-purple-50 hover:text-purple-700
        active:bg-purple-100
        transition-colors
      "
                                onClick={() => {
                                  setIsDownloadMenuOpen(false);
                                  handleDownloadPatientSummaryPDF();
                                }}
                              >
                                <span className="group-hover:underline">Patient Summary (PDF)</span>
                              </button>

                              <button
                                type="button"
                                className="
        group w-full flex items-center justify-between
        px-4 py-2.5
        hover:bg-purple-50 hover:text-purple-700
        active:bg-purple-100
        transition-colors
      "
                                onClick={() => {
                                  setIsDownloadMenuOpen(false);
                                  handleDownloadDoctorReportPDF(); // doctor clinical report
                                }}
                              >
                                <span className="group-hover:underline">Doctor Clinical Report (PDF)</span>
                              </button>

                              <button
                                type="button"
                                className="
        group w-full flex items-center justify-between
        px-4 py-2.5
        hover:bg-purple-50 hover:text-purple-700
        active:bg-purple-100
        transition-colors
      "
                                onClick={() => {
                                  setIsDownloadMenuOpen(false);
                                  handleDownloadEHRSOAPPDF(); // SOAP / EHR note
                                }}
                              >
                                <span className="group-hover:underline">SOAP / EHR Note (PDF)</span>
                              </button>
                            </div>
                          )}

                        </div>

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
                    <button
                      type="button"
                      className="underline text-pink-500"
                      onClick={() => navigate('/terms')}
                    >
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

      {/* Modals with overlay – block background interaction */}
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
                condition={
                  doctorRecommendationData?.condition ||
                  "your health concerns"
                }
                recommendedSpecialty={
                  doctorRecommendationData?.specialty ||
                  "General Physician"
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

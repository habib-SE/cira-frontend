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

import { downloadSOAPFromChatData } from "../utils/clinicalReport/pdfGenerator";

const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

/* ------------------------------------------------------------------ */
/*  Helpers: parsing summary / report                                 */
/* ------------------------------------------------------------------ */

// 🔎 Helper to extract conditions + confidence from plain summary text (fallback)
// 🔎 Helper to extract conditions + confidence from plain summary text (fallback)
export function parseConditionsAndConfidence(summary) {
  if (!summary || typeof summary !== "string") {
    return { conditions: [], confidence: null };
  }

  let confidence = null;
  const conditions = [];
  const usedNames = new Set();

  /* -----------------------------
     ✅ CONFIDENCE EXTRACTOR
  ----------------------------- */

  const confidencePatterns = [
    /\babout\s*(\d{1,3})\s*%/i,
    /\bconfidence[^0-9]*(\d{1,3})\s*%/i,
    /\bAI\s*confidence[^0-9]*(\d{1,3})\s*%/i,
    /\bconfidence\s*level[^0-9]*(\d{1,3})\s*%/i,
    /\bI’m\s*about\s*(\d{1,3})\s*%\s*confident/i,
  ];

  for (const pat of confidencePatterns) {
    const match = summary.match(pat);
    if (match && match[1]) {
      const conf = Number(match[1]);
      if (!isNaN(conf) && conf <= 100) {
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
  ];

  const isJunk = (text) =>
    bannedWords.some(word => text.toLowerCase().includes(word));

  /* -----------------------------
     ✅ CONDITION PATTERNS
  ----------------------------- */

  const patterns = [
    // 1) 70% Condition
    /(\d{1,3})\s*%\s*([A-Za-z][A-Za-z ()\-]+)/g,

    // 2) Condition - 70%
    /([A-Za-z][A-Za-z ()\-]+)\s*[-–—]\s*(\d{1,3})\s*%/g,

    // 3) Condition (70%)
    /([A-Za-z][A-Za-z ()\-]+)\s*\(\s*(\d{1,3})\s*%\s*\)/g,

    // 4) Bullet format
    /[•*]\s*([A-Za-z][A-Za-z ()\-]+)\s*(\d{1,3})\s*%/g,

    // 5) Newline format:
    // Condition\n70%
    /([A-Za-z][A-Za-z ()\-]+)\s*\n\s*(\d{1,3})\s*%/g,
  ];

  /* -----------------------------
     ✅ RUN EXTRACTOR
  ----------------------------- */

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.exec(summary)) !== null) {
      let name, pct;

      // percent first format
      if (pattern.source.startsWith("(\\d")) {
        pct = Number(match[1]);
        name = match[2];
      } 
      // name first format
      else {
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

      // ❌ NEVER ALLOW CONFIDENCE TO BECOME CONDITION
      if (key.includes("confidence")) continue;

      if (!usedNames.has(key)) {
        usedNames.add(key);
        conditions.push({ name, percentage: pct });
      }
    }
  }

  /* -----------------------------
     ✅ HARSH FALLBACK MODE
     (if AI format is broken)
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

  /* -----------------------------
     ✅ SORT & RETURN
  ----------------------------- */

  return {
    conditions: conditions
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3),

    confidence,
  };
}






// 🧼 Helper to remove confidence sentence + raw condition lines from the summary
function stripTopConditionsFromSummary(summary) {
  if (!summary) return "";

  let cleaned = summary;

  // remove the confidence sentence that talks about "following possibilities/conditions"
  cleaned = cleaned.replace(
    /I\s+am[^.\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.\n]*:?/i,
    ""
  );

  // remove the whole "TOP 3 CONDITIONS (PROBABILITIES)" block,
  // but keep anything after it (e.g. SELF-CARE, DOCTOR RECOMMENDATION)
  cleaned = cleaned.replace(
    /TOP\s*\d*\s*CONDITIONS(?:\s*\(PROBABILITIES\))?\s*:\s*[\s\S]*?(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|For\s+(?:self-care|now|immediate relief)|DOCTOR RECOMMENDATION|Please book an appointment|Take care of yourself|$)/i,
    ""
  );

  // remove any standalone lines that start with "60%" style percentages
  cleaned = cleaned
    .split("\n")
    .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
    .join("\n");

  return cleaned.trim();
}


// 🧼 Helper to pull out the self-care paragraph and leave rest
function splitOutSelfCare(summary) {
  if (!summary) return { cleaned: "", selfCare: "" };

  // 1) new format: "SELF-CARE & WHEN TO SEEK HELP: For now, ..."
  const selfCareBlockRegex =
    /SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP\s*:?\s*(For[\s\S]*?)(?=DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/i;

  let match = summary.match(selfCareBlockRegex);
  if (match) {
    const selfCare = match[1].trim();
    const cleaned =
      (summary.slice(0, match.index) +
        summary.slice(match.index + match[0].length)).trim();
    return { cleaned, selfCare };
  }

  // 2) fallback: old format without the "SELF-CARE…" heading
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
// 🧹 Normalise condition labels (strip numbers / bullets / trailing dash)
function cleanConditionLabel(raw = "") {
  let s = String(raw || "").trim();

  // remove leading "1) ", "2) ", etc.
  s = s.replace(/^\d+\)\s*/, "");

  // remove leading bullets / dashes
  s = s.replace(/^[•\-–]+\s*/, "");

  // remove trailing dash-only
  s = s.replace(/\s*[–\-]\s*$/g, "");

  return s.trim();
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




// 🔎 Extract ROS chips + note from the summary
function extractRosFromSummary(text = "") {
  const chipsSet = new Set();
  if (!text) {
    return {
      chips: [],
      note:
        "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.",
    };
  }

  const addChip = (label) => {
    if (label) chipsSet.add(label);
  };

  // ----------------- CHIP PATTERNS -----------------
  // No treatments tried
  if (
    /(haven't|have not|hasn't|no)\s+(tried|taken|used)\s+(any\s+)?(treatments?|medications?|medicine|drugs|remedies)/i.test(
      text
    )
  ) {
    addChip("No treatments tried yet");
  }

  // No sick contacts
  if (
    /(haven't|have not|hasn't|no)\s+(been\s+)?(around|near|in contact with|exposed to)\s+(any(one)?\s+)?(who('s| is)?\s+)?(sick|ill|unwell)/i.test(
      text
    )
  ) {
    addChip("No sick contacts");
  }

  // No recent travel
  if (/(no|not|haven't|have not)\s+(recent\s+)?travel(led)?/i.test(text)) {
    addChip("No recent travel");
  }

  // "No other symptoms"
  if (/(no|without|denies)\s+other\s+symptoms/i.test(text)) {
    addChip("No other symptoms");
  }

  // No other medical conditions
  if (
    /(no|without|denies)\s+(other\s+)?(chronic\s+)?(medical|health)\s+conditions?/i.test(
      text
    )
  ) {
    addChip("No other medical conditions");
  }

  // No current medications
  if (/(no|without|denies)\s+(current\s+)?medications?/i.test(text)) {
    addChip("No current medications");
  }

  // No allergies
  if (
    /(no|without|denies)\s+(known\s+)?(drug|medication|medicine)?\s*allerg(y|ies)/i.test(
      text
    )
  ) {
    addChip("No known allergies");
  }

  // Not pregnant
  if (/(not pregnant|denies pregnancy|no possibility of pregnancy)/i.test(text)) {
    addChip("Not pregnant");
  }

  // Negative for chest pain
  if (/(no|denies|without)\s+chest pain/i.test(text)) {
    addChip("Negative for chest pain");
  }

  // Negative for shortness of breath
  if (
    /(no|denies|without)\s+(shortness of breath|difficulty breathing|trouble breathing)/i.test(
      text
    )
  ) {
    addChip("Negative for shortness of breath");
  }

  // If we still got nothing, but there is some "no symptoms" type phrase
  if (!chipsSet.size && /no (other )?symptoms?/i.test(text)) {
    addChip("No other symptoms");
  }

  // Limit to max 4 chips to keep the layout clean
  const chips = Array.from(chipsSet).slice(0, 4);

  // ----------------- NOTE SELECTION -----------------
  // Pick the first sentence that has strong negatives
  const sentences = text.split(/(?<=[.!?])\s+/);
  let rosNote = "";
  for (const s of sentences) {
    if (
      /(haven't|have not|hasn't|no other symptoms|no symptoms|denies|without|no recent travel|no sick contacts)/i.test(
        s
      )
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

  // const conversation = useConversation({
  //   textOnly: true,
  //   onConnect: () => {
  //     console.log("✅ Connected to chat_cira");
  //     setIsConnected(true);
  //     setError("");
  //   },
  //   onDisconnect: () => {
  //     console.log("🔌 Disconnected from chat_cira");
  //     setIsConnected(false);
  //   },
  //   onMessage: (payload) => {
  //     let text = "";
  //     let role = "unknown";

  //     if (typeof payload === "string") {
  //       text = payload;
  //     } else if (payload) {
  //       text =
  //         payload.message ||
  //         payload.text ||
  //         payload.formatted?.text ||
  //         payload.formatted?.transcript ||
  //         "";
  //       role = payload.role || payload.source || "unknown";
  //     }

  //     if (!text || !text.trim()) return;

  //     const isAssistant =
  //       role === "assistant" || role === "ai" || role === "agent";

  //     if (!isAssistant) {
  //       console.log("💬 Non-assistant message from SDK:", payload);
  //       return;
  //     }

  //     const trimmedText = text.trim();
  //     const lower = trimmedText.toLowerCase();

  //     const looksLikeSummary =
  //       lower.includes("please consider booking an appointment with a doctor") ||
  //       lower.includes("please book an appointment with a doctor") ||
  //       lower.includes("take care of yourself") ||
  //       trimmedText.length > 300;

  //     setIsThinking(false);

  //     if (looksLikeSummary) {
  //       console.log("📝 Captured consult summary.");

  //       const extracted = extractConsultDataFromMessage(trimmedText);

  //       setConsultSummary(extracted.summaryText);
  //       setSummaryCreatedAt(new Date());
  //       setConversationSummary(extracted.summaryText);
  //       setSummaryStats({
  //         conditions: extracted.conditions || [],
  //         confidence:
  //           typeof extracted.confidence === "number"
  //             ? extracted.confidence
  //             : null,
  //       });
  //       setConsultReport(extracted.report || null);

  //       return;
  //     }

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: nextId(),
  //         role: "assistant",
  //         text: trimmedText,
  //       },
  //     ]);
  //   },
  //   onError: (err) => {
  //     console.error("❌ ElevenLabs chat error:", err);
  //     setError("Something went wrong while talking to Cira. Please try again.");
  //     setIsThinking(false);
  //   },
  // });
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

    // const lower = trimmedText.toLowerCase();

    // const looksLikeSummary =
    //   lower.includes("please consider booking an appointment with a doctor") ||
    //   lower.includes("please book an appointment with a doctor") ||
    //   lower.includes("take care of yourself") ||
    //   trimmedText.length > 300;
const lower = trimmedText.toLowerCase();

// 🔐 Only treat as final consult summary when the closing lines appear
const looksLikeSummary =
  // your strict final line
  lower.includes(
    "please book an appointment with a doctor so you can make sure you’re getting the best care possible"
  ) ||
  lower.includes(
    "please book an appointment with a doctor so you can make sure you're getting the best care possible"
  ) ||
  // optional older wording if you still use it anywhere
  lower.includes("please consider booking an appointment with a doctor") ||
  lower.includes("please book an appointment with a doctor") ||
  // your final goodbye line
  lower.includes("take care of yourself, and i hope you feel better soon") ||
  lower.includes("take care of yourself 💙") ||
  // safety: if you ever include the JSON marker
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

      // 🔹 ALSO push this as the last assistant message in the chat
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: extracted.summaryText || trimmedText,
        },
      ]);

      return;
    }

    // Normal assistant message
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
      .replace(/^\s*CLINICAL SUMMARY\s*:?\s*[\r\n]?/im, "")
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
const handleDownloadPDF = () => {
  if (!consultSummary) return;

  // Use both cleaned and raw text as sources
  const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""}`.trim();

  // 1️⃣ Try to get demographics from the summary text
  const {
    name: nameFromSummary,
    age: ageFromSummary,
    gender: genderFromSummary,
  } = extractDemographicsFromSummary(combinedSummary);

  // Base info (will be completed/overridden below)
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

  // 1b️⃣ If an old CIRA_CONSULT_REPORT JSON is present, use it only
  // to fill *missing* fields (never overwrite summary-derived values).
  if (consultReport && typeof consultReport === "object") {
    const ptSection = deepFind(consultReport, "👤 PATIENT INFORMATION");
    if (ptSection && typeof ptSection === "object") {
      if (!patientInfo.name) {
        patientInfo.name =
          ptSection.Name || ptSection["Name"] || patientInfo.name;
      }
      if (!patientInfo.age) {
        patientInfo.age = ptSection.Age || patientInfo.age;
      }
      if (!patientInfo.gender) {
        patientInfo.gender =
          ptSection["Biological Sex"] ||
          ptSection["Sex"] ||
          patientInfo.gender;
      }
    }
  }

  // Final defaults (never leave undefined)
  if (!patientInfo.name) patientInfo.name = "User";
  if (!patientInfo.age) patientInfo.age = "";
  if (!patientInfo.gender) patientInfo.gender = "";

  // 2️⃣ Chief Complaint: prefer structured extraction from the narrative
  let shortCC = extractMainSymptomFromText(combinedSummary);

  // If not found, fall back to any JSON CC
  let chiefComplaintFromJson = null;
  if (consultReport && typeof consultReport === "object") {
    chiefComplaintFromJson = deepFind(consultReport, "🩺 CHIEF COMPLAINT");
  }
  if (!shortCC && typeof chiefComplaintFromJson === "string") {
    shortCC = chiefComplaintFromJson.trim();
  }

  // Last-resort CC: derive a compact phrase from first sentence
  if (!shortCC && combinedSummary) {
    let firstSentence = combinedSummary.split("\n")[0];

    // Remove generic intro like "Thank you for confirming, Habib."
    firstSentence = firstSentence.replace(/Thank you[^.]*\./i, "").trim();

    // Strip name + age/sex fragments
    if (patientInfo.name) {
      const safeName = patientInfo.name.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      const nameRegex = new RegExp("^" + safeName + "[^a-zA-Z]+", "i");
      firstSentence = firstSentence.replace(nameRegex, "").trim();
    }
    firstSentence = firstSentence.replace(
      /\b(a|the)?\s*\d+\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b[, ]*/i,
      ""
    );
    firstSentence = firstSentence.replace(
      /\b(is experiencing|is having|is suffering from|is dealing with|has)\b\s*/i,
      ""
    );

    const cutAt = Math.min(
      ...["which", "that"].map((w) => {
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

  // 3️⃣ Associated Symptoms (ROS) from the same narrative
  const { chips: rosChips, note: rosNote } =
    extractRosFromSummary(combinedSummary);

  // 4️⃣ Build the payload for the PDF generator
  const consultationData = {
    conditions: parsedSummary.conditions,
    confidence: parsedSummary.confidence,
    narrativeSummary: displaySummary || consultSummary,
    selfCareText,
    vitalsData,
    hpi: {},
    associatedSymptomsChips: rosChips,
    associatedSymptomsNote: rosNote || undefined,
    chiefComplaint: shortCC,
  };

  // 5️⃣ Generate & download PDF
  downloadSOAPFromChatData(
    consultationData,
    patientInfo,
    `Cira_Consult_Report_${Date.now()}.pdf`
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

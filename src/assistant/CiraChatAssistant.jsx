// // File: src/assistant/CiraChatAssistant.jsx
// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useConversation } from "@11labs/react";
// import { motion, AnimatePresence } from "framer-motion";

// import AgentAvatar from "../assets/nurse.png";
// import ChatInput from "../components/landing/ChatInput";
// import Header from "../components/Header";
// import stars from "../assets/stars.svg";

// import VitalSignsDisplay from "./modal/VitalSignsDisplay";
// import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
// import PaymentModal from "./modal/PaymentModal";
// import AppointmentModal from "./modal/AppointmentModal";
// import BookingConfirmationModal from "./modal/BookingConfirmationModal";
// import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
// import FacialScanModal from "./modal/FacialScanModal";

// // import { downloadSOAPFromChatData } from "../utils/clinicalReport/pdfGenerator";

// import {
//   downloadSOAPFromChatData,
//   downloadPatientSummaryFromChatData,
//   downloadEHRSOAPFromChatData,
//   downloadDoctorsReport,
// } from "../utils/clinicalReport/pdfGenerator";

// const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// /* ------------------------------------------------------------------ */
// /*  Helpers: parsing summary / report                                 */
// /* ------------------------------------------------------------------ */

// export function parseConditionsAndConfidence(summary) {
//   if (!summary || typeof summary !== "string") {
//     return { conditions: [], confidence: null };
//   }

//   let confidence = null;
//   const conditions = [];
//   const usedNames = new Set();

//   /* -----------------------------
//      ✅ CONFIDENCE EXTRACTOR
//      Matches: "I'm about 85% confident in the following assessment."
//   ----------------------------- */

//   const confidencePatterns = [
//     /I(?:\s+am|['’]m)\s+about\s*(\d{1,3})\s*%\s*confident\s+in\s+the\s+following\s+assessment/i,
//     /\babout\s*(\d{1,3})\s*%[^.\n]*confident/i,
//     /\bconfidence[^0-9]*(\d{1,3})\s*%/i,
//   ];

//   for (const pat of confidencePatterns) {
//     const match = summary.match(pat);
//     if (match && match[1]) {
//       const conf = Number(match[1]);
//       if (!isNaN(conf) && conf > 0 && conf <= 100) {
//         confidence = conf;
//         break;
//       }
//     }
//   }

//   /* -----------------------------
//      ❌ JUNK FILTER
//   ----------------------------- */
//   const bannedWords = [
//     "confidence",
//     "confident",
//     "represents",
//     "assessment",
//     "analysis",
//     "estimate",
//     "likelihood",
//     "probability",
//     "overall",
//     "this represents",
//     "self-care",
//     "when to seek help",
//   ];

//   const isJunk = (text) =>
//     bannedWords.some((word) => text.toLowerCase().includes(word));

//   /* -----------------------------
//      ✅ PRIMARY: TOP 3 CONDITIONS BLOCK
//      Expects:

//      TOP 3 CONDITIONS (PROBABILITIES):
//      70% Viral upper respiratory infection
//      20% Early influenza
//      10% Early COVID
//   ----------------------------- */

//   const topBlockMatch = summary.match(
//     /TOP\s*3\s*CONDITIONS\s*\(PROBABILITIES\)\s*:\s*([\s\S]*?)(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|$)/i
//   );

//   if (topBlockMatch) {
//     const block = topBlockMatch[1];

//     block
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean)
//       .forEach((line) => {
//         // 70% Condition name
//         const m = line.match(/(\d{1,3})\s*%\s*(.+)$/);
//         if (!m) return;

//         const pct = Number(m[1]);
//         let name = m[2]
//           .replace(/[\r\n]+/g, " ")
//           .replace(/\s{2,}/g, " ")
//           .replace(/[-–—]+$/, "")
//           .trim();

//         if (!name || isNaN(pct) || pct <= 0 || pct > 100) return;
//         if (isJunk(name)) return;

//         const key = name.toLowerCase();
//         if (key.includes("confidence")) return;

//         if (!usedNames.has(key)) {
//           usedNames.add(key);
//           conditions.push({ name, percentage: pct });
//         }
//       });
//   }

//   /* -----------------------------
//      🔁 FALLBACK: old flexible patterns
//      (in case AI slightly breaks the format)
//   ----------------------------- */

//   if (conditions.length < 3) {
//     const patterns = [
//       // 1) 70% Condition
//       /(\d{1,3})\s*%\s*([A-Za-z][A-Za-z ()\-]+)/g,
//       // 2) Condition - 70%
//       /([A-Za-z][A-Za-z ()\-]+)\s*[-–—]\s*(\d{1,3})\s*%/g,
//       // 3) Condition (70%)
//       /([A-Za-z][A-Za-z ()\-]+)\s*\(\s*(\d{1,3})\s*%\s*\)/g,
//     ];

//     for (const pattern of patterns) {
//       let match;

//       while ((match = pattern.exec(summary)) !== null) {
//         let name, pct;

//         if (pattern.source.startsWith("(\\d")) {
//           pct = Number(match[1]);
//           name = match[2];
//         } else {
//           name = match[1];
//           pct = Number(match[2]);
//         }

//         name = name
//           .replace(/[\r\n]+/g, " ")
//           .replace(/\s{2,}/g, " ")
//           .replace(/[-–—]+$/, "")
//           .trim();

//         if (!name || isNaN(pct)) continue;
//         if (pct < 1 || pct > 100) continue;
//         if (isJunk(name)) continue;

//         const key = name.toLowerCase();
//         if (key.includes("confidence")) continue;

//         if (!usedNames.has(key)) {
//           usedNames.add(key);
//           conditions.push({ name, percentage: pct });
//         }
//       }
//     }
//   }

//   /* -----------------------------
//      ✅ SUPER LOOSE FALLBACK
//   ----------------------------- */

//   if (conditions.length < 3) {
//     const loose = summary.matchAll(/(\d{1,3})\s*%\s*([A-Za-z][A-Za-z ()\-]+)/g);

//     for (const match of loose) {
//       if (conditions.length >= 3) break;

//       const pct = Number(match[1]);
//       const name = match[2].trim();
//       const key = name.toLowerCase();

//       if (
//         !usedNames.has(key) &&
//         pct <= 100 &&
//         !isNaN(pct) &&
//         !isJunk(name) &&
//         !key.includes("confidence")
//       ) {
//         usedNames.add(key);
//         conditions.push({ name, percentage: pct });
//       }
//     }
//   }

//   return {
//     conditions: conditions
//       .sort((a, b) => b.percentage - a.percentage)
//       .slice(0, 3),
//     confidence,
//   };
// }


// function stripTopConditionsFromSummary(summary) {
//   if (!summary) return "";

//   let cleaned = summary;

//   // 1️⃣ Remove the OLD style confidence sentence
//   //    (the new one "in the following assessment" we KEEP)
//   cleaned = cleaned.replace(
//     /I(?:\s+am|['’]m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.!\n]*[:.]?/gi,
//     ""
//   );

//   // 2️⃣ Remove the whole "TOP 3 CONDITIONS (PROBABILITIES)" block
//   cleaned = cleaned.replace(
//     /TOP\s*\d*\s*CONDITIONS(?:\s*\(PROBABILITIES\))?\s*:\s*[\s\S]*?(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|For\s+(?:self-care|now|immediate relief)|DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/gi,
//     ""
//   );

//   // 3️⃣ Remove any "CLINICAL POSSIBILITIES" diagnostic list
//   cleaned = cleaned.replace(
//     /CLINICAL\s+POSSIBILITIES[\s\S]*?(?=CLINICAL\s+PLAN\s*&\s*DISPOSITION|For\s+self-care|For\s+now|AI assessment confidence|$)/gi,
//     ""
//   );

//   // 4️⃣ Remove standalone lines that start with "60%" style percentages
//   cleaned = cleaned
//     .split("\n")
//     .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
//     .join("\n");

//   return cleaned.trim();
// }


// function splitOutSelfCare(summary) {
//   if (!summary) return { cleaned: "", selfCare: "" };

//   // 1️⃣ New format with heading:
//   // SELF-CARE & WHEN TO SEEK HELP:
//   // For self-care, ...
//   // Based on the information you've shared, I recommend...
//   const selfCareBlockRegex =
//     /SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP\s*:?\s*(For[\s\S]*?)(?=DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/i;

//   let match = summary.match(selfCareBlockRegex);
//   if (match) {
//     const selfCare = match[1].trim(); // "For self-care, ..." + doctor recommendation line
//     const cleaned =
//       (summary.slice(0, match.index) +
//         summary.slice(match.index + match[0].length)).trim();
//     return { cleaned, selfCare };
//   }

//   // 2️⃣ Fallback: old format without heading
//   const pattern =
//     /(For\s+(?:self-care|now|immediate relief)[\s\S]*?)(?=\n\s*\n|DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/i;

//   match = summary.match(pattern);
//   if (!match) {
//     return { cleaned: summary.trim(), selfCare: "" };
//   }

//   const selfCare = match[1].trim();
//   const before = summary.slice(0, match.index);
//   const after = summary.slice(match.index + match[0].length);
//   const cleaned = (before + after).trim();

//   return { cleaned, selfCare };
// }



// // 🔎 Helper to extract CIRA_CONSULT_REPORT JSON + plain summary
// function extractConsultDataFromMessage(raw) {
//   if (!raw) {
//     return {
//       summaryText: "",
//       report: null,
//       conditions: [],
//       confidence: null,
//     };
//   }

//   let summaryText = raw;
//   let report = null;

//   // ----------------- split JSON from plain text -----------------
//   const jsonMatch = raw.match(/```json([\s\S]*?)```/i);
//   if (jsonMatch) {
//     const jsonText = jsonMatch[1].trim();
//     summaryText = raw.slice(0, jsonMatch.index).trim();

//     try {
//       const parsed = JSON.parse(jsonText);
//       report =
//         parsed.CIRA_CONSULT_REPORT ||
//         parsed["CIRA_CONSULT_REPORT"] ||
//         parsed;
//     } catch (e) {
//       console.warn("Failed to parse CIRA_CONSULT_REPORT JSON:", e);
//     }
//   }

//   summaryText = summaryText.replace(/```json|```/gi, "").trim();

//   // helper: base key for dedupe
//   const baseNameForDedup = (name) => {
//     let s = String(name || "").toLowerCase();
//     s = s.split(" – ")[0];
//     s = s.split(" - ")[0];
//     s = s.split("(")[0];
//     s = s.replace(/[^a-z0-9]+/g, "");
//     return s.trim();
//   };

//   const looksLikeNonCondition = (name) => {
//     const s = String(name || "");
//     return (
//       /medication|pharmacist|recommendation|disclaimer/i.test(s) ||
//       /self-care|when to seek help/i.test(s) || // 🚫 filter self-care
//       /💊|⚠️|‼️/.test(s)
//     );
//   };

//   let conditions = [];
//   let confidence = null;

//   // 1️⃣ Optional: conditions from JSON (we will override by summary later)
//   if (report && report["📊 PROBABILITY ESTIMATES"]) {
//     const prob = report["📊 PROBABILITY ESTIMATES"];
//     if (prob && typeof prob === "object") {
//       conditions = Object.entries(prob)
//         .map(([name, value]) => {
//           if (looksLikeNonCondition(name)) return null;
//           const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
//           if (Number.isNaN(num)) return null;
//           return { name, percentage: num };
//         })
//         .filter(Boolean);
//     }
//   }

//   // 2️⃣ Confidence from JSON if present
//   if (report && report["🤖 SYSTEM INFO"]) {
//     const info = report["🤖 SYSTEM INFO"];
//     if (info && info["Confidence Level"]) {
//       const m = String(info["Confidence Level"]).match(/(\d+)/);
//       if (m) confidence = Number(m[1]);
//     }
//   }

//   // 3️⃣ ALWAYS use conditions parsed from the summary text
//   const parsedFromSummary = parseConditionsAndConfidence(summaryText);
//   if (parsedFromSummary.conditions?.length) {
//     conditions = parsedFromSummary.conditions;
//   }

//   // 4️⃣ Confidence: fall back to summary if JSON didn't give one
//   if (confidence == null && parsedFromSummary.confidence != null) {
//     confidence = parsedFromSummary.confidence;
//   }

//   // 5️⃣ Final cleanup – remove any stray self-care rows & dedupe
//   conditions = (conditions || []).filter(
//     (c) => c && !looksLikeNonCondition(c.name)
//   );

//   if (conditions.length) {
//     const seen = new Set();
//     const deduped = [];
//     for (const c of conditions) {
//       const key = baseNameForDedup(c.name);
//       if (!key || seen.has(key)) continue;
//       seen.add(key);
//       deduped.push(c);
//     }

//     conditions = deduped
//       .filter((c) => typeof c.percentage === "number" && c.percentage > 0)
//       .sort((a, b) => b.percentage - a.percentage)
//       .slice(0, 3); // 🔒 exactly 3 items
//   }

//   return { summaryText, report, conditions, confidence };
// }


// // 🔎 Helper: normalize + dedupe conditions by name
// function normalizeConditionName(name = "") {
//   return String(name)
//     .toLowerCase()
//     .replace(/[-–—]+/g, " ")
//     .replace(/[^a-z0-9\s]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function dedupeConditions(conditions = []) {
//   const map = new Map();

//   for (const c of conditions) {
//     const rawName = (c && c.name) || "";
//     const norm = normalizeConditionName(rawName);

//     if (!norm || /^-+$/.test(rawName.trim())) continue;

//     const pct = typeof c.percentage === "number" ? c.percentage : 0;

//     if (!map.has(norm)) {
//       map.set(norm, { ...c, percentage: pct });
//     } else {
//       const existing = map.get(norm);
//       if (pct > (existing.percentage || 0)) {
//         map.set(norm, { ...c, percentage: pct });
//       }
//     }
//   }

//   return Array.from(map.values()).sort(
//     (a, b) => (b.percentage || 0) - (a.percentage || 0)
//   );
// }

// // 🩺 Short display name for conditions (UI only)
// function shortConditionName(name = "") {
//   const raw = String(name);
//   // cut at ":" or "(" to hide long explanation
//   const beforeColon = raw.split(":")[0];
//   const beforeParen = beforeColon.split("(")[0];
//   const trimmed = beforeParen.trim();
//   return trimmed || raw;
// }

// // 🔎 Extract a short main symptom label for Chief Complaint
// function extractMainSymptomFromText(text = "") {
//   const lower = text.toLowerCase();

//   const has = (re) => re.test(lower);
//   const not = (re) => !re.test(lower);

//   // Explicit "chief complaint" style sentences
//   const ccMatch = text.match(
//     /(chief complaint[^:]*:\s*)(.+?)(?:\.|\n|$)/i
//   );
//   if (ccMatch && ccMatch[2]) {
//     const cc = ccMatch[2].trim();
//     if (cc.length <= 80) return cc.charAt(0).toUpperCase() + cc.slice(1);
//   }

//   // Pattern: "is presenting with X", "complaining of X"
//   const presentMatch = text.match(
//     /\b(presenting with|complaining of|experiencing)\s+([^.\n]{5,80})/i
//   );
//   if (presentMatch && presentMatch[2]) {
//     let phrase = presentMatch[2].trim();
//     // cut at "that/which/since"
//     const cutWords = ["that", "which", "since", "for", "because"];
//     const lowerPhrase = phrase.toLowerCase();
//     let cutAt = Infinity;
//     cutWords.forEach((w) => {
//       const idx = lowerPhrase.indexOf(`${w} `);
//       if (idx !== -1 && idx < cutAt) cutAt = idx;
//     });
//     if (cutAt !== Infinity) phrase = phrase.slice(0, cutAt).trim();
//     if (phrase.length <= 80) {
//       return phrase.charAt(0).toUpperCase() + phrase.slice(1);
//     }
//   }

//   // Fall back to keyword-based mapping
//   if (has(/\bheadache(s)?\b/i) && not(/no headache/i)) return "Headache";
//   if (has(/\bback pain\b/i) && not(/no back pain/i)) return "Back pain";
//   if (has(/\babdominal pain\b|\bstomach pain\b|\bbelly pain\b/i) && not(/no abdominal pain/i))
//     return "Abdominal pain";
//   if (has(/\bchest pain\b/i) && not(/no chest pain/i)) return "Chest pain";
//   if (has(/\bshortness of breath\b|\bdifficulty breathing\b|\bbreathlessness\b/i) && not(/no shortness of breath/i))
//     return "Shortness of breath";

//   // Fever logic
//   const feverPositive =
//     /(have|having|with|got|developed|presenting with)\s+(a\s+)?fever\b/i.test(
//       text
//     ) ||
//     /\bfever\b\s+(since|for)\b/i.test(text) ||
//     /\bfever\b\s*(and|with)\b/i.test(text);

//   if (feverPositive && not(/no fever|without fever|denies fever/i)) {
//     if (/\bbody aches?\b|\bgeneralized aches?\b/i.test(lower)) {
//       return "Fever with body aches";
//     }
//     return "Fever";
//   }

//   if (has(/\bsore throat\b/i) && not(/no sore throat/i)) return "Sore throat";

//   if (has(/\bnausea\b|\bvomiting\b/i) && not(/no nausea|no vomiting/i))
//     return "Nausea / vomiting";

//   if (has(/\bdiarrhea\b/i) && not(/no diarrhea/i)) return "Diarrhea";
//   if (has(/\brash\b/i) && not(/no rash/i)) return "Rash";

//   return "";
// }


// // 🔎 Guess the patient's most likely first name from the summary text
// function extractLikelyNameFromSummary(text = "") {
//   if (!text) return null;

//   // Capitalised words we should NEVER treat as names
//   const IGNORE = new Set([
//     "Thank",
//     "Thanks",
//     "Given",
//     "Based",
//     "Alright",
//     "Okay",
//     "Ok",
//     "Just",
//     "So",
//     "Since",
//     "Because",
//     "While",
//     "However",
//     "Although",
//     "This",
//     "That",
//     "There",
//     "Here",
//     "For",
//     "From",
//     "Please",
//     "Viral",
//     "Mild",
//     "Other",
//     "These",
//     "Those",
//     "Fever",
//     "Back",
//     "Abdominal",
//     "Chest",
//     "Headache",
//     "Cira",
//     "AI",
//     "Clinical",
//     "Your",
//     "Summary",
//     "Summarize",
//     "Summarised",
//     "Summarized",
//   ]);

//   const matches = text.match(/\b[A-Z][a-z]{2,}\b/g);
//   if (!matches) return null;

//   const counts = {};
//   for (const w of matches) {
//     if (IGNORE.has(w)) continue;
//     counts[w] = (counts[w] || 0) + 1;
//   }

//   let best = null;
//   let bestCount = 0;
//   for (const [w, c] of Object.entries(counts)) {
//     if (c > bestCount) {
//       best = w;
//       bestCount = c;
//     }
//   }

//   // Extra safety: never return "summarize"-like words
//   if (best && /summar/i.test(best)) return null;

//   return bestCount > 0 ? best : null;
// }

// // 🔎 Extract name + age + gender from the summary narrative
// function extractDemographicsFromSummary(text = "") {
//   if (!text) return { name: null, age: null, gender: null };

//   let name = null;
//   let age = null;
//   let gender = null;

//   const normalizeSex = (s) => {
//     const v = String(s || "").toLowerCase();
//     if (v === "female" || v === "woman") return "Female";
//     if (v === "male" || v === "man") return "Male";
//     return null;
//   };

//   let m;

//   // 0️⃣ Greeting style:
//   // "Alright, Habib." / "Hi Habib" / "Hello Ziko" etc.
//   m = text.match(
//     /\b(?:Hi|Hello|Hey|Salaam|Salam|Assalam|Alright|Okay|Ok)[,!\s]+([A-Z][a-z]{2,})\b/
//   );
//   if (m) {
//     name = m[1];
//   }

//   // 1️⃣ "Ziko, 34, female, is presenting with..."
//   m =
//     text.match(
//       /\b([A-Z][a-z]{2,})\b\s*,\s*(\d{1,3})\s*,\s*(male|female|man|woman)\b/i
//     ) || m;
//   if (m && m.length >= 4) {
//     if (!name) name = m[1];
//     age = m[2];
//     gender = normalizeSex(m[3]);
//   }

//   // 2️⃣ "Habib, a 24-year-old male ..."
//   if (!age || !gender) {
//     const m2 = text.match(
//       /\b([A-Z][a-z]{2,})\b[^.\n]{0,120}?\b(\d{1,3})\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b/i
//     );
//     if (m2) {
//       if (!name) name = m2[1];
//       age = age || m2[2];
//       gender = gender || normalizeSex(m2[3]);
//     }
//   }

//   // 3️⃣ Any "24-year-old male" pattern
//   if (!age || !gender) {
//     const m3 = text.match(
//       /\b(\d{1,3})\s*[-–]?\s*year[- ]old\s+(male|female|man|woman)\b/i
//     );
//     if (m3) {
//       age = age || m3[1];
//       gender = gender || normalizeSex(m3[2]);
//     }
//   }

//   // 4️⃣ Age only
//   if (!age) {
//     const m4 = text.match(/\b(\d{1,3})\s*[-–]?\s*year[- ]old\b/i);
//     if (m4) {
//       age = m4[1];
//     }
//   }

//   // 5️⃣ Fallback name if nothing explicit matched
//   if (!name) {
//     name = extractLikelyNameFromSummary(text);
//   }

//   // If the fallback still produced something weird like "summarize", drop it
//   if (name && /summar/i.test(name)) {
//     name = null;
//   }

//   return { name, age, gender };
// }

// export function extractRosFromSummary(text = "") {
//   if (!text) {
//     return {
//       chips: [],
//       note: "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.",
//     };
//   }

//   const chipsSet = new Set();

//   const negativePatterns = [
//     /\bno\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bdenies\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bwithout\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bnegative for\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bnot experiencing\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//   ];

//   // Keywords that indicate we should stop capturing
//   const stopWords = ["but", "however", "though", "although", "except", "despite"];

//   const cleanSymptom = (sym) =>
//     sym
//       .replace(/(^and\s+|^\s*,\s*|^\s*or\s*|\s*\.$)/gi, "")
//       .trim()
//       .replace(/\s+/g, " ");

//   const extractFromMatch = (match) => {
//     if (!match) return;

//     let list = match.split(/,|and|or/gi);
//     list.forEach((raw) => {
//       let symptom = cleanSymptom(raw);

//       // stop if this item contains a stopword
//       if (stopWords.some((w) => symptom.toLowerCase().startsWith(w))) return;

//       if (symptom.length > 1) {
//         chipsSet.add("No " + symptom);
//       }
//     });
//   };

//   // Run all negative capture patterns
//   for (const pattern of negativePatterns) {
//     let m;
//     while ((m = pattern.exec(text)) !== null) {
//       extractFromMatch(m[1]);
//     }
//   }

//   // Remove extremely generic garbage
//   [...chipsSet].forEach((c) => {
//     if (/no symptoms?$/i.test(c) && chipsSet.size > 1) {
//       chipsSet.delete(c);
//     }
//   });

//   const chips = [...chipsSet].slice(0, 8); // show more because now symptoms are dynamic

//   // Extract a ROS note: the first sentence containing negatives
//   const sentences = text.split(/(?<=[.!?])\s+/);
//   let rosNote = "";

//   for (const s of sentences) {
//     if (
//       /(no\s+\w+|denies|without|negative for|not experiencing)/i.test(s)
//     ) {
//       rosNote = s.trim();
//       break;
//     }
//   }

//   if (!rosNote) {
//     rosNote =
//       "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";
//   }

//   return {
//     chips,
//     note: rosNote,
//   };
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

//   // 🔹 Final consult summary + metadata
//   const [consultSummary, setConsultSummary] = useState(null);
//   const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

//   // 🔹 Parsed stats from report (conditions + confidence)
//   const [summaryStats, setSummaryStats] = useState({
//     conditions: [],
//     confidence: null,
//   });

//   // 🔹 Parsed CIRA_CONSULT_REPORT JSON (used only for PDF)
//   const [consultReport, setConsultReport] = useState(null);

//   const [isThinking, setIsThinking] = useState(false);
//   const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

//   const scrollAreaRef = useRef(null);
//   const [hasStartedChat, setHasStartedChat] = useState(false);

//   // 🧩 Extra state for modal flow
//   const [conversationSummary, setConversationSummary] = useState("");
//   const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] =
//     useState(false);
//   const [doctorRecommendationData, setDoctorRecommendationData] =
//     useState(null);

//   const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);

//   const [showVitals, setShowVitals] = useState(false);
//   const [vitalsData, setVitalsData] = useState(null);

//   const [showDoctorRecommendation, setShowDoctorRecommendation] =
//     useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [showPayment, setShowPayment] = useState(false);
//   const [showAppointment, setShowAppointment] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);

//   const isAnyModalOpen =
//     showDoctorRecommendationPopUp ||
//     showFacialScanPopUp ||
//     showVitals ||
//     showDoctorRecommendation ||
//     showPayment ||
//     showAppointment ||
//     showConfirmation;


//   const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
//   const downloadMenuRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         downloadMenuRef.current &&
//         !downloadMenuRef.current.contains(e.target)
//       ) {
//         setIsDownloadMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);


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

//       const trimmedText = text.trim();
//       const isAssistant =
//         role === "assistant" || role === "ai" || role === "agent";

//       if (!isAssistant) {
//         console.log("💬 Non-assistant message from SDK:", payload);
//         return;
//       }

//       const lower = trimmedText.toLowerCase();

//       // 🔐 Only treat as final consult summary when the strict closing lines appear
//       const looksLikeSummary =
//         lower.includes(
//           "please book an appointment with a doctor so you can make sure you’re getting the best care possible"
//         ) ||
//         lower.includes(
//           "please book an appointment with a doctor so you can make sure you're getting the best care possible"
//         ) ||
//         lower.includes("take care of yourself, and i hope you feel better soon") ||
//         lower.includes("cira_consult_report");

//       setIsThinking(false);

//       // if (looksLikeSummary) {
//       //   console.log("📝 Captured consult summary.");

//       //   const extracted = extractConsultDataFromMessage(trimmedText);

//       //   setConsultSummary(extracted.summaryText);
//       //   setSummaryCreatedAt(new Date());
//       //   setConversationSummary(extracted.summaryText);
//       //   setSummaryStats({
//       //     conditions: extracted.conditions || [],
//       //     confidence:
//       //       typeof extracted.confidence === "number"
//       //         ? extracted.confidence
//       //         : null,
//       //   });
//       //   setConsultReport(extracted.report || null);

//       //   // ❌ Don't show this as a chat bubble
//       //   return;
//       // }

//       // Normal assistant chat bubble

// if (looksLikeSummary) {
//   console.log("📝 Captured consult summary.");

//   // ⚠️ FIX: Stop thinking dots FIRST
//   setIsThinking(false);

//   // ✅ THEN start summary loader
//   setIsGeneratingSummary(true);

//   const extracted = extractConsultDataFromMessage(trimmedText);

//   setConsultSummary(extracted.summaryText);
//   setSummaryCreatedAt(new Date());
//   setConversationSummary(extracted.summaryText);
//   setSummaryStats({
//     conditions: extracted.conditions || [],
//     confidence:
//       typeof extracted.confidence === "number"
//         ? extracted.confidence
//         : null,
//   });
//   setConsultReport(extracted.report || null);

//   // ⚠️ FIX: Show loader for longer (at least 1-2 seconds)
//   setTimeout(() => {
//     setIsGeneratingSummary(false);
//   }, 1500); // Increased from 300ms to 1500ms for better UX

//   // ✅ Disconnect once summary arrives
//   disconnectAssistant();

//   return;
// }

// // Regular assistant message (not a summary)
// // ⚠️ FIX: Always stop thinking for regular messages too
// setIsThinking(false);
// setMessages((prev) => [
//   ...prev,
//   {
//     id: nextId(),
//     role: "assistant",
//     text: trimmedText,
//   },
// ]);
//     },
//     onError: (err) => {
//       console.error("❌ ElevenLabs chat error:", err);
//       setError("Something went wrong while talking to Cira. Please try again.");
//       setIsThinking(false);
//     },
//   });


//     const disconnectAssistant = useCallback(() => {
//     try {
//       conversation?.endSession?.();   // stop ElevenLabs session
//     } catch (e) {
//       console.warn("⚠️ Error ending ElevenLabs session:", e);
//     } finally {
//       setIsConnected(false);
//     }
//   }, [conversation]);
  
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

//   // 🔄 Use pre-parsed stats, but dedupe condition list
//   const parsedSummary = consultSummary
//     ? {
//       conditions: dedupeConditions(summaryStats.conditions || []),
//       confidence: summaryStats.confidence,
//     }
//     : { conditions: [], confidence: null };

//   let displaySummary = "";
//   let selfCareText = "";

//   if (consultSummary) {
//     let baseSummary = consultSummary.trim();

//     const markerRegex =
//       /(CIRA_CONSULT_REPORT|🏥\s*CIRA HEALTH CONSULTATION REPORT|AI-Generated Medical Snapshot)/i;
//     const markerMatch = baseSummary.match(markerRegex);

//     if (markerMatch && markerMatch.index > 120) {
//       baseSummary = baseSummary.slice(0, markerMatch.index).trim();
//     }

//     const withoutTop = stripTopConditionsFromSummary(baseSummary);
//     const split = splitOutSelfCare(withoutTop);
//     displaySummary = split.cleaned;
//     selfCareText = split.selfCare;

//     displaySummary = displaySummary
//       // remove the label "CLINICAL SUMMARY" anywhere in the text
//       .replace(/CLINICAL SUMMARY\s*:?\s*/gi, "")
//       // remove the confidence sentence with percentages
//       .replace(
//         /I(?:\s+am|['’]m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions|assessment)[^.!\n]*[.?!]/gi,
//         ""
//       )

//       .replace(/^\s*Here are the[^\n]*\n?/gim, "")
//       .replace(/Take care of yourself,[^\n]*\n?/gi, "")
//       .split("\n")
//       .filter((line) => {
//         const trimmed = line.trim();
//         if (!trimmed) return false;
//         if (/^\d+\s*%/.test(trimmed)) return false;
//         if (/confident in the following possibilities/i.test(trimmed))
//           return false;
//         if (/top\s*\d*\s*possible\s*conditions/i.test(trimmed)) return false;
//         if (/CIRA_CONSULT_REPORT/i.test(trimmed)) return false;
//         if (/CIRA HEALTH CONSULTATION REPORT/i.test(trimmed)) return false;
//         if (/AI-Generated Medical Snapshot/i.test(trimmed)) return false;
//         return true;
//       })
//       .join("\n")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim();


//     if (!displaySummary) {
//       if (parsedSummary.conditions.length) {
//         const main = parsedSummary.conditions
//           .slice(0, 3)
//           .map((c) => `${c.name} (${c.percentage}%)`)
//           .join(", ");
//         displaySummary =
//           `Based on what you told me, there are a few possible explanations for your symptoms. ` +
//           `The main ones I'm considering are: ${main}. ` +
//           `Please discuss these with a doctor for a full examination and diagnosis.`;
//       } else {
//         displaySummary =
//           "Based on the information you shared, this most likely represents a mild, self-limiting problem, " +
//           "but you should still speak with a doctor if your symptoms worsen, new symptoms appear, or you're worried at any point.";
//       }
//     }
//   }


//   const handleUserMessage = async (text) => {
//     if (!hasAgreed) return;
//     const trimmed = text.trim();
//     if (!trimmed) return;

//     setMessages((prev) => [
//       ...prev,
//       { id: nextId(), role: "user", text: trimmed },
//     ]);

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
//     document.body.style.overflow = "auto";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

  
//   const buildPdfPayload = () => {
//   if (!consultSummary) {
//     console.warn("❌ No consultSummary available");
//     return null;
//   }

//   console.log("📝 Building PDF payload for Doctor Report...");

//   // Use both cleaned and raw text as sources
//   const combinedSummary = `${displaySummary || ""}\n${consultSummary || ""}`.trim();

//   // ------------------------------------------------------------------
//   // ENHANCED EXTRACTION FUNCTION WITH RELIEVING/WORSENING FACTORS
//   // ------------------------------------------------------------------
//   const extractCurrentIssueFromSummary = (text) => {
//     if (!text) return null;

//     const currentIssue = {
//       primarySymptom: "Not specified",
//       onset: "Not specified",
//       pattern: "Not specified",
//       severity: "Not specified",
//       recentInjury: "No",
//       associatedFactors: "None reported",
//       // NEW FIELDS FOR HPI
//       location: "Not specified",
//       relievingFactors: "None reported",
//       worseningFactors: "None reported",
//       // Medical history fields
//       chronicIllnesses: "None reported",
//       previousSurgeries: "None reported",
//       medications: "None reported",
//       allergies: "None reported"
//     };

//     // ========== EXTRACT PRIMARY SYMPTOM ==========
//     const symptomPatterns = [
//       /(?:complains of|reporting|presenting with|symptoms? of|has|experiencing|feeling)\s+([^.!?]+?)(?:for|since|\.|\?|!|$)/i,
//       /(?:chief complaint|main concern|primary issue)[:\-]?\s*([^.!?]+)/i,
//       /(?:symptom|pain|ache|discomfort|problem)[:\-]?\s*([^.!?]+)/i
//     ];
    
//     for (const pattern of symptomPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1].trim().length > 3) {
//         currentIssue.primarySymptom = match[1].trim();
//         break;
//       }
//     }
    
//     if (currentIssue.primarySymptom === "Not specified") {
//       const commonSymptoms = [
//         'headache', 'migraine', 'fever', 'cough', 'sore throat', 'runny nose',
//         'nausea', 'vomiting', 'diarrhea', 'constipation', 'fatigue', 'weakness',
//         'dizziness', 'vertigo', 'shortness of breath', 'chest pain', 'abdominal pain',
//         'back pain', 'neck pain', 'joint pain', 'muscle ache', 'rash', 'itch'
//       ];
      
//       for (const symptom of commonSymptoms) {
//         if (text.toLowerCase().includes(symptom)) {
//           currentIssue.primarySymptom = symptom.charAt(0).toUpperCase() + symptom.slice(1);
//           break;
//         }
//       }
//     }

//     // ========== EXTRACT ONSET ==========
//     const onsetPatterns = [
//       /(\d+)\s+(day|week|month|hour)s?\s+ago/i,
//       /(?:since|for)\s+(\d+)\s+(day|week|month|hour)/i,
//       /(?:onset|started|began)\s+(?:about|approximately)?\s*(\d+)\s+(day|week|month|hour)/i,
//       /last\s+(night|evening|morning|afternoon|week|month)/i,
//       /yesterday/i,
//       /today/i
//     ];

//     for (const pattern of onsetPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (pattern.toString().includes('last')) {
//           currentIssue.onset = `Last ${match[1]}`;
//         } else if (match[0].toLowerCase() === 'yesterday') {
//           currentIssue.onset = "Yesterday";
//         } else if (match[0].toLowerCase() === 'today') {
//           currentIssue.onset = "Today";
//         } else {
//           const num = match[1];
//           const unit = match[2];
//           currentIssue.onset = `Approximately ${num} ${unit}${parseInt(num) > 1 ? 's' : ''} ago`;
//         }
//         break;
//       }
//     }

//     // ========== EXTRACT PATTERN ==========
//     if (text.toLowerCase().match(/(constant|persistent|continuous|all the time|steady)/)) {
//       currentIssue.pattern = "Constant";
//     } else if (text.toLowerCase().match(/(intermittent|comes and goes|on and off|waxing and waning|episodic)/)) {
//       currentIssue.pattern = "Intermittent";
//     } else if (text.toLowerCase().match(/(variable|changes|fluctuates)/)) {
//       currentIssue.pattern = "Variable";
//     }

//     // ========== EXTRACT SEVERITY ==========
//     const severityPatterns = [
//       /(\d+(?:\.\d+)?)\s*\/\s*10/i,
//       /pain\s*(?:level|score|scale)?\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
//       /severity\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
//       /(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i
//     ];

//     for (const pattern of severityPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         currentIssue.severity = `${match[1]} / 10`;
//         break;
//       }
//     }

//     if (currentIssue.severity === "Not specified") {
//       if (text.toLowerCase().match(/mild(?: pain)?/)) {
//         currentIssue.severity = "Mild (1-3/10)";
//       } else if (text.toLowerCase().match(/moderate(?: pain)?/)) {
//         currentIssue.severity = "Moderate (4-6/10)";
//       } else if (text.toLowerCase().match(/severe(?: pain)?/)) {
//         currentIssue.severity = "Severe (7-10/10)";
//       }
//     }

//     // ========== EXTRACT LOCATION ==========
//     const locationPatterns = [
//       /(?:in|on|at)\s+(?:the\s+)?(head|neck|chest|back|abdomen|stomach|arm|leg|throat|nose|ear|eye)s?/i,
//       /(?:pain|ache|discomfort)\s+(?:in|on|at)\s+(?:the\s+)?([^.!?,]+)/i,
//       /(?:located|localized|felt)\s+(?:in|on|at)\s+(?:the\s+)?([^.!?,]+)/i
//     ];
    
//     for (const pattern of locationPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         currentIssue.location = match[1].trim();
//         break;
//       }
//     }

//     // ========== EXTRACT RELIEVING FACTORS ==========
//     const relievingPatterns = [
//       /(?:better|relieved|improves|helps|eases|alleviated)\s+(?:with|by)\s+([^.!?]+?)(?:\.|\?|!|$)/i,
//       /(?:relief|improvement)\s+(?:with|after)\s+([^.!?]+)/i,
//       /(?:rest|lying down|sitting up|standing|walking|massage|heat|ice|medication|painkillers|ibuprofen|acetaminophen|tylenol|aspirin|naproxen)/i,
//       /(?:improved|better)\s+(?:after|when)\s+([^.!?]+)/i
//     ];
    
//     for (const pattern of relievingPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (pattern.toString().includes('rest')) {
//           currentIssue.relievingFactors = "Rest";
//           break;
//         } else if (pattern.toString().includes('medication') || pattern.toString().includes('painkillers')) {
//           currentIssue.relievingFactors = "Medication";
//           break;
//         } else if (match[1]) {
//           currentIssue.relievingFactors = match[1].trim();
//           break;
//         } else {
//           // Check common relieving factors
//           if (text.toLowerCase().includes('rest')) currentIssue.relievingFactors = "Rest";
//           else if (text.toLowerCase().includes('medication')) currentIssue.relievingFactors = "Medication";
//           else if (text.toLowerCase().includes('lying down')) currentIssue.relievingFactors = "Lying down";
//           else if (text.toLowerCase().includes('sitting up')) currentIssue.relievingFactors = "Sitting up";
//         }
//       }
//     }

//     // ========== EXTRACT WORSENING FACTORS ==========
//     const worseningPatterns = [
//       /(?:worse|worsens|exacerbated|aggravated)\s+(?:with|by)\s+([^.!?]+?)(?:\.|\?|!|$)/i,
//       /(?:worsening|aggravation)\s+(?:with|during)\s+([^.!?]+)/i,
//       /(?:movement|activity|standing|walking|talking|coughing|deep breath|bending|lifting|straining)/i,
//       /(?:worse|intensifies)\s+(?:when|during)\s+([^.!?]+)/i
//     ];
    
//     for (const pattern of worseningPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (pattern.toString().includes('movement')) {
//           currentIssue.worseningFactors = "Movement/Activity";
//           break;
//         } else if (pattern.toString().includes('coughing')) {
//           currentIssue.worseningFactors = "Coughing";
//           break;
//         } else if (match[1]) {
//           currentIssue.worseningFactors = match[1].trim();
//           break;
//         } else {
//           // Check common worsening factors
//           if (text.toLowerCase().includes('movement')) currentIssue.worseningFactors = "Movement";
//           else if (text.toLowerCase().includes('activity')) currentIssue.worseningFactors = "Physical activity";
//           else if (text.toLowerCase().includes('standing')) currentIssue.worseningFactors = "Standing";
//           else if (text.toLowerCase().includes('coughing')) currentIssue.worseningFactors = "Coughing";
//         }
//       }
//     }

//     // ========== EXTRACT INJURY ==========
//     const injuryKeywords = ['injury', 'trauma', 'fell', 'fall', 'accident', 'hit', 'struck', 'injured'];
//     for (const keyword of injuryKeywords) {
//       if (text.toLowerCase().includes(keyword)) {
//         currentIssue.recentInjury = "Yes";
//         break;
//       }
//     }

//     // ========== EXTRACT ASSOCIATED FACTORS ==========
//     const factors = [];
//     if (text.toLowerCase().match(/(light|bright|photophobia)/)) factors.push("Light sensitivity");
//     if (text.toLowerCase().match(/(sound|noise|phonophobia)/)) factors.push("Sound sensitivity");
//     if (text.toLowerCase().match(/(nausea|vomit)/)) factors.push("Nausea/Vomiting");
//     if (text.toLowerCase().match(/(fever|chill|sweat)/)) factors.push("Fever/Chills");
//     if (text.toLowerCase().match(/(dizziness|vertigo)/)) factors.push("Dizziness");
//     if (text.toLowerCase().match(/(fatigue|tired|weak)/)) factors.push("Fatigue");
//     if (text.toLowerCase().match(/(congestion|runny nose|sneezing)/)) factors.push("Nasal symptoms");
//     if (factors.length > 0) {
//       currentIssue.associatedFactors = factors.join(", ");
//     }

//     // ========== EXTRACT MEDICAL HISTORY ==========
//     // Chronic illnesses
//     const medKeywords = ['diabetes', 'hypertension', 'high blood pressure', 'asthma', 
//                          'allergy', 'migraine', 'arthritis', 'heart disease', 'copd',
//                          'kidney disease', 'liver disease', 'thyroid', 'anemia'];
//     const foundConditions = [];
    
//     for (const condition of medKeywords) {
//       if (text.toLowerCase().includes(condition)) {
//         foundConditions.push(condition.charAt(0).toUpperCase() + condition.slice(1));
//       }
//     }
    
//     if (foundConditions.length > 0) {
//       currentIssue.chronicIllnesses = foundConditions.join(", ");
//     }

//     // Previous surgeries
//     const surgeryPatterns = [
//       /(?:surgery|operation|procedure)\s+(?:for|on)\s+([^.!?]+)/i,
//       /(?:had|underwent)\s+(?:a\s+)?(?:surgery|operation)\s+(?:for|on)?\s*([^.!?]+)/i,
//       /(?:appendectomy|tonsillectomy|cholecystectomy|hernia repair|knee surgery|hip replacement)/i
//     ];
    
//     for (const pattern of surgeryPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (match[1]) {
//           currentIssue.previousSurgeries = match[1].trim();
//         } else {
//           if (text.toLowerCase().includes('appendectomy')) currentIssue.previousSurgeries = "Appendectomy";
//           else if (text.toLowerCase().includes('tonsillectomy')) currentIssue.previousSurgeries = "Tonsillectomy";
//           else if (text.toLowerCase().includes('hernia')) currentIssue.previousSurgeries = "Hernia repair";
//         }
//         break;
//       }
//     }

//     // Medications
//     const medicationPatterns = [
//       /(?:taking|on|using|prescribed)\s+([^.!?]+?)(?:for|\.|\?|!|$)/i,
//       /medications?\s*(?:include|are|:)?\s*([^.!?]+)/i,
//       /(?:ibuprofen|acetaminophen|tylenol|aspirin|naproxen|antibiotic|antihistamine)/i
//     ];
    
//     for (const pattern of medicationPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (match[1]) {
//           currentIssue.medications = match[1].trim();
//         } else {
//           if (text.toLowerCase().includes('ibuprofen')) currentIssue.medications = "Ibuprofen";
//           else if (text.toLowerCase().includes('tylenol')) currentIssue.medications = "Tylenol";
//           else if (text.toLowerCase().includes('antibiotic')) currentIssue.medications = "Antibiotic";
//         }
//         break;
//       }
//     }

//     // Allergies
//     const allergyPatterns = [
//       /(?:allerg(?:ic|y|ies) to|allergic reaction to)\s+([^.!?]+)/i,
//       /(?:penicillin|sulfa|aspirin|ibuprofen|codeine|morphine)/i
//     ];
    
//     for (const pattern of allergyPatterns) {
//       const match = text.match(pattern);
//       if (match) {
//         if (match[1]) {
//           currentIssue.allergies = match[1].trim();
//         } else {
//           if (text.toLowerCase().includes('penicillin')) currentIssue.allergies = "Penicillin";
//           else if (text.toLowerCase().includes('sulfa')) currentIssue.allergies = "Sulfa drugs";
//         }
//         break;
//       }
//     }

//     return currentIssue;
//   };

//   // Extract current issue data
//   const currentIssueData = extractCurrentIssueFromSummary(combinedSummary);
//   console.log("📋 Extracted enhanced current issue data:", currentIssueData);

//   // ------------------------------------------------------------------
//   // 1️⃣ PATIENT INFORMATION - Extract from both sources
//   // ------------------------------------------------------------------
//   const { name: nameFromSummary, age: ageFromSummary, gender: genderFromSummary } =
//     extractDemographicsFromSummary(combinedSummary);

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

//   // Initialize JSON structure
//   let jsonData = {
//     patient_identity_baseline: {},
//     chief_complaint: {},
//     history_of_present_illness_hpi: {},
//     medical_background: {},
//     vital_signs_current_status: {},
//     lifestyle_risk_factors: {},
//     exposure_environment: {},
//     functional_status: {},
//     review_of_systems_traffic_light_view: {},
//     ai_clinical_assessment: {}
//   };

//   // 🔹 Extract from JSON report if available
//   if (consultReport && typeof consultReport === "object") {
//     console.log("📊 Extracting from JSON report:", consultReport);

//     // Merge JSON data
//     jsonData = {
//       ...jsonData,
//       ...consultReport
//     };
//   }

//   // ------------------------------------------------------------------
//   // 2️⃣ ENHANCE DATA WITH EXTRACTED INFO
//   // ------------------------------------------------------------------

//   // Patient Identity Baseline
//   jsonData.patient_identity_baseline = {
//     name: jsonData.patient_identity_baseline?.name ||
//       deepFind(jsonData, "name") ||
//       nameFromSummary ||
//       "User",
//     age: jsonData.patient_identity_baseline?.age ||
//       deepFind(jsonData, "age") ||
//       ageFromSummary ||
//       "",
//     biological_sex: jsonData.patient_identity_baseline?.biological_sex ||
//       deepFind(jsonData, "biological_sex") ||
//       deepFind(jsonData, "gender") ||
//       genderFromSummary ||
//       "",
//     weight: jsonData.patient_identity_baseline?.weight ||
//       deepFind(jsonData, "weight") ||
//       deepFind(jsonData, "Weight") ||
//       "Not specified",
//     height: jsonData.patient_identity_baseline?.height ||
//       deepFind(jsonData, "height") ||
//       deepFind(jsonData, "Height") ||
//       "Not specified"
//   };

//   // Chief Complaint
//   const extractedCC = extractMainSymptomFromText(combinedSummary);
//   jsonData.chief_complaint = {
//     primary_concern: jsonData.chief_complaint?.primary_concern ||
//       deepFind(jsonData, "primary_concern") ||
//       deepFind(jsonData, "chief_complaint") ||
//       extractedCC ||
//       (currentIssueData?.primarySymptom || "Not specified"),
//     onset: jsonData.chief_complaint?.onset ||
//       deepFind(jsonData, "onset") ||
//       (currentIssueData?.onset || "Not specified"),
//     duration: jsonData.chief_complaint?.duration ||
//       deepFind(jsonData, "duration") ||
//       "Not specified",
//     pattern: jsonData.chief_complaint?.pattern ||
//       currentIssueData?.pattern ||
//       "Not specified",
//     severity: jsonData.chief_complaint?.severity ||
//       (currentIssueData?.severity ? currentIssueData.severity.split('/')[0] : null),
//     previous_episodes: jsonData.chief_complaint?.previous_episodes ||
//       deepFind(jsonData, "previous_episodes") ||
//       "None reported",
//     recent_injury: currentIssueData?.recentInjury || "No"
//   };

//   // HPI - Enhanced with all extracted data
//   jsonData.history_of_present_illness_hpi = {
//     location_or_system: jsonData.history_of_present_illness_hpi?.location_or_system ||
//       deepFind(jsonData, "location") ||
//       currentIssueData?.location ||
//       "General-systems",
//     severity_0_to_10: jsonData.history_of_present_illness_hpi?.severity_0_to_10 ||
//       (currentIssueData?.severity ? currentIssueData.severity.replace(/[^0-9.]/g, '').split('/')[0] : null) ||
//       deepFind(jsonData, "severity") ||
//       null,
//     progression_pattern: jsonData.history_of_present_illness_hpi?.progression_pattern ||
//       currentIssueData?.pattern ||
//       "Not specified",
//     associated_symptoms: jsonData.history_of_present_illness_hpi?.associated_symptoms ||
//       (currentIssueData?.associatedFactors ?
//         [currentIssueData.associatedFactors] : []) ||
//       (deepFind(jsonData, "associated_symptoms") ?
//         Array.isArray(deepFind(jsonData, "associated_symptoms"))
//           ? deepFind(jsonData, "associated_symptoms")
//           : [deepFind(jsonData, "associated_symptoms")]
//         : []),
//     // NEW FIELDS - These will now be extracted and show in UI
//     relieving_factors: jsonData.history_of_present_illness_hpi?.relieving_factors ||
//       currentIssueData?.relievingFactors ||
//       "None reported",
//     worsening_factors: jsonData.history_of_present_illness_hpi?.worsening_factors ||
//       currentIssueData?.worseningFactors ||
//       "None reported"
//   };

//   // Medical Background - Enhanced with extracted data
//   jsonData.medical_background = {
//     chronic_illnesses: jsonData.medical_background?.chronic_illnesses ||
//       deepFind(jsonData, "chronic_conditions") ||
//       deepFind(jsonData, "chronicIllnesses") ||
//       currentIssueData?.chronicIllnesses ||
//       "None reported",
//     previous_surgeries: jsonData.medical_background?.previous_surgeries ||
//       deepFind(jsonData, "previous_surgeries") ||
//       currentIssueData?.previousSurgeries ||
//       "None reported",
//     current_medications: jsonData.medical_background?.current_medications ||
//       deepFind(jsonData, "currentMedications") ||
//       currentIssueData?.medications ||
//       "None reported",
//     drug_allergies: jsonData.medical_background?.drug_allergies ||
//       deepFind(jsonData, "allergies") ||
//       currentIssueData?.allergies ||
//       "None reported",
//     family_history: jsonData.medical_background?.family_history ||
//       deepFind(jsonData, "family_history") ||
//       deepFind(jsonData, "familyHistory") ||
//       deepFind(jsonData, "family_medical_history") ||
//       deepFind(jsonData, "relevant_family_history") ||
      
//       "None reported", // CHANGED: From null to "None reported"
//     pregnancy_status: jsonData.medical_background?.pregnancy_status || "Not_applicable"
//   };

//   // Vital Signs
//   jsonData.vital_signs_current_status = {
//     heart_rate_bpm: jsonData.vital_signs_current_status?.heart_rate_bpm ||
//       (vitalsData?.heartRate ? `${vitalsData.heartRate}` : null),
//     oxygen_saturation_spo2_percent: jsonData.vital_signs_current_status?.oxygen_saturation_spo2_percent ||
//       (vitalsData?.spo2 ? `${vitalsData.spo2}` : null),
//     core_temperature: jsonData.vital_signs_current_status?.core_temperature ||
//       (vitalsData?.temperature ? `${vitalsData.temperature}` : null),
//     reported_fever: jsonData.vital_signs_current_status?.reported_fever ||
//       (vitalsData?.hasFever ? "Yes" : "No"),
//     blood_pressure: jsonData.vital_signs_current_status?.blood_pressure || "Not measured",
//     blood_pressure_measured: jsonData.vital_signs_current_status?.blood_pressure_measured || "No",
//     temperature_measured: jsonData.vital_signs_current_status?.temperature_measured || "Yes"
//   };

//   // Lifestyle Factors
//   jsonData.lifestyle_risk_factors = {
//     smoking: jsonData.lifestyle_risk_factors?.smoking ||
//       deepFind(jsonData, "smoking") ||
//       "No",
//     alcohol_use: jsonData.lifestyle_risk_factors?.alcohol_use ||
//       deepFind(jsonData, "alcoholUse") ||
//       "No",
//     recreational_drugs: jsonData.lifestyle_risk_factors?.recreational_drugs || "No",
//     diet: jsonData.lifestyle_risk_factors?.diet || "Normal",
//     exercise_routine: jsonData.lifestyle_risk_factors?.exercise_routine || "Not specified",
//     stress_level: jsonData.lifestyle_risk_factors?.stress_level || "Mild"
//   };

//   // Exposure & Environment
//   jsonData.exposure_environment = {
//     recent_travel: jsonData.exposure_environment?.recent_travel || "No",
//     sick_contacts: jsonData.exposure_environment?.sick_contacts || "No",
//     crowded_events: jsonData.exposure_environment?.crowded_events || "No",
//     workplace_chemical_exposure: jsonData.exposure_environment?.workplace_chemical_exposure || "No",
//     weather_exposure: jsonData.exposure_environment?.weather_exposure || "None",
//     food_water_hygiene_concern: jsonData.exposure_environment?.food_water_hygiene_concern || "No"
//   };

//   // Functional Status
//   jsonData.functional_status = {
//     eating_drinking_normally: jsonData.functional_status?.eating_drinking_normally || "Yes",
//     hydration: jsonData.functional_status?.hydration || "Adequate",
//     activity_level: jsonData.functional_status?.activity_level || "Normal"
//   };

//   // Review of Systems
//   const { chips: rosChips } = extractRosFromSummary(combinedSummary);
//   jsonData.review_of_systems_traffic_light_view = {
//     shortness_of_breath: {
//       present: false,
//       answer: rosChips.some(chip => chip.toLowerCase().includes('breath')) ? "No" : "Unknown",
//       flag_level: "green"
//     },
//     chest_pain: {
//       present: false,
//       answer: rosChips.some(chip => chip.toLowerCase().includes('chest')) ? "No" : "Unknown",
//       flag_level: "green"
//     },
//     sore_throat: {
//       present: false,
//       answer: rosChips.some(chip => chip.toLowerCase().includes('throat')) ? "No" : "Unknown",
//       flag_level: "green"
//     },
//     body_aches_fatigue: {
//       present: false,
//       answer: rosChips.some(chip => chip.toLowerCase().includes('ache') || chip.toLowerCase().includes('fatigue')) ? "No" : "Unknown",
//       flag_level: "green"
//     },
//     vomiting_diarrhea: {
//       present: false,
//       answer: rosChips.some(chip => chip.toLowerCase().includes('vomit') || chip.toLowerCase().includes('diarrhea')) ? "No" : "Unknown",
//       flag_level: "green"
//     }
//   };

//   // AI Clinical Assessment
//   const { selfCare } = splitOutSelfCare(consultSummary || "");
  
//   // Fix for confidence error - get it safely
//   const parsedConfidence = parsedSummary?.confidence || null;
  
//   jsonData.ai_clinical_assessment = {
//     overall_stability: jsonData.ai_clinical_assessment?.overall_stability || "Stable",
//     red_flag_symptoms: jsonData.ai_clinical_assessment?.red_flag_symptoms || "None identified",
//     clinical_note_to_physician: jsonData.ai_clinical_assessment?.clinical_note_to_physician ||
//       deepFind(jsonData, "clinicalAssessment") ||
//       displaySummary ||
//       "Clinical assessment based on patient-reported symptoms.",
//     confidence: parsedConfidence
//   };

//   // Final defaults for patient info
//   if (!patientInfo.name) patientInfo.name = jsonData.patient_identity_baseline.name || "User";
//   if (!patientInfo.age) patientInfo.age = jsonData.patient_identity_baseline.age || "";
//   if (!patientInfo.gender) patientInfo.gender = jsonData.patient_identity_baseline.biological_sex || "";

//   // ------------------------------------------------------------------
//   // 3️⃣ BUILD FINAL CONSULTATION DATA
//   // ------------------------------------------------------------------
//   const consultationData = {
//     // Include all JSON data
//     ...jsonData,

//     // Patient info for PDF header
//     patientName: patientInfo.name,
//     patientAge: patientInfo.age,
//     patientGender: patientInfo.gender,
//     consultDate: patientInfo.consultDate,

//     // Current issue data - Now includes all extracted fields
//     currentIssueData: currentIssueData || {
//       primarySymptom: jsonData.chief_complaint?.primary_concern || "Not specified",
//       onset: jsonData.chief_complaint?.onset || "Not specified",
//       pattern: jsonData.chief_complaint?.pattern || "Not specified",
//       severity: jsonData.chief_complaint?.severity || "Not specified",
//       recentInjury: jsonData.chief_complaint?.recent_injury || "No",
//       associatedFactors: jsonData.history_of_present_illness_hpi?.associated_symptoms?.join(", ") || "None reported",
//       location: jsonData.history_of_present_illness_hpi?.location_or_system || "Not specified",
//       relievingFactors: jsonData.history_of_present_illness_hpi?.relieving_factors || "None reported", // NEW
//       worseningFactors: jsonData.history_of_present_illness_hpi?.worsening_factors || "None reported", // NEW
//       chronicIllnesses: jsonData.medical_background?.chronic_illnesses || "None reported",
//       previousSurgeries: jsonData.medical_background?.previous_surgeries || "None reported",
//       medications: jsonData.medical_background?.current_medications || "None reported",
//       allergies: jsonData.medical_background?.drug_allergies || "None reported"
//     },

//     // Additional clinical data
//     conditions: parsedSummary?.conditions || [],
//     confidence: parsedConfidence,
//     narrativeSummary: displaySummary || consultSummary || "",
//     selfCareText: selfCare || selfCareText || "",
//     vitalsData: vitalsData || {},
//     chiefComplaint: jsonData.chief_complaint.primary_concern,

//     // Associated symptoms
//     associatedSymptomsChips: rosChips,
//     associatedSymptomsNote: extractRosFromSummary(combinedSummary).note,

//     // Flags
//     stripFollowupLines: true,
//     includeComprehensiveData: true
//   };

//   console.log("✅ Built COMPLETE Doctor Report PDF payload:", {
//     patientInfo,
//     hasJSONData: !!consultationData.patient_identity_baseline,
//     chiefComplaint: consultationData.chief_complaint,
//     conditionsCount: consultationData.conditions?.length,
//     currentIssueData: consultationData.currentIssueData,
//     hpiData: consultationData.history_of_present_illness_hpi,
//     // Log the new fields to verify extraction
//     hasRelievingFactors: !!currentIssueData?.relievingFactors,
//     hasWorseningFactors: !!currentIssueData?.worseningFactors,
//     hasLocation: !!currentIssueData?.location,
//     hasPreviousSurgeries: !!currentIssueData?.previousSurgeries
//   });

//   return { consultationData, patientInfo };
// };

//   const handleDownloadPatientSummaryPDF = () => {
//     const payload = buildPdfPayload();
//     if (!payload) return;
//     const { consultationData, patientInfo } = payload;

//     downloadPatientSummaryFromChatData(
//       consultationData,
//       patientInfo,
//       `Cira_Patient_Summary_${Date.now()}.pdf`
//     );
//   };

//   const handleDownloadDoctorReportPDF = () => {
//     console.log("🏥 Downloading NEW Doctor Clinical Report...");
//     console.log("📊 consultReport data:", consultReport); // Check if this exists
//     console.log("📊 consultationSummary:", consultSummary); // Check raw summary

//     const payload = buildPdfPayload();
//     if (!payload) {
//       console.warn("❌ No payload available for doctor report");
//       return;
//     }

//     const { consultationData, patientInfo } = payload;

//     console.log("📋 consultationData to send:", consultationData);
//     console.log("📋 Does it have clinicalSummary?", consultationData.clinicalSummary);

//     // Call the NEW function
//     downloadDoctorsReport(
//       consultationData,
//       patientInfo,
//       `CIRA_Clinical_Intake_Report_${Date.now()}.pdf`
//     );
//   };

//   const handleDownloadEHRSOAPPDF = () => {
//     const payload = buildPdfPayload();
//     if (!payload) return;
//     const { consultationData, patientInfo } = payload;

//     downloadEHRSOAPFromChatData(
//       consultationData,
//       patientInfo,
//       `Cira_SOAP_Note_${Date.now()}.pdf`
//     );
//   };





//   const handleFindDoctorSpecialistClick = () => {
//     if (!consultSummary) return;

//     const primaryCondition =
//       parsedSummary.conditions[0]?.name || "your health concerns";

//     setDoctorRecommendationData({
//       condition: primaryCondition,
//       specialty: "General Physician",
//     });
//     setConversationSummary(consultSummary);
//     setShowDoctorRecommendationPopUp(true);
//   };

//   const handleFindSpecialistDoctorClick = () => {
//     setShowDoctorRecommendationPopUp(false);
//     setShowFacialScanPopUp(true);
//   };

//   const handleSkipDoctorRecommendation = () => {
//     setShowDoctorRecommendationPopUp(false);
//   };

//   const handleStartFacialScan = () => {
//     setIsScanning(true);
//     setShowFacialScanPopUp(false);

//     setTimeout(() => {
//       setIsScanning(false);
//       setVitalsData({
//         heartRate: 80,
//         spo2: 98,
//         temperature: 36.8,
//       });
//       setShowVitals(true);
//     }, 1500);
//   };

//   const handleSkipFacialScan = () => {
//     setShowFacialScanPopUp(false);
//   };

//   const handleContinueFromVitals = () => {
//     setShowVitals(false);
//     setShowDoctorRecommendation(true);
//   };

//   const handleSelectDoctor = (doctor) => {
//     setSelectedDoctor(doctor);
//     setShowDoctorRecommendation(false);
//     setShowPayment(true);
//   };

//   const handleSkipDoctor = () => {
//     setShowDoctorRecommendation(false);
//   };

//   const handlePaymentSuccess = (details) => {
//     setShowPayment(false);
//     setBookingDetails(details);
//     setShowAppointment(true);
//   };

//   const handlePaymentBack = () => {
//     setShowPayment(false);
//     setShowDoctorRecommendation(true);
//   };

//   const handleBookingSuccess = (details) => {
//     setShowAppointment(false);
//     setBookingDetails(details);
//     setShowConfirmation(true);
//   };

//   const handleAppointmentBack = () => {
//     setShowAppointment(false);
//     setShowPayment(true);
//   };

//   const handleConfirmationClose = () => {
//     setShowConfirmation(false);
//     setSelectedDoctor(null);
//     setBookingDetails(null);
//   };

//   return (
//     <>
//       <div className="fixed inset-0 w-full flex flex-col bg-[#FFFEF9]">
//         <div className="fixed top-0 left-0 right-0 z-50 md:z-0">
//           <Header />
//         </div>

//         <motion.div
//           ref={scrollAreaRef}
//           className="flex-1 overflow-y-auto"
//           initial={{ opacity: 0, y: 60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//         >
//           <div className="w-full flex justify-center min-h-full pb-48">
//             <div className="w-full max-w-xl">
//               <div className="px-4 pt-6 pb-8">
//                 <header className="mb-6 px-4 pt-24">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-15 h-15 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold">
//                         <img src={stars} className="w-9 h-9" alt="stars" />
//                       </div>
//                       <div className="flex -space-x-2">
//                         <img
//                           src={AgentAvatar}
//                           alt="Clinician 2"
//                           className="w-15 h-15 rounded-full border border-white object-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <h1 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-2">
//                     Cira Consult
//                   </h1>
//                   <p className="text-sm mt-5 text-gray-500 mb-1">
//                     Consult started: Today, {startedLabel}
//                   </p>

//                 </header>

//                 {error && (
//                   <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
//                     {error}
//                   </div>
//                 )}

//                 <div className="border border-gray-200 mb-5" />

//                 <div className="space-y-4">
//                   {messages.map((m) => {
//                     const isAssistant = m.role === "assistant";
//                     return (
//                       <div
//                         key={m.id}
//                         className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"
//                           }`}
//                       >
//                         <div className="flex items-center">
//                           <div
//                             className={`px-4 py-4 text-sm ${isAssistant
//                               ? "rounded-2xl text-gray-800"
//                               : "rounded-2xl rounded-tr-none bg-pink-500 text-white"
//                               }`}
//                           >
//                             {m.text}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

// {/* 1. Big gradient spinner for summary generation */}
// {/* {isGeneratingSummary && (
//   <div className="flex w-full justify-center">    
//       <div className="w-16 h-16 rounded-full animate-spin 
//         bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
//         p-[3px]"
//       >
//         <div className="w-full h-full rounded-full bg-[#FFFEF9]" />
//       </div>
//     </div>
//             )} */}
            
// {/* 2. Thinking dots for regular chat responses */}
// {/* {isThinking && !consultSummary && !isGeneratingSummary &&(  
//   <div className="flex w-full justify-start"> 
//   <div className="flex items-center"> 
//     <div className="flex w-full justify-start"> 
//       <div className="flex items-center gap-2 max-w-[80%]"> 
//         <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500"> 
//           <span className="inline-flex gap-1 items-center"> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0s", }} /> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.15s", }} /> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.3s", }} />
//              </span> 
//              </div> 
//              </div> 
//              </div> 
//              </div> 
//              </div> 
//             )} */}

//             {isThinking && (  
//   <div className="flex w-full justify-start"> 
//   <div className="flex items-center"> 
//     <div className="flex w-full justify-start"> 
//       <div className="flex items-center gap-2 max-w-[80%]"> 
//         <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500"> 
//           <span className="inline-flex gap-1 items-center"> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0s", }} /> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.15s", }} /> 
//             <span className="w-1.5 h-1.5 rounded-full bg-gray-400" 
//             style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.3s", }} />
//              </span> 
//              </div> 
//              </div> 
//              </div> 
//              </div> 
//              </div> 
//             )}
//                 </div>

//                 {/* SUMMARY CARD */}
//                 {consultSummary && (
//                   <section className="w-full mt-6 mb-2">
//                     <div className="bg-white shadow-sm border border-[#E3E3F3] px-5 py-6">
//                       <div className="w-full flex justify-center my-4">
//                         <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
//                           <img
//                             src={AgentAvatar}
//                             alt=""
//                             className="w-32 rounded-full"
//                           />
//                           <p className="text-xs text-gray-500">
//                             Your AI clinician assistant, Cira
//                           </p>
//                         </div>
//                       </div>

//                       <div className="mb-3">
//                         <h2 className="text-xl font-semibold text-gray-900 mb-1">
//                           AI Consult Summary
//                         </h2>
//                         {summaryDateLabel && (
//                           <p className="text-xs text-gray-400">
//                             {summaryDateLabel}
//                           </p>
//                         )}
//                       </div>

//                       <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
//                         {displaySummary}
//                       </p>

//                       {parsedSummary.conditions.length > 0 && (
//                         <div className="mt-4 border-t border-gray-100 pt-4">
//                           <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                             Conditions Matching
//                           </h3>

//                           <div className="space-y-3">
//                             {parsedSummary.conditions.map((c, idx) => (
//                               <div
//                                 key={idx}
//                                 className="flex items-center justify-between text-sm"
//                               >
//                                 <div className="flex items-center gap-2">
//                                   <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
//                                   <span className="text-gray-800 truncate">
//                                     {shortConditionName(c.name)}
//                                   </span>
//                                 </div>
//                                 <span className="font-medium text-gray-900">
//                                   {c.percentage}%
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {parsedSummary.confidence != null && (
//                         <div className="mt-5">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Assessment confidence
//                           </p>

//                           <div className="flex items-center justify-between text-xs mb-1">
//                             <span className="font-medium text-emerald-600">
//                               {parsedSummary.confidence >= 80
//                                 ? "Pretty sure"
//                                 : parsedSummary.confidence >= 60
//                                   ? "Somewhat sure"
//                                   : "Low confidence"}
//                             </span>
//                             <span className="text-gray-600">
//                               {parsedSummary.confidence}%
//                             </span>
//                           </div>

//                           <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
//                             <div
//                               className="h-full rounded-full bg-emerald-500"
//                               style={{
//                                 width: `${Math.min(
//                                   parsedSummary.confidence,
//                                   100
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <div className="mt-5 border-t border-gray-100 pt-4">
//                         <h3 className="text-sm font-semibold text-gray-900 mb-1">
//                           Self-care & when to seek help
//                         </h3>

//                         {selfCareText ? (
//                           <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
//                             {selfCareText}
//                           </p>
//                         ) : (
//                           <p className="text-xs text-gray-600 mb-2">
//                             Home care with rest, fluids, and over-the-counter
//                             pain relievers is usually enough for most mild
//                             illnesses. If your fever rises, breathing becomes
//                             difficult, or your symptoms last more than a few
//                             days or suddenly worsen, contact a doctor or urgent
//                             care.
//                           </p>
//                         )}

//                         <p className="text-[11px] text-gray-400">
//                           These are rough estimates and do not replace medical
//                           advice. Always consult a healthcare professional if
//                           you&apos;re worried.
//                         </p>
//                       </div>

//                       {/* Primary actions */}
//                       <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                         {/* Download Reports dropdown */}
//                         <div className="relative flex-1" ref={downloadMenuRef}>
//                           <button
//                             type="button"
//                             onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
//                             className="w-full inline-flex items-center justify-between px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
//                           >
//                             <span>Download Reports</span>
//                             {/* simple chevron */}
//                             <svg
//                               className={`w-4 h-4 ml-2 transition-transform ${isDownloadMenuOpen ? "rotate-180" : ""
//                                 }`}
//                               viewBox="0 0 20 20"
//                               fill="none"
//                             >
//                               <path
//                                 d="M5 7l5 5 5-5"
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                           </button>

//                           {isDownloadMenuOpen && (
//                             <div
//                               className="
//       absolute z-20 mt-2 w-full rounded-xl border border-gray-200
//       bg-white shadow-xl text-sm overflow-hidden
//       divide-y divide-gray-100
//     "
//                             >
//                               {/* <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadPatientSummaryPDF();
//                                 }}
//                               >
//                                 <span className="group-hover:underline">Patient Summary (PDF)</span>
//                               </button> */}

//                               <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadDoctorReportPDF(); // doctor clinical report
//                                 }}
//                               >
//                                 <span className="group-hover:underline">Doctor Clinical Report (PDF)</span>
//                               </button>

//                               <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadEHRSOAPPDF(); // SOAP / EHR note
//                                 }}
//                               >
//                                 <span className="group-hover:underline">SOAP / EHR Note (PDF)</span>
//                               </button>
//                             </div>
//                           )}

//                         </div>

//                         {/* Find doctor stays as a separate button */}
//                         <button
//                           type="button"
//                           onClick={handleFindDoctorSpecialistClick}
//                           className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5"
//                         >
//                           Find Doctor Specialist
//                         </button>
//                       </div>



//                     </div>
//                   </section>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <motion.footer
//           className="w-full flex-shrink-0 flex justify-center px-4 bg-transparent fixed bottom-0"
//           initial={{ y: -60, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
//         >

//           {!consultSummary && (
//             <div className="w-full bg-[#FFFEF9] max-w-xl rounded-2xl space-y-3">
//               {!hasStartedChat && (
//                 <div className="flex items-start gap-2 text-[11px] text-gray-600 p-4 -mb-4 rounded-t-2xl bg-white">
//                   <input
//                     id="tos"
//                     type="checkbox"
//                     checked={hasAgreed}
//                     onChange={(e) => setHasAgreed(e.target.checked)}
//                     className="mb-2.5"
//                   />
//                   <label htmlFor="tos">
//                     I agree to the{" "}
//                     <button
//                       type="button"
//                       className="underline text-pink-500"
//                       onClick={() => navigate('/terms')}
//                     >
//                       The Cira Terms of Service
//                     </button>{" "}
//                     and will discuss all The Cira output with a doctor.
//                   </label>
//                 </div>
//               )}

//               <ChatInput
//   onSendMessage={handleUserMessage}
//   disabled={!hasAgreed || isThinking}
//   placeholder={isThinking ? "Thinking..." : "Reply to Cira..."}
//   showMic={false}
//   submitText=""
//   isThinking={isThinking}
// />

//             </div>
//           )}
//         </motion.footer>
//       </div>

//       {/* Modals with overlay – block background interaction */}
//       <AnimatePresence>
//         {isAnyModalOpen && (
//           <motion.div
//             className="fixed inset-0 z-40 flex items-center justify-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {showDoctorRecommendationPopUp && (
//               <DoctorRecommendationPopUp
//                 condition={
//                   doctorRecommendationData?.condition ||
//                   "your health concerns"
//                 }
//                 recommendedSpecialty={
//                   doctorRecommendationData?.specialty ||
//                   "General Physician"
//                 }
//                 onFindDoctor={handleFindSpecialistDoctorClick}
//                 onSkip={handleSkipDoctorRecommendation}
//                 conversationSummary={conversationSummary}
//               />
//             )}

//             {showFacialScanPopUp && (
//               <FacialScanModal
//                 onStartScan={handleStartFacialScan}
//                 onSkipScan={handleSkipFacialScan}
//                 isScanning={isScanning}
//               />
//             )}

//             {showVitals && vitalsData && (
//               <VitalSignsDisplay
//                 vitals={vitalsData}
//                 onClose={handleContinueFromVitals}
//                 onStartConversation={handleContinueFromVitals}
//               />
//             )}

//             {showDoctorRecommendation && doctorRecommendationData && (
//               <DoctorRecommendationModal
//                 condition={doctorRecommendationData.condition}
//                 recommendedSpecialty={doctorRecommendationData.specialty}
//                 onSelectDoctor={handleSelectDoctor}
//                 onSkip={handleSkipDoctor}
//               />
//             )}

//             {showPayment && selectedDoctor && (
//               <PaymentModal
//                 doctor={selectedDoctor}
//                 onPaymentSuccess={handlePaymentSuccess}
//                 onBack={handlePaymentBack}
//               />
//             )}

//             {showAppointment && selectedDoctor && (
//               <AppointmentModal
//                 doctor={selectedDoctor}
//                 onBookingSuccess={handleBookingSuccess}
//                 onBack={handleAppointmentBack}
//               />
//             )}

//             {showConfirmation && bookingDetails && (
//               <BookingConfirmationModal
//                 bookingDetails={bookingDetails}
//                 onClose={handleConfirmationClose}
//               />
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// /// File: src/assistant/CiraChatAssistant.jsx
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useConversation } from "@11labs/react";
// import { motion, AnimatePresence } from "framer-motion";

// import AgentAvatar from "../assets/nurse.png";
// import ChatInput from "../components/landing/ChatInput";
// import Header from "../components/Header";
// import stars from "../assets/stars.svg";

// import VitalSignsDisplay from "./modal/VitalSignsDisplay";
// import DoctorRecommendationModal from "./modal/DoctorRecommendationModal";
// import PaymentModal from "./modal/PaymentModal";
// import AppointmentModal from "./modal/AppointmentModal";
// import BookingConfirmationModal from "./modal/BookingConfirmationModal";
// import DoctorRecommendationPopUp from "./modal/DoctorRecommendationPopUp";
// import FacialScanModal from "./modal/FacialScanModal";

// import {
//   downloadPatientSummaryFromChatData,
//   downloadEHRSOAPFromChatData,
//   downloadDoctorsReport,
// } from "../utils/clinicalReport/pdfGenerator";

// const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

// /* ------------------------------------------------------------------ */
// /*  Helpers: multi-language heading detection (Self-care extraction)    */
// /* ------------------------------------------------------------------ */

// const normalizeLine = (s) =>
//   String(s || "")
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // remove diacritics
//     .replace(/[^\p{L}\p{N}\s&-]/gu, " ") // keep letters/numbers/spaces/&/-
//     .replace(/\s+/g, " ")
//     .trim();

// /**
//  * Headings can vary by language.
//  * We detect via:
//  * 1) aliases (exact-ish matches after normalization),
//  * 2) keyword heuristics (works even if your agent slightly changes phrasing).
//  */
// const HEADING_ALIASES = {
//   selfCare: [
//     // English
//     "self-care & when to seek help",
//     "self care & when to seek help",
//     "self-care and when to seek help",
//     "self care and when to seek help",
//     "self-care when to seek help",
//     "self care when to seek help",

//     // French
//     "soins personnels & quand consulter",
//     "soins personnels et quand consulter",
//     "auto-soins & quand consulter",
//     "auto soins & quand consulter",
//     "soins personnels quand consulter",

//     // German
//     "selbstpflege & wann arztliche hilfe suchen",
//     "selbstpflege und wann arztliche hilfe suchen",
//     "selbstpflege wann arztliche hilfe suchen",
//     "selbstpflege & wann zum arzt",

//     // Hindi
//     "sv dekhbhal aur kab doctor se sampark kare",
//     "स्व-देखभाल और कब डॉक्टर से संपर्क करें",
//     "स्व देखभाल और कब डॉक्टर से संपर्क करें",

//     // Spanish
//     "autocuidado y cuando consultar",
//     "autocuidado y cuando buscar ayuda",
//     "autocuidado y cuando acudir al medico",
//     "autocuidado y cuando ir al medico",

//     // Chinese
//     "自我护理及何时就医",
//     "自我护理与何时就医",
//     "自我照护及何时就医",

//     // Arabic
//     "العناية الذاتية ومتى يجب طلب المساعدة",
//     "العناية الذاتية ومتى يجب استشارة الطبيب",
//     "الرعاية الذاتية ومتى يجب طلب المساعدة",

//     // Portuguese
//     "autocuidados e quando procurar ajuda",
//     "autocuidados e quando consultar",
//     "autocuidado e quando procurar ajuda",

//     // Russian
//     "самопомощь и когда обращаться к врачу",
//     "самоуход и когда обращаться за помощью",

//     // Japanese
//     "セルフケアと受診の目安",
//     "セルフケアと医師に相談すべきタイミング",

//     // Italian
//     "autocura e quando consultare un medico",
//     "autocura e quando chiedere aiuto",

//     // Korean
//     "자가 관리 및 언제 진료를 받아야",
//     "자가관리 및 병원에 가야 할 때",

//     // Dutch
//     "zelfzorg en wanneer hulp te zoeken",
//     "zelfzorg en wanneer naar de arts",

//     // Turkish
//     "kendi kendine bakim ve ne zaman doktora gitmeli",
//     "oz bakim ve ne zaman yardim aramali",

//     // Polish
//     "samoopieka i kiedy szukac pomocy",
//     "samoopieka i kiedy udac sie do lekarza",

//     // Thai
//     "การดแลตนเองและควรไปพบแพทยเมอใด",
//     "การดูแลตนเองและควรไปพบแพทย์เมื่อใด",

//     // Scandinavian / Finnish
//     "egenvard och nar du ska soka vard",
//     "egenomsorg og hvornar du skal soge hjælp",
//     "egenomsorg og nar du bor soke hjelp",
//     "omahoito ja milloin hakea apua",

//     // Other
//     "αυτοφροντιδα και ποτε να ζητησετε βοηθεια",
//     "samopozorovani a kdy vyhledat pomoc",
//     "ingrijire personala si cand sa cereti ajutor",
//     "onellatas es mikor keressen orvosi segitseget",
//     "טיפול עצמי ומתי לפנות לעזרה",
//     "penjagaan diri & bila perlu mendapatkan bantuan",
//     "tu cham soc va khi nao can di kham",
//     "perawatan diri dan kapan harus mencari bantuan",
//     "самодопомога та коли звернутися до лікаря",
//     "নিজ যত্ন ও কখন চিকিৎসা নিতে হবে",
//     "ਆਪਣੀ ਦੇਖਭਾਲ ਅਤੇ ਕਦੋਂ ਡਾਕਟਰ ਕੋਲ ਜਾਣਾ",
//     "pag-aalaga sa sarili at kailan dapat magpakonsulta",
//   ],
//   doctorRec: [
//     // English
//     "doctor recommendation",
//     "doctor recommendation & closing lines",
//     "doctor recommendation and closing lines",

//     // French
//     "recommandation du medecin",
//     "recommandations du medecin",

//     // German
//     "arztliche empfehlung",
//     "empfehlung arzt",

//     // Spanish
//     "recomendacion del medico",
//     "recomendaciones del medico",

//     // Portuguese
//     "recomendacao do medico",
//     "recomendacoes do medico",

//     // Russian
//     "рекомендация врача",
//     "рекомендации врача",

//     // Arabic
//     "توصية الطبيب",
//     "توصيات الطبيب",

//     // Chinese/Japanese/Korean
//     "医生建议",
//     "医師の推奨",
//     "의사 권고",
//   ],
//   topConditions: [
//     // English
//     "top 3 conditions",
//     "top 3 conditions (probabilities)",
//     "top conditions",
//     "clinical possibilities",

//     // French
//     "3 principales affections",
//     "affections principales",

//     // Spanish
//     "3 principales afecciones",
//     "afecciones principales",

//     // German
//     "wahrscheinliche diagnosen",

//     // Portuguese
//     "3 principais condicoes",
//     "condicoes principais",

//     // Russian
//     "топ 3 состояния",
//     "вероятные состояния",

//     // Arabic
//     "أهم 3 حالات",
//     "أكثر 3 حالات احتمالاً",

//     // CJK
//     "前三种情况",
//     "上位3つの可能性",
//     "상위 3가지 가능성",
//   ],
//   confidence: [
//     // English
//     "ai assessment confidence",
//     "assessment confidence",
//     "confidence",

//     // French
//     "confiance",
//     "confiance de l evaluation",

//     // Spanish/Portuguese
//     "confianza",
//     "confianca",

//     // German
//     "zuversicht",
//     "vertrauen",

//     // Russian
//     "уверенность",

//     // Arabic
//     "الثقة",
//     "مستوى الثقة",
//   ],
// };

// const KEYWORD_GROUPS = {
//   selfCare: [
//     // English
//     ["self", "care"],
//     ["seek", "help"],
//     ["when", "to", "seek"],
//     ["for", "self", "care"],
//     ["home", "care"],

//     // French (IMPORTANT fixes)
//     ["autosoins"],
//     ["pour", "les", "autosoins"],
//     ["soins", "personnels"],
//     ["soin", "personnel"],
//     ["quand", "consulter"],
//     ["demander", "de", "l", "aide"],

//     // German
//     ["selbstpflege"],
//     ["arztliche", "hilfe"],

//     // Spanish
//     ["autocuidado"],
//     ["para", "el", "autocuidado"],
//     ["cuando", "consultar"],

//     // Portuguese
//     ["autocuidados"],
//     ["quando", "procurar"],

//     // Russian
//     ["самопомощ"],
//     ["когда", "обращаться"],

//     // Arabic
//     ["العناية", "الذاتية"],
//     ["متى", "يجب"],

//     // CJK
//     ["自我护理"],
//     ["セルフケア"],
//     ["자가", "관리"],

//     // ✅ IMPORTANT: removed overly-generic ["care"] fallback
//   ],

//   doctorRec: [
//     // English
//     ["doctor", "recommendation"],
//     ["medical", "recommendation"],
//     ["conclusion"],

//     // French
//     ["recommandation", "medicale"],
//     ["recommandation"],
//     ["conclusion"],
//     ["prendre", "rendez", "vous"],

//     // German
//     ["arzt"],
//     ["empfehlung"],

//     // Spanish / Portuguese
//     ["recomendacion"],
//     ["recomendacao"],

//     // Russian / Arabic / CJK
//     ["рекомендац"],
//     ["توصية"],
//     ["医生"],
//     ["医師"],
//     ["의사"],
//   ],

//   jsonFence: [["```json"], ["```"]],
// };

// function lineMatchesAlias(lineNorm, aliases = []) {
//   if (!lineNorm) return false;
//   // heading often contains ":" or extra spaces; allow "startsWith" and "includes"
//   return aliases.some((a) => {
//     const an = normalizeLine(a);
//     return lineNorm === an || lineNorm.startsWith(an) || lineNorm.includes(an);
//   });
// }

// function lineMatchesKeywords(lineNorm, groups = []) {
//   if (!lineNorm) return false;
//   return groups.some((tokens) =>
//     tokens.every((t) => lineNorm.includes(normalizeLine(t)))
//   );
// }

// /** Heuristic: is this line a heading (vs a lead-in sentence like "Pour les autosoins: ...") */
// function isHeadingLike(rawLine = "", normLine = "") {
//   const s = String(rawLine || "").trim();
//   const n = String(normLine || "").trim();
//   if (!s || !n) return false;

//   // headings are usually short
//   if (s.length > 90) return false;

//   // headings typically don't end with sentence punctuation
//   if (/[.!?]$/.test(s)) return false;

//   // allow common heading punctuation
//   if (s.includes("&") || s.includes("—") || s.includes("-")) return true;

//   // colon can appear in lead-ins too; only treat as heading if short-ish and title-like
//   const wc = n.split(" ").filter(Boolean).length;
//   if (s.includes(":")) return wc >= 2 && wc <= 8 && s.length <= 55;

//   // otherwise short title-like lines
//   return wc >= 2 && wc <= 10;
// }

// /** If self-care is detected on a lead-in line, keep the content after ":" if present */
// function stripLeadInPrefix(rawLine = "") {
//   const s = String(rawLine || "").trim();
//   if (!s) return "";
//   if (s.includes(":")) {
//     const after = s.split(":").slice(1).join(":").trim();
//     return after || s;
//   }
//   return s;
// }

// /**
//  * Extract the Self-care section for ANY language.
//  * It returns { cleaned, selfCare } where cleaned is the summary with the self-care block removed.
//  *
//  * ✅ FIX: If the match is a lead-in sentence (e.g., "Pour les autosoins: ..."),
//  * we include that line in selfCare instead of skipping it.
//  */
// function splitOutSelfCareMultilang(summary) {
//   if (!summary) return { cleaned: "", selfCare: "" };

//   const lines = String(summary).split("\n");
//   const normLines = lines.map(normalizeLine);

//   // Find start heading line for self-care
//   let startIdx = -1;
//   for (let i = 0; i < normLines.length; i++) {
//     const ln = normLines[i];
//     if (
//       lineMatchesAlias(ln, HEADING_ALIASES.selfCare) ||
//       lineMatchesKeywords(ln, KEYWORD_GROUPS.selfCare)
//     ) {
//       startIdx = i;
//       break;
//     }
//   }

//   // If no heading found, fallback to old English “For self-care …” style
//   if (startIdx === -1) {
//     const m = String(summary).match(
//       /(For\s+(?:self-care|now|immediate relief)[\s\S]*?)(?=\n\s*\n|DOCTOR RECOMMENDATION|Please book an appointment|Take care of yourself|```json|$)/i
//     );
//     if (!m) return { cleaned: String(summary).trim(), selfCare: "" };

//     const selfCare = m[1].trim();
//     const before = summary.slice(0, m.index);
//     const after = summary.slice(m.index + m[0].length);
//     const cleaned = (before + after).trim();
//     return { cleaned, selfCare };
//   }

//   // Decide if the matched line is a true heading or a lead-in sentence
//   const startIsHeading = isHeadingLike(lines[startIdx], normLines[startIdx]);

//   // Find end of self-care section: stop at doctor recommendation, top conditions, confidence, json fence, or end.
//   let endIdx = lines.length;
//   for (let i = startIdx + 1; i < normLines.length; i++) {
//     const ln = normLines[i];

//     const isStopHeading =
//       lineMatchesAlias(ln, HEADING_ALIASES.doctorRec) ||
//       lineMatchesAlias(ln, HEADING_ALIASES.topConditions) ||
//       lineMatchesAlias(ln, HEADING_ALIASES.confidence) ||
//       lineMatchesKeywords(ln, KEYWORD_GROUPS.doctorRec) ||
//       lineMatchesKeywords(ln, KEYWORD_GROUPS.jsonFence);

//     if (isStopHeading) {
//       endIdx = i;
//       break;
//     }
//   }

//   // Self-care content:
//   // - If it's a heading => content starts AFTER heading line
//   // - If it's a lead-in sentence => include that line, but strip the prefix before ":" if present
//   let selfCareLines = [];
//   if (startIsHeading) {
//     selfCareLines = lines.slice(startIdx + 1, endIdx);
//   } else {
//     const first = stripLeadInPrefix(lines[startIdx]);
//     selfCareLines = [first, ...lines.slice(startIdx + 1, endIdx)].filter(Boolean);
//   }

//   const selfCare = selfCareLines.join("\n").trim();

//   // Remove from cleaned (including the start line)
//   const cleanedLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx)];
//   const cleaned = cleanedLines.join("\n").trim();

//   return { cleaned, selfCare };
// }

// /* ------------------------------------------------------------------ */
// /*  Helpers: parsing summary / report                                 */
// /* ------------------------------------------------------------------ */

// // 🔍 ENHANCED: Function to strip ALL unwanted sections from English summary
// function stripUnwantedSectionsFromEnglishSummary(summary) {
//   if (!summary || typeof summary !== "string") return summary;

//   let cleaned = summary;

//   // 1. Remove "FINAL CLINICAL OUTPUT" header
//   cleaned = cleaned.replace(/FINAL\s*CLINICAL\s*OUTPUT\s*/i, "");

//   // 2. Remove the "AI ASSESSMENT CONFIDENCE" section and everything after it
//   const confidenceIndex = cleaned.search(/AI\s*ASSESSMENT\s*CONFIDENCE/i);
//   if (confidenceIndex !== -1) {
//     cleaned = cleaned.substring(0, confidenceIndex).trim();
//   }

//   // 3. Also try removing from "TOP 3 CONDITIONS" if confidence section wasn't found
//   const topConditionsIndex = cleaned.search(/TOP\s*3\s*CONDITIONS/i);
//   if (topConditionsIndex !== -1 && confidenceIndex === -1) {
//     cleaned = cleaned.substring(0, topConditionsIndex).trim();
//   }

//   // 4. Remove "DOCTOR RECOMMENDATION" if still present
//   const doctorRecIndex = cleaned.search(/DOCTOR\s*RECOMMENDATION/i);
//   if (doctorRecIndex !== -1) {
//     cleaned = cleaned.substring(0, doctorRecIndex).trim();
//   }

//   // 5. Remove fenced code blocks
//   cleaned = cleaned.replace(/```json[\s\S]*?```/gi, "");
//   cleaned = cleaned.replace(/```[\s\S]*?```/gi, "");

//   // 6. Remove lines that look like unwanted sections
//   cleaned = cleaned
//     .split("\n")
//     .filter((line) => {
//       const trimmed = line.trim();
//       if (!trimmed) return true;
//       if (/^(AI ASSESSMENT|TOP \d+ CONDITIONS|DOCTOR RECOMMENDATION|```)/i.test(trimmed))
//         return false;
//       if (/\d+\s*%\s*[A-Za-z]/.test(trimmed)) return false;
//       if (/[A-Za-z].*\s*-\s*\d+\s*%/.test(trimmed)) return false;
//       if (/^\s*[{}\[\]]/.test(trimmed)) return false;
//       return true;
//     })
//     .join("\n");

//   // 7. Clean multiple blank lines
//   cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

//   return cleaned;
// }

// // 🔍 UPDATED: Function to extract clean clinical summary from English text
// function extractCleanClinicalSummary(englishSummary) {
//   if (!englishSummary) return "";

//   // First apply the comprehensive stripping function
//   let cleanSummary = stripUnwantedSectionsFromEnglishSummary(englishSummary);

//   // If stripping removed too much, try alternative extraction
//   if (!cleanSummary || cleanSummary.length < 50) {
//     const narrativeMatch = englishSummary.match(
//       /^[\s\S]*?(?=AI\s*ASSESSMENT\s*CONFIDENCE|TOP\s*3\s*CONDITIONS|DOCTOR\s*RECOMMENDATION|```json)/i
//     );

//     if (narrativeMatch) {
//       cleanSummary = narrativeMatch[0].trim();
//     } else {
//       cleanSummary = englishSummary.substring(0, 500).trim();
//     }

//     cleanSummary = cleanSummary.replace(/```json[\s\S]*?```/gi, "");
//   }

//   // Format nicely
//   cleanSummary = cleanSummary
//     .replace(/\s+/g, " ")
//     .replace(/\s*\.\s*/g, ". ")
//     .replace(/\s*,\s*/g, ", ")
//     .trim();

//   if (cleanSummary && !cleanSummary.endsWith(".") && !cleanSummary.endsWith("!")) {
//     cleanSummary += ".";
//   }

//   return cleanSummary;
// }

// // ✅ UPDATED: Extract self-care using multilingual headings
// function extractSelfCareText(anyLanguageSummary) {
//   if (!anyLanguageSummary) return "";
  
//   console.log("Extracting self-care from:", anyLanguageSummary.substring(0, 200) + "...");
  
//   // First try the multilingual extraction
//   const { selfCare } = splitOutSelfCareMultilang(anyLanguageSummary);
  
//   if (selfCare) {
//     console.log("Found self-care via multilingual extractor:", selfCare.substring(0, 100));
//     return selfCare;
//   }
  
//   // If multilingual extraction didn't work, try English-specific patterns
//   console.log("Multilingual extractor didn't find self-care, trying English patterns...");
  
//   // Pattern 1: Look for "SELF-CARE & WHEN TO SEEK HELP" section
//   const selfCareSection = anyLanguageSummary.match(
//     /SELF-CARE\s*[&-]?\s*WHEN\s+TO\s+SEEK\s+HELP\s*:?\s*\n([\s\S]*?)(?=DOCTOR RECOMMENDATION|```json|$)/i
//   );
  
//   if (selfCareSection && selfCareSection[1]) {
//     console.log("Found English self-care section:", selfCareSection[1].substring(0, 100));
//     return selfCareSection[1].trim();
//   }
  
//   // Pattern 2: Look for "For self-care" lead-in
//   const leadInMatch = anyLanguageSummary.match(
//     /For\s+self-care[^.]*\.\s*([^.]*\.(?:\s*[^.]*\.){0,3})/i
//   );
  
//   if (leadInMatch) {
//     console.log("Found 'For self-care' lead-in:", leadInMatch[0].substring(0, 100));
//     return leadInMatch[0].trim();
//   }
  
//   console.log("No self-care found in any format");
//   return "";
// }

// // 🔍 ENHANCED: Function to extract conditions and confidence from English summary
// function extractConditionsAndConfidenceFromEnglishSummary(englishSummary) {
//   if (!englishSummary) return { conditions: [], confidence: null };

//   const conditions = [];
//   let confidence = null;

//   // Extract confidence
//   const confidenceMatch = englishSummary.match(/confidence[^0-9]*(\d+)\s*%/i);
//   if (confidenceMatch) {
//     confidence = parseInt(confidenceMatch[1], 10);
//   }

//   // Extract conditions from the TOP 3 CONDITIONS section
//   const conditionsSectionMatch = englishSummary.match(
//     /TOP\s*3\s*CONDITIONS\s*\(PROBABILITIES\)[\s\S]*?(?=SELF-CARE|DOCTOR RECOMMENDATION|```json|$)/i
//   );

//   if (conditionsSectionMatch) {
//     const conditionsText = conditionsSectionMatch[0];
//     const conditionLines = conditionsText.split("\n");

//     for (const line of conditionLines) {
//       const trimmedLine = line.trim();

//       // Match: "Something (60%)"
//       const pattern1 = /(.+?)\s*\((\d+)\s*%\)$/;
//       // Match: "60% Something"
//       const pattern2 = /^(\d+)\s*%\s*(.+)$/;

//       let conditionName = "";
//       let percentage = 0;

//       const match1 = trimmedLine.match(pattern1);
//       if (match1) {
//         conditionName = match1[1].trim();
//         percentage = parseInt(match1[2], 10);
//       } else {
//         const match2 = trimmedLine.match(pattern2);
//         if (match2) {
//           percentage = parseInt(match2[1], 10);
//           conditionName = match2[2].trim();
//         }
//       }

//       if (conditionName && percentage > 0 && percentage <= 100) {
//         conditionName = conditionName
//           .replace(/^\d+%/, "")
//           .replace(/\([^)]*\)$/, "")
//           .trim();

//         if (conditionName && !conditionName.toLowerCase().includes("confidence")) {
//           conditions.push({ name: conditionName, percentage });
//         }
//       }
//     }
//   }

//   conditions.sort((a, b) => b.percentage - a.percentage);
//   return { conditions, confidence };
// }

// // 🔍 UPDATED: Function to process English summary for display
// function processEnglishSummaryForDisplay(englishSummary) {
//   if (!englishSummary) return "";

//   // First, extract the main clinical summary WITHOUT stripping self-care
//   let cleanSummary = extractCleanClinicalSummary(englishSummary);

//   // If we got a clean summary, check if it contains self-care
//   // If not, we might need to preserve more content
//   if (cleanSummary) {
//     // Check if self-care is still in the clean summary
//     const hasSelfCare = cleanSummary.toLowerCase().includes("self-care") || 
//                        cleanSummary.toLowerCase().includes("when to seek");
    
//     // If self-care was stripped out, we need to get it back
//     if (!hasSelfCare) {
//       // Try to get the self-care section from the original
//       const selfCareSection = englishSummary.match(
//         /SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP[\s\S]*?(?=DOCTOR RECOMMENDATION|```json|$)/i
//       );
      
//       if (selfCareSection) {
//         // Append self-care to the clean summary
//         cleanSummary = cleanSummary.trim() + "\n\n" + selfCareSection[0].trim();
//       }
//     }
//   }

//   // Fallback if cleanSummary is empty
//   if (!cleanSummary || cleanSummary.length < 50) {
//     const sections = ["AI ASSESSMENT", "TOP 3 CONDITIONS", "DOCTOR RECOMMENDATION", "```json"];
//     let earliestIndex = Infinity;

//     for (const section of sections) {
//       const index = englishSummary.indexOf(section);
//       if (index !== -1 && index < earliestIndex) earliestIndex = index;
//     }

//     if (earliestIndex !== Infinity && earliestIndex > 50) {
//       cleanSummary = englishSummary.substring(0, earliestIndex).trim();
//     } else {
//       const paragraphs = englishSummary.split(/\n\s*\n/);
//       if (paragraphs.length > 0) cleanSummary = paragraphs[0].trim();
//       else cleanSummary = englishSummary.trim();
//     }
//   }

//   return cleanSummary;
// }

// // 🔍 UPDATED: Enhanced parseConditionsAndConfidence function
// export function parseConditionsAndConfidence(summary) {
//   if (!summary || typeof summary !== "string") {
//     return { conditions: [], confidence: null };
//   }

//   console.log("Parsing summary for conditions...");
  
//   // First try the English summary format - more robust extraction
//   const englishConditions = extractConditionsAndConfidenceFromEnglishSummary(summary);
  
//   if (englishConditions.conditions.length > 0 || englishConditions.confidence !== null) {
//     console.log("Found conditions via English extractor:", englishConditions);
//     return englishConditions;
//   }

//   console.log("No conditions found via English extractor, trying fallback...");
  
//   // Fallback to original parser with improvements
//   let confidence = null;
//   const conditions = [];
//   const usedNames = new Set();

//   // Try multiple confidence patterns
//   const confidencePatterns = [
//     /confidence[^0-9]*(\d+)\s*%/i,
//     /about\s*(\d+)\s*%\s*confident/i,
//     /I(?:\s+am|['']m)\s+(\d+)\s*%\s*confident/i,
//     /AI\s*ASSESSMENT\s*CONFIDENCE[^0-9]*(\d+)/i,
//   ];

//   for (const pat of confidencePatterns) {
//     const match = summary.match(pat);
//     if (match && match[1]) {
//       const conf = Number(match[1]);
//       if (!isNaN(conf) && conf > 0 && conf <= 100) {
//         confidence = conf;
//         break;
//       }
//     }
//   }

//   // Look for TOP 3 CONDITIONS section
//   const topConditionsRegex = /TOP\s*3\s*CONDITIONS\s*(?:\(PROBABILITIES\))?\s*:?\s*\n?([\s\S]*?)(?=\n\s*\n[A-Z]|SELF-CARE|DOCTOR RECOMMENDATION|```json|$)/i;
//   const topMatch = summary.match(topConditionsRegex);
  
//   if (topMatch && topMatch[1]) {
//     const conditionsText = topMatch[1];
//     console.log("Found TOP CONDITIONS section:", conditionsText);
    
//     // Split by lines and parse each condition
//     const lines = conditionsText.split('\n');
    
//     for (const line of lines) {
//       const trimmed = line.trim();
//       if (!trimmed) continue;
      
//       // Try patterns:
//       // 1. "Something (60%)"
//       // 2. "60% Something"
//       // 3. "Something - 60%"
      
//       let conditionName = "";
//       let percentage = 0;
      
//       // Pattern 1: "Viral infection (common cold, early flu) (60%)"
//       const pattern1 = /(.+?)\s*\((\d+)\s*%\)$/;
//       // Pattern 2: "60% Viral infection"
//       const pattern2 = /^(\d+)\s*%\s*(.+)$/;
//       // Pattern 3: "Viral infection - 60%"
//       const pattern3 = /(.+?)\s*[-—]\s*(\d+)\s*%$/;
      
//       const match1 = trimmed.match(pattern1);
//       const match2 = trimmed.match(pattern2);
//       const match3 = trimmed.match(pattern3);
      
//       if (match1) {
//         conditionName = match1[1].replace(/\([^)]*\)/g, '').trim(); // Remove nested parentheses
//         percentage = parseInt(match1[2], 10);
//       } else if (match2) {
//         percentage = parseInt(match2[1], 10);
//         conditionName = match2[2].trim();
//       } else if (match3) {
//         conditionName = match3[1].trim();
//         percentage = parseInt(match3[2], 10);
//       }
      
//       if (conditionName && percentage > 0 && percentage <= 100) {
//         // Clean up condition name
//         conditionName = conditionName
//           .replace(/^\d+%/, '')
//           .replace(/\([^)]*\)$/, '')
//           .trim();
          
//         if (conditionName && !conditionName.toLowerCase().includes('confidence')) {
//           const key = conditionName.toLowerCase();
//           if (!usedNames.has(key)) {
//             usedNames.add(key);
//             conditions.push({ name: conditionName, percentage });
//           }
//         }
//       }
//     }
//   }
  
//   // If still no conditions found, try a broader search
//   if (conditions.length === 0) {
//     const broadPattern = /(\d+)\s*%\s*([A-Za-z][^.!?\n]{3,50}?)(?=\s*(?:\d+%|\.|\n|$))/g;
//     let match;
    
//     while ((match = broadPattern.exec(summary)) !== null && conditions.length < 3) {
//       const percentage = parseInt(match[1], 10);
//       let conditionName = match[2].trim();
      
//       if (percentage > 0 && percentage <= 100 && conditionName) {
//         conditionName = conditionName.replace(/\([^)]*\)/g, '').trim();
        
//         if (!conditionName.toLowerCase().includes('confidence')) {
//           const key = conditionName.toLowerCase();
//           if (!usedNames.has(key)) {
//             usedNames.add(key);
//             conditions.push({ name: conditionName, percentage });
//           }
//         }
//       }
//     }
//   }

//   console.log("Final parsed conditions:", conditions);
//   console.log("Final confidence:", confidence);
  
//   return {
//     conditions: conditions.sort((a, b) => b.percentage - a.percentage).slice(0, 3),
//     confidence,
//   };
// }

// function stripTopConditionsFromSummary(summary) {
//   if (!summary) return "";

//   let cleaned = summary;

//   cleaned = cleaned.replace(
//     /I(?:\s+am|['']m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.!\n]*[:.]?/gi,
//     ""
//   );

//   cleaned = cleaned.replace(
//     /TOP\s*\d*\s*CONDITIONS(?:\s*\(PROBABILITIES\))?\s*:\s*[\s\S]*?(?=SELF-CARE\s*&\s*WHEN\s+TO\s+SEEK\s+HELP|For\s+(?:self-care|now|immediate relief)|DOCTOR RECOMMENDATION|Please book an appointment|Please book|Take care of yourself|$)/gi,
//     ""
//   );

//   cleaned = cleaned.replace(
//     /CLINICAL\s+POSSIBILITIES[\s\S]*?(?=CLINICAL\s+PLAN\s*&\s*DISPOSITION|For\s+self-care|For\s+now|AI assessment confidence|$)/gi,
//     ""
//   );

//   cleaned = cleaned
//     .split("\n")
//     .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
//     .join("\n");

//   return cleaned.trim();
// }

// // ✅ UPDATED: keep old function, but you should prefer splitOutSelfCareMultilang everywhere
// function stripDiacritics(s = "") {
//   return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// }

// function normLine(s = "") {
//   return stripDiacritics(String(s || ""))
//     .toLowerCase()
//     .replace(/[^\p{L}\p{N}\s:&-]/gu, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function splitOutSelfCare(summary) {
//   if (!summary) return { cleaned: "", selfCare: "" };

//   // Remove fenced blocks first (JSON etc.)
//   const raw = String(summary).replace(/```[\s\S]*?```/g, "").trim();
//   const lines = raw.split("\n");
//   const normLines = lines.map(normLine);

//   // ---- START markers (headings) ----
//   const SELFCARE_HEADING_PATTERNS = [
//     // English
//     /^(self\s*[- ]?care).*?(when|seek).*(help|care)\b/i,
//     // French examples
//     /^(soins?\s+personnels?).*(quand).*(consulter|demander de l aide)\b/i,
//     /^(autosoins?).*(quand).*(consulter|demander de l aide)\b/i,
//     // Generic
//     /^self\s*[- ]?care\b/i,
//   ];

//   // ---- START markers (lead-in sentence, no heading) ----
//   const SELFCARE_LEADIN_PATTERNS = [
//     // English
//     /^for\s+self\s*[- ]?care\b/i,
//     /^home\s+care\b/i,

//     // French
//     /^pour\s+les?\s+autosoins\b/i,
//     /^pour\s+le\s+soin\s+personnel\b/i,
//     /^conseils?\s+de\s+soins?\s+personnels?\b/i,

//     // Spanish
//     /^para\s+el\s+autocuidado\b/i,

//     // German
//     /^zur\s+selbstpflege\b/i,
//   ];

//   // ---- END markers (doctor recommendation / conclusion) ----
//   const END_PATTERNS = [
//     // English
//     /^doctor\s+recommendation\b/i,
//     /^recommendation\b/i,

//     // French
//     /^recommandation\s+medicale\b/i,
//     /^conclusion\b/i,
//     /^veuillez\s+prendre\s+rendez[- ]vous\b/i,
//   ];

//   function isHeadingLike(rawLine = "", normLine = "") {
//   const s = String(rawLine || "").trim();
//   const n = String(normLine || "").trim();
//   if (!s || !n) return false;

//   // headings are usually short
//   if (s.length > 90) return false;  // ❌ This line is probably longer than 90 chars!

//   // headings typically don't end with sentence punctuation
//   if (/[.!?]$/.test(s)) return false; // ❌ This might end with "..."

//   // allow common heading punctuation
//   if (s.includes("&") || s.includes("—") || s.includes("-")) return true; // ✅ This returns true

//     const wc = n.split(" ").filter(Boolean).length;
//     return wc >= 2 && wc <= 10;
//   };

//   const matchesAny = (n, patterns) => patterns.some((re) => re.test(n));

//   let startIdx = -1;
//   let startIsHeading = false;

//   // 1) Try headings first
//   for (let i = 0; i < normLines.length; i++) {
//     const n = normLines[i];
//     if (!n) continue;
//     if (!isHeadingLikeOld(lines[i], n)) continue;
//     if (matchesAny(n, SELFCARE_HEADING_PATTERNS)) {
//       startIdx = i;
//       startIsHeading = true;
//       break;
//     }
//   }

//   // 2) Lead-in sentences
//   if (startIdx === -1) {
//     for (let i = 0; i < normLines.length; i++) {
//       const n = normLines[i];
//       if (!n) continue;
//       if (matchesAny(n, SELFCARE_LEADIN_PATTERNS)) {
//         startIdx = i;
//         startIsHeading = false;
//         break;
//       }
//     }
//   }

//   if (startIdx === -1) {
//     return { cleaned: raw.trim(), selfCare: "" };
//   }

// // Find end of self-care section: stop at doctor recommendation, top conditions, confidence, json fence, or end.
// let endIdx = lines.length;
// for (let i = startIdx + 1; i < normLines.length; i++) {
//   const ln = normLines[i];
  
//   const isStopHeading =
//     lineMatchesAlias(ln, HEADING_ALIASES.doctorRec) ||
//     lineMatchesAlias(ln, HEADING_ALIASES.topConditions) ||
//     lineMatchesAlias(ln, HEADING_ALIASES.confidence) ||
//     lineMatchesKeywords(ln, KEYWORD_GROUPS.doctorRec) ||
//     lineMatchesKeywords(ln, KEYWORD_GROUPS.jsonFence);

//   if (isStopHeading) {
//     endIdx = i;
//     break;
//   }
// }

//   const selfCareStart = startIsHeading ? startIdx + 1 : startIdx;
//   const selfCare = lines.slice(selfCareStart, endIdx).join("\n").trim();

//   const cleaned = (lines.slice(0, startIdx).join("\n") + "\n" + lines.slice(endIdx).join("\n"))
//     .replace(/\n{3,}/g, "\n\n")
//     .trim();

//   return { cleaned, selfCare };
// }

// function extractConsultDataFromMessage(raw) {
//   if (!raw) {
//     return { summaryText: "", report: null, conditions: [], confidence: null };
//   }

//   let summaryText = raw;
//   let report = null;

//   const jsonMatch = raw.match(/```json([\s\S]*?)```/i);
//   if (jsonMatch) {
//     const jsonText = jsonMatch[1].trim();
//     summaryText = raw.slice(0, jsonMatch.index).trim();

//     try {
//       const parsed = JSON.parse(jsonText);
//       report = parsed.CIRA_CONSULT_REPORT || parsed["CIRA_CONSULT_REPORT"] || parsed;
//     } catch (e) {
//       console.warn("Failed to parse CIRA_CONSULT_REPORT JSON:", e);
//     }
//   }

//   summaryText = summaryText.replace(/```json|```/gi, "").trim();

//   const baseNameForDedup = (name) => {
//     let s = String(name || "").toLowerCase();
//     s = s.split(" – ")[0];
//     s = s.split(" - ")[0];
//     s = s.split("(")[0];
//     s = s.replace(/[^a-z0-9]+/g, "");
//     return s.trim();
//   };

//   const looksLikeNonCondition = (name) => {
//     const s = String(name || "");
//     return /medication|pharmacist|recommendation|disclaimer/i.test(s) || /self-care|when to seek help/i.test(s) || /💊|⚠️|‼️/.test(s);
//   };

//   let conditions = [];
//   let confidence = null;

//   if (report && report["📊 PROBABILITY ESTIMATES"]) {
//     const prob = report["📊 PROBABILITY ESTIMATES"];
//     if (prob && typeof prob === "object") {
//       conditions = Object.entries(prob)
//         .map(([name, value]) => {
//           if (looksLikeNonCondition(name)) return null;
//           const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
//           if (Number.isNaN(num)) return null;
//           return { name, percentage: num };
//         })
//         .filter(Boolean);
//     }
//   }

//   if (report && report["🤖 SYSTEM INFO"]) {
//     const info = report["🤖 SYSTEM INFO"];
//     if (info && info["Confidence Level"]) {
//       const m = String(info["Confidence Level"]).match(/(\d+)/);
//       if (m) confidence = Number(m[1]);
//     }
//   }

//   const parsedFromSummary = parseConditionsAndConfidence(summaryText);
//   if (parsedFromSummary.conditions?.length) {
//     conditions = parsedFromSummary.conditions;
//   }

//   if (confidence == null && parsedFromSummary.confidence != null) {
//     confidence = parsedFromSummary.confidence;
//   }

//   conditions = (conditions || []).filter((c) => c && !looksLikeNonCondition(c.name));

//   if (conditions.length) {
//     const seen = new Set();
//     const deduped = [];
//     for (const c of conditions) {
//       const key = baseNameForDedup(c.name);
//       if (!key || seen.has(key)) continue;
//       seen.add(key);
//       deduped.push(c);
//     }

//     conditions = deduped
//       .filter((c) => typeof c.percentage === "number" && c.percentage > 0)
//       .sort((a, b) => b.percentage - a.percentage)
//       .slice(0, 3);
//   }

//   return { summaryText, report, conditions, confidence };
// }

// function normalizeConditionName(name = "") {
//   return String(name)
//     .toLowerCase()
//     .replace(/[-—]+/g, " ")
//     .replace(/[^a-z0-9\s]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function dedupeConditions(conditions = []) {
//   const map = new Map();

//   for (const c of conditions) {
//     const rawName = (c && c.name) || "";
//     const norm = normalizeConditionName(rawName);

//     if (!norm || /^-+$/.test(rawName.trim())) continue;

//     const pct = typeof c.percentage === "number" ? c.percentage : 0;

//     if (!map.has(norm)) {
//       map.set(norm, { ...c, percentage: pct });
//     } else {
//       const existing = map.get(norm);
//       if (pct > (existing.percentage || 0)) {
//         map.set(norm, { ...c, percentage: pct });
//       }
//     }
//   }

//   return Array.from(map.values()).sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
// }

// function shortConditionName(name = "") {
//   const raw = String(name);
//   const beforeColon = raw.split(":")[0];
//   const beforeParen = beforeColon.split("(")[0];
//   const trimmed = beforeParen.trim();
//   return trimmed || raw;
// }

// function extractMainSymptomFromText(text = "") {
//   const lower = text.toLowerCase();

//   const has = (re) => re.test(lower);
//   const not = (re) => !re.test(lower);

//   const ccMatch = text.match(/(chief complaint[^:]*:\s*)(.+?)(?:\.|\n|$)/i);
//   if (ccMatch && ccMatch[2]) {
//     const cc = ccMatch[2].trim();
//     if (cc.length <= 80) return cc.charAt(0).toUpperCase() + cc.slice(1);
//   }

//   const presentMatch = text.match(/\b(presenting with|complaining of|experiencing)\s+([^.\n]{5,80})/i);
//   if (presentMatch && presentMatch[2]) {
//     let phrase = presentMatch[2].trim();
//     const cutWords = ["that", "which", "since", "for", "because"];
//     const lowerPhrase = phrase.toLowerCase();
//     let cutAt = Infinity;
//     cutWords.forEach((w) => {
//       const idx = lowerPhrase.indexOf(`${w} `);
//       if (idx !== -1 && idx < cutAt) cutAt = idx;
//     });
//     if (cutAt !== Infinity) phrase = phrase.slice(0, cutAt).trim();
//     if (phrase.length <= 80) return phrase.charAt(0).toUpperCase() + phrase.slice(1);
//   }

//   if (has(/\bheadache(s)?\b/i) && not(/no headache/i)) return "Headache";
//   if (has(/\bback pain\b/i) && not(/no back pain/i)) return "Back pain";
//   if (has(/\babdominal pain\b|\bstomach pain\b|\bbelly pain\b/i) && not(/no abdominal pain/i)) return "Abdominal pain";
//   if (has(/\bchest pain\b/i) && not(/no chest pain/i)) return "Chest pain";
//   if (has(/\bshortness of breath\b|\bdifficulty breathing\b|\bbreathlessness\b/i) && not(/no shortness of breath/i))
//     return "Shortness of breath";

//   const feverPositive =
//     /(have|having|with|got|developed|presenting with)\s+(a\s+)?fever\b/i.test(text) ||
//     /\bfever\b\s+(since|for)\b/i.test(text) ||
//     /\bfever\b\s*(and|with)\b/i.test(text);

//   if (feverPositive && not(/no fever|without fever|denies fever/i)) {
//     if (/\bbody aches?\b|\bgeneralized aches?\b/i.test(lower)) {
//       return "Fever with body aches";
//     }
//     return "Fever";
//   }

//   if (has(/\bsore throat\b/i) && not(/no sore throat/i)) return "Sore throat";
//   if (has(/\bnausea\b|\bvomiting\b/i) && not(/no nausea|no vomiting/i)) return "Nausea / vomiting";
//   if (has(/\bdiarrhea\b/i) && not(/no diarrhea/i)) return "Diarrhea";
//   if (has(/\brash\b/i) && not(/no rash/i)) return "Rash";

//   return "";
// }

// function extractLikelyNameFromSummary(text = "") {
//   if (!text) return null;

//   const IGNORE = new Set([
//     "Thank",
//     "Thanks",
//     "Given",
//     "Based",
//     "Alright",
//     "Okay",
//     "Ok",
//     "Just",
//     "So",
//     "Since",
//     "Because",
//     "While",
//     "However",
//     "Although",
//     "This",
//     "That",
//     "There",
//     "Here",
//     "For",
//     "From",
//     "Please",
//     "Viral",
//     "Mild",
//     "Other",
//     "These",
//     "Those",
//     "Fever",
//     "Back",
//     "Abdominal",
//     "Chest",
//     "Headache",
//     "Cira",
//     "AI",
//     "Clinical",
//     "Your",
//     "Summary",
//     "Summarize",
//     "Summarised",
//     "Summarized",
//   ]);

//   const matches = text.match(/\b[A-Z][a-z]{2,}\b/g);
//   if (!matches) return null;

//   const counts = {};
//   for (const w of matches) {
//     if (IGNORE.has(w)) continue;
//     counts[w] = (counts[w] || 0) + 1;
//   }

//   let best = null;
//   let bestCount = 0;
//   for (const [w, c] of Object.entries(counts)) {
//     if (c > bestCount) {
//       best = w;
//       bestCount = c;
//     }
//   }

//   if (best && /summar/i.test(best)) return null;
//   return bestCount > 0 ? best : null;
// }

// function extractDemographicsFromSummary(text = "") {
//   if (!text) return { name: null, age: null, gender: null };

//   let name = null;
//   let age = null;
//   let gender = null;

//   const normalizeSex = (s) => {
//     const v = String(s || "").toLowerCase();
//     if (v === "female" || v === "woman") return "Female";
//     if (v === "male" || v === "man") return "Male";
//     return null;
//   };

//   let m;

//   m = text.match(/\b(?:Hi|Hello|Hey|Salaam|Salam|Assalam|Alright|Okay|Ok)[,!\s]+([A-Z][a-z]{2,})\b/);
//   if (m) name = m[1];

//   m = text.match(/\b([A-Z][a-z]{2,})\b\s*,\s*(\d{1,3})\s*,\s*(male|female|man|woman)\b/i) || m;
//   if (m && m.length >= 4) {
//     if (!name) name = m[1];
//     age = m[2];
//     gender = normalizeSex(m[3]);
//   }

//   if (!age || !gender) {
//     const m2 = text.match(
//       /\b([A-Z][a-z]{2,})\b[^.\n]{0,120}?\b(\d{1,3})\s*[-—]?\s*year[- ]old\s+(male|female|man|woman)\b/i
//     );
//     if (m2) {
//       if (!name) name = m2[1];
//       age = age || m2[2];
//       gender = gender || normalizeSex(m2[3]);
//     }
//   }

//   if (!age || !gender) {
//     const m3 = text.match(/\b(\d{1,3})\s*[-—]?\s*year[- ]old\s+(male|female|man|woman)\b/i);
//     if (m3) {
//       age = age || m3[1];
//       gender = gender || normalizeSex(m3[2]);
//     }
//   }

//   if (!age) {
//     const m4 = text.match(/\b(\d{1,3})\s*[-—]?\s*year[- ]old\b/i);
//     if (m4) age = m4[1];
//   }

//   if (!name) name = extractLikelyNameFromSummary(text);
//   if (name && /summar/i.test(name)) name = null;

//   return { name, age, gender };
// }

// export function extractRosFromSummary(text = "") {
//   if (!text) {
//     return {
//       chips: [],
//       note: "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.",
//     };
//   }

//   const chipsSet = new Set();

//   const negativePatterns = [
//     /\bno\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bdenies\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bwithout\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bnegative for\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//     /\bnot experiencing\s+([a-zA-Z0-9 ,\-\/]+)/gi,
//   ];

//   const stopWords = ["but", "however", "though", "although", "except", "despite"];

//   const cleanSymptom = (sym) =>
//     sym.replace(/(^and\s+|^\s*,\s*|^\s*or\s*|\s*\.$)/gi, "").trim().replace(/\s+/g, " ");

//   const extractFromMatch = (match) => {
//     if (!match) return;
//     let list = match.split(/,|and|or/gi);
//     list.forEach((raw) => {
//       let symptom = cleanSymptom(raw);
//       if (stopWords.some((w) => symptom.toLowerCase().startsWith(w))) return;
//       if (symptom.length > 1) chipsSet.add("No " + symptom);
//     });
//   };

//   for (const pattern of negativePatterns) {
//     let m;
//     while ((m = pattern.exec(text)) !== null) {
//       extractFromMatch(m[1]);
//     }
//   }

//   [...chipsSet].forEach((c) => {
//     if (/no symptoms?$/i.test(c) && chipsSet.size > 1) chipsSet.delete(c);
//   });

//   const chips = [...chipsSet].slice(0, 8);

//   const sentences = text.split(/(?<=[.!?])\s+/);
//   let rosNote = "";

//   for (const s of sentences) {
//     if (/(no\s+\w+|denies|without|negative for|not experiencing)/i.test(s)) {
//       rosNote = s.trim();
//       break;
//     }
//   }

//   if (!rosNote) {
//     rosNote =
//       "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";
//   }

//   return { chips, note: rosNote };
// }

// // 🔍 NEW: Function to detect and separate English and user language summaries
// function separateSummaries(rawText) {
//   if (!rawText) return { englishSummary: "", userLanguageSummary: "" };

//   const lowerText = rawText.toLowerCase();

//   const hasEnglishCanonical = lowerText.includes("🔷 final output — english (canonical)");
//   const hasUserLanguageVersion = lowerText.includes("🔷 final output — user language version");

//   if (!hasEnglishCanonical && !hasUserLanguageVersion) {
//     return { englishSummary: "", userLanguageSummary: rawText };
//   }

//   let englishSummary = "";
//   let userLanguageSummary = "";

//   const userLangMarker = /🔷 FINAL OUTPUT — USER LANGUAGE VERSION/i;
//   const userLangMatch = rawText.match(userLangMarker);

//   if (userLangMatch) {
//     const userLangIndex = userLangMatch.index;

//     englishSummary = rawText.slice(0, userLangIndex).trim();
//     const englishMarker = /🔷 FINAL OUTPUT — ENGLISH \(CANONICAL\).*\n/i;
//     englishSummary = englishSummary.replace(englishMarker, "").trim();

//     userLanguageSummary = rawText
//       .slice(userLangIndex + userLangMatch[0].length)
//       .trim()
//       .replace(/🔷 FINAL OUTPUT — USER LANGUAGE VERSION/i, "")
//       .trim();
//   } else {
//     englishSummary = rawText;
//     userLanguageSummary = "";
//   }

//   return { englishSummary, userLanguageSummary };
// }

// /* ------------------------------------------------------------------ */
// /*  Component                                                          */
// /* ------------------------------------------------------------------ */

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

//   // 🔹 Final consult summaries - separate English and user language
//   const [englishConsultSummary, setEnglishConsultSummary] = useState(null);
//   const [userLanguageConsultSummary, setUserLanguageConsultSummary] = useState(null);
//   const [summaryCreatedAt, setSummaryCreatedAt] = useState(null);

//   // 🔹 Parsed stats from report (conditions + confidence) - extracted from English summary
//   const [summaryStats, setSummaryStats] = useState({ conditions: [], confidence: null });

//   // 🔹 Parsed CIRA_CONSULT_REPORT JSON (used only for PDF) - extracted from English summary
//   const [consultReport, setConsultReport] = useState(null);

//   const [isThinking, setIsThinking] = useState(false);
//   const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

//   const scrollAreaRef = useRef(null);
//   const [hasStartedChat, setHasStartedChat] = useState(false);

//   // 🧩 Extra state for modal flow
//   const [conversationSummary, setConversationSummary] = useState("");
//   const [showDoctorRecommendationPopUp, setShowDoctorRecommendationPopUp] = useState(false);
//   const [doctorRecommendationData, setDoctorRecommendationData] = useState(null);

//   const [showFacialScanPopUp, setShowFacialScanPopUp] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);

//   const [showVitals, setShowVitals] = useState(false);
//   const [vitalsData, setVitalsData] = useState(null);

//   const [showDoctorRecommendation, setShowDoctorRecommendation] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(false);
//   const [showPayment, setShowPayment] = useState(false);
//   const [showAppointment, setShowAppointment] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);

//   const isAnyModalOpen =
//     showDoctorRecommendationPopUp ||
//     showFacialScanPopUp ||
//     showVitals ||
//     showDoctorRecommendation ||
//     showPayment ||
//     showAppointment ||
//     showConfirmation;

//   const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
// const [isProLocked, setIsProLocked] = useState(true); // pro feature lock ON

//   const downloadMenuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
//         setIsDownloadMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

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

//       const trimmedText = text.trim();
//       const isAssistant = role === "assistant" || role === "ai" || role === "agent";

//       if (!isAssistant) {
//         console.log("💬 Non-assistant message from SDK:", payload);
//         return;
//       }

//       const lower = trimmedText.toLowerCase();

//       // 🔐 Only treat as final consult summary when strict closing lines or JSON marker appears
//       const looksLikeSummary =
//         lower.includes(
//           "please book an appointment with a doctor so you can make sure you're getting the best care possible"
//         ) ||
//         lower.includes("take care of yourself, and i hope you feel better soon") ||
//         lower.includes("cira_consult_report");

//       setIsThinking(false);

//       if (looksLikeSummary) {
//         console.log("📝 Captured consult summary (potentially bilingual).");

//         const { englishSummary, userLanguageSummary } = separateSummaries(trimmedText);

//         setIsThinking(false);
//         setIsGeneratingSummary(true);

//         // Extract report/stats from ENGLISH summary if present, else fallback to whole text
//         const extracted = extractConsultDataFromMessage(englishSummary || trimmedText);

//         setEnglishConsultSummary(englishSummary || trimmedText);
//         setUserLanguageConsultSummary(userLanguageSummary || trimmedText);
//         setSummaryCreatedAt(new Date());

//         setConversationSummary(userLanguageSummary || englishSummary || trimmedText);

//         setSummaryStats({
//           conditions: extracted.conditions || [],
//           confidence: typeof extracted.confidence === "number" ? extracted.confidence : null,
//         });
//         setConsultReport(extracted.report || null);

//         setTimeout(() => {
//           setIsGeneratingSummary(false);
//         }, 1500);

//         disconnectAssistant();
//         return;
//       }

//       // Regular assistant message (not a summary)
//       setIsThinking(false);
//       setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: trimmedText }]);
//     },
//     onError: (err) => {
//       console.error("❌ ElevenLabs chat error:", err);
//       setError("Something went wrong while talking to Cira. Please try again.");
//       setIsThinking(false);
//     },
//   });

//   const disconnectAssistant = useCallback(() => {
//     try {
//       conversation?.endSession?.();
//     } catch (e) {
//       console.warn("⚠️ Error ending ElevenLabs session:", e);
//     } finally {
//       setIsConnected(false);
//     }
//   }, [conversation]);

//   const { status, sendUserMessage } = conversation;

//   const ensureConnected = useCallback(async () => {
//     if (status === "connected" || isConnecting) return;

//     try {
//       setIsConnecting(true);
//       const convId = await conversation.startSession({ agentId: CHAT_AGENT_ID });
//       console.log("🧵 Chat session started:", convId);
//       setIsConnected(true);
//     } catch (err) {
//       console.error("Failed to start chat session:", err);
//       setError("Couldn't connect to Cira. Please refresh and try again.");
//     } finally {
//       setIsConnecting(false);
//     }
//   }, [status, isConnecting, conversation]);

//   const locationInitialMessage = location.state?.initialMessage;
//   const effectiveInitialMessage = initialMessageProp ?? locationInitialMessage;

//   useEffect(() => {
//     if (!effectiveInitialMessage) return;
//     if (initialSentRef.current) return;
//     initialSentRef.current = true;

//     const sendInitial = async () => {
//       const trimmed = effectiveInitialMessage.trim();
//       if (!trimmed) return;

//       setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
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
//   }, [messages, isThinking, userLanguageConsultSummary]);

//   const startedTime = new Date();
//   const startedLabel = startedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const summaryDateLabel =
//     summaryCreatedAt &&
//     summaryCreatedAt.toLocaleString([], {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

// // Use pre-parsed stats from English summary, but dedupe condition list
// let parsedSummary = { conditions: [], confidence: null };

// if (englishConsultSummary) {
//   // Always parse directly from the English summary to ensure we get conditions
//   const freshlyParsed = parseConditionsAndConfidence(englishConsultSummary);
  
//   // Use freshly parsed data, fallback to summaryStats
//   parsedSummary = {
//     conditions: dedupeConditions(freshlyParsed.conditions || summaryStats.conditions || []),
//     confidence: freshlyParsed.confidence !== null ? freshlyParsed.confidence : summaryStats.confidence,
//   };
  
//   console.log("Freshly parsed conditions:", freshlyParsed.conditions);

// }

//   // Display summary & self-care
//   let displaySummary = "";
//   let selfCareText = "";

//   if (userLanguageConsultSummary) {
//     let baseSummary = userLanguageConsultSummary.trim();

//     const markerRegex =
//       /(CIRA_CONSULT_REPORT|🏥\s*CIRA HEALTH CONSULTATION REPORT|AI-Generated Medical Snapshot)/i;
//     const markerMatch = baseSummary.match(markerRegex);

//     if (markerMatch && markerMatch.index > 120) {
//       baseSummary = baseSummary.slice(0, markerMatch.index).trim();
//     }

//     // ✅ MULTI-LANGUAGE self-care extraction (fix is inside splitOutSelfCareMultilang)
//     const withoutTop = stripTopConditionsFromSummary(baseSummary);
//     const split = splitOutSelfCareMultilang(withoutTop);
//     displaySummary = split.cleaned;
//     selfCareText = split.selfCare;

//     const CLOSING_LINE =
//       "Please book an appointment with a doctor so you can make sure you're getting the best care possible. Take care of yourself, and I hope you feel better soon 💙";

//     const CLOSING_TOKEN = "__CIRA_CLOSING_LINE__";
//     displaySummary = displaySummary.replace(CLOSING_LINE, CLOSING_TOKEN);

//     displaySummary = displaySummary
//       .replace(/CLINICAL SUMMARY\s*:?\s*/gi, "")
//       .replace(/FINAL\s*CLINICAL\s*OUTPUT\s*:?\s*/gi, "")

//       .replace(/AI\s*ASSESSMENT\s*CONFIDENCE[\s\S]*$/gi, "")
//       .replace(/TOP\s*\d+\s*CONDITIONS?[^\n]*[\s\S]*$/gi, "")
//       .replace(/TOP\s*3\s*CONDITIONS?[^\n]*[\s\S]*$/gi, "")
//       .replace(/TOP\s*CONDITIONS?[^\n]*[\s\S]*$/gi, "")
//       .replace(/DOCTOR\s*RECOMMENDATION[^\n]*[\s\S]*$/gi, "")
//       .replace(/DOCTOR\s*RECOMMENDATION\s*&\s*CLOSING\s*LINES[\s\S]*$/gi, "")
//       .replace(/RECOMMENDATION[^\n]*[\s\S]*$/gi, "")

//       .replace(/```json[\s\S]*?```/gi, "")
//       .replace(/```[\s\S]*?```/g, "")
//       .replace(/\{[\s\S]*"patient"[\s\S]*\}[\s\S]*$/gi, "")

//       .replace(
//         /I(?:\s+am|['’]m)[^.!\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions|assessment)[^.!\n]*[.?!]/gi,
//         ""
//       )
//       .replace(/^\s*Here are the[^\n]*\n?/gim, "")

//       // only remove standalone "Take care of yourself," lines (don’t delete closing line)
//       .replace(/^\s*Take care of yourself,\s*.*$/gim, "")

//       .split("\n")
//       .map((l) => l.trimEnd())
//       .filter((line) => {
//         const trimmed = line.trim();
//         if (!trimmed) return false;
//         if (/^AI\s*ASSESSMENT\s*CONFIDENCE/i.test(trimmed)) return false;
//         if (/^TOP\s*\d*\s*CONDITIONS/i.test(trimmed)) return false;
//         if (/^DOCTOR\s*RECOMMENDATION/i.test(trimmed)) return false;
//         if (/^```/.test(trimmed)) return false;
//         if (/^\{/.test(trimmed) || /^\}/.test(trimmed)) return false;
//         return true;
//       })
//       .join("\n")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim();

//     displaySummary = displaySummary.replace(CLOSING_TOKEN, "").trim();

//     if (!displaySummary.endsWith("💙")) {
//       displaySummary = displaySummary ? `${displaySummary}\n\n${CLOSING_LINE}` : CLOSING_LINE;
//     }

//     // fallback self-care
//     if (!selfCareText) {
//       selfCareText =
//         "Rest, fluids, and basic home care are usually enough for mild symptoms. If symptoms worsen, new symptoms appear, or you feel concerned at any point, please contact a doctor or urgent care.";
//     }

//     if (!displaySummary) {
//       if (parsedSummary?.conditions?.length) {
//         const main = parsedSummary.conditions
//           .slice(0, 3)
//           .map((c) => `${c.name} (${c.percentage}%)`)
//           .join(", ");
//         displaySummary =
//           `Based on what you told me, there are a few possible explanations for your symptoms. ` +
//           `The main ones I'm considering are: ${main}. ` +
//           `Please discuss these with a doctor for a full examination and diagnosis.`;
//       } else {
//         displaySummary =
//           "Based on the information you shared, this most likely represents a mild, self-limiting problem, " +
//           "but you should still speak with a doctor if your symptoms worsen, new symptoms appear, or you're worried at any point.";
//       }
//     }

//     if (!displaySummary || !displaySummary.trim()) {
//       displaySummary = "I’m here with you — could you tell me a bit more about how you’re feeling?";
//     }
// }  else if (englishConsultSummary) {
//   // ✅ EXTRACT SELF-CARE FIRST from the ORIGINAL summary
//   selfCareText = extractSelfCareText(englishConsultSummary);
  
//   // ✅ Create a clean display summary WITHOUT removing self-care
//   displaySummary = englishConsultSummary;
  
//   // Only remove JSON blocks and closing lines, keep everything else
//   displaySummary = displaySummary.replace(/```json[\s\S]*?```/gi, "").trim();
  
//   // Remove the standard closing line if present
//   const closingLineRegex = /Please book an appointment with a doctor[\s\S]*Take care of yourself[\s\S]*$/i;
//   displaySummary = displaySummary.replace(closingLineRegex, "").trim();
  
//   // Also remove CIRA_CONSULT_REPORT markers
//   displaySummary = displaySummary.replace(/CIRA_CONSULT_REPORT[\s\S]*$/i, "").trim();
  
//   // If self-care was successfully extracted, remove it from displaySummary
//   // so it doesn't appear twice (once in summary, once in self-care section)
//   if (selfCareText) {
//     // Find and remove the self-care section from displaySummary
//     const selfCareRegex = /SELF-CARE\s*[&-]?\s*WHEN\s+TO\s+SEEK\s+HELP[\s\S]*?(?=DOCTOR RECOMMENDATION|```json|$)/i;
//     displaySummary = displaySummary.replace(selfCareRegex, "").trim();
    
//     // Also try removing "For self-care" lead-in patterns
//     const leadInRegex = /For\s+self-care[^.]*\.[^.]*\.?(?:\s*[^.]*\.){0,2}/i;
//     displaySummary = displaySummary.replace(leadInRegex, "").trim();
//   }
  
//   // Clean up extra whitespace
//   displaySummary = displaySummary.replace(/\n{3,}/g, "\n\n").trim();
  
//   // Fallback for self-care
//   if (!selfCareText) {
//     selfCareText = "Home care with rest, fluids, and over-the-counter pain relievers is usually enough for most mild illnesses. " +
//       "If your fever rises, breathing becomes difficult, you have chest pain, fainting, confusion, severe dehydration, " +
//       "or your symptoms last more than a few days or suddenly worsen, contact a doctor or urgent care.";
//   }
  
//   // If displaySummary is now empty or too short, use a more conservative cleaning
//   if (!displaySummary || displaySummary.trim().length < 50) {
//     // Try a gentler cleaning approach
//     displaySummary = englishConsultSummary
//       .replace(/```json[\s\S]*?```/gi, "")
//       .replace(/CIRA_CONSULT_REPORT[\s\S]*$/i, "")
//       .replace(/Please book an appointment[\s\S]*Take care of yourself[\s\S]*$/i, "")
//       .trim();
//   }
  
//   if (!displaySummary || !displaySummary.trim()) {
//     displaySummary = "Thanks for sharing that. I can help—what symptom is bothering you the most right now?";
//   }
// }

//   console.log("Tips-", selfCareText);

//   const handleUserMessage = async (text) => {
//     if (!hasAgreed) return;
//     const trimmed = text.trim();
//     if (!trimmed) return;

//     setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);

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
//     document.body.style.overflow = "auto";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   const buildPdfPayload = () => {
//     if (!englishConsultSummary) {
//       console.warn("❌ No English consultSummary available for PDF generation");
//       return null;
//     }

//     const combinedSummary = englishConsultSummary.trim();
// // ------------------------------------------------------------------
//   // SAFE NORMALIZER (prevents [object Object] everywhere)
//   // ------------------------------------------------------------------
//   const normalizeText = (val) => {
//     if (!val) return null;
//     if (typeof val === "string") return val.trim();
//     if (typeof val === "number") return String(val);
//     if (Array.isArray(val)) return val.join(", ");
//     if (typeof val === "object") {
//       return (
//         val.text ||
//         val.label ||
//         val.value ||
//         val.primarySymptom ||
//         null
//       );
//     }
//     return null;
//   };

//     // ------------------------------------------------------------------
//     // ENHANCED EXTRACTION FUNCTION WITH RELIEVING/WORSENING FACTORS
//     // ------------------------------------------------------------------
//     const extractCurrentIssueFromSummary = (text) => {
//       if (!text) return null;

//       const currentIssue = {
//         primarySymptom: "Not specified",
//         onset: "Not specified",
//         pattern: "Not specified",
//         severity: "Not specified",
//         recentInjury: "No",
//         associatedFactors: "None reported",
//         location: "Not specified",
//         relievingFactors: "None reported",
//         worseningFactors: "None reported",
//         chronicIllnesses: "None reported",
//         previousSurgeries: "None reported",
//         medications: "None reported",
//         allergies: "None reported",
//       };

//       /* -------------------- Primary symptom -------------------- */
//     const symptomPatterns = [
//       /(?:complains of|reporting|presenting with|symptoms? of|has|experiencing|feeling)\s+([^.!?]+?)(?:for|since|\.|\?|!|$)/i,
//       /(?:chief complaint|main concern|primary issue)[:\-]?\s*([^.!?]+)/i,
//       /(?:symptom|pain|ache|discomfort|problem)[:\-]?\s*([^.!?]+)/i,
//     ];

//     for (const pattern of symptomPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1]?.trim().length > 3) {
//         currentIssue.primarySymptom = match[1].trim();
//         break;
//       }
//     }

//     if (currentIssue.primarySymptom === "Not specified") {
//       const commonSymptoms = [
//         "headache","migraine","fever","cough","sore throat","runny nose",
//         "nausea","vomiting","diarrhea","constipation","fatigue","weakness",
//         "dizziness","vertigo","shortness of breath","chest pain",
//         "abdominal pain","back pain","neck pain","joint pain",
//         "muscle ache","rash","itch",
//       ];

//       for (const symptom of commonSymptoms) {
//         if (text.toLowerCase().includes(symptom)) {
//           currentIssue.primarySymptom =
//             symptom.charAt(0).toUpperCase() + symptom.slice(1);
//           break;
//         }
//       }
//     }

//       // Onset
//       const onsetPatterns = [
//         /(\d+)\s+(day|week|month|hour)s?\s+ago/i,
//         /(?:since|for)\s+(\d+)\s+(day|week|month|hour)/i,
//         /(?:onset|started|began)\s+(?:about|approximately)?\s*(\d+)\s+(day|week|month|hour)/i,
//         /last\s+(night|evening|morning|afternoon|week|month)/i,
//         /yesterday/i,
//         /today/i,
//       ];

//       for (const pattern of onsetPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (pattern.toString().includes("last")) currentIssue.onset = `Last ${match[1]}`;
//           else if (match[0].toLowerCase() === "yesterday") currentIssue.onset = "Yesterday";
//           else if (match[0].toLowerCase() === "today") currentIssue.onset = "Today";
//           else {
//             const num = match[1];
//             const unit = match[2];
//             currentIssue.onset = `Approximately ${num} ${unit}${parseInt(num, 10) > 1 ? "s" : ""} ago`;
//           }
//           break;
//         }
//       }

//       // Pattern
//       if (text.toLowerCase().match(/(constant|persistent|continuous|all the time|steady)/)) {
//         currentIssue.pattern = "Constant";
//       } else if (
//         text.toLowerCase().match(/(intermittent|comes and goes|on and off|waxing and waning|episodic)/)
//       ) {
//         currentIssue.pattern = "Intermittent";
//       } else if (text.toLowerCase().match(/(variable|changes|fluctuates)/)) {
//         currentIssue.pattern = "Variable";
//       }

//       // Severity
//       const severityPatterns = [
//         /(\d+(?:\.\d+)?)\s*\/\s*10/i,
//         /pain\s*(?:level|score|scale)?\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
//         /severity\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
//         /(\d+(?:\.\d+)?)\s*(?:out of|of|\/)\s*10/i,
//       ];

//       for (const pattern of severityPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           currentIssue.severity = `${match[1]} / 10`;
//           break;
//         }
//       }

//       if (currentIssue.severity === "Not specified") {
//         if (text.toLowerCase().match(/mild(?: pain)?/)) currentIssue.severity = "Mild (1-3/10)";
//         else if (text.toLowerCase().match(/moderate(?: pain)?/)) currentIssue.severity = "Moderate (4-6/10)";
//         else if (text.toLowerCase().match(/severe(?: pain)?/)) currentIssue.severity = "Severe (7-10/10)";
//       }

//       // Location
//       const locationPatterns = [
//         /(?:in|on|at)\s+(?:the\s+)?(head|neck|chest|back|abdomen|stomach|arm|leg|throat|nose|ear|eye)s?/i,
//         /(?:pain|ache|discomfort)\s+(?:in|on|at)\s+(?:the\s+)?([^.!?,]+)/i,
//         /(?:located|localized|felt)\s+(?:in|on|at)\s+(?:the\s+)?([^.!?,]+)/i,
//       ];

//       for (const pattern of locationPatterns) {
//         const match = text.match(pattern);
//         if (match && match[1]) {
//           currentIssue.location = match[1].trim();
//           break;
//         }
//       }

//       // Relieving factors
//       const relievingPatterns = [
//         /(?:better|relieved|improves|helps|eases|alleviated)\s+(?:with|by)\s+([^.!?]+?)(?:\.|\?|!|$)/i,
//         /(?:relief|improvement)\s+(?:with|after)\s+([^.!?]+)/i,
//         /(?:rest|lying down|sitting up|standing|walking|massage|heat|ice|medication|painkillers|ibuprofen|acetaminophen|tylenol|aspirin|naproxen)/i,
//         /(?:improved|better)\s+(?:after|when)\s+([^.!?]+)/i,
//       ];

//       for (const pattern of relievingPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (pattern.toString().includes("rest")) {
//             currentIssue.relievingFactors = "Rest";
//             break;
//           } else if (pattern.toString().includes("medication") || pattern.toString().includes("painkillers")) {
//             currentIssue.relievingFactors = "Medication";
//             break;
//           } else if (match[1]) {
//             currentIssue.relievingFactors = match[1].trim();
//             break;
//           } else {
//             if (text.toLowerCase().includes("rest")) currentIssue.relievingFactors = "Rest";
//             else if (text.toLowerCase().includes("medication")) currentIssue.relievingFactors = "Medication";
//             else if (text.toLowerCase().includes("lying down")) currentIssue.relievingFactors = "Lying down";
//             else if (text.toLowerCase().includes("sitting up")) currentIssue.relievingFactors = "Sitting up";
//           }
//         }
//       }

//       // Worsening factors
//       const worseningPatterns = [
//         /(?:worse|worsens|exacerbated|aggravated)\s+(?:with|by)\s+([^.!?]+?)(?:\.|\?|!|$)/i,
//         /(?:worsening|aggravation)\s+(?:with|during)\s+([^.!?]+)/i,
//         /(?:movement|activity|standing|walking|talking|coughing|deep breath|bending|lifting|straining)/i,
//         /(?:worse|intensifies)\s+(?:when|during)\s+([^.!?]+)/i,
//       ];

//       for (const pattern of worseningPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (pattern.toString().includes("movement")) {
//             currentIssue.worseningFactors = "Movement/Activity";
//             break;
//           } else if (pattern.toString().includes("coughing")) {
//             currentIssue.worseningFactors = "Coughing";
//             break;
//           } else if (match[1]) {
//             currentIssue.worseningFactors = match[1].trim();
//             break;
//           } else {
//             if (text.toLowerCase().includes("movement")) currentIssue.worseningFactors = "Movement";
//             else if (text.toLowerCase().includes("activity")) currentIssue.worseningFactors = "Physical activity";
//             else if (text.toLowerCase().includes("standing")) currentIssue.worseningFactors = "Standing";
//             else if (text.toLowerCase().includes("coughing")) currentIssue.worseningFactors = "Coughing";
//           }
//         }
//       }

//       // Injury
//       const injuryKeywords = ["injury", "trauma", "fell", "fall", "accident", "hit", "struck", "injured"];
//       for (const keyword of injuryKeywords) {
//         if (text.toLowerCase().includes(keyword)) {
//           currentIssue.recentInjury = "Yes";
//           break;
//         }
//       }

//       // Associated factors
//       const factors = [];
//       if (text.toLowerCase().match(/(light|bright|photophobia)/)) factors.push("Light sensitivity");
//       if (text.toLowerCase().match(/(sound|noise|phonophobia)/)) factors.push("Sound sensitivity");
//       if (text.toLowerCase().match(/(nausea|vomit)/)) factors.push("Nausea/Vomiting");
//       if (text.toLowerCase().match(/(fever|chill|sweat)/)) factors.push("Fever/Chills");
//       if (text.toLowerCase().match(/(dizziness|vertigo)/)) factors.push("Dizziness");
//       if (text.toLowerCase().match(/(fatigue|tired|weak)/)) factors.push("Fatigue");
//       if (text.toLowerCase().match(/(congestion|runny nose|sneezing)/)) factors.push("Nasal symptoms");
//       if (factors.length > 0) currentIssue.associatedFactors = factors.join(", ");

//       // Medical history
//       const medKeywords = [
//         "diabetes",
//         "hypertension",
//         "high blood pressure",
//         "asthma",
//         "allergy",
//         "migraine",
//         "arthritis",
//         "heart disease",
//         "copd",
//         "kidney disease",
//         "liver disease",
//         "thyroid",
//         "anemia",
//       ];
//       const foundConditions = [];
//       for (const condition of medKeywords) {
//         if (text.toLowerCase().includes(condition)) {
//           foundConditions.push(condition.charAt(0).toUpperCase() + condition.slice(1));
//         }
//       }
//       if (foundConditions.length > 0) currentIssue.chronicIllnesses = foundConditions.join(", ");

//       // Surgeries
//       const surgeryPatterns = [
//         /(?:surgery|operation|procedure)\s+(?:for|on)\s+([^.!?]+)/i,
//         /(?:had|underwent)\s+(?:a\s+)?(?:surgery|operation)\s+(?:for|on)?\s*([^.!?]+)/i,
//         /(?:appendectomy|tonsillectomy|cholecystectomy|hernia repair|knee surgery|hip replacement)/i,
//       ];
//       for (const pattern of surgeryPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (match[1]) currentIssue.previousSurgeries = match[1].trim();
//           else {
//             if (text.toLowerCase().includes("appendectomy")) currentIssue.previousSurgeries = "Appendectomy";
//             else if (text.toLowerCase().includes("tonsillectomy")) currentIssue.previousSurgeries = "Tonsillectomy";
//             else if (text.toLowerCase().includes("hernia")) currentIssue.previousSurgeries = "Hernia repair";
//           }
//           break;
//         }
//       }

//       // Medications
//       const medicationPatterns = [
//         /(?:taking|on|using|prescribed)\s+([^.!?]+?)(?:for|\.|\?|!|$)/i,
//         /medications?\s*(?:include|are|:)?\s*([^.!?]+)/i,
//         /(?:ibuprofen|acetaminophen|tylenol|aspirin|naproxen|antibiotic|antihistamine)/i,
//       ];
//       for (const pattern of medicationPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (match[1]) currentIssue.medications = match[1].trim();
//           else {
//             if (text.toLowerCase().includes("ibuprofen")) currentIssue.medications = "Ibuprofen";
//             else if (text.toLowerCase().includes("tylenol")) currentIssue.medications = "Tylenol";
//             else if (text.toLowerCase().includes("antibiotic")) currentIssue.medications = "Antibiotic";
//           }
//           break;
//         }
//       }

//       // Allergies
//       const allergyPatterns = [
//         /(?:allerg(?:ic|y|ies) to|allergic reaction to)\s+([^.!?]+)/i,
//         /(?:penicillin|sulfa|aspirin|ibuprofen|codeine|morphine)/i,
//       ];
//       for (const pattern of allergyPatterns) {
//         const match = text.match(pattern);
//         if (match) {
//           if (match[1]) currentIssue.allergies = match[1].trim();
//           else {
//             if (text.toLowerCase().includes("penicillin")) currentIssue.allergies = "Penicillin";
//             else if (text.toLowerCase().includes("sulfa")) currentIssue.allergies = "Sulfa drugs";
//           }
//           break;
//         }
//       }

//       return currentIssue;
//     };

//     const currentIssueData = extractCurrentIssueFromSummary(combinedSummary);

//     const { name: nameFromSummary, age: ageFromSummary, gender: genderFromSummary } =
//       extractDemographicsFromSummary(combinedSummary);

//     let patientInfo = {
//       name: nameFromSummary || null,
//       age: ageFromSummary || null,
//       gender: genderFromSummary || null,
//       consultDate: summaryCreatedAt
//         ? summaryCreatedAt.toLocaleDateString()
//         : new Date().toLocaleDateString(),
//     };

//     const deepFind = (obj, key) => {
//       if (!obj || typeof obj !== "object") return null;
//       if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
//       for (const value of Object.values(obj)) {
//         if (value && typeof value === "object") {
//           const result = deepFind(value, key);
//           if (result !== null && result !== undefined) return result;
//         }
//       }
//       return null;
//     };

//     let jsonData = {
//       patient_identity_baseline: {},
//       chief_complaint: {},
//       history_of_present_illness_hpi: {},
//       medical_background: {},
//       vital_signs_current_status: {},
//       lifestyle_risk_factors: {},
//       exposure_environment: {},
//       functional_status: {},
//       review_of_systems_traffic_light_view: {},
//       ai_clinical_assessment: {},
//     };

//     if (consultReport && typeof consultReport === "object") {
//       jsonData = { ...jsonData, ...consultReport };
//     }

//     jsonData.patient_identity_baseline = {
//       name:
//         jsonData.patient_identity_baseline?.name ||
//         deepFind(jsonData, "name") ||
//         nameFromSummary ||
//         "User",
//       age:
//         jsonData.patient_identity_baseline?.age ||
//         deepFind(jsonData, "age") ||
//         ageFromSummary ||
//         "",
//       biological_sex:
//         jsonData.patient_identity_baseline?.biological_sex ||
//         deepFind(jsonData, "biological_sex") ||
//         deepFind(jsonData, "gender") ||
//         genderFromSummary ||
//         "",
//       weight:
//         jsonData.patient_identity_baseline?.weight ||
//         deepFind(jsonData, "weight") ||
//         deepFind(jsonData, "Weight") ||
//         "Not specified",
//       height:
//         jsonData.patient_identity_baseline?.height ||
//         deepFind(jsonData, "height") ||
//         deepFind(jsonData, "Height") ||
//         "Not specified",
//     };

//     const extractedCC = extractMainSymptomFromText(combinedSummary);

// // helper to force string
// const normalizePrimaryConcern = (val) => {
//   if (!val) return null;
//   if (typeof val === "string") return val;
//   if (Array.isArray(val)) return val.join(", ");
//   if (typeof val === "object") {
//     return (
//       val.primary_concern ||
//       val.primarySymptom ||
//       val.text ||
//       val.label ||
//       JSON.stringify(val)
//     );
//   }
//   return String(val);
// };

// jsonData.chief_complaint = {
//   primary_concern: normalizePrimaryConcern(
//     jsonData.chief_complaint?.primary_concern ||
//       deepFind(jsonData, "primary_concern") ||
//       extractedCC ||
//       currentIssueData?.primarySymptom ||
//       "Not specified"
//   ),

//       onset:
//         jsonData.chief_complaint?.onset ||
//         deepFind(jsonData, "onset") ||
//         (currentIssueData?.onset || "Not specified"),
//       duration:
//         jsonData.chief_complaint?.duration ||
//         deepFind(jsonData, "duration") ||
//         "Not specified",
//       pattern:
//         jsonData.chief_complaint?.pattern ||
//         currentIssueData?.pattern ||
//         "Not specified",
//       severity:
//         jsonData.chief_complaint?.severity ||
//         (currentIssueData?.severity ? currentIssueData.severity.split("/")[0] : null),
//       previous_episodes:
//         jsonData.chief_complaint?.previous_episodes ||
//         deepFind(jsonData, "previous_episodes") ||
//         "None reported",
//       recent_injury: currentIssueData?.recentInjury || "No",
//     };

//     jsonData.history_of_present_illness_hpi = {
//       location_or_system:
//         jsonData.history_of_present_illness_hpi?.location_or_system ||
//         deepFind(jsonData, "location") ||
//         currentIssueData?.location ||
//         "General-systems",
//       severity_0_to_10:
//         jsonData.history_of_present_illness_hpi?.severity_0_to_10 ||
//         (currentIssueData?.severity
//           ? currentIssueData.severity.replace(/[^0-9.]/g, "").split("/")[0]
//           : null) ||
//         deepFind(jsonData, "severity") ||
//         null,
//       progression_pattern:
//         jsonData.history_of_present_illness_hpi?.progression_pattern ||
//         currentIssueData?.pattern ||
//         "Not specified",
//       associated_symptoms:
//         jsonData.history_of_present_illness_hpi?.associated_symptoms ||
//         (currentIssueData?.associatedFactors ? [currentIssueData.associatedFactors] : []) ||
//         (deepFind(jsonData, "associated_symptoms")
//           ? Array.isArray(deepFind(jsonData, "associated_symptoms"))
//             ? deepFind(jsonData, "associated_symptoms")
//             : [deepFind(jsonData, "associated_symptoms")]
//           : []),
//       relieving_factors:
//         jsonData.history_of_present_illness_hpi?.relieving_factors ||
//         currentIssueData?.relievingFactors ||
//         "None reported",
//       worsening_factors:
//         jsonData.history_of_present_illness_hpi?.worsening_factors ||
//         currentIssueData?.worseningFactors ||
//         "None reported",
//     };

//     jsonData.medical_background = {
//       chronic_illnesses:
//         jsonData.medical_background?.chronic_illnesses ||
//         deepFind(jsonData, "chronic_conditions") ||
//         deepFind(jsonData, "chronicIllnesses") ||
//         currentIssueData?.chronicIllnesses ||
//         "None reported",
//       previous_surgeries:
//         jsonData.medical_background?.previous_surgeries ||
//         deepFind(jsonData, "previous_surgeries") ||
//         currentIssueData?.previousSurgeries ||
//         "None reported",
//       current_medications:
//         jsonData.medical_background?.current_medications ||
//         deepFind(jsonData, "currentMedications") ||
//         currentIssueData?.medications ||
//         "None reported",
//       drug_allergies:
//         jsonData.medical_background?.drug_allergies ||
//         deepFind(jsonData, "allergies") ||
//         currentIssueData?.allergies ||
//         "None reported",
//       family_history:
//         jsonData.medical_background?.family_history ||
//         deepFind(jsonData, "family_history") ||
//         deepFind(jsonData, "familyHistory") ||
//         deepFind(jsonData, "family_medical_history") ||
//         deepFind(jsonData, "relevant_family_history") ||
//         "None reported",
//       pregnancy_status: jsonData.medical_background?.pregnancy_status || "Not_applicable",
//     };

//     jsonData.vital_signs_current_status = {
//       heart_rate_bpm:
//         jsonData.vital_signs_current_status?.heart_rate_bpm ||
//         (vitalsData?.heartRate ? `${vitalsData.heartRate}` : null),
//       oxygen_saturation_spo2_percent:
//         jsonData.vital_signs_current_status?.oxygen_saturation_spo2_percent ||
//         (vitalsData?.spo2 ? `${vitalsData.spo2}` : null),
//       core_temperature:
//         jsonData.vital_signs_current_status?.core_temperature ||
//         (vitalsData?.temperature ? `${vitalsData.temperature}` : null),
//       reported_fever:
//         jsonData.vital_signs_current_status?.reported_fever ||
//         (vitalsData?.hasFever ? "Yes" : "No"),
//       blood_pressure:
//         jsonData.vital_signs_current_status?.blood_pressure || "Not measured",
//       blood_pressure_measured:
//         jsonData.vital_signs_current_status?.blood_pressure_measured || "No",
//       temperature_measured:
//         jsonData.vital_signs_current_status?.temperature_measured || "Yes",
//     };

//     jsonData.lifestyle_risk_factors = {
//       smoking:
//         jsonData.lifestyle_risk_factors?.smoking ||
//         deepFind(jsonData, "smoking") ||
//         "No",
//       alcohol_use:
//         jsonData.lifestyle_risk_factors?.alcohol_use ||
//         deepFind(jsonData, "alcoholUse") ||
//         "No",
//       recreational_drugs: jsonData.lifestyle_risk_factors?.recreational_drugs || "No",
//       diet: jsonData.lifestyle_risk_factors?.diet || "Normal",
//       exercise_routine: jsonData.lifestyle_risk_factors?.exercise_routine || "Not specified",
//       stress_level: jsonData.lifestyle_risk_factors?.stress_level || "Mild",
//     };

//     jsonData.exposure_environment = {
//       recent_travel: jsonData.exposure_environment?.recent_travel || "No",
//       sick_contacts: jsonData.exposure_environment?.sick_contacts || "No",
//       crowded_events: jsonData.exposure_environment?.crowded_events || "No",
//       workplace_chemical_exposure: jsonData.exposure_environment?.workplace_chemical_exposure || "No",
//       weather_exposure: jsonData.exposure_environment?.weather_exposure || "None",
//       food_water_hygiene_concern: jsonData.exposure_environment?.food_water_hygiene_concern || "No",
//     };

//     jsonData.functional_status = {
//       eating_drinking_normally: jsonData.functional_status?.eating_drinking_normally || "Yes",
//       hydration: jsonData.functional_status?.hydration || "Adequate",
//       activity_level: jsonData.functional_status?.activity_level || "Normal",
//     };

//     const { chips: rosChips } = extractRosFromSummary(combinedSummary);

//     jsonData.review_of_systems_traffic_light_view = {
//       shortness_of_breath: {
//         present: false,
//         answer: rosChips.some((chip) => chip.toLowerCase().includes("breath")) ? "No" : "Unknown",
//         flag_level: "green",
//       },
//       chest_pain: {
//         present: false,
//         answer: rosChips.some((chip) => chip.toLowerCase().includes("chest")) ? "No" : "Unknown",
//         flag_level: "green",
//       },
//       sore_throat: {
//         present: false,
//         answer: rosChips.some((chip) => chip.toLowerCase().includes("throat")) ? "No" : "Unknown",
//         flag_level: "green",
//       },
//       body_aches_fatigue: {
//         present: false,
//         answer: rosChips.some((chip) => chip.toLowerCase().includes("ache") || chip.toLowerCase().includes("fatigue")) ? "No" : "Unknown",
//         flag_level: "green",
//       },
//       vomiting_diarrhea: {
//         present: false,
//         answer: rosChips.some((chip) => chip.toLowerCase().includes("vomit") || chip.toLowerCase().includes("diarrhea")) ? "No" : "Unknown",
//         flag_level: "green",
//       },
//     };

//     // ✅ MULTI-LANGUAGE self-care extraction for PDF too (from English canonical)
//     const { selfCare } = splitOutSelfCareMultilang(englishConsultSummary || "");

//     const parsedConfidence = parsedSummary?.confidence || null;

//     jsonData.ai_clinical_assessment = {
//       overall_stability: jsonData.ai_clinical_assessment?.overall_stability || "Stable",
//       red_flag_symptoms: jsonData.ai_clinical_assessment?.red_flag_symptoms || "None identified",
//       clinical_note_to_physician:
//         jsonData.ai_clinical_assessment?.clinical_note_to_physician ||
//         deepFind(jsonData, "clinicalAssessment") ||
//         englishConsultSummary ||
//         "Clinical assessment based on patient-reported symptoms.",
//       confidence: parsedConfidence,
//     };

//     if (!patientInfo.name) patientInfo.name = jsonData.patient_identity_baseline.name || "User";
//     if (!patientInfo.age) patientInfo.age = jsonData.patient_identity_baseline.age || "";
//     if (!patientInfo.gender) patientInfo.gender = jsonData.patient_identity_baseline.biological_sex || "";

//     const consultationData = {
//       ...jsonData,

//       patientName: patientInfo.name,
//       patientAge: patientInfo.age,
//       patientGender: patientInfo.gender,
//       consultDate: patientInfo.consultDate,

//       currentIssueData: currentIssueData || {
//         primarySymptom: jsonData.chief_complaint?.primary_concern || "Not specified",
//         onset: jsonData.chief_complaint?.onset || "Not specified",
//         pattern: jsonData.chief_complaint?.pattern || "Not specified",
//         severity: jsonData.chief_complaint?.severity || "Not specified",
//         recentInjury: jsonData.chief_complaint?.recent_injury || "No",
//         associatedFactors: jsonData.history_of_present_illness_hpi?.associated_symptoms?.join(", ") || "None reported",
//         location: jsonData.history_of_present_illness_hpi?.location_or_system || "Not specified",
//         relievingFactors: jsonData.history_of_present_illness_hpi?.relieving_factors || "None reported",
//         worseningFactors: jsonData.history_of_present_illness_hpi?.worsening_factors || "None reported",
//         chronicIllnesses: jsonData.medical_background?.chronic_illnesses || "None reported",
//         previousSurgeries: jsonData.medical_background?.previous_surgeries || "None reported",
//         medications: jsonData.medical_background?.current_medications || "None reported",
//         allergies: jsonData.medical_background?.drug_allergies || "None reported",
//       },

//       conditions: parsedSummary?.conditions || [],
//       confidence: parsedConfidence,
//       narrativeSummary: englishConsultSummary || "",
//       selfCareText: selfCare || "",
//       vitalsData: vitalsData || {},
//       chiefComplaint: jsonData.chief_complaint.primary_concern,

//       associatedSymptomsChips: rosChips,
//       associatedSymptomsNote: extractRosFromSummary(combinedSummary).note,

//       stripFollowupLines: true,
//       includeComprehensiveData: true,
//     };

//     return { consultationData, patientInfo };
//   };

//   const handleDownloadDoctorReportPDF = () => {
//     const payload = buildPdfPayload();
//     if (!payload) return;

//     const { consultationData, patientInfo } = payload;

//     downloadDoctorsReport(consultationData, patientInfo, `CIRA_Clinical_Intake_Report_${Date.now()}.pdf`);
//   };

//   const handleDownloadEHRSOAPPDF = () => {
//     const payload = buildPdfPayload();
//     if (!payload) return;

//     const { consultationData, patientInfo } = payload;

//     downloadEHRSOAPFromChatData(consultationData, patientInfo, `Cira_SOAP_Note_${Date.now()}.pdf`);
//   };

//   const handleFindDoctorSpecialistClick = () => {
//     if (!userLanguageConsultSummary) return;

//     const primaryCondition = parsedSummary.conditions[0]?.name || "your health concerns";

//     setDoctorRecommendationData({
//       condition: primaryCondition,
//       specialty: "General Physician",
//     });
//     setConversationSummary(userLanguageConsultSummary);
//     setShowDoctorRecommendationPopUp(true);
//   };

//   const handleFindSpecialistDoctorClick = () => {
//     setShowDoctorRecommendationPopUp(false);
//     setShowFacialScanPopUp(true);
//   };

//   const handleSkipDoctorRecommendation = () => {
//     setShowDoctorRecommendationPopUp(false);
//   };

//   const handleStartFacialScan = () => {
//     setIsScanning(true);
//     setShowFacialScanPopUp(false);

//     setTimeout(() => {
//       setIsScanning(false);
//       setVitalsData({
//         heartRate: 80,
//         spo2: 98,
//         temperature: 36.8,
//       });
//       setShowVitals(true);
//     }, 1500);
//   };

//   const handleSkipFacialScan = () => {
//     setShowFacialScanPopUp(false);
//   };

//   const handleContinueFromVitals = () => {
//     setShowVitals(false);
//     setShowDoctorRecommendation(true);
//   };

//   const handleSelectDoctor = (doctor) => {
//     setSelectedDoctor(doctor);
//     setShowDoctorRecommendation(false);
//     setShowPayment(true);
//   };

//   const handleSkipDoctor = () => {
//     setShowDoctorRecommendation(false);
//   };

//   const handlePaymentSuccess = (details) => {
//     setShowPayment(false);
//     setBookingDetails(details);
//     setShowAppointment(true);
//   };

//   const handlePaymentBack = () => {
//     setShowPayment(false);
//     setShowDoctorRecommendation(true);
//   };

//   const handleBookingSuccess = (details) => {
//     setShowAppointment(false);
//     setBookingDetails(details);
//     setShowConfirmation(true);
//   };

//   const handleAppointmentBack = () => {
//     setShowAppointment(false);
//     setShowPayment(true);
//   };

//   const handleConfirmationClose = () => {
//     setShowConfirmation(false);
//     setSelectedDoctor(null);
//     setBookingDetails(null);
//   };
// const leadFromNav = location.state?.lead || null;

// const [demoLead, setDemoLead] = useState(() => {
//   if (leadFromNav) return leadFromNav;
//   try {
//     const s = localStorage.getItem("cira_demo_lead");
//     return s ? JSON.parse(s) : null;
//   } catch {
//     return null;
//   }
// });


//   return (
//     <>
//       {/* dot wave keyframes (if not defined globally) */}
//       <style>{`
//         @keyframes dotWave {
//           0%, 60%, 100% { transform: translateY(0); opacity: .5; }
//           30% { transform: translateY(-4px); opacity: 1; }
//         }
//       `}</style>

//       <div className="fixed inset-0 w-full flex flex-col bg-[#FFFEF9]">
//         <div className="fixed top-0 left-0 right-0 z-50 md:z-0">
//           <Header />
//         </div>

//         <motion.div
//           ref={scrollAreaRef}
//           className="flex-1 overflow-y-auto"
//           initial={{ opacity: 0, y: 60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//         >
//           <div className="w-full flex justify-center min-h-full pb-48">
//             <div className="w-full max-w-xl">
//               <div className="px-4 pt-6 pb-8">
//                 <header className="mb-6 px-4 pt-24">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-15 h-15 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold">
//                         <img src={stars} className="w-9 h-9" alt="stars" />
//                       </div>
//                       <div className="flex -space-x-2">
//                         <img
//                           src={AgentAvatar}
//                           alt="Clinician"
//                           className="w-15 h-15 rounded-full border border-white object-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <h1 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-2">
//                     Cira Consult
//                   </h1>
//                   <p className="text-sm mt-5 text-gray-500 mb-1">
//                     Consult started: Today, {startedLabel}
//                   </p>
//                 </header>

//                 {error && (
//                   <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-full">
//                     {error}
//                   </div>
//                 )}

//                 <div className="border border-gray-200 mb-5" />

//                 <div className="space-y-4">
//                   {messages.map((m) => {
//                     const isAssistant = m.role === "assistant";
//                     return (
//                       <div
//                         key={m.id}
//                         className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
//                       >
//                         <div className="flex items-center">
//                           <div
//                             className={`px-4 py-4 text-sm ${
//                               isAssistant
//                                 ? "rounded-2xl text-gray-800"
//                                 : "rounded-2xl rounded-tr-none bg-pink-500 text-white"
//                             }`}
//                           >
//                             {m.text}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   {isThinking && (
//                     <div className="flex w-full justify-start">
//                       <div className="flex items-center gap-2 max-w-[80%]">
//                         <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-500">
//                           <span className="inline-flex gap-1 items-center">
//                             <span
//                               className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                               style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0s" }}
//                             />
//                             <span
//                               className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                               style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.15s" }}
//                             />
//                             <span
//                               className="w-1.5 h-1.5 rounded-full bg-gray-400"
//                               style={{ animation: "dotWave 1.2s infinite ease-in-out", animationDelay: "0.3s" }}
//                             />
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* SUMMARY CARD - Display USER LANGUAGE summary */}
               
//                 { /* HABIB UN comment kr do */ }
//                 {(userLanguageConsultSummary || englishConsultSummary) && (
//   <section className="w-full mt-6 mb-2">
//     <div className="relative bg-white shadow-sm border border-[#E3E3F3] px-5 py-6 overflow-hidden">
      
//       {/* ✅ Blur all content when locked */}
//       <div className={isProLocked ? "filter select-none pointer-events-none" : ""}>
//         {/* EVERYTHING INSIDE stays same */}
//         <div className="w-full flex justify-center my-4">
//           <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
//             <img src={AgentAvatar} alt="" className="w-32 rounded-full" />
//             <p className="text-xs text-gray-500">
//               Your AI clinician assistant, Cira
//             </p>
//           </div>
//         </div>

//         <div className="mb-3">
//           <h2 className="text-xl font-semibold text-gray-900 mb-1">
//             AI Consult Summary
//           </h2>
//           {summaryDateLabel && (
//             <p className="text-xs text-gray-400">{summaryDateLabel}</p>
//           )}
//         </div>

//         <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
//           {displaySummary}
//         </p>

//                           {parsedSummary.conditions.length > 0 && (
//                          <div className="mt-4 border-t border-gray-100 pt-4">
//                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                             Conditions Matching
//                          </h3>

//                           <div className="space-y-3">
//                            {parsedSummary.conditions.map((c, idx) => (
//                              <div
//                                 key={idx}
//                                 className="flex items-center justify-between text-sm"
//                               >
//                                 <div className="flex items-center gap-2">
//                                   <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
//                                    <span className="text-gray-800 truncate">
//                                      {shortConditionName(c.name)}
//                                    </span>
//                               </div>
//                                 <span className="font-medium text-gray-900">
//                                   {c.percentage}%
//                                  </span>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                    )}

//                       {parsedSummary.confidence != null && (
//                         <div className="mt-5">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Assessment confidence
//                           </p>

//                           <div className="flex items-center justify-between text-xs mb-1">
//                             <span className="font-medium text-emerald-600">
//                               {parsedSummary.confidence >= 80
//                                 ? "Pretty sure"
//                                 : parsedSummary.confidence >= 60
//                                   ? "Somewhat sure"
//                                   : "Low confidence"}
//                             </span>
//                             <span className="text-gray-600">
//                               {parsedSummary.confidence}%
//                             </span>
//                           </div>

//                           <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
//                             <div
//                               className="h-full rounded-full bg-emerald-500"
//                               style={{
//                                 width: `${Math.min(
//                                   parsedSummary.confidence,
//                                   100
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       )}

                      


//         <div className="mt-5 border-t border-gray-100 pt-4">
//           <h3 className="text-sm font-semibold text-gray-900 mb-1">
//             Self-care & when to seek help
//           </h3>

//           {selfCareText ? (
//             <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
//               {selfCareText}
//             </p>
//           ) : (
//             <p className="text-xs text-gray-600 mb-2">
//               Home care with rest, fluids, and over-the-counter pain relievers is
//               usually enough for most mild illnesses...
//             </p>
//           )}

//           <p className="text-[11px] text-gray-400">
//             These are rough estimates and do not replace medical advice...
//           </p>
//         </div>
            



                    

//         {/* actions... keep same */}
//       </div>
// {/* Primary actions */}
//                       <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                         {/* Download Reports dropdown */}
//                         <div className="relative flex-1" ref={downloadMenuRef}>
//                           <button
//                              type="button"
//                            onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
//                             className="w-full inline-flex items-center justify-between px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
//                           >
//                             <span>Download Reports</span>
//                             {/* simple chevron */}
//                             <svg
//                               className={`w-4 h-4 ml-2 transition-transform ${isDownloadMenuOpen ? "rotate-180" : ""
//                                 }`}
//                               viewBox="0 0 20 20"
//                               fill="none"
//                             >
//                               <path
//                                 d="M5 7l5 5 5-5"
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                           </button>

//                           {isDownloadMenuOpen && (
//                             <div
//                               className="
//       absolute z-20 mt-2 w-full rounded-xl border border-gray-200
//       bg-white shadow-xl text-sm overflow-hidden
//       divide-y divide-gray-100
//     "
//                             >
//                               <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadPatientSummaryPDF();
//                                 }}
//                               >
//                                 <span className="group-hover:underline">Patient Summary (PDF)</span>
//                               </button>

//                               <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadDoctorReportPDF(); // doctor clinical report
//                                 }}
//                               >
//                                 <span className="group-hover:underline">Doctor Clinical Report (PDF)</span>
//                               </button>

//                               <button
//                                 type="button"
//                                 className="
//         group w-full flex items-center justify-between
//         px-4 py-2.5
//         hover:bg-purple-50 hover:text-purple-700
//         active:bg-purple-100
//         transition-colors
//       "
//                                 onClick={() => {
//                                   setIsDownloadMenuOpen(false);
//                                   handleDownloadEHRSOAPPDF(); // SOAP / EHR note
//                                 }}
//                               >
//                                 <span className="group-hover:underline">SOAP / EHR Note (PDF)</span>
//                               </button>
//                             </div>
//                           )}

//                         </div>

//                         {/* Find doctor stays as a separate button */}
//                         <button
//                           type="button"
//                           onClick={handleFindDoctorSpecialistClick}
//                           className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5"
//                         >
//                           Find Doctor Specialist
//                         </button>
//                       </div>
      // {/* ✅ Pro lock overlay */}
      // {/* {isProLocked && (
      //   <div className="absolute inset-0 z-10 flex items-center justify-center">
      //     <div className="absolute inset-0 bg-white/60" />
      //     <div className="relative z-20 w-full max-w-sm mx-6 rounded-2xl border border-gray-200 bg-white shadow-xl p-5 text-center">
      //       <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
      //         🔒
      //       </div>

      //       <h3 className="mt-3 text-base font-semibold text-gray-900">
      //         Pro feature
      //       </h3>
      //       <p className="mt-1 text-xs text-gray-600">
      //         Full consultation summary and self-care tips are available in Pro.
      //       </p>

         
      //       {demoLead?.email && (
      //         <p className="mt-2 text-[11px] text-gray-500">
      //           Demo user: <span className="font-medium">{demoLead.email}</span>
      //         </p>
      //       )}

      //       <div className="mt-4 flex flex-col gap-2">
      //         <button
      //           type="button"
      //           onClick={() => {
      //             // later: open pricing / payment
      //             // for now just unlock for testing:
      //             // setIsProLocked(false);
      //             window.location.href = "/pricing"; 
      //           }}
      //           className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600"
      //         >
      //           Upgrade to Pro
      //         </button>

      //         <button
      //           type="button"
      //           onClick={() => navigate("/")}
      //           className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100"
      //         >
      //           Back to Home
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // )} */}
//     </div>
//   </section>
// )}

//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <motion.footer
//           className="w-full flex-shrink-0 flex justify-center px-4 bg-transparent fixed bottom-0"
//           initial={{ y: -60, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
//         >
//           {!userLanguageConsultSummary && (
//             <div className="w-full bg-[#FFFEF9] max-w-xl rounded-2xl space-y-3">
//               {!hasStartedChat && (
//                 <div className="flex items-start gap-2 text-[11px] text-gray-600 p-4 -mb-4 rounded-t-2xl bg-white">
//                   <input
//                     id="tos"
//                     type="checkbox"
//                     checked={hasAgreed}
//                     onChange={(e) => setHasAgreed(e.target.checked)}
//                     className="mb-2.5"
//                   />
//                   <label htmlFor="tos">
//                     I agree to the{" "}
//                     <button
//                       type="button"
//                       className="underline text-pink-500"
//                       onClick={() => navigate("/terms")}
//                     >
//                       The Cira Terms of Service
//                     </button>{" "}
//                     and will discuss all The Cira output with a doctor.
//                   </label>
//                 </div>
//               )}

//               <ChatInput
//                 onSendMessage={handleUserMessage}
//                 disabled={!hasAgreed || isThinking}
//                 placeholder={isThinking ? "Thinking..." : "Reply to Cira..."}
//                 showMic={false}
//                 submitText=""
//                 isThinking={isThinking}
//               />
//             </div>
//           )}
//         </motion.footer>
//       </div>

//       {/* Modals */}
//       <AnimatePresence>
//         {isAnyModalOpen && (
//           <motion.div
//             className="fixed inset-0 z-40 flex items-center justify-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {showDoctorRecommendationPopUp && (
//               <DoctorRecommendationPopUp
//                 condition={doctorRecommendationData?.condition || "your health concerns"}
//                 recommendedSpecialty={doctorRecommendationData?.specialty || "General Physician"}
//                 onFindDoctor={handleFindSpecialistDoctorClick}
//                 onSkip={handleSkipDoctorRecommendation}
//                 conversationSummary={conversationSummary}
//               />
//             )}

//             {showFacialScanPopUp && (
//               <FacialScanModal
//                 onStartScan={handleStartFacialScan}
//                 onSkipScan={handleSkipFacialScan}
//                 isScanning={isScanning}
//               />
//             )}

//             {showVitals && vitalsData && (
//               <VitalSignsDisplay
//                 vitals={vitalsData}
//                 onClose={handleContinueFromVitals}
//                 onStartConversation={handleContinueFromVitals}
//               />
//             )}

//             {showDoctorRecommendation && doctorRecommendationData && (
//               <DoctorRecommendationModal
//                 condition={doctorRecommendationData.condition}
//                 recommendedSpecialty={doctorRecommendationData.specialty}
//                 onSelectDoctor={handleSelectDoctor}
//                 onSkip={handleSkipDoctor}
//               />
//             )}

//             {showPayment && selectedDoctor && (
//               <PaymentModal
//                 doctor={selectedDoctor}
//                 onPaymentSuccess={handlePaymentSuccess}
//                 onBack={handlePaymentBack}
//               />
//             )}

//             {showAppointment && selectedDoctor && (
//               <AppointmentModal
//                 doctor={selectedDoctor}
//                 onBookingSuccess={handleBookingSuccess}
//                 onBack={handleAppointmentBack}
//               />
//             )}

//             {showConfirmation && bookingDetails && (
//               <BookingConfirmationModal
//                 bookingDetails={bookingDetails}
//                 onClose={handleConfirmationClose}
//               />
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


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
// If you're using PDF generation utils, import them
import {
  downloadPatientSummaryFromChatData,
  downloadEHRSOAPFromChatData,
  downloadDoctorsReport,
} from "../utils/clinicalReport/pdfGenerator";
const CHAT_AGENT_ID = import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID;

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
  // Expected lines like: "Viral upper respiratory infection — 70%"
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
  // Expected: "Confidence — 85%"
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

  // Tool outputs ONLY (we only use these)
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
  const downloadMenuRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*  Conversation Handler - TOOL ONLY VERSION                          */
  /* ------------------------------------------------------------------ */
  
  const conversation = useConversation({
    textOnly: true,

    // ✅ ONLY SOURCE: Client tool handler
    clientTools: {
      render_ai_consult_summary: async (params) => {
        console.log("🧰 Tool:", prettyTitle("render_ai_consult_summary"), params);

        // Extract ALL data from tool parameters
        setToolSummary(params?.AI_Consult_Summary || "");
        setToolConditionsText(params?.conditions_matching || "");
        setToolConfidenceText(params?.Assessment_confidence || "");
        setToolSelfCare(params?.self_care || "");

        setSummaryCreatedAt(new Date());
        setIsThinking(false);
        setIsGeneratingSummary(true);

        // Set conversation summary for modals
        setConversationSummary(params?.AI_Consult_Summary || "");

        setTimeout(() => {
          setIsGeneratingSummary(false);
        }, 1000);

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
      const isAssistant = role === "assistant" || role === "ai" || role === "agent";

      if (!isAssistant) {
        console.log("💬 Non-assistant message from SDK:", payload);
        return;
      }

      // Simply add assistant messages to chat, NO summary parsing
      setIsThinking(false);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: trimmedText }]);
    },
    
    onError: (err) => {
      console.error("❌ ElevenLabs chat error:", err);
      setError("Something went wrong while talking to Cira. Please try again.");
      setIsThinking(false);
    },
  });

  /* ------------------------------------------------------------------ */
  /*  Parsed Data from TOOL ONLY                                        */
  /* ------------------------------------------------------------------ */

  const parsedSummary = React.useMemo(() => {
    // Parse ONLY from tool outputs
    const conditions = parseConditionsMatching(toolConditionsText);
    const confidence = parseConfidencePercent(toolConfidenceText);
    return { conditions, confidence };
  }, [toolConditionsText, toolConfidenceText]);

  // Display summary and self-care text ONLY from tool
  const { displaySummary, selfCareText } = React.useMemo(() => {
    // Use tool summary if available
    if (toolSummary) {
      return {
        displaySummary: toolSummary,
        selfCareText: toolSelfCare || getDefaultSelfCare(),
      };
    }

    // No summary yet
    return {
      displaySummary: "",
      selfCareText: getDefaultSelfCare(),
    };
  }, [toolSummary, toolSelfCare]);

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
/*  PDF Generation Function for Client Tool Data                      */
/* ------------------------------------------------------------------ */

const buildPdfPayloadFromToolData = () => {
  // Check if we have the necessary tool data
  if (!toolSummary) {
    console.warn("❌ No tool summary available for PDF generation");
    return null;
  }

  console.log("📄 Building PDF payload from tool data...");

  // Extract patient info from tool summary or use defaults
  const extractPatientInfo = (text) => {
    const info = { name: null, age: null, gender: null };
    
    // Try to extract name
    const nameMatch = text.match(/\b(?:Hi|Hello|Hey)[,\s]+([A-Z][a-z]+)\b/);
    if (nameMatch) info.name = nameMatch[1];
    
    // Try to extract age
    const ageMatch = text.match(/\b(\d{1,3})\s*(?:year|yr|yo|years old)\b/i);
    if (ageMatch) info.age = ageMatch[1];
    
    // Try to extract gender
    const genderMatch = text.toLowerCase().match(/\b(male|female|man|woman)\b/);
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      info.gender = g === 'male' || g === 'man' ? 'Male' : 'Female';
    }
    
    return info;
  };

  const patientInfo = extractPatientInfo(toolSummary);
  
  // If no name extracted, use a default
  if (!patientInfo.name) {
    patientInfo.name = "Patient";
  }

  // Parse conditions from tool data
  const conditions = parseConditionsMatching(toolConditionsText);
  const confidence = parseConfidencePercent(toolConfidenceText);

  // Extract primary symptom from summary
  const extractPrimarySymptom = (text) => {
    const patterns = [
      /(?:complains of|reporting|presenting with|symptoms? of|has|experiencing|feeling)\s+([^.!?]+?)(?:for|since|\.|\?|!|$)/i,
      /(?:chief complaint|main concern|primary issue)[:\-]?\s*([^.!?]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]?.trim().length > 3) {
        return match[1].trim();
      }
    }

    // Fallback to common symptoms
    const commonSymptoms = [
      "headache", "fever", "cough", "sore throat", "nausea", 
      "vomiting", "diarrhea", "fatigue", "dizziness", 
      "shortness of breath", "chest pain", "abdominal pain", 
      "back pain", "rash"
    ];

    for (const symptom of commonSymptoms) {
      if (text.toLowerCase().includes(symptom)) {
        return symptom.charAt(0).toUpperCase() + symptom.slice(1);
      }
    }

    return "General symptoms";
  };

  // Build structured data for PDFs
  const consultationData = {
    // Patient Information
    patientName: patientInfo.name,
    patientAge: patientInfo.age || "Not specified",
    patientGender: patientInfo.gender || "Not specified",
    consultDate: summaryCreatedAt
      ? summaryCreatedAt.toLocaleDateString()
      : new Date().toLocaleDateString(),

    // Current Issue
    currentIssueData: {
      primarySymptom: extractPrimarySymptom(toolSummary),
      onset: "Not specified",
      pattern: "Not specified",
      severity: "Not specified",
      recentInjury: "No",
      associatedFactors: "None reported",
      location: "Not specified",
      relievingFactors: "None reported",
      worseningFactors: "None reported",
      chronicIllnesses: "None reported",
      previousSurgeries: "None reported",
      medications: "None reported",
      allergies: "None reported",
    },

    // AI Assessment
    conditions: conditions,
    confidence: confidence,
    narrativeSummary: toolSummary,
    selfCareText: toolSelfCare || getDefaultSelfCare(),
    
    // Vital Signs (placeholder - you can add actual vitals data if available)
    vitalsData: vitalsData || {},
    
    // Chief Complaint
    chiefComplaint: extractPrimarySymptom(toolSummary),
    
    // Review of Systems (placeholder)
    associatedSymptomsChips: [],
    associatedSymptomsNote: "Review of systems not documented in this consultation.",
    
    // PDF Generation Flags
    stripFollowupLines: true,
    includeComprehensiveData: true,

    // Additional metadata
    toolGenerated: true,
    source: "render_ai_consult_summary",
    generatedAt: new Date().toISOString(),
  };

  console.log("✅ PDF payload built successfully:", {
    patientName: consultationData.patientName,
    conditionCount: consultationData.conditions.length,
    hasConfidence: consultationData.confidence !== null,
    summaryLength: consultationData.narrativeSummary?.length || 0
  });

  return {
    consultationData,
    patientInfo: {
      name: consultationData.patientName,
      age: consultationData.patientAge,
      gender: consultationData.patientGender,
      consultDate: consultationData.consultDate,
    },
  };
};

/* ------------------------------------------------------------------ */
/*  Updated PDF Download Handlers                                     */
/* ------------------------------------------------------------------ */

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
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CIRA_Patient_Summary_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
    
    console.log("📄 Generating Patient Summary PDF:", filename);
    
    // Call your PDF generator function
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
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CIRA_Doctor_Report_${patientInfo.name || 'Patient'}_${timestamp}.pdf`;
    
    console.log("📄 Generating Doctor Report PDF:", filename);
    
    // Call your PDF generator function
    downloadDoctorsReport(consultationData, patientInfo, filename);
    
    setIsDownloadMenuOpen(false);
    
  } catch (error) {
    console.error("❌ Error generating Doctor Report PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};



  /* ------------------------------------------------------------------ */
  /*  Modal Handlers                                                    */
  /* ------------------------------------------------------------------ */

  const handleFindDoctorSpecialistClick = () => {
    if (!toolSummary) return;

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



  const handleDownloadEHRSOAPPDF = () => {
    console.log("Download EHR/SOAP PDF");
  };

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

                {/* SUMMARY CARD - SHOWS ONLY WHEN TOOL IS CALLED */}
                {toolSummary && (
  <section className="w-full mt-6 mb-2">
    <div className="relative bg-white shadow-sm border border-[#E3E3F3] px-5 py-6">
      
      {/* ================= Blurred / Locked Content ================= */}
      <div className={isProLocked ? "filter blur-sm select-none" : ""}>
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

      {/* ================= Actions (NOT BLURRED) ================= */}
      <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
        
        {/* Download dropdown */}
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
                  handleDownloadPatientSummaryPDF();
                }}
              >
                Patient Summary (PDF)
              </button>

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

        <button
          type="button"
          onClick={handleFindDoctorSpecialistClick}
          className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5 hover:bg-[#D8E4FF] transition-colors"
        >
          Find Doctor Specialist
        </button>
      </div>
             {/* ✅ Pro lock overlay */}
        {isProLocked && (
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
                  // later: open pricing / payment
                 // for now just unlock for testing:
                  // setIsProLocked(false);
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
      )} 
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
          {!toolSummary && (
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
                disabled={!hasAgreed || isThinking}
                placeholder={isThinking ? "Thinking..." : "Reply to Cira..."}
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
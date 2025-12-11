// File: src/utils/pdfGenerator/sharedUtils.js
import { jsPDF } from "jspdf";

/* ----------------- Color helpers ----------------- */
export const COLORS = {
  primary: "#6A1B9A",
  secondary: "#C2185B",
  yellow: "#D69E2E",
  lightBg: "#F3E5F5",
  pageBg: "#FBF7F2",
  green: "#16A34A",
  grayText: "#4B5563",
  grayLight: "#E5E7EB",
  white: "#FFFFFF",
  doctorPrimary: "#1E40AF", // Blue for doctor's report
  patientPrimary: "#059669", // Green for patient's report
  soapPrimary: "#7C3AED", // Purple for SOAP notes
};

export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function setFillHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

export function setStrokeHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

export function setTextHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

/** Simple wrapped text helper, returns new y */
export function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  if (!text || !String(text).trim()) return y;
  const lines = doc.splitTextToSize(String(text), maxWidth);
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

/* ----------------- Condition cleanup ----------------- */
export function cleanConditions(list) {
  if (!Array.isArray(list)) return [];

  const seen = new Set();
  const blockedPatterns = [
    /medication/i,
    /self[-\s]*care/i,
    /recommendation/i,
    /doctor/i,
  ];

  const cleaned = [];

  for (const item of list) {
    if (!item) continue;
    let { name, percentage } = item;
    if (!name) continue;

    if (blockedPatterns.some((re) => re.test(name))) continue;

    const norm = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(
        /\b(the|a|an|of|and|other|likely|possible|probable|causes?)\b/g,
        ""
      )
      .trim();

    if (!norm || seen.has(norm)) continue;
    seen.add(norm);

    cleaned.push({
      name: name.replace(/\s*[-–]\s*$/g, "").trim(),
      percentage: Number(percentage ?? 0),
    });
  }

  cleaned.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  return cleaned.slice(0, 3);
}

/* ----------------- Convert chat summary to SOAP structure ----------------- */
export const convertChatSummaryToSOAP = (
  chatSummary = {},
  patientInfo = {}
) => {
  const {
    conditions = [],
    confidence = null,
    narrativeSummary = "",
    selfCareText = "",
    vitalsData,
    hpi,
    associatedSymptomsChips,
    associatedSymptomsNote,
    chiefComplaint,
    fullConversation,
  } = chatSummary;

  const {
    name: patientName = "Patient",
    age: patientAge = "",
    gender: patientGender = "",
    consultDate = new Date().toLocaleDateString(),
  } = patientInfo;

  // SUBJECTIVE
  let subjective = "";
  if (narrativeSummary && narrativeSummary.trim()) {
    subjective = narrativeSummary
      .replace(/please\s+book\s+an\s+appointment\s+with\s+a\s+doctor[^.]*\./gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  } else {
    subjective =
      "Patient reported symptoms as described in the consultation transcript.";
  }

  // OBJECTIVE
  let objective =
    "Assessment based on patient-reported symptoms and AI analysis.";
  if (vitalsData) {
    const vitalsLines = [];
    if (vitalsData.heartRate != null)
      vitalsLines.push(`Heart rate: ${vitalsData.heartRate} bpm`);
    if (vitalsData.spo2 != null)
      vitalsLines.push(`Oxygen saturation (SpO₂): ${vitalsData.spo2}%`);
    if (vitalsData.temperature != null)
      vitalsLines.push(`Temperature: ${vitalsData.temperature}°C`);

    if (vitalsLines.length > 0) {
      objective += `\n\nObserved / AI-estimated vitals:\n${vitalsLines
        .map((l) => `• ${l}`)
        .join("\n")}`;
    }
  }

  // ASSESSMENT
  let assessment = "";
  const cleanedConditions = cleanConditions(conditions || []);

  if (cleanedConditions.length > 0) {
    assessment = `Differential diagnosis includes:\n\n${cleanedConditions
      .map((c) => `• ${c.name}: ${c.percentage}% likelihood`)
      .join("\n")}`;
  } else {
    assessment =
      "Differential diagnosis to be determined based on clinical evaluation and any additional tests.";
  }

  // PLAN
  const planParts = [];

  if (selfCareText && selfCareText.trim()) {
    planParts.push(selfCareText.trim());
  }

  if (confidence != null) {
    planParts.push(
      `AI assessment confidence: ${confidence}%. Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing.`
    );
  } else {
    planParts.push(
      "Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing."
    );
  }

  const plan = planParts.join("\n\n");

  return {
    patientName,
    patientAge,
    patientGender,
    consultDate,
    subjective,
    objective,
    assessment,
    plan,
    conditions: cleanedConditions,
    confidence,
    selfCareText,
    vitalsData,
    hpi,
    associatedSymptomsChips,
    associatedSymptomsNote,
    chiefComplaint,
  };
};
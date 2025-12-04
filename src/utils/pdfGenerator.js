// File: src/utils/pdfGenerator.js
import { jsPDF } from "jspdf";
import starsLogo from "../assets/stars.svg";

/* ----------------- Color helpers ----------------- */
const COLORS = {
  primary: "#6A1B9A", // brand purple
  secondary: "#C2185B", // magenta accent
  yellow: "#D69E2E",
  lightBg: "#F3E5F5", // light lavender
  pageBg: "#EFEBEF",
  green: "#16A34A",
  grayText: "#4B5563",
  grayLight: "#E5E7EB",
  white: "#FFFFFF",
};

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function setFillHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function setStrokeHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function setTextHex(doc, hex) {
  const { r, g, b } = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

/** Simple wrapped text helper, returns new y */
function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  if (!text || !String(text).trim()) return y;
  const lines = doc.splitTextToSize(String(text), maxWidth);
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

/* ----------------- Condition cleanup ----------------- */
/**
 * Normalizes and filters the conditions list:
 * - removes duplicates
 * - removes junk like "MEDICATION RECOMMENDATIONS"
 * - sorts by percentage desc
 * - keeps only top 3
 */
function cleanConditions(list) {
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

    // Skip obvious non-diagnostic rows
    if (blockedPatterns.some((re) => re.test(name))) continue;

    // Normalize for duplicate detection
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

/* ----------------- MAIN CLINICAL REPORT LAYOUT ----------------- */
export const generateSOAPNotePDF = (soapData = {}, options = {}) => {
  const { logoImage } = options; // optional HTMLImageElement

  const {
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),

    // SOAP text
    subjective = "",
    objective = "",
    assessment = "",
    plan = "",

    // extra fields
    conditions = [], // [{ name, percentage }]
    confidence = null, // number
    selfCareText = "",
    vitalsData,
    chiefComplaint,
    hpi = {},
    associatedSymptomsChips = [],
    associatedSymptomsNote,
  } = soapData;

  // ⬇️ Custom (shorter) page size
  const PAGE_WIDTH = 210;   // A4 width in mm
  const PAGE_HEIGHT = 260;  // ↓ reduce this to shrink overall height (e.g. 240, 250, 260)

  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);
  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;

  const margin = 10;
  const cardX = margin;
  const cardY = margin;
  const cardW = pageW - margin * 2;
  const cardH = pageH - margin * 2 - 25;  // ↓ smaller card height


  const innerX = cardX + 8;
  const innerW = cardW - 16;

  // Page background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");

  // White card
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, "#E5E7EB");
  doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, "FD");

  let y = cardY + 6;

  /* ----------- HEADER (WHITE, WITH LOGO + CIRA) ----------- */
  const headerH = 18;

  if (logoImage) {
    const logoW = 12;
    const logoH = 12;
    const logoX = cardX + 4;
    const logoY = y + 2;
    // jsPDF will accept most image types when passed as "PNG"
    doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
  }

  // "Cira" title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, "#111827");
  const titleX = logoImage ? cardX + 4 + 14 : innerX;
  doc.text("Cira", titleX, y + 8);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#4B5563");
  doc.text("Clinical Symptoms Report", titleX, y + 13);

  // Date on the right
  const headerRightX = cardX + cardW - 8;
  doc.setFontSize(9);
  doc.text(`Date: ${consultDate || ""}`, headerRightX, y + 8, {
    align: "right",
  });

  y += headerH + 4;

  /* ----------- PATIENT STRIP ----------- */
  const patientStripH = 18;
  setFillHex(doc, COLORS.lightBg);
  setStrokeHex(doc, COLORS.lightBg);
  doc.rect(cardX, y, cardW, patientStripH, "F");

  let px = innerX;
  let py = y + 6;

  // Patient name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Patient", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.primary);
  doc.text(patientName || "Patient", px, py + 5);

  // Age / Gender
  px = innerX + cardW * 0.35;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Age / Gender", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.primary);
  const ageGenderText =
    patientAge || patientGender
      ? `${patientAge || "--"} / ${patientGender || "--"}`
      : "—";
  doc.text(ageGenderText, px, py + 5);

  // Chief Complaint
  px = innerX + cardW * 0.6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextHex(doc, "#111827");
  doc.text("CHIEF COMPLAINT (CC):", px, py);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.secondary);
  const ccText =
    chiefComplaint && chiefComplaint.trim().length
      ? chiefComplaint
      : "Acute symptoms based on AI summary.";
  const ccLines = doc.splitTextToSize(ccText, cardW * 0.35);
  doc.text(ccLines, px, py + 4);

  y += patientStripH + 6;

  /* ----------- CLINICAL SUMMARY (MAIN NARRATIVE) ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.secondary);
  doc.text("CLINICAL SUMMARY", innerX, y);
  y += 4;

  setStrokeHex(doc, COLORS.secondary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y, innerX + innerW, y);
  y += 4;

  const summaryText = subjective || assessment || objective || "Not available.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, COLORS.grayText);
  y = addWrappedText(doc, summaryText, innerX, y + 1, innerW, 3.5);

  y += 6;

  /* ----------- ASSOCIATED SYMPTOMS (ROS) ----------- */
  setFillHex(doc, "#EEF2FF");
  setStrokeHex(doc, "#E5E7EB");
  const rosBoxH = 24;
  doc.roundedRect(innerX, y, innerW, rosBoxH, 3, 3, "FD");

  let ry = y + 6;
  let rx = innerX + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.primary);
  doc.text("ASSOCIATED SYMPTOMS (ROS)", rx, ry);
  ry += 4;

  const chips =
    associatedSymptomsChips && associatedSymptomsChips.length
      ? associatedSymptomsChips
      : [
        "Negative for Fever",
        "Negative for N/V/D/C",
        "No Prior Medical History",
      ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  let chipX = rx;
  let chipY = ry;
  const chipPaddingX = 2;
  const chipH = 5;

  chips.forEach((label) => {
    const textW = doc.getTextWidth(label);
    const chipW = textW + chipPaddingX * 4;

    if (chipX + chipW > innerX + innerW - 4) {
      chipX = rx;
      chipY += chipH + 2;
    }

    doc.setFillColor(209, 250, 229); // light green
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(chipX, chipY - chipH + 3, chipW, chipH, 2, 2, "FD");

    setTextHex(doc, "#166534");
    doc.text(label, chipX + chipPaddingX * 2, chipY);
    chipX += chipW + 2;
  });

  chipY += 5;
  const rosNote =
    associatedSymptomsNote && associatedSymptomsNote.trim()
      ? associatedSymptomsNote
      : "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";
  setTextHex(doc, COLORS.grayText);
  doc.setFontSize(7);
  chipY = addWrappedText(doc, rosNote, rx, chipY, innerW - 8, 3.2);

  y += rosBoxH + 8;

  /* ----------- DIFFERENTIAL DIAGNOSIS WITH BARS ----------- */
  const diagList = cleanConditions(conditions || []);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.primary);
  const diffTitle =
    confidence != null
      ? `DIFFERENTIAL DIAGNOSIS (AI Confidence: ${confidence}%)`
      : "DIFFERENTIAL DIAGNOSIS";
  doc.text(diffTitle, innerX, y);
  y += 4;

  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(innerX, y, innerX + innerW, y);
  y += 4;

  const maxBarWidth = innerW * 0.55;
  const labelX = innerX;
  const barStartX = innerX + innerW * 0.35;
  const percentX = innerX + innerW - 2;
  const barColors = [COLORS.secondary, COLORS.yellow, COLORS.green];

  if (diagList.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, COLORS.grayText);
    y = addWrappedText(
      doc,
      "No specific differentials listed. Clinical correlation and further evaluation are advised.",
      innerX,
      y,
      innerW,
      3.5
    );
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    diagList.forEach((d, idx) => {
      const name = d.name || "Condition";
      const pct = d.percentage ?? 0;

      setTextHex(doc, COLORS.grayText);
      const nameLines = doc.splitTextToSize(name, innerW * 0.3);
      addWrappedText(doc, nameLines.join(" "), labelX, y, innerW * 0.3, 3.5);

      const barWidth = Math.max(6, (Math.min(pct, 100) / 100) * maxBarWidth);
      const barY = y - 3;
      const barH = 4;
      setFillHex(doc, barColors[idx] || "#9CA3AF");
      doc.roundedRect(barStartX, barY, barWidth, barH, 2, 2, "F");

      setTextHex(doc, barColors[idx] || "#374151");
      doc.setFont("helvetica", "bold");
      doc.text(`${pct}%`, percentX, y, { align: "right" });

      y += 7;
      doc.setFont("helvetica", "normal");
    });
  }

  y += 6;

/* ----------- CLINICAL PLAN & DISPOSITION ----------- */
setFillHex(doc, "#FDF2F8");
setStrokeHex(doc, COLORS.secondary);

// 👉 make the PLAN box wider than the inner content (smaller side margins)
const planBoxSideMargin = 4;               // smaller margin than innerX
const planBoxX = cardX + planBoxSideMargin;
const planBoxW = cardW - planBoxSideMargin * 2;

// 👉 stretch the PLAN box downwards so there is almost no empty space
const planBoxY = y;
let planBoxH = cardY + cardH - planBoxY - 20;  // 8mm bottom padding
if (planBoxH < 20) planBoxH = 20;             // safety minimum height

doc.roundedRect(planBoxX, planBoxY, planBoxW, planBoxH, 3, 3, "FD");

let py2 = planBoxY + 7;
let px2 = planBoxX + 4;

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
setTextHex(doc, COLORS.secondary);
doc.text("CLINICAL PLAN & DISPOSITION", px2, py2);
py2 += 5;

doc.setFont("helvetica", "normal");
doc.setFontSize(8);
setTextHex(doc, COLORS.grayText);

const planText =
  plan && plan.trim().length
    ? plan
    : "Based on the AI assessment, follow-up with a healthcare provider is recommended if symptoms worsen, persist, or if red-flag features develop.";

// 👉 use planBoxW here so we really use the extra width
py2 = addWrappedText(doc, planText, px2, py2, planBoxW - 8, 3.5);

  return doc;
};

/* ----------------- Image loader for logo ----------------- */
function loadStarsLogo() {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = starsLogo;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    } catch (e) {
      reject(e);
    }
  });
}

/* ----------------- Download helper ----------------- */
export const downloadSOAPNotePDF = async (
  soapData,
  filename = "Report.pdf"
) => {
  try {
    const logoImage = await loadStarsLogo();
    const doc = generateSOAPNotePDF(soapData, { logoImage });
    doc.save(filename);
  } catch (e) {
    console.warn("Failed to load logo for PDF, saving without it:", e);
    const doc = generateSOAPNotePDF(soapData);
    doc.save(filename);
  }
};

/* ----------------- Chat summary → SOAP structure ----------------- */
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
    // extras for layout
    hpi,
    associatedSymptomsChips,
    associatedSymptomsNote,
    chiefComplaint,
    fullConversation, // kept for future if needed
  } = chatSummary;

  const {
    name: patientName = "Patient",
    age: patientAge = "",
    gender: patientGender = "",
    consultDate = new Date().toLocaleDateString(),
  } = patientInfo;

  // SUBJECTIVE – keep the one-paragraph clinical summary only
  let subjective = "";
  if (narrativeSummary && narrativeSummary.trim()) {
    subjective = narrativeSummary.trim();
  } else {
    subjective =
      "Patient reported symptoms as described in the consultation transcript.";
  }

  // OBJECTIVE – brief note + vitals if present
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

    // extras for layout
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

export const generateSOAPFromChatData = (
  chatData,
  patientInfo = {},
  options = {}
) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  return generateSOAPNotePDF(soapData, options);
};

export const downloadSOAPFromChatData = async (
  chatData,
  patientInfo = {},
  filename = "Report.pdf"
) => {
  try {
    const logoImage = await loadStarsLogo();
    const doc = generateSOAPFromChatData(chatData, patientInfo, {
      logoImage,
    });
    doc.save(filename);
  } catch (e) {
    console.warn("Failed to load logo for PDF, saving without it:", e);
    const doc = generateSOAPFromChatData(chatData, patientInfo);
    doc.save(filename);
  }
};

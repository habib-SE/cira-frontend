
import { jsPDF } from "jspdf";

/* ----------------- Color helpers ----------------- */
const COLORS = {
  primary: "#6A1B9A",          // header deep purple
  secondary: "#C2185B",        // critical magenta
  yellow: "#D69E2E",
  lightBg: "#F3E5F5",          // light lavender
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

/* ----------------- MAIN CLINICAL REPORT LAYOUT ----------------- */
export const generateSOAPNotePDF = (soapData = {}) => {
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
    conditions = [],      // [{ name, percentage }]
    confidence = null,    // number
    selfCareText = "",
    vitalsData,           // not shown prominently here but kept
    chiefComplaint,       // optional override

    // optional HPI structured block (OLD CARTS style)
    hpi = {},
    // optional associated symptoms labels
    associatedSymptomsChips = [],
    associatedSymptomsNote,
  } = soapData;

  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const margin = 10;
  const cardX = margin;
  const cardY = margin;
  const cardW = pageW - margin * 2;
  const cardH = pageH - margin * 2;

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

  /* ----------- HEADER BAND ----------- */
  const headerH = 20;
  setFillHex(doc, COLORS.primary);
  setStrokeHex(doc, COLORS.primary);
  doc.rect(cardX, y, cardW, headerH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, COLORS.white);
  doc.text("CLINICAL SYMPTOMS REPORT", innerX, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "AI-Generated Patient Snapshot & Differential Analysis",
    innerX,
    y + 12
  );

  const headerRightX = cardX + cardW - 8;
  doc.setFontSize(9);
  doc.text(`Date: ${consultDate || ""}`, headerRightX, y + 7, { align: "right" });

  y += headerH + 4;

  /* ----------- PATIENT STRIP ----------- */
  const patientStripH = 18;
  setFillHex(doc, COLORS.lightBg);
  setStrokeHex(doc, COLORS.lightBg);
  doc.rect(cardX, y, cardW, patientStripH, "F");

  let px = innerX;
  let py = y + 6;

  // Patient
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
    patientAge || patientGender ? `${patientAge || "--"} / ${patientGender || "--"}` : "—";
  doc.text(ageGenderText, px, py + 5);

  // Chief Complaint (right)
  px = innerX + cardW * 0.60;
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

  /* ----------- HPI: PAIN CHARACTERIZATION (OLD CARTS) ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.secondary);
  doc.text("HPI: PAIN CHARACTERIZATION (OLD CARTS)", innerX, y);
  y += 4;

  setStrokeHex(doc, COLORS.secondary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y, innerX + innerW, y);
  y += 4;

  const hpiDefaults = {
    onset: "—",
    durationPattern: "—",
    progression: "—",
    location: "—",
    severity: "—",
    character: "—",
    radiation: "—",
    aggravatingFactors: "—",
    relievingFactors: "—",
    previousEpisodes: "—",
    ...hpi,
  };

  const colGap = 4;
  const hpiColW = (innerW - colGap) / 2;
  const leftX = innerX;
  const rightX = innerX + hpiColW + colGap;
  let rowY = y + 2;
  const labelFontSize = 7;
  const valueFontSize = 8;
  const rowHeight = 8;

  const drawHpiItem = (x, yPos, label, value) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(labelFontSize);
    setTextHex(doc, COLORS.primary);
    doc.text(label.toUpperCase(), x, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(valueFontSize);
    setTextHex(doc, COLORS.grayText);
    const valLines = doc.splitTextToSize(value || "—", hpiColW - 2);
    addWrappedText(doc, valLines.join(" "), x, yPos + 3.2, hpiColW - 2, 3.2);
  };

  // left column
  drawHpiItem(leftX, rowY, "Onset", hpiDefaults.onset);
  rowY += rowHeight;
  drawHpiItem(leftX, rowY, "Progression", hpiDefaults.progression);
  rowY += rowHeight;
  drawHpiItem(leftX, rowY, "Severity (0–10)", hpiDefaults.severity);
  rowY += rowHeight;
  drawHpiItem(leftX, rowY, "Radiation", hpiDefaults.radiation);
  rowY += rowHeight;
  drawHpiItem(leftX, rowY, "Relieving Factors", hpiDefaults.relievingFactors);

  // right column
  let rowY2 = y + 2;
  drawHpiItem(rightX, rowY2, "Duration / Pattern", hpiDefaults.durationPattern);
  rowY2 += rowHeight;
  drawHpiItem(rightX, rowY2, "Location", hpiDefaults.location);
  rowY2 += rowHeight;
  drawHpiItem(rightX, rowY2, "Character", hpiDefaults.character);
  rowY2 += rowHeight;
  drawHpiItem(rightX, rowY2, "Aggravating Factors", hpiDefaults.aggravatingFactors);
  rowY2 += rowHeight;
  drawHpiItem(rightX, rowY2, "Previous Episodes", hpiDefaults.previousEpisodes);

  y = Math.max(rowY, rowY2) + 6;

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

  // chips
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
  const chipPaddingY = 1.5;

  chips.forEach((label) => {
    const textW = doc.getTextWidth(label);
    const chipW = textW + chipPaddingX * 4;
    const chipH = 5;

    if (chipX + chipW > innerX + innerW - 4) {
      chipX = rx;
      chipY += chipH + 2;
    }

    // chip background
    const chipColor = COLORS.green;
    const { r, g, b } = hexToRgb(chipColor);
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
      : "Lack of systemic symptoms is noted, but the high localized pain requires exclusion of surgical pathology.";
  setTextHex(doc, COLORS.grayText);
  doc.setFontSize(7);
  chipY = addWrappedText(doc, rosNote, rx, chipY, innerW - 8, 3.2);

  y += rosBoxH + 8;

  /* ----------- DIFFERENTIAL DIAGNOSIS WITH BARS ----------- */
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

  const diagList = (conditions && conditions.length ? conditions : []).slice(
    0,
    3
  );

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

      // name
      setTextHex(doc, COLORS.grayText);
      const nameLines = doc.splitTextToSize(name, innerW * 0.30);
      addWrappedText(doc, nameLines.join(" "), labelX, y, innerW * 0.30, 3.5);

      // bar
      const barWidth = Math.max(6, (Math.min(pct, 100) / 100) * maxBarWidth);
      const barY = y - 3;
      const barH = 4;
      setFillHex(doc, barColors[idx] || "#9CA3AF");
      doc.roundedRect(barStartX, barY, barWidth, barH, 2, 2, "F");

      // percentage
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
  const planBoxH = 26;
  const planBoxY = y;
  doc.roundedRect(innerX, planBoxY, innerW, planBoxH, 3, 3, "FD");

  let py2 = planBoxY + 7;
  let px2 = innerX + 4;

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
      : "Based on the AI assessment, immediate clinical assessment and appropriate diagnostic workup are recommended if symptoms are severe, worsening, or associated with red-flag features.";
  py2 = addWrappedText(doc, planText, px2, py2, innerW - 8, 3.5);

  y = planBoxY + planBoxH + 6;

  /* ----------- RAW AI MODEL OUTPUT ----------- */
  setFillHex(doc, "#F9FAFB");
  setStrokeHex(doc, "#E5E7EB");
  const rawBoxY = y;
  const rawBoxH = cardY + cardH - 6 - rawBoxY;
  doc.roundedRect(innerX, rawBoxY, innerW, rawBoxH, 2, 2, "FD");

  let ry2 = rawBoxY + 7;
  const rx2 = innerX + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.primary);
  doc.text("Raw AI Model Output (Subjective / Assessment)", rx2, ry2);
  ry2 += 4;

  // Subjective
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextHex(doc, "#111827");
  doc.text("Subjective (Patient Narrative)", rx2, ry2);
  ry2 += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, COLORS.grayText);
  ry2 = addWrappedText(
    doc,
    subjective || "Not available.",
    rx2,
    ry2,
    innerW - 8,
    3.2
  );

  ry2 += 3;
  // Assessment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextHex(doc, "#111827");
  doc.text("Assessment & Plan (AI Summary)", rx2, ry2);
  ry2 += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, COLORS.grayText);
  ry2 = addWrappedText(
    doc,
    assessment || objective || "Not available.",
    rx2,
    ry2,
    innerW - 8,
    3.2
  );

  return doc;
};

/* ----------------- Download helper ----------------- */
export const downloadSOAPNotePDF = (soapData, filename = "Report.pdf") => {
  const doc = generateSOAPNotePDF(soapData);
  doc.save(filename);
};

/* ----------------- Chat summary → SOAP structure ----------------- */
export const convertChatSummaryToSOAP = (chatSummary = {}, patientInfo = {}) => {
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
    fullConversation, // ⬅️ NEW
  } = chatSummary;

  const {
    name: patientName = "Patient",
    age: patientAge = "",
    gender: patientGender = "",
    consultDate = new Date().toLocaleDateString(),
  } = patientInfo;

  // 🩺 SUBJECTIVE – summary + full conversation
  let subjective = "";
  const subjectivePieces = [];

  if (narrativeSummary && narrativeSummary.trim()) {
    subjectivePieces.push(narrativeSummary.trim());
  }

  if (fullConversation && fullConversation.trim()) {
    subjectivePieces.push(
      "Conversation transcript:\n" + fullConversation.trim()
    );
  }

  if (subjectivePieces.length > 0) {
    subjective = subjectivePieces.join("\n\n");
  } else {
    subjective =
      "Patient reported symptoms as described in the consultation transcript.";
  }

  // OBJECTIVE – same as before
  let objective = "Assessment based on patient-reported symptoms and AI analysis.";
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
  if (conditions.length > 0) {
    assessment = `Differential diagnosis includes:\n\n${conditions
      .map((c) => `• ${c.name}: ${c.percentage}% likelihood`)
      .join("\n")}`;
  } else {
    assessment =
      "Differential diagnosis to be determined based on clinical evaluation and any additional tests.";
  }

  let planParts = [];

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
    conditions,
    confidence,
    selfCareText,
    vitalsData,
    hpi,
    associatedSymptomsChips,
    associatedSymptomsNote,
    chiefComplaint,
  };
};


export const generateSOAPFromChatData = (chatData, patientInfo = {}) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  return generateSOAPNotePDF(soapData);
};

export const downloadSOAPFromChatData = (
  chatData,
  patientInfo = {},
  filename = "Report.pdf"
) => {
  const doc = generateSOAPFromChatData(chatData, patientInfo);
  doc.save(filename);
};



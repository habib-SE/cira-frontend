// // utils/pdfGenerator.js
// import { jsPDF } from "jspdf";

// /**
//  * Core PDF generator – now styled like the Doctronic SOAP note.
//  */
// export const generateSOAPNotePDF = (soapData) => {
//   const {
//     patientName = "Patient",
//     patientAge = "",
//     patientGender = "",
//     consultDate = new Date().toLocaleDateString(),
//     subjective = "",
//     objective = "",
//     assessment = "",
//     plan = "",
//   } = soapData || {};

//   const doc = new jsPDF();

//   // Basic layout constants
//   const LEFT = 20;
//   const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
//   const RIGHT = doc.internal.pageSize.getWidth() - 20;
//   const MAX_LINE_WIDTH = RIGHT - LEFT; // ~170
//   let yPos = 20;

//   const addPageIfNeeded = (extra = 0) => {
//     if (yPos + extra > PAGE_HEIGHT - 20) {
//       doc.addPage();
//       yPos = 20;
//     }
//   };

//   const addMultiLineText = (text) => {
//     if (!text) return;
//     const paragraphs = String(text)
//       .split(/\n{2,}/) // split by blank line
//       .map((p) => p.trim())
//       .filter(Boolean);

//     doc.setFont("times", "normal");
//     doc.setFontSize(11);

//     paragraphs.forEach((para, idx) => {
//       const lines = doc.splitTextToSize(para, MAX_LINE_WIDTH);
//       lines.forEach((line) => {
//         addPageIfNeeded(6);
//         doc.text(line, LEFT, yPos);
//         yPos += 6;
//       });
//       if (idx < paragraphs.length - 1) {
//         yPos += 4; // small gap between paragraphs
//       }
//     });
//   };

//   const addSection = (label, content) => {
//     if (!content || !String(content).trim()) return;

//     addPageIfNeeded(12);
//     doc.setFont("times", "bold");
//     doc.setFontSize(12);
//     doc.text(label, LEFT, yPos);
//     yPos += 8;

//     addMultiLineText(content);
//     yPos += 6;
//   };

//   // ─────────────────────────────────────────────
//   // Title – simple, top-left, like Doctronic
//   // ─────────────────────────────────────────────
//   doc.setFont("times", "bold");
//   doc.setFontSize(14);
//   doc.text("SOAP Note", LEFT, yPos);
//   yPos += 10;

//   // (Optional) If later you want a subtle header line, you can uncomment:
//   // doc.setFont("times", "normal");
//   // doc.setFontSize(10);
//   // const infoChunks = [];
//   // if (patientName) infoChunks.push(patientName);
//   // if (patientAge) infoChunks.push(`${patientAge}`);
//   // if (patientGender) infoChunks.push(patientGender);
//   // if (infoChunks.length > 0) {
//   //   doc.text(infoChunks.join(", "), LEFT, yPos);
//   // }
//   // if (consultDate) {
//   //   doc.text(`Date: ${consultDate}`, RIGHT, yPos, { align: "right" });
//   // }
//   // yPos += 8;

//   // ─────────────────────────────────────────────
//   // Sections in Doctronic order
//   // ─────────────────────────────────────────────
//   addSection("Subjective", subjective);
//   addSection("Objective", objective);
//   addSection("Assessment", assessment);
//   addSection("Plan", plan);

//   // ⚠️ Note: No footer, no page numbers – to match Doctronic style

//   return doc;
// };

// /**
//  * Simple downloader for already-assembled SOAP data.
//  */
// export const downloadSOAPNotePDF = (soapData, filename = "SOAP_Note.pdf") => {
//   const doc = generateSOAPNotePDF(soapData);
//   doc.save(filename);
// };

// /**
//  * Convert chat summary object → structured SOAP data.
//  * Expects something like:
//  * {
//  *   conditions: [{ name, percentage }, ...],
//  *   confidence: 90,
//  *   narrativeSummary: "long summary text...",
//  *   selfCareText?: "...",
//  *   vitalsData?: { heartRate, spo2, temperature }
//  * }
//  */
// export const convertChatSummaryToSOAP = (chatSummary = {}, patientInfo = {}) => {
//   const {
//     conditions = [],
//     confidence = null,
//     narrativeSummary = "",
//     selfCareText = "",
//     vitalsData,
//   } = chatSummary;

//   const {
//     name: patientName = "Patient",
//     age: patientAge = "",
//     gender: patientGender = "",
//     consultDate = new Date().toLocaleDateString(),
//   } = patientInfo;

//   // SUBJECTIVE – main narrative from the consult
//   const subjective =
//     narrativeSummary && narrativeSummary.trim().length > 0
//       ? narrativeSummary.trim()
//       : "Patient reported symptoms as described in the consultation transcript.";

//   // OBJECTIVE – basic AI + optional vitals
//   let objective = "Assessment based on patient-reported symptoms and AI analysis.";
//   if (vitalsData) {
//     const vitalsLines = [];
//     if (vitalsData.heartRate != null) {
//       vitalsLines.push(`Heart rate: ${vitalsData.heartRate} bpm`);
//     }
//     if (vitalsData.spo2 != null) {
//       vitalsLines.push(`Oxygen saturation (SpO₂): ${vitalsData.spo2}%`);
//     }
//     if (vitalsData.temperature != null) {
//       vitalsLines.push(`Temperature: ${vitalsData.temperature}°C`);
//     }
//     if (vitalsLines.length > 0) {
//       objective += `\n\nObserved / AI-estimated vitals:\n${vitalsLines
//         .map((l) => `• ${l}`)
//         .join("\n")}`;
//     }
//   }

//   // ASSESSMENT – Doctronic-style differential list
//   let assessment = "";
//   if (conditions.length > 0) {
//     assessment = `Differential diagnosis includes:\n\n${conditions
//       .map((c) => `• ${c.name}: ${c.percentage}% likelihood`)
//       .join("\n")}`;
//   } else {
//     assessment =
//       "Differential diagnosis to be determined based on clinical evaluation and any additional tests.";
//   }

//   // PLAN – AI confidence + recommended follow-up, with self-care if present
//   let planParts = [];

//   if (selfCareText && selfCareText.trim()) {
//     planParts.push(selfCareText.trim());
//   }

//   if (confidence != null) {
//     planParts.push(
//       `AI assessment confidence: ${confidence}%. Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing.`
//     );
//   } else {
//     planParts.push(
//       "Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing."
//     );
//   }

//   const plan = planParts.join("\n\n");

//   return {
//     patientName,
//     patientAge,
//     patientGender,
//     consultDate,
//     subjective,
//     objective,
//     assessment,
//     plan,
//   };
// };

// /**
//  * One-shot: chat summary → jsPDF instance.
//  */
// export const generateSOAPFromChatData = (chatData, patientInfo = {}) => {
//   const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
//   return generateSOAPNotePDF(soapData);
// };

// /**
//  * One-shot: chat summary → download PDF
//  */
// export const downloadSOAPFromChatData = (
//   chatData,
//   patientInfo = {},
//   filename = "SOAP_Note.pdf"
// ) => {
//   const doc = generateSOAPFromChatData(chatData, patientInfo);
//   doc.save(filename);
// };
// utils/pdfGenerator.js
import { jsPDF } from "jspdf";

/**
 * Doctronic-style SOAP note:
 * - "SOAP Note" big + bold, top-left
 * - Section headings big + bold
 * - All content as bullet points
 * - Times family everywhere
 */
export const generateSOAPNotePDF = (soapData) => {
  const {
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),
    subjective = "",
    objective = "",
    assessment = "",
    plan = "",
  } = soapData || {};

  const doc = new jsPDF("p", "mm", "a4");

  // Layout constants
  const LEFT = 20;
  const RIGHT = doc.internal.pageSize.getWidth() - 20;
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const MAX_LINE_WIDTH = RIGHT - LEFT;
  const BULLET_INDENT = LEFT + 6;      // text after bullet

  const TITLE_FONT_SIZE = 30;          // huge header
  const SECTION_FONT_SIZE = 20;        // big section titles
  const BODY_FONT_SIZE = 12;           // normal phrase text
  const LINE_HEIGHT = 7;

  let yPos = 25;

  const addPageIfNeeded = (extra = 0) => {
    if (yPos + extra > PAGE_HEIGHT - 20) {
      doc.addPage();
      yPos = 25;
    }
  };

  /**
   * Render section:
   *   - heading (big bold)
   *   - each line as bullet with Times normal
   */
  const addBulletSection = (label, content) => {
    if (!content || !String(content).trim()) return;

    // Section heading
    addPageIfNeeded(SECTION_FONT_SIZE + 6);
    doc.setFont("times", "bold");
    doc.setFontSize(SECTION_FONT_SIZE);
    doc.text(label, LEFT, yPos);
    yPos += SECTION_FONT_SIZE / 2 + 4; // visually similar spacing

    // Body as bullet list
    const raw = String(content).trim();

    // Split by lines, keeping things simple
    const pieces = raw
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    doc.setFont("times", "normal"); // 🔹 normal weight like screenshot
    doc.setFontSize(BODY_FONT_SIZE);

    pieces.forEach((phrase) => {
      addPageIfNeeded(LINE_HEIGHT + 2);

      // remove any existing "-" / "•"
      const clean = phrase.replace(/^[-•\u2022]\s*/, "").trim();

      const wrappedLines = doc.splitTextToSize(
        clean,
        MAX_LINE_WIDTH - 8 // account for bullet indent
      );

      // First line with bullet
      doc.text("•", LEFT, yPos);
      doc.text(wrappedLines[0], BULLET_INDENT, yPos);

      // Wrapped lines under same bullet
      for (let i = 1; i < wrappedLines.length; i++) {
        yPos += LINE_HEIGHT;
        addPageIfNeeded(LINE_HEIGHT + 2);
        doc.text(wrappedLines[i], BULLET_INDENT, yPos);
      }

      yPos += LINE_HEIGHT; // gap between bullets
    });

    yPos += 4; // gap after each section
  };

  // ─────────────────────────────────────────────
  // Title – big, bold, top-left (like screenshot)
  // ─────────────────────────────────────────────
  doc.setFont("times", "bold");
  doc.setFontSize(TITLE_FONT_SIZE);
  doc.text("SOAP Note", LEFT, yPos);
  yPos += TITLE_FONT_SIZE / 2 + 6;

  // Subtle patient info line (optional)
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const infoChunks = [];
  if (patientName) infoChunks.push(patientName);
  if (patientAge) infoChunks.push(`${patientAge}`);
  if (patientGender) infoChunks.push(patientGender);
  if (infoChunks.length > 0) {
    doc.text(infoChunks.join(", "), LEFT, yPos);
  }
  if (consultDate) {
    doc.text(`Date: ${consultDate}`, RIGHT, yPos, { align: "right" });
  }
  yPos += 10;

  // ─────────────────────────────────────────────
  // Sections – all bullet point style
  // ─────────────────────────────────────────────
  addBulletSection("Subjective", subjective);
  addBulletSection("Objective", objective);
  addBulletSection("Assessment", assessment);
  addBulletSection("Plan", plan);

  // No footer / page numbers to stay close to Doctronic

  return doc;
};

/**
 * Download helper for ready-made SOAP data.
 */
export const downloadSOAPNotePDF = (soapData, filename = "SOAP_Note.pdf") => {
  const doc = generateSOAPNotePDF(soapData);
  doc.save(filename);
};

/**
 * Chat summary → SOAP structure (same as before).
 */
export const convertChatSummaryToSOAP = (chatSummary = {}, patientInfo = {}) => {
  const {
    conditions = [],
    confidence = null,
    narrativeSummary = "",
    selfCareText = "",
    vitalsData,
  } = chatSummary;

  const {
    name: patientName = "Patient",
    age: patientAge = "",
    gender: patientGender = "",
    consultDate = new Date().toLocaleDateString(),
  } = patientInfo;

  const subjective =
    narrativeSummary && narrativeSummary.trim().length > 0
      ? narrativeSummary.trim()
      : "Patient reported symptoms as described in the consultation transcript.";

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

// // File: src/utils/pdfGenerator.js
// import { jsPDF } from "jspdf";
// import starsLogo from "../../assets/stars.svg";

// /* ----------------- Color helpers ----------------- */
// const COLORS = {
//   primary: "#6A1B9A",
//   secondary: "#C2185B",
//   yellow: "#D69E2E",
//   lightBg: "#F3E5F5", // ← no longer used for sections
//   pageBg: "#FBF7F2",
//   green: "#16A34A",
//   grayText: "#4B5563",
//   grayLight: "#E5E7EB",
//   white: "#FFFFFF",
// };

// function hexToRgb(hex) {
//   const clean = hex.replace("#", "");
//   const bigint = parseInt(clean, 16);
//   return {
//     r: (bigint >> 16) & 255,
//     g: (bigint >> 8) & 255,
//     b: bigint & 255,
//   };
// }

// function setFillHex(doc, hex) {
//   const { r, g, b } = hexToRgb(hex);
//   doc.setFillColor(r, g, b);
// }

// function setStrokeHex(doc, hex) {
//   const { r, g, b } = hexToRgb(hex);
//   doc.setDrawColor(r, g, b);
// }

// function setTextHex(doc, hex) {
//   const { r, g, b } = hexToRgb(hex);
//   doc.setTextColor(r, g, b);
// }

// /** Simple wrapped text helper, returns new y */
// function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
//   if (!text || !String(text).trim()) return y;
//   const lines = doc.splitTextToSize(String(text), maxWidth);
//   lines.forEach((line) => {
//     doc.text(line, x, y);
//     y += lineHeight;
//   });
//   return y;
// }

// /* ----------------- Condition cleanup ----------------- */
// /**
//  * Normalizes and filters the conditions list:
//  * - removes duplicates
//  * - removes junk like "MEDICATION RECOMMENDATIONS"
//  * - sorts by percentage desc
//  * - keeps only top 3
//  */
// function cleanConditions(list) {
//   if (!Array.isArray(list)) return [];

//   const seen = new Set();
//   const blockedPatterns = [
//     /medication/i,
//     /self[-\s]*care/i,
//     /recommendation/i,
//     /doctor/i,
//   ];

//   const cleaned = [];

//   for (const item of list) {
//     if (!item) continue;
//     let { name, percentage } = item;
//     if (!name) continue;

//     // Skip obvious non-diagnostic rows
//     if (blockedPatterns.some((re) => re.test(name))) continue;

//     // Normalize for duplicate detection
//     const norm = name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, " ")
//       .replace(
//         /\b(the|a|an|of|and|other|likely|possible|probable|causes?)\b/g,
//         ""
//       )
//       .trim();

//     if (!norm || seen.has(norm)) continue;
//     seen.add(norm);

//     cleaned.push({
//       name: name.replace(/\s*[-–]\s*$/g, "").trim(),
//       percentage: Number(percentage ?? 0),
//     });
//   }

//   cleaned.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
//   return cleaned.slice(0, 3);
// }

// /* ----------------- MAIN CLINICAL REPORT LAYOUT ----------------- */
// export const generateSOAPNotePDF = (soapData = {}, options = {}) => {
//   const { logoImage } = options; // optional HTMLImageElement

//   const {
//     patientName = "Patient",
//     patientAge = "",
//     patientGender = "",
//     consultDate = new Date().toLocaleDateString(),

//     // SOAP text
//     subjective = "",
//     objective = "",
//     assessment = "",
//     plan = "",

//     // extra fields
//     conditions = [], // [{ name, percentage }]
//     confidence = null, // number
//     selfCareText = "",
//     vitalsData,
//     chiefComplaint,
//     hpi = {},
//     associatedSymptomsChips = [],
//     associatedSymptomsNote,
//   } = soapData;

//   // ⬇️ Custom (shorter) page size
//   const PAGE_WIDTH = 210;   // A4 width in mm
//   const PAGE_HEIGHT = 297;  // shorter height
//   const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

//   const pageW = PAGE_WIDTH;
//   const pageH = PAGE_HEIGHT;

//   // Tighter left/right padding
//   const marginX = 8;              // horizontal margin (smaller)
//   const marginY = 4;             // vertical margin (same as before)

//   const cardX = marginX;
//   const cardY = marginY;
//   const cardW = pageW - marginX * 2;
//   const cardH = pageH - marginY * 2 - 25;

//   // Inner content inset
//   const innerX = cardX + 6;       // was +8 → brings text closer to edges
//   const innerW = cardW - 10;       // was -16 → wider content area

//   // Page background (cream)
//   setFillHex(doc, COLORS.pageBg);
//   doc.rect(0, 0, pageW, pageH, "F");

//   let y = cardY + 6;

//   /* ----------- HEADER (WHITE, LOGO + TITLE, DARK TEXT) ----------- */
//   const headerH = 18;

//   if (logoImage) {
//     const logoW = 12;
//     const logoH = 12;
//     const logoX = cardX + 4;
//     const logoY = y + 2;
//     doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
//   }

//   // "Cira" title – dark grey, no purple
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   setTextHex(doc, "#111827");
//   const titleX = logoImage ? cardX + 4 + 14 : innerX;
//   doc.text("Cira", titleX, y + 8);

//   // Subtitle
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   setTextHex(doc, "#6B7280");
//   doc.text("Clinical Symptoms Report", titleX, y + 13);

//   // Date on the right
//   const headerRightX = cardX + cardW - 8;
//   doc.setFontSize(9);
//   setTextHex(doc, "#6B7280");
//   doc.text(`Date: ${consultDate || ""}`, headerRightX, y + 8, {
//     align: "right",
//   });

//   // Gray underline under header (Cira + Date) – full width
//   setStrokeHex(doc, COLORS.grayLight);
//   doc.setLineWidth(0.3);
//   const lineY = y + headerH;
//   doc.line(0, lineY, pageW, lineY);   // ⬅️ full-bleed line across the page

//   y += headerH + 4;

//   /* ----------- PATIENT STRIP ----------- */
//   const patientStripH = 18;

//   let px = innerX;
//   let py = y + 6;

//   // Patient name
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);
//   setTextHex(doc, "#6B7280");
//   doc.text("Name:", px, py);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   setTextHex(doc, "#111827");
//   doc.text(patientName || "Patient", px, py + 5);

//   // Age & Sex – bring closer to Name
//   px = innerX + 40;  // 👉 smaller offset instead of cardW * 0.35
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);
//   setTextHex(doc, "#6B7280");
//   doc.text("Age & Sex", px, py);
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   setTextHex(doc, "#111827");
//   const ageGenderText =
//     patientAge || patientGender
//       ? `${patientAge || "--"} / ${patientGender || "--"}`
//       : "—";
//   doc.text(ageGenderText, px, py + 5);

//   // Chief Complaint – stays right side but a bit closer
//   px = innerX + cardW * 0.58; // was 0.6
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);
//   setTextHex(doc, "#6B7280");
//   doc.text("Chief Complaint", px, py);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   setTextHex(doc, "#DC2626"); // red-ish for CC like screenshot
//   const ccText =
//     chiefComplaint && chiefComplaint.trim().length
//       ? chiefComplaint
//       : "Acute symptoms based on AI summary.";
//   const ccLines = doc.splitTextToSize(ccText, cardW * 0.32);
//   doc.text(ccLines, px, py + 5);

//   y += patientStripH + 6;

//   /* ----------- CLINICAL SUMMARY (PINK TITLE + THICK LINE) ----------- */
//   // Heading
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(10.5);
//   setTextHex(doc, "#EC4899"); // pink-500 style
//   doc.text("CLINICAL SUMMARY", innerX, y);

//   y += 4;

//   // Underline – slightly thicker
//   setStrokeHex(doc, "#EC4899");
//   doc.setLineWidth(0.35); // was 0.5
//   doc.line(innerX, y, innerX + innerW, y);
//   y += 4;

//   // Summary body
//   const summaryText = subjective || assessment || objective || "Not available.";
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   setTextHex(doc, COLORS.grayText);
//   y = addWrappedText(doc, summaryText, innerX, y + 1, innerW, 3.5);

//   y += 6;

//   /* ----------- ASSOCIATED SYMPTOMS (ROS) ----------- */

//   // Calculate dynamic height before drawing box
//   const chips =
//     associatedSymptomsChips && associatedSymptomsChips.length
//       ? associatedSymptomsChips
//       : ["No other symptoms"];

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);

//   const chipPaddingX = 3;
//   const chipH = 6;
//   const chipGap = 3;

//   let tempX = innerX + 4;
//   let tempY = y + 6 + 4; // after title inside box
//   let maxChipY = tempY;

//   // First: calculate text width + simulate wrapping to compute height
//   chips.forEach((label) => {
//     const textW = doc.getTextWidth(label);
//     const chipW = textW + chipPaddingX * 4;

//     if (tempX + chipW > innerX + innerW - 4) {
//       tempX = innerX + 4;
//       tempY += chipH + chipGap;
//     }

//     maxChipY = Math.max(maxChipY, tempY + chipH);
//     tempX += chipW + chipGap;
//   });

//   // Now compute ROS note height
//   const rosNote =
//     associatedSymptomsNote && associatedSymptomsNote.trim()
//       ? associatedSymptomsNote
//       : "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";

//   doc.setFontSize(7);
//   const noteLines = doc.splitTextToSize(rosNote, innerW - 8);
//   const noteHeight = noteLines.length * 3.2 + 4;

//   // Final dynamic box height
//   const rosBoxH =
//     (maxChipY - (y + 6)) + // chip area height
//     noteHeight +
//     10; // padding

//   // Draw Box
//   setFillHex(doc, COLORS.white);
//   setStrokeHex(doc, "#E5E7EB");
//   doc.roundedRect(innerX, y, innerW, rosBoxH, 3, 3, "FD");

//   // Begin rendering content inside box
//   let ry = y + 6;
//   let rx = innerX + 4;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   setTextHex(doc, "#111827");
//   doc.text("ASSOCIATED SYMPTOMS (ROS)", rx, ry);
//   ry += 4;

//   // Render chips again (this time drawing them)
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(7);

//   let chipX = rx;
//   let chipY = ry;

//   chips.forEach((label) => {
//     const textW = doc.getTextWidth(label);
//     const chipW = textW + chipPaddingX * 4;

//     if (chipX + chipW > innerX + innerW - 4) {
//       chipX = rx;
//       chipY += chipH + chipGap;
//     }

//     const chipTopY = chipY - chipH + 4;

//     doc.setFillColor(209, 250, 229);
//     doc.setDrawColor(209, 250, 229);
//     doc.roundedRect(chipX, chipTopY, chipW, chipH, 3, 3, "FD");

//     setTextHex(doc, "#166534");
//     const textBaselineY = chipTopY + chipH / 2 + 1;
//     doc.text(label, chipX + chipPaddingX * 2, textBaselineY);

//     chipX += chipW + chipGap;
//   });

//   // ROS note below chips
//   const noteYStart = maxChipY + 3;
//   setTextHex(doc, COLORS.grayText);
//   doc.setFontSize(7);
//   addWrappedText(doc, rosNote, rx, noteYStart, innerW - 8, 3.2);

//   // Move y below the box for the next section
//   y += rosBoxH + 8;


//   /* ----------- DIFFERENTIAL DIAGNOSIS WITH BARS ----------- */
//   const diagList = cleanConditions(conditions || []);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   setTextHex(doc, "#111827");
//   const diffTitle =
//     confidence != null
//       ? `CLINICAL POSSIBILITIES (AI Confidence: ${confidence}%)`
//       : "CLINICAL POSSIBILITIES";
//   doc.text(diffTitle, innerX, y);
//   y += 4;

//   setStrokeHex(doc, COLORS.grayLight);
//   doc.setLineWidth(0.2);
//   doc.line(innerX, y, innerX + innerW, y);
//   y += 4;

//   const maxBarWidth = innerW * 0.55;
//   const labelX = innerX;
//   const barStartX = innerX + innerW * 0.35;
//   const percentX = innerX + innerW - 2;
//   const barColors = [COLORS.secondary, COLORS.yellow, COLORS.green];

//   if (diagList.length === 0) {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8);
//     setTextHex(doc, COLORS.grayText);
//     y = addWrappedText(
//       doc,
//       "No specific differentials listed. Clinical correlation and further evaluation are advised.",
//       innerX,
//       y,
//       innerW,
//       3.5
//     );
//   } else {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8);

//     diagList.forEach((d, idx) => {
//       const name = d.name || "Condition";
//       const pct = d.percentage ?? 0;

//       setTextHex(doc, COLORS.grayText);
//       const nameLines = doc.splitTextToSize(name, innerW * 0.3);
//       addWrappedText(doc, nameLines.join(" "), labelX, y, innerW * 0.3, 3.5);

//       const barWidth = Math.max(6, (Math.min(pct, 100) / 100) * maxBarWidth);
//       const barY = y - 3;
//       const barH = 4;
//       setFillHex(doc, barColors[idx] || "#9CA3AF");
//       doc.roundedRect(barStartX, barY, barWidth, barH, 2, 2, "F");

//       setTextHex(doc, barColors[idx] || "#374151");
//       doc.setFont("helvetica", "bold");
//       doc.text(`${pct}%`, percentX, y, { align: "right" });

//       y += 7;
//       doc.setFont("helvetica", "normal");
//     });
//   }

//   y += 6;

//   /* ----------- CLINICAL PLAN & DISPOSITION ----------- */
//   setFillHex(doc, COLORS.white);
//   setStrokeHex(doc, COLORS.secondary);

//   const planBoxSideMargin = 4;
//   const planBoxX = cardX + planBoxSideMargin;
//   const planBoxW = cardW - planBoxSideMargin * 2;

//   const planBoxY = y;
//   // 🔽 fixed smaller height instead of filling all remaining space
//   let planBoxH = 50;       // try 40–60 to taste
//   if (planBoxH < 20) planBoxH = 20;

//   doc.roundedRect(planBoxX, planBoxY, planBoxW, planBoxH, 3, 3, "FD");

//   let py2 = planBoxY + 7;
//   let px2 = planBoxX + 4;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(10);
//   setTextHex(doc, COLORS.secondary);
//   doc.text("CLINICAL PLAN & DISPOSITION", px2, py2);
//   py2 += 5;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   setTextHex(doc, COLORS.grayText);

//   const planText =
//     plan && plan.trim().length
//       ? plan
//       : "Based on the AI assessment, follow-up with a healthcare provider is recommended if symptoms worsen, persist, or if red-flag features develop.";

//   py2 = addWrappedText(doc, planText, px2, py2, planBoxW - 8, 3.5);

//   /* ----------- DISCLAIMER AT BOTTOM ----------- */
//   // Calculate bottom position with some padding
//   const disclaimerY = pageH - 12; // Position from bottom with 12mm padding

//   // Draw a light background for the disclaimer
//   setFillHex(doc, "#FEF3C7"); // Light yellow background
//   const disclaimerH = 8;
//   const disclaimerBgY = disclaimerY - disclaimerH - 1;
//   doc.rect(0, disclaimerBgY, pageW, disclaimerH + 2, "F");

//   // Add top border line
//   setStrokeHex(doc, "#F59E0B"); // Amber border
//   doc.setLineWidth(0.2);
//   doc.line(0, disclaimerBgY, pageW, disclaimerBgY);

//   // Disclaimer text
//   doc.setFont("helvetica", "italic");
//   doc.setFontSize(6);
//   setTextHex(doc, "#92400E"); // Dark amber text

//   const disclaimerText = "Cira is an AI nurse assistant, not a licensed medical professional, and does not provide medical diagnosis, treatment, or professional healthcare advice.";

//   // Center the disclaimer text
//   const disclaimerLines = doc.splitTextToSize(disclaimerText, pageW - 16);
//   const disclaimerStartY = disclaimerBgY + 4;

//   disclaimerLines.forEach((line, index) => {
//     const textWidth = doc.getTextWidth(line);
//     const centeredX = (pageW - textWidth) / 2;
//     doc.text(line, centeredX, disclaimerStartY + (index * 3));
//   });

//   return doc;
// };

// /* ----------------- Image loader for logo ----------------- */
// function loadStarsLogo() {
//   return new Promise((resolve, reject) => {
//     try {
//       const img = new Image();
//       img.src = starsLogo;
//       img.onload = () => resolve(img);
//       img.onerror = (err) => reject(err);
//     } catch (e) {
//       reject(e);
//     }
//   });
// }

// /* ----------------- Download helper ----------------- */
// export const downloadSOAPNotePDF = async (
//   soapData,
//   filename = "Report.pdf"
// ) => {
//   try {
//     const logoImage = await loadStarsLogo();
//     const doc = generateSOAPNotePDF(soapData, { logoImage });
//     doc.save(filename);
//   } catch (e) {
//     console.warn("Failed to load logo for PDF, saving without it:", e);
//     const doc = generateSOAPNotePDF(soapData);
//     doc.save(filename);
//   }
// };

// /* ----------------- Chat summary → SOAP structure ----------------- */
// export const convertChatSummaryToSOAP = (
//   chatSummary = {},
//   patientInfo = {}
// ) => {
//   const {
//     conditions = [],
//     confidence = null,
//     narrativeSummary = "",
//     selfCareText = "",
//     vitalsData,
//     // extras for layout
//     hpi,
//     associatedSymptomsChips,
//     associatedSymptomsNote,
//     chiefComplaint,
//     stripFollowupLines,
//     fullConversation, // kept for future if needed
//   } = chatSummary;

//   const {
//     name: patientName = "Patient",
//     age: patientAge = "",
//     gender: patientGender = "",
//     consultDate = new Date().toLocaleDateString(),
//   } = patientInfo;

//   // SUBJECTIVE – keep the one-paragraph clinical summary only
//   let subjective = "";
//   if (narrativeSummary && narrativeSummary.trim()) {
//     subjective = narrativeSummary
//       .replace(/please\s+book\s+an\s+appointment\s+with\s+a\s+doctor[^.]*\./gi, "")
//       .replace(/\s{2,}/g, " ")
//       .trim();
//   } else {
//     subjective =
//       "Patient reported symptoms as described in the consultation transcript.";
//   }


//   // OBJECTIVE – brief note + vitals if present
//   let objective =
//     "Assessment based on patient-reported symptoms and AI analysis.";
//   if (vitalsData) {
//     const vitalsLines = [];
//     if (vitalsData.heartRate != null)
//       vitalsLines.push(`Heart rate: ${vitalsData.heartRate} bpm`);
//     if (vitalsData.spo2 != null)
//       vitalsLines.push(`Oxygen saturation (SpO₂): ${vitalsData.spo2}%`);
//     if (vitalsData.temperature != null)
//       vitalsLines.push(`Temperature: ${vitalsData.temperature}°C`);

//     if (vitalsLines.length > 0) {
//       objective += `\n\nObserved / AI-estimated vitals:\n${vitalsLines
//         .map((l) => `• ${l}`)
//         .join("\n")}`;
//     }
//   }

//   let assessment = "";
//   const cleanedConditions = cleanConditions(conditions || []);

//   if (cleanedConditions.length > 0) {
//     assessment = `Differential diagnosis includes:\n\n${cleanedConditions
//       .map((c) => `• ${c.name}: ${c.percentage}% likelihood`)
//       .join("\n")}`;
//   } else {
//     assessment =
//       "Differential diagnosis to be determined based on clinical evaluation and any additional tests.";
//   }

//   const planParts = [];

//   if (selfCareText && selfCareText.trim()) {
//     let cleanedSelfCare = selfCareText.trim();

//     // 🧹 For doctor clinical PDF: remove the “Based on the information…” sentence
//     if (stripFollowupLines) {
//       cleanedSelfCare = cleanedSelfCare
//         .replace(
//           /Based on the information you['’]ve shared[\s\S]*$/i,
//           ""
//         )
//         .trim();
//     }

//     if (cleanedSelfCare) {
//       planParts.push(cleanedSelfCare);
//     }
//   }

//   // Only add the generic follow-up / AI confidence sentences
//   // when we are NOT stripping them for the doctor summary
//   if (!stripFollowupLines) {
//     if (confidence != null) {
//       planParts.push(
//         `AI assessment confidence: ${confidence}%. Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing.`
//       );
//     } else {
//       planParts.push(
//         "Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing."
//       );
//     }
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

//     // extras for layout
//     conditions: cleanedConditions,
//     confidence,
//     selfCareText,
//     vitalsData,
//     hpi,
//     associatedSymptomsChips,
//     associatedSymptomsNote,
//     chiefComplaint,
//   };
// };

// /* ---------------------------------------------------------- */
// /*  NEW: Patient summary PDF (friendly, for the patient)      */
// /* ---------------------------------------------------------- */

// export const generatePatientSummaryPDF = (
//   chatSummary = {},
//   patientInfo = {},
//   options = {}
// ) => {
//   const { logoImage } = options;

//   const {
//     conditions = [],
//     narrativeSummary = "",
//     selfCareText = "",
//     associatedSymptomsChips = [],
//   } = chatSummary;

//   const {
//     name: patientName = "Patient",
//     consultDate = new Date().toLocaleDateString(),
//   } = patientInfo;

//   const doc = new jsPDF("p", "mm", "a4");
//   const pageW = doc.internal.pageSize.getWidth();
//   const marginX = 14;
//   const contentW = pageW - marginX * 2;
//   let y = 18;

//   // Page background
//   setFillHex(doc, COLORS.pageBg);
//   doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

//   // Header bar
//   setFillHex(doc, COLORS.white);
//   setStrokeHex(doc, COLORS.grayLight);
//   doc.roundedRect(8, 6, pageW - 16, 18, 4, 4, "FD");

//   if (logoImage) {
//     const logoW = 12;
//     const logoH = 12;
//     const logoX = 10;
//     const logoY = 9;
//     doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
//   }

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(13);
//   setTextHex(doc, "#111827");
//   doc.text("Your Cira Visit Summary", pageW / 2, 14, { align: "center" });

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   setTextHex(doc, "#6B7280");
//   doc.text(`Date: ${consultDate}`, pageW / 2, 19, { align: "center" });

//   y = 30;

//   // Greeting + intro
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   setTextHex(doc, COLORS.grayText);
//   const intro = `Hi ${patientName},\n\nHere’s a simple summary of what you shared with Cira and what the AI nurse thinks might be going on. This is not a diagnosis, but a guide to help you understand your symptoms and decide what to do next.`;
//   y = addWrappedText(doc, intro, marginX, y, contentW, 4);

//   y += 6;

//   // Section: Summary of your symptoms
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   setTextHex(doc, "#EC4899");
//   doc.text("Summary of your symptoms", marginX, y);
//   y += 5;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   setTextHex(doc, COLORS.grayText);

//   const summaryText =
//     narrativeSummary && narrativeSummary.trim()
//       ? narrativeSummary.trim()
//       : "Cira used your answers to build a summary of your symptoms and how they have been affecting you.";

//   y = addWrappedText(doc, summaryText, marginX, y, contentW, 4);

//   y += 6;

//   // Possible causes (no scary diagnostic wording)
//   if (Array.isArray(conditions) && conditions.length > 0) {
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(11);
//     setTextHex(doc, "#111827");
//     doc.text("Possible causes Cira considered", marginX, y);
//     y += 5;

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     setTextHex(doc, COLORS.grayText);

//     const list = conditions
//       .slice(0, 3)
//       .map(
//         (c) =>
//           `• ${c.name}${c.percentage != null ? ` (around ${c.percentage}% likelihood)` : ""
//           }`
//       )
//       .join("\n");

//     y = addWrappedText(doc, list, marginX, y, contentW, 4);
//     y += 6;
//   }

//   // Associated symptoms (optional chips -> simple text)
//   if (associatedSymptomsChips && associatedSymptomsChips.length > 0) {
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(11);
//     setTextHex(doc, "#111827");
//     doc.text("Other symptoms you mentioned", marginX, y);
//     y += 5;

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     setTextHex(doc, COLORS.grayText);

//     const chipsText = associatedSymptomsChips
//       .slice(0, 10)
//       .map((c) => `• ${c}`)
//       .join("\n");

//     y = addWrappedText(doc, chipsText, marginX, y, contentW, 4);
//     y += 6;
//   }

//   // Self-care and when to seek help
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   setTextHex(doc, "#111827");
//   doc.text("What you can do now", marginX, y);
//   y += 5;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   setTextHex(doc, COLORS.grayText);

//   const selfCare =
//     selfCareText && selfCareText.trim()
//       ? selfCareText.trim()
//       : "Rest, fluids, and over-the-counter pain or fever medicine (if you can safely take them) are often helpful for many mild illnesses. If your symptoms get worse, you have trouble breathing, severe pain, new symptoms, or you are worried for any reason, please see a doctor or urgent care as soon as possible.";

//   y = addWrappedText(doc, selfCare, marginX, y, contentW, 4);
//   y += 8;

//   // Disclaimer
//   doc.setFont("helvetica", "italic");
//   doc.setFontSize(7);
//   setTextHex(doc, "#92400E");

//   const disclaimer =
//     "This summary is generated by Cira, an AI nurse assistant. It is not a diagnosis and does not replace a visit to a doctor or emergency services. Always seek medical care if you are worried about your health.";
//   addWrappedText(doc, disclaimer, marginX, y, contentW, 3.5);

//   return doc;
// };

// export const downloadPatientSummaryFromChatData = async (
//   chatData,
//   patientInfo = {},
//   filename = "Cira_Patient_Summary.pdf"
// ) => {
//   try {
//     const logoImage = await loadStarsLogo();
//     const doc = generatePatientSummaryPDF(chatData, patientInfo, {
//       logoImage,
//     });
//     doc.save(filename);
//   } catch (e) {
//     console.warn(
//       "Failed to load logo for patient summary PDF, saving without it:",
//       e
//     );
//     const doc = generatePatientSummaryPDF(chatData, patientInfo);
//     doc.save(filename);
//   }
// };

// /* ---------------------------------------------------------- */
// /*  NEW: Plain SOAP / EHR PDF (copy-paste friendly)           */
// /* ---------------------------------------------------------- */

// export const generateEHRSOAPNotePDF = (
//   chatData = {},
//   patientInfo = {},
//   options = {}
// ) => {
//   // Re-use your existing mapping → S / O / A / P text
//   const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
//   const {
//     patientName,
//     patientAge,
//     patientGender,
//     consultDate,
//     subjective,
//     objective,
//     assessment,
//     plan,
//   } = soapData;

//   // A4, portrait
//   const doc = new jsPDF("p", "mm", "a4");
//   const pageW = doc.internal.pageSize.getWidth();
//   const marginX = 20;          // left/right margin
//   const contentW = pageW - marginX * 2;
//   let y = 22;                  // top start

//   /* -------------------- Title: SOAP Note -------------------- */
//   doc.setFont("times", "bold");
//   doc.setFontSize(22);         // bigger, like your sample
//   // left-aligned title
//   doc.text("SOAP Note", marginX, y);
//   y += 14;

//   /* -------------------- Header: Patient / Date --------------- */
//   doc.setFont("times", "normal");
//   doc.setFontSize(11);

//   // Left: "Patient"
//   doc.text("Patient", marginX, y);

//   // Right: "Date: mm/dd/yyyy"
//   const dateLabel =
//     consultDate || new Date().toLocaleDateString("en-US");
//   doc.text(`Date: ${dateLabel}`, pageW - marginX, y, { align: "right" });

//   y += 12;

//   // If you want to hide Name / Age / Sex, comment this block entirely.
//   if (patientName || patientAge || patientGender) {
//     const headerBits = [
//       patientName ? `Name: ${patientName}` : null,
//       patientAge ? `Age: ${patientAge}` : null,
//       patientGender ? `Sex: ${patientGender}` : null,
//     ]
//       .filter(Boolean)
//       .join("    ");

//     if (headerBits) {
//       doc.setFont("times", "normal");
//       doc.setFontSize(11);
//       doc.text(headerBits, marginX, y);
//       y += 10;
//     }
//   }

//   /* -------------------- Helper: add one SOAP section --------- */
//   const addSection = (title, textValue) => {
//     // New page if close to bottom
//     if (y > 260) {
//       doc.addPage();
//       y = 22;
//     }

//     // Heading (bold Times, like sample)
//     doc.setFont("times", "bold");
//     doc.setFontSize(14);
//     doc.text(title, marginX, y);
//     y += 8;

//     // Body text as bullet paragraphs
//     doc.setFont("times", "normal");
//     doc.setFontSize(12);

//     const raw = (textValue || "").trim();
//     if (!raw) {
//       doc.text("• [no data]", marginX, y);
//       y += 10;
//       return;
//     }

//     // Split into logical paragraphs. Double newlines = new bullet group.
//     const paragraphs = raw
//       .split(/\n{2,}/)
//       .map((p) => p.trim())
//       .filter(Boolean);

//     paragraphs.forEach((para) => {
//       if (y > 280) {
//         doc.addPage();
//         y = 22;
//       }

//       // Avoid double bullets:
//       // if text already starts with "•" or "-" treat it as a bullet already
//       const trimmed = para.replace(/^\s+/, "");
//       let bulletText = trimmed;

//       if (!/^[•\-]/.test(trimmed)) {
//         // normal paragraph → add a bullet prefix like the sample
//         bulletText = "• " + trimmed;
//       }

//       const lines = doc.splitTextToSize(bulletText, contentW);
//       lines.forEach((line) => {
//         doc.text(line, marginX, y);
//         y += 6;
//       });

//       y += 3; // small gap between bullets / paragraphs
//     });

//     y += 3;   // extra gap after whole section
//   };

//   /* -------------------- S / O / A / P in order ---------------- */
//   addSection("Subjective", subjective);
//   addSection("Objective", objective);
//   addSection("Assessment", assessment);
//   addSection("Plan", plan);

//   return doc;
// };


// export const downloadEHRSOAPFromChatData = async (
//   chatData,
//   patientInfo = {},
//   filename = "Cira_SOAP_Note.pdf"
// ) => {
//   const doc = generateEHRSOAPNotePDF(chatData, patientInfo);
//   doc.save(filename);
// };

// // export const generateSOAPFromChatData = (
// //   chatData,
// //   patientInfo = {},
// //   options = {}
// // ) => {
// //   const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
// //   return generateSOAPNotePDF(soapData, options);
// // };


// // export const downloadSOAPFromChatData = async (
// //   chatData,
// //   patientInfo = {},
// //   filename = "Report.pdf"
// // ) => {
// //   try {
// //     const logoImage = await loadStarsLogo();
// //     const doc = generateSOAPFromChatData(chatData, patientInfo, {
// //       logoImage,
// //     });
// //     doc.save(filename);
// //   } catch (e) {
// //     console.warn("Failed to load logo for PDF, saving without it:", e);
// //     const doc = generateSOAPFromChatData(chatData, patientInfo);
// //     doc.save(filename);
// //   }
// // };


// export const generateSOAPFromChatData = (
//   chatData,
//   patientInfo = {},
//   options = {}
// ) => {
//   const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
//   return generateSOAPNotePDF(soapData, options);
// };

// export const downloadSOAPFromChatData = async (
//   chatData,
//   patientInfo = {},
//   filename = "Report.pdf"
// ) => {
//   try {
//     const logoImage = await loadStarsLogo();
//     const doc = generateSOAPFromChatData(chatData, patientInfo, {
//       logoImage,
//     });
//     doc.save(filename);
//   } catch (e) {
//     console.warn("Failed to load logo for PDF, saving without it:", e);
//     const doc = generateSOAPFromChatData(chatData, patientInfo);
//     doc.save(filename);
//   }
// };


// File: src/utils/pdfGenerator.js
import { jsPDF } from "jspdf";
import starsLogo from "../../assets/stars.svg";

/* ----------------- Color helpers ----------------- */
const COLORS = {
  primary: "#6A1B9A",
  secondary: "#C2185B",
  yellow: "#D69E2E",
  lightBg: "#F3E5F5",
  pageBg: "#FBF7F2",
  green: "#16A34A",
  grayText: "#4B5563",
  grayLight: "#E5E7EB",
  white: "#FFFFFF",
  red: "#DC2626",
  greenCheck: "#16A34A",
  pink: "#EC4899",
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

/** Add checkmark or X mark */
function addStatusMark(doc, x, y, status = true) {
  const originalFont = doc.getFont();
  const originalSize = doc.getFontSize();
  
  doc.setFont("ZapfDingbats");
  doc.setFontSize(10);
  
  if (status) {
    setTextHex(doc, COLORS.greenCheck);
    doc.text("4", x, y); // Checkmark in ZapfDingbats
  } else {
    setTextHex(doc, COLORS.red);
    doc.text("8", x, y); // X mark in ZapfDingbats
  }
  
  // Restore original font
  doc.setFont(originalFont[0], originalFont[1]);
  doc.setFontSize(originalSize);
}

/* ----------------- Condition cleanup ----------------- */
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
    if (blockedPatterns.some((re) => re.test(name))) continue;
    const norm = name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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

/* ----------------- NEW: DOCTOR'S CLINICAL REPORT (Matches SOAP design) ----------------- */
export const generateDoctorReportPDF = (clinicalData = {}, options = {}) => {
  const { logoImage } = options;

  // Extract data with fallbacks
  const {
    // Patient info
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),
    
    // Clinical data
    conditions = [],
    confidence = null,
    narrativeSummary = "",
    selfCareText = "",
    vitalsData = {},
    chiefComplaint = "Acute symptoms",
    
    // Current issue data (NEW)
    currentIssueData = {},
    
    // Clinical summary JSON fields
    patient_identity_baseline = {},
    chief_complaint = {},
    history_of_present_illness_hpi = {},
    medical_background = {},
    vital_signs_current_status = {},
    lifestyle_risk_factors = {},
    exposure_environment = {},
    functional_status = {},
    review_of_systems_traffic_light_view = {},
    ai_clinical_assessment = {},
  } = clinicalData;

  // Page setup
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;

  // Margins
  const marginX = 8;
  const marginY = 4;

  const cardX = marginX;
  const cardY = marginY;
  const cardW = pageW - marginX * 2;
  const cardH = pageH - marginY * 2 - 25;

  // Inner content inset
  const innerX = cardX + 6;
  const innerW = cardW - 10;

  // Page background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");

  let y = cardY + 6;

  /* ----------- HEADER ----------- */
  const headerH = 18;

  if (logoImage) {
    const logoW = 12;
    const logoH = 12;
    const logoX = cardX + 4;
    const logoY = y + 2;
    doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, "#111827");
  const titleX = logoImage ? cardX + 4 + 14 : innerX;
  doc.text("Cira", titleX, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#6B7280");
  doc.text("Doctor Clinical Report", titleX, y + 13);

  const headerRightX = cardX + cardW - 8;
  doc.setFontSize(9);
  setTextHex(doc, "#6B7280");
  doc.text(`Date: ${consultDate || ""}`, headerRightX, y + 8, {
    align: "right",
  });

  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.3);
  const lineY = y + headerH;
  doc.line(0, lineY, pageW, lineY);

  y += headerH + 4;

  /* ----------- PATIENT STRIP ----------- */
  const patientStripH = 18;

  let px = innerX;
  let py = y + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Name:", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  doc.text(patientName || "Patient", px, py + 5);

  px = innerX + 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Age & Sex", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  const ageGenderText =
    patientAge || patientGender
      ? `${patientAge || "--"} / ${patientGender || "--"}`
      : "—";
  doc.text(ageGenderText, px, py + 5);

  px = innerX + cardW * 0.58;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Chief Complaint", px, py);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#DC2626");
  const primaryComplaint = chief_complaint?.primary_concern || chiefComplaint;
  const ccText = primaryComplaint && primaryComplaint.trim().length
    ? primaryComplaint
    : "Acute symptoms based on AI summary.";
  const ccLines = doc.splitTextToSize(ccText, cardW * 0.32);
  doc.text(ccLines, px, py + 5);

  y += patientStripH + 6;

  /* ----------- CLINICAL SUMMARY ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  setTextHex(doc, "#EC4899");
  doc.text("CLINICAL SUMMARY", innerX, y);

  y += 4;

  setStrokeHex(doc, "#EC4899");
  doc.setLineWidth(0.35);
  doc.line(innerX, y, innerX + innerW, y);
  y += 4;

  const clinicalSummary = narrativeSummary || 
                         ai_clinical_assessment?.clinical_note_to_physician || 
                         "Clinical assessment based on patient-reported symptoms.";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, COLORS.grayText);
  y = addWrappedText(doc, clinicalSummary, innerX, y + 1, innerW, 3.5);

  y += 10;

  /* ----------- DIFFERENTIAL DIAGNOSIS WITH BARS ----------- */
  const diagList = cleanConditions(conditions || []);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  const diffTitle = confidence != null
    ? `CLINICAL POSSIBILITIES (AI Confidence: ${confidence}%)`
    : "CLINICAL POSSIBILITIES";
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
    y += 6;
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
    y += 6;
  }

  // Check for page break
  if (y > 180) {
    doc.addPage();
    y = cardY + 6;
    setFillHex(doc, COLORS.pageBg);
    doc.rect(0, 0, pageW, pageH, "F");
  }

  /* ----------- HELPER FUNCTION FOR DETAIL SECTIONS ----------- */
  const addDetailSection = (title, items, startY) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setTextHex(doc, "#111827");
    doc.text(title, innerX, startY);

    setStrokeHex(doc, COLORS.grayLight);
    doc.setLineWidth(0.2);
    doc.line(innerX, startY + 1, innerX + innerW, startY + 1);

    const colWidth = innerW / 2;
    const LINE_HEIGHT = 2.8;
    const FIELD_GAP = 3;

    let colY = [startY + 7, startY + 7];

    items.forEach((item, index) => {
      const col = index % 2;
      const x = innerX + col * colWidth;

      const label = `${item.label}:`;
      const value = item.value !== undefined && item.value !== null
        ? String(item.value)
        : "Not specified";

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setTextHex(doc, COLORS.grayText);
      doc.text(label, x, colY[col]);

      const labelWidth = doc.getTextWidth(label) + 2;

      // Value - with highlighting if needed
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.2);
      
      // Set color based on highlight
      if (item.highlight === "danger") {
        setTextHex(doc, "#DC2626"); // Red for danger/pain score
      } else if (item.highlight === "warning") {
        setTextHex(doc, "#D97706"); // Amber for warning
      } else {
        setTextHex(doc, "#111827");
      }

      const wrapped = doc.splitTextToSize(
        value,
        colWidth - labelWidth - 2
      );

      doc.text(wrapped, x + labelWidth, colY[col]);

      colY[col] += wrapped.length * LINE_HEIGHT + FIELD_GAP;
    });

    return Math.max(colY[0], colY[1]) + 6;
  };

  /* ----------- CURRENT ISSUES (From extracted data) ----------- */
  // Use the currentIssueData passed from buildPdfPayload
  const currentIssueItems = [
    { 
      label: "Primary Symptom", 
      value: currentIssueData?.primarySymptom || 
             chief_complaint?.primary_concern || 
             "Not specified" 
    },
    { 
      label: "Onset", 
      value: currentIssueData?.onset || 
             chief_complaint?.onset || 
             "Not specified" 
    },
    { 
      label: "Pattern", 
      value: currentIssueData?.pattern || 
             history_of_present_illness_hpi?.progression_pattern || 
             "Constant" 
    },
    { 
      label: "Severity (Pain)", 
      value: currentIssueData?.severity || 
             (history_of_present_illness_hpi?.severity_0_to_10 ? 
               `${history_of_present_illness_hpi.severity_0_to_10} / 10` : 
               "Not specified"),
      highlight: (currentIssueData?.severity?.includes('/10') || 
                 history_of_present_illness_hpi?.severity_0_to_10) ? 
                 "danger" : null
    },
    { 
      label: "Recent Injury", 
      value: currentIssueData?.recentInjury || "No" 
    },
    { 
      label: "Associated Factors", 
      value: currentIssueData?.associatedFactors || 
             (history_of_present_illness_hpi?.associated_symptoms?.join(", ") || 
             "None reported") 
    },
  ];

  y = addDetailSection("CURRENT ISSUES", currentIssueItems, y);

  /* ----------- PATIENT DEMOGRAPHICS ----------- */
  const patientDetails = [
    { label: "Height", value: patient_identity_baseline?.height || "Not specified" },
    { label: "Weight", value: patient_identity_baseline?.weight || "Not specified" },
    { label: "BMI", value: patient_identity_baseline?.bmi || "Not calculated" },
  ];

  y = addDetailSection("PATIENT DEMOGRAPHICS", patientDetails, y);

  /* ----------- VITAL SIGNS & CURRENT STATUS ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#111827");
  doc.text("VITAL SIGNS & CURRENT STATUS", innerX, y);
  
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(innerX, y + 1, innerX + innerW, y + 1);
  
  y += 6;

  const vitalSigns = [
    { 
      label: "Heart Rate", 
      value: vital_signs_current_status?.heart_rate_bpm || vitalsData.heartRate 
        ? `${String(vital_signs_current_status?.heart_rate_bpm || vitalsData.heartRate)} bpm`
        : "Not measured"
    },
    { 
      label: "Oxygen Saturation", 
      value: vital_signs_current_status?.oxygen_saturation_spo2_percent || vitalsData.spo2 
        ? `${String(vital_signs_current_status?.oxygen_saturation_spo2_percent || vitalsData.spo2)}%`
        : "Not measured"
    },
    { 
      label: "Core Temperature", 
      value: vital_signs_current_status?.core_temperature || vitalsData.temperature 
        ? `${String(vital_signs_current_status?.core_temperature || (vitalsData.temperature ? `${vitalsData.temperature}°C` : ""))}`
        : "Not measured"
    },
    { 
      label: "Blood Pressure", 
      value: vital_signs_current_status?.blood_pressure 
        ? `${String(vital_signs_current_status.blood_pressure)}`
        : "Not measured"
    },
  ];

  // Add vital signs in two columns to save space
  const vitalColWidth = innerW / 2;
  vitalSigns.forEach((vital, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const xPos = innerX + (col * vitalColWidth);
    const yPos = y + (row * 4.5);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, COLORS.grayText);
    doc.text(vital.label, xPos, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setTextHex(doc, "#111827");
    doc.text(vital.value, xPos + 45, yPos);
  });

  y += (Math.ceil(vitalSigns.length / 2) * 4.5) + 8;

  /* ----------- LIFESTYLE & RISK FACTORS ----------- */
  const lifestyleItems = [
    { label: "Smoking", value: lifestyle_risk_factors?.smoking || "---" },
    { label: "Alcohol Use", value: lifestyle_risk_factors?.alcohol_use || "---" },
    { label: "Recreational Drugs", value: lifestyle_risk_factors?.recreational_drugs || "---" },
    { label: "Diet", value: lifestyle_risk_factors?.diet || "Not specified" },
    { label: "Exercise Routine", value: lifestyle_risk_factors?.exercise_routine || "Not specified" },
    { label: "Stress Level", value: lifestyle_risk_factors?.stress_level || "Not specified" },
  ];

  y = addDetailSection("LIFESTYLE & RISK FACTORS", lifestyleItems, y);

    /* ----------- HISTORY OF PRESENT ILLNESS ----------- */
  const hpiItems = [
    { label: "Location/System", value: history_of_present_illness_hpi?.location_or_system || "General-systems" },
    { label: "Chronic Illnesses", value: medical_background?.chronic_illnesses || "None reported" },
    { label: "Previous Surgeries", value: medical_background?.previous_surgeries || "None reported" },
    { label: "Current Medications", value: medical_background?.current_medications || "None reported" },
    { label: "Drug Allergies", value: medical_background?.drug_allergies || "None reported" },
    { label: "Family History", value: medical_background?.family_history || "Non-known" },
  ];

  y = addDetailSection("HISTORY OF PRESENT ILLNESS (HPI)", hpiItems, y);

  /* ----------- START PAGE 2 ----------- */
  doc.addPage();
  y = cardY + 6;
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");



  /* ----------- EXPOSURE & ENVIRONMENT ----------- */
  const exposureItems = [
    { label: "Recent Travel", value: exposure_environment?.recent_travel || "---" },
    { label: "Sick Contacts", value: exposure_environment?.sick_contacts || "---" },
    { label: "Crowded Events", value: exposure_environment?.crowded_events || "---" },
    { label: "Workplace/Chemical Exposure", value: exposure_environment?.workplace_chemical_exposure || "---" },
    { label: "Weather Exposure", value: exposure_environment?.weather_exposure || "---" },
  ];

  y = addDetailSection("EXPOSURE & ENVIRONMENT", exposureItems, y);

  /* ----------- FUNCTIONAL STATUS ----------- */
  const functionalItems = [
    { label: "Eating/drinking normally", value: functional_status?.eating_drinking_normally || "---" },
    { label: "Hydration", value: functional_status?.hydration || "---" },
    { label: "Activity level", value: functional_status?.activity_level || "---" },
  ];

  y = addDetailSection("FUNCTIONAL STATUS", functionalItems, y);

  /* ----------- REVIEW OF SYSTEMS ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#111827");
  doc.text("REVIEW OF SYSTEMS (ROS)", innerX, y);
  
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(innerX, y + 1, innerX + innerW, y + 1);
  
  y += 6;

  const rosItems = review_of_systems_traffic_light_view || {};
  const defaultRosItems = [
    { label: "Shortness of Breath", value: "---" },
    { label: "Chest Pain", value: "---" },
    { label: "Sore Throat", value: "---" },
    { label: "Body Aches/Fatigue", value: "---" },
    { label: "Vomiting/Diarrhea", value: "---" },
    { label: "Urinary Changes", value: "---" },
    { label: "Skin Rash", value: "---" },
    { label: "Mental Status Changes", value: "---" },
  ];

  const rosToDisplay = Object.keys(rosItems).length > 0 ? 
    Object.entries(rosItems).map(([key, value]) => ({
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: value?.answer || "---"
    })) : defaultRosItems;

  const rosItemsPerColumn = Math.ceil(rosToDisplay.length / 2);
  const rosColumnWidth = innerW / 2;
  
  rosToDisplay.forEach((item, index) => {
    const col = index < rosItemsPerColumn ? 0 : 1;
    const row = index < rosItemsPerColumn ? index : index - rosItemsPerColumn;
    const xPos = innerX + (col * rosColumnWidth);
    const yPos = y + (row * 4);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, COLORS.grayText);
    doc.text(item.label, xPos, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setTextHex(doc, "#111827");
    doc.text(item.value, xPos + 50, yPos);
  });

  y += (rosItemsPerColumn * 4) + 8;

  /* ----------- AI CLINICAL ASSESSMENT ----------- */
  const aiAssessmentText = ai_clinical_assessment?.clinical_note_to_physician || 
                          "Conservative management without hypoxia, systemic toxicity, or red-flag features. Conservative management and monitoring advised.";
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#111827");
  doc.text("AI CLINICAL ASSESSMENT", innerX, y);
  
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(innerX, y + 1, innerX + innerW, y + 1);
  
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, COLORS.grayText);
  y = addWrappedText(doc, aiAssessmentText, innerX, y, innerW, 3.5);

  y += 8;

  /* ----------- CLINICAL PLAN & DISPOSITION ----------- */
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, COLORS.secondary);

  const planBoxSideMargin = 4;
  const planBoxX = cardX + planBoxSideMargin;
  const planBoxW = cardW - planBoxSideMargin * 2;

  const planBoxY = y;
  let planBoxH = 50;
  if (planBoxH < 20) planBoxH = 20;

  doc.roundedRect(planBoxX, planBoxY, planBoxW, planBoxH, 3, 3, "FD");

  let planY = planBoxY + 7;
  let planX = planBoxX + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextHex(doc, COLORS.secondary);
  doc.text("CLINICAL PLAN & DISPOSITION", planX, planY);
  planY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, COLORS.grayText);

  const planText = selfCareText || 
                  "Based on the AI assessment, follow-up with a healthcare provider is recommended if symptoms worsen, persist, or if red-flag features develop.";

  addWrappedText(doc, planText, planX, planY, planBoxW - 8, 3.5);

  /* ----------- DISCLAIMER AT BOTTOM (Page 2) ----------- */
  const disclaimerY = pageH - 12;

  setFillHex(doc, "#FEF3C7");
  const disclaimerH = 8;
  const disclaimerBgY = disclaimerY - disclaimerH - 1;
  doc.rect(0, disclaimerBgY, pageW, disclaimerH + 2, "F");

  setStrokeHex(doc, "#F59E0B");
  doc.setLineWidth(0.2);
  doc.line(0, disclaimerBgY, pageW, disclaimerBgY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  setTextHex(doc, "#92400E");

  const disclaimerText = "Cira is an AI nurse assistant, not a licensed medical professional, and does not provide medical diagnosis, treatment, or professional healthcare advice.";

  const disclaimerLines = doc.splitTextToSize(disclaimerText, pageW - 16);
  const disclaimerStartY = disclaimerBgY + 4;

  disclaimerLines.forEach((line, index) => {
    const textWidth = doc.getTextWidth(line);
    const centeredX = (pageW - textWidth) / 2;
    doc.text(line, centeredX, disclaimerStartY + (index * 3));
  });

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

/* ----------------- Download helper for Doctor Report ----------------- */
export const downloadDoctorReportPDF = async (
  clinicalData,
  patientInfo = {},
  filename = "Cira_Doctor_Clinical_Report.pdf"
) => {
  try {
    const logoImage = await loadStarsLogo();
    const combinedData = {
      ...clinicalData,
      patientName: patientInfo.name || "Patient",
      patientAge: patientInfo.age || "",
      patientGender: patientInfo.gender || "",
      consultDate: patientInfo.consultDate || new Date().toLocaleDateString(),
    };
    
    const doc = generateDoctorReportPDF(combinedData, { logoImage });
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to load logo for PDF, saving without it:", e);
    const combinedData = {
      ...clinicalData,
      patientName: patientInfo.name || "Patient",
      patientAge: patientInfo.age || "",
      patientGender: patientInfo.gender || "",
      consultDate: patientInfo.consultDate || new Date().toLocaleDateString(),
    };
    
    const doc = generateDoctorReportPDF(combinedData);
    doc.save(filename);
    return doc;
  }
};

/* ----------------- Existing SOAP Note Generator (keep for compatibility) ----------------- */
export const generateSOAPNotePDF = (soapData = {}, options = {}) => {
  // ... keep your existing generateSOAPNotePDF function code as is ...
  // This is the OLD format for Patient Summary and SOAP Note
  const { logoImage } = options;

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
    conditions = [],
    confidence = null,
    selfCareText = "",
    vitalsData,
    chiefComplaint,
    hpi = {},
    associatedSymptomsChips = [],
    associatedSymptomsNote,
  } = soapData;

  // ⬇️ Custom (shorter) page size
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;

  // Tighter left/right padding
  const marginX = 8;
  const marginY = 4;

  const cardX = marginX;
  const cardY = marginY;
  const cardW = pageW - marginX * 2;
  const cardH = pageH - marginY * 2 - 25;

  // Inner content inset
  const innerX = cardX + 6;
  const innerW = cardW - 10;

  // Page background (cream)
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");

  let y = cardY + 6;

  /* ----------- HEADER ----------- */
  const headerH = 18;

  if (logoImage) {
    const logoW = 12;
    const logoH = 12;
    const logoX = cardX + 4;
    const logoY = y + 2;
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
  setTextHex(doc, "#6B7280");
  doc.text("Clinical Symptoms Report", titleX, y + 13);

  // Date on the right
  const headerRightX = cardX + cardW - 8;
  doc.setFontSize(9);
  setTextHex(doc, "#6B7280");
  doc.text(`Date: ${consultDate || ""}`, headerRightX, y + 8, {
    align: "right",
  });

  // Gray underline
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.3);
  const lineY = y + headerH;
  doc.line(0, lineY, pageW, lineY);

  y += headerH + 4;

  /* ----------- PATIENT STRIP ----------- */
  const patientStripH = 18;

  let px = innerX;
  let py = y + 6;

  // Patient name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Name:", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  doc.text(patientName || "Patient", px, py + 5);

  // Age & Sex
  px = innerX + 40;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Age & Sex", px, py);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  const ageGenderText =
    patientAge || patientGender
      ? `${patientAge || "--"} / ${patientGender || "--"}`
      : "—";
  doc.text(ageGenderText, px, py + 5);

  // Chief Complaint
  px = innerX + cardW * 0.58;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  doc.text("Chief Complaint", px, py);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#DC2626");
  const ccText =
    chiefComplaint && chiefComplaint.trim().length
      ? chiefComplaint
      : "Acute symptoms based on AI summary.";
  const ccLines = doc.splitTextToSize(ccText, cardW * 0.32);
  doc.text(ccLines, px, py + 5);

  y += patientStripH + 6;

  /* ----------- CLINICAL SUMMARY ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  setTextHex(doc, "#EC4899");
  doc.text("CLINICAL SUMMARY", innerX, y);

  y += 4;

  setStrokeHex(doc, "#EC4899");
  doc.setLineWidth(0.35);
  doc.line(innerX, y, innerX + innerW, y);
  y += 4;

  const summaryText = subjective || assessment || objective || "Not available.";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, COLORS.grayText);
  y = addWrappedText(doc, summaryText, innerX, y + 1, innerW, 3.5);

  y += 6;

  /* ----------- ASSOCIATED SYMPTOMS (ROS) ----------- */
  const chips =
    associatedSymptomsChips && associatedSymptomsChips.length
      ? associatedSymptomsChips
      : ["No other symptoms"];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  const chipPaddingX = 3;
  const chipH = 6;
  const chipGap = 3;

  let tempX = innerX + 4;
  let tempY = y + 6 + 4;
  let maxChipY = tempY;

  chips.forEach((label) => {
    const textW = doc.getTextWidth(label);
    const chipW = textW + chipPaddingX * 4;

    if (tempX + chipW > innerX + innerW - 4) {
      tempX = innerX + 4;
      tempY += chipH + chipGap;
    }

    maxChipY = Math.max(maxChipY, tempY + chipH);
    tempX += chipW + chipGap;
  });

  const rosNote =
    associatedSymptomsNote && associatedSymptomsNote.trim()
      ? associatedSymptomsNote
      : "Lack of systemic symptoms is noted, but the current presentation still requires monitoring for red-flag changes.";

  doc.setFontSize(7);
  const noteLines = doc.splitTextToSize(rosNote, innerW - 8);
  const noteHeight = noteLines.length * 3.2 + 4;

  const rosBoxH =
    (maxChipY - (y + 6)) +
    noteHeight +
    10;

  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, "#E5E7EB");
  doc.roundedRect(innerX, y, innerW, rosBoxH, 3, 3, "FD");

  let ry = y + 6;
  let rx = innerX + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#111827");
  doc.text("ASSOCIATED SYMPTOMS (ROS)", rx, ry);
  ry += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  let chipX = rx;
  let chipY = ry;

  chips.forEach((label) => {
    const textW = doc.getTextWidth(label);
    const chipW = textW + chipPaddingX * 4;

    if (chipX + chipW > innerX + innerW - 4) {
      chipX = rx;
      chipY += chipH + chipGap;
    }

    const chipTopY = chipY - chipH + 4;

    doc.setFillColor(209, 250, 229);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(chipX, chipTopY, chipW, chipH, 3, 3, "FD");

    setTextHex(doc, "#166534");
    const textBaselineY = chipTopY + chipH / 2 + 1;
    doc.text(label, chipX + chipPaddingX * 2, textBaselineY);

    chipX += chipW + chipGap;
  });

  const noteYStart = maxChipY + 3;
  setTextHex(doc, COLORS.grayText);
  doc.setFontSize(7);
  addWrappedText(doc, rosNote, rx, noteYStart, innerW - 8, 3.2);

  y += rosBoxH + 8;

  /* ----------- DIFFERENTIAL DIAGNOSIS WITH BARS ----------- */
  const diagList = cleanConditions(conditions || []);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  const diffTitle =
    confidence != null
      ? `CLINICAL POSSIBILITIES (AI Confidence: ${confidence}%)`
      : "CLINICAL POSSIBILITIES";
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
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, COLORS.secondary);

  const planBoxSideMargin = 4;
  const planBoxX = cardX + planBoxSideMargin;
  const planBoxW = cardW - planBoxSideMargin * 2;

  const planBoxY = y;
  let planBoxH = 50;
  if (planBoxH < 20) planBoxH = 20;

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

  py2 = addWrappedText(doc, planText, px2, py2, planBoxW - 8, 3.5);

  /* ----------- DISCLAIMER AT BOTTOM ----------- */
  const disclaimerY = pageH - 12;

  setFillHex(doc, "#FEF3C7");
  const disclaimerH = 8;
  const disclaimerBgY = disclaimerY - disclaimerH - 1;
  doc.rect(0, disclaimerBgY, pageW, disclaimerH + 2, "F");

  setStrokeHex(doc, "#F59E0B");
  doc.setLineWidth(0.2);
  doc.line(0, disclaimerBgY, pageW, disclaimerBgY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  setTextHex(doc, "#92400E");

  const disclaimerText = "Cira is an AI nurse assistant, not a licensed medical professional, and does not provide medical diagnosis, treatment, or professional healthcare advice.";

  const disclaimerLines = doc.splitTextToSize(disclaimerText, pageW - 16);
  const disclaimerStartY = disclaimerBgY + 4;

  disclaimerLines.forEach((line, index) => {
    const textWidth = doc.getTextWidth(line);
    const centeredX = (pageW - textWidth) / 2;
    doc.text(line, centeredX, disclaimerStartY + (index * 3));
  });

  return doc;
};

/* ----------------- Download helper for SOAP Note ----------------- */
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
    hpi,
    associatedSymptomsChips,
    associatedSymptomsNote,
    chiefComplaint,
    stripFollowupLines,
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
    let cleanedSelfCare = selfCareText.trim();

    if (stripFollowupLines) {
      cleanedSelfCare = cleanedSelfCare
        .replace(
          /Based on the information you['']ve shared[\s\S]*$/i,
          ""
        )
        .trim();
    }

    if (cleanedSelfCare) {
      planParts.push(cleanedSelfCare);
    }
  }

  if (!stripFollowupLines) {
    if (confidence != null) {
      planParts.push(
        `AI assessment confidence: ${confidence}%. Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing.`
      );
    } else {
      planParts.push(
        "Recommended follow-up with a healthcare provider for a full clinical evaluation and any appropriate diagnostic testing."
      );
    }
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

/* ---------------------------------------------------------- */
/*  Patient summary PDF (friendly, for the patient)           */
/* ---------------------------------------------------------- */

export const generatePatientSummaryPDF = (
  chatSummary = {},
  patientInfo = {},
  options = {}
) => {
  const { logoImage } = options;

  const {
    conditions = [],
    narrativeSummary = "",
    selfCareText = "",
    associatedSymptomsChips = [],
  } = chatSummary;

  const {
    name: patientName = "Patient",
    consultDate = new Date().toLocaleDateString(),
  } = patientInfo;

  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const contentW = pageW - marginX * 2;
  let y = 18;

  // Page background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  // Header bar
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, COLORS.grayLight);
  doc.roundedRect(8, 6, pageW - 16, 18, 4, 4, "FD");

  if (logoImage) {
    const logoW = 12;
    const logoH = 12;
    const logoX = 10;
    const logoY = 9;
    doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setTextHex(doc, "#111827");
  doc.text("Your Cira Visit Summary", pageW / 2, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#6B7280");
  doc.text(`Date: ${consultDate}`, pageW / 2, 19, { align: "center" });

  y = 30;

  // Greeting + intro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.grayText);
  const intro = `Hi ${patientName},\n\nHere's a simple summary of what you shared with Cira and what the AI nurse thinks might be going on. This is not a diagnosis, but a guide to help you understand your symptoms and decide what to do next.`;
  y = addWrappedText(doc, intro, marginX, y, contentW, 4);

  y += 6;

  // Section: Summary of your symptoms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#EC4899");
  doc.text("Summary of your symptoms", marginX, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.grayText);

  const summaryText =
    narrativeSummary && narrativeSummary.trim()
      ? narrativeSummary.trim()
      : "Cira used your answers to build a summary of your symptoms and how they have been affecting you.";

  y = addWrappedText(doc, summaryText, marginX, y, contentW, 4);

  y += 6;

  // Possible causes
  if (Array.isArray(conditions) && conditions.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setTextHex(doc, "#111827");
    doc.text("Possible causes Cira considered", marginX, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, COLORS.grayText);

    const list = conditions
      .slice(0, 3)
      .map(
        (c) =>
          `• ${c.name}${c.percentage != null ? ` (around ${c.percentage}% likelihood)` : ""
          }`
      )
      .join("\n");

    y = addWrappedText(doc, list, marginX, y, contentW, 4);
    y += 6;
  }

  // Associated symptoms
  if (associatedSymptomsChips && associatedSymptomsChips.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setTextHex(doc, "#111827");
    doc.text("Other symptoms you mentioned", marginX, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, COLORS.grayText);

    const chipsText = associatedSymptomsChips
      .slice(0, 10)
      .map((c) => `• ${c}`)
      .join("\n");

    y = addWrappedText(doc, chipsText, marginX, y, contentW, 4);
    y += 6;
  }

  // Self-care and when to seek help
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, "#111827");
  doc.text("What you can do now", marginX, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.grayText);

  const selfCare =
    selfCareText && selfCareText.trim()
      ? selfCareText.trim()
      : "Rest, fluids, and over-the-counter pain or fever medicine (if you can safely take them) are often helpful for many mild illnesses. If your symptoms get worse, you have trouble breathing, severe pain, new symptoms, or you are worried for any reason, please see a doctor or urgent care as soon as possible.";

  y = addWrappedText(doc, selfCare, marginX, y, contentW, 4);
  y += 8;

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  setTextHex(doc, "#92400E");

  const disclaimer =
    "This summary is generated by Cira, an AI nurse assistant. It is not a diagnosis and does not replace a visit to a doctor or emergency services. Always seek medical care if you are worried about your health.";
  addWrappedText(doc, disclaimer, marginX, y, contentW, 3.5);

  return doc;
};

export const downloadPatientSummaryFromChatData = async (
  chatData,
  patientInfo = {},
  filename = "Cira_Patient_Summary.pdf"
) => {
  try {
    const logoImage = await loadStarsLogo();
    const doc = generatePatientSummaryPDF(chatData, patientInfo, {
      logoImage,
    });
    doc.save(filename);
  } catch (e) {
    console.warn(
      "Failed to load logo for patient summary PDF, saving without it:",
      e
    );
    const doc = generatePatientSummaryPDF(chatData, patientInfo);
    doc.save(filename);
  }
};

/* ---------------------------------------------------------- */
/*  Plain SOAP / EHR PDF (copy-paste friendly)                */
/* ---------------------------------------------------------- */

export const generateEHRSOAPNotePDF = (
  chatData = {},
  patientInfo = {},
  options = {}
) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  const {
    patientName,
    patientAge,
    patientGender,
    consultDate,
    subjective,
    objective,
    assessment,
    plan,
  } = soapData;

  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 20;
  const contentW = pageW - marginX * 2;
  let y = 22;

  /* -------------------- Title: SOAP Note -------------------- */
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("SOAP Note", marginX, y);
  y += 14;

  /* -------------------- Header: Patient / Date --------------- */
  doc.setFont("times", "normal");
  doc.setFontSize(11);

  doc.text("Patient", marginX, y);
  const dateLabel =
    consultDate || new Date().toLocaleDateString("en-US");
  doc.text(`Date: ${dateLabel}`, pageW - marginX, y, { align: "right" });

  y += 12;

  if (patientName || patientAge || patientGender) {
    const headerBits = [
      patientName ? `Name: ${patientName}` : null,
      patientAge ? `Age: ${patientAge}` : null,
      patientGender ? `Sex: ${patientGender}` : null,
    ]
      .filter(Boolean)
      .join("    ");

    if (headerBits) {
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text(headerBits, marginX, y);
      y += 10;
    }
  }

  /* -------------------- Helper: add one SOAP section --------- */
  const addSection = (title, textValue) => {
    if (y > 260) {
      doc.addPage();
      y = 22;
    }

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(title, marginX, y);
    y += 8;

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const raw = (textValue || "").trim();
    if (!raw) {
      doc.text("• [no data]", marginX, y);
      y += 10;
      return;
    }

    const paragraphs = raw
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    paragraphs.forEach((para) => {
      if (y > 280) {
        doc.addPage();
        y = 22;
      }

      const trimmed = para.replace(/^\s+/, "");
      let bulletText = trimmed;

      if (!/^[•\-]/.test(trimmed)) {
        bulletText = "• " + trimmed;
      }

      const lines = doc.splitTextToSize(bulletText, contentW);
      lines.forEach((line) => {
        doc.text(line, marginX, y);
        y += 6;
      });

      y += 3;
    });

    y += 3;
  };

  /* -------------------- S / O / A / P in order ---------------- */
  addSection("Subjective", subjective);
  addSection("Objective", objective);
  addSection("Assessment", assessment);
  addSection("Plan", plan);

  return doc;
};

export const downloadEHRSOAPFromChatData = async (
  chatData,
  patientInfo = {},
  filename = "Cira_SOAP_Note.pdf"
) => {
  const doc = generateEHRSOAPNotePDF(chatData, patientInfo);
  doc.save(filename);
};

/* ----------------- Compatibility functions ----------------- */
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

/* ----------------- Export all functions ----------------- */
export {
  downloadDoctorReportPDF as downloadDoctorsReport,
};
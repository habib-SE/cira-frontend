// File: src/utils/pdfGenerator/doctorsReport.js
import { jsPDF } from "jspdf";
import {
  COLORS,
  setFillHex,
  setStrokeHex,
  setTextHex,
  addWrappedText,
  cleanConditions,
} from "./sharedUtils";

/* ----------------- DOCTOR'S REPORT (Comprehensive) ----------------- */
export const generateDoctorsReportPDF = (soapData = {}, options = {}) => {
  const { logoImage } = options;

  const {
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),

    subjective = "",
    objective = "",
    assessment = "",
    plan = "",

    conditions = [],
    confidence = null,
    selfCareText = "",
    vitalsData,
    chiefComplaint,
    hpi = {},
    associatedSymptomsChips = [],
    associatedSymptomsNote,
  } = soapData;

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;
  const marginX = 10;
  const marginY = 10;

  const cardX = marginX;
  const cardY = marginY;
  const cardW = pageW - marginX * 2;
  const cardH = pageH - marginY * 2;

  const innerX = cardX + 6;
  const innerW = cardW - 10;

  // Page background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");

  let y = cardY;

  /* ----------- HEADER ----------- */
  if (logoImage) {
    const logoW = 12;
    const logoH = 12;
    const logoX = cardX + 4;
    const logoY = y + 4;
    doc.addImage(logoImage, "PNG", logoX, logoY, logoW, logoH);
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, COLORS.doctorPrimary);
  const titleX = innerX;
  doc.text("CLINICAL ASSESSMENT REPORT", titleX, y + 12);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setTextHex(doc, "#6B7280");
  doc.text("For Healthcare Provider Use", titleX, y + 18);

  // Date on right
  doc.setFontSize(9);
  doc.text(`Date: ${consultDate || ""}`, cardX + cardW - 4, y + 12, {
    align: "right",
  });

  y += 25;

  /* ----------- PATIENT INFORMATION BOX ----------- */
  setFillHex(doc, "#F0F9FF");
  setStrokeHex(doc, "#BAE6FD");
  doc.roundedRect(cardX, y, cardW, 22, 3, 3, "FD");

  let infoY = y + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextHex(doc, COLORS.doctorPrimary);
  doc.text("PATIENT INFORMATION", innerX, infoY);
  infoY += 8;

  doc.setFontSize(9);
  setTextHex(doc, "#374151");

  // Patient details in columns
  const col1 = innerX;
  const col2 = innerX + 60;
  const col3 = innerX + 120;

  doc.text(`Name: ${patientName}`, col1, infoY);
  doc.text(`Age/Gender: ${patientAge || "--"} / ${patientGender || "--"}`, col2, infoY);
  
  if (chiefComplaint) {
    const ccLines = doc.splitTextToSize(chiefComplaint, 70);
    doc.text(`Chief Complaint:`, col3, infoY);
    if (ccLines.length > 1) {
      doc.text(ccLines[0], col3, infoY + 4);
    } else {
      doc.text(chiefComplaint, col3 + 28, infoY);
    }
  }

  y += 28;

  /* ----------- VITALS SECTION ----------- */
  if (vitalsData) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setTextHex(doc, COLORS.doctorPrimary);
    doc.text("VITALS", innerX, y);
    
    setStrokeHex(doc, "#E5E7EB");
    doc.setLineWidth(0.3);
    doc.line(innerX, y + 1, innerX + 40, y + 1);
    
    y += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, "#4B5563");
    
    const vitals = [];
    if (vitalsData.heartRate != null) vitals.push(`HR: ${vitalsData.heartRate} bpm`);
    if (vitalsData.spo2 != null) vitals.push(`SpO₂: ${vitalsData.spo2}%`);
    if (vitalsData.temperature != null) vitals.push(`Temp: ${vitalsData.temperature}°C`);
    if (vitalsData.bloodPressure) vitals.push(`BP: ${vitalsData.bloodPressure}`);
    if (vitalsData.respiratoryRate != null) vitals.push(`RR: ${vitalsData.respiratoryRate}`);
    
    doc.text(vitals.join("  |  "), innerX, y);
    y += 10;
  }

  /* ----------- HPI / SUBJECTIVE ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextHex(doc, COLORS.doctorPrimary);
  doc.text("HISTORY OF PRESENT ILLNESS", innerX, y);
  
  setStrokeHex(doc, "#E5E7EB");
  doc.setLineWidth(0.3);
  doc.line(innerX, y + 1, innerX + 70, y + 1);
  
  y += 6;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, "#374151");
  
  const hpiText = subjective || "No detailed history provided.";
  y = addWrappedText(doc, hpiText, innerX, y, innerW, 3.5);
  y += 6;

  /* ----------- ASSOCIATED SYMPTOMS ----------- */
  const chips = associatedSymptomsChips && associatedSymptomsChips.length 
    ? associatedSymptomsChips 
    : ["No other symptoms noted"];
  
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, "#E5E7EB");
  doc.roundedRect(innerX, y, innerW, 30, 3, 3, "FD");
  
  let ry = y + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextHex(doc, "#111827");
  doc.text("REVIEW OF SYSTEMS", innerX + 4, ry);
  ry += 6;
  
  // Render chips
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  let chipX = innerX + 4;
  const chipH = 6;
  const chipGap = 3;
  
  chips.forEach((label) => {
    const textW = doc.getTextWidth(label);
    const chipW = textW + 8;
    
    if (chipX + chipW > innerX + innerW - 4) {
      chipX = innerX + 4;
      ry += chipH + chipGap;
    }
    
    const chipTopY = ry - chipH + 4;
    doc.setFillColor(209, 250, 229);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(chipX, chipTopY, chipW, chipH, 2, 2, "FD");
    
    setTextHex(doc, "#166534");
    doc.text(label, chipX + 4, ry);
    
    chipX += chipW + chipGap;
  });
  
  if (associatedSymptomsNote) {
    ry += 8;
    doc.setFontSize(7);
    setTextHex(doc, COLORS.grayText);
    y = addWrappedText(doc, associatedSymptomsNote, innerX + 4, ry, innerW - 8, 3);
  }
  
  y += 38;

  /* ----------- DIFFERENTIAL DIAGNOSIS ----------- */
  const diagList = cleanConditions(conditions);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextHex(doc, COLORS.doctorPrimary);
  doc.text("DIFFERENTIAL DIAGNOSIS", innerX, y);
  
  if (confidence != null) {
    doc.setFontSize(9);
    setTextHex(doc, "#6B7280");
    doc.text(`AI Confidence: ${confidence}%`, innerX + innerW - 2, y, { align: "right" });
  }
  
  y += 8;
  
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(innerX, y, innerX + innerW, y);
  y += 6;
  
  if (diagList.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    setTextHex(doc, "#9CA3AF");
    doc.text("No specific differentials identified. Clinical correlation advised.", innerX, y);
    y += 8;
  } else {
    const maxBarWidth = innerW * 0.5;
    const labelX = innerX;
    const barStartX = innerX + innerW * 0.4;
    const percentX = innerX + innerW - 2;
    const barColors = ["#C53030", "#D69E2E", "#38A169"];
    
    diagList.forEach((d, idx) => {
      const name = d.name || "Condition";
      const pct = d.percentage ?? 0;
      
      // Condition name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setTextHex(doc, "#1F2937");
      doc.text(name, labelX, y);
      
      // Percentage
      doc.setFontSize(9);
      setTextHex(doc, barColors[idx] || "#374151");
      doc.text(`${pct}%`, percentX, y, { align: "right" });
      
      // Bar
      const barWidth = Math.max(6, (Math.min(pct, 100) / 100) * maxBarWidth);
      const barY = y - 3;
      const barH = 5;
      setFillHex(doc, barColors[idx] || "#9CA3AF");
      doc.roundedRect(barStartX, barY, barWidth, barH, 2, 2, "F");
      
      y += 10;
    });
  }
  
  y += 4;

  /* ----------- ASSESSMENT & PLAN ----------- */
  setFillHex(doc, "#FEFCE8");
  setStrokeHex(doc, "#FDE68A");
  const planBoxH = 60;
  doc.roundedRect(cardX, y, cardW, planBoxH, 3, 3, "FD");
  
  let py = y + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextHex(doc, "#92400E");
  doc.text("CLINICAL ASSESSMENT & RECOMMENDATIONS", innerX, py);
  py += 6;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, "#78350F");
  
  const assessmentPlan = assessment || plan || "Assessment and plan to be determined based on clinical evaluation.";
  py = addWrappedText(doc, assessmentPlan, innerX, py, innerW, 3.5);
  
  if (selfCareText) {
    py += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Self-Care Instructions:", innerX, py);
    py += 4;
    doc.setFont("helvetica", "normal");
    py = addWrappedText(doc, selfCareText, innerX, py, innerW, 3.5);
  }

  /* ----------- FOOTER ----------- */
  const footerY = pageH - 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  setTextHex(doc, "#6B7280");
  
  const footerText = "This AI-generated report is for clinical decision support only. Final diagnosis and treatment decisions must be made by a licensed healthcare professional.";
  const footerLines = doc.splitTextToSize(footerText, pageW - 20);
  footerLines.forEach((line, idx) => {
    doc.text(line, pageW/2, footerY + (idx * 3), { align: "center" });
  });

  return doc;
};

/* ----------------- Download helper for Doctor's Report ----------------- */
export const downloadDoctorsReport = async (
  soapData,
  filename = "Cira_Doctors_Report.pdf"
) => {
  try {
    const logoImage = await loadLogo();
    const doc = generateDoctorsReportPDF(soapData, { logoImage });
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to load logo, saving without it:", e);
    const doc = generateDoctorsReportPDF(soapData);
    doc.save(filename);
    return doc;
  }
};

// Helper function to load logo (you can move this to a separate file if needed)
async function loadLogo() {
  try {
    const img = new Image();
    // You'll need to import the logo or pass it as a parameter
    // img.src = logoUrl;
    return new Promise((resolve) => {
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}
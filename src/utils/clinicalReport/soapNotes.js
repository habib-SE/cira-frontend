// File: src/utils/pdfGenerator/soapNotes.js
import { jsPDF } from "jspdf";
import {
  COLORS,
  setFillHex,
  setStrokeHex,
  setTextHex,
  addWrappedText,
} from "./sharedUtils";

/* ----------------- SOAP NOTES (Structured Medical Format) ----------------- */
export const generateSOAPNotesPDF = (soapData = {}, options = {}) => {
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

    vitalsData,
    chiefComplaint,
  } = soapData;

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;
  const marginX = 12;
  const marginY = 12;

  const innerX = marginX;
  const innerW = pageW - marginX * 2;

  // Clean white background for SOAP
  setFillHex(doc, COLORS.white);
  doc.rect(0, 0, pageW, pageH, "F");

  let y = marginY;

  /* ----------- HEADER ----------- */
  if (logoImage) {
    const logoW = 10;
    const logoH = 10;
    doc.addImage(logoImage, "PNG", innerX, y, logoW, logoH);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setTextHex(doc, COLORS.soapPrimary);
  doc.text("SOAP NOTES", innerX + 15, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#6B7280");
  doc.text("AI-Generated Clinical Documentation", innerX + 15, y + 13);

  // Patient info right
  doc.setFontSize(8);
  doc.text(`Patient: ${patientName}`, pageW - marginX, y + 8, { align: "right" });
  doc.text(`Age/Sex: ${patientAge || "--"}/${patientGender || "--"}`, pageW - marginX, y + 12, { align: "right" });
  doc.text(`Date: ${consultDate}`, pageW - marginX, y + 16, { align: "right" });

  y += 25;

  /* ----------- S: SUBJECTIVE ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.soapPrimary);
  doc.text("S: SUBJECTIVE", innerX, y);
  
  setStrokeHex(doc, COLORS.soapPrimary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y + 1, innerX + 40, y + 1);
  
  y += 8;
  
  // Chief Complaint
  if (chiefComplaint) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setTextHex(doc, "#DC2626");
    doc.text("Chief Complaint:", innerX, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, "#1F2937");
    doc.text(chiefComplaint, innerX + 25, y);
    y += 6;
  }
  
  // HPI/Subjective
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const subjectiveText = subjective || "Patient reports symptoms as described. No additional history available.";
  y = addWrappedText(doc, subjectiveText, innerX, y, innerW, 3.5);
  
  y += 10;

  /* ----------- O: OBJECTIVE ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.soapPrimary);
  doc.text("O: OBJECTIVE", innerX, y);
  
  setStrokeHex(doc, COLORS.soapPrimary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y + 1, innerX + 40, y + 1);
  
  y += 8;
  
  // Vitals table
  if (vitalsData) {
    setFillHex(doc, "#F5F3FF");
    doc.rect(innerX, y, innerW, 12, "F");
    
    setStrokeHex(doc, "#DDD6FE");
    doc.setLineWidth(0.2);
    doc.rect(innerX, y, innerW, 12);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setTextHex(doc, COLORS.soapPrimary);
    doc.text("VITALS", innerX + 4, y + 4);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, "#4B5563");
    
    const colWidth = innerW / 5;
    const vitalsY = y + 8;
    
    if (vitalsData.heartRate != null) {
      doc.text(`HR: ${vitalsData.heartRate}`, innerX + colWidth, vitalsY);
    }
    if (vitalsData.spo2 != null) {
      doc.text(`SpO₂: ${vitalsData.spo2}%`, innerX + colWidth * 2, vitalsY);
    }
    if (vitalsData.temperature != null) {
      doc.text(`Temp: ${vitalsData.temperature}°C`, innerX + colWidth * 3, vitalsY);
    }
    if (vitalsData.bloodPressure) {
      doc.text(`BP: ${vitalsData.bloodPressure}`, innerX + colWidth * 4, vitalsY);
    }
    
    y += 16;
  }
  
  // Objective text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const objectiveText = objective || "Physical exam findings not available. Assessment based on reported symptoms.";
  y = addWrappedText(doc, objectiveText, innerX, y, innerW, 3.5);
  
  y += 10;

  /* ----------- A: ASSESSMENT ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.soapPrimary);
  doc.text("A: ASSESSMENT", innerX, y);
  
  setStrokeHex(doc, COLORS.soapPrimary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y + 1, innerX + 40, y + 1);
  
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const assessmentText = assessment || "Clinical assessment pending further evaluation.";
  y = addWrappedText(doc, assessmentText, innerX, y, innerW, 3.5);
  
  y += 10;

  /* ----------- P: PLAN ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.soapPrimary);
  doc.text("P: PLAN", innerX, y);
  
  setStrokeHex(doc, COLORS.soapPrimary);
  doc.setLineWidth(0.5);
  doc.line(innerX, y + 1, innerX + 40, y + 1);
  
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const planText = plan || "1. Follow up with healthcare provider for evaluation\n2. Monitor symptoms\n3. Return if symptoms worsen";
  
  // Format plan with bullet points
  const planLines = planText.split('\n');
  planLines.forEach((line) => {
    doc.text("•", innerX, y);
    const formattedLine = line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '');
    y = addWrappedText(doc, formattedLine, innerX + 4, y, innerW - 4, 3.5);
  });

  /* ----------- SIGNATURE LINE ----------- */
  const signatureY = pageH - 25;
  setStrokeHex(doc, "#D1D5DB");
  doc.setLineWidth(0.3);
  doc.line(pageW - marginX - 60, signatureY, pageW - marginX, signatureY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextHex(doc, "#6B7280");
  doc.text("AI-Generated Documentation", pageW - marginX - 30, signatureY + 4, { align: "center" });

  return doc;
};

/* ----------------- Download helper for SOAP Notes ----------------- */
export const downloadSOAPNotes = async (
  soapData,
  filename = "Cira_SOAP_Notes.pdf"
) => {
  try {
    const logoImage = await loadLogo();
    const doc = generateSOAPNotesPDF(soapData, { logoImage });
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to load logo, saving without it:", e);
    const doc = generateSOAPNotesPDF(soapData);
    doc.save(filename);
    return doc;
  }
};

// Helper function to load logo
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
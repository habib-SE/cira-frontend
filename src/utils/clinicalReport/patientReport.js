// File: src/utils/pdfGenerator/patientReport.js
import { jsPDF } from "jspdf";
import {
  COLORS,
  setFillHex,
  setStrokeHex,
  setTextHex,
  addWrappedText,
  cleanConditions,
} from "./sharedUtils";

/* ----------------- PATIENT'S REPORT (Simplified) ----------------- */
export const generatePatientReportPDF = (soapData = {}, options = {}) => {
  const { logoImage } = options;

  const {
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),

    subjective = "",
    conditions = [],
    confidence = null,
    selfCareText = "",
    chiefComplaint,
  } = soapData;

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;
  const marginX = 15;
  const marginY = 15;

  const innerX = marginX;
  const innerW = pageW - marginX * 2;

  // Soft background
  setFillHex(doc, "#F0FDF4");
  doc.rect(0, 0, pageW, pageH, "F");

  let y = marginY;

  /* ----------- HEADER ----------- */
  if (logoImage) {
    const logoW = 14;
    const logoH = 14;
    const logoX = innerX;
    doc.addImage(logoImage, "PNG", logoX, y, logoW, logoH);
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setTextHex(doc, COLORS.patientPrimary);
  doc.text("Your Health Summary", innerX + 20, y + 10);

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setTextHex(doc, "#6B7280");
  doc.text(consultDate || "", pageW - marginX, y + 10, { align: "right" });

  y += 25;

  /* ----------- GREETING ----------- */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setTextHex(doc, "#1F2937");
  
  const greeting = `Hello ${patientName || "there"}`;
  doc.text(greeting, innerX, y);
  
  if (patientAge || patientGender) {
    doc.setFontSize(10);
    setTextHex(doc, "#6B7280");
    doc.text(`${patientAge || ""} ${patientGender || ""}`.trim(), innerX + doc.getTextWidth(greeting) + 4, y);
  }
  
  y += 8;
  
  doc.setFontSize(9);
  setTextHex(doc, "#4B5563");
  doc.text("Here's a summary of your conversation with Cira:", innerX, y);
  y += 12;

  /* ----------- CHIEF COMPLAINT ----------- */
  if (chiefComplaint) {
    setFillHex(doc, "#DCFCE7");
    setStrokeHex(doc, "#86EFAC");
    doc.roundedRect(innerX, y, innerW, 16, 6, 6, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setTextHex(doc, COLORS.patientPrimary);
    doc.text("You mentioned:", innerX + 8, y + 7);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, "#166534");
    const ccLines = doc.splitTextToSize(chiefComplaint, innerW - 20);
    ccLines.forEach((line, idx) => {
      doc.text(line, innerX + 60, y + 7 + (idx * 4));
    });
    
    y += 24;
  }

  /* ----------- WHAT WE DISCUSSED ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.patientPrimary);
  doc.text("What We Discussed", innerX, y);
  y += 8;
  
  setStrokeHex(doc, "#A7F3D0");
  doc.setLineWidth(1);
  doc.line(innerX, y, innerX + 50, y);
  y += 6;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const summaryText = subjective 
    ? subjective.replace(/medical terms|clinical|diagnosis|differential/gi, '')
    : "We discussed your symptoms and concerns.";
  
  y = addWrappedText(doc, summaryText, innerX, y, innerW, 4);
  y += 12;

  /* ----------- POSSIBLE CAUSES (Simplified) ----------- */
  const diagList = cleanConditions(conditions);
  
  if (diagList.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setTextHex(doc, COLORS.patientPrimary);
    doc.text("Possible Causes", innerX, y);
    y += 8;
    
    setStrokeHex(doc, "#A7F3D0");
    doc.setLineWidth(1);
    doc.line(innerX, y, innerX + 40, y);
    y += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, "#374151");
    
    doc.text("Based on our conversation, here are some possibilities:", innerX, y);
    y += 8;
    
    diagList.slice(0, 3).forEach((d, idx) => {
      // Simple colored dots
      const dotColors = ["#EF4444", "#F59E0B", "#10B981"];
      setFillHex(doc, dotColors[idx] || "#6B7280");
      doc.circle(innerX + 3, y - 1, 1.5, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setTextHex(doc, "#1F2937");
      doc.text(d.name, innerX + 8, y);
      
      if (confidence != null && idx === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setTextHex(doc, "#6B7280");
        doc.text(`(AI confidence: ${confidence}%)`, innerX + doc.getTextWidth(d.name) + 12, y);
      }
      
      y += 8;
    });
    
    y += 8;
  }

  /* ----------- SELF-CARE ADVICE ----------- */
  if (selfCareText) {
    setFillHex(doc, "#FEF3C7");
    setStrokeHex(doc, "#FDE68A");
    doc.roundedRect(innerX, y, innerW, 45, 8, 8, "FD");
    
    let adviceY = y + 10;
    
    // Icon/Emoji placeholder
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setTextHex(doc, "#D97706");
    doc.text("💡", innerX + 8, adviceY);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setTextHex(doc, "#92400E");
    doc.text("Self-Care Tips", innerX + 18, adviceY);
    
    adviceY += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, "#78350F");
    
    const simplifiedSelfCare = selfCareText
      .replace(/medical terms|doctor|healthcare provider/gi, 'healthcare professional')
      .replace(/immediately|urgently|emergency/gi, 'promptly');
    
    addWrappedText(doc, simplifiedSelfCare, innerX + 8, adviceY, innerW - 16, 3.5);
    
    y += 55;
  }

  /* ----------- NEXT STEPS ----------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setTextHex(doc, COLORS.patientPrimary);
  doc.text("Next Steps", innerX, y);
  y += 8;
  
  setStrokeHex(doc, "#A7F3D0");
  doc.setLineWidth(1);
  doc.line(innerX, y, innerX + 30, y);
  y += 6;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, "#374151");
  
  const nextSteps = [
    "✓ Monitor your symptoms and note any changes",
    "✓ Follow the self-care tips provided above",
    "✓ Contact a healthcare professional if symptoms worsen or persist",
    "✓ Keep this summary for your records and share it with your doctor"
  ];
  
  nextSteps.forEach((step, idx) => {
    doc.text(step, innerX + 5, y);
    y += 6;
  });

  /* ----------- FOOTER ----------- */
  const footerY = pageH - 15;
  setStrokeHex(doc, "#D1FAE5");
  doc.setLineWidth(0.5);
  doc.line(marginX, footerY - 5, pageW - marginX, footerY - 5);
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  setTextHex(doc, "#6B7280");
  
  const footerText = "This summary is generated by Cira AI for informational purposes only. It is not a medical diagnosis. Always consult with a healthcare professional for medical advice.";
  const footerLines = doc.splitTextToSize(footerText, pageW - 30);
  footerLines.forEach((line, idx) => {
    doc.text(line, pageW/2, footerY + (idx * 3), { align: "center" });
  });

  return doc;
};

/* ----------------- Download helper for Patient's Report ----------------- */
export const downloadPatientReport = async (
  soapData,
  filename = "Cira_Patient_Summary.pdf"
) => {
  try {
    const logoImage = await loadLogo();
    const doc = generatePatientReportPDF(soapData, { logoImage });
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to load logo, saving without it:", e);
    const doc = generatePatientReportPDF(soapData);
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
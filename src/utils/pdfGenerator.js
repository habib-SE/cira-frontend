import { jsPDF } from 'jspdf';

export const generateSOAPNotePDF = (soapData) => {
  const {
    patientName = 'Patient',
    patientAge = '',
    patientGender = '',
    consultDate = new Date().toLocaleDateString(),
    // SOAP sections
    subjective = '',
    objective = '',
    assessment = '',
    plan = ''
  } = soapData;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Set initial y position
  let yPos = 30;
  
  // Title - SOAP Note
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('SOAP Note', 105, yPos, { align: 'center' });
  
  yPos += 20;

  // Patient info section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  let patientInfo = `Patient: ${patientName}`;
  if (patientAge) patientInfo += `, ${patientAge}`;
  if (patientGender) patientInfo += `, ${patientGender}`;
  
  doc.text(patientInfo, 20, yPos);
  doc.text(`Date: ${consultDate}`, 20, yPos + 7);
  
  yPos += 25;

  // Subjective Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Subjective', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (subjective) {
    const splitSubjective = doc.splitTextToSize(subjective, 170);
    doc.text(splitSubjective, 20, yPos);
    yPos += (splitSubjective.length * 6) + 15;
  } else {
    // Default subjective content based on your example
    const defaultSubjective = [
      "- 30-year-old man",
      "- Sudden onset of sharp pain on the right upper back near the ribs, started last night",
      "- Pain rated 8/10, constant, and worsens with walking",
      "- Urinary symptoms: burning urination and increased frequency, no blood or color change",
      "- No fever, chills, nausea, vomiting, recent injury, heavy lifting, or past similar symptoms",
      "- No known chronic conditions or medication use; no known allergies"
    ];
    
    defaultSubjective.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
      }
      doc.text(line, 25, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Check if we need a new page
  if (yPos > 230) {
    doc.addPage();
    yPos = 30;
  }

  // Objective Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Objective', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (objective) {
    const splitObjective = doc.splitTextToSize(objective, 170);
    doc.text(splitObjective, 20, yPos);
    yPos += (splitObjective.length * 6) + 15;
  } else {
    // Default objective content based on your example
    const defaultObjective = [
      "- Self-reported pain intensity and location",
      "- Self-reported urinary frequency and dysuria",
      "- Symptoms onset noted as last night",
      "- No systemic signs (fever, chills) reported"
    ];
    
    defaultObjective.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
      }
      doc.text(line, 25, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Check if we need a new page
  if (yPos > 230) {
    doc.addPage();
    yPos = 30;
  }

  // Assessment Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (assessment) {
    const splitAssessment = doc.splitTextToSize(assessment, 170);
    doc.text(splitAssessment, 20, yPos);
    yPos += (splitAssessment.length * 6) + 15;
  } else {
    // Default assessment content based on your example
    const defaultAssessment = [
      "- Differential diagnosis includes:",
      "- Acute Urolithiasis: Likely given the severe, constant, sharp pain in the upper back and associated urinary symptoms",
      "- Acute Pyclonephritis: Considered due to urinary symptoms, though absence of fever and systemic signs makes it less likely",
      "- Musculoskeletal Strain: Less likely because of the urinary symptoms accompanying the pain",
      "- Combined UTI with Referred Pain: Possibility is lower given the pain severity and its location"
    ];
    
    defaultAssessment.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
      }
      doc.text(line, 25, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Check if we need a new page for Plan section
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }

  // Plan Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Plan', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (plan) {
    const splitPlan = doc.splitTextToSize(plan, 170);
    doc.text(splitPlan, 20, yPos);
    yPos += (splitPlan.length * 6) + 15;
  } else {
    // Default plan content based on your example - Page 1
    const defaultPlanPage1 = [
      "- Order laboratory tests:",
      "- Urinalysis to check for microscopic hematuria, evidence of infection, and inflammation",
      "- Urine culture if the urinalysis indicates infection, to identify pathogen and antibiotic sensitivities",
      "- Complete Blood Count (CBC) to evaluate for signs of systemic infection or inflammation",
      "- Schedule imaging:",
      "- Non-contrast CT scan of the abdomen and pelvis as the gold standard to assess for kidney stones and to determine their size, location, and any complications"
    ];
    
    defaultPlanPage1.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
      }
      doc.text(line, 25, yPos);
      yPos += 6;
    });

    // Add second page for remaining plan content
    doc.addPage();
    yPos = 30;

    // Page 2 content
    const defaultPlanPage2 = [
      "- Consider renal ultrasound if CT is contraindicated, to assess for hydronephrosis",
      "- Pain management:",
      "  - Use ibuprofen for pain relief and inflammation reduction, dosing as appropriate",
      "- Infection management:",
      "  - If infection is confirmed on labs, initiate appropriate antibiotic therapy tailored to the pathogen and local resistance patterns",
      "- Follow-up:",
      "  - Reassess symptoms after treatment initiation",
      "  - Arrange follow-up imaging or evaluation if symptoms persist or complications develop"
    ];

    defaultPlanPage2.forEach(line => {
      doc.text(line, 25, yPos);
      yPos += 6;
    });
  }

  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('Generated by Cira AI Assistant - Confidential Medical Document', 105, 290, { align: 'center' });
  }

  return doc;
};

export const downloadSOAPNotePDF = (soapData, filename = 'SOAP_Note.pdf') => {
  const doc = generateSOAPNotePDF(soapData);
  doc.save(filename);
};

// Alternative function that converts your chat summary into SOAP format
export const convertChatSummaryToSOAP = (chatSummary, patientInfo = {}) => {
  // This function would parse your chat summary and extract information for SOAP sections
  // You can customize this based on how your chat summary is structured
  
  const { conditions = [], confidence = null, narrativeSummary = '' } = chatSummary;
  
  // Simple conversion logic - you can enhance this based on your actual data structure
  const soapData = {
    patientName: patientInfo.name || 'Patient',
    patientAge: patientInfo.age || '',
    patientGender: patientInfo.gender || '',
    consultDate: patientInfo.consultDate || new Date().toLocaleDateString(),
    subjective: narrativeSummary || 'Patient reported symptoms as described in consultation.',
    objective: 'Assessment based on patient-reported symptoms and AI analysis.',
    assessment: conditions.length > 0 
      ? `Differential diagnosis includes:\n${conditions.map((c, i) => `- ${c.name}: ${c.percentage}% likelihood`).join('\n')}`
      : 'Differential diagnosis to be determined based on clinical evaluation.',
    plan: `AI assessment confidence: ${confidence}%. Recommended follow-up with healthcare provider for comprehensive evaluation and appropriate diagnostic testing.`
  };

  return soapData;
};

// Combined function that takes chat data and generates SOAP note
export const generateSOAPFromChatData = (chatData, patientInfo = {}) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  return generateSOAPNotePDF(soapData);
};

export const downloadSOAPFromChatData = (chatData, patientInfo = {}, filename = 'SOAP_Note.pdf') => {
  const doc = generateSOAPFromChatData(chatData, patientInfo);
  doc.save(filename);
};
// File: src/utils/pdfGenerator/index.js
// Main export file - re-export all PDF generators
export * from './sharedUtils';
export * from './doctorsReport';
export * from './patientReport';
export * from './soapNotes';

// Combined download function
export const downloadAllReports = async (
  soapData,
  patientInfo = {},
  baseFilename = "Cira_Reports"
) => {
  try {
    // Generate all three reports (without logo for now)
    const { generateDoctorsReportPDF } = await import('./doctorsReport');
    const { generatePatientReportPDF } = await import('./patientReport');
    const { generateSOAPNotesPDF } = await import('./soapNotes');
    
    // Generate all three reports
    const doctorsReport = generateDoctorsReportPDF(soapData);
    const patientReport = generatePatientReportPDF(soapData);
    const soapNotes = generateSOAPNotesPDF(soapData);
    
    // Save each with appropriate names
    doctorsReport.save(`${baseFilename}_Doctor.pdf`);
    patientReport.save(`${baseFilename}_Patient.pdf`);
    soapNotes.save(`${baseFilename}_SOAP.pdf`);
    
    return {
      doctorsReport,
      patientReport,
      soapNotes,
      success: true
    };
  } catch (e) {
    console.warn("Failed to generate reports:", e);
    return {
      success: false,
      error: e
    };
  }
};

// Individual download functions
export const downloadDoctorsReport = async (
  soapData,
  filename = "Cira_Doctors_Report.pdf"
) => {
  try {
    const { generateDoctorsReportPDF } = await import('./doctorsReport');
    const doc = generateDoctorsReportPDF(soapData);
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to generate doctor's report:", e);
    throw e;
  }
};

export const downloadPatientReport = async (
  soapData,
  filename = "Cira_Patient_Summary.pdf"
) => {
  try {
    const { generatePatientReportPDF } = await import('./patientReport');
    const doc = generatePatientReportPDF(soapData);
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to generate patient's report:", e);
    throw e;
  }
};

export const downloadSOAPNotes = async (
  soapData,
  filename = "Cira_SOAP_Notes.pdf"
) => {
  try {
    const { generateSOAPNotesPDF } = await import('./soapNotes');
    const doc = generateSOAPNotesPDF(soapData);
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Failed to generate SOAP notes:", e);
    throw e;
  }
};

// Main function to prepare data and generate PDF
export const prepareAndGeneratePDF = (type, consultationData, patientInfo) => {
  const timestamp = Date.now();
  let filename = `Cira_Consult_Report_${timestamp}.pdf`;
  
  switch (type) {
    case 'doctor':
      filename = `Cira_Doctor_Report_${timestamp}.pdf`;
      return downloadDoctorsReport(consultationData, filename);
    case 'patient':
      filename = `Cira_Patient_Summary_${timestamp}.pdf`;
      return downloadPatientReport(consultationData, filename);
    case 'soap':
      filename = `Cira_SOAP_Notes_${timestamp}.pdf`;
      return downloadSOAPNotes(consultationData, filename);
    default:
      // Default to SOAP notes
      return downloadSOAPNotes(consultationData, filename);
  }
};

// Default export
export default {
  downloadAllReports,
  downloadDoctorsReport,
  downloadPatientReport,
  downloadSOAPNotes,
  prepareAndGeneratePDF,
};
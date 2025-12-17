// File: src/utils/clinicalReport/doctorReportPdf.js
import { jsPDF } from "jspdf";
import starsLogo from "../../assets/stars.svg";

/* ----------------- Colors ----------------- */
const COLORS = {
  primary: "#6A1B9A",
  secondary: "#C2185B",
  yellow: "#D69E2E",
  pageBg: "#FBF7F2",
  green: "#16A34A",
  grayText: "#4B5563",
  grayLight: "#E5E7EB",
  white: "#FFFFFF",
  red: "#DC2626",
  greenCheck: "#16A34A",
};

/* ----------------- Color helpers ----------------- */
function hexToRgb(hex) {
  const clean = String(hex || "").replace("#", "");
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

/* ----------------- Safe text in fixed box (wrap + ellipsis) ----------------- */
function textInBox(doc, text, x, y, maxW, maxH, lineH, opts = {}) {
  const padBottom = opts.padBottom ?? 1;
  const safeH = Math.max(0, maxH - padBottom);

  const raw = (text ?? "").toString().trim();
  if (!raw) return 0;

  let lines = doc.splitTextToSize(raw, maxW);
  const maxLines = Math.max(1, Math.floor(safeH / lineH));

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = (last.length > 3 ? last.slice(0, -3) : last) + "…";
  }

  for (let i = 0; i < lines.length; i++) doc.text(lines[i], x, y + i * lineH);
  return lines.length * lineH;
}

/* ----------------- Condition cleanup (forces clean top 3) ----------------- */
function cleanConditions(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const blockedPatterns = [/medication/i, /self[-\s]*care/i, /recommendation/i, /doctor/i];

  const cleaned = [];
  for (const item of list) {
    if (!item) continue;
    const name = (item.name ?? "").toString().trim();
    if (!name) continue;
    if (blockedPatterns.some((re) => re.test(name))) continue;

    const pct = Number(item.percentage ?? 0);
    const norm = name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);

    cleaned.push({ name, percentage: Number.isFinite(pct) ? pct : 0 });
  }

  cleaned.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  return cleaned.slice(0, 3);
}

/* ----------------- Card + layouts (pixel-stable) ----------------- */
const PAGE_W = 210;
const PAGE_H = 297;
const M = 8; // page margin
const G = 3; // gap
const COL_W = (PAGE_W - M * 2 - G) / 2;
const LEFT_X = M;
const RIGHT_X = M + COL_W + G;

function drawCard(doc, x, y, w, h, title) {
  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  setTextHex(doc, "#111827");
  doc.text(title, x + 3, y + 5);

  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.2);
  doc.line(x + 3, y + 6.2, x + w - 3, y + 6.2);

  return { innerX: x + 3, innerY: y + 11, innerW: w - 6, innerH: h - 12 };
}

function drawKV(doc, box, rows) {
  const labelW = box.innerW * 0.52;
  const valueW = box.innerW - labelW;
  const lineH = 3.2;
  let cy = box.innerY;

  doc.setFontSize(7);

  for (const { label, value } of rows) {
    if (cy + lineH > box.innerY + box.innerH) break;

    doc.setFont("helvetica", "normal");
    setTextHex(doc, COLORS.grayText);
    doc.text(label, box.innerX, cy);

    doc.setFont("helvetica", "bold");
    setTextHex(doc, "#111827");
    textInBox(doc, value ?? "—", box.innerX + labelW, cy, valueW, lineH, lineH);

    cy += lineH;
  }
}

function drawPill(doc, x, y, w, h, text, fillHex) {
  const radius = h / 2; // cleaner pill

  setFillHex(doc, fillHex);
  doc.setDrawColor(0, 0, 0, 0);

  // Draw pill
  doc.roundedRect(x, y - h + 0.8, w, h, radius, radius, "F");

  // Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5); // 🔽 smaller text
  setTextHex(doc, "#FFFFFF");

  // ✅ Optical vertical centering
  const textY = y - 0.5;

  doc.text(String(text ?? ""), x + w / 2, textY, {
    align: "center",
  });
}


function pillColorFor(value) {
  const v = (value ?? "").toString().toLowerCase();
  if (v.startsWith("no")) return "#5FAE7E";
  if (v.startsWith("yes")) return COLORS.red;
  return "#9CA3AF";
}

function normalizeYesNoUnknown(v) {
  if (v == null) return "Unknown";
  const s = String(v).trim();
  if (!s) return "Unknown";
  const low = s.toLowerCase();
  if (low === "true") return "Yes";
  if (low === "false") return "No";
  if (low === "y") return "Yes";
  if (low === "n") return "No";
  if (low.startsWith("yes")) return "Yes";
  if (low.startsWith("no")) return "No";
  return s; // allow "Not specified"
}

function drawPossibilities(doc, x, y, w, h, confidence, list3) {
  const box = drawCard(
    doc,
    x,
    y,
    w,
    h,
    `CLINICAL POSSIBILITIES (AI Confidence: ${confidence ?? "--"}%)`
  );

  const items = (Array.isArray(list3) ? list3 : []).slice(0, 3);
  while (items.length < 3) items.push({ name: "—", percentage: 0 });

  const rowH = 7.3;
  const barX = box.innerX + box.innerW * 0.38;
  const barW = box.innerW * 0.58;
  const pctX = box.innerX + box.innerW;

  const colors = [COLORS.secondary, COLORS.yellow, COLORS.green];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  items.forEach((it, idx) => {
    const ry = box.innerY + idx * rowH;

    setTextHex(doc, "#111827");
    textInBox(doc, `- ${it.name ?? "—"}`, box.innerX, ry, box.innerW * 0.36, rowH, 3.2);

    // background bar
    setFillHex(doc, "#E5E7EB");
    doc.roundedRect(barX, ry - 4.2, barW, 4.5, 2, 2, "F");

    // fill bar
    const pct = Math.max(0, Math.min(100, Number(it.percentage ?? 0)));
    const fillW = (pct / 100) * barW;
    setFillHex(doc, colors[idx] || "#9CA3AF");
    doc.roundedRect(barX, ry - 4.2, Math.max(3, fillW), 4.5, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    setTextHex(doc, "#111827");
    doc.text(`${Math.round(pct)}%`, pctX, ry, { align: "right" });
    doc.setFont("helvetica", "normal");
  });
}
function addStatusMark(doc, x, y, ok = true) {
  const prev = doc.getFont();
  const prevSize = doc.getFontSize();

  doc.setFont("ZapfDingbats");
  doc.setFontSize(10);

  const nudge = 3.5; // shift left slightly, adjust as needed

  if (ok) {
    setTextHex(doc, COLORS.greenCheck);
    doc.text("4", x - nudge, y); // ✔
  } else {
    setTextHex(doc, COLORS.red);
    doc.text("8", x - nudge, y); // ✖
  }

  doc.setFont(prev[0], prev[1]);
  doc.setFontSize(prevSize);
}


/* ----------------- MAIN: Generate Doctor Report (Intake-style) ----------------- */
export const generateDoctorReportPDF = (clinicalData = {}, options = {}) => {
  const { logoImage } = options;

  const {
    // minimal fallbacks
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),

    conditions = [],
    confidence = null,
    chiefComplaint = "",

    // Current issue data
    currentIssueData = {},

    // JSON blocks (from your intake JSON)
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

  // ----- Setup doc -----
  const doc = new jsPDF("p", "mm", [PAGE_W, PAGE_H]);

  // Background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Header title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, "#111827");
  doc.text("CIRA CONSULT REPORT", PAGE_W / 2, 12, { align: "center" });

  // small logo (optional)
  if (logoImage) {
    try {
      doc.addImage(logoImage, "PNG", M, 7.2, 7.5, 7.5);
    } catch (_) { }
  }

  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.25);
  doc.line(M, 14, PAGE_W - M, 14);

  // ----- Grid start -----
  let gy = 17;

  // Tuned heights (no overlap)
  const H_TOP = 32;
  const H_MID = 44;
  const H_POSS = 30;
  const H_VITAL = 40;
  const H_EXP = 40;
  const H_BOTTOM = 28;

  // Values
  const nameVal = patient_identity_baseline?.name || patientName || "—";
  const ageVal = patient_identity_baseline?.age ?? patientAge ?? "—";
  const sexVal = patient_identity_baseline?.biological_sex || patientGender || "—";


// ---------- Row 1 ----------
{
  const b1 = drawCard(doc, LEFT_X, gy, COL_W, H_TOP, "PATIENT IDENTITY & BASELINE");
  drawKV(doc, b1, [
    { label: "Name", value: nameVal },
    { label: "Age/Gender", value: `${ageVal} / ${sexVal}` },
    { label: "Height", value: patient_identity_baseline?.height || "—" },
    // { label: "BMI (Calculated)", value: "N/A" },
    { label: "Date", value: consultDate || "—" },
    { label: "Report Type", value: "AI Clinical Intake Summary" },
  ]);

  const b2 = drawCard(doc, RIGHT_X, gy, COL_W, H_TOP, "CHIEF COMPLAINT");
  
  // Get values from multiple sources
  const primaryConcern = chief_complaint?.primary_concern || 
                        currentIssueData?.primarySymptom || 
                        chiefComplaint || 
                        "—";
  const onset = chief_complaint?.onset || 
                currentIssueData?.onset || 
                "—";
  const pattern = chief_complaint?.pattern || 
                  currentIssueData?.pattern || 
                  history_of_present_illness_hpi?.progression_pattern || 
                  "—";
  const severity = currentIssueData?.severity || 
                   (chief_complaint?.severity ? `${chief_complaint.severity}/10` : "—");
  const recentInjury = currentIssueData?.recentInjury || "No";
  const previousEpisodes = chief_complaint?.previous_episodes || "Unknown";
  
  drawKV(doc, b2, [
    { label: "Primary Concern:", value: primaryConcern },
    { label: "Onset:", value: onset },
    { label: "Duration:", value: chief_complaint?.duration || "—" },
    { label: "Severity (Pain):", value: severity },
    { label: "Pattern:", value: pattern },
    { label: "Previous Episodes:", value: previousEpisodes },
    { label: "Recent Injury:", value: recentInjury },
  ]);
}
gy += H_TOP + G;

// ---------- Row 2 ----------
{
  // ---------------- HPI Card ----------------
  const H_HPI = H_MID + 5; // HPI card is taller
  const b4 = drawCard(doc, LEFT_X, gy, COL_W, H_HPI, "HISTORY OF PRESENT ILLNESS (HPI)");

  // Values for HPI
  const location = history_of_present_illness_hpi?.location_or_system || "—";
  const chronicIllnesses = medical_background?.chronic_illnesses || "—";
  const previousSurgeries = medical_background?.previous_surgeries || "—";
  const currentMedications = medical_background?.current_medications || "—";
  const drugAllergies = medical_background?.drug_allergies || "—";
  const familyHistory = medical_background?.family_history || "—";
  const relievingFactors = history_of_present_illness_hpi?.relieving_factors || "None reported";
  const worseningFactors = history_of_present_illness_hpi?.worsening_factors || "None reported";
  const associatedSymptoms = history_of_present_illness_hpi?.associated_symptoms?.join(", ") || "None";

  // Draw HPI fields
  drawKV(doc, b4, [
    { label: "Location:", value: location },
    { label: "Chronic Illnesses:", value: chronicIllnesses },
    { label: "Previous Surgeries:", value: previousSurgeries },
    { label: "Current Medications:", value: currentMedications },
    { label: "Drug Allergies:", value: drugAllergies },
    { label: "Family History:", value: familyHistory },
    { label: "Associated Symptoms:", value: associatedSymptoms },
    { label: "Relieving Factors:", value: relievingFactors },
    { label: "Worsening Factors:", value: worseningFactors },
  ]);

  // ---------------- Functional Status Card ----------------
  const H_FUNC = H_BOTTOM; // Functional Status is shorter
  const b3 = drawCard(doc, RIGHT_X, gy, COL_W, H_FUNC, "FUNCTIONAL STATUS");

  // Draw Functional Status fields
  drawKV(doc, b3, [
    { label: "Eating/drinking normally", value: normalizeYesNoUnknown(functional_status?.eating_drinking_normally) },
    { label: "Hydration", value: normalizeYesNoUnknown(functional_status?.hydration) },
    { label: "Activity level", value: normalizeYesNoUnknown(functional_status?.activity_level) },
  ]);
  
  // Move to next row based on the TALLER card to avoid extra space
  gy += Math.max(H_HPI, H_FUNC) + G;
}

  // ---------- Row 3 (full width): Clinical Possibilities ----------
  {
    const top3 = cleanConditions(conditions || []).map((c) => ({
      name: c.name,
      percentage: c.percentage,
    }));
    const confVal = confidence ?? ai_clinical_assessment?.confidence ?? 85;
    drawPossibilities(doc, LEFT_X, gy, COL_W * 2 + G, H_POSS, confVal, top3);
  }
  gy += H_POSS + G;

  // ---------- Row 4: Vitals + Lifestyle ----------
  {
    const b5 = drawCard(doc, LEFT_X, gy, COL_W, H_VITAL, "VITAL SIGNS & CURRENT STATUS");
    drawKV(doc, b5, [
      {
        label: "Heart Rate",
        value: vital_signs_current_status?.heart_rate_bpm
          ? `${vital_signs_current_status.heart_rate_bpm} bpm`
          : "Not recorded",
      },
      {
        label: "Oxygen Saturation",
        value: vital_signs_current_status?.oxygen_saturation_spo2_percent
          ? `${vital_signs_current_status.oxygen_saturation_spo2_percent}%`
          : "Not recorded",
      },
      { label: "Core Temperature", value: vital_signs_current_status?.core_temperature || "Not measured" },
      { label: "Reported Fever", value: normalizeYesNoUnknown(vital_signs_current_status?.reported_fever) },
      { label: "Blood Pressure", value: vital_signs_current_status?.blood_pressure || "Not measured" },
    ]);

    const b6 = drawCard(doc, RIGHT_X, gy, COL_W, H_VITAL, "LIFESTYLE & RISK FACTORS");
    const lifestyle = [
      ["Smoking", lifestyle_risk_factors?.smoking],
      ["Alcohol Use", lifestyle_risk_factors?.alcohol_use],
      ["Recreational Drugs", lifestyle_risk_factors?.recreational_drugs],
      ["Diet", lifestyle_risk_factors?.diet],
      ["Exercise Routine", lifestyle_risk_factors?.exercise_routine],
      ["Stress Level", lifestyle_risk_factors?.stress_level],
    ];

    const startY = b6.innerY;
    const rowH = 5.2;

    lifestyle.forEach(([lbl, val], i) => {
      const y = startY + i * rowH;
      if (y > b6.innerY + b6.innerH) return;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      setTextHex(doc, COLORS.grayText);
      doc.text(lbl, b6.innerX, y);

      const pillText = normalizeYesNoUnknown(val);
   drawPill(
  doc,
  b6.innerX + b6.innerW * 0.62, // push slightly right
  y,
  b6.innerW * 0.18,            // 🔽 narrower
  3.8,                         // 🔽 shorter
  pillText,
  pillColorFor(pillText)
);
    });
  }
  gy += H_VITAL + G;

  // ---------- Row 5: Exposure + ROS ----------
  {
    const b7 = drawCard(doc, LEFT_X, gy, COL_W, H_EXP, "EXPOSURE & ENVIRONMENT");
    const exp = [
      ["Recent Travel", exposure_environment?.recent_travel],
      ["Sick Contacts", exposure_environment?.sick_contacts],
      ["Crowded Events", exposure_environment?.crowded_events],
      ["Workplace/Chemical Exposure", exposure_environment?.workplace_chemical_exposure],
      ["Weather Exposure", exposure_environment?.weather_exposure],
    ];

    const startY = b7.innerY;
    const rowH = 5.2;

   exp.forEach(([lbl, val], i) => {
  const y = startY + i * rowH;
  if (y > b7.innerY + b7.innerH) return;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, COLORS.grayText);
  doc.text(lbl, b7.innerX, y);

  const pillText = normalizeYesNoUnknown(val);
  drawPill(
    doc,
    b7.innerX + b7.innerW * 0.62, // push slightly right like b6
    y,
    b7.innerW * 0.18,             // narrower pill
    3.8,                           // shorter height
    pillText,
    pillColorFor(pillText)
  );
});

    const b8 = drawCard(doc, RIGHT_X, gy, COL_W, H_EXP, "REVIEW OF SYSTEMS (ROS) – TRAFFIC LIGHT VIEW");
    const ros = [
      ["Shortness of Breath", review_of_systems_traffic_light_view?.shortness_of_breath?.answer],
      ["Chest Pain", review_of_systems_traffic_light_view?.chest_pain?.answer],
      ["Sore Throat", review_of_systems_traffic_light_view?.sore_throat?.answer],
      ["Body Aches/Fatigue", review_of_systems_traffic_light_view?.body_aches_fatigue?.answer],
      ["Vomiting/Diarrhea", review_of_systems_traffic_light_view?.vomiting_diarrhea?.answer],
      ["Urinary Changes", review_of_systems_traffic_light_view?.urinary_changes?.answer],
      ["Skin Rash", review_of_systems_traffic_light_view?.skin_rash?.answer],
      ["Mental Status Changes", review_of_systems_traffic_light_view?.mental_status_changes?.answer],
    ];

    const rStartY = b8.innerY;

    ros.forEach(([lbl, val], i) => {
  const y = rStartY + i * rowH;
  if (y > b8.innerY + b8.innerH) return;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextHex(doc, COLORS.grayText);
  doc.text(lbl, b8.innerX, y);

  const pillText = normalizeYesNoUnknown(val);
  drawPill(
    doc,
    b8.innerX + b8.innerW * 0.62, // push slightly right like b6
    y,
    b8.innerW * 0.18,             // narrower pill
    3.8,                           // shorter height
    pillText,
    pillColorFor(pillText)
  );
});
  }
  gy += H_EXP + G;

// ---------------- AI CLINICAL ASSESSMENT ----------------
const b9 = drawCard(doc, LEFT_X, gy, COL_W, H_MID - 16, "AI CLINICAL ASSESSMENT"); // reduced height

// values (from your JSON)
const overall = ai_clinical_assessment?.overall_stability || "Unknown";
const redFlags = normalizeYesNoUnknown(ai_clinical_assessment?.red_flag_symptoms_present);

// decide mark color
const overallOk = String(overall).toLowerCase().includes("stable");
const redFlagOk = String(redFlags).toLowerCase().startsWith("no");

// vertical positions for text/marks
const r1y = b9.innerY + 2; // Overall Stability
const r2y = r1y + 6;       // Red-Flag Symptoms (keep close for reduced height)

doc.setFont("helvetica", "normal");
doc.setFontSize(8);
setTextHex(doc, "#111827");

// labels (optional, or can remove if only marks are needed)
doc.text("Overall Stability:", b9.innerX, r1y);
doc.text("Red-Flag Symptoms:", b9.innerX, r2y);

// right-side marks only
const rightX = b9.innerX + b9.innerW - 4;
addStatusMark(doc, rightX, r1y, overallOk);
addStatusMark(doc, rightX, r2y, redFlagOk);

// ---------------- CLINICAL NOTE ----------------
const b10 = drawCard(doc, RIGHT_X, gy, COL_W, H_BOTTOM, "CLINICAL NOTE TO PHYSICIAN");
doc.setFont("helvetica", "normal");
doc.setFontSize(7);
setTextHex(doc, COLORS.grayText);

textInBox(
  doc,
  ai_clinical_assessment?.clinical_note_to_physician || "—",
  b10.innerX,
  b10.innerY,
  b10.innerW,
  b10.innerH,
  3.2
);


  // Footer disclaimer (no overlap)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  setTextHex(doc, "#6B7280");
  doc.text(
    "Cira is an AI clinical decision support assistant and doesn’t replace professional medical judgment.",
    PAGE_W / 2,
    PAGE_H - 6,
    { align: "center" }
  );

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
export const downloadDoctorReportPDF = async (
  clinicalData,
  patientInfo = {},
  filename = "Cira_Clinical_Intake_Report.pdf"
) => {
  const combinedData = {
    ...clinicalData,
    patientName: patientInfo.name || clinicalData?.patientName || "Patient",
    patientAge: patientInfo.age || clinicalData?.patientAge || "",
    patientGender: patientInfo.gender || clinicalData?.patientGender || "",
    consultDate: patientInfo.consultDate || clinicalData?.consultDate || new Date().toLocaleDateString(),
  };

  try {
    const logoImage = await loadStarsLogo();
    const doc = generateDoctorReportPDF(combinedData, { logoImage });
    doc.save(filename);
    return doc;
  } catch (e) {
    console.warn("Logo load failed, generating without logo:", e);
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

  // -------------------- Title: SOAP Note --------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CLINICAL SOAP NOTE", pageW / 2, y, { align: "center" });
  
  // Optional logo
  if (options.logoImage) {
    try {
      doc.addImage(options.logoImage, "PNG", marginX, y - 3, 15, 15);
    } catch (_) { }
  }
  
  y += 7;

  // -------------------- Header: Patient Info --------------------
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(marginX, y, pageW - marginX, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PATIENT INFORMATION", marginX, y);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${consultDate || new Date().toLocaleDateString("en-US")}`, pageW - marginX, y, { align: "right" });
  
  y += 8;

  const patientDetails = [];
  if (patientName) patientDetails.push(`Name: ${patientName}`);
  if (patientAge) patientDetails.push(`Age: ${patientAge}`);
  if (patientGender) patientDetails.push(`Gender: ${patientGender}`);
  
  if (patientDetails.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(patientDetails.join("   |   "), marginX, y);
    y += 14;
  }

  // -------------------- ADD MEASUREMENTS SECTION AT THE TOP --------------------
  // Add Measurements section before Current Issues
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MEASUREMENTS:", marginX, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  // Display measurements in a 2-column format
  const measurements = [
    "• weight 73 kg",
    "• height 6 feet", 
    "• blood pressure not measured",
    "• temperature 100 °F"
  ];
  
  const measurementCols = 2;
  const colWidth = (contentW - 10) / measurementCols;
  
  measurements.forEach((measurement, idx) => {
    const col = idx % measurementCols;
    const row = Math.floor(idx / measurementCols);
    const x = marginX + 5 + (col * colWidth);
    const measurementY = y + (row * 7);
    
    doc.text(measurement, x, measurementY);
  });
  
  y += (Math.ceil(measurements.length / measurementCols) * 7) + 12; // Add space after measurements

  // -------------------- Helper: Extract concise answers from text --------------------
  const extractConciseAnswers = (text) => {
    if (!text) return {};
    
    const textLower = text.toLowerCase();
    const answers = {};
    
    // Define question keywords and extraction patterns
    const questionPatterns = {
      "What's wrong?": [
        /(?:complains of|reporting|experiencing|has|suffering from)\s+([^\.]+?)(?:\.|\s+for)/i,
        /(?:chief complaint|presenting with|main issue|primary concern)\s*:?\s*([^\.]+)/i,
        /(?:symptoms?|problem|condition)\s*:?\s*([^\.]+)/i
      ],
      "Since when?": [
        /(?:since|for|started|began|duration)[:\s]+([^\.]+?)(?:\.|\s+ago)/i,
        /(\d+\s*(?:day|week|month|year|hour)s?\s+ago)/i,
        /(?:onset|duration)[:\s]+([^\.]+)/i
      ],
      "When did it start?": [
        /(?:started|began|onset)[:\s]+([^\.]+?)(?:\.|\s+on)/i,
        /(?:exact onset|specifically started)[:\s]+([^\.]+)/i,
        /(?:initial|first noticed)[:\s]+([^\.]+)/i
      ],
      "Where does it hurt?": [
        /(?:location|where|site|area)[:\s]+([^\.]+?)(?:\.|\s+pain)/i,
        /(?:pain|discomfort|hurt|ache)\s+(?:in|at|on)\s+([^\.]+)/i,
        /(?:localized to|radiates to|affecting)[:\s]+([^\.]+)/i
      ],
      "Pain level (1-10)": [
        /(?:pain|discomfort)\s*(?:level|scale|score)[:\s]*(\d+(?:\/\d+)?)/i,
        /(\d+)\s*(?:out of|of|on a scale of)\s*\d+\s*(?:pain|scale)/i,
        /pain[:\s]+(\d+)\/10/i
      ],
      "Is the pain constant or comes and goes?": [
        /(?:constant|intermittent|comes and goes|on and off|persistent)[:\s]+([^\.]+)/i,
        /(?:pain pattern|frequency)[:\s]+([^\.]+)/i,
        /(?:continuous|episodic|sporadic)[:\s]+([^\.]+)/i
      ],
      "Does anything make it better?": [
        /(?:relieved|improved|better|eases)[:\s]+([^\.]+)/i,
        /(?:alleviating|helpful|reducing)[:\s]+([^\.]+)/i,
        /(?:relief|improvement|reduction)[:\s]+([^\.]+)/i
      ],
      "Does anything make it worse?": [
        /(?:worse|exacerbated|aggravated|increased)[:\s]+([^\.]+)/i,
        /(?:aggravating|triggering|worsening)[:\s]+([^\.]+)/i,
        /(?:exacerbation|worsening)[:\s]+([^\.]+)/i
      ],
      "Did this happen before?": [
        /(?:previous|prior|past|history|happened before)[:\s]+([^\.]+)/i,
        /(?:similar|same|recurrent)[:\s]+([^\.]+)/i,
        /(?:history of|previous episodes)[:\s]+([^\.]+)/i
      ],
      "Any recent injury?": [
        /(?:injury|trauma|accident|hurt)[:\s]+([^\.]+)/i,
        /(?:recently injured|recent trauma|accidental)[:\s]+([^\.]+)/i,
        /(?:mechanism|cause)[:\s]+([^\.]+)/i
      ],
      "Any new symptom recently?": [
        /(?:new|recent|additional|other)[:\s]+([^\.]+)/i,
        /(?:accompanying|associated|related)[:\s]+([^\.]+)/i,
        /(?:recently developed|newly appeared)[:\s]+([^\.]+)/i
      ]
    };
    
    // Try to extract answer for each question
    Object.keys(questionPatterns).forEach(question => {
      let answer = "Not specified";
      
      // Try each pattern for this question
      for (const pattern of questionPatterns[question]) {
        const match = text.match(pattern);
        if (match && match[1]) {
          answer = match[1].trim();
          // Clean up the answer
          answer = answer.replace(/^[:\-\s]+/, '').replace(/[\.\s]+$/, '');
          
          // Truncate long answers
          if (answer.length > 50) {
            const words = answer.split(' ');
            answer = words.slice(0, 8).join(' ') + '...';
          }
          break;
        }
      }
      
      answers[question] = answer;
    });
    
    // If we couldn't extract specific answers, use the first few sentences
    if (Object.values(answers).every(ans => ans === "Not specified")) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 0) {
        answers["What's wrong?"] = sentences[0].trim().substring(0, 60) + (sentences[0].length > 60 ? '...' : '');
        if (sentences.length > 1) {
          answers["Since when?"] = sentences[1].trim().substring(0, 60) + (sentences[1].length > 60 ? '...' : '');
        }
      }
    }
    
    return answers;
  };

  // -------------------- Helper: Format bullet points --------------------
  const formatBulletPoints = (text, indent = 0) => {
    if (!text) return [];
    
    const lines = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed) return;
      
      if (index === 0 && trimmed.includes(":") && trimmed.split(":")[0].length < 20) {
        // This is likely a label like "Measurements:" - keep it as a header
        lines.push({ text: trimmed, isBullet: false, isHeader: true });
      } else {
        lines.push({ 
          text: trimmed.replace(/^[•\-]\s*/, ""), // Remove existing bullets
          isBullet: true,
          isHeader: false 
        });
      }
    });
    
    return lines;
  };

  // -------------------- Helper: Add measurements section --------------------
  const addMeasurementsSection = (text) => {
    if (!text) return text;
    
    // Extract measurements section
    const measurementsMatch = text.match(/Measurements:[\s\S]*/i);
    if (!measurementsMatch) return text;
    
    const measurementsText = measurementsMatch[0];
    const remainingText = text.replace(measurementsText, "").trim();
    
    // Parse measurements
    const measurements = measurementsText
      .replace(/^Measurements:\s*/i, "")
      .split(/,\s*/)
      .map(m => m.trim())
      .filter(m => m);
    
    if (measurements.length === 0) return text;
    
    // Draw measurements in a table format
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("MEASUREMENTS:", marginX, y);
    y += 7;
    
    doc.setFont("helvetica", "normal");
    const measurementCols = 2;
    const colWidth = (contentW - 10) / measurementCols;
    
    measurements.forEach((measurement, idx) => {
      const col = idx % measurementCols;
      const row = Math.floor(idx / measurementCols);
      const x = marginX + 5 + (col * colWidth);
      const measurementY = y + (row * 6);
      
      // Format measurement nicely
      const formatted = measurement
        .replace(/(\d+(\.\d+)?)\s*(°?[CF]|kg|feet|cm|in)/, "$1 $3") // Add space before units
        .replace(/\s+/g, " ")
        .trim();
      
      doc.text(`• ${formatted}`, x, measurementY);
      
      // Update y position if this is the last item in column
      if (idx === measurements.length - 1 && col === measurementCols - 1) {
        y += (row + 1) * 6;
      } else if (idx === measurements.length - 1) {
        y += (row + 1) * 6;
      }
    });
    
    y += 5;
    return remainingText;
  };

  // -------------------- Helper: add one SOAP section --------------------
  const addSOAPSection = (title, textValue) => {
    if (y > 260) {
      doc.addPage();
      y = 22;
    }

    // Section header with underline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), marginX, y);
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(marginX, y + 1, marginX + 40, y + 1);
    
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const raw = (textValue || "").trim();
    if (!raw) {
      doc.text("• No data available", marginX, y);
      y += 8;
      return;
    }

    // Special handling for Subjective section with concise Q&A
    if (title.toLowerCase() === "subjective") {
      // Extract concise answers
      const answers = extractConciseAnswers(raw);
      
      // Add Current Issue header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Current Issue:", marginX, y);
      y += 8;
      
      // Define the questions in order
      const questions = [
        "What's wrong?",
        "Since when?",
        "When did it start?",
        "Where does it hurt?",
        "Pain level (1-10)",
        "Is the pain constant or comes and goes?",
        "Does anything make it better?",
        "Does anything make it worse?",
        "Did this happen before?",
        "Any recent injury?",
        "Any new symptom recently?"
      ];
      
      // Display each question with its concise answer
      questions.forEach((question, index) => {
        if (y > 280) {
          doc.addPage();
          y = 22;
        }
        
        const answer = answers[question] || "Not specified";
        
        // Question in bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`• ${question}`, marginX + 5, y);
        
        // Answer in normal text, indented
        doc.setFont("helvetica", "normal");
        const answerLines = doc.splitTextToSize(answer, contentW - 15);
        answerLines.forEach((line, lineIndex) => {
          doc.text(line, marginX + 15, y + (lineIndex + 1) * 5);
        });
        
        y += (answerLines.length * 5) + 8;
      });
      
      y += 5;
      return;
    }

    // Handle measurements section first (for Objective section)
    const textWithoutMeasurements = title.toLowerCase() === "objective" 
      ? addMeasurementsSection(raw)
      : raw;
    
    // Process remaining text as bullet points
    const bulletLines = formatBulletPoints(textWithoutMeasurements);
    
    bulletLines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 22;
      }

      if (line.isHeader) {
        // Header line (like "Measurements:")
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(line.text, marginX, y);
        y += 6;
      } else if (line.isBullet) {
        // Bullet point
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        // Draw bullet character
        doc.text("•", marginX, y);
        
        // Split text into multiple lines if needed
        const textLines = doc.splitTextToSize(line.text, contentW - 8);
        textLines.forEach((textLine, lineIndex) => {
          const indent = lineIndex === 0 ? marginX + 4 : marginX + 8;
          doc.text(textLine, indent, y + (lineIndex * 6));
        });
        
        y += (textLines.length * 4.8) + 1.5;
      } else {
        // Regular text
        const textLines = doc.splitTextToSize(line.text, contentW);
        textLines.forEach((textLine) => {
          doc.text(textLine, marginX, y);
          y += 6;
        });
        y += 3;
      }
    });

    y += 8; // Extra space between sections
  };

  // -------------------- S / O / A / P in order --------------------
  addSOAPSection("Subjective", subjective);
  addSOAPSection("Objective", objective);
  addSOAPSection("Assessment", assessment);
  addSOAPSection("Plan", plan);

  // -------------------- Footer --------------------
  y = 280;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(marginX, y, pageW - marginX, y);
  y += 5;
  
  const footerText = "Generated by Cira AI Clinical Assistant. This SOAP note is for informational purposes only and should be reviewed by a qualified healthcare professional.";
  doc.text(footerText, pageW / 2, y, { align: "center" });

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
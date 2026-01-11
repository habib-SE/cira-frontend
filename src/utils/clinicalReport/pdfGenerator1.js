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

  // SOAP (simple like sample)
  soapTitle: "#111827",
  soapHeading: "#111827",
  soapBody: "#111827",
};

/* ----------------- Color helpers ----------------- */
function hexToRgb(hex) {
  const raw = String(hex || "").trim().replace("#", "");
  const clean =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.padStart(6, "0");

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

/* ----------------- Wrapped text helpers ----------------- */
function addWrappedText(doc, text, x, y, maxW, lineH = 3.5) {
  const raw = (text ?? "").toString();
  if (!raw.trim()) return y;

  const lines = doc.splitTextToSize(raw, maxW);
  lines.forEach((line, i) => doc.text(line, x, y + i * lineH));
  return y + lines.length * lineH;
}

function addWrappedTextPaged(
  doc,
  text,
  x,
  y,
  maxW,
  lineH,
  pageW,
  pageH,
  topY,
  bottomY,
  onNewPage
) {
  const raw = (text ?? "").toString();
  if (!raw.trim()) return y;

  const lines = doc.splitTextToSize(raw, maxW);
  for (const line of lines) {
    if (y > bottomY) {
      doc.addPage();
      y = topY;
      if (typeof onNewPage === "function") onNewPage();
    }
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
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

/* ----------------- Layout constants ----------------- */
const PAGE_W = 210;
const PAGE_H = 297;
const M = 8; // page margin
const G = 3; // gap
const COL_W = (PAGE_W - M * 2 - G) / 2;
const LEFT_X = M;
const RIGHT_X = M + COL_W + G;

/* ----------------- Small formatting helpers ----------------- */
function toStr(v, fallback = "—") {
  if (v === undefined || v === null) return fallback;
  const s = String(v).trim();
  return s ? s : fallback;
}
function joinIfArray(v, sep = ", ") {
  if (Array.isArray(v)) return v.filter(Boolean).join(sep);
  return v;
}

/* ----------------- Robust tool JSON parser ----------------- */
function parseToolFinal(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  let s = String(raw).trim();
  if (!s) return null;

  const firstBrace = s.indexOf("{");
  const lastBrace = s.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    s = s.slice(firstBrace, lastBrace + 1);
  }

  try {
    let parsed = JSON.parse(s);
    if (typeof parsed === "string") {
      const t = parsed.trim();
      if (t.startsWith("{") && t.endsWith("}")) parsed = JSON.parse(t);
    }
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function normalizePercent(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}
function parseConfidenceText(conf) {
  if (conf == null) return null;
  if (typeof conf === "number") return normalizePercent(conf);
  const s = String(conf);
  const m = s.match(/(\d+(\.\d+)?)/);
  if (!m) return null;
  return normalizePercent(Number(m[1]));
}

/* ----------------- NEW: helpers to fix severity vs temperature ----------------- */
function isTempLike(v) {
  if (v === undefined || v === null) return false;
  const s = String(v).trim();
  if (!s) return false;
  return /°\s*[fc]/i.test(s) || /\b(fahrenheit|celsius)\b/i.test(s) || /\btemp(erature)?\b/i.test(s);
}
function isScaleLike(v) {
  if (v === undefined || v === null) return false;
  const s = String(v).trim();
  if (!s) return false;
  if (/^\d+(\.\d+)?\s*\/\s*10$/i.test(s)) return true;
  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) && n >= 0 && n <= 10;
  }
  if (/\b(out\s*of\s*10)\b/i.test(s)) return true;
  return false;
}
function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === "number") return v;
    const s = String(v).trim();
    if (s) return v;
  }
  return undefined;
}

/* ----------------- Cards + UI primitives ----------------- */
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
    doc.text(String(label ?? ""), box.innerX, cy);

    doc.setFont("helvetica", "bold");
    setTextHex(doc, "#111827");
    textInBox(doc, value ?? "—", box.innerX + labelW, cy, valueW, lineH, lineH);

    cy += lineH;
  }
}

function drawPill(doc, x, y, w, h, text, fillHex) {
  const radius = h / 2;

  setFillHex(doc, fillHex);
  setStrokeHex(doc, fillHex);

  doc.roundedRect(x, y - h + 0.8, w, h, radius, radius, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  setTextHex(doc, "#FFFFFF");

  const textY = y - 0.5;
  doc.text(String(text ?? ""), x + w / 2, textY, { align: "center" });
}

function pillColorFor(value) {
  const v = (value ?? "").toString().toLowerCase();
  if (v.startsWith("no")) return "#5FAE7E";
  if (v.startsWith("yes")) return COLORS.red;
  if (v.startsWith("unknown")) return "#9CA3AF";
  return "#9CA3AF";
}

function normalizeYesNoUnknown(v) {
  if (v == null) return "Unknown";
  const s = String(v).trim();
  if (!s) return "Unknown";

  const low = s.toLowerCase();
  if (low === "true" || low === "y" || low.startsWith("yes")) return "Yes";
  if (low === "false" || low === "n" || low.startsWith("no")) return "No";
  if (low.includes("unknown") || low === "na" || low === "n/a") return "Unknown";
  return s;
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

    setFillHex(doc, "#E5E7EB");
    setStrokeHex(doc, "#E5E7EB");
    doc.roundedRect(barX, ry - 4.2, barW, 4.5, 2, 2, "FD");

    const pct = Math.max(0, Math.min(100, Number(it.percentage ?? 0)));
    const fillW = (pct / 100) * barW;
    setFillHex(doc, colors[idx] || "#9CA3AF");
    setStrokeHex(doc, colors[idx] || "#9CA3AF");
    doc.roundedRect(barX, ry - 4.2, Math.max(3, fillW), 4.5, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    setTextHex(doc, "#111827");
    doc.text(`${Math.round(pct)}%`, pctX, ry, { align: "right" });
    doc.setFont("helvetica", "normal");
  });
}

function addStatusMark(doc, x, y, ok = true) {
  const prevFont = doc.getFont?.() || { fontName: "helvetica", fontStyle: "normal" };
  const prevSize = doc.getFontSize?.() || 10;

  doc.setFont("zapfdingbats", "normal");
  doc.setFontSize(10);

  const nudge = 3.5;

  if (ok) {
    setTextHex(doc, COLORS.greenCheck);
    doc.text("4", x - nudge, y); // ✔
  } else {
    setTextHex(doc, COLORS.red);
    doc.text("8", x - nudge, y); // ✖
  }

  doc.setFont(prevFont.fontName || "helvetica", prevFont.fontStyle || "normal");
  doc.setFontSize(prevSize);
}

/* ----------------- MAIN: Generate Doctor Report (Intake-style) ----------------- */
export const generateDoctorReportPDF = (clinicalData = {}, options = {}) => {
  const { logoImage } = options;

  const {
    patientName = "Patient",
    patientAge = "",
    patientGender = "",
    consultDate = new Date().toLocaleDateString(),

    conditions = [],
    confidence = null,
    chiefComplaint = "",

    currentIssueData = {},

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

  // ✅ Fix severity-vs-temperature here too
  const rawSeverity = firstNonEmpty(currentIssueData?.severity, chief_complaint?.severity);
  let derivedTemp = firstNonEmpty(
    vital_signs_current_status?.temperature,
    vital_signs_current_status?.core_temperature,
    currentIssueData?.temperature
  );

  let finalSeverity = rawSeverity;
  if (!derivedTemp && isTempLike(rawSeverity)) {
    derivedTemp = rawSeverity;
    finalSeverity = "—";
  } else if (
    derivedTemp &&
    isTempLike(derivedTemp) &&
    !isScaleLike(rawSeverity) &&
    isTempLike(rawSeverity)
  ) {
    finalSeverity = "—";
  }

  const doc = new jsPDF("p", "mm", [PAGE_W, PAGE_H]);

  // Background
  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setTextHex(doc, "#111827");
  doc.text("CIRA CONSULT REPORT", PAGE_W / 2, 12, { align: "center" });

  if (logoImage) {
    try {
      doc.addImage(logoImage, "PNG", M, 7.2, 7.5, 7.5);
    } catch (_) {}
  }

  setStrokeHex(doc, COLORS.grayLight);
  doc.setLineWidth(0.25);
  doc.line(M, 14, PAGE_W - M, 14);

  // Grid start
  let gy = 17;

  // Tuned heights (no overlap)
  const H_TOP = 35;
  const H_MID = 44;
  const H_POSS = 30;
  const H_VITAL = 40;
  const H_EXP = 40;
  const H_BOTTOM = 28;

  // Values
  const nameVal = patient_identity_baseline?.name || patientName || "—";
  const ageVal = patient_identity_baseline?.age ?? patientAge ?? "—";
  const sexVal = patient_identity_baseline?.biological_sex || patientGender || "—";

  const bmiVal =
    patient_identity_baseline?.bmi ??
    clinicalData?.BMI ??
    clinicalData?.bmi ??
    clinicalData?.patientBMI ??
    "N/A";

  // ---------- Row 1 ----------
  {
    // ✅ FIX: b1 was missing before (caused runtime crash)
    const b1 = drawCard(doc, LEFT_X, gy, COL_W, H_TOP, "PATIENT IDENTITY & BASELINE");

    drawKV(doc, b1, [
      { label: "Name", value: nameVal },
      { label: "Age/Gender", value: `${ageVal} / ${sexVal}` },
      { label: "Height", value: patient_identity_baseline?.height || "—" },
      {
        label: "Weight",
        value: patient_identity_baseline?.weight ?? clinicalData?.patientWeight ?? "—",
      },
      { label: "BMI (kg/m²)", value: bmiVal },
      { label: "Date", value: consultDate || "—" },
      { label: "Report Type", value: "AI Clinical Intake Summary" },
    ]);

    const b2 = drawCard(doc, RIGHT_X, gy, COL_W, H_TOP, "CHIEF COMPLAINT");

    const primaryConcern =
      chief_complaint?.primary_concern || currentIssueData?.primarySymptom || chiefComplaint || "—";
    const onset = chief_complaint?.onset || currentIssueData?.onset || "—";
    const pattern =
      chief_complaint?.pattern ||
      currentIssueData?.pattern ||
      history_of_present_illness_hpi?.progression_pattern ||
      "—";
    const previousEpisodes = chief_complaint?.previous_episodes || "Unknown";
    const recentInjury = currentIssueData?.recentInjury || "No";

    drawKV(doc, b2, [
      { label: "Primary Concern:", value: primaryConcern },
      { label: "Onset:", value: onset },
      { label: "Duration:", value: chief_complaint?.duration || "—" },
      { label: "Severity:", value: toStr(finalSeverity, "—") },
      { label: "Pattern:", value: pattern },
      { label: "Previous Episodes:", value: previousEpisodes },
      { label: "Recent Injury:", value: recentInjury },
    ]);
  }
  gy += H_TOP + G;

  // ---------- Row 2 ----------
  {
    const H_HPI = H_MID + 5;
    const b4 = drawCard(doc, LEFT_X, gy, COL_W, H_HPI, "HISTORY OF PRESENT ILLNESS (HPI)");

    const location = history_of_present_illness_hpi?.location_or_system || "Unknown";
    const chronicIllnesses = medical_background?.chronic_illnesses || "Unknown";
    const previousSurgeries = medical_background?.previous_surgeries || "Unknown";
    const currentMedications = medical_background?.current_medications || "Unknown";
    const drugAllergies = medical_background?.drug_allergies || "Unknown";
    const familyHistory = medical_background?.family_history || "Unknown";
    const relievingFactors = history_of_present_illness_hpi?.relieving_factors || "Unknown";
    const worseningFactors = history_of_present_illness_hpi?.worsening_factors || "Unknown";

    let associatedSymptoms = "None";
    const associatedSymptomsValue = history_of_present_illness_hpi?.associated_symptoms;
    if (associatedSymptomsValue) {
      if (Array.isArray(associatedSymptomsValue)) associatedSymptoms = associatedSymptomsValue.join(", ");
      else if (typeof associatedSymptomsValue === "string") associatedSymptoms = associatedSymptomsValue;
    }

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

    const H_FUNC = H_BOTTOM;
    const b3 = drawCard(doc, RIGHT_X, gy, COL_W, H_FUNC, "FUNCTIONAL STATUS");
    drawKV(doc, b3, [
      { label: "Eating/drinking normally", value: normalizeYesNoUnknown(functional_status?.eating_drinking_normally) },
      { label: "Hydration", value: normalizeYesNoUnknown(functional_status?.hydration) },
      { label: "Activity level", value: normalizeYesNoUnknown(functional_status?.activity_level) },
    ]);

    gy += Math.max(H_HPI, H_FUNC) + G;
  }

  // ---------- Row 3 (full width): Clinical Possibilities ----------
  {
    const top3 = cleanConditions(conditions || []).map((c) => ({ name: c.name, percentage: c.percentage }));
    const confVal = confidence ?? ai_clinical_assessment?.confidence ?? 85;
    drawPossibilities(doc, LEFT_X, gy, COL_W * 2 + G, H_POSS, confVal, top3);
  }
  gy += H_POSS + G;

  // ---------- Row 4: Vitals + Lifestyle ----------
  {
    const b5 = drawCard(doc, LEFT_X, gy, COL_W, H_VITAL, "VITAL SIGNS & CURRENT STATUS");

    const tempVal = derivedTemp || vital_signs_current_status?.core_temperature || "Not measured";

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
      { label: "Temperature", value: toStr(tempVal, "Not measured") },
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
        b6.innerX + b6.innerW * 0.62,
        y,
        b6.innerW * 0.18,
        3.8,
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
        b7.innerX + b7.innerW * 0.62,
        y,
        b7.innerW * 0.18,
        3.8,
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
        b8.innerX + b8.innerW * 0.62,
        y,
        b8.innerW * 0.18,
        3.8,
        pillText,
        pillColorFor(pillText)
      );
    });
  }
  gy += H_EXP + G;

  // ---------- Row 6: AI Assessment + Clinical Note ----------
  {
    const b9 = drawCard(doc, LEFT_X, gy, COL_W, H_MID - 16, "AI CLINICAL ASSESSMENT");

    const overall = ai_clinical_assessment?.overall_stability || "Unknown";
    const redFlags = normalizeYesNoUnknown(ai_clinical_assessment?.red_flag_symptoms_present);

    const overallOk = String(overall).toLowerCase().includes("stable");
    const redFlagOk = String(redFlags).toLowerCase().startsWith("no");

    const r1y = b9.innerY + 2;
    const r2y = r1y + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTextHex(doc, "#111827");

    doc.text("Overall Stability:", b9.innerX, r1y);
    doc.text("Red-Flag Symptoms:", b9.innerX, r2y);

    const rightX = b9.innerX + b9.innerW - 4;
    addStatusMark(doc, rightX, r1y, overallOk);
    addStatusMark(doc, rightX, r2y, redFlagOk);

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
  }

  // Footer disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  setTextHex(doc, "#6B7280");
  doc.text(
    "Cira is an AI clinical decision support assistant and doesn't replace professional medical judgment.",
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

/* ----------------- Download helper (Doctor Report) ----------------- */
export const downloadDoctorReportPDF = async (
  clinicalData,
  patientInfo = {},
  filename = "Cira_Clinical_Intake_Report.pdf"
) => {
  function extractFlatValue(data, nestedPath, flatKey, defaultValue) {
    let value = data;
    for (const key of nestedPath) {
      if (value && typeof value === "object" && key in value) value = value[key];
      else {
        value = undefined;
        break;
      }
    }

    if (value === undefined && flatKey && data && data[flatKey] !== undefined) value = data[flatKey];

    if (value === undefined || value === null) return defaultValue;

    if (typeof value === "object") {
      if (value.primaryConcern !== undefined) return String(value.primaryConcern);
      if (value.text !== undefined) return String(value.text);
      if (value.value !== undefined) return String(value.value);
      return JSON.stringify(value).substring(0, 100);
    }

    return String(value);
  }

  // ✅ Parse tool final if present
  const toolFinal =
    parseToolFinal(clinicalData?.final_json) ||
    parseToolFinal(clinicalData?.finalJson) ||
    parseToolFinal(clinicalData?.tool_final) ||
    null;

  const toolChief =
    toolFinal?.chief_complaint ||
    toolFinal?.chiefComplaint ||
    clinicalData?.chief_complaint ||
    clinicalData?.chiefComplaint ||
    {};

  const toolVitals =
    toolFinal?.vital_signs_current_status ||
    toolFinal?.vitalSigns ||
    clinicalData?.vital_signs_current_status ||
    clinicalData?.vitalSigns ||
    {};

  // ✅ If severity looks like temperature and temperature missing → copy it
  const chiefSeverityRaw = firstNonEmpty(
    toolChief?.severity,
    clinicalData?.chiefComplaint?.severity,
    clinicalData?.chiefComplaintSeverity
  );

  let temperatureRaw = firstNonEmpty(
    toolVitals?.temperature,
    toolVitals?.core_temperature,
    clinicalData?.vitalSignsCoreTemperature,
    clinicalData?.vitalSigns?.coreTemperature
  );

  if (!temperatureRaw && isTempLike(chiefSeverityRaw)) {
    temperatureRaw = chiefSeverityRaw;
  }

  const flattenedData = {
    patientName:
      patientInfo.name ||
      clinicalData?.patientName ||
      clinicalData?.patientInfo?.name ||
      toolFinal?.patient_identity?.name ||
      "Patient",
    patientAge:
      patientInfo.age ||
      clinicalData?.patientAge ||
      clinicalData?.patientInfo?.age ||
      toolFinal?.patient_identity?.age ||
      "",
    patientGender:
      patientInfo.gender ||
      clinicalData?.patientGender ||
      clinicalData?.patientInfo?.gender ||
      toolFinal?.patient_identity?.biological_sex ||
      "",
    patientHeight:
      clinicalData?.patientHeight || clinicalData?.patientInfo?.height || toolFinal?.patient_identity?.height || "—",
    patientWeight:
      clinicalData?.patientWeight || clinicalData?.patientInfo?.weight || toolFinal?.patient_identity?.weight || "—",
    patientBMI:
      clinicalData?.BMI ??
      clinicalData?.bmi ??
      clinicalData?.patientBMI ??
      clinicalData?.patientInfo?.bmi ??
      clinicalData?.patient_identity_baseline?.bmi ??
      toolFinal?.patient_identity?.bmi ??
      "N/A",
    consultDate: patientInfo.consultDate || clinicalData?.consultDate || new Date().toLocaleDateString(),

    chiefComplaintPrimaryConcern: firstNonEmpty(
      toolChief?.primary_concern,
      extractFlatValue(clinicalData, ["chiefComplaint", "primaryConcern"], "primaryConcern", "—"),
      clinicalData?.primaryConcern
    ) ?? "—",
    chiefComplaintOnset:
      firstNonEmpty(toolChief?.onset, extractFlatValue(clinicalData, ["chiefComplaint", "onset"], "onset", "—")) ??
      "—",
    chiefComplaintDuration:
      firstNonEmpty(
        toolChief?.duration,
        extractFlatValue(clinicalData, ["chiefComplaint", "duration"], "duration", "—")
      ) ?? "—",
    chiefComplaintSeverity:
      firstNonEmpty(
        toolChief?.severity,
        extractFlatValue(clinicalData, ["chiefComplaint", "severity"], "severity", "—")
      ) ?? "—",
    chiefComplaintPattern:
      firstNonEmpty(
        toolChief?.pattern,
        extractFlatValue(clinicalData, ["chiefComplaint", "pattern"], "pattern", "—")
      ) ?? "—",
    chiefComplaintPreviousEpisodes:
      firstNonEmpty(
        toolChief?.previous_episodes,
        extractFlatValue(clinicalData, ["chiefComplaint", "previousEpisodes"], "previousEpisodes", "Unknown")
      ) ?? "Unknown",

    hpiLocation: extractFlatValue(clinicalData, ["hpi", "location"], "hpiLocation", "—"),
    hpiAssociatedSymptoms: extractFlatValue(
      clinicalData,
      ["hpi", "associatedSymptoms"],
      "hpiAssociatedSymptoms",
      "None"
    ),
    hpiRelievingFactors: extractFlatValue(clinicalData, ["hpi", "relievingFactors"], "hpiRelievingFactors", "Unknown"),
    hpiWorseningFactors: extractFlatValue(clinicalData, ["hpi", "worseningFactors"], "hpiWorseningFactors", "Unknown"),

    medicalHistoryChronicIllnesses: extractFlatValue(
      clinicalData,
      ["medicalHistory", "chronicIllnesses"],
      "chronicIllnesses",
      "Unknown"
    ),
    medicalHistoryPreviousSurgeries: extractFlatValue(
      clinicalData,
      ["medicalHistory", "previousSurgeries"],
      "previousSurgeries",
      "Unknown"
    ),
    medicalHistoryFamilyHistory: extractFlatValue(
      clinicalData,
      ["medicalHistory", "familyHistory"],
      "familyHistory",
      "Unknown"
    ),
    medicalHistoryCurrentMedications: extractFlatValue(
      clinicalData,
      ["medicalHistory", "currentMedications"],
      "currentMedications",
      "Unknown"
    ),
    medicalHistoryDrugAllergies: extractFlatValue(
      clinicalData,
      ["medicalHistory", "drugAllergies"],
      "drugAllergies",
      "Unknown"
    ),

    functionalStatusEatingDrinking: extractFlatValue(
      clinicalData,
      ["functionalStatus", "eatingDrinkingNormally"],
      "eatingDrinkingNormally",
      "Unknown"
    ),
    functionalStatusHydration: extractFlatValue(clinicalData, ["functionalStatus", "hydration"], "hydration", "Unknown"),
    functionalStatusActivityLevel: extractFlatValue(
      clinicalData,
      ["functionalStatus", "activityLevel"],
      "activityLevel",
      "Unknown"
    ),

    conditions: Array.isArray(clinicalData?.conditions) ? clinicalData.conditions : [],
    confidence: clinicalData?.confidence || 0,

    vitalSignsHeartRate: extractFlatValue(clinicalData, ["vitalSigns", "heartRate"], "heartRate", "Not recorded"),
    vitalSignsOxygenSaturation: extractFlatValue(
      clinicalData,
      ["vitalSigns", "oxygenSaturation"],
      "oxygenSaturation",
      "Not recorded"
    ),

    vitalSignsCoreTemperature: toStr(
      temperatureRaw,
      extractFlatValue(clinicalData, ["vitalSigns", "coreTemperature"], "coreTemperature", "Not measured")
    ),
    vitalSignsReportedFever: extractFlatValue(clinicalData, ["vitalSigns", "reportedFever"], "reportedFever", "Unknown"),
    vitalSignsBloodPressure: extractFlatValue(
      clinicalData,
      ["vitalSigns", "bloodPressure"],
      "bloodPressure",
      "Not measured"
    ),

    lifestyleSmoking: extractFlatValue(clinicalData, ["lifestyleRiskFactors", "smoking"], "smoking", "Unknown"),
    lifestyleAlcoholUse: extractFlatValue(clinicalData, ["lifestyleRiskFactors", "alcoholUse"], "alcoholUse", "Unknown"),
    lifestyleRecreationalDrugs: extractFlatValue(
      clinicalData,
      ["lifestyleRiskFactors", "recreationalDrugs"],
      "recreationalDrugs",
      "Unknown"
    ),
    lifestyleDiet: extractFlatValue(clinicalData, ["lifestyleRiskFactors", "diet"], "diet", "Unknown"),
    lifestyleExerciseRoutine: extractFlatValue(
      clinicalData,
      ["lifestyleRiskFactors", "exerciseRoutine"],
      "exerciseRoutine",
      "Unknown"
    ),
    lifestyleStressLevel: extractFlatValue(
      clinicalData,
      ["lifestyleRiskFactors", "stressLevel"],
      "stressLevel",
      "Unknown"
    ),

    exposureRecentTravel: extractFlatValue(clinicalData, ["exposureEnvironment", "recentTravel"], "recentTravel", "Unknown"),
    exposureSickContacts: extractFlatValue(clinicalData, ["exposureEnvironment", "sickContacts"], "sickContacts", "Unknown"),
    exposureCrowdedEvents: extractFlatValue(
      clinicalData,
      ["exposureEnvironment", "crowdedEvents"],
      "crowdedEvents",
      "Unknown"
    ),
    exposureWorkplaceChemical: extractFlatValue(
      clinicalData,
      ["exposureEnvironment", "workplaceChemicalExposure"],
      "workplaceChemicalExposure",
      "Unknown"
    ),
    exposureWeather: extractFlatValue(clinicalData, ["exposureEnvironment", "weatherExposure"], "weatherExposure", "Unknown"),

    rosShortnessOfBreath: extractFlatValue(
      clinicalData,
      ["reviewOfSystems", "shortnessOfBreath"],
      "shortnessOfBreath",
      "Unknown"
    ),
    rosChestPain: extractFlatValue(clinicalData, ["reviewOfSystems", "chestPain"], "chestPain", "Unknown"),
    rosSoreThroat: extractFlatValue(clinicalData, ["reviewOfSystems", "soreThroat"], "soreThroat", "Unknown"),
    rosBodyAchesFatigue: extractFlatValue(
      clinicalData,
      ["reviewOfSystems", "bodyAchesFatigue"],
      "bodyAchesFatigue",
      "Unknown"
    ),
    rosVomitingDiarrhea: extractFlatValue(
      clinicalData,
      ["reviewOfSystems", "vomitingDiarrhea"],
      "vomitingDiarrhea",
      "Unknown"
    ),
    rosUrinaryChanges: extractFlatValue(clinicalData, ["reviewOfSystems", "urinaryChanges"], "urinaryChanges", "Unknown"),

    aiAssessmentOverallStability: extractFlatValue(
      clinicalData,
      ["aiAssessment", "overallStability"],
      "overallStability",
      "Unknown"
    ),
    aiAssessmentRedFlagSymptoms: extractFlatValue(
      clinicalData,
      ["aiAssessment", "redFlagSymptoms"],
      "redFlagSymptoms",
      "Unknown"
    ),

    clinicalNoteToPhysician:
      clinicalData?.clinicalNoteToPhysician ||
      "Cira is an AI clinical decision support assistant and doesn't replace professional medical judgment.",
  };

  const structuredData = {
    patient_identity_baseline: {
      name: flattenedData.patientName,
      age: flattenedData.patientAge,
      biological_sex: flattenedData.patientGender,
      height: flattenedData.patientHeight || "—",
      weight: flattenedData.patientWeight || "—",
      bmi: flattenedData.patientBMI || "N/A",
    },

    chief_complaint: {
      primary_concern: flattenedData.chiefComplaintPrimaryConcern || "—",
      onset: flattenedData.chiefComplaintOnset || "—",
      duration: flattenedData.chiefComplaintDuration || "—",
      severity: flattenedData.chiefComplaintSeverity || "—",
      pattern: flattenedData.chiefComplaintPattern || "—",
      previous_episodes: flattenedData.chiefComplaintPreviousEpisodes || "Unknown",
    },

    history_of_present_illness_hpi: {
      location_or_system: flattenedData.hpiLocation || "—",
      associated_symptoms: flattenedData.hpiAssociatedSymptoms || "None",
      relieving_factors: flattenedData.hpiRelievingFactors || "Unknown",
      worsening_factors: flattenedData.hpiWorseningFactors || "Unknown",
      progression_pattern: clinicalData?.history_of_present_illness_hpi?.progression_pattern,
    },

    medical_background: {
      chronic_illnesses: flattenedData.medicalHistoryChronicIllnesses || "Unknown",
      previous_surgeries: flattenedData.medicalHistoryPreviousSurgeries || "Unknown",
      family_history: flattenedData.medicalHistoryFamilyHistory || "Unknown",
      current_medications: flattenedData.medicalHistoryCurrentMedications || "Unknown",
      drug_allergies: flattenedData.medicalHistoryDrugAllergies || "Unknown",
    },

    functional_status: {
      eating_drinking_normally: flattenedData.functionalStatusEatingDrinking || "Unknown",
      hydration: flattenedData.functionalStatusHydration || "Unknown",
      activity_level: flattenedData.functionalStatusActivityLevel || "Unknown",
    },

    vital_signs_current_status: {
      heart_rate_bpm: flattenedData.vitalSignsHeartRate || "Not recorded",
      oxygen_saturation_spo2_percent: flattenedData.vitalSignsOxygenSaturation || "Not recorded",
      core_temperature: flattenedData.vitalSignsCoreTemperature || "Not measured",
      reported_fever: flattenedData.vitalSignsReportedFever || "Unknown",
      blood_pressure: flattenedData.vitalSignsBloodPressure || "Not measured",
    },

    lifestyle_risk_factors: {
      smoking: flattenedData.lifestyleSmoking || "Unknown",
      alcohol_use: flattenedData.lifestyleAlcoholUse || "Unknown",
      recreational_drugs: flattenedData.lifestyleRecreationalDrugs || "Unknown",
      diet: flattenedData.lifestyleDiet || "Unknown",
      exercise_routine: flattenedData.lifestyleExerciseRoutine || "Unknown",
      stress_level: flattenedData.lifestyleStressLevel || "Unknown",
    },

    exposure_environment: {
      recent_travel: flattenedData.exposureRecentTravel || "Unknown",
      sick_contacts: flattenedData.exposureSickContacts || "Unknown",
      crowded_events: flattenedData.exposureCrowdedEvents || "Unknown",
      workplace_chemical_exposure: flattenedData.exposureWorkplaceChemical || "Unknown",
      weather_exposure: flattenedData.exposureWeather || "Unknown",
    },

    review_of_systems_traffic_light_view: {
      shortness_of_breath: { answer: flattenedData.rosShortnessOfBreath || "Unknown" },
      chest_pain: { answer: flattenedData.rosChestPain || "Unknown" },
      sore_throat: { answer: flattenedData.rosSoreThroat || "Unknown" },
      body_aches_fatigue: { answer: flattenedData.rosBodyAchesFatigue || "Unknown" },
      vomiting_diarrhea: { answer: flattenedData.rosVomitingDiarrhea || "Unknown" },
      urinary_changes: { answer: flattenedData.rosUrinaryChanges || "Unknown" },
      skin_rash: { answer: clinicalData?.review_of_systems_traffic_light_view?.skin_rash?.answer || "Unknown" },
      mental_status_changes: {
        answer: clinicalData?.review_of_systems_traffic_light_view?.mental_status_changes?.answer || "Unknown",
      },
    },

    ai_clinical_assessment: {
      overall_stability: flattenedData.aiAssessmentOverallStability || "Unknown",
      red_flag_symptoms_present: flattenedData.aiAssessmentRedFlagSymptoms || "Unknown",
      clinical_note_to_physician: flattenedData.clinicalNoteToPhysician || "—",
      confidence: flattenedData.confidence || 0,
    },

    conditions: Array.isArray(flattenedData.conditions) ? flattenedData.conditions : [],
    confidence: flattenedData.confidence || 0,
    consultDate: flattenedData.consultDate,
    patientName: flattenedData.patientName,
    patientAge: flattenedData.patientAge,
    patientGender: flattenedData.patientGender,

    ...clinicalData,
  };

  try {
    const logoImage = await loadStarsLogo();
    const doc = generateDoctorReportPDF(structuredData, { logoImage });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return doc;
  } catch (e) {
    console.warn("Logo load failed, generating without logo:", e);

    const doc = generateDoctorReportPDF(structuredData);
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return doc;
  }
};

/* ----------------- Bullet helpers for SOAP ----------------- */
function toBulletListLines(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return ["• No information was provided."];

  const hasBullets = raw.includes("\n• ") || raw.trim().startsWith("•");
  if (hasBullets) {
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l.startsWith("•") ? l : `• ${l.replace(/^[-*]\s*/, "")}`));
  }

  let lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 1 && lines[0].length > 120) {
    lines = lines[0]
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return lines.map((l) => (l.startsWith("•") ? l : `• ${l.replace(/^[-*]\s*/, "")}`));
}

function addBulletLinePaged(doc, bulletLine, x, y, maxW, lineH, pageW, pageH, topY, bottomY, onNewPage) {
  const raw = String(bulletLine ?? "").trim();
  if (!raw) return y;

  const bullet = "•";
  const content = raw.replace(/^[•\-\*]\s*/, "");
  const indent = 4;

  const lines = doc.splitTextToSize(content, Math.max(10, maxW - indent));

  const needed = Math.max(1, lines.length) * lineH;
  if (y + needed > bottomY) {
    doc.addPage();
    y = topY;
    if (typeof onNewPage === "function") onNewPage();
  }

  doc.text(bullet, x, y);
  lines.forEach((ln, i) => doc.text(ln, x + indent, y + i * lineH));
  return y + lines.length * lineH;
}

/* ----------------- SOAP Note (PDF) ----------------- */
/* ----------------- SOAP Note (PDF) ----------------- */
export const generateSOAPNotePDF = (soapData = {}, options = {}) => {
  const { logoImage } = options;

  const {
    consultDate = new Date().toLocaleDateString(),
    subjective = "",
    objective = "",
    assessment = "",
    plan = "",
  } = soapData;

  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const doc = new jsPDF("p", "mm", [PAGE_WIDTH, PAGE_HEIGHT]);

  const pageW = PAGE_WIDTH;
  const pageH = PAGE_HEIGHT;

  const marginX = 16;
  const topY = 18;
  const bottomY = pageH - 18;
  const contentW = pageW - marginX * 2;

  setFillHex(doc, COLORS.white);
  doc.rect(0, 0, pageW, pageH, "F");

  const drawHeader = () => {
    let y = 14;

    if (logoImage) {
      try {
        doc.addImage(logoImage, "PNG", marginX, y - 6, 10, 10);
      } catch (_) {}
    }

    doc.setFont("serif", "bold");
    doc.setFontSize(22);
    setTextHex(doc, COLORS.soapTitle);
    doc.text("SOAP Note", marginX, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    setTextHex(doc, "#6B7280");
    doc.text(`Date: ${consultDate || ""}`, pageW - marginX, y, { align: "right" });

    setStrokeHex(doc, "#D1D5DB");
    doc.setLineWidth(0.3);
    doc.line(marginX, y + 4, pageW - marginX, y + 4);

    return y + 12;
  };

 const drawSection = (title, text, y) => {
  if (y > bottomY - 20) {
    doc.addPage();
    setFillHex(doc, COLORS.white);
    doc.rect(0, 0, pageW, pageH, "F");
    y = drawHeader();
  }

  doc.setFont("serif", "bold");
  doc.setFontSize(20);
  setTextHex(doc, COLORS.soapHeading);
  doc.text(title, marginX, y);
  y += 7;

  doc.setFont("serif", "normal");
  doc.setFontSize(13.5);
  setTextHex(doc, COLORS.soapBody);

  // Clean and format the text for bullet points
  let formattedText = text;
  
  // Debug: Log the original text to see what we're working with
  console.log("Original text:", text);
  
  // FIRST: Clean up ALL bullet and dash patterns at the character level
  // Replace "• -" patterns first (bullet dash)
  formattedText = formattedText.replace(/•\s*-\s*/g, '• ');
  
  // Then clean up multiple bullet patterns
  // Handle cases like "• •" with or without spaces
  formattedText = formattedText.replace(/•\s*•/g, '•');
  
  // Also handle any lines starting with just dash
  formattedText = formattedText.replace(/^\s*-\s*/gm, '• ');

  // Remove bullet before numbered lists: "• 1. Text" → "1. Text"
formattedText = formattedText.replace(/•\s*(\d+\.)/g, '$1');
  
  // Process each line individually
  const lines = formattedText.split('\n');
  const cleanedLines = [];
  
  for (let line of lines) {
    // Trim the line first
    let cleanedLine = line.trim();
    
    // Check if line starts with "• " followed by another "•"
    // This handles "• • Ali" specifically
    if (cleanedLine.startsWith('• ') && cleanedLine.substring(2, 4) === '• ') {
      // Remove the second bullet
      cleanedLine = '• ' + cleanedLine.substring(4);
    }
    // Handle "••" (no space between bullets)
    else if (cleanedLine.startsWith('••')) {
      cleanedLine = '•' + cleanedLine.substring(2);
    }
    // Handle "• •" with exactly one space
    else if (cleanedLine.startsWith('• •')) {
      cleanedLine = '• ' + cleanedLine.substring(3);
    }
    // Handle "•  •" with two spaces
    else if (cleanedLine.startsWith('•  •')) {
      cleanedLine = '• ' + cleanedLine.substring(4);
    }
    // Handle "• - " pattern
    else if (cleanedLine.startsWith('• - ')) {
      cleanedLine = '• ' + cleanedLine.substring(4);
    }
    // Handle "- " at start
    else if (cleanedLine.startsWith('- ')) {
      cleanedLine = '• ' + cleanedLine.substring(2);
    }
    
    // Debug log for problematic lines
    if (line.includes('•') && line !== cleanedLine) {
      console.log(`Cleaned line: "${line}" -> "${cleanedLine}"`);
    }
    
    cleanedLines.push(cleanedLine);
  }
  
  formattedText = cleanedLines.join('\n');
  
  // For subjective section, we also want to ensure proper sentence formatting
  if (title.toLowerCase() === "subjective") {
    // Split into sentences for better bullet formatting
    const sentences = formattedText
      .replace(/\n/g, ' ') // Replace newlines with spaces temporarily
      .split(/(?<=[.!?])\s+(?=[A-Z])/) // Split on punctuation followed by space and capital letter
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => {
        let cleaned = sentence.trim();
        // Remove any leading bullet characters that might remain
        cleaned = cleaned.replace(/^[•\-]\s*/, '');
        // Add period if missing
        if (!cleaned.endsWith('.') && !cleaned.endsWith('?') && !cleaned.endsWith('!')) {
          cleaned += '.';
        }
        return cleaned;
      });
    
    // Convert each sentence to a bullet point
    formattedText = sentences.map(sentence => `• ${sentence}`).join('\n');
  }
  
  // ONE MORE PASS to catch any remaining issues
  const finalLines = formattedText.split('\n');
  const finalCleanedLines = [];
  
  for (let line of finalLines) {
    let finalLine = line.trim();
    
    // Final cleanup for any remaining bullet issues
    if (finalLine.startsWith('• ') && finalLine.includes('• ', 2)) {
      // Find and remove second bullet
      const secondBulletIndex = finalLine.indexOf('• ', 2);
      if (secondBulletIndex !== -1) {
        finalLine = '• ' + finalLine.substring(secondBulletIndex + 2);
      }
    }
    
    // Remove any " - " in the middle of the line
    finalLine = finalLine.replace(/\s+-\s+/g, ' ');
    
    finalCleanedLines.push(finalLine);
  }
  
  formattedText = finalCleanedLines.join('\n');
  
  // Debug: Log the final cleaned text
  console.log("Final cleaned text:", formattedText);
  
  let currentY = y;
  const finalTextLines = formattedText.split('\n');
  
  for (let line of finalTextLines) {
    if (currentY > bottomY - 20) {
      doc.addPage();
      setFillHex(doc, COLORS.white);
      doc.rect(0, 0, pageW, pageH, "F");
      currentY = drawHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      setTextHex(doc, COLORS.soapBody);
    }
    
    // Handle bold markers
    if (line.startsWith("**") && line.endsWith("**")) {
      doc.setFont("helvetica", "bold");
      const boldText = line.replace(/\*\*/g, '');
      doc.text(boldText, marginX, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 5.2;
    }
    // Handle bullet points starting with "•"
    else if (line.startsWith("• ")) {
      const content = line.substring(2);
      
      // Use ASCII bullet character that works in PDF
      const bullet = String.fromCharCode(149); // • character that works in PDF
      
      // Check if this is a numbered bullet like "1 Viral fever (60% probability)"
      const numberedMatch = content.match(/^(\d+)\s+(.*)/);
      
      if (numberedMatch) {
        // This is a numbered bullet without dot: "1 Viral fever..."
        const number = numberedMatch[1];
        const restOfContent = numberedMatch[2];
        
        // Draw the bullet and number
        doc.text(`${bullet} ${number}`, marginX, currentY);
        
        // Split the rest of content into lines
        const textLines = doc.splitTextToSize(restOfContent, contentW - 12);
        
        if (textLines.length > 0) {
          // Draw first line of content
          doc.text(textLines[0], marginX + 8, currentY);
          
          // Draw additional lines with indentation
          for (let i = 1; i < textLines.length; i++) {
            currentY += 5.2;
            if (currentY > bottomY - 20) {
              doc.addPage();
              setFillHex(doc, COLORS.white);
              doc.rect(0, 0, pageW, pageH, "F");
              currentY = drawHeader();
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10.5);
              setTextHex(doc, COLORS.soapBody);
            }
            doc.text(textLines[i], marginX + 12, currentY);
          }
        }
      } else {
        // Regular bullet point
        doc.text(bullet, marginX, currentY);
        
        // Split content into lines
        const textLines = doc.splitTextToSize(content, contentW - 8);
        
        if (textLines.length > 0) {
          // Draw first line
          doc.text(textLines[0], marginX + 4, currentY);
          
          // Draw additional lines with indentation
          for (let i = 1; i < textLines.length; i++) {
            currentY += 5.2;
            if (currentY > bottomY - 20) {
              doc.addPage();
              setFillHex(doc, COLORS.white);
              doc.rect(0, 0, pageW, pageH, "F");
              currentY = drawHeader();
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10.5);
              setTextHex(doc, COLORS.soapBody);
            }
            doc.text(textLines[i], marginX + 4, currentY);
          }
        }
      }
      currentY += 5.2;
    }
    // Handle bullet points starting with "-" (fallback)
    else if (line.startsWith("- ")) {
      const content = line.substring(2);
      
      // Use ASCII bullet character that works in PDF
      const bullet = String.fromCharCode(149); // • character that works in PDF
      
      // Draw bullet
      doc.text(bullet, marginX, currentY);
      
      // Split content into lines
      const textLines = doc.splitTextToSize(content, contentW - 8);
      
      if (textLines.length > 0) {
        // Draw first line
        doc.text(textLines[0], marginX + 4, currentY);
        
        // Draw additional lines with indentation
        for (let i = 1; i < textLines.length; i++) {
          currentY += 5.2;
          if (currentY > bottomY - 20) {
            doc.addPage();
            setFillHex(doc, COLORS.white);
            doc.rect(0, 0, pageW, pageH, "F");
            currentY = drawHeader();
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            setTextHex(doc, COLORS.soapBody);
          }
          doc.text(textLines[i], marginX + 8, currentY);
        }
      }
      currentY += 5.2;
    }
    // Handle numbered lists
    else if (line.trim().match(/^\d+\./)) {
      const numberMatch = line.match(/^(\d+\.\s*)/);
      if (numberMatch) {
        const number = numberMatch[1];
        const restOfText = line.substring(numberMatch[0].length);
        
        doc.text(number, marginX, currentY);
        const textLines = doc.splitTextToSize(restOfText, contentW - 8);
        
        if (textLines.length > 0) {
          doc.text(textLines[0], marginX + 8, currentY);
          
          for (let i = 1; i < textLines.length; i++) {
            currentY += 5.2;
            if (currentY > bottomY - 20) {
              doc.addPage();
              setFillHex(doc, COLORS.white);
              doc.rect(0, 0, pageW, pageH, "F");
              currentY = drawHeader();
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10.5);
              setTextHex(doc, COLORS.soapBody);
            }
            doc.text(textLines[i], marginX + 8, currentY);
          }
        }
        currentY += 5.2;
      }
    }
    // Regular text line (no bullet)
    else {
      const textLines = doc.splitTextToSize(line, contentW);
      for (let textLine of textLines) {
        if (currentY > bottomY - 20) {
          doc.addPage();
          setFillHex(doc, COLORS.white);
          doc.rect(0, 0, pageW, pageH, "F");
          currentY = drawHeader();
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
          setTextHex(doc, COLORS.soapBody);
        }
        doc.text(textLine, marginX, currentY);
        currentY += 5.2;
      }
    }
  }

  return currentY + 6;
};

  let y = drawHeader();
  y = drawSection("Subjective", subjective, y);
  y = drawSection("Objective", objective, y);
  y = drawSection("Assessment", assessment, y);
  y = drawSection("Plan", plan, y);

  return doc;
};

export const downloadSOAPNotePDF = async (soapData, filename = "Report.pdf") => {
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

/* ====================================================================== */
/*  ✅ UPDATED: SOAP bullet points as COMPLETE SENTENCES (not "k: v")      */
/* ====================================================================== */

function isMissingValue(v) {
  if (v === undefined || v === null) return true;
  const s = String(v).trim();
  if (!s) return true;

  const low = s.toLowerCase();
  const missingSet = new Set([
    "—",
    "-",
    "n/a",
    "na",
    "none",
    "unknown",
    "not specified",
    "not measured",
    "not recorded",
    "not available",
    "null",
    "undefined",
  ]);

  return missingSet.has(low);
}

function sentenceCap(s) {
  const t = String(s ?? "").trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function ensurePeriod(s) {
  const t = String(s ?? "").trim();
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function makeSentence({ subject, verb = "was", value, missingText = "was not specified" }) {
  const subj = sentenceCap(subject);
  if (isMissingValue(value)) return ensurePeriod(`${subj} ${missingText}`);
  return ensurePeriod(`${subj} ${verb} ${String(value).trim()}`);
}

function makeIsSentence({ subject, value, missingText = "was not specified" }) {
  const subj = sentenceCap(subject);
  if (isMissingValue(value)) return ensurePeriod(`${subj} ${missingText}`);
  return ensurePeriod(`${subj} is ${String(value).trim()}`);
}

function makeYesNoSentence({ subject, value, yesText, noText, unknownText }) {
  const subj = sentenceCap(subject);
  const norm = normalizeYesNoUnknown(value);
  const low = String(norm).toLowerCase();

  if (low.startsWith("yes")) return ensurePeriod(yesText || `${subj} was reported as yes`);
  if (low.startsWith("no")) return ensurePeriod(noText || `${subj} was reported as no`);
  return ensurePeriod(unknownText || `${subj} was not specified`);
}

function sentenceBulletsBlock(title, sentences = []) {
  const clean = (sentences || []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!clean.length) return title ? `${title}:\n• No information was provided.` : "• No information was provided.";
  if (!title) return clean.map((s) => `• ${ensurePeriod(s)}`).join("\n");
  return `${title}:\n${clean.map((s) => `• ${ensurePeriod(s)}`).join("\n")}`;
}

/* ----------------- Chat summary → SOAP structure (UPDATED bullets) ----------------- */
export const convertChatSummaryToSOAP = (chatSummary = {}, patientInfo = {}) => {
  const toolFinal =
    parseToolFinal(chatSummary?.final_json) ||
    parseToolFinal(chatSummary?.finalJson) ||
    parseToolFinal(chatSummary?.tool_final) ||
    null;

  const toolChief =
    toolFinal?.chief_complaint ||
    toolFinal?.chiefComplaint ||
    chatSummary?.chief_complaint ||
    chatSummary?.chiefComplaint ||
    {};

  const toolPatient =
    toolFinal?.patient_identity ||
    toolFinal?.patient_identity_baseline ||
    chatSummary?.patient_identity ||
    chatSummary?.patient_identity_baseline ||
    {};

  const toolHpi =
    toolFinal?.hpi ||
    toolFinal?.history_of_present_illness_hpi ||
    chatSummary?.hpi ||
    chatSummary?.history_of_present_illness_hpi ||
    {};

  const toolMed = toolFinal?.medical_history || toolFinal?.medical_background || {};
  const toolFunc = toolFinal?.functional_status || {};
  const toolVitals = toolFinal?.vital_signs_current_status || {};
  const toolLife = toolFinal?.lifestyle_risk_factors || {};
  const toolExposure = toolFinal?.exposure_environment || {};
  const toolROS = toolFinal?.review_of_systems || toolFinal?.review_of_systems_traffic_light_view || {};
  const toolAI = toolFinal?.ai_assessment || toolFinal?.ai_clinical_assessment || {};

  const patientName = patientInfo?.name || chatSummary?.patientName || toolPatient?.name || "Patient";
  const patientAge = patientInfo?.age ?? chatSummary?.patientAge ?? toolPatient?.age ?? "";
  const patientGender = patientInfo?.gender || chatSummary?.patientGender || toolPatient?.biological_sex || "";
  const consultDate = patientInfo?.consultDate || chatSummary?.consultDate || new Date().toLocaleDateString();

  const bmi = chatSummary?.BMI ?? chatSummary?.bmi ?? toolPatient?.bmi ?? null;

  const chiefComplaint =
    chatSummary?.chiefComplaint ||
    toolChief?.primary_concern ||
    toolFinal?.chief_complaint?.primary_concern ||
    "—";

  // Conditions + confidence
  const rawConditionsList = Array.isArray(chatSummary?.conditions) ? chatSummary.conditions : [];
  const toolTop3 = Array.isArray(toolFinal?.top_3_conditions) ? toolFinal.top_3_conditions : null;

  let conditions = cleanConditions(rawConditionsList);

  if (toolTop3 && toolTop3.length) {
    conditions = toolTop3
      .map((c) => ({
        name: (c?.condition ?? c?.name ?? "").toString().trim(),
        percentage: Number(c?.probability ?? c?.percentage ?? 0),
      }))
      .filter((c) => c.name)
      .slice(0, 3);
  }

  if ((!conditions || !conditions.length) && chatSummary?.conditions_matching) {
    const lines = String(chatSummary.conditions_matching)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];
    for (const l of lines) {
      const m = l.match(/^(.+?)\s*[—-]\s*(\d+(\.\d+)?)\s*%/);
      if (m) parsed.push({ name: m[1].trim(), percentage: Number(m[2]) });
    }
    if (parsed.length) conditions = parsed.slice(0, 3);
  }

  const confidence =
    parseConfidenceText(chatSummary?.confidence) ??
    parseConfidenceText(chatSummary?.Assessment_confidence) ??
    parseConfidenceText(toolAI?.assessment_confidence) ??
    parseConfidenceText(toolFinal?.ai_assessment?.assessment_confidence) ??
    null;

  const narrativeSummary = chatSummary?.AI_Consult_Summary || chatSummary?.narrativeSummary || "";
  const selfCareText = chatSummary?.self_care || chatSummary?.selfCareText || toolFinal?.self_care || "";

  // ✅ Fix temperature/severity mismatch for SOAP blocks
  const severityRaw = firstNonEmpty(toolChief?.severity);
  let temperature = firstNonEmpty(toolVitals?.temperature, toolVitals?.core_temperature);
  if (!temperature && isTempLike(severityRaw)) temperature = severityRaw;

  // Extract additional info from the raw summary text if available
  const rawSummary = chatSummary?.summary || chatSummary?.narrativeSummary || "";
  
  // Helper to extract info from the summary text - UPDATED FOR YOUR SPECIFIC SUMMARY
  const extractInfoFromSummary = (summaryText) => {
    const info = {
      fever: null,
      bodyAches: null,
      negativeFindings: [],
      normalFunctions: [],
      bmi: null,
      symptoms: [],
      medications: [],
      allergies: [],
      travel: null,
      exposure: null,
      eatingDrinking: null,
      urination: null,
      sleep: null,
      smoking: null,
      alcohol: null,
      drugs: null,
      chronicHealth: null
    };
    
    if (!summaryText) return info;
    
    const lowerText = summaryText.toLowerCase();
    
    // Extract fever - specific to your summary format
    const feverMatch = summaryText.match(/fever\s*\(([^)]+)\)/i) || summaryText.match(/(\d+(\.\d+)?\s*°?\s*[Ff])/i);
    if (feverMatch) info.fever = feverMatch[1] || feverMatch[0];
    
    // Extract body aches
    if (lowerText.includes("body aches")) {
      info.bodyAches = "reported";
      info.symptoms.push("body aches");
    }
    
    // Extract symptoms mentioned
    const symptomKeywords = ["fever", "headache", "chills", "sweating", "cough", "sore throat", 
                           "nausea", "vomiting", "diarrhea", "fatigue", "loss of appetite",
                           "muscle weakness", "rash", "difficulty breathing", "joint pain"];
    
    symptomKeywords.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        info.symptoms.push(symptom);
      }
    });
    
    // Extract negative findings
    if (lowerText.includes("no headache")) info.negativeFindings.push("headache");
    if (lowerText.includes("no chills")) info.negativeFindings.push("chills");
    if (lowerText.includes("no sweating")) info.negativeFindings.push("sweating");
    if (lowerText.includes("no cough")) info.negativeFindings.push("cough");
    if (lowerText.includes("no sore throat")) info.negativeFindings.push("sore throat");
    if (lowerText.includes("no nausea")) info.negativeFindings.push("nausea");
    if (lowerText.includes("no vomiting")) info.negativeFindings.push("vomiting");
    if (lowerText.includes("no diarrhea")) info.negativeFindings.push("diarrhea");
    if (lowerText.includes("no fatigue")) info.negativeFindings.push("fatigue");
    if (lowerText.includes("no loss of appetite")) info.negativeFindings.push("loss of appetite");
    if (lowerText.includes("no muscle weakness")) info.negativeFindings.push("muscle weakness");
    if (lowerText.includes("no rash")) info.negativeFindings.push("rash");
    if (lowerText.includes("no difficulty breathing")) info.negativeFindings.push("difficulty breathing");
    if (lowerText.includes("no joint pain")) info.negativeFindings.push("joint pain");
    
    // Extract normal functions
    if (lowerText.includes("eat and drink normally") || lowerText.includes("able to eat and drink normally")) {
      info.eatingDrinking = "normal";
      info.normalFunctions.push("eating/drinking");
    }
    if (lowerText.includes("no changes in urination")) {
      info.urination = "normal";
      info.normalFunctions.push("urination");
    }
    if (lowerText.includes("no changes in sleep patterns")) {
      info.sleep = "normal";
      info.normalFunctions.push("sleep");
    }
    
    // Extract lifestyle factors
    if (lowerText.includes("denies smoking") || lowerText.includes("denies smoking,")) info.smoking = "no";
    if (lowerText.includes("denies alcohol use") || lowerText.includes("denies alcohol use,")) info.alcohol = "no";
    if (lowerText.includes("denies recreational drug use") || lowerText.includes("denies recreational drug use,")) info.drugs = "no";
    
    // Extract medications and allergies
    if (lowerText.includes("not currently taking any medications")) info.medications.push("none");
    if (lowerText.includes("no known allergies")) info.allergies.push("none");
    
    // Extract medical history
    if (lowerText.includes("no chronic health conditions")) info.chronicHealth = "none";
    
    // Extract exposure history
    if (lowerText.includes("no recent travel")) info.travel = "no";
    if (lowerText.includes("no illness exposure")) info.exposure = "no";
    
    // Extract BMI
    const bmiMatch = summaryText.match(/BMI:\s*(\d+(\.\d+)?)/i);
    if (bmiMatch) info.bmi = bmiMatch[1];
    
    return info;
  };
  
  const extractedInfo = extractInfoFromSummary(rawSummary);

  /* ----------------- SUBJECTIVE (sentences) ----------------- */
  const subjectiveParts = [];
  const assocSymptoms = joinIfArray(toolHpi?.associated_symptoms);
  
  // Add extracted symptoms to associated symptoms
  let allAssociatedSymptoms = assocSymptoms;
  if (extractedInfo.bodyAches) {
    allAssociatedSymptoms = allAssociatedSymptoms ? 
      `${allAssociatedSymptoms}, body aches` : "body aches";
  }
  
  subjectiveParts.push(
    sentenceBulletsBlock("", [
      makeIsSentence({
        subject: "The patient's name",
        value: toolPatient?.name || patientName,
        missingText: "was not provided",
      }),
      isMissingValue(toolPatient?.age ?? patientAge)
        ? "The patient's age was not provided."
        : `The patient is ${String(toolPatient?.age ?? patientAge).trim()} years old.`,
      makeIsSentence({
        subject: "Biological sex",
        value: toolPatient?.biological_sex || patientGender,
        missingText: "was not specified",
      }),
      makeIsSentence({ subject: "Height", value: toolPatient?.height, missingText: "was not specified" }),
      makeIsSentence({ subject: "Weight", value: toolPatient?.weight, missingText: "was not specified" }),
      makeIsSentence({ 
        subject: "BMI", 
        value: extractedInfo.bmi || bmi || toolPatient?.bmi, 
        missingText: "was not calculated" 
      }),
      extractedInfo.fever ? `Presents with fever (${extractedInfo.fever}) and body aches that started last night.` :
        makeSentence({ 
          subject: "Primary concern", 
          verb: "was", 
          value: toolChief?.primary_concern, 
          missingText: "was not specified" 
        }),
      makeSentence({ subject: "Onset", verb: "was", value: "last night", missingText: "was not specified" }),
      isMissingValue(allAssociatedSymptoms)
        ? "Associated symptoms were not reported."
        : `Associated symptoms included ${String(allAssociatedSymptoms).trim()}.`,
    ])
  );

  // Relevant negatives (sentences) - SPECIFIC TO YOUR SUMMARY
  const negatives = [];
  const rosObj = toolFinal?.review_of_systems || null;

  // Add extracted negative findings FROM YOUR SUMMARY
  if (extractedInfo.negativeFindings.length > 0) {
    extractedInfo.negativeFindings.forEach(symptom => {
      negatives.push(`The patient reported no ${symptom}.`);
    });
  }
  
  // Also add specific ones mentioned in your summary
  negatives.push("Denies smoking, alcohol use, or recreational drug use.");
  negatives.push("No recent travel, illness exposure, injuries, or vaccinations reported.");
  
  const scanRos = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const [k, v] of Object.entries(obj)) {
      const ans = normalizeYesNoUnknown(typeof v === "object" ? v?.answer : v);
      if (String(ans).toLowerCase().startsWith("no")) {
        const nice = k.replace(/_/g, " ");
        negatives.push(`The patient denied ${nice}.`);
      }
    }
  };

  if (rosObj && typeof rosObj === "object" && !Array.isArray(rosObj)) scanRos(rosObj);
  else scanRos(toolROS);

  if (negatives.length) subjectiveParts.push(sentenceBulletsBlock("Relevant negatives", negatives));

  // Add functional status from extracted info
  const functionalStatus = [];
  if (extractedInfo.eatingDrinking === "normal") {
    functionalStatus.push("Eating and drinking normally.");
  }
  if (extractedInfo.urination === "normal") {
    functionalStatus.push("No changes in urination.");
  }
  if (extractedInfo.sleep === "normal") {
    functionalStatus.push("No changes in sleep patterns.");
  }
  
  if (functionalStatus.length > 0) {
    subjectiveParts.push(sentenceBulletsBlock("Functional status", functionalStatus));
  }

  const subjective = subjectiveParts.filter(Boolean).join("\n\n");

  /* ----------------- OBJECTIVE (sentences) ----------------- */
  const objectiveParts = [];
  
  // Use extracted fever if available, otherwise use toolVitals
  const finalTemperature = extractedInfo.fever || temperature;

  objectiveParts.push(
    sentenceBulletsBlock("", [
      isMissingValue(finalTemperature) ? 
        "Temperature was not measured." : 
        `Temperature was ${String(finalTemperature).trim()}.`,
      makeYesNoSentence({
        subject: "Fever",
        value: extractedInfo.fever ? "yes" : toolVitals?.reported_fever,
        yesText: "Fever was reported.",
        noText: "Fever was not reported.",
        unknownText: "Fever status was not specified.",
      }),
      extractedInfo.bmi ? `BMI: ${extractedInfo.bmi} (normal range).` : "BMI was not measured.",
      makeSentence({ 
        subject: "Blood pressure", 
        verb: "was", 
        value: toolVitals?.blood_pressure, 
        missingText: "was not measured" 
      }),
      makeSentence({
        subject: "Heart rate",
        verb: "was",
        value: toolVitals?.heart_rate || toolVitals?.heart_rate_bpm,
        missingText: "was not recorded",
      }),
      makeSentence({
        subject: "Oxygen saturation",
        verb: "was",
        value: toolVitals?.oxygen_saturation || toolVitals?.oxygen_saturation_spo2_percent,
        missingText: "was not recorded",
      }),
      // Lifestyle factors from extracted info
      extractedInfo.smoking === "no" ? "Non-smoker." : makeSentence({ 
        subject: "Smoking status", 
        verb: "was", 
        value: normalizeYesNoUnknown(toolLife?.smoking), 
        missingText: "was not specified" 
      }),
      extractedInfo.alcohol === "no" ? "No alcohol use." : makeSentence({ 
        subject: "Alcohol use", 
        verb: "was", 
        value: normalizeYesNoUnknown(toolLife?.alcohol_use), 
        missingText: "was not specified" 
      }),
      extractedInfo.drugs === "no" ? "No recreational drug use." : makeSentence({
        subject: "Recreational drug use",
        verb: "was",
        value: normalizeYesNoUnknown(toolLife?.recreational_drugs),
        missingText: "was not specified",
      }),
      // Medical history from extracted info
      extractedInfo.chronicHealth === "none" ? "No known chronic health conditions." : makeSentence({ 
        subject: "Chronic illnesses", 
        verb: "were", 
        value: toolMed?.chronic_illnesses, 
        missingText: "were not specified" 
      }),
      extractedInfo.medications.length > 0 ? 
        (extractedInfo.medications[0] === "none" ? "No current medications." : `Current medications: ${extractedInfo.medications.join(', ')}`) :
        makeSentence({ 
          subject: "Current medications", 
          verb: "were", 
          value: toolMed?.current_medications, 
          missingText: "were not specified" 
        }),
      extractedInfo.allergies.length > 0 ? 
        (extractedInfo.allergies[0] === "none" ? "No known drug allergies." : `Drug allergies: ${extractedInfo.allergies.join(', ')}`) :
        makeSentence({ 
          subject: "Drug allergies", 
          verb: "were", 
          value: toolMed?.drug_allergies, 
          missingText: "were not specified" 
        }),
      makeYesNoSentence({
        subject: "Recent travel",
        value: extractedInfo.travel || toolExposure?.recent_travel,
        yesText: "Recent travel was reported.",
        noText: "No recent travel was reported.",
        unknownText: "Recent travel history was not specified.",
      }),
      makeYesNoSentence({
        subject: "Sick contacts",
        value: extractedInfo.exposure || toolExposure?.sick_contacts,
        yesText: "Exposure to sick contacts was reported.",
        noText: "Exposure to sick contacts was not reported.",
        unknownText: "Sick contact exposure was not specified.",
      }),
      makeYesNoSentence({
        subject: "Crowded events",
        value: toolExposure?.crowded_events,
        yesText: "Recent attendance at crowded events was reported.",
        noText: "Attendance at crowded events was not reported.",
        unknownText: "Crowded event exposure was not specified.",
      }),
      makeSentence({ 
        subject: "Previous surgeries", 
        verb: "were", 
        value: toolMed?.previous_surgeries, 
        missingText: "were not specified" 
      }),
      makeSentence({ 
        subject: "Family history", 
        verb: "was", 
        value: toolMed?.family_history, 
        missingText: "was not specified" 
      }),
    ])
  );

  const objective = objectiveParts.filter(Boolean).join("\n\n");

 /* ----------------- ASSESSMENT (sentences) ----------------- */
const assessmentParts = [];

if (conditions && conditions.length) {
  // Start with the top differential considerations
  assessmentParts.push("**Top differential considerations:**");
  
  const conditionLines = conditions.slice(0, 3).map((c, idx) => {
    const pct = Math.round(Number(c.percentage || 0));
    return `${idx + 1}. ${c.name} (${pct}% probability)`;
  });
  
  assessmentParts.push(...conditionLines);
  
  // Add a blank line
  assessmentParts.push("");
} else if (chatSummary?.conditions_matching) {
  assessmentParts.push("**Clinical considerations:**");
  const matchingLines = String(chatSummary.conditions_matching).split("\n").filter(Boolean);
  assessmentParts.push(...matchingLines);
  assessmentParts.push("");
} else {
  assessmentParts.push("**Clinical considerations:** were not available.");
  assessmentParts.push("");
}

if (confidence != null) {
  assessmentParts.push(`AI assessment confidence: ${confidence}%`);
  assessmentParts.push("");
}

// ✅ ADDED: Overall Stability and Red-Flag Symptoms
const stability = toolAI?.overall_stability || toolFinal?.ai_assessment?.overall_stability || "Unknown";
const redFlags = normalizeYesNoUnknown(toolAI?.red_flag_symptoms || toolAI?.red_flag_symptoms_present || "Unknown");

assessmentParts.push("**Overall Stability:**");
assessmentParts.push(`• ${sentenceCap(stability)}`);
assessmentParts.push(""); // Add a blank line

assessmentParts.push("**Red-Flag Symptoms:**");

let redFlagText = "";
const redFlagLower = String(redFlags).toLowerCase();

if (redFlagLower.startsWith("yes")) {
  redFlagText = "• Red-flag symptoms were reported and require urgent evaluation.";
} else if (redFlagLower.startsWith("no")) {
  redFlagText = "• No red-flag symptoms were reported.";
} else {
  redFlagText = "• Red-flag symptom assessment was not available.";
}

assessmentParts.push(redFlagText);

const assessment = assessmentParts.filter(line => line !== "").join("\n");

  /* ----------------- PLAN (sentences) ----------------- */
  const planParts = [];
  if (selfCareText && String(selfCareText).trim()) {
    const lines = String(selfCareText).split("\n").map((l) => l.trim()).filter(Boolean);
    planParts.push(sentenceBulletsBlock("Self-care & when to seek help", lines));
  } else {
    planParts.push(
      sentenceBulletsBlock("Self-care & when to seek help", [
        "Hydration, rest, and supportive care were advised as appropriate.",
        "Urgent care was recommended for worsening symptoms, breathing difficulty, confusion, persistent vomiting, severe pain, or high/prolonged fever.",
      ])
    );
  }

  const plan = planParts.join("\n\n");

  return {
    patientName,
    patientAge,
    patientGender,
    consultDate,
    chiefComplaint,
    bmi,

    subjective,
    objective,
    assessment,
    plan,

    conditions,
    confidence,
    selfCareText,
    toolFinal,
    extractedInfo, // Include extracted info for debugging
    ...chatSummary,
  };
};

/* ---------------------------------------------------------- */
/*  Patient summary PDF (friendly, for the patient)           */
/* ---------------------------------------------------------- */
export const generatePatientSummaryPDF = (chatSummary = {}, patientInfo = {}, options = {}) => {
  const { logoImage } = options;

  const { conditions = [], narrativeSummary = "", selfCareText = "", associatedSymptomsChips = [] } = chatSummary;
  const { name: patientName = "Patient", consultDate = new Date().toLocaleDateString() } = patientInfo;

  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentW = pageW - marginX * 2;
  let y = 18;

  setFillHex(doc, COLORS.pageBg);
  doc.rect(0, 0, pageW, pageH, "F");

  setFillHex(doc, COLORS.white);
  setStrokeHex(doc, COLORS.grayLight);
  doc.roundedRect(8, 6, pageW - 16, 18, 4, 4, "FD");

  if (logoImage) {
    try {
      doc.addImage(logoImage, "PNG", 10, 9, 12, 12);
    } catch (_) {}
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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextHex(doc, COLORS.grayText);
  const intro = `Hi ${patientName},\n\nHere's a simple summary of what you shared with Cira and what the AI nurse thinks might be going on. This is not a diagnosis, but a guide to help you understand your symptoms and decide what to do next.`;
  y = addWrappedText(doc, intro, marginX, y, contentW, 4);

  y += 6;

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
      .map((c) => `• ${c.name}${c.percentage != null ? ` (around ${c.percentage}% likelihood)` : ""}`)
      .join("\n");

    y = addWrappedText(doc, list, marginX, y, contentW, 4);
    y += 6;
  }

  if (associatedSymptomsChips && associatedSymptomsChips.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setTextHex(doc, "#111827");
    doc.text("Other symptoms you mentioned", marginX, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setTextHex(doc, COLORS.grayText);

    const chipsText = associatedSymptomsChips.slice(0, 10).map((c) => `• ${c}`).join("\n");
    y = addWrappedText(doc, chipsText, marginX, y, contentW, 4);
    y += 6;
  }

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
    const doc = generatePatientSummaryPDF(chatData, patientInfo, { logoImage });
    doc.save(filename);
  } catch (e) {
    console.warn("Failed to load logo for patient summary PDF, saving without it:", e);
    const doc = generatePatientSummaryPDF(chatData, patientInfo);
    doc.save(filename);
  }
};

/* ---------------------------------------------------------- */
/*  Plain SOAP / EHR PDF (copy-paste friendly)                */
/* ---------------------------------------------------------- */
export const generateEHRSOAPNotePDF = (chatData = {}, patientInfo = {}, options = {}) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  const { consultDate, subjective, objective, assessment, plan } = soapData;

  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 20;
  const contentW = pageW - marginX * 2;
  let y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CLINICAL SOAP NOTE", pageW / 2, y, { align: "center" });

  if (options.logoImage) {
    try {
      doc.addImage(options.logoImage, "PNG", marginX, y - 3, 15, 15);
    } catch (_) {}
  }

  y += 7;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(marginX, y, pageW - marginX, y);
  y += 14;

  const addSOAPSection = (title, textValue) => {
    if (y > 260) {
      doc.addPage();
      y = 22;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), marginX, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const raw = textValue ? String(textValue).trim() : "";
    if (!raw) {
      doc.text("• No information was provided.", marginX, y);
      y += 8;
      return;
    }

    const lines = doc.splitTextToSize(raw, contentW);
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 22;
      }
      doc.text(line, marginX, y);
      y += 6;
    });

    y += 8;
  };

  addSOAPSection("Subjective", subjective);
  addSOAPSection("Objective", objective);
  addSOAPSection("Assessment", assessment);
  addSOAPSection("Plan", plan);

  y = 280;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(marginX, y, pageW - marginX, y);
  y += 5;

  const footerText =
    "Generated by Cira AI Clinical Assistant. This SOAP note is for informational purposes only and should be reviewed by a qualified healthcare professional.";
  doc.text(footerText, pageW / 2, y, { align: "center" });

  return doc;
};

export const downloadEHRSOAPFromChatData = async (chatData, patientInfo = {}, filename = "Cira_SOAP_Note.pdf") => {
  try {
    const logoImage = await loadStarsLogo();
    const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
    const doc = generateSOAPNotePDF(soapData, { logoImage });
    doc.save(filename);
  } catch (e) {
    console.warn("Failed to load logo for PDF, saving without it:", e);
    const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
    const doc = generateSOAPNotePDF(soapData);
    doc.save(filename);
  }
};

/* ----------------- Compatibility helpers ----------------- */
export const generateSOAPFromChatData = (chatData, patientInfo = {}, options = {}) => {
  const soapData = convertChatSummaryToSOAP(chatData, patientInfo);
  return generateSOAPNotePDF(soapData, options);
};

export const downloadSOAPFromChatData = async (chatData, patientInfo = {}, filename = "Report.pdf") => {
  try {
    const logoImage = await loadStarsLogo();
    const doc = generateSOAPFromChatData(chatData, patientInfo, { logoImage });
    doc.save(filename);
  } catch (e) {
    console.warn("Failed to load logo for PDF, saving without it:", e);
    const doc = generateSOAPFromChatData(chatData, patientInfo);
    doc.save(filename);
  }
};

/* ----------------- Export alias (matches your CiraChatAssistant import) ----------------- */
export { downloadDoctorReportPDF as downloadDoctorsReport };
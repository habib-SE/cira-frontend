
// 🔎 Helper to extract conditions + confidence from plain summary text (fallback)
export function parseConditionsAndConfidence(summary) {
  if (!summary) return { conditions: [], confidence: null };

  const conditions = [];
  let confidence = null;

  const confMatch = summary.match(/(\d+)\s*%[^.\n]*confiden/i);
  if (confMatch) {
    confidence = Number(confMatch[1]);
  }

  const blockMatch =
    summary.match(
      /top\s*\d*\s*possible\s*conditions[^:]*:\s*([\s\S]+)/i
    ) ||
    summary.match(
      /following\s+(?:possibilities|conditions)[^:]*:\s*([\s\S]+)/i
    );

  const searchText = blockMatch ? blockMatch[1] : summary;

  const condRegex = /(\d+)\s*%\s*([^%\n]+?)(?=(?:\s+\d+\s*%|\n|$))/g;
  let m;

  while ((m = condRegex.exec(searchText)) !== null) {
    const rawName = m[2].trim();

    if (/confiden/i.test(rawName)) continue;

    conditions.push({
      percentage: Number(m[1]),
      name: rawName.replace(/[.;]+$/, "").trim(),
    });
  }

  return { conditions, confidence };
}

// 🧼 Helper to remove confidence sentence + raw condition lines from the summary
export function stripTopConditionsFromSummary(summary) {
  if (!summary) return "";

  let cleaned = summary;

  cleaned = cleaned.replace(
    /I\s+am[^.\n]*\d+\s*%[^.\n]*following\s+(?:possibilities|conditions)[^.\n]*:?/i,
    ""
  );

  cleaned = cleaned
    .split("\n")
    .filter((line) => !/^\s*\d+\s*%/.test(line.trim()))
    .join("\n");

  return cleaned.trim();
}

// 🧼 Helper to pull out the "For self-care..." paragraph and leave rest
export function splitOutSelfCare(summary) {
  if (!summary) return { cleaned: "", selfCare: "" };

  const pattern =
    /(For self-care[^]*?)(?=\n\s*\n|Please book an appointment|Please book|Take care of yourself|$)/i;

  const match = summary.match(pattern);
  if (!match) {
    return { cleaned: summary.trim(), selfCare: "" };
  }

  const selfCare = match[1].trim();
  const before = summary.slice(0, match.index);
  const after = summary.slice(match.index + match[0].length);
  const cleaned = (before + after).trim();

  return { cleaned, selfCare };
}

// Extract consult data from AI message (JSON + text)
export function extractConsultDataFromMessage(raw) {
  if (!raw) {
    return {
      summaryText: "",
      report: null,
      conditions: [],
      confidence: null,
    };
  }

  let summaryText = raw;
  let report = null;

  const jsonMatch = raw.match(/```json([\s\S]*?)```/i);

  if (jsonMatch) {
    const jsonText = jsonMatch[1].trim();

    // ✅ For UI we only want the natural language part BEFORE the JSON
    summaryText = raw.slice(0, jsonMatch.index).trim();

    try {
      const parsed = JSON.parse(jsonText);
      report =
        parsed.CIRA_CONSULT_REPORT ||
        parsed["CIRA_CONSULT_REPORT"] ||
        parsed;
    } catch (e) {
      console.warn("Failed to parse CIRA_CONSULT_REPORT JSON:", e);
    }
  }

  // Clean leftover fences just in case
  summaryText = summaryText.replace(/```json|```/gi, "").trim();

  // 1️⃣ Try to read conditions & confidence from JSON report
  let conditions = [];
  let confidence = null;

  if (report && report["📊 PROBABILITY ESTIMATES"]) {
    const prob = report["📊 PROBABILITY ESTIMATES"];
    if (prob && typeof prob === "object") {
      conditions = Object.entries(prob)
        .map(([name, value]) => {
          const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
          if (Number.isNaN(num)) return null;
          return { name, percentage: num };
        })
        .filter(Boolean);
    }
  }

  if (report && report["🤖 SYSTEM INFO"]) {
    const info = report["🤖 SYSTEM INFO"];
    if (info && info["Confidence Level"]) {
      const m = String(info["Confidence Level"]).match(/(\d+)/);
      if (m) confidence = Number(m[1]);
    }
  }

  // 2️⃣ Fallback to regex parsing on cleaned summary text if needed
  if (!conditions.length || confidence == null) {
    const parsed = parseConditionsAndConfidence(summaryText);
    if (!conditions.length && parsed.conditions?.length) {
      conditions = parsed.conditions;
    }
    if (confidence == null && parsed.confidence != null) {
      confidence = parsed.confidence;
    }
  }

  return { summaryText, report, conditions, confidence };
}

// Prepare consultation data for PDF generation
export function prepareConsultationDataForPDF(
  consultSummary,
  displaySummary,
  selfCareText,
  parsedSummary,
  summaryCreatedAt,
  vitalsData,
  consultReport
) {
  if (!consultSummary) return null;

  // 🧾 Base patient info
  let patientInfo = {
    name: "User",
    age: "",
    gender: "",
    consultDate: summaryCreatedAt
      ? summaryCreatedAt.toLocaleDateString()
      : new Date().toLocaleDateString(),
  };

  let chiefComplaint;
  let hpi = {}; // ✅ always an object, never undefined
  let associatedChips = [];
  let associatedNote;

  // 🔍 1) Try to fill from CIRA_CONSULT_REPORT JSON
  if (consultReport && typeof consultReport === "object") {
    // PATIENT INFO
    const pInfo = consultReport["👤 PATIENT INFORMATION"];
    if (pInfo) {
      patientInfo = {
        ...patientInfo,
        age: pInfo.Age || patientInfo.age,
        gender: pInfo["Biological Sex"] || patientInfo.gender,
      };
    }

    // CHIEF COMPLAINT
    chiefComplaint = consultReport["🩺 CHIEF COMPLAINT"];

    // HPI block – match any key containing "HISTORY OF PRESENT ILLNESS"
    const hpiKey = Object.keys(consultReport).find((k) =>
      /history of present illness/i.test(k)
    );
    const hpiBlock =
      hpiKey && typeof consultReport[hpiKey] === "object"
        ? consultReport[hpiKey]
        : null;

    if (hpiBlock) {
      hpi = {
        onset: hpiBlock.Onset || "",
        durationPattern:
          hpiBlock.Duration ||
          hpiBlock["Duration / Pattern"] ||
          "",
        location: hpiBlock.Location || "",
        character: hpiBlock.Character || "",
        severity:
          hpiBlock["Severity (1–10)"] ||
          hpiBlock.Severity ||
          "",
        progression: hpiBlock.Progression || "",
        aggravatingFactors: hpiBlock.Triggers || "",
        relievingFactors: hpiBlock.Relief || "",
        radiation: hpiBlock.Radiation || "",
        previousEpisodes: "",
      };

      if (hpiBlock["Associated Symptoms"]) {
        associatedNote = hpiBlock["Associated Symptoms"];
      }
    }

    // ASSOCIATED SYMPTOMS chips from Medical Background (if any)
    const medBg = consultReport["🗂 MEDICAL BACKGROUND"];
    if (medBg) {
      if (medBg["Past History"])
        associatedChips.push(`Past: ${medBg["Past History"]}`);
      if (medBg["Current Medications"])
        associatedChips.push(`Meds: ${medBg["Current Medications"]}`);
      if (medBg.Allergies)
        associatedChips.push(`Allergies: ${medBg.Allergies}`);
    }
  }

  // 🧠 2) Fallback / patch: derive HPI from the narrative summary if still empty
  const summaryForHpi = consultSummary || displaySummary || "";
  if (summaryForHpi.trim()) {
    const s = summaryForHpi;

    // Only override if fields are missing or blank
    const isEmpty = (v) => v == null || String(v).trim() === "";

    if (isEmpty(hpi.onset)) {
      const onsetMatch = s.match(/started\s+([^,.]+)/i);
      if (onsetMatch) hpi.onset = onsetMatch[1].trim();
    }

    if (isEmpty(hpi.severity)) {
      const sevMatch =
        s.match(/rated\s+as\s+a\s+(\d+)\s+out of\s+10/i) ||
        s.match(/rated\s+(\d+)\s*\/\s*10/i);
      if (sevMatch) hpi.severity = sevMatch[1];
    }

    if (isEmpty(hpi.location)) {
      if (/all over/i.test(s)) {
        hpi.location = "All over body";
      }
    }

    if (isEmpty(hpi.character)) {
      const charMatch = s.match(
        /\b(sharp|dull|aching|throbbing|burning|cramping|stabbing)\b/i
      );
      if (charMatch) {
        const word = charMatch[1];
        hpi.character = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    if (isEmpty(hpi.durationPattern)) {
      // quick heuristic – you can tweak
      if (/less than 24 hours/i.test(s)) {
        hpi.durationPattern = "Less than 24 hours";
      } else {
        hpi.durationPattern = "Acute (less than 1 day, per history)";
      }
    }

    if (isEmpty(hpi.progression)) {
      hpi.progression = "Not clearly specified by patient";
    }
    if (isEmpty(hpi.radiation)) {
      hpi.radiation = "Not specified";
    }
    if (isEmpty(hpi.aggravatingFactors)) {
      hpi.aggravatingFactors = "Not specified";
    }
    if (isEmpty(hpi.relievingFactors)) {
      hpi.relievingFactors = "Not specified";
    }
    if (isEmpty(hpi.previousEpisodes)) {
      hpi.previousEpisodes = "Not mentioned";
    }
  }

  // 🔗 3) Build consultation payload for PDF
  return {
    consultationData: {
      conditions: parsedSummary.conditions,
      confidence: parsedSummary.confidence,
      narrativeSummary: displaySummary,
      selfCareText,
      vitalsData,
      hpi,
      associatedSymptomsChips: associatedChips,
      associatedSymptomsNote: associatedNote,
      chiefComplaint,
    },
    patientInfo
  };
}

// Main function to handle PDF download
export function handleDownloadPDF(
  consultSummary,
  displaySummary,
  selfCareText,
  parsedSummary,
  summaryCreatedAt,
  vitalsData,
  consultReport
) {
  if (!consultSummary) return;

  const preparedData = prepareConsultationDataForPDF(
    consultSummary,
    displaySummary,
    selfCareText,
    parsedSummary,
    summaryCreatedAt,
    vitalsData,
    consultReport
  );

  if (!preparedData) return;

  const { consultationData, patientInfo } = preparedData;

  // Import pdfGenerator on demand to avoid circular dependencies
  import('./pdfGenerator').then(({ downloadSOAPFromChatData }) => {
    downloadSOAPFromChatData(
      consultationData,
      patientInfo,
      `Cira_Consult_Report_${new Date().getTime()}.pdf`
    );
  });
}
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

// Process summary text for display
export function processSummaryForDisplay(consultSummary) {
  if (!consultSummary) {
    return {
      displaySummary: "",
      selfCareText: "",
      parsedSummary: { conditions: [], confidence: null }
    };
  }

  // 1) Remove confidence + raw % lines
  const withoutTop = stripTopConditionsFromSummary(consultSummary);

  // 2) Separate out the self-care block
  const split = splitOutSelfCare(withoutTop);
  let displaySummary = split.cleaned;
  const selfCareText = split.selfCare;

  // 3) Remove leftover intro lines like "Here are the..."
  displaySummary = displaySummary
    .replace(/^\s*Here are the[^\n]*\n?/gim, "")
    .replace(/Take care of yourself,[^\n]*\n?/gi, "")
    .trim();

  // 4) Final safety filter
  displaySummary = displaySummary
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^\d+\s*%/.test(trimmed)) return false;
      if (/confident in the following possibilities/i.test(trimmed))
        return false;
      if (/top\s*\d*\s*possible\s*conditions/i.test(trimmed)) return false;
      return true;
    })
    .join("\n");

  displaySummary = displaySummary.replace(/\n{3,}/g, "\n\n");

  // Parse conditions and confidence from the summary
  const parsedSummary = parseConditionsAndConfidence(consultSummary);

  return {
    displaySummary,
    selfCareText,
    parsedSummary
  };
}

// Format date labels for display
export function formatDateLabels(summaryCreatedAt, startedTime) {
  const startedLabel = startedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const summaryDateLabel =
    summaryCreatedAt &&
    summaryCreatedAt.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return { startedLabel, summaryDateLabel };
}
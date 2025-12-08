// File: components/SummaryCard.jsx
import React from "react";
import AgentAvatar from "../../assets/nurse.png";

export default function SummaryModal({
  displaySummary,
  selfCareText,
  parsedSummary,
  summaryDateLabel,
  onDownloadPDF,
  onFindDoctorSpecialist,
}) {
  return (
    <section className="w-full mt-6 mb-2">
      <div className="bg-white shadow-sm border border-[#E3E3F3] px-5 py-6">
        <div className="w-full flex justify-center my-4">
          <div className="rounded-xl overflow-hidden px-6 py-4 flex flex-col items-center">
            <img
              src={AgentAvatar}
              alt=""
              className="w-32 h-32 rounded-full mb-3"
            />
            <p className="text-xs text-gray-500">
              Your AI clinician assistant, Cira
            </p>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            AI Consult Summary
          </h2>
          {summaryDateLabel && (
            <p className="text-xs text-gray-400">
              {summaryDateLabel}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
          {displaySummary}
        </p>

        {parsedSummary.conditions.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Conditions Matching
            </h3>

            <div className="space-y-3">
              {parsedSummary.conditions.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="text-gray-800 truncate">
                      {c.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {c.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedSummary.confidence != null && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-1">
              Assessment confidence
            </p>

            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-emerald-600">
                {parsedSummary.confidence >= 80
                  ? "Pretty sure"
                  : parsedSummary.confidence >= 60
                  ? "Somewhat sure"
                  : "Low confidence"}
              </span>
              <span className="text-gray-600">
                {parsedSummary.confidence}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    parsedSummary.confidence,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Self-care & when to seek help
          </h3>

          {selfCareText ? (
            <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
              {selfCareText}
            </p>
          ) : (
            <p className="text-xs text-gray-600 mb-2">
              Home care with rest, fluids, and over-the-counter
              pain relievers is usually enough for most mild
              illnesses. If your fever rises, breathing becomes
              difficult, or your symptoms last more than a few
              days or suddenly worsen, contact a doctor or urgent
              care.
            </p>
          )}

          <p className="text-[11px] text-gray-400">
            These are rough estimates and do not replace medical
            advice. Always consult a healthcare professional if
            you&apos;re worried.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
            onClick={onDownloadPDF}
          >
            Download Report Note (PDF)
          </button>

          <button
            type="button"
            onClick={onFindDoctorSpecialist}
            className="flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5"
          >
            Find Doctor Specialist
          </button>
        </div>
      </div>
    </section>
  );
}
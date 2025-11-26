// src/pages/doctor/DoctorAvailability.jsx
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  Trash2,
  Save,
  AlertCircle,
} from "lucide-react";
import Card from "../../admin/admincomponents/Card";

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultSession = {
  start: "09:00",
  end: "17:00",
  mode: "clinic", // clinic | teleconsultation | both
};

const buildDefaultAvailability = () => {
  const base = {};
  daysOfWeek.forEach((d) => {
    base[d.key] = {
      enabled: ["saturday", "sunday"].includes(d.key) ? false : true,
      sessions: ["saturday", "sunday"].includes(d.key)
        ? []
        : [{ ...defaultSession }],
    };
  });
  return base;
};

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState(() => {
    try {
      const stored = localStorage.getItem("doctorAvailability");
      return stored ? JSON.parse(stored) : buildDefaultAvailability();
    } catch {
      return buildDefaultAvailability();
    }
  });

  const [saveStatus, setSaveStatus] = useState(null); // "saved" | "error" | null

  useEffect(() => {
    // optional: auto-save on change
    try {
      localStorage.setItem("doctorAvailability", JSON.stringify(availability));
    } catch (e) {
      console.error("Failed to persist availability:", e);
    }
  }, [availability]);

  const handleToggleDay = (dayKey) => {
    setAvailability((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      },
    }));
  };

  const handleAddSession = (dayKey) => {
    setAvailability((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        sessions: [...prev[dayKey].sessions, { ...defaultSession }],
      },
    }));
  };

  const handleRemoveSession = (dayKey, index) => {
    setAvailability((prev) => {
      const sessions = [...prev[dayKey].sessions];
      sessions.splice(index, 1);
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          sessions,
        },
      };
    });
  };

  const handleSessionChange = (dayKey, index, field, value) => {
    setAvailability((prev) => {
      const sessions = [...prev[dayKey].sessions];
      sessions[index] = { ...sessions[index], [field]: value };
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          sessions,
        },
      };
    });
  };

  const handleSave = () => {
    try {
      // Here you can call your backend API instead of only localStorage
      localStorage.setItem("doctorAvailability", JSON.stringify(availability));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      console.error("Error saving availability:", e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-0">
            Availability
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Set your weekly working hours for clinic and teleconsultation. Patients
            can only book appointments in these time slots.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Save Availability</span>
        </button>
      </div>

      {/* Info Banner */}
      <Card className="p-3 sm:p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            <AlertCircle className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              How availability works
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Set which days and hours you are available. When a patient or company
              tries to book, we’ll only show them these slots. You can still
              manually create appointments outside these hours if needed.
            </p>
          </div>
        </div>
      </Card>

      {/* Weekly Availability */}
      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const dayConfig = availability[day.key];

          return (
            <Card key={day.key} className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {day.label}
                  </h2>
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      dayConfig.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {dayConfig.enabled ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Toggle */}
                <label className="inline-flex items-center cursor-pointer self-end sm:self-auto">
                  <span className="mr-2 text-xs sm:text-sm text-gray-600">
                    {dayConfig.enabled ? "Turn off" : "Turn on"}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dayConfig.enabled}
                      onChange={() => handleToggleDay(day.key)}
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform" />
                  </div>
                </label>
              </div>

              {/* Sessions */}
              {dayConfig.enabled ? (
                <div className="space-y-3">
                  {dayConfig.sessions.length === 0 && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      No sessions added for this day. Add at least one time slot
                      below.
                    </p>
                  )}

                  {dayConfig.sessions.map((session, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                        {/* Start Time */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Start Time
                          </label>
                          <div className="flex items-center border border-gray-200 rounded-lg px-2">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                              type="time"
                              value={session.start}
                              onChange={(e) =>
                                handleSessionChange(
                                  day.key,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                              className="w-full text-sm border-0 focus:ring-0 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* End Time */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            End Time
                          </label>
                          <div className="flex items-center border border-gray-200 rounded-lg px-2">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                              type="time"
                              value={session.end}
                              onChange={(e) =>
                                handleSessionChange(
                                  day.key,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              className="w-full text-sm border-0 focus:ring-0 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Mode */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Mode
                          </label>
                          <div className="flex items-center border border-gray-200 rounded-lg px-2">
                            {session.mode === "clinic" && (
                              <MapPin className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            {session.mode === "teleconsultation" && (
                              <Video className="w-4 h-4 text-blue-500 mr-2" />
                            )}
                            {session.mode === "both" && (
                              <>
                                <MapPin className="w-4 h-4 text-green-500 mr-1" />
                                <Video className="w-4 h-4 text-blue-500 mr-2" />
                              </>
                            )}
                            <select
                              value={session.mode}
                              onChange={(e) =>
                                handleSessionChange(
                                  day.key,
                                  index,
                                  "mode",
                                  e.target.value
                                )
                              }
                              className="w-full text-sm border-0 bg-transparent focus:ring-0 focus:outline-none"
                            >
                              <option value="clinic">Clinic</option>
                              <option value="teleconsultation">
                                Teleconsultation
                              </option>
                              <option value="both">Clinic &amp; Teleconsultation</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSession(day.key, index)}
                        className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg self-end sm:self-auto mt-2 md:mt-4"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddSession(day.key)}
                    className="mt-1 inline-flex items-center px-3 py-2 text-xs sm:text-sm text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add time slot
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500">
                  You are marked as unavailable on this day. Turn the switch on to
                  add working hours.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Save status */}
      {saveStatus === "saved" && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center space-x-2">
          <CheckIcon />
          <span>Availability saved</span>
        </div>
      )}
      {saveStatus === "error" && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to save availability</span>
        </div>
      )}
    </div>
  );
}

// tiny inline check icon to avoid extra imports
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// very permissive phone validation (supports +, spaces, dashes)
const PHONE_RE =
  /^[+]?[\d\s().-]{7,20}$/;

export default function DemoAccessModal({
  open,
  onClose,
  onSuccess,
  title = "Proceed with Demo",
  subtitle = "Please share your email and phone number to proceed with the demo.",
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({ email: false, phone: false });
  const [saving, setSaving] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email";

    if (!phone.trim()) e.phone = "Phone is required";
    else if (!PHONE_RE.test(phone.trim())) e.phone = "Enter a valid phone number";

    return e;
  }, [email, phone]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({ email: true, phone: true });
  if (!isValid) return;

  setSaving(true);
  try {
    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    // ⏳ simulate 2-second saving delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // store for the demo flow
    localStorage.setItem("cira_demo_contact", JSON.stringify(payload));

    onSuccess?.(payload);
    onClose?.();
  } finally {
    setSaving(false);
  }
};


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
  className="absolute inset-0 backdrop-blur-[1px]"
  onClick={onClose}
/>


          {/* modal */}
          <motion.div
           className="relative bg-white/30 backdrop-blur-md rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl overflow-hidden"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="you@example.com"
                  type="email"
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="+92 300 1234567"
                  type="tel"
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isValid || saving}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Continue"}
              </button>

              <p className="text-[11px] text-gray-400">
                We only use this for demo access and follow-up.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

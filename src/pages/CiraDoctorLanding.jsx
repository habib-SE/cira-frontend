import React from "react";
import { ArrowRight, ShieldCheck, Mic, Video, UserCheck } from "lucide-react";

const CiraDoctorLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE9F6] via-[#FFE6F3] to-[#FFF7EA] text-slate-900">
      {/* Top Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white shadow-md">
            <span className="font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">Cira</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <button className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-pink-600 shadow-sm">
            Cira Health • Secure &amp; Simple
          </button>
          <button className="text-slate-700 hover:text-pink-600 transition-colors">
            Product
          </button>
          <button className="text-slate-700 hover:text-pink-600 transition-colors">
            Pricing
          </button>
          <button className="text-slate-700 hover:text-pink-600 transition-colors">
            Contact
          </button>
        </nav>

        <button className="rounded-full border border-pink-200 bg-white px-4 py-1.5 text-sm font-semibold text-pink-600 shadow-sm hover:bg-pink-50 transition">
          Log in
        </button>
      </header>

      {/* HERO – “Hi, I’m Cira” */}
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-4 lg:px-0">
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          {/* Left: text + input */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-pink-600 shadow-sm mb-4">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              #1 AI Doctor • HIPAA-ready
            </div>

            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-[3.1rem]">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                Cira
              </span>
              , your private <br className="hidden md:block" /> AI doctor.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-700">
              My service is fast, friendly, and available 24/7. Ask me anything
              about your health and I’ll help you understand what might be
              happening and what you can do next.
            </p>

            {/* Stats row like “18M consultations” */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-pink-300" />
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-purple-300" />
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-300" />
                </div>
                <span className="font-semibold text-slate-900">
                  18,434,730+ consultations
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <ShieldCheck className="h-4 w-4 text-pink-500" />
                <span>Private &amp; secure by design</span>
              </div>
            </div>

            {/* Ask box + CTA */}
            <div className="mt-8 rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur">
              <p className="mb-2 text-xs font-semibold text-slate-500">
                What can I help you with today?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <textarea
                    rows={2}
                    className="w-full resize-none rounded-xl border border-pink-100 bg-pink-50/40 px-3 py-2 text-sm text-slate-800 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                    placeholder="E.g. I have chest pain when I walk quickly…"
                  />
                  <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
                    0 / 1152
                  </span>
                </div>

                <button className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 hover:brightness-110 transition">
                  <Mic className="h-4 w-4" />
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Ask in your own words — I’ll do the rest.</span>
                <span>HIPAA • Private</span>
              </div>
            </div>
          </div>

          {/* Right: hero illustration card */}
          <div className="relative mx-auto max-w-md">
            <div className="relative rounded-[28px] bg-white/90 p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-blue-500 p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <span className="text-lg font-bold text-pink-500">C</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Cira, AI Doctor
                  </p>
                  <p className="text-xs text-slate-500">
                    Always-on health companion
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                  <p className="rounded-2xl bg-pink-50 px-3 py-2 text-slate-800">
                    “Tell me what’s going on — I’ll ask a few questions to
                    understand your symptoms.”
                  </p>
                </div>
                <div className="flex justify-end">
                  <p className="max-w-[70%] rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-2 text-right text-[11px] text-white shadow">
                    “I’ve had a headache and low energy for the last three
                    days.”
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                <span>Designed for remote vitals &amp; triage</span>
                <span className="font-semibold text-pink-500">Cira Health</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 – Fast & free service (like Doctronic “As an AI doctor…”) */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            As an AI doctor, I provide fast{" "}
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              and free
            </span>{" "}
            guidance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Your conversation is private by default. With millions of simulated
            consultations, I can help you understand symptoms, prepare for a
            doctor visit, and decide what to do next.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Instant answers",
                desc: "Skip waiting rooms. Get medically-informed guidance in seconds.",
              },
              {
                title: "Always-on support",
                desc: "Available 24/7 to help with new symptoms or ongoing conditions.",
              },
              {
                title: "Doctor handoff",
                desc: "If needed, I can prepare a summary to share with a human doctor.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white/90 p-5 text-left shadow-md shadow-pink-100/60"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 – Talk like your regular doctor */}
        <section className="mt-24 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              You can talk to me just like you
              <br className="hidden md:block" /> would your regular doctor
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Describe how you feel in everyday language. I’ll ask follow up
              questions, clarify what might be happening, and explain things in
              terms you can actually understand.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>• Symptom checking &amp; triage</li>
              <li>• Medication &amp; lab result explanations</li>
              <li>• Lifestyle and prevention coaching</li>
            </ul>
          </div>

          {/* Chat mock card */}
          <div className="mx-auto max-w-md rounded-3xl bg-white/90 p-5 shadow-xl">
            <div className="rounded-2xl bg-slate-50 p-4 text-left text-xs space-y-3">
              <div className="text-slate-600">
                <span className="font-semibold">Cira:</span> Hey there, what
                health issue or question can I help you with today?
              </div>
              <div className="ml-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-2 text-right text-[11px] text-white">
                I’ve got a rash on my arm and I’m not sure if it’s serious.
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">Cira:</span> Got it. I’ll ask a
                few questions about how it looks, feels, and when it started so
                we can narrow down what’s going on.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 – Connect to human doctor (like $39 follow-up) */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-black text-slate-900">
            When we’re done chatting, I can
            <br className="hidden md:block" /> connect you to a human doctor
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            If you want, you can book a video visit with a licensed doctor to
            confirm findings, get prescriptions, or discuss next steps — all
            from your phone.
          </p>

          <button className="mt-5 rounded-full bg-emerald-500 px-6 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-300/60">
            Appointments available instantly, 24/7
          </button>

          <div className="mx-auto mt-8 grid max-w-3xl gap-5 text-left md:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-4 shadow">
              <p className="text-sm font-semibold text-slate-900">
                Top licensed doctors
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Work with experienced physicians across multiple specialties.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow">
              <p className="text-sm font-semibold text-slate-900">
                Full service care
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Discuss our AI findings, confirm a diagnosis, and get treatment
                guidance.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow">
              <p className="text-sm font-semibold text-slate-900">
                No insurance required
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Transparent pricing and digital records for every visit.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 – Remember your history */}
        <section className="mt-24 grid gap-10 pb-20 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black text-slate-900">
              I’ll remember your health history
              <br className="hidden md:block" /> so you don’t have to
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Skip repetitive intake forms and forgotten details. With your
              permission, I keep a secure timeline of symptoms, medications, and
              doctor visits — so every conversation starts smarter.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Track meds, allergies, and conditions over time</li>
              <li>• Generate summaries you can share with any doctor</li>
              <li>• Built with privacy, consent, and security as defaults</li>
            </ul>
          </div>

          {/* Circular avatar + icons */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative h-64 w-64 rounded-full bg-white shadow-xl flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-b from-slate-200 to-slate-300" />
              {/* small icons around */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white p-2 shadow">
                <Video className="h-4 w-4 text-pink-500" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow">
                <UserCheck className="h-4 w-4 text-blue-500" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white p-2 shadow">
                <Mic className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-pink-100 bg-white/80 py-5 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} Cira Health. Crafted by INSTLY Technologies.
        Your data is protected with modern encryption &amp; secure access
        policies.
      </footer>
    </div>
  );
};

export default CiraDoctorLanding;

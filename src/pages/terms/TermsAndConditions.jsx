// File: src/components/terms/TermsAndConditions.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import stars from "../../assets/stars.svg";
import AgentAvatar from "../../assets/nurse.png";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleAccept = () => {
    if (!hasAgreed) return;
    localStorage.setItem("terms_accepted", "true");
    navigate("/chat");
  };

  const handleDecline = () => {
    navigate("/newhome");
  };

  // Same animation variants as landing page
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const termsSections = [
    {
      id: "introduction",
      title: "1. Introduction & Acceptance",
      content: `Welcome to Cira Health, an AI-powered clinical assistant designed to provide preliminary health information and guidance. By accessing or using Cira Health services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use immediately.

These Terms constitute a legally binding agreement between you ("User", "Patient", "Data Subject") and Cira Health ("Service Provider", "Controller", "Covered Entity") regarding your use of our AI clinical assistant services.`
    },
    {
      id: "hipaa-compliance",
      title: "2. HIPAA Compliance & Protected Health Information (PHI)",
      content: `Cira Health complies with the Health Insurance Portability and Accountability Act (HIPAA) regulations:

2.1 Covered Entity Status: Cira Health operates as a Covered Entity under HIPAA when providing clinical assistant services.

2.2 Protected Health Information (PHI): All health information you share with Cira Health, including symptoms, medical history, vital signs, and consultation summaries, constitutes Protected Health Information (PHI) under HIPAA.

2.3 Use and Disclosure: We will only use and disclose your PHI for purposes of providing our services, as described in our Notice of Privacy Practices, or as required by law.

2.4 Minimum Necessary Standard: Cira Health follows the HIPAA Minimum Necessary Standard, accessing only the minimum PHI necessary to accomplish the intended purpose.

2.5 Patient Rights: You have the right to:
- Access your PHI
- Request amendments to your PHI
- Request restrictions on certain uses and disclosures
- Receive an accounting of disclosures
- Request confidential communications
- Obtain a copy of our Notice of Privacy Practices

2.6 Breach Notification: In the event of a breach of unsecured PHI, we will notify affected individuals, the Secretary of Health and Human Services, and, where applicable, the media, in accordance with HIPAA requirements.`
    },
    {
      id: "gdpr-compliance",
      title: "3. GDPR Compliance & Data Protection Rights",
      content: `For users in the European Union, United Kingdom, and other GDPR-applicable regions:

3.1 Legal Basis for Processing: We process your personal data based on:
- Your explicit consent (Article 6(1)(a) GDPR)
- Performance of a contract (Article 6(1)(b) GDPR)
- Legitimate interests (Article 6(1)(f) GDPR)
- Processing of special category data (health data) under Article 9(2)(a) - explicit consent

3.2 Data Subject Rights: Under GDPR, you have the right to:
- Access your personal data (Article 15)
- Rectification of inaccurate data (Article 16)
- Erasure ("right to be forgotten") (Article 17)
- Restriction of processing (Article 18)
- Data portability (Article 20)
- Object to processing (Article 21)
- Not be subject to automated decision-making, including profiling (Article 22)

3.3 Data Protection Officer (DPO): Our Data Protection Officer can be contacted at: dpo@cirahealth.com

3.4 International Transfers: We implement Standard Contractual Clauses (SCCs) and additional safeguards for any data transfers outside the EEA.`
    },
    {
      id: "ai-disclaimer",
      title: "4. AI Assistant Limitations & Medical Disclaimer",
      content: `4.1 Non-Medical Advice: Cira Health's AI assistant provides preliminary health information only. It does NOT provide medical diagnosis, treatment, or professional medical advice.

4.2 Not a Replacement: Our AI assistant does NOT replace consultation with qualified healthcare professionals. Always seek advice from a licensed physician for medical concerns.

4.3 No Doctor-Patient Relationship: Use of Cira Health does not create a doctor-patient relationship between you and Cira Health or its AI systems.

4.4 Emergency Situations: In case of medical emergency, call emergency services immediately. Do not rely on Cira Health for emergency medical guidance.

4.5 Accuracy Disclaimer: While we strive for accuracy, AI-generated content may contain errors. Always verify information with healthcare professionals.

4.6 Automated Decision-Making: You have the right to request human review of any automated decisions made by our AI system. Contact support@cirahealth.com for human review requests.`
    },
    {
      id: "data-security",
      title: "5. Data Security & Protection Measures",
      content: `5.1 Encryption Standards:
- Data in Transit: All communications are encrypted using TLS 1.3 with forward secrecy
- Data at Rest: PHI is encrypted using AES-256 encryption
- Storage: Sensitive data is stored in encrypted databases with strict access controls

5.2 Authentication & Access Control:
- Multi-factor authentication available for enhanced security
- Unique user identification required
- Role-based access controls implemented
- Automatic session timeout after 15 minutes of inactivity

5.3 Audit Controls: Comprehensive audit logs track all access to PHI, including:
- User identification
- Timestamp of access
- Type of access
- Data accessed or modified
- IP address and device information

5.4 Incident Response: We maintain an incident response plan for security breaches, including:
- Immediate containment procedures
- Forensic analysis
- Notification protocols
- Remediation measures`
    },
    {
      id: "user-obligations",
      title: "6. User Responsibilities & Acceptable Use",
      content: `6.1 Accurate Information: You agree to provide accurate, complete, and current information about your health status.

6.2 Prohibited Uses: You must NOT:
- Use Cira Health for emergency medical situations
- Provide false or misleading health information
- Attempt to diagnose or treat others using our service
- Use automated scripts or bots to interact with our AI
- Attempt to reverse engineer or compromise our systems
- Share login credentials or allow unauthorized access

6.3 Age Restrictions: You must be at least 18 years old to use Cira Health. Users aged 13-17 may use the service only with verified parental consent.

6.4 Consent Management: You may withdraw consent for data processing at any time through your account settings, though this may limit service availability.`
    },
    {
      id: "data-retention",
      title: "7. Data Retention & Deletion",
      content: `7.1 Retention Periods:
- Active consultations: 7 years from last activity (HIPAA requirement)
- Audit logs: 6 years minimum
- User accounts: Retained while active, deleted upon request
- Anonymized data: May be retained indefinitely for research purposes

7.2 Right to Erasure: You may request complete deletion of your data at any time. We will:
- Confirm identity before processing deletion requests
- Delete all identifiable data within 30 days
- Retain only legally required records (e.g., billing records)

7.3 Data Portability: Upon request, we will provide your data in a structured, commonly used, machine-readable format (JSON/CSV).`
    },
    {
      id: "third-party",
      title: "8. Third-Party Services & Data Sharing",
      content: `8.1 Limited Sharing: We do NOT sell your health data. We only share PHI with:
- Healthcare providers you explicitly authorize
- Payment processors (minimal necessary information)
- Legal authorities when required by law
- Service providers under Business Associate Agreements (BAAs)

8.2 Business Associates: All third-party service providers handling PHI sign Business Associate Agreements (BAAs) ensuring HIPAA compliance.

8.3 Analytics: We use anonymized, aggregated data for:
- Service improvement
- Research purposes
- Statistical analysis
No personally identifiable information is included in analytics data.`
    },
    {
      id: "liability",
      title: "9. Limitations of Liability & Indemnification",
      content: `9.1 No Medical Liability: Cira Health is not liable for:
- Medical outcomes resulting from AI-generated information
- Delays in seeking professional medical care
- User misinterpretation of AI-generated content
- Decisions made based on our AI's suggestions

9.2 Maximum Liability: Our total liability for any claim related to these Terms shall not exceed the amount paid by you for services in the past 12 months.

9.3 Indemnification: You agree to indemnify and hold harmless Cira Health from any claims arising from:
- Your violation of these Terms
- Your misuse of the service
- Your failure to seek appropriate medical care
- Unauthorized use of your account`
    },
    {
      id: "modifications",
      title: "10. Modifications & Updates",
      content: `10.1 Terms Updates: We may update these Terms periodically. Continued use after updates constitutes acceptance.

10.2 Notification: We will notify users of material changes:
- Via email notification
- Through in-app announcements
- By updating the "Last Updated" date

10.3 Historical Versions: Previous versions of these Terms are archived and available upon request.

10.4 Governing Law: These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.

Last Updated: ${new Date().toLocaleDateString()}
Effective Date: Upon user acceptance`
    }
  ];

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-[#FFFEF9]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <motion.div
        className="flex-1 overflow-y-auto pt-20"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-full flex justify-center min-h-full pb-48">
          <div className="w-full max-w-3xl">
            <div className="px-4 pt-6 pb-8">
              <header className="mb-8 px-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center">
                    <img src={stars} className="w-12 h-12" alt="stars" />
                  </div>
                  <div>
                    <img
                      src={AgentAvatar}
                      alt="Cira Assistant"
                      className="w-16 h-16 rounded-full border-2 border-white object-cover"
                    />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-[#111827] mb-2">
                  Cira Health Terms & Conditions
                </h1>
                <p className="text-sm text-gray-500 mb-1">
                  AI Clinical Assistant Service Agreement
                </p>
                <p className="text-xs text-gray-400">
                  Last Updated: {new Date().toLocaleDateString()}
                </p>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Important Notice</h3>
                  <p className="text-sm text-blue-700">
                    By using Cira Health, you acknowledge that this is an AI assistant providing preliminary health information only. It does NOT replace professional medical advice. In emergencies, call your local emergency services immediately.
                  </p>
                </div>
              </header>

              <div className="border border-gray-200 mb-6" />

              {/* Terms Sections */}
              <div className="space-y-4">
                {termsSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <span className="text-gray-500">
                        {expandedSections.has(section.id) ? "−" : "+"}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-4 pt-2 border-t border-gray-100">
                            <div className="prose prose-sm max-w-none">
                              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {section.content}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                <a
                  href="/privacy-policy"
                  className="px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-center transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/hipaa-notice"
                  className="px-4 py-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-center transition-colors"
                >
                  HIPAA Notice
                </a>
                <a
                  href="/gdpr-rights"
                  className="px-4 py-3 text-sm bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 text-center transition-colors"
                >
                  GDPR Rights
                </a>
              </div>

              {/* Acceptance Section - Same as landing page */}
              <motion.div 
                className="mt-10 bg-white rounded-xl border border-gray-200 p-6"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex items-center h-6">
                    <input
                      id="accept-terms"
                      type="checkbox"
                      checked={hasAgreed}
                      onChange={(e) => setHasAgreed(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="accept-terms" className="text-sm font-medium text-gray-900 block mb-2">
                      I have read and agree to the Terms & Conditions
                    </label>
                    <p className="text-xs text-gray-600">
                      By checking this box, you acknowledge that you have read, understood, and agree to be bound by all terms, including HIPAA and GDPR provisions, AI limitations, and medical disclaimers.
                    </p>
                  </div>
                </div>


                <p className="text-xs text-gray-500 mt-4 text-center">
                  Need help? Contact our support team at support@cirahealth.com
                </p>
              </motion.div>

              {/* Legal Footer */}
              <motion.div 
                className="mt-8 pt-6 border-t border-gray-200"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                  <div className="mb-2 md:mb-0">
                    <p>Cira Health AI Clinical Assistant</p>
                    <p>© {new Date().getFullYear()} Cira Health. All rights reserved.</p>
                  </div>
                  <div className="text-center">
                    <p>Data Protection Officer: dpo@cirahealth.com</p>
                    <p>HIPAA Compliance Officer: compliance@cirahealth.com</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <p>Version: 2.3.1</p>
                    <p>Compliance: HIPAA/GDPR Certified</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
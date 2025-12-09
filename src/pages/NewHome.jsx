import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  Mic,
  Send,
  Sparkles,
  Heart,
  Stethoscope,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  FileText,
  Users,
  HelpCircle,
  Facebook,
  Plus,
  UserCheck,
  Check,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CiraChatAssistant from "../assistant/CiraChatAssistant";
import Nurse from "../assets/nurse.png";
import FriendlyNurse from "../assets/FriendlyNurse.png";
import mic from "../assets/mice.svg";
import Stars from "../assets/stars.svg";
import Header from "../components/Header";

// Hero Section Component
// const HeroSection = ({ onStartChat }) => {
//   const [message, setMessage] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const navigate = useNavigate();
//   const characterLimit = 4608;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const trimmed = message.trim();
//     if (trimmed && trimmed.length <= characterLimit) {
//       onStartChat?.(trimmed);
//       setMessage("");
//     }
//   };

//   const handleTopicClick = (topic) => {
//     if (onStartChat) {
//       onStartChat(topic);
//     }
//   };

//   const handleMicClick = () => {
//     navigate("/assistant");
//   };

//   const remainingChars = characterLimit - message.length;

//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   const float = {
//     animate: {
//       y: [0, -5, 0],
//       transition: { duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
//     },
//   };

//   const suggestedTopics = [
//     "Fatigue & Energy",
//     "Weight Management",
//     "Hair & Skin",
//     "Hormones"
//   ];

//   return (
//     <motion.section
//       className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-24 pb-20 md:pb-32 bg-[#FFF5F5] w-full min-h-screen"
//       initial="hidden"
//       animate="show"
//       transition={{ staggerChildren: 0.15 }}
//     >
//       <div className="max-w-7xl mx-auto w-full">
//         {/* Trust Badges - Centered at Top */}
//         <motion.div 
//           variants={fadeUp} 
//           className="flex flex-wrap justify-center gap-3 md:gap-6 text-[8px] md:text-[9px] text-gray-600 mb-7 md:mb-9"
//         >
//           <motion.div variants={float} className="flex items-center gap-3 text-black">
           
//             <div className="flex flex-row text-[10px] md:text-[12px] ">
//               <strong>100%</strong>
//               <p>-Secure</p>
//             </div>
//           </motion.div>
//           <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-1 text-black">
//             <Users className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] fill-current text-black" />
//             <span className="text-[10px] md:text-[12px]">Trusted by thousands</span>
//           </motion.div>
//           <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-1 text-black">
//             <div className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] rounded-full bg-black flex items-center justify-center">
//               <Plus className="w-[6px] h-[6px] md:w-[8px] md:h-[8px] text-white" strokeWidth={3} />
//             </div>
//             <span className="text-[10px] md:text-[12px]">Instant AI answers</span>
//           </motion.div>
//         </motion.div>

//         {/* Centered Single Column Layout */}
//         <div className="max-w-3xl mx-auto">
//           <div className="space-y-8">
//            {/* Heading with Small Avatar and caption */}
// <motion.div variants={fadeUp} className="flex flex-col gap-4">

//   {/* Avatar + Title Row */}
//   <div className="flex items-center gap-3 md:gap-4">
//     <img 
//       src={Nurse} 
//       alt="Cira" 
//       className="w-12 h-12 md:w-16 md:h-16 rounded-full object-contain flex-shrink-0" 
//     />
// <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-normal text-gray-950 tracking-wide relative flex items-center gap-2">

//   Hi, I'm <span className="text-pink-400 relative inline-block">

//     Ci<span className="relative inline-block">
//       r
//       {/* BETA Badge */}
//       <span className="absolute -top-8 left-1/ -translate-x-1/2">
//         <span className="group relative">
//           <span className="bg-pink-500 text-white text-[9px] px-2 py-[2px] rounded-full cursor-pointer shadow-md">
//             BETA
//           </span>

//           {/* Tooltip */}
//           <span className="absolute top-1 left-48 -translate-x-1/2 
//             hidden group-hover:block 
//             bg-black text-white text-[11px] px-3 py-2 rounded-lg 
//             whitespace-nowrap shadow-lg z-20">
//             This version is for testing only. Features may change.
//           </span>
//         </span>
//       </span>
//     </span>a

//   </span>, your AI Nurse

// </h1>

//   </div>

//   {/* Caption Paragraph */}
//   <p className="text-[14px] md:text-[16px] text-gray-600 max-w-2xl leading-relaxed pl-1">
//     Your personal nurse in over 32 languages — always ready to listen. 
//     Cira understands how you feel, helps you explain your symptoms clearly, 
//     and supports your health journey with kindness, intelligence, and privacy-first care.
//   </p>

// </motion.div>

//             {/* Sub-heading */}
//             <motion.div
//               variants={fadeUp}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.2 } }}
//             >
              
//               <p className="text-[15px] md:text-[18px] text-gray-800 font-bold -mt-4">
//                 What can I help you with today?
//               </p>
//             </motion.div>

//             {/* Suggested Topics */}
//             <motion.div
//               variants={fadeUp}
//               className="flex flex-wrap gap-2 mb-7"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.3 } }}
//             >
//               {suggestedTopics.map((topic, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => handleTopicClick(topic)}
//                   className="px-4 py-2 md:px-5 md:py-2.5 bg-white hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-800 text-xs md:text-sm font-semibold transition-all duration-200"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {topic}
//                 </motion.button>
//               ))}
//             </motion.div>

//             {/* Chat Input */}
//             <motion.div variants={fadeUp} className="w-full !mb-11">
//               <div
//                 className={`relative bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${
//                   isFocused
//                     ? "border-gray-800 shadow-md"
//                     : "border-gray-200 shadow-sm"
//                 }`}
//               >
//                 <form onSubmit={handleSubmit} className="relative">
//                   <div className="relative w-full">
//                     <textarea
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       onFocus={() => setIsFocused(true)}
//                       onBlur={() => setIsFocused(false)}
//                       placeholder="Ask me anything about your health..."
//                       className="w-full min-h-[112px] pl-6 pr-40 pt-4 pb-20 text-lg bg-white rounded-[2.5rem] focus:outline-none border-0 placeholder:text-gray-800 placeholder:text-[19px] placeholder:font-light text-start resize-none font-sans"
//                       maxLength={characterLimit}
//                     />

//                     {/* Mic button on the left - icon only, pink background */}
//                     <button
//                       type="button"
//                       onClick={handleMicClick}
//                       className="absolute bottom-3 left-5 p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-500 hover:text-pink-600 transition-all duration-200"
//                     >
//                       <img src={mic} alt="mic" className="w-5 h-5" />
//                     </button>

//                     {/* Get Started button */}
//                     <div className="absolute bottom-3 right-3">
//                       <motion.button
//                         type="submit"
//                         disabled={!message.trim() || remainingChars < 0}
//                         className="bg-gradient-to-r from-pink-500 to-purple-600 
//                           hover:from-pink-600 hover:to-purple-700 
//                           disabled:from-gray-400 disabled:to-gray-400 
//                           disabled:cursor-not-allowed 
//                           text-white font-semibold px-5 md:px-6 py-2.5 rounded-full
//                           transition-all duration-200 shadow-md text-sm md:text-base whitespace-nowrap font-sans"
//                         whileHover={{ scale: message.trim() ? 1.05 : 1 }}
//                         whileTap={{ scale: message.trim() ? 0.95 : 1 }}
//                       >
//                         Get Started
//                       </motion.button>
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Character Counter - Below input field to the right */}
//               <div className="flex justify-end mt-2 pr-4">
//                 <div className="text-sm font-medium text-gray-400 font-sans">
//                   {message.length}/{characterLimit}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   );
// };

// const HeroSection = ({ onStartChat }) => {
//   const [message, setMessage] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const navigate = useNavigate();
//   const characterLimit = 4608;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const trimmed = message.trim();
//     if (trimmed && trimmed.length <= characterLimit) {
//       onStartChat?.(trimmed);
//       setMessage("");
//     }
//   };

//   const handleTopicClick = (topic) => {
//     if (onStartChat) onStartChat(topic);
//   };

//   const handleMicClick = () => {
//     navigate("/assistant");
//   };

//   const remainingChars = characterLimit - message.length;

//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   const float = {
//     animate: {
//       y: [0, -4, 0],
//       transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
//     },
//   };

//   const suggestedTopics = ["Fatigue & Energy", "Weight Management", "Hair & Skin", "Hormones"];

//   return (
//     <motion.section
//       className="flex flex-col w-full min-h-screen bg-[#FFF7F2] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-16 md:pt-20 pb-16"
//       initial="hidden"
//       animate="show"
//       transition={{ staggerChildren: 0.15 }}
//     >
//       <div className="max-w-6xl mx-auto w-full">
//         {/* -------- Trust badges row (small + subtle, like Figma) -------- */}
//         <motion.div
//           variants={fadeUp}
//           className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs text-gray-500 mb-8 md:mb-10"
//         >
//           <motion.div variants={float} className="flex items-center gap-2">
//             <span className="inline-flex h-6 px-3 items-center rounded-full border border-gray-200 bg-white shadow-sm text-[10px] md:text-xs font-medium text-gray-700">
//               256-bit encryption
//             </span>
//           </motion.div>

//           <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-1">
//             <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
//             <span className="text-[10px] md:text-xs text-gray-600">Trusted by thousands</span>
//           </motion.div>

//           <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-1">
//             <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gray-900 flex items-center justify-center">
//               <Plus className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" strokeWidth={3} />
//             </div>
//             <span className="text-[10px] md:text-xs text-gray-600">Instant AI answers</span>
//           </motion.div>
//         </motion.div>

//         {/* -------- Center column like the Figma hero -------- */}
//         <div className="max-w-3xl mx-auto">
//           <div className="space-y-8">
//             {/* -------- Avatar + Heading + caption -------- */}
//             <motion.div variants={fadeUp} className="flex flex-col gap-4">
//               {/* avatar + title row */}
//               <div className="flex items-center gap-3 md:gap-4">
//                 <img
//                   src={Nurse}
//                   alt="Cira"
//                   className="w-12 h-12 md:w-14 md:h-14 rounded-full object-contain flex-shrink-0"
//                 />

//                 {/* main heading – Lora 48 / gradient “Cira” */}
//                 <h1 className="text-[26px] md:text-[40px] lg:text-[48px] leading-tight font-serif font-normal text-gray-900 tracking-[0.02em] flex flex-wrap items-center gap-2">
//                   <span>Hi, I’m</span>
//                   <span
//                     className="relative inline-block bg-gradient-to-r from-[#DC2B8E] to-[#AC3893] bg-clip-text text-transparent"
//                   >
//                     Ci
//                     <span className="relative inline-block">
//                       r
//                       {/* BETA badge stays the same */}
//                       <span className="absolute -top-6 left-1/2 -translate-x-1/2">
//                         <span className="group relative">
//                           <span className="bg-[#DC2B8E] text-white text-[9px] px-2 py-[2px] rounded-full cursor-pointer shadow-md">
//                             BETA
//                           </span>
//                           <span
//                             className="absolute top-7 left-1/2 -translate-x-1/2 
//                               hidden group-hover:block bg-black text-white text-[11px]
//                               px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-20"
//                           >
//                             This version is for testing only. Features may change.
//                           </span>
//                         </span>
//                       </span>
//                     </span>
//                     a
//                   </span>
//                   <span>, your AI Nurse</span>
//                 </h1>
//               </div>

//               {/* caption paragraph (lighter gray, slightly smaller like mock) */}
//               <p className="text-[13px] md:text-sm lg:text-base text-gray-600 max-w-2xl leading-relaxed pl-1">
//                 Your personal nurse in over 32 languages — always ready to listen.
//                 Cira understands how you feel, helps you explain your symptoms clearly,
//                 and supports your health journey with kindness, intelligence, and privacy-first care.
//               </p>
//             </motion.div>

//             {/* -------- sub heading -------- */}
//             <motion.div
//               variants={fadeUp}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } }}
//             >
//               <p className="text-sm md:text-base lg:text-[17px] text-gray-800 font-semibold -mt-2">
//                 What can I help you with today?
//               </p>
//             </motion.div>

//             {/* -------- suggested topics (flat white pills) -------- */}
//             <motion.div
//               variants={fadeUp}
//               className="flex flex-wrap gap-2 mb-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 } }}
//             >
//               {suggestedTopics.map((topic, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => handleTopicClick(topic)}
//                   className="px-4 py-1.5 md:px-5 md:py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-[11px] md:text-xs font-medium text-gray-800 transition-all duration-200"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.96 }}
//                 >
//                   {topic}
//                 </motion.button>
//               ))}
//             </motion.div>

//             {/* -------- chat input card, like Figma -------- */}
//             <motion.div variants={fadeUp} className="w-full mb-10">
//               <div
//                 className={`relative bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${
//                   isFocused ? "border-[#AC3893] shadow-lg" : "border-gray-200 shadow-sm"
//                 }`}
//               >
//                 <form onSubmit={handleSubmit} className="relative">
//                   <div className="relative w-full">
//                     <textarea
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       onFocus={() => setIsFocused(true)}
//                       onBlur={() => setIsFocused(false)}
//                       placeholder="Ask me anything about your health…"
//                       className="w-full min-h-[110px] pl-6 pr-44 pt-4 pb-16 text-[15px] md:text-[16px] bg-white rounded-[2.5rem] focus:outline-none border-0 placeholder:text-gray-400 text-start resize-none font-sans"
//                       maxLength={characterLimit}
//                     />

//                     {/* mic button – small pink circle on left */}
//                     <button
//                       type="button"
//                       onClick={handleMicClick}
//                       className="absolute bottom-4 left-5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FCE3F3] hover:bg-[#F7D4EE] flex items-center justify-center transition-colors duration-200"
//                     >
//                       <img src={mic} alt="mic" className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                     </button>

//                     {/* Get Started button – gradient from figma */}
//                     <div className="absolute bottom-4 right-4">
//                       <motion.button
//                         type="submit"
//                         disabled={!message.trim() || remainingChars < 0}
//                         className="bg-gradient-to-r from-[#DC2B8E] to-[#AC3893]
//                           hover:from-[#E53596] hover:to-[#B03A9A]
//                           disabled:from-gray-300 disabled:to-gray-300
//                           disabled:cursor-not-allowed
//                           text-white font-semibold px-6 md:px-7 py-2.5 rounded-full
//                           text-sm md:text-[15px] shadow-md whitespace-nowrap"
//                         whileHover={{ scale: message.trim() ? 1.05 : 1 }}
//                         whileTap={{ scale: message.trim() ? 0.95 : 1 }}
//                       >
//                         Get Started
//                       </motion.button>
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* character counter – tiny, tight like figma */}
//               <div className="flex justify-end mt-2 pr-4">
//                 <div className="text-[11px] md:text-xs font-medium text-gray-400 font-sans">
//                   {message.length}/{characterLimit}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   );
// };


const HeroSection = ({ onStartChat }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const characterLimit = 4608;

  const submitMessage = () => {
    const trimmed = message.trim();
    if (trimmed && trimmed.length <= characterLimit) {
      onStartChat?.(trimmed);
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e) => {
    // ENTER = send, SHIFT+ENTER = new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleTopicClick = (topic) => {
    if (onStartChat) onStartChat(topic);
  };

  const handleMicClick = () => {
    navigate("/assistant");
  };

  const remainingChars = characterLimit - message.length;

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const float = {
    animate: {
      y: [0, -4, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  };

  const suggestedTopics = ["Fatigue & Energy", "Weight Management", "Hair & Skin", "Hormones"];

  return (
    <motion.section
      className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-24 pb-20 md:pb-32 w-full min-h-screen"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Trust Badges */}
        <motion.div 
          variants={fadeUp} 
          className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs text-gray-500 mb-8 md:mb-10"
        >
            <motion.div variants={float} className="flex items-center gap-1 text-gray-600">

              <span className="text-[10px] md:text-[12px]"><strong className="font-bold">100%</strong>-Secure</span>
            </motion.div>

          <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-1 text-gray-600">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Trusted by thousands</span>
          </motion.div>

          <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-1 text-gray-600">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gray-900 flex items-center justify-center">
              <Plus className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" strokeWidth={3} />
            </div>
            <span>Instant AI answers</span>
          </motion.div>
        </motion.div>

        {/* Centered Column */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Avatar + Heading + Caption */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 md:gap-4">
              <img 
                src={Nurse} 
                alt="Cira" 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-contain flex-shrink-0"
                />

                {/* 👇 Heading like your Figma – Lora + gradient “Cira” + BETA */}
                <h1 className="text-[26px] md:text-[40px] lg:text-[48px] leading-tight font-serif font-normal text-[#111827] tracking-[0.02em] flex flex-wrap items-center gap-2">
                  <span>Hi, I’m</span>
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#DC2B8E] to-[#AC3893] bg-clip-text text-transparent">
                      Ci
                      <span className="relative text-[#DC2B8E] inline-block">
                        r
                        {/* BETA badge fixed */}
                        <span className="absolute -top-8 left-5 -translate-x-1/2">
                          <span className="group relative">
                            <span className="bg-[#DC2B8E] text-white text-[9px] px-2 py-[2px] rounded-full cursor-pointer shadow-md">
                              BETA
                            </span>
                            <span
                              className="absolute top-0 left-48 -translate-x-1/2 
                                hidden group-hover:block bg-black text-white text-[11px]
                                px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-20"
                            >
                              This version is for testing only. Features may change.
                            </span>
                          </span>
                        </span>
                      </span>
                      a
                    </span>
                  </span>
                  <span>, your AI Nurse</span>
              </h1>
              </div>

              <p className="text-[13px] md:text-sm lg:text-base text-gray-600 max-w-2xl leading-relaxed pl-1">
                Your personal nurse in over 32 languages — always ready to listen.
                Cira understands how you feel, helps you explain your symptoms clearly,
                and supports your health journey with kindness, intelligence, and privacy-first care.
              </p>
            </motion.div>

            {/* Sub-heading */}
            <motion.div
              variants={fadeUp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } }}
            >
              <p className="text-sm md:text-base lg:text-[17px] text-gray-800 font-semibold -mt-2">
                What can I help you with today?
              </p>
            </motion.div>

            {/* Topics */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 } }}
            >
              {suggestedTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="px-4 py-1.5 md:px-5 md:py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] md:text-xs font-medium text-gray-800 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {topic}
                </motion.button>
              ))}
            </motion.div>

            {/* Chat Input */}
            <motion.div variants={fadeUp} className="w-full mb-10">
              <div
                className={`relative bg-white rounded-4xl border transition-all duration-300 overflow-hidden ${
                  isFocused ? "border-gray-800 shadow-lg" : "border-gray-200 shadow-sm"
                }`}
              >
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative w-full">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={handleKeyDown}   // 👈 ENTER = submit
                      placeholder="Ask me anything about your health…"
                      className="w-full min-h-[110px] pl-6 pr-44 pt-4 pb-16 text-[15px] md:text-[16px] bg-white rounded-full focus:outline-none border-0 placeholder:text-gray-400 text-start resize-none font-sans"
                      maxLength={characterLimit}
                    />

                    {/* Mic button */}
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="absolute bottom-4 left-5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FCE3F3] hover:bg-[#F7D4EE] flex items-center justify-center transition-colors duration-200"
                    >
                      <img src={mic} alt="mic" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>

                    {/* Get Started button */}
                    <div className="absolute bottom-4 right-4">
                      <motion.button
                        type="submit"
                        disabled={!message.trim() || remainingChars < 0}
                        className="bg-gradient-to-r from-[#DC2B8E] to-[#AC3893]
                          hover:from-[#E53596] hover:to-[#B03A9A]
                          disabled:from-gray-300 disabled:to-gray-300
                          disabled:cursor-not-allowed 
                          text-white font-semibold px-6 md:px-7 py-2.5 rounded-full
                          text-sm md:text-[15px] shadow-md whitespace-nowrap"
                        whileHover={{ scale: message.trim() ? 1.05 : 1 }}
                        whileTap={{ scale: message.trim() ? 0.95 : 1 }}
                      >
                        Get Started
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex justify-end mt-2 pr-4">
                <div className="text-[11px] md:text-xs font-medium text-gray-400 font-sans">
                  {message.length}/{characterLimit}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};



// "Cira listens like a friend" Section

// import { motion } from "framer-motion";
// import FriendlyNurse from "PATH/TO/FriendlyNurse.png";

const FriendlySection = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12 px-4 md:py-20 md:px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-5xl lg:text-6xl font-serif font-normal text-gray-950 leading-tight"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
            Cira listens like a friend,<br />
          <span className="text-gray-950">explains like a nurse.</span>
        </motion.h2>

        {/* Main subtext */}
        {/* <motion.p
          className="mt-6 md:mt-8 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Speak naturally, and I&apos;ll break down health topics, medications, and
          lifestyle choices in a way that actually makes sense — so you&apos;re never
          left guessing about your health again.
        </motion.p> */}

        {/* Improvement / learning line */}
        <motion.p
          className="mt-6 md:mt-4 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        >
          With every update and interaction, Cira&apos;s understanding grows — her
          guidance becomes clearer, more precise, and more personalized day by day.
        </motion.p>
      </div>

      {/* Avatar + Listening Indicator */}
        <motion.div
        className="flex flex-col items-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <img
          src={FriendlyNurse}
          alt="Friendly nurse assistant illustration"
          className="w-[90%] md:w-[50%]"
        />
        </motion.div>
    </section>
  );
};

// export default FriendlySection;



// const FriendlySection = () => {
//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     show: { opacity: 1, y: 0 },
//   };

//   return (
//     <section className="py-12 px-4 md:py-20 md:px-6">
//       <div className="max-w-5xl mx-auto text-center">

//         {/* Headline */}
//         <motion.h2
//           className="text-2xl md:text-5xl lg:text-6xl font-serif font-normal text-gray-950 leading-tight"
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//         >
//           Cira listens like a friend,<br />
//           <span className="text-gray-950">explains like a Nurse.</span>
//         </motion.h2>

//         {/* Subtext */}
//         <motion.p
//           className="mt-6 md:mt-8 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
//         >
//           Speak naturally, and I'll break down health topics, medications, and lifestyle
//           choices in a way that actually makes sense so you're never left guessing
//           about your health again.
//         </motion.p>
//       </div>

//       {/* Avatar + Listening Indicator */}
//       <motion.div
//         className="flex flex-col items-center mt-8 md:mt-12"
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
//       >
//         <img src={FriendlyNurse} alt="FriendlyNurse" className="w-[90%] md:w-[50%]" />
//       </motion.div>
//     </section>
//   );
// };

// Doctor Connection / Pricing Section
const DoctorConnectionSection = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-8 px-4 md:py-10 md:px-6 min-h-[90vh] flex items-center bg-[#FFF5F5]">
      <div className="max-w-4xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-serif font-normal text-gray-950 tracking-tight leading-tight px-2 md:px-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            When we're done chatting, I can<br />
            connect you to a human doctor for<br />
          <span className="text-pink-400">just £49</span>
        </motion.h2>

        {/* 24/7 Badge */}
        <motion.button
          className="mt-6 md:mt-10 inline-flex items-center text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-gray-100 text-xs md:text-sm font-medium px-4 py-1.5 md:px-8 md:py-4 rounded-full transition-all duration-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Appointments available instantly, 24/7
        </motion.button>

        {/* Description */}
        <motion.p
          className="mt-6 md:mt-10 text-sm md:text-md text-gray-500 max-w-xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
            If you want, you can book a follow up with one of our doctors to get your
            prescriptions, talk about our AI findings, confirm a diagnosis, or get specialist
            help, all from the comfort of your phone.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          className="mt-10 md:mt-16 flex flex-col gap-4 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 max-w-lg w-full space-y-3 md:space-y-4">
            <ul className="space-y-4 md:space-y-6 text-left">
              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">Private GP and Specialist Doctors</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">Experienced. Skilled. Trustworthy.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">Full service care</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">Prescriptions, referrals & treatment</p>
                </div>
              </li>

              <li className="flex items-start gap-3 md:gap-4">
                <div className="mt-1">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm md:text-base">No insurance needed</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">All notes available in The Wellness</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Privacy & Security Section
const PrivacySection = () => {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-12 px-4 md:py-24 md:px-6">
      <div className="max-w-4xl mx-auto text-center">

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-normal font-serif text-gray-950 leading-tight px-2 md:px-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            Don't worry, everything is private,<br />
            GDPR secure, and your data is<br />
          <span className="text-pink-400">yours</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="mt-6 md:mt-10 text-sm md:text-md text-gray-400 max-w-3xl mx-auto leading-relaxed px-2 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
            Every conversation, diagnosis, and health detail is encrypted and stored securely. 
            I never use your chat data for AI training and only share data with your doctor 
            if you want me to.
        </motion.p>

        {/* Trust Icons Row */}
        <motion.div
          className="mt-10 md:mt-16 flex flex-col sm:flex-row gap-6 md:gap-10 justify-center items-center text-gray-700"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Each Icon */}
          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <Lock className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
            </div>
            <p className="font-medium text-sm md:text-base">256-bit Encryption</p>
          </motion.div>

          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-teal-600" />
            </div>
            <p className="font-medium text-sm md:text-base">GDPR Compliant</p>
          </motion.div>

          <motion.div className="flex flex-col items-center" variants={item}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />
            </div>
            <p className="font-medium text-sm md:text-base">You Own Your Data</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const ModernFooter = () => {
  const container = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const iconHover = { scale: 1.2, transition: { duration: 0.2, ease: 'easeOut' } };

  return (
    <motion.footer
      className="py-8 px-4 md:py-16 md:px-6 border-t border-gray-100"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-5xl mx-auto text-center">

        {/* Logo + Name */}
        <motion.div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8" variants={container}>
          <div className="flex-shrink-0 flex items-center gap-2">
            <img src={Stars} alt="stars logo" className="w-[20%] md:w-[25%]"/>           
            <p className="text-lg md:text-xl font-semibold text-gray-900">Cira</p>
              </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-10" variants={container}>
                  <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Facebook className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6" />
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Twitter className="w-5 h-5 md:w-6 md:h-6" />
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-600 hover:text-purple-600 transition"
            whileHover={iconHover}
          >
            <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
          </motion.a>
        </motion.div>

        {/* Copyright */}
        <motion.p
          className="text-xs md:text-sm text-gray-500"
          variants={container}
        >
          © 2025 Cira. All rights reserved
        </motion.p>
          </div>
    </motion.footer>
  );
};

// Main Landing Page Component
const NewHome = () => {
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const handleStartChat = (message) => {
    setInitialMessage(message);
    setShowChat(true);
  };

  useEffect(() => {
    if (showChat) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showChat]);

  return (
    <div className="min-h-screen bg-[#FFFEF9] font-sans antialiased">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:z-0">
        <Header />
      </div>

      {/* Landing Content */}
      {!showChat && (
        <div className="w-full">
          <HeroSection onStartChat={handleStartChat} />
          <FriendlySection />
          <DoctorConnectionSection />
          <PrivacySection />
          <ModernFooter />
        </div>
      )}

      {/* Full-Screen Chat */}
      {showChat && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-[#FFFEF9] overflow-y-auto">
          <CiraChatAssistant initialMessage={initialMessage} />
        </div>
      )}
    </div>
  );
};

export default NewHome;


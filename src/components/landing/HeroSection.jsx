// // import React, { useState } from 'react';
// // import { Lock, Users, Zap, Bot, Shield } from 'lucide-react';
// // import ChatInput from './ChatInput';
// // import NurseAvatar from '../../assistant/nurseAvatar/NurseAvatar';
// // import { Canvas } from '@react-three/fiber';
// // import { OrbitControls } from '@react-three/drei';
// // import { motion } from 'framer-motion';
// // import Nurse from '../../assets/nurse.png'

// // export default function HeroSection({ onStartChat }) {
// //   const [chatHistory, setChatHistory] = useState([]);

// //   const handleSendMessage = (msg) => {
// //     if (onStartChat) {
// //       onStartChat(msg); // 🔹 tells LandingPage to show CiraChatAssistant
// //     }
// //   };

// //   // Shared fade-up + scale animation
// //   const fadeUp = {
// //     hidden: { opacity: 0, y: 40, scale: 0.95 },
// //     show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
// //   };

// //   // Floating animation for trust badges
// //   const float = {
// //     animate: {
// //       y: [0, -5, 0],
// //       transition: { duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
// //     },
// //   };

// //   return (
// //     <motion.section
// //       className="min-h-screen flex flex-col px-4 md:px-6"
// //       initial="hidden"
// //       animate="show"
// //       transition={{ staggerChildren: 0.15 }}
// //     >
// //       {/* Avatar */}
// //       <motion.div variants={fadeUp} className='flex items-center justify-center'>
// //         <img src={Nurse} alt="" className='w-[15%] md:w-[10%] ml-0 md:ml-10 items-center mb-2 md:mb-2 lg:mb-5' />
// //       </motion.div>

// //       {/* Trust Badges */}
// //       <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 md:gap-6 text-[8px] md:text-[9px] text-gray-600 mb-6 md:mb-8 ">
// //         <motion.div variants={float} className="flex items-center gap-1 text-black">
// //           <Shield className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] fill-current" />
// //           <div className="flex flex-row text-[10px] md:text-[12px]">
// //             <strong>100%</strong>
// //             <p>-Secure</p>
// //           </div>
// //         </motion.div>
// //         <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-1 text-black">
// //           <Users className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] fill-current" />
// //           <span className="text-[10px] md:text-[12px]">Trusted by thousands</span>
// //         </motion.div>
// //         <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-1 text-black">
// //           <Zap className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] fill-current" />
// //           <span className="text-[10px] md:text-[12px]">Instant AI answers</span>
// //         </motion.div>
// //       </motion.div>

// //       {/* Text Block */}
// //       <motion.div variants={fadeUp} className="w-full max-w-3xl px-0 md:px-12 md:pl-28 lg:pl-25">
// //         <h1 className="text-2xl md:text-5xl  font-serif font-normal text-gray-950 mb-4 md:mb-6 tracking-wide text-left">
// //           Hi, I'm <span className="text-pink-400">Cira</span>, your AI Nurse
// //         </h1>



// //         <motion.div
// //           className="text-left space-y-1 md:space-y-2 text-gray-800 text-sm md:text-md mb-4 md:mb-5 [word-spacing:1px]"
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.2 } }}
// //         >
// //           <p className="text-[12px] md:text-[15px] leading-relaxed">I'm your private and personal wellness <strong>Nurse</strong>.</p>
// //           <p className="text-[12px] md:text-[15px] leading-relaxed">As an <strong>AI Nurse</strong>, my service is fast and free.I've already helped <strong>thousands of people!</strong></p>
// //           <p className="text-[12px] md:text-[15px] leading-relaxed">After we chat, if you want you can book a consultation with our experienced doctors for only <strong>£49</strong>.</p>
// //         </motion.div>
// //       </motion.div>

// //       {/* Chat Input */}
// //       <motion.div variants={fadeUp} className="w-full md:max-w-[88%] pl-0 md:pl-25">
// //         <ChatInput onSendMessage={handleSendMessage} />
// //       </motion.div>

// //       {/* Chat History */}
// //       {chatHistory.length > 0 && (
// //         <motion.div
// //           variants={fadeUp}
// //           className="mt-8 w-full max-w-4xl max-h-64 overflow-y-auto space-y-4"
// //         >
// //           {chatHistory.map((chat, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 20, scale: 0.95 }}
// //               animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
// //               className={`p-4 rounded-2xl ${chat.type === 'user' ? 'bg-purple-100 text-purple-900 ml-8' : 'bg-gray-100 text-gray-900 mr-8'}`}
// //             >
// //               <div className="flex items-start gap-3">
// //                 {chat.type === 'ai' && <Bot className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />}
// //                 <p>{chat.message}</p>
// //                 {chat.type === 'user' && (
// //                   <div className="w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
// //                     <span className="text-white text-xs">You</span>
// //                   </div>
// //                 )}
// //               </div>
// //             </motion.div>
// //           ))}
// //         </motion.div>
// //       )}
// //     </motion.section>
// //   );
// // }

// // File: src/components/landing/HeroSection.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Users, Plus } from "lucide-react";
// import Nurse from "../../assets/nurse.png";
// import mic from "../../assets/mice.svg";

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
//       className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-32 pb-20 md:pb-32 w-full min-h-screen"
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
//             {/* Heading with Small Avatar and caption */}
//             <motion.div variants={fadeUp} className="flex flex-col gap-4">
//               {/* Avatar + Title Row */}
//               <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
//                 <img
//                   src={Nurse}
//                   alt="Cira"
//                   className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-contain flex-shrink-0"
//                 />
//                 <div className="relative">
//                   <h1 className="text-xl xs:text-2xl sm:text-2xl md:text-5xl  font-serif font-normal text-gray-950 tracking-wide flex flex-wrap items-center gap-1 sm:gap-2">
//                     Hi, I'm{" "}
//                     <span className="text-pink-400 relative inline-flex items-center whitespace-nowrap">
//                       Ci
//                       <span className="relative inline-flex items-center">
//                         r
//                         {/* BETA Badge - Positioned for different screen sizes */}
//                         <span className="absolute -top-5 -right-5 xs:-top-6 xs:-right-6 sm:-top-7 sm:-right-8 md:-top-8 md:-right-10">
//                           <span className="group relative inline-block">
//                             <span className="inline-block  text-blue-700 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] px-2 py-[2px] rounded-md font-sans font-semibold tracking-wide cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap">
//                               BETA
//                             </span>

//                             {/* Tooltip - Responsive positioning */}
//                             <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
//                 hidden group-hover:block 
//                 bg-gray-900 text-white text-xs xs:text-xs sm:text-sm px-3 py-2 rounded-lg 
//                 whitespace-nowrap shadow-xl z-50
//                 max-w-[200px] xs:max-w-[250px] sm:max-w-none
//                 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900">
//                               This version is for testing only. Features may change.
//                             </span>
//                           </span>
//                         </span>
//                       </span>
//                       a
//                     </span>
//                     , your AI Nurse
//                   </h1>


//                 </div>
//               </div>

//             </motion.div>

//             {/* Sub-heading */}
//             <motion.div
//               variants={fadeUp}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.2 } }}
//             >
//               <p className="text-[15px] md:text-[18px] text-gray-800 font-bold ">
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
//             {/* Chat Input */}
//             <motion.div variants={fadeUp} className="w-full !mb-11">
//               <div
//                 className={`relative bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${isFocused ? "border-gray-800 shadow-md" : "border-gray-200 shadow-sm"
//                   }`}
//               >
//                 <form onSubmit={handleSubmit} className="relative">
//                   <div className="relative w-full">
//                     <textarea
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       onFocus={() => setIsFocused(true)}
//                       onBlur={() => setIsFocused(false)}
//                       placeholder="Ask me anything about your health..."
//                       className="
//             w-full 
//             min-h-[96px] md:min-h-[112px]
//             pl-4 pr-32 pt-3 pb-16
//             md:pl-6 md:pr-40 md:pt-4 md:pb-20
//             bg-white rounded-[2.5rem] border-0
//             focus:outline-none resize-none text-start
//             font-sans
//             text-base md:text-lg
//             placeholder:text-[15px] md:placeholder:text-[19px]
//             placeholder:text-gray-800 placeholder:font-light
//           "
//                       maxLength={characterLimit}
//                     />

//                     {/* Mic button on the left */}
//                     <button
//                       type="button"
//                       onClick={handleMicClick}
//                       className="absolute bottom-3 left-4 md:left-5 p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-500 hover:text-pink-600 transition-all duration-200"
//                     >
//                       <img src={mic} alt="mic" className="w-5 h-5" />
//                     </button>

//                     {/* Get Started button */}
//                     <div className="absolute bottom-3 right-3">
//                       <motion.button
//                         type="submit"
//                         disabled={!message.trim() || remainingChars < 0}
//                         className="
//               bg-gradient-to-r from-pink-500 to-purple-600 
//               hover:from-pink-600 hover:to-purple-700 
//               disabled:from-gray-400 disabled:to-gray-400 
//               disabled:cursor-not-allowed 
//               text-white font-semibold 
//               px-4 md:px-6 py-2.5 
//               rounded-full shadow-md 
//               text-sm md:text-base 
//               whitespace-nowrap font-sans
//             "
//                         whileHover={{ scale: message.trim() ? 1.05 : 1 }}
//                         whileTap={{ scale: message.trim() ? 0.95 : 1 }}
//                       >
//                         Get Started
//                       </motion.button>
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Character Counter + Disclaimer */}
//               <div
//                 className="
//       flex flex-col sm:flex-row 
//       sm:items-center sm:justify-between 
//       gap-1 sm:gap-0
//       mt-2 pr-2 sm:pr-4
//     "
//               >
//                 <div className="sm:max-w-xl text-[10px] sm:text-[11px] text-gray-500 leading-relaxed text-center sm:text-left">
//                   Cira is an AI nurse assistant, not a licensed medical professional, and does not
//                   provide medical diagnosis, treatment, or professional healthcare advice.
//                 </div>

//                 <div className="text-xs sm:text-sm font-medium text-gray-400 font-sans self-end sm:self-auto">
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

// export default HeroSection;



import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Plus } from "lucide-react";
import Nurse from "../../assets/nurse.png";
import mic from "../../assets/mice.svg";

const HeroSection = ({ onStartChat }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const characterLimit = 4608;
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && trimmed.length <= characterLimit) {
      onStartChat?.(trimmed);
      setMessage("");
    }
  };

  // 🔹 When clicking a suggested topic, just pre-fill the textarea
  const handleTopicClick = (prompt) => {
    setMessage(prompt);
    // focus input so user can edit if they want
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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
      y: [0, -5, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
    },
  };

  // 🔹 Suggested topics with full phrases
const suggestedTopics = [
  {
    label: "Fatigue & Energy",
    prompt: "I'm feeling very tired and low on energy.",
  },
  {
    label: "Weight Management",
    prompt: "I'm worried about my weight.",
  },
  {
    label: "Hair & Skin",
    prompt: "I'm noticing changes in my hair and skin.",
  },
  {
    label: "Hormones",
    prompt: "I think my hormones might be out of balance.",
  },
];


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
          className="flex flex-wrap justify-center gap-3 md:gap-6 text-[8px] md:text-[9px] text-gray-600 mb-7 md:mb-9"
        >
          <motion.div variants={float} className="flex items-center gap-3 text-black">
            <div className="flex flex-row text-[10px] md:text-[12px]">
              <strong>100%</strong>
              <p>-Secure</p>
            </div>
          </motion.div>
          <motion.div
            variants={float}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-1 text-black"
          >
            <Users className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] fill-current text-black" />
            <span className="text-[10px] md:text-[12px]">Trusted by thousands</span>
          </motion.div>
          <motion.div
            variants={float}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 text-black"
          >
            <div className="w-[10px] h-[10px] md:w-[13px] md:h-[13px] rounded-full bg-black flex items-center justify-center">
              <Plus className="w-[6px] h-[6px] md:w-[8px] md:h-[8px] text-white" strokeWidth={3} />
            </div>
            <span className="text-[10px] md:text-[12px]">Instant AI answers</span>
          </motion.div>
        </motion.div>

        {/* Centered Column */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Heading + avatar */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <img
                  src={Nurse}
                  alt="Cira"
                  className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-contain flex-shrink-0"
                />
                <div className="relative">
                  <h1 className="text-xl xs:text-2xl sm:text-2xl md:text-5xl  font-serif font-normal text-gray-950 tracking-wide flex flex-wrap items-center gap-1 sm:gap-2">
                    Hi, I'm{" "}
                    <span className="text-pink-400 relative inline-flex items-center whitespace-nowrap">
                      Ci
                      <span className="relative inline-flex items-center">
                        r
                        {/* BETA badge */}
                        <span className="absolute -top-5 -right-5 xs:-top-6 xs:-right-6 sm:-top-7 sm:-right-8 md:-top-8 md:-right-10">
                          <span className="group relative inline-block">
                            <span className="inline-block  text-blue-700 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] px-2 py-[2px] rounded-md font-sans font-semibold tracking-wide cursor-pointer hover:bg-blue-100 transition-colors whitespace-nowrap">
                              BETA
                            </span>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                hidden group-hover:block 
                bg-gray-900 text-white text-xs xs:text-xs sm:text-sm px-3 py-2 rounded-lg 
                whitespace-nowrap shadow-xl z-50
                max-w-[200px] xs:max-w-[250px] sm:max-w-none
                before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900">
                              This version is for testing only. Features may change.
                            </span>
                          </span>
                        </span>
                      </span>
                      a
                    </span>
                    , your AI Nurse
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Sub-heading */}
            <motion.div
              variants={fadeUp}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
              }}
            >
              <p className="text-[15px] md:text-[18px] text-gray-800 font-bold ">
                What can I help you with today?
              </p>
            </motion.div>

            {/* Suggested Topics */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-2 mb-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 },
              }}
            >
              {suggestedTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTopicClick(topic.prompt)}
                  className="px-4 py-2 md:px-5 md:py-2.5 bg-white hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-800 text-xs md:text-sm font-semibold transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {topic.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Chat Input */}
            <motion.div variants={fadeUp} className="w-full !mb-11">
              <div
                className={`relative bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${
                  isFocused ? "border-gray-800 shadow-md" : "border-gray-200 shadow-sm"
                }`}
              >
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative w-full">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Ask me anything about your health..."
                      className="
                        w-full 
                        min-h-[96px] md:min-h-[112px]
                        pl-4 pr-32 pt-3 pb-16
                        md:pl-6 md:pr-40 md:pt-4 md:pb-20
                        bg-white rounded-[2.5rem] border-0
                        focus:outline-none resize-none text-start
                        font-sans
                        text-base md:text-lg
                        placeholder:text-[15px] md:placeholder:text-[19px]
                        placeholder:text-gray-800 placeholder:font-light
                      "
                      maxLength={characterLimit}
                    />

                    {/* Mic button */}
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="absolute bottom-3 left-4 md:left-5 p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-500 hover:text-pink-600 transition-all duration-200"
                    >
                      <img src={mic} alt="mic" className="w-5 h-5" />
                    </button>

                    {/* Get Started */}
                    <div className="absolute bottom-3 right-3">
                      <motion.button
                        type="submit"
                        disabled={!message.trim() || remainingChars < 0}
                        className="
                          bg-gradient-to-r from-pink-500 to-purple-600 
                          hover:from-pink-600 hover:to-purple-700 
                          disabled:from-gray-400 disabled:to-gray-400 
                          disabled:cursor-not-allowed 
                          text-white font-semibold 
                          px-4 md:px-6 py-2.5 
                          rounded-full shadow-md 
                          text-sm md:text-base 
                          whitespace-nowrap font-sans
                        "
                        whileHover={{ scale: message.trim() ? 1.05 : 1 }}
                        whileTap={{ scale: message.trim() ? 0.95 : 1 }}
                      >
                        Get Started
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Disclaimer + Counter */}
              <div
                className="
                  flex flex-col sm:flex-row 
                  sm:items-center sm:justify-between 
                  gap-1 sm:gap-0
                  mt-2 pr-2 sm:pr-4
                "
              >
                <div className="sm:max-w-xl text-[10px] sm:text-[11px] text-gray-500 leading-relaxed text-center sm:text-left">
                  Cira is an AI nurse assistant, not a licensed medical professional, and does not
                  provide medical diagnosis, treatment, or professional healthcare advice.
                </div>

                <div className="text-xs sm:text-sm font-medium text-gray-400 font-sans self-end sm:self-auto">
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

export default HeroSection;
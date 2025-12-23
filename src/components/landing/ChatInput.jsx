// import React, { useState } from "react";
// import { Mic, Send } from "lucide-react";
// import { motion } from "framer-motion";
// import mic from "../../assets/mice.svg";
// import { useNavigate } from "react-router-dom";

// const ChatInput = ({
//   onSendMessage,
//   characterLimit = 4608,
//   disabled = false,
//   label = "What can I help you with today?.",
//   placeholder = "Describe how you're feeling or what you're worried about...",
//   submitText = "Get Started",
// }) => {
//   const [message, setMessage] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (disabled) return;

//     const trimmed = message.trim();
//     if (trimmed && trimmed.length <= characterLimit) {
//       onSendMessage?.(trimmed);
//       setMessage("");
//     }
//   };

//   const remainingChars = characterLimit - message.length;
//   const isOverLimit = remainingChars < 0;
//   const isDisabled = disabled || isOverLimit;

//   const wrapperClass = (() => {
//     if (isDisabled) {
//       return "relative rounded-xl bg-white border border-gray-200 shadow-sm";
//     }

//     if (isFocused) {
//       return `
//         relative  rounded-xl 
//         border-[1.5px] border-gray-800 
//         shadow-md
//         overflow-hidden
//       `;
//     }

//     return "relative rounded-xl bg-white border border-gray-200 shadow-sm";
//   })();

//   const handleMicClick = () => {
//     if (disabled) return;
//     navigate("/assistant");
//   };

//   return (
//     <div className="w-full">
//       {label && (
//         <p className="text-[20px] text-gray-800 text-start mb-4  font-semibold">
//           {label}
//         </p>
//       )}

//       <motion.div
//         className={wrapperClass}
//         initial={{ opacity: 0.9 }}
//         animate={{ opacity: 1 }}
//       >
//         {/* FIX: inner layer prevents white corners */}
//         <div className="bg-white rounded-2xl w-full h-full p-0 overflow-hidden">

//           <form onSubmit={handleSubmit} className="relative">
//             <div className="relative w-full">

//               {message === "" && (
//                 <span className="absolute left-6 top-4 text-gray-400 text-md pointer-events-none">
//                   {placeholder}
//                 </span>
//               )}

//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//                 className="w-full h-28 px-6 pt-0 pb-14 pr-40 text-lg bg-transparent rounded-2xl focus:outline-none border-0 placeholder-gray-400 text-start"
//                 maxLength={characterLimit}
//                 disabled={disabled}
//               />

//               <button
//                 type="button"
//                 onClick={handleMicClick}
//                 className="absolute bottom-2 left-2 p-2 rounded-full text-gray-100 hover:bg-pink-200 transition-all duration-200"
//                 disabled={disabled}
//               >
//                 <span className=" text-black"><img src={mic} alt="mic" />Speak</span>

//               </button>

//               <motion.button
//                 type="submit"
//                 disabled={isDisabled || !message.trim()}
//                 className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 
//                   hover:from-purple-700 hover:to-pink-700 
//                   disabled:from-gray-400 disabled:to-gray-400 
//                   disabled:cursor-not-allowed 
//                   text-white font-semibold px-5 py-2 rounded-sm 
//                   transition-all duration-200 shadow-md text-sm whitespace-nowrap flex items-center gap-2 justify-center"
//                 whileHover={{ scale: isDisabled ? 1 : 1.05 }}
//                 whileTap={{ scale: isDisabled ? 1 : 0.95 }}
//               >
//                 <Send className="w-4 h-4" />
//                 {submitText && <span>{submitText}</span>}
//               </motion.button>
//             </div>
//           </form>

//         </div>
//       </motion.div>

//       <div className="flex justify-end mt-2">
//         <div
//           className={`text-sm font-medium ${remainingChars < 100 ? "text-red-500" : "text-gray-400"
//             }`}
//         >
//           {message.length} / {characterLimit}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;
import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import mic from "../../assets/mice.svg";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";

const ChatInput = ({
  onSendMessage,
  characterLimit = 4608,
  disabled = false,
  label = "What can I help you with today?.",
  placeholder = "Describe how you're feeling or what you're worried about...",
  submitText = "Get Started",
  showMic = true,   // 👈 control Speak visibility
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    const trimmed = message.trim();
    if (trimmed && trimmed.length <= characterLimit) {
      onSendMessage?.(trimmed);
      setMessage("");
    }
  };

  const remainingChars = characterLimit - message.length;
  const isOverLimit = remainingChars < 0;
  const isDisabled = disabled || isOverLimit;

  const wrapperClass = (() => {
    if (isDisabled) {
      return "relative rounded-xl bg-white border border-gray-200 shadow-sm";
    }

    if (isFocused) {
      return `
        relative rounded-xl 
        border-[1px] border-gray-800 
        shadow-md
        overflow-hidden
      `;
    }

    return "relative rounded-xl bg-white border border-gray-200 shadow-sm";
  })();

  const handleMicClick = () => {
    if (disabled) return;
    navigate("/assistant");
  };

  return (
    <div className="w-full">
      {label && (
        <p className="text-[15px] text-gray-800 text-start mb-4 font-semibold">
          {label}
        </p>
      )}

      <motion.div
        className={wrapperClass}
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-xl w-full h-full p-0 overflow-hidden">
          <form onSubmit={handleSubmit} className="relative">
          <div className="relative w-full">
  {message === "" && (
    <span className="absolute left-6 top-4 text-gray-400 text-xs md:text-sm lg:text-md pointer-events-none">
      {placeholder}
    </span>
  )}

  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    className="w-full h-28 pl-6 pr-44 pt-0 pb-14 text-lg bg-transparent rounded-2xl focus:outline-none border-0 placeholder-gray-400 text-start"
    maxLength={characterLimit}
    disabled={disabled}
  />

  {/* ✅ Character Counter inside input (bottom-left) */}
  <span
    className={`absolute bottom-2 left-6 text-xs font-medium ${
      remainingChars < 100 ? "text-red-500" : "text-gray-400"
    }`}
  >
    {message.length}/{characterLimit}
  </span>

              {/* 👈 Speak button on the left */}
              {showMic && (
                <Button
                  preset="speak"
                  type="button"
                  onClick={handleMicClick}
                  disabled={disabled}
                  icon={<img src={mic} alt="mic" className="w-4 h-4" />}
                >
                  Speak
                </Button>
              )}

              {/* 👉 Get Started / Send on the right */}
              <Button
                preset="send"
                type="submit"
                disabled={isDisabled || !message.trim()}
                icon={<Send className="w-4 h-4" />}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              >
                {submitText && <span>{submitText}</span>}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

  {/* Character Count */}

        <div className="max-w-2xl text-center text-[11px] text-gray-500 pl-1 pt-2 pb-2">
     Cira is an AI nurse assistant, not a licensed medical professional, and does not provide medical diagnosis, treatment, or professional healthcare advice.
  </div>

</div>

  );
};

export default ChatInput;

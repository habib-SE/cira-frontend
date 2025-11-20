import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChatInput = ({ onSendMessage, characterLimit = 4608 }) => {
  const [message, setMessage] = useState('');

   const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && message.length <= characterLimit) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleMicClick = () => {
 navigate('/assistant');
  };

  const remainingChars = characterLimit - message.length;

  return (
    <div className="w-full max-w-4xl">
      {/* Prompt text above input */}
      <p className="text-lg text-gray-800 text-cente mb-4 font-medium">
        What can I help you with today?
      </p>

      {/* Animated Gradient Border */}
      <motion.div
        className="relative p-0.5 rounded-md bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
        initial={{ opacity: 0.8 }}
        animate={{ 
          opacity: [0.8, 1, 0.8],
          background: [
            'linear-gradient(to right, #22d3ee, #a855f7, #ec4899)',
            'linear-gradient(to right, #ec4899, #22d3ee, #a855f7)',
            'linear-gradient(to right, #a855f7, #ec4899, #22d3ee)',
            'linear-gradient(to right, #22d3ee, #a855f7, #ec4899)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      >
     <form onSubmit={handleSubmit} className="relative">

  {/* Input Field */}
  <div className="relative w-full">
{message === '' && (
  <span className="absolute left-6 top-4 text-gray-400 text-md">
    Ask me anything about your health...
  </span>
)}
   <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  className="w-full h-28 px-6 pt-0 pb-14 pr-40 text-lg bg-white rounded-md focus:outline-none border-0 placeholder-gray-400 text-start"
  maxLength={characterLimit}
/>

    {/* MIC — Bottom Left Inside Input */}
    <button
      type="button"
      onClick={handleMicClick}
      className="absolute bottom-2 left-2 p-2 rounded-full bg-gray-800 text-gray-100 hover:bg-gray-600 transition-all duration-200"
    >
      <Mic className="w-5 h-5" />
    </button>

    {/* GET STARTED — Bottom Right Inside Input */}
    <motion.button
      type="submit"
      disabled={!message.trim() || message.length > characterLimit}
      className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 
        hover:from-purple-700 hover:to-pink-700 
        disabled:from-gray-400 disabled:to-gray-400 
        disabled:cursor-not-allowed 
        text-white font-semibold px-5 py-2 rounded-sm 
        transition-all duration-200 shadow-md text-sm whitespace-nowrap"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center gap-2">
        <Send className="w-4 h-4" />
        Get Started
      </span>
    </motion.button>
  </div>

</form>

      </motion.div>

      {/* Character Counter - Outside, bottom right corner */}
      <div className="flex justify-end mt-2">
        <div className={`text-sm font-medium ${
          remainingChars < 100 ? 'text-red-500' : 'text-gray-400'
        }`}>
          {message.length} / {characterLimit}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
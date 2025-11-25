import React, { useState } from 'react';
import { Lock, Users, Zap, Bot, Shield } from 'lucide-react';
import ChatInput from './ChatInput';
import NurseAvatar from '../../assistant/nurseAvatar/NurseAvatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Nurse from '../../assets/nurse.png'

export default function HeroSection({ onStartChat }) {
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = (msg) => {
    if (onStartChat) {
      onStartChat(msg); // 🔹 tells LandingPage to show CiraChatAssistant
    }
  };

  // Shared fade-up + scale animation
  const fadeUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  // Floating animation for trust badges
  const float = {
    animate: {
      y: [0, -5, 0],
      transition: { duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
    },
  };

  return (
    <motion.section
      className="min-h-screen bg-[#FFFEF9] flex flex-col px-6 py-6"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.15 }}
    >
      {/* Avatar */}
      <motion.div  variants={fadeUp} className='flex items-center justify-center'>
      <img src={Nurse} alt="" className='w-[20%] md:w-[10%] ml-3 md:ml-10 items-center mb-7 md:mb-4 lg:mb-0'/>
      </motion.div>

      {/* Trust Badges */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-[12px] text-gray-600 mb-8 -mt-4">
        <motion.div variants={float} className="flex items-center gap-1 text-black">
          <Shield className="w-3 fill-current" />
          <div className="flex flex-row">
            <strong>256</strong>
            <p>-bit encryption</p>
          </div>
        </motion.div>
        <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-1 text-black">
          <Users className="w-3 fill-current" />
          <span>Trusted by thousands</span>
        </motion.div>
        <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-1 text-black">
          <Zap className="w-3 fill-current" />
          <span>Instant AI answers</span>
        </motion.div>
      </motion.div>

      {/* Text Block */}
      <motion.div variants={fadeUp} className="w-full max-w-4xl px-12 pl-0 md:pl-28 lg:pl-25">
<h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-950 mb-6 tracking-wide text-left">
  Hi, I'm <span className="text-pink-400">Cira</span>, your AI Nurse
</h1>



        <motion.div
          className="text-left space-y-4 text-gray-800 text-md mb-5 [word-spacing:1px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.2 } }}
        >
          <p>I'm your private and personal wellness <strong>Nurse</strong>.</p>
          <p>As an <strong>AI Nurse</strong>, my service is fast and free.I've already helped <strong>thousands of people!</strong></p>
          <p>After we chat, if you want you can book a consultation with our experienced doctors for only <strong>£49</strong>.</p>
        </motion.div>
      </motion.div>

      {/* Chat Input */}
      <motion.div variants={fadeUp} className="w-full  md:max-w-[92%] pl-3 md:pl-25">
        <ChatInput onSendMessage={handleSendMessage} />
      </motion.div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="mt-8 w-full max-w-4xl max-h-64 overflow-y-auto space-y-4"
        >
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
              className={`p-4 rounded-2xl ${chat.type === 'user' ? 'bg-purple-100 text-purple-900 ml-8' : 'bg-gray-100 text-gray-900 mr-8'}`}
            >
              <div className="flex items-start gap-3">
                {chat.type === 'ai' && <Bot className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />}
                <p>{chat.message}</p>
                {chat.type === 'user' && (
                  <div className="w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">You</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}

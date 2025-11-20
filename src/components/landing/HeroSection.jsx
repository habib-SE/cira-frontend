import React, { useState } from 'react';
import { Lock, Users, Zap, Bot, Shield } from 'lucide-react';
import ChatInput from './ChatInput';
import NurseAvatar from '../../assistant/nurseAvatar/NurseAvatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = (message) => {
    setChatHistory(prev => [...prev, { type: 'user', message }]);

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          type: 'ai',
          message: "I understand you're asking about your health. Let me help you with that...",
        },
      ]);
    }, 800);
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
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.15 }}
    >
      {/* Avatar */}
      <motion.div variants={fadeUp} className="mb-20 relative h-[190px] w-[220px] flex items-center">
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[190px] w-[190px] rounded-full bg-[#FCF5E6] blur-[1px] z-[1]"
        ></div>

        <div className="relative h-[280px] w-[280px] rounded-full overflow-hidden z-[3]">
          <Canvas camera={{ position: [0, 1.5, 3], fov: 20 }}>
            <directionalLight position={[2, 5, 3]} intensity={1.2} />
            <hemisphereLight skyColor={0xffffff} groundColor={0xffe0f0} intensity={0.6} />
            <OrbitControls enableZoom={false} />
            <NurseAvatar />
          </Canvas>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
        <motion.div variants={float} className="flex items-center gap-2 text-black">
          <Shield className="w-4 h-4 fill-current" />
          <div className="flex flex-row">
            <strong>256</strong>
            <p>-bit encryption</p>
          </div>
        </motion.div>
        <motion.div variants={float} transition={{ delay: 0.1 }} className="flex items-center gap-2 text-black">
          <Users className="w-4 h-4 fill-current" />
          <span>Trusted by thousands</span>
        </motion.div>
        <motion.div variants={float} transition={{ delay: 0.2 }} className="flex items-center gap-2 text-black">
          <Zap className="w-4 h-4 fill-current" />
          <span>Instant AI answers</span>
        </motion.div>
      </motion.div>

      {/* Text Block */}
      <motion.div variants={fadeUp} className="w-full max-w-2xl px-4 -ml-6">
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight text-left">
          Hi, I'm <span className="text-pink-400">Cira</span>, your AI Nurse
        </h1>

        <motion.div
          className="text-left space-y-4 text-gray-700 text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.2 } }}
        >
          <p>I'm your private and personal wellness <strong>Nurse</strong>.</p>
          <p>As an AI Nurse, my service is <strong>fast and free</strong>.</p>
          <p>I've already helped <strong>thousands of people!</strong></p>
          <p>After we chat, you can book a consultation with our doctors for only <strong>£49</strong></p>
        </motion.div>
      </motion.div>

      {/* Chat Input */}
      <motion.div variants={fadeUp} className="w-full max-w-2xl">
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

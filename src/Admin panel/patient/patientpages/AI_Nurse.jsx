import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Scan
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AI_Nurse = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Nurse. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]); 
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState('camera'); // 'camera' or 'voice'
  const [voiceTranscription, setVoiceTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: 72,
    temperature: 98.6,
    bloodPressure: '120/80',
    oxygen: 98
  });

  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate vitals monitoring
  useEffect(() => {
    if (isCameraOn) {
      const interval = setInterval(() => {
        setVitals(prev => ({
          heartRate: prev.heartRate + Math.floor(Math.random() * 6 - 3),
          temperature: (prev.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1),
          bloodPressure: `${120 + Math.floor(Math.random() * 10 - 5)}/${80 + Math.floor(Math.random() * 6 - 3)}`,
          oxygen: prev.oxygen + Math.floor(Math.random() * 4 - 2)
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isCameraOn]);

  // Camera setup
  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraOn(false);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand your concern. Let me help you with that. Can you provide more details about your symptoms?",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        const voiceMessage = {
          id: messages.length + 1,
          text: "Voice message: I'm feeling dizzy and have a headache",
          sender: 'user',
          timestamp: new Date().toLocaleTimeString(),
          isVoice: true
        };
        setMessages(prev => [...prev, voiceMessage]);
        setIsRecording(false);
      }, 3000);
    }
  };

  const startVoiceListening = () => {
    setIsListening(true);
    setVoiceTranscription('');
    
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceTranscription("Turn on the air conditioner in the living room.");
      setIsListening(false);
    }, 2000);
  };

  const stopVoiceListening = () => {
    setIsListening(false);
    if (voiceTranscription) {
      const voiceMessage = {
        id: messages.length + 1,
        text: voiceTranscription,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        isVoice: true
      };
      setMessages(prev => [...prev, voiceMessage]);
      setVoiceTranscription('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand you want to turn on the air conditioner in the living room. Let me help you with that.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col lg:flex-row">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:w-3/4">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">AI Nurse Assistant</h1>
                <p className="text-sm text-gray-500">
                  {isCallActive ? 'Call Active' : 'Online'} • Always here to help
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
                {message.isVoice && (
                  <div className="flex items-center mt-2">
                    <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Mic size={12} />
                    </div>
                    <span className="ml-2 text-xs">Voice Message</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message or ask about your health..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Camera or Voice */}
      <div className="lg:w-1/4 bg-white border-l border-gray-200 flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          {rightPanelMode === 'camera' && (
            <div className="space-y-3">
              <button
                onClick={toggleCamera}
                className={`w-full flex justify-center gap-3 p-3 rounded-lg transition-colors ${
                  isCameraOn 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <Scan size={24} className=''/>
                {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              </button>
              
              {/* Voice Chat Button */}
              <button
                onClick={() => navigate('/assistant')}
                className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Mic size={20} />
                <span className="font-medium">Voice Chat</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {rightPanelMode === 'camera' ? (
            <>
              {/* Vitals Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 text-left">Heart Rate</span>
                  </div>
                  <p className="text-lg font-bold text-red-600">{vitals.heartRate} BPM</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 text-left">Temperature</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">{vitals.temperature}°F</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Blood Pressure</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{vitals.bloodPressure}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Oxygen</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{vitals.oxygen}%</p>
                </div>
              </div>
            </>
          ) : (
            /* Voice Interface */
            <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg text-white">
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-gray-300 text-sm mb-2">Hi, Patient</p>
                <h2 className="text-2xl font-bold mb-4">SAY SOMETHING</h2>
              </div>

              {/* Voice Orb Container */}
              <div className="relative mb-8">
                <div className="w-48 h-48 border-2 border-blue-400 rounded-lg flex items-center justify-center relative">
                  {/* Voice Orb Animation */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {isListening ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-purple-500 rounded-full animate-pulse opacity-60"></div>
                        <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse opacity-80"></div>
                        <div className="w-12 h-12 bg-indigo-400 rounded-full animate-pulse"></div>
                        <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Mic size={32} />
                      </div>
                    )}
                  </div>
                  
                  {/* Corner Markers */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-sm"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-sm"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-sm"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>

              {/* Transcription Area */}
              {voiceTranscription && (
                <div className="w-full mb-6">
                  <div className="bg-blue-600 px-4 py-2 rounded-lg mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">258</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">258</span>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm leading-relaxed px-4">
                    {voiceTranscription}
                  </p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center space-x-6">
                <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                  <MessageSquare size={20} />
                </button>
                
                <button
                  onMouseDown={startVoiceListening}
                  onMouseUp={stopVoiceListening}
                  onTouchStart={startVoiceListening}
                  onTouchEnd={stopVoiceListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Mic size={24} />
                </button>
                
                <button 
                  onClick={() => setVoiceTranscription('')}
                  className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
                >
                  <span className="text-white font-bold">×</span>
                </button>
              </div>

              {/* Status Text */}
              <p className="text-xs text-gray-300 mt-4 text-center">
                {isListening ? 'Listening...' : 'Tap and hold to speak'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AI_Nurse;
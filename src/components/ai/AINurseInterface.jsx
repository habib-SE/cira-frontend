import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Camera, 
  Heart, 
  Thermometer, 
  Activity,
  AlertCircle,
  CheckCircle,
  Bot,
  User,
  Download,
  Share2,
  X
} from 'lucide-react';
import Card from '../../Admin panel/admin/admincomponents/Card';
import Button from '../shared/Button';

const AINurseInterface = ({
  onGenerateReport,
  onBookDoctor,
  className = ''
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI Nurse. I can help you with health assessments, vital sign monitoring, and provide general health guidance. How are you feeling today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: null,
    temperature: null,
    bloodPressure: null,
    oxygenSaturation: null
  });
  const [isVitalsScanning, setIsVitalsScanning] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [capturedImages, setCapturedImages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I understand your concern. Based on your symptoms, I recommend monitoring your condition and consulting with a healthcare professional if symptoms persist. Would you like me to help you book an appointment with a doctor?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
  };

  const handleVitalsScan = () => {
    setIsVitalsScanning(true);
    
    // Simulate vitals scanning
    setTimeout(() => {
      setVitals({
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
        temperature: (Math.random() * 2 + 36.5).toFixed(1), // 36.5-38.5°C
        bloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`,
        oxygenSaturation: Math.floor(Math.random() * 5) + 95 // 95-100%
      });
      setIsVitalsScanning(false);
    }, 3000);
  };

  const handleImageCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      timestamp: new Date()
    }));
    setCapturedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const generateReport = () => {
    if (onGenerateReport) {
      onGenerateReport({
        messages,
        vitals,
        images: capturedImages,
        timestamp: new Date()
      });
    }
  };

  const bookDoctor = () => {
    if (onBookDoctor) {
      onBookDoctor();
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This AI Nurse provides general health guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Nurse</h3>
                <p className="text-sm text-gray-500">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-200 border-t-pink-500"></div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms or ask a health question..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleVoiceRecording}
                  className={isRecording ? 'bg-red-500 text-white' : ''}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Vitals Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Vital Signs</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={handleVitalsScan}
              disabled={isVitalsScanning}
              className="w-full"
            >
              {isVitalsScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Vitals
                </>
              )}
            </Button>
          </div>

          {/* Vitals Display */}
          <div className="flex-1 p-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {vitals.heartRate ? `${vitals.heartRate} bpm` : '--'}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {vitals.temperature ? `${vitals.temperature}°C` : '--'}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Blood Pressure</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {vitals.bloodPressure || '--'}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="font-medium">Oxygen Saturation</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : '--'}
              </div>
            </Card>
          </div>

          {/* Image Gallery */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Captured Images</h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleImageCapture}
              >
                <Camera className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              {capturedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.preview}
                    alt="Captured"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="primary"
              onClick={generateReport}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="secondary"
              onClick={bookDoctor}
              className="w-full"
            >
              <User className="w-4 h-4 mr-2" />
              Book Doctor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINurseInterface;

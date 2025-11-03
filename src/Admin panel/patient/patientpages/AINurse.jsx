import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Heart, 
  Thermometer,
  Activity,
  FileText,
  Download,
  Share2,
  Calendar,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AINurse = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vitalsData, setVitalsData] = useState(null);
  const [isCapturingVitals, setIsCapturingVitals] = useState(false);
  const [reportStatus, setReportStatus] = useState('draft'); // draft, analyzing, finalized
  const [generatedReport, setGeneratedReport] = useState(null);
  const messagesEndRef = useRef(null);

  // Sample initial messages
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI Health Assistant. I'm here to help you understand your symptoms and provide health guidance. Please describe what you're experiencing today.",
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "Thank you for sharing that information. I understand you're experiencing these symptoms. To provide you with the most accurate assessment, I'd like to capture some vital signs. Would you like to proceed with a vitals scan?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleVitalsCapture = () => {
    setIsCapturingVitals(true);
    
    // Simulate vitals capture
    setTimeout(() => {
      setVitalsData({
        bloodPressure: '120/80',
        heartRate: '72',
        temperature: '98.6°F',
        oxygenSaturation: '98%',
        respiratoryRate: '16',
        timestamp: new Date()
      });
      setIsCapturingVitals(false);
      
      // Add AI message about vitals
      const vitalsMessage = {
        id: messages.length + 1,
        type: 'ai',
        content: "Great! I've captured your vital signs. Your readings look normal. Based on your symptoms and vitals, I can provide some recommendations. Would you like me to generate a comprehensive health report?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, vitalsMessage]);
    }, 3000);
  };

  const generateReport = () => {
    setIsAnalyzing(true);
    setReportStatus('analyzing');
    
    setTimeout(() => {
      const report = {
        id: 'RPT-' + Date.now(),
        symptoms: messages.filter(m => m.type === 'user').map(m => m.content).join(', '),
        vitals: vitalsData,
        analysis: 'Based on your symptoms and vital signs, you appear to be experiencing mild symptoms that are likely related to seasonal allergies or a minor viral infection.',
        recommendations: [
          'Get adequate rest and sleep',
          'Stay hydrated by drinking plenty of water',
          'Monitor your temperature regularly',
          'Consider over-the-counter antihistamines if symptoms persist',
          'Avoid allergens if possible'
        ],
        conditions: ['Mild allergic reaction', 'Possible viral infection'],
        severity: 'Low',
        timestamp: new Date()
      };
      
      setGeneratedReport(report);
      setReportStatus('finalized');
      setIsAnalyzing(false);
      
      const reportMessage = {
        id: messages.length + 1,
        type: 'ai',
        content: "Your health report has been generated! I've analyzed your symptoms and vital signs. The report shows your condition is low severity. You can view, download, or share the report with your doctor.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reportMessage]);
    }, 5000);
  };

  const bookDoctorAppointment = () => {
    // Navigate to doctor booking page
    console.log('Navigate to doctor booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Health Assistant</h1>
              <p className="text-sm text-gray-500">Always available for health guidance</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This AI provides health guidance, not medical diagnosis. Always consult with a healthcare professional for medical advice.
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
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
          
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Analyzing your symptoms and vitals...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceRecording}
              className={`p-2 rounded-lg ${
                isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your symptoms..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Vitals & Actions */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Vitals Widget */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vitals Capture</h2>
          
          {!vitalsData ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Capture your vital signs for better analysis</p>
              <button
                onClick={handleVitalsCapture}
                disabled={isCapturingVitals}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isCapturingVitals ? 'Capturing...' : 'Start Vitals Scan'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blood Pressure</span>
                <span className="font-medium">{vitalsData.bloodPressure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Heart Rate</span>
                <span className="font-medium">{vitalsData.heartRate} bpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="font-medium">{vitalsData.temperature}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Oxygen Saturation</span>
                <span className="font-medium">{vitalsData.oxygenSaturation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Respiratory Rate</span>
                <span className="font-medium">{vitalsData.respiratoryRate} breaths/min</span>
              </div>
              <button
                onClick={handleVitalsCapture}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Retake Vitals
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          
          <div className="space-y-3">
            {reportStatus === 'draft' && vitalsData && (
              <button
                onClick={generateReport}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
            )}

            {reportStatus === 'analyzing' && (
              <div className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}

            {reportStatus === 'finalized' && generatedReport && (
              <>
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>View Report</span>
                </button>
                
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                
                <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share with Doctor</span>
                </button>
                
                <button
                  onClick={bookDoctorAppointment}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Doctor</span>
                </button>
              </>
            )}
          </div>

          {/* Report Summary */}
          {generatedReport && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Report Summary</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Severity:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    generatedReport.severity === 'Low' ? 'bg-green-100 text-green-800' :
                    generatedReport.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {generatedReport.severity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Conditions:</span>
                  <span className="ml-2 text-gray-900">{generatedReport.conditions.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Generated:</span>
                  <span className="ml-2 text-gray-900">{generatedReport.timestamp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINurse;

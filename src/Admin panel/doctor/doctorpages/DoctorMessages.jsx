import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Send, Phone, Video, MoreVertical } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorMessages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Handle selected patient from navigation
  useEffect(() => {
    if (location.state?.selectedPatient) {
      setSelectedPatient(location.state.selectedPatient);
      if (location.state.selectedChatId) {
        setSelectedChat(location.state.selectedChatId);
      }
    }
  }, [location.state]);

  // Auto-trigger loader on component mount
  useEffect(() => {
    setIsContentLoading(true);
    setTimeout(() => {
      setIsContentLoading(false);
    }, 2000);
  }, []);

  const chats = [
    { id: 1, patient: 'John Doe', lastMessage: 'Thank you for the prescription!', time: '2 min ago', unread: 2, status: 'online', condition: 'Hypertension' },
    { id: 2, patient: 'Jane Smith', lastMessage: 'When should I schedule my next visit?', time: '1 hour ago', unread: 0, status: 'busy', condition: 'Diabetes' },
    { id: 3, patient: 'Mike Johnson', lastMessage: 'The medication is working well', time: '3 hours ago', unread: 1, status: 'offline', condition: 'Arthritis' },
    { id: 4, patient: 'Sarah Williams', lastMessage: 'I have some questions about my test results', time: '5 hours ago', unread: 0, status: 'online', condition: 'Asthma' },
  ];

  const messages = [
    { id: 1, sender: 'patient', message: 'Hello Doctor, I have some questions about my recent test results.', time: '10:30 AM' },
    { id: 2, sender: 'doctor', message: 'Hello! I\'d be happy to help. What specific questions do you have?', time: '10:32 AM' },
    { id: 3, sender: 'patient', message: 'The blood pressure readings seem higher than usual. Should I be concerned?', time: '10:35 AM' },
    { id: 4, sender: 'doctor', message: 'Let me review your recent readings. A slight increase can be normal, but let\'s monitor it closely.', time: '10:38 AM' },
    { id: 5, sender: 'patient', message: 'I\'ve been taking the medication as prescribed, but I still feel some discomfort in my chest area.', time: '10:40 AM' },
    { id: 6, sender: 'doctor', message: 'That\'s important to note. Can you describe the type of discomfort? Is it sharp, dull, or pressure-like?', time: '10:42 AM' },
    { id: 7, sender: 'patient', message: 'It\'s more like a pressure feeling, especially when I\'m lying down. Sometimes it wakes me up at night.', time: '10:45 AM' },
    { id: 8, sender: 'doctor', message: 'I understand your concern. This could be related to your hypertension. Let\'s schedule a follow-up appointment to run some additional tests.', time: '10:48 AM' },
    { id: 9, sender: 'patient', message: 'That sounds good. When would be the best time for the appointment?', time: '10:50 AM' },
    { id: 10, sender: 'doctor', message: 'I have availability tomorrow morning at 10 AM or Thursday afternoon at 2 PM. Which works better for you?', time: '10:52 AM' },
    { id: 11, sender: 'patient', message: 'Thursday at 2 PM would work perfectly for me. Thank you for your help!', time: '10:55 AM' },
    { id: 12, sender: 'doctor', message: 'Perfect! I\'ll send you a confirmation email with the appointment details. In the meantime, continue taking your medication as prescribed.', time: '10:57 AM' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Handle send message logic here
      setMessageText('');
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your patients securely</p>
      </div>

      {/* Main Content Area with Loader */}
      <div className="relative">
        {/* Content Loader */}
        {isContentLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading messages...</p>
            </div>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex h-[70vh] min-h-[600px]">
              {/* Chat List Sidebar */}
              <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {selectedPatient ? `${selectedPatient.name}'s Conversation` : 'Patient Conversations'}
                    </h3>
                    {selectedPatient && (
                      <button
                        onClick={() => {
                          setSelectedPatient(null);
                          setSelectedChat(1);
                        }}
                        className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        View All
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {selectedPatient ? (
                    // Show only selected patient's conversation
                    chats.filter(chat => chat.patient === selectedPatient.name).length > 0 ? (
                      chats.filter(chat => chat.patient === selectedPatient.name).map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedChat === chat.id ? 'bg-pink-50 border-r-2 border-pink-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative flex-shrink-0">
                              <div className="bg-pink-100 p-2 rounded-lg">
                                <MessageCircle className="h-5 w-5 text-pink-600" />
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(chat.status)} rounded-full border-2 border-white`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{chat.patient}</h4>
                              <p className="text-sm text-gray-600 truncate">{chat.condition}</p>
                              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-gray-500">{chat.time}</p>
                              {chat.unread > 0 && (
                                <span className="inline-flex items-center justify-center bg-pink-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-2 mt-1">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No conversation found for {selectedPatient.name}</p>
                      </div>
                    )
                  ) : (
                    // Show all conversations
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat === chat.id ? 'bg-pink-50 border-r-2 border-pink-500' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="bg-pink-100 p-2 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-pink-600" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(chat.status)} rounded-full border-2 border-white`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{chat.patient}</h4>
                            <p className="text-sm text-gray-600 truncate">{chat.condition}</p>
                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-500">{chat.time}</p>
                            {chat.unread > 0 && (
                              <span className="inline-flex items-center justify-center bg-pink-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-2 mt-1">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="hidden sm:flex flex-1 flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chats.find(chat => chat.id === selectedChat)?.patient}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {chats.find(chat => chat.id === selectedChat)?.condition}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-2xl break-words ${
                            message.sender === 'doctor'
                              ? 'bg-pink-500 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'doctor' ? 'text-pink-100' : 'text-gray-500'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No messages yet</p>
                        <p className="text-gray-400 text-xs">Start a conversation with your patient</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-pink-500 text-white px-4 py-3 rounded-xl hover:bg-pink-600 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Mobile Chat Messages - Show when no chat selected on mobile */}
              <div className="flex-1 flex flex-col sm:hidden">
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center p-6">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500 text-sm">Choose a patient from the list to start messaging</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMessages;

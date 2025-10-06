import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, Filter, Bell } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorMessages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);

  const handleRefreshContent = () => {
    setIsContentLoading(true);
    setTimeout(() => {
      setIsContentLoading(false);
    }, 1500);
  };

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your patients securely</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshContent}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
          >
            Refresh
          </button>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center">3</span>
          </button>
          <button className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>New Message</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Loader */}
      <div className="relative min-h-[600px]">
        {/* Content Loader */}
        {isContentLoading && (
          <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading messages...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Search and Filter */}
          <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations by patient name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="p-0 h-96 flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Patient Conversations</h3>
          </div>
          <div className="overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-pink-50 border-r-2 border-pink-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="bg-pink-100 p-2 rounded-xl">
                      <MessageCircle className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(chat.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{chat.patient}</h4>
                    <p className="text-sm text-gray-600 truncate">{chat.condition}</p>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{chat.time}</p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center bg-pink-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 mt-1">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {chats.find(chat => chat.id === selectedChat)?.patient}
              </h3>
              <p className="text-sm text-gray-600">
                {chats.find(chat => chat.id === selectedChat)?.condition}
              </p>
            </div>
            <div className="flex items-center space-x-2">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl ${
                    message.sender === 'doctor'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-3 rounded-xl hover:bg-pink-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">Broadcast Message</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <Video className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Video Consultation</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <Phone className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Emergency Call</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
            <Bell className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-600">Notification Settings</span>
          </button>
        </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorMessages;

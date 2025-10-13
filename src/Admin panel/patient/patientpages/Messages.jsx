import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, Filter } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  const chats = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', lastMessage: 'Your test results look good!', time: '2 min ago', unread: 2, status: 'online' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', lastMessage: 'Please schedule your follow-up', time: '1 hour ago', unread: 0, status: 'busy' },
    { id: 3, doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', lastMessage: 'The prescription has been sent', time: '3 hours ago', unread: 1, status: 'offline' },
  ];

  const messages = [
    { id: 1, sender: 'doctor', message: 'Hello! How are you feeling today?', time: '10:30 AM' },
    { id: 2, sender: 'patient', message: 'I\'m doing much better, thank you!', time: '10:32 AM' },
    { id: 3, sender: 'doctor', message: 'That\'s great to hear. Your test results look good!', time: '10:35 AM' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-pink-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your healthcare team securely</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
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
            <h3 className="font-semibold text-gray-900">Conversations</h3>
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
                    <h4 className="font-medium text-gray-900 truncate">{chat.doctor}</h4>
                    <p className="text-sm text-gray-600 truncate">{chat.specialty}</p>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{chat.time}</p>
                    {chat.unread > 0 && (
                      <span className="inline-block bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mt-1">
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
                {chats.find(chat => chat.id === selectedChat)?.doctor}
              </h3>
              <p className="text-sm text-gray-600">
                {chats.find(chat => chat.id === selectedChat)?.specialty}
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
                className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl ${
                    message.sender === 'patient'
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
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button className="bg-pink-600 text-white px-4 py-3 rounded-xl hover:bg-pink-700 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Messages;


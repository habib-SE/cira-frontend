import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientMessages = () => {
  const conversations = [
    { id: 1, doctor: 'Dr. Sarah Johnson', lastMessage: 'Your test results look good.', time: '2 hours ago', unread: 2 },
    { id: 2, doctor: 'Dr. Michael Chen', lastMessage: 'Please schedule a follow-up appointment.', time: '1 day ago', unread: 0 },
    { id: 3, doctor: 'Dr. Emily Davis', lastMessage: 'The prescription has been sent to your pharmacy.', time: '3 days ago', unread: 0 },
  ];

  return (
    <div className="p-6 space-y-6 bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="lg:flex block items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your healthcare providers</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium mt-8 lg:mt-0">
          <Plus className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      {/* Conversations List */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Conversations</h3>
          <p className="text-sm text-gray-600">Recent messages with your doctors</p>
        </div>
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl hidden sm:block">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{conversation.doctor}</h3>
                  <p className="text-sm text-gray-600">{conversation.lastMessage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{conversation.time}</p>
                {conversation.unread > 0 && (
                  <span className="inline-flex items-center justify-center mt-1 bg-blue-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PatientMessages;


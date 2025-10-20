import React from 'react';
import {
  Calendar,
  FileText,
  Stethoscope,
  Bot,
  CreditCard,
  Download,
  Eye,
} from 'lucide-react';
import { PageHeader, StatsCard } from '../../../components/shared';
import Card from '../../admin/admincomponents/Card';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: '3',
      change: '+2 this week',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    { 
      title: 'My Reports', 
      value: '12', 
      change: '+3 new files',
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Subscription Status',
      value: 'Active',
      change: 'View Usage',
      icon: CreditCard,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Book A Doctor',
      value: '1',
      change: 'View All',
      icon: Stethoscope,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: 'Oct 5, 2025',
      time: '10:00 AM',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: 'Oct 8, 2025',
      time: '2:30 PM',
    },
    {
      id: 3,
      doctor: 'Dr. Emily Davis',
      specialty: 'Dermatologist',
      date: 'Oct 12, 2025',
      time: '11:15 AM',
    },
  ];

  const lastAIReport = {
    title: 'Health Assessment Report',
    date: 'Generated on Oct 3, 2025',
    status: 'Completed',
    summary: 'Based on your recent symptoms and vitals monitoring, this report provides insights into your current health status.',
    findings: [
      'Normal heart rate patterns detected',
      'Stable blood pressure readings',
      'Mild dehydration symptoms noted',
      'Recommended: Increase water intake'
    ]
  };

  const handleOpenReport = () => {
    // Logic to open the AI report
    console.log('Opening AI report...');
    // You can navigate to a report page or open a modal
  };

  const handleDownloadReport = () => {
    // Logic to download the AI report
    console.log('Downloading AI report...');
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'AI_Health_Report_Oct_2025.pdf';
    link.click();
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="My Health Dashboard"
        description="Welcome back! Here's an overview of your health information."
      />

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="flex flex-wrap gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const clickable = stat.action;
            return (
              <div
                key={index}
                onClick={stat.action}
                className={`transition-transform ${
                  clickable ? 'cursor-pointer hover:scale-105' : ''
                }`}
              >
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={Icon}
                  color={stat.color}
                  bgColor={stat.bgColor}
                  className=''
                />
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last AI Report Card */}
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Last AI Health Report
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {lastAIReport.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {lastAIReport.date}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                {lastAIReport.summary}
              </p>
              
              {/* Key Findings */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Key Findings:
                </h4>
                <ul className="space-y-2">
                  {lastAIReport.findings.map((finding, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleOpenReport}
                  className="flex-1 bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  View Report
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 bg-gray-300 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </Card>

          {/* Upcoming Appointments Section */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Upcoming Appointments
              </h3>
              <p className="text-sm text-gray-600">
                Your scheduled medical visits
              </p>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="px-5 lg:px-0">
                      <p className="font-semibold text-gray-900">
                        {appointment.doctor}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-left pl-20 lg:pl-0 sm:text-right w-full sm:w-auto">
                    <p className="font-medium text-gray-900">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating AI Nurse Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/ai-nurse')}
          className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold flex items-center gap-2"
        >
          <Bot className="h-5 w-5" />
          Start AI Nurse Chat
        </button>
      </div>
    </>
  );
};

export default PatientDashboard;
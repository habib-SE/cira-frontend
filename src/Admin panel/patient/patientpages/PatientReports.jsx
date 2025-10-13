import React, { useState } from 'react';
import { FileText, Download, Upload, Search, Filter, Eye, Bot, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const aiReports = [
    { 
      id: 1, 
      date: 'Sept 30, 2025', 
      summary: 'Daily health checkup completed with AI analysis ', 
      status: 'Completed',
      type: 'Daily Checkup',
      duration: '15 minutes',
      aiScore: 95
    },
    { 
      id: 2, 
      date: 'Sept 29, 2025', 
      summary: 'Medication adherence monitoring and side effects assessment', 
      status: 'Completed',
      type: 'Medication Review',
      duration: '8 minutes',
      aiScore: 88
    },
    { 
      id: 3, 
      date: 'Sept 28, 2025', 
      summary: 'Symptom analysis for headache and fatigue', 
      status: 'In Progress',
      type: 'Symptom Analysis',
      duration: '12 minutes',
      aiScore: 76
    },
    { 
      id: 4, 
      date: 'Sept 27, 2025', 
      summary: 'Weekly wellness assessment', 
      status: 'Completed',
      type: 'Wellness Check',
      duration: '20 minutes',
      aiScore: 92
    },
    { 
      id: 5, 
      date: 'Sept 26, 2025', 
      summary: 'Emergency health consultation for chest pain', 
      status: 'Pending',
      type: 'Emergency Consult',
      duration: '5 minutes',
      aiScore: 65
    },
    { 
      id: 6, 
      date: 'Sept 25, 2025', 
      summary: 'Sleep pattern analysis and recommendations for better rest', 
      status: 'Completed',
      type: 'Sleep Analysis',
      duration: '18 minutes',
      aiScore: 89
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      'In Progress': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: Clock,
        iconColor: 'text-yellow-600'
      },
      'Pending': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: AlertCircle,
        iconColor: 'text-red-600'
      }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <div className="flex justify-start">
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}>
          <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
          <span className="leading-none">{status}</span>
        </span>
      </div>
    );
  };

  const filteredReports = aiReports.filter(report => {
    const matchesSearch = report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">AI Nurse Reports</h1>
          <p className="text-gray-600 text-sm lg:text-base">View and manage your AI-powered health consultations and reports</p>
        </div>
        <div className="flex items-center justify-center lg:justify-end space-x-3 w-full lg:w-1/2">
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors font-medium">
          <Upload className="w-5 h-5" />
            <span>Upload Report</span>
        </button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 lg:p-6 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by summary, type, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* AI Reports List */}
      <Card className="p-4 lg:p-6 w-full max-w-[1200px] mx-auto">
        <div className="mb-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 text-center lg:text-left">AI Nurse Consultation Reports</h3>
          <p className="text-sm text-gray-600 text-center lg:text-left">Your AI-powered health consultations and analysis reports</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-center py-3 px-4 font-semibold text-gray-900 w-32">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Summary</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 w-32">Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 w-36">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 w-32">AI Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{report.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{report.duration}</p>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <p className="text-sm text-gray-900">{report.summary}</p>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <span className="inline-flex items-center text-center px-3 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 align-top">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            report.aiScore >= 90 ? 'bg-green-500' : 
                            report.aiScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${report.aiScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{report.aiScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{report.date}</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                      {report.type}
                    </span>
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  {getStatusBadge(report.status)}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.summary}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div className="hidden items-center space-x-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          report.aiScore >= 90 ? 'bg-green-500' : 
                          report.aiScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${report.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{report.aiScore}%</span>
                  </div>
                  <span className="text-xs text-gray-500">{report.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2 justify-start sm:justify-end">
                  <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientReports;

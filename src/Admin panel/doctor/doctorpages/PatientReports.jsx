import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  User,
  AlertCircle,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Zap,
  Shield
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

// Sample AI Nurse Reports Data
const aiNurseReports = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    patientId: 'P-2024-001',
    age: 34,
    gender: 'Female',
    reportType: 'AI Nurse Health Assessment',
    priority: 'Urgent',
    status: 'Pending Review',
    generatedDate: '2024-01-15',
    generatedTime: '10:30 AM',
    aiNurseVersion: 'v2.1',
    confidence: 94,
    findings: [
      'Elevated blood pressure readings detected',
      'Irregular heart rhythm patterns observed',
      'Recommend immediate consultation with cardiologist'
    ],
    recommendations: [
      'Schedule ECG within 24 hours',
      'Monitor blood pressure twice daily',
      'Avoid strenuous activities until reviewed'
    ],
    vitals: {
      bloodPressure: '150/95 mmHg',
      heartRate: '88 bpm',
      temperature: '98.6°F',
      oxygenSaturation: '97%'
    },
    aiInsights: 'AI analysis suggests potential cardiovascular concerns requiring immediate medical attention.',
    riskLevel: 'High',
    nextSteps: 'Urgent follow-up required',
    fileSize: '2.4 MB',
    attachments: ['ecg_report.pdf', 'blood_test_results.pdf']
  },
  {
    id: 2,
    patientName: 'Michael Chen',
    patientId: 'P-2024-002',
    age: 28,
    gender: 'Male',
    reportType: 'AI Nurse Screening Report',
    priority: 'Normal',
    status: 'Reviewed',
    generatedDate: '2024-01-14',
    generatedTime: '02:15 PM',
    aiNurseVersion: 'v2.1',
    confidence: 87,
    findings: [
      'All vitals within normal range',
      'No concerning symptoms detected',
      'Patient reports good overall health'
    ],
    recommendations: [
      'Continue current health regimen',
      'Schedule routine check-up in 3 months',
      'Maintain regular exercise routine'
    ],
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      temperature: '98.4°F',
      oxygenSaturation: '99%'
    },
    aiInsights: 'Patient shows excellent health metrics with no immediate concerns.',
    riskLevel: 'Low',
    nextSteps: 'Routine follow-up',
    fileSize: '1.8 MB',
    attachments: ['screening_results.pdf']
  },
  {
    id: 3,
    patientName: 'Emily Rodriguez',
    patientId: 'P-2024-003',
    age: 45,
    gender: 'Female',
    reportType: 'AI Nurse Diagnostic Report',
    priority: 'High',
    status: 'Pending Review',
    generatedDate: '2024-01-15',
    generatedTime: '09:00 AM',
    aiNurseVersion: 'v2.0',
    confidence: 91,
    findings: [
      'Blood sugar levels elevated (HbA1c: 7.2%)',
      'Weight gain of 8 lbs in 3 months',
      'Fatigue and increased thirst reported'
    ],
    recommendations: [
      'Consult endocrinologist for diabetes evaluation',
      'Start blood glucose monitoring',
      'Begin diabetic diet plan',
      'Schedule follow-up in 1 week'
    ],
    vitals: {
      bloodPressure: '135/85 mmHg',
      heartRate: '78 bpm',
      temperature: '98.7°F',
      oxygenSaturation: '98%'
    },
    aiInsights: 'AI analysis indicates potential Type 2 diabetes onset. Early intervention recommended.',
    riskLevel: 'Moderate-High',
    nextSteps: 'Immediate consultation needed',
    fileSize: '3.1 MB',
    attachments: ['blood_test_results.pdf', 'glucose_monitoring_chart.pdf']
  },
  {
    id: 4,
    patientName: 'David Kim',
    patientId: 'P-2024-004',
    age: 52,
    gender: 'Male',
    reportType: 'AI Nurse Wellness Check',
    priority: 'Normal',
    status: 'Reviewed',
    generatedDate: '2024-01-13',
    generatedTime: '11:45 AM',
    aiNurseVersion: 'v2.1',
    confidence: 89,
    findings: [
      'Cholesterol levels slightly elevated',
      'Blood pressure within acceptable range',
      'No immediate health concerns'
    ],
    recommendations: [
      'Reduce saturated fat intake',
      'Increase cardiovascular exercise',
      'Recheck cholesterol in 6 months'
    ],
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: '75 bpm',
      temperature: '98.5°F',
      oxygenSaturation: '98%'
    },
    aiInsights: 'Patient maintains good overall health with minor lifestyle adjustments recommended.',
    riskLevel: 'Low-Moderate',
    nextSteps: 'Routine follow-up in 6 months',
    fileSize: '2.0 MB',
    attachments: ['lipid_panel_results.pdf']
  },
  {
    id: 5,
    patientName: 'Lisa Anderson',
    patientId: 'P-2024-005',
    age: 38,
    gender: 'Female',
    reportType: 'AI Nurse Follow-up Report',
    priority: 'High',
    status: 'Pending Review',
    generatedDate: '2024-01-15',
    generatedTime: '03:20 PM',
    aiNurseVersion: 'v2.1',
    confidence: 93,
    findings: [
      'Improvement in previous symptoms',
      'Medication compliance good',
      'Some side effects reported (mild nausea)'
    ],
    recommendations: [
      'Continue current medication with food',
      'Monitor side effects closely',
      'Schedule follow-up in 2 weeks'
    ],
    vitals: {
      bloodPressure: '118/75 mmHg',
      heartRate: '68 bpm',
      temperature: '98.3°F',
      oxygenSaturation: '99%'
    },
    aiInsights: 'Patient showing positive response to treatment. Side effects are manageable.',
    riskLevel: 'Low',
    nextSteps: 'Continue treatment plan',
    fileSize: '1.9 MB',
    attachments: ['follow_up_notes.pdf']
  },
  {
    id: 6,
    patientName: 'Robert Taylor',
    patientId: 'P-2024-006',
    age: 61,
    gender: 'Male',
    reportType: 'AI Nurse Health Assessment',
    priority: 'Urgent',
    status: 'Pending Review',
    generatedDate: '2024-01-15',
    generatedTime: '01:10 PM',
    aiNurseVersion: 'v2.1',
    confidence: 96,
    findings: [
      'Severe chest pain reported',
      'ECG shows ST elevation',
      'High probability of myocardial infarction'
    ],
    recommendations: [
      'URGENT: Immediate emergency department visit',
      'Do not delay - call 911',
      'Administer aspirin if available',
      'Emergency cardiac consultation required'
    ],
    vitals: {
      bloodPressure: '160/100 mmHg',
      heartRate: '105 bpm',
      temperature: '99.1°F',
      oxygenSaturation: '94%'
    },
    aiInsights: 'CRITICAL: AI analysis indicates high probability of acute cardiac event. Immediate medical intervention required.',
    riskLevel: 'Critical',
    nextSteps: 'EMERGENCY ACTION REQUIRED',
    fileSize: '2.7 MB',
    attachments: ['ecg_report.pdf', 'chest_xray.pdf', 'emergency_notes.pdf']
  }
];

const PatientReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Load reports with saved statuses from localStorage
  useEffect(() => {
    const reportsWithSavedStatus = aiNurseReports.map(report => {
      const savedStatus = localStorage.getItem(`report_status_${report.id}`);
      return savedStatus ? { ...report, status: savedStatus } : report;
    });
    setReports(reportsWithSavedStatus);
  }, []);

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.generatedDate + ' ' + b.generatedTime) - new Date(a.generatedDate + ' ' + a.generatedTime);
    if (sortBy === 'date-asc') return new Date(a.generatedDate + ' ' + a.generatedTime) - new Date(b.generatedDate + ' ' + b.generatedTime);
    if (sortBy === 'priority') {
      const priorityOrder = { 'Urgent': 1, 'High': 2, 'Normal': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  // Statistics
  const totalReports = reports.length;
  const pendingReview = reports.filter(r => r.status === 'Pending Review').length;
  const urgentReports = reports.filter(r => r.priority === 'Urgent').length;
  const criticalRisk = reports.filter(r => r.riskLevel === 'Critical').length;

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reviewed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-red-400 text-white';
      case 'Moderate-High': return 'bg-orange-400 text-white';
      case 'Low-Moderate': return 'bg-yellow-400 text-white';
      case 'Low': return 'bg-green-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const handleViewReport = (report) => {
    navigate(`/doctor/patient-reports/${report.id}`);
  };

  const handleDownloadReport = (reportId) => {
    // Find the report data
    const report = aiNurseReports.find(r => r.id === reportId);
    if (!report) {
      console.error('Report not found:', reportId);
      return;
    }

    // Create report content
    const reportContent = `AI Nurse Health Assessment Report

Patient: ${report.patientName}
Patient ID: ${report.patientId}
Age & Gender: ${report.age} years, ${report.gender}
Generated: ${report.generatedDate} ${report.generatedTime}
AI Nurse Version: ${report.aiNurseVersion}

Report Type: ${report.reportType}
Priority: ${report.priority}
Status: ${report.status}
Risk Level: ${report.riskLevel}

AI Analysis & Insights:
${report.aiInsights}

Key Findings:
${report.findings.map(f => `• ${f}`).join('\n')}

Recommendations:
${report.recommendations.map(r => `• ${r}`).join('\n')}

Vital Signs:
Blood Pressure: ${report.vitals.bloodPressure}
Heart Rate: ${report.vitals.heartRate}
Temperature: ${report.vitals.temperature}
O2 Saturation: ${report.vitals.oxygenSaturation}

Risk Assessment: ${report.riskLevel}
Next Steps: ${report.nextSteps}

AI Confidence: ${report.confidence}%

File Size: ${report.fileSize}
Attachments: ${report.attachments ? report.attachments.join(', ') : 'None'}

---
Generated by CIRA AI Nurse System
Report ID: ${report.id}
Downloaded: ${new Date().toLocaleString()}`;

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Report_${report.patientId}_${report.generatedDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Reports</h1>
          <p className="text-gray-600">Access and review patient reports generated by AI Nurse</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-pink-400 text-white px-6 py-3 rounded-xl hover:bg-pink-500 transition-colors font-medium w-full sm:w-auto whitespace-nowrap">
          <Activity className="w-5 h-5 flex-shrink-0" />
            <span>Generate Report</span>
          </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">AI Nurse Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgent Reports</p>
              <p className="text-2xl font-bold text-gray-900">{urgentReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or report type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Reviewed">Reviewed</option>
            <option value="In Progress">In Progress</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          sortedReports.map((report) => (
            <div 
              key={report.id} 
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewReport(report)}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Side - Report Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{report.reportType}</h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{report.patientName}</span>
                        </div>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="truncate">{report.patientId}</span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="whitespace-nowrap">{report.age} years, {report.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges - Mobile only */}
                  <div className="flex flex-wrap gap-2 mb-3 lg:hidden">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel} Risk
                    </span>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-3">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      <strong>AI Insight:</strong> {report.aiInsights}
                    </p>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Key Findings:</p>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      {report.findings.slice(0, 2).map((finding, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vitals */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">{report.vitals.bloodPressure}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">{report.vitals.heartRate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">{report.vitals.temperature}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Badges and Actions (Desktop only) */}
                <div className="hidden lg:flex flex-col items-end space-y-3 ml-6 flex-shrink-0">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(report.riskLevel)}`}>
                      {report.riskLevel} Risk
                    </span>
                  </div>

                  {/* AI Confidence */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${report.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{report.confidence}%</span>
                    </div>
                  </div>

                  {/* Report Info */}
                  <div className="text-right text-xs text-gray-500">
                    <div className="flex items-center justify-end space-x-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{report.generatedDate}</span>
                      <span>{report.generatedTime}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-1 mb-1">
                      <Shield className="w-3 h-3" />
                      <span>AI v{report.aiNurseVersion}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{report.fileSize}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReport(report);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadReport(report.id);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Footer - Report Info and Actions */}
                <div className="lg:hidden pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">{report.generatedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">AI v{report.aiNurseVersion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{report.confidence}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReport(report);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadReport(report.id);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientReports;


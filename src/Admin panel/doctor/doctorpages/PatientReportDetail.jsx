import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Zap,
  Shield,
  AlertCircle,
  Calendar,
  User,
  Clock
} from 'lucide-react';

// Sample AI Nurse Reports Data (same as PatientReports.jsx)
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

const PatientReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundReport = aiNurseReports.find(r => r.id === parseInt(id));
      setReport(foundReport);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleDownloadReport = () => {
    console.log('Downloading report:', report.id);
    // Add download logic here
  };

  const handleMarkAsReviewed = () => {
    console.log('Marking report as reviewed:', report.id);
    // Add logic to update report status
    navigate('/doctor/patient-reports');
  };

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Report Not Found</h3>
          <p className="text-gray-500 mb-6">The requested report could not be found.</p>
          <button
            onClick={() => navigate('/doctor/patient-reports')}
            className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/doctor/patient-reports')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Patient Reports</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{report.reportType}</h1>
              <p className="text-gray-600">AI Nurse v{report.aiNurseVersion}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
            {report.status === 'Pending Review' && (
              <button
                onClick={handleMarkAsReviewed}
                className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Reviewed</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        {/* Patient Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-pink-600" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Name</p>
              <p className="font-semibold text-gray-900">{report.patientName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Patient ID</p>
              <p className="font-semibold text-gray-900">{report.patientId}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Age & Gender</p>
              <p className="font-semibold text-gray-900">{report.age} years, {report.gender}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Generated</p>
              <p className="font-semibold text-gray-900">{report.generatedDate} {report.generatedTime}</p>
            </div>
          </div>
        </div>

        {/* Priority and Status Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(report.priority)}`}>
            {report.priority} Priority
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(report.riskLevel)}`}>
            {report.riskLevel} Risk
          </span>
        </div>

        {/* AI Confidence */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">AI Confidence Score</p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${report.confidence}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900 min-w-[60px]">{report.confidence}%</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
          <div className="flex items-start">
            <Brain className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">AI Analysis & Insights</h4>
              <p className="text-blue-800">{report.aiInsights}</p>
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-gray-700">Blood Pressure</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{report.vitals.bloodPressure}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Heart Rate</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{report.vitals.heartRate}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">Temperature</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{report.vitals.temperature}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">O2 Saturation</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{report.vitals.oxygenSaturation}</p>
          </div>
        </div>

        {/* Findings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            Key Findings
          </h3>
          <ul className="space-y-2">
            {report.findings.map((finding, idx) => (
              <li key={idx} className="flex items-start bg-red-50 p-3 rounded-lg">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span className="text-gray-700">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start bg-green-50 p-3 rounded-lg">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Assessment & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Risk Level</h4>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(report.riskLevel)}`}>
              {report.riskLevel}
            </span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
            <p className="text-gray-700">{report.nextSteps}</p>
          </div>
        </div>

        {/* Attachments */}
        {report.attachments && report.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="space-y-2">
              {report.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{file}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleDownloadReport}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
          {report.status === 'Pending Review' && (
            <button
              onClick={handleMarkAsReviewed}
              className="flex-1 flex items-center justify-center space-x-2 bg-pink-600 text-white py-3 px-6 rounded-xl hover:bg-pink-700 transition-colors font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Reviewed</span>
            </button>
          )}
          <button
            onClick={() => navigate('/doctor/patient-reports')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientReportDetail;


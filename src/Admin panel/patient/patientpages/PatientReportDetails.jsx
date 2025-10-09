import React, { useState } from 'react';
import { ArrowLeft, Heart, Thermometer, Activity, Droplets, Eye, Brain, AlertTriangle, CheckCircle, Clock, FileText, Download, Share } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientReportDetails = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample report data - in real app this would come from props or API
  const reportData = {
    id: 1,
    date: 'Sept 30, 2025',
    time: '10:30 AM',
    duration: '15 minutes',
    type: 'Daily Checkup',
    status: 'Completed',
    aiScore: 95,
    
    symptoms: [
      'Mild headache for 2 days',
      'Occasional dizziness when standing',
      'Slight fatigue in the evening',
      'Dry mouth sensation',
      'Difficulty concentrating'
    ],
    
    vitals: {
      heartRate: { value: 78, unit: 'bpm', status: 'normal' },
      temperature: { value: 98.6, unit: '°F', status: 'normal' },
      bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal' },
      oxygenSaturation: { value: 98, unit: '%', status: 'normal' },
      respiratoryRate: { value: 16, unit: 'breaths/min', status: 'normal' },
      weight: { value: 165, unit: 'lbs', status: 'normal' }
    },
    
    conditions: [
      {
        rank: 1,
        name: 'Dehydration',
        confidence: 85,
        description: 'Mild dehydration based on symptoms and recent activity patterns',
        severity: 'low'
      },
      {
        rank: 2,
        name: 'Stress-related tension headache',
        confidence: 72,
        description: 'Tension headache likely caused by stress or poor sleep',
        severity: 'low'
      },
      {
        rank: 3,
        name: 'Mild fatigue syndrome',
        confidence: 58,
        description: 'General fatigue possibly related to lifestyle factors',
        severity: 'low'
      }
    ],
    
    recommendations: [
      'Increase daily water intake to 8-10 glasses',
      'Maintain regular sleep schedule (7-8 hours)',
      'Practice stress management techniques (meditation, deep breathing)',
      'Take short breaks every hour during work',
      'Consider light exercise like walking for 30 minutes daily',
      'Monitor symptoms and consult doctor if they worsen'
    ],
    
    nextSteps: [
      'Follow up in 3 days if symptoms persist',
      'Schedule appointment if new symptoms appear',
      'Keep symptom diary for tracking progress'
    ]
  };

  const getVitalStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDownload = () => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      // In real app, generate and download PDF
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-start">
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Nurse Report Details</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {reportData.date} • {reportData.time} • {reportData.duration}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                reportData.status === 'Completed' ? 'bg-green-100 text-green-800' :
                reportData.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {reportData.status}
              </span>
              
              <button 
                onClick={handleDownload}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Generating...' : 'Download PDF'}</span>
              </button>
              
              <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Symptoms & Vitals */}
          <div className="space-y-6">
            
            {/* Symptoms */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Reported Symptoms</h2>
              </div>
              <ul className="space-y-2">
                {reportData.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Vitals */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Vital Signs</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.heartRate.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.heartRate.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.heartRate.status)}`}>
                    {reportData.vitals.heartRate.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.temperature.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.temperature.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.temperature.status)}`}>
                    {reportData.vitals.temperature.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.bloodPressure.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.bloodPressure.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.bloodPressure.status)}`}>
                    {reportData.vitals.bloodPressure.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Oxygen Saturation</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.oxygenSaturation.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.oxygenSaturation.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.oxygenSaturation.status)}`}>
                    {reportData.vitals.oxygenSaturation.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Respiratory Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.respiratoryRate.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.respiratoryRate.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.respiratoryRate.status)}`}>
                    {reportData.vitals.respiratoryRate.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-600">Weight</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{reportData.vitals.weight.value}</div>
                  <div className="text-sm text-gray-500">{reportData.vitals.weight.unit}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVitalStatusColor(reportData.vitals.weight.status)}`}>
                    {reportData.vitals.weight.status}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Conditions & Recommendations */}
          <div className="space-y-6">
            
            {/* Top 3 Possible Conditions */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">Top 3 Possible Conditions</h2>
              </div>
              <div className="space-y-4">
                {reportData.conditions.map((condition) => (
                  <div key={condition.rank} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full hidden sm:flex items-center justify-center font-bold text-sm">
                          {condition.rank}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{condition.name}</h3>
                          <p className="text-sm text-gray-600">{condition.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{condition.confidence}%</div>
                        <div className="text-xs text-gray-500">confidence</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                        {condition.severity} severity
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${condition.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
              </div>
              <div className="space-y-3">
                {reportData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Next Steps</h2>
              </div>
              <div className="space-y-3">
                {reportData.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">AI Analysis Summary</h2>
              </div>
              <div className="flex items-center space-x-2 sm:justify-end">
                <span className="text-sm text-gray-600">AI Confidence Score:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${reportData.aiScore}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">{reportData.aiScore}%</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Based on the reported symptoms and vital signs, the AI analysis suggests mild dehydration as the most likely cause of your symptoms. 
              The combination of headache, dizziness, and dry mouth, along with normal vital signs, points to insufficient fluid intake. 
              The recommendations focus on hydration, rest, and stress management. If symptoms persist or worsen, please consult with a healthcare provider.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientReportDetails;
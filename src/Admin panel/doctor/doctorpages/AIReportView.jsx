import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    Download,
    FileText,
    Heart,
    Activity,
    TrendingUp,
    Droplets,
    Brain,
    CheckCircle,
    AlertCircle,
    User,
    Calendar,
    Clock,
    MapPin,
    Video,
    XCircle
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const AIReportView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
    
    // Sample appointments data
    const sampleAppointments = [
        {
            id: 1,
            patient: 'John Doe',
            date: '2024-01-15',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'confirmed',
            duration: '30 min',
            mode: 'clinic',
            room: 'Room 301',
            reason: 'Follow-up for blood pressure management',
            aiReport: {
                id: 'AI-2024-001',
                status: 'completed',
                generatedAt: '2024-01-15 10:25 AM',
                summary: 'Patient shows stable blood pressure readings with current medication. Minor adjustments may be needed.',
                findings: [
                    {
                        category: 'Vital Signs',
                        items: [
                            { name: 'Blood Pressure', value: '135/85 mmHg', status: 'elevated', normal: '120/80 mmHg' },
                            { name: 'Heart Rate', value: '72 bpm', status: 'normal', normal: '60-100 bpm' },
                            { name: 'Temperature', value: '98.6°F', status: 'normal', normal: '98.6°F' },
                            { name: 'Weight', value: '180 lbs', status: 'normal', normal: '170-190 lbs' }
                        ]
                    },
                    {
                        category: 'Lab Results',
                        items: [
                            { name: 'HbA1c', value: '7.2%', status: 'elevated', normal: '<7.0%' },
                            { name: 'Cholesterol', value: '220 mg/dL', status: 'elevated', normal: '<200 mg/dL' },
                            { name: 'Creatinine', value: '1.1 mg/dL', status: 'normal', normal: '0.6-1.2 mg/dL' }
                        ]
                    },
                    {
                        category: 'Risk Assessment',
                        items: [
                            { name: 'Cardiovascular Risk', value: 'Moderate', status: 'warning' },
                            { name: 'Diabetes Control', value: 'Suboptimal', status: 'warning' },
                            { name: 'Overall Health', value: 'Stable', status: 'normal' }
                        ]
                    }
                ],
                recommendations: [
                    'Consider increasing Metformin dosage to 1000mg twice daily',
                    'Add low-dose aspirin for cardiovascular protection',
                    'Schedule follow-up in 3 months',
                    'Continue current blood pressure medication',
                    'Recommend dietary counseling for diabetes management'
                ],
                alerts: [
                    'Blood pressure slightly elevated - monitor closely',
                    'HbA1c above target - consider medication adjustment'
                ]
            }
        },
        {
            id: 2,
            patient: 'Jane Smith',
            date: '2024-01-15',
            time: '10:30 AM',
            type: 'Follow-up',
            status: 'confirmed',
            duration: '20 min',
            mode: 'teleconsultation',
            room: 'Virtual',
            reason: 'Review blood sugar levels',
            aiReport: {
                id: 'AI-2024-002',
                status: 'completed',
                generatedAt: '2024-01-15 10:25 AM',
                summary: 'Blood sugar analysis indicates need for medication adjustment. Patient showing good compliance with diet.',
                findings: [
                    {
                        category: 'Vital Signs',
                        items: [
                            { name: 'Blood Pressure', value: '128/82 mmHg', status: 'normal', normal: '120/80 mmHg' },
                            { name: 'Heart Rate', value: '68 bpm', status: 'normal', normal: '60-100 bpm' },
                            { name: 'Temperature', value: '98.4°F', status: 'normal', normal: '98.6°F' },
                            { name: 'Weight', value: '165 lbs', status: 'normal', normal: '140-180 lbs' }
                        ]
                    }
                ],
                recommendations: [
                    'Adjust insulin dosage based on blood sugar readings',
                    'Continue monitoring blood glucose levels',
                    'Schedule follow-up in 2 weeks'
                ],
                alerts: [
                    'Blood sugar levels fluctuate - medication adjustment needed'
                ]
            }
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            date: '2024-01-15',
            time: '02:00 PM',
            type: 'Emergency',
            status: 'in-progress',
            duration: '45 min',
            mode: 'clinic',
            room: 'Room 301',
            reason: 'Acute chest pain - immediate attention needed',
            aiReport: {
                id: 'AI-2024-003',
                status: 'urgent',
                generatedAt: '2024-01-15 01:55 PM',
                summary: 'Chest pain analysis suggests possible cardiac event - immediate attention required',
                findings: [
                    {
                        category: 'Vital Signs',
                        items: [
                            { name: 'Blood Pressure', value: '150/95 mmHg', status: 'elevated', normal: '120/80 mmHg' },
                            { name: 'Heart Rate', value: '95 bpm', status: 'elevated', normal: '60-100 bpm' },
                            { name: 'Temperature', value: '99.1°F', status: 'elevated', normal: '98.6°F' },
                            { name: 'O2 Saturation', value: '94%', status: 'warning', normal: '95-100%' }
                        ]
                    }
                ],
                recommendations: [
                    'Immediate ECG required',
                    'Administer aspirin if no contraindications',
                    'Consider cardiac enzymes test',
                    'Monitor vitals continuously'
                ],
                alerts: [
                    'URGENT: Possible cardiac event - immediate intervention required',
                    'Oxygen saturation below normal'
                ]
            }
        }
    ];

    // Merge all appointments
    const allAppointments = [...savedAppointments, ...sampleAppointments];
    
    // Find the appointment by ID
    const appointment = allAppointments.find(apt => apt.id === parseInt(id));

    React.useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'normal':
                return 'bg-green-100 text-green-800';
            case 'elevated':
                return 'bg-yellow-100 text-yellow-800';
            case 'warning':
                return 'bg-orange-100 text-orange-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'normal':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'elevated':
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'critical':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Vital Signs':
                return <Activity className="w-5 h-5 text-blue-500" />;
            case 'Lab Results':
                return <Droplets className="w-5 h-5 text-red-500" />;
            case 'Risk Assessment':
                return <Brain className="w-5 h-5 text-purple-500" />;
            default:
                return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (status) => {
        switch (status) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading AI report...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Report Not Found</h3>
                    <p className="text-gray-500 mb-6">The requested AI report could not be found.</p>
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    const aiReport = appointment.aiReport || {
        id: 'AI-2024-000',
        status: 'pending',
        generatedAt: new Date().toLocaleString(),
        summary: 'AI health assessment will be generated after consultation',
        findings: [],
        recommendations: [],
        alerts: []
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(`/doctor/appointments/${id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Health Report</h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            {appointment.patient} • {appointment.date} at {appointment.time}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => alert('Downloading report...')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Download Report</span>
                    <span className="sm:hidden">Download</span>
                </button>
            </div>

            {/* Report Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Patient</p>
                            <p className="text-lg font-bold text-gray-900">{appointment.patient}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Appointment</p>
                            <p className="text-lg font-bold text-gray-900">{appointment.type}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Report Status</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(aiReport.status)}`}>
                                {aiReport.status}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI Report Content */}
            <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">AI Analysis Report</h2>
                        <p className="text-sm text-gray-600 mt-1">Generated: {aiReport.generatedAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Report ID:</span>
                        <span className="text-sm font-semibold text-gray-900">{aiReport.id}</span>
                    </div>
                </div>

                {/* AI Summary */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-lg mb-6">
                    <div className="flex items-start">
                        <Brain className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
                            <p className="text-blue-800">{aiReport.summary}</p>
                        </div>
                    </div>
                </div>

                {/* Findings */}
                {aiReport.findings && aiReport.findings.length > 0 ? (
                    <div className="space-y-6 mb-6">
                        {aiReport.findings.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <div className="flex items-center space-x-2 mb-4">
                                    {getCategoryIcon(category.category)}
                                    <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {category.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Normal: {item.normal}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-4">
                                                <p className="text-lg font-bold text-gray-900 mb-2">{item.value}</p>
                                                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                    {getStatusIcon(item.status)}
                                                    <span>{item.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 mb-6">
                        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Detailed Findings Yet</h3>
                        <p className="text-gray-500">AI health assessment will be generated after consultation</p>
                    </div>
                )}

                {/* Recommendations */}
                {aiReport.recommendations && aiReport.recommendations.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            AI Recommendations
                        </h3>
                        <div className="space-y-3">
                            {aiReport.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-green-800">{recommendation}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Alerts */}
                {aiReport.alerts && aiReport.alerts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            Important Alerts
                        </h3>
                        <div className="space-y-3">
                            {aiReport.alerts.map((alert, index) => (
                                <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-red-800">{alert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => navigate(`/doctor/appointments/${id}`)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        Back to Appointment
                    </button>
                    <button
                        onClick={() => alert('Downloading report...')}
                        className="flex items-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AIReportView;


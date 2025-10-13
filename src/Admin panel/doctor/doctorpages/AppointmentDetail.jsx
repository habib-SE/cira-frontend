import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    User, 
    Calendar, 
    Clock, 
    Phone, 
    Mail, 
    MapPin,
    FileText,
    MessageCircle,
    Video,
    Camera,
    Download,
    Edit,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Heart,
    Activity,
    Stethoscope,
    Pill,
    Thermometer,
    Droplets,
    Brain
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState('');
    const [summary, setSummary] = useState('');
    const [prescription, setPrescription] = useState('');
    const [followUpRequired, setFollowUpRequired] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');

    // Sample appointment data - in real app, this would be fetched by ID
    const appointment = {
        id: id ? parseInt(id) : 1, // Default to 1 if no ID provided
        patient: {
            name: 'John Doe',
            age: 45,
            gender: 'Male',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, New York, NY 10001',
            emergencyContact: 'Jane Doe (Wife) - +1 (555) 987-6543',
            medicalHistory: [
                'Hypertension (2020)',
                'Type 2 Diabetes (2019)',
                'High Cholesterol (2021)'
            ],
            allergies: ['Penicillin', 'Shellfish'],
            currentMedications: [
                'Metformin 500mg twice daily',
                'Lisinopril 10mg once daily',
                'Atorvastatin 20mg once daily'
            ]
        },
        appointment: {
            date: '2024-01-15',
            time: '10:30 AM',
            duration: '30 minutes',
            type: 'Consultation',
            mode: 'clinic',
            status: 'in-progress',
            reason: 'Follow-up for blood pressure management',
            symptoms: 'Occasional headaches, feeling tired',
            priority: 'normal'
        },
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
        },
        previousAppointments: [
            {
                date: '2023-12-15',
                reason: 'Initial consultation',
                diagnosis: 'Hypertension, Type 2 Diabetes',
                treatment: 'Started Metformin and Lisinopril'
            },
            {
                date: '2023-11-15',
                reason: 'Follow-up',
                diagnosis: 'Stable condition',
                treatment: 'Continued current medications'
            }
        ]
    };

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

    const handleSaveNotes = () => {
        // Save consultation notes
        setIsEditing(false);
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                {/* Top Row - Back Button */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Appointments</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                        appointment.appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        appointment.appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {appointment.appointment.status}
                    </span>
                </div>
                
                {/* Title and Patient Info */}
                <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Appointment Details</h1>
                    <p className="text-sm sm:text-base text-gray-600 break-words">
                        Patient: {appointment.patient.name} • {appointment.appointment.date} at {appointment.appointment.time}
                    </p>
                </div>
                
                {/* Action Button */}
                <div className="flex justify-start">
                    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm sm:text-base">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Start Consultation</span>
                        <span className="sm:hidden">Start</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Patient Information */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{appointment.patient.name}</h3>
                                <p className="text-sm sm:text-base text-gray-600 truncate">{appointment.patient.age} years old • {appointment.patient.gender}</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm text-gray-700 break-words">{appointment.patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700">{appointment.patient.phone}</span>
                            </div>
                            <div className="flex items-start space-x-2 sm:space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm text-gray-700 break-words">{appointment.patient.address}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Medical History */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Conditions</h4>
                                <div className="space-y-1">
                                    {appointment.patient.medicalHistory.map((condition, index) => (
                                        <div key={index} className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded break-words">
                                            {condition}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Allergies</h4>
                                <div className="space-y-1">
                                    {appointment.patient.allergies.map((allergy, index) => (
                                        <div key={index} className="text-xs sm:text-sm text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded break-words">
                                            {allergy}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Current Medications</h4>
                                <div className="space-y-1">
                                    {appointment.patient.currentMedications.map((medication, index) => (
                                        <div key={index} className="text-xs sm:text-sm text-gray-600 bg-blue-50 px-2 sm:px-3 py-1 rounded break-words">
                                            {medication}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Contact */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                        <p className="text-xs sm:text-sm text-gray-700 break-words">{appointment.patient.emergencyContact}</p>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* AI Report */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Health Report</h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm text-gray-500">Generated: {appointment.aiReport.generatedAt}</span>
                                <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Summary */}
                            <div className="p-3 sm:p-4 bg-blue-50 rounded-xl">
                                <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">AI Summary</h4>
                                <p className="text-blue-800 text-xs sm:text-sm break-words">{appointment.aiReport.summary}</p>
                            </div>

                            {/* Findings */}
                            {appointment.aiReport.findings.map((category, categoryIndex) => (
                                <div key={categoryIndex}>
                                    <div className="flex items-center space-x-2 mb-3">
                                        {getCategoryIcon(category.category)}
                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{category.category}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 truncate">Normal: {item.normal}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-2">
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{item.value}</p>
                                                    <span className={`inline-flex items-center space-x-1 px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                        {getStatusIcon(item.status)}
                                                        <span className="truncate">{item.status}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Recommendations */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">AI Recommendations</h4>
                                <div className="space-y-2">
                                    {appointment.aiReport.recommendations.map((recommendation, index) => (
                                        <div key={index} className="flex items-start space-x-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-green-800 break-words">{recommendation}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alerts */}
                            {appointment.aiReport.alerts.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Important Alerts</h4>
                                    <div className="space-y-2">
                                        {appointment.aiReport.alerts.map((alert, index) => (
                                            <div key={index} className="flex items-start space-x-2 p-2 sm:p-3 bg-red-50 rounded-lg">
                                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-red-800 break-words">{alert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Consultation Notes */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Consultation Notes</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-2 sm:px-3 py-1 text-pink-600 hover:text-pink-700 text-sm"
                                >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Edit</span>
                                </button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleSaveNotes}
                                        className="flex items-center space-x-2 px-2 sm:px-3 py-1 text-green-600 hover:text-green-700 text-sm"
                                    >
                                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center space-x-2 px-2 sm:px-3 py-1 text-gray-600 hover:text-gray-700 text-sm"
                                    >
                                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Clinical Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                                    placeholder="Enter your clinical observations and notes..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Post-Consultation Summary
                                </label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                                    placeholder="Summary of consultation and next steps..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Prescription
                                </label>
                                <textarea
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                                    placeholder="Prescribed medications and dosages..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={followUpRequired}
                                        onChange={(e) => setFollowUpRequired(e.target.checked)}
                                        disabled={!isEditing}
                                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <span className="text-xs sm:text-sm text-gray-700">Follow-up required</span>
                                </label>
                                {followUpRequired && (
                                    <input
                                        type="date"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                        disabled={!isEditing}
                                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Previous Appointments */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Previous Appointments</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {appointment.previousAppointments.map((prevAppointment, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 text-xs sm:text-sm">{prevAppointment.date}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{prevAppointment.reason}</p>
                                    </div>
                                    <div className="text-right sm:text-right">
                                        <p className="text-xs sm:text-sm text-gray-700 truncate">{prevAppointment.diagnosis}</p>
                                        <p className="text-xs text-gray-500">{prevAppointment.treatment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetail;


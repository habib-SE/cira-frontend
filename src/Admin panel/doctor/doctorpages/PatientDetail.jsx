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
    Heart,
    Activity,
    Stethoscope,
    Pill,
    Thermometer,
    Droplets,
    Edit,
    Save,
    X
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState('');
    const [currentNotes, setCurrentNotes] = useState('');
    const [patientData, setPatientData] = useState(null);

    // Sample patient data - in a real app, this would come from an API
    const patients = {
        1: {
            id: 1,
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
            ],
            lastVisit: 'Sep 28, 2025',
            status: 'Active',
            condition: 'Hypertension',
            notes: 'Patient shows good compliance with medication. Blood pressure readings have been stable. Continue current treatment plan.',
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
        },
        2: {
            id: 2,
            name: 'Jane Smith',
            age: 32,
            gender: 'Female',
            email: 'jane.smith@email.com',
            phone: '+1 (555) 234-5678',
            address: '456 Oak Ave, Los Angeles, CA 90210',
            emergencyContact: 'Mike Smith (Husband) - +1 (555) 876-5432',
            medicalHistory: [
                'Diabetes Type 2 (2018)',
                'Gestational Diabetes (2020)'
            ],
            allergies: ['Latex'],
            currentMedications: [
                'Insulin Glargine 20 units daily',
                'Metformin 1000mg twice daily'
            ],
            lastVisit: 'Sep 27, 2025',
            status: 'Active',
            condition: 'Diabetes Type 2',
            notes: 'Patient managing diabetes well with current medication. Blood sugar levels within target range.',
            previousAppointments: [
                {
                    date: '2023-12-10',
                    reason: 'Diabetes management',
                    diagnosis: 'Stable diabetes',
                    treatment: 'Adjusted insulin dosage'
                }
            ]
        },
        3: {
            id: 3,
            name: 'Mike Johnson',
            age: 58,
            gender: 'Male',
            email: 'mike.johnson@email.com',
            phone: '+1 (555) 345-6789',
            address: '789 Pine St, Chicago, IL 60601',
            emergencyContact: 'Sarah Johnson (Daughter) - +1 (555) 765-4321',
            medicalHistory: [
                'Arthritis (2015)',
                'High Blood Pressure (2017)'
            ],
            allergies: ['Aspirin'],
            currentMedications: [
                'Ibuprofen 400mg as needed',
                'Amlodipine 5mg once daily'
            ],
            lastVisit: 'Sep 25, 2025',
            status: 'Active',
            condition: 'Arthritis',
            notes: 'Patient experiencing some joint stiffness. Recommending physical therapy and pain management.',
            previousAppointments: [
                {
                    date: '2023-12-05',
                    reason: 'Arthritis follow-up',
                    diagnosis: 'Osteoarthritis progression',
                    treatment: 'Increased pain management'
                }
            ]
        },
        4: {
            id: 4,
            name: 'Sarah Williams',
            age: 41,
            gender: 'Female',
            email: 'sarah.williams@email.com',
            phone: '+1 (555) 456-7890',
            address: '321 Elm St, Houston, TX 77001',
            emergencyContact: 'Tom Williams (Brother) - +1 (555) 654-3210',
            medicalHistory: [
                'Asthma (2010)',
                'Seasonal Allergies (2012)'
            ],
            allergies: ['Pollen', 'Dust mites'],
            currentMedications: [
                'Albuterol inhaler as needed',
                'Fluticasone 220mcg daily'
            ],
            lastVisit: 'Sep 24, 2025',
            status: 'Active',
            condition: 'Asthma',
            notes: 'Asthma well controlled with current medication. No recent exacerbations.',
            previousAppointments: [
                {
                    date: '2023-12-01',
                    reason: 'Asthma check-up',
                    diagnosis: 'Well-controlled asthma',
                    treatment: 'Continued current inhaler regimen'
                }
            ]
        },
        5: {
            id: 5,
            name: 'Robert Brown',
            age: 63,
            gender: 'Male',
            email: 'robert.brown@email.com',
            phone: '+1 (555) 567-8901',
            address: '654 Maple Dr, Phoenix, AZ 85001',
            emergencyContact: 'Linda Brown (Wife) - +1 (555) 543-2109',
            medicalHistory: [
                'Heart Disease (2016)',
                'High Cholesterol (2014)',
                'Previous Heart Attack (2016)'
            ],
            allergies: ['Contrast dye'],
            currentMedications: [
                'Atorvastatin 40mg once daily',
                'Metoprolol 50mg twice daily',
                'Aspirin 81mg once daily'
            ],
            lastVisit: 'Sep 22, 2025',
            status: 'Under Treatment',
            condition: 'Heart Disease',
            notes: 'Patient recovering well from recent cardiac event. Medication compliance excellent.',
            previousAppointments: [
                {
                    date: '2023-11-20',
                    reason: 'Cardiac follow-up',
                    diagnosis: 'Post-MI recovery',
                    treatment: 'Cardiac rehabilitation program'
                }
            ]
        }
    };

    const patient = patients[parseInt(id)];

    // Initialize patient data and current notes
    React.useEffect(() => {
        if (patient && !patientData) {
            const initialPatientData = { ...patient };
            setPatientData(initialPatientData);
            setCurrentNotes(initialPatientData.notes);
        }
    }, [patient, patientData]);

    // Debug: Track currentNotes changes
    React.useEffect(() => {
        console.log('Current notes changed:', currentNotes);
    }, [currentNotes]);

    if (!patient || !patientData) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h1>
                    <p className="text-gray-600 mb-6">The patient you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/doctor/patients')}
                        className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors"
                    >
                        Back to Patients
                    </button>
                </div>
            </div>
        );
    }

    const handleEditNotes = () => {
        setEditedNotes(currentNotes);
        setIsEditing(true);
    };

    const handleSaveNotes = () => {
        // Update the current notes state and patient data
        setCurrentNotes(editedNotes);
        setPatientData(prev => {
            const updated = { ...prev, notes: editedNotes };
            console.log('Updated patient data:', updated);
            return updated;
        });
        setIsEditing(false);
        // In a real app, this would save to the backend
        console.log('Saving notes:', editedNotes);
    };

    const handleCancelEdit = () => {
        setEditedNotes(currentNotes);
        setIsEditing(false);
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/doctor/patients')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Details</h1>
                        <p className="text-sm sm:text-base text-gray-600 break-words">
                            {patientData.name} • {patientData.condition} • Last visit: {patientData.lastVisit}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patientData.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {patientData.status}
                    </span>
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
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{patientData.name}</h3>
                                <p className="text-sm sm:text-base text-gray-600 truncate">{patientData.age} years old • {patientData.gender}</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-600 truncate">{patientData.email}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{patientData.phone}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-600 truncate">{patientData.address}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Contact */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                        <p className="text-sm text-gray-600">{patientData.emergencyContact}</p>
                    </Card>
                </div>

                {/* Medical Information */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Medical History */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                        <div className="space-y-2">
                            {patientData.medicalHistory.map((condition, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Stethoscope className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{condition}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Allergies */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
                        <div className="flex flex-wrap gap-2">
                            {patientData.allergies.map((allergy, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                    {allergy}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Current Medications */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                        <div className="space-y-2">
                            {patientData.currentMedications.map((medication, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Pill className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{medication}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Doctor's Notes */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Doctor's Notes</h3>
                            {!isEditing && (
                                <button
                                    onClick={handleEditNotes}
                                    className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="space-y-3">
                                <textarea
                                    value={editedNotes}
                                    onChange={(e) => setEditedNotes(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    rows="4"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSaveNotes}
                                        className="flex items-center space-x-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentNotes}</p>
                        )}
                    </Card>

                    {/* Previous Appointments */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Previous Appointments</h3>
                        <div className="space-y-4">
                            {patientData.previousAppointments.map((appointment, index) => (
                                <div key={index} className="border-l-4 border-pink-200 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">{appointment.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {appointment.reason}</p>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Diagnosis:</strong> {appointment.diagnosis}</p>
                                    <p className="text-sm text-gray-600"><strong>Treatment:</strong> {appointment.treatment}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;

import React, { useState } from 'react';
import {
  User,
  Edit3,
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Pill,
  AlertTriangle,
  CheckCircle,
  Save,
  Trash2,
  Plus,
  Activity,
  FileText,
  Clock,
  TrendingUp,
  CreditCard,
  Shield,
  Stethoscope,
  Download,
  Bell,
  Globe,
  Briefcase,
  Droplet,
  Users
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    secondaryPhone: '+1 234-567-8902',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    bloodType: 'O+',
    maritalStatus: 'Married',
    occupation: 'Software Engineer',
    nationality: 'American',
    preferredLanguage: 'English',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '12345',
    country: 'United States',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 234-567-8901',
    emergencyRelationship: 'Spouse',
    preferredContactMethod: 'Email'
  });

  // Medical History State
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: [
      { id: 1, name: 'Hypertension', diagnosed: '2020-03-15', status: 'Active' },
      { id: 2, name: 'Type 2 Diabetes', diagnosed: '2019-08-22', status: 'Managed' },
      { id: 3, name: 'Asthma', diagnosed: '2015-05-10', status: 'Controlled' }
    ],
    medications: [
      { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: '2020-03-20' },
      { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribed: '2020-03-20' },
      { id: 3, name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', prescribed: '2015-05-15' }
    ],
    allergies: [
      { id: 1, allergen: 'Penicillin', reaction: 'Rash, difficulty breathing', severity: 'Severe' },
      { id: 2, allergen: 'Shellfish', reaction: 'Hives, nausea', severity: 'Moderate' },
      { id: 3, allergen: 'Latex', reaction: 'Skin irritation', severity: 'Mild' }
    ]
  });

  const getInitials = (first, last) =>
    [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase();

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (email.length > 100) return 'Email must be less than 100 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone is required';
    if (phone.length > 20) return 'Phone must be less than 20 characters';
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const handlePersonalDetailsChange = (field, value) => {
    let processedValue = value;
    if (field === 'email' && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (field === 'phone' && value.length > 20) {
      processedValue = value.slice(0, 20);
    }
    
    setPersonalDetails(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    if (field === 'email') {
      const error = validateEmail(processedValue);
      setValidationErrors(prev => ({
        ...prev,
        email: error
      }));
    } else if (field === 'phone') {
      const error = validatePhone(processedValue);
      setValidationErrors(prev => ({
        ...prev,
        phone: error
      }));
    }
  };

  const addMedicalItem = (type, newItem) => {
    setMedicalHistory(prev => ({
      ...prev,
      [type]: [...prev[type], { id: Date.now(), ...newItem }]
    }));
  };

  const removeMedicalItem = (type, id) => {
    setMedicalHistory(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const handleSaveProfile = async () => {
    const emailError = validateEmail(personalDetails.email);
    const phoneError = validatePhone(personalDetails.phone);
    
    if (emailError || phoneError) {
      setValidationErrors({
        email: emailError,
        phone: phoneError
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setIsEditing(false);
    setShowAlert(true);
    setValidationErrors({});
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 text-red-700';
      case 'Managed':
        return 'bg-blue-100 text-blue-700';
      case 'Controlled':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe':
        return 'bg-red-100 text-red-700';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Mild':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-800">Profile updated successfully!</span>
            <button onClick={() => setShowAlert(false)} className="ml-2 text-green-400 hover:text-green-600">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Profile & Health Information</h1>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) setValidationErrors({});
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
        >
          <Edit3 className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Details */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-pink-600" />
            <h2 className="text-base font-semibold text-gray-900">Personal Details</h2>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={personalDetails.firstName}
                    onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={personalDetails.middleName}
                    onChange={(e) => handlePersonalDetailsChange('middleName', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={personalDetails.lastName}
                    onChange={(e) => handlePersonalDetailsChange('lastName', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                      className={`w-full pl-7 pr-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-0.5 text-xs text-red-600">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
                      className={`w-full pl-7 pr-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="mt-0.5 text-xs text-red-600">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Secondary Phone</label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <input
                    type="tel"
                    value={personalDetails.secondaryPhone}
                    onChange={(e) => handlePersonalDetailsChange('secondaryPhone', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="date"
                      value={personalDetails.dateOfBirth}
                      onChange={(e) => handlePersonalDetailsChange('dateOfBirth', e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={personalDetails.gender}
                    onChange={(e) => handlePersonalDetailsChange('gender', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Blood Type</label>
                  <div className="relative">
                    <Droplet className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <select
                      value={personalDetails.bloodType}
                      onChange={(e) => handlePersonalDetailsChange('bloodType', e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={personalDetails.maritalStatus}
                    onChange={(e) => handlePersonalDetailsChange('maritalStatus', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="text"
                      value={personalDetails.occupation}
                      onChange={(e) => handlePersonalDetailsChange('occupation', e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nationality</label>
                  <div className="relative">
                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="text"
                      value={personalDetails.nationality}
                      onChange={(e) => handlePersonalDetailsChange('nationality', e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Language</label>
                <div className="relative">
                  <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <select
                    value={personalDetails.preferredLanguage}
                    onChange={(e) => handlePersonalDetailsChange('preferredLanguage', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                  <input
                    type="text"
                    value={personalDetails.address}
                    onChange={(e) => handlePersonalDetailsChange('address', e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={personalDetails.city}
                    onChange={(e) => handlePersonalDetailsChange('city', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={personalDetails.state}
                    onChange={(e) => handlePersonalDetailsChange('state', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={personalDetails.zipCode}
                    onChange={(e) => handlePersonalDetailsChange('zipCode', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={personalDetails.country}
                  onChange={(e) => handlePersonalDetailsChange('country', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <div className="relative">
                      <Users className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <input
                        type="text"
                        value={personalDetails.emergencyContact}
                        onChange={(e) => handlePersonalDetailsChange('emergencyContact', e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <input
                        type="tel"
                        value={personalDetails.emergencyPhone}
                        onChange={(e) => handlePersonalDetailsChange('emergencyPhone', e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={personalDetails.emergencyRelationship}
                    onChange={(e) => handlePersonalDetailsChange('emergencyRelationship', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                <select
                  value={personalDetails.preferredContactMethod}
                  onChange={(e) => handlePersonalDetailsChange('preferredContactMethod', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="SMS">SMS</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(personalDetails.firstName, personalDetails.lastName)}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-gray-900">
                    {personalDetails.firstName} {personalDetails.middleName && personalDetails.middleName + ' '}{personalDetails.lastName}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{personalDetails.dateOfBirth} • {calculateAge(personalDetails.dateOfBirth)} yrs</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    {personalDetails.gender}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    {personalDetails.bloodType}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Email</div>
                    <div className="text-xs font-medium text-gray-900 break-all">{personalDetails.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Phone</div>
                    <div className="text-xs font-medium text-gray-900">{personalDetails.phone}</div>
                    {personalDetails.secondaryPhone && (
                      <div className="text-xs text-gray-600 mt-0.5">Secondary: {personalDetails.secondaryPhone}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Address</div>
                    <div className="text-xs font-medium text-gray-900">
                      {personalDetails.address}, {personalDetails.city}, {personalDetails.state} {personalDetails.zipCode}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">{personalDetails.country}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Occupation</div>
                    <div className="text-xs font-medium text-gray-900">{personalDetails.occupation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Nationality & Language</div>
                    <div className="text-xs font-medium text-gray-900">{personalDetails.nationality} • {personalDetails.preferredLanguage}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Emergency Contact</div>
                    <div className="text-xs font-medium text-gray-900">{personalDetails.emergencyContact} ({personalDetails.emergencyRelationship})</div>
                    <div className="text-xs text-gray-600 mt-0.5">{personalDetails.emergencyPhone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <Bell className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Preferred Contact</div>
                    <div className="text-xs font-medium text-gray-900">{personalDetails.preferredContactMethod}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Medical History */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-red-600" />
            <h2 className="text-base font-semibold text-gray-900">Medical History</h2>
          </div>

          <div className="space-y-4">
            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Medical Conditions</h3>
                {isEditing && (
                  <button
                    onClick={() => setShowAddCondition(true)}
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {medicalHistory.conditions.map((condition) => (
                  <div key={condition.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-0.5">{condition.name}</div>
                      <div className="text-[10px] text-gray-600 flex items-center gap-1">
                        <span>Diagnosed: {condition.diagnosed}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(condition.status)}`}>
                          {condition.status}
                        </span>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeMedicalItem('conditions', condition.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Current Medications</h3>
                {isEditing && (
                  <button
                    onClick={() => setShowAddMedication(true)}
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {medicalHistory.medications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-0.5">{medication.name}</div>
                      <div className="text-[10px] text-gray-600">
                        {medication.dosage} • {medication.frequency} • Prescribed: {medication.prescribed}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeMedicalItem('medications', medication.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Allergies</h3>
                {isEditing && (
                  <button
                    onClick={() => setShowAddAllergy(true)}
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {medicalHistory.allergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-0.5">{allergy.allergen}</div>
                      <div className="text-[10px] text-gray-600 flex items-center gap-1">
                        <span>{allergy.reaction}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getSeverityColor(allergy.severity)}`}>
                          {allergy.severity}
                        </span>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeMedicalItem('allergies', allergy.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Summary Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Conditions</div>
              <div className="text-lg font-bold text-gray-900">{medicalHistory.conditions.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Medications</div>
              <div className="text-lg font-bold text-gray-900">{medicalHistory.medications.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Allergies</div>
              <div className="text-lg font-bold text-gray-900">{medicalHistory.allergies.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Age</div>
              <div className="text-lg font-bold text-gray-900">{calculateAge(personalDetails.dateOfBirth)} yrs</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Information Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">Profile Updated</div>
                <div className="text-[10px] text-gray-600">2 days ago</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">Medication Added</div>
                <div className="text-[10px] text-gray-600">1 week ago</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">Health Check Completed</div>
                <div className="text-[10px] text-gray-600">2 weeks ago</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">Appointment Scheduled</div>
                <div className="text-[10px] text-gray-600">3 weeks ago</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Metrics */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900">Health Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="text-xs font-medium text-gray-900">Blood Pressure</div>
                <div className="text-[10px] text-gray-600">Last checked: 3 days ago</div>
              </div>
              <div className="text-xs font-bold text-green-600">120/80</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="text-xs font-medium text-gray-900">Heart Rate</div>
                <div className="text-[10px] text-gray-600">Last checked: 3 days ago</div>
              </div>
              <div className="text-xs font-bold text-blue-600">72 bpm</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="text-xs font-medium text-gray-900">Weight</div>
                <div className="text-[10px] text-gray-600">Last checked: 1 week ago</div>
              </div>
              <div className="text-xs font-bold text-purple-600">165 lbs</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="text-xs font-medium text-gray-900">BMI</div>
                <div className="text-[10px] text-gray-600">Last checked: 1 week ago</div>
              </div>
              <div className="text-xs font-bold text-orange-600">24.2</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-pink-600" />
            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-2 bg-pink-50 hover:bg-pink-100 rounded transition-colors">
              <span className="text-xs font-medium text-gray-900">View Reports</span>
              <span className="text-xs text-pink-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
              <span className="text-xs font-medium text-gray-900">Book Appointment</span>
              <span className="text-xs text-blue-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-green-50 hover:bg-green-100 rounded transition-colors">
              <span className="text-xs font-medium text-gray-900">Download Records</span>
              <span className="text-xs text-green-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-purple-50 hover:bg-purple-100 rounded transition-colors">
              <span className="text-xs font-medium text-gray-900">Emergency Contact</span>
              <span className="text-xs text-purple-600">→</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Insurance & Additional Info */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insurance Information */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">Insurance Information</h3>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Primary Insurance</div>
              <div className="text-xs text-gray-600">Blue Cross Blue Shield</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Policy #: BC123456789</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Coverage Type</div>
              <div className="text-xs text-gray-600">Health Maintenance Organization (HMO)</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Member Since</div>
              <div className="text-xs text-gray-600">January 2020</div>
            </div>
          </div>
        </Card>

        {/* Primary Care Provider */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-900">Primary Care Provider</h3>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Dr. Sarah Johnson</div>
              <div className="text-xs text-gray-600">Internal Medicine</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Contact</div>
              <div className="text-xs text-gray-600">(555) 123-4567</div>
              <div className="text-xs text-gray-600">sarah.johnson@healthcare.com</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs font-medium text-gray-900 mb-1">Next Appointment</div>
              <div className="text-xs text-gray-600">December 15, 2025 at 10:00 AM</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications & Documents */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Reminders */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Reminders</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
              <div>
                <div className="text-xs font-medium text-gray-900">Medication Reminder</div>
                <div className="text-[10px] text-gray-600">Metformin - Due in 2 hours</div>
              </div>
              <div className="text-xs font-bold text-orange-600">2h</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
              <div>
                <div className="text-xs font-medium text-gray-900">Appointment</div>
                <div className="text-[10px] text-gray-600">Dr. Johnson - Dec 15, 2025</div>
              </div>
              <div className="text-xs font-bold text-blue-600">19d</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
              <div>
                <div className="text-xs font-medium text-gray-900">Health Check</div>
                <div className="text-[10px] text-gray-600">Annual physical - Jan 2026</div>
              </div>
              <div className="text-xs font-bold text-green-600">36d</div>
            </div>
          </div>
        </Card>

        {/* Important Documents */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Download className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900">Important Documents</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Medical Records</span>
              </div>
              <Download className="h-3 w-3 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Insurance Card</span>
              </div>
              <Download className="h-3 w-3 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Lab Results</span>
              </div>
              <Download className="h-3 w-3 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Prescription History</span>
              </div>
              <Download className="h-3 w-3 text-purple-600" />
            </button>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-xs font-medium"
          >
            {isSaving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;

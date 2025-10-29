import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    FileText, 
    Calendar, 
    DollarSign,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Upload,
    MapPin,
    Phone,
    Mail,
    GraduationCap,
    Award,
    Clock,
    Globe,
    Camera,
    X,
    AlertCircle
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const ProfileWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        languages: [],
        
        // Step 2: License & Verification
        licenseNumber: '',
        licenseExpiry: '',
        specialty: '',
        education: '',
        experience: '',
        documents: [],
        
        // Step 3: Schedule
        availability: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '10:00', end: '14:00', available: false },
            sunday: { start: '10:00', end: '14:00', available: false }
        },
        
        // Step 4: Fees & Consultation
        consultationType: '',
        consultationFee: '',
        followUpFee: '',
        emergencyFee: '',
        teleconsultationFee: '',
        appointmentDuration: 30
    });

    const [errors, setErrors] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const steps = [
        { id: 1, title: 'Personal Info', icon: User, description: 'Basic information about you' },
        { id: 2, title: 'License & Verification', icon: FileText, description: 'Professional credentials' },
        { id: 3, title: 'Schedule', icon: Calendar, description: 'Your availability' },
        { id: 4, title: 'Fees', icon: DollarSign, description: 'Service pricing' }
    ];

    const specialties = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
        'Hematology', 'Infectious Disease', 'Nephrology', 'Neurology',
        'Oncology', 'Pediatrics', 'Psychiatry', 'Pulmonology',
        'Rheumatology', 'Urology', 'Other'
    ];

    const languages = [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
        'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleArrayChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: prev[name].includes(value)
                ? prev[name].filter(item => item !== value)
                : [...prev[name], value]
        }));
    };

    const handleAvailabilityChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability[day],
                    [field]: value
                }
            }
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                if (!formData.phone) newErrors.phone = 'Phone is required';
                if (!formData.location) newErrors.location = 'Location is required';
                if (!formData.bio) newErrors.bio = 'Bio is required';
                if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
                break;
            case 2:
                if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
                if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiry date is required';
                if (!formData.specialty) newErrors.specialty = 'Specialty is required';
                if (!formData.education) newErrors.education = 'Education is required';
                if (!formData.experience) newErrors.experience = 'Experience is required';
                break;
            case 3:
                const hasAvailability = Object.values(formData.availability).some(day => day.available);
                if (!hasAvailability) newErrors.availability = 'At least one day must be available';
                break;
            case 4:
                if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
                if (!formData.followUpFee) newErrors.followUpFee = 'Follow-up fee is required';
                if (!formData.emergencyFee) newErrors.emergencyFee = 'Emergency fee is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        
        try {
            // Simulate file upload process
            const uploadPromises = files.map(file => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const fileData = {
                            id: Date.now() + Math.random(),
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            uploadDate: new Date().toISOString(),
                            status: 'uploaded'
                        };
                        resolve(fileData);
                    }, 1000 + Math.random() * 2000); // Simulate upload time
                });
            });

            const uploadedFileData = await Promise.all(uploadPromises);
            setUploadedFiles(prev => [...prev, ...uploadedFileData]);
            
            // Update form data with uploaded files
            setFormData(prev => ({
                ...prev,
                documents: [...prev.documents, ...uploadedFileData]
            }));
            
        } catch (error) {
            console.error('File upload error:', error);
            setToastMessage('Error uploading files. Please try again.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter(file => file.id !== fileId)
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = () => {
        if (validateStep(4)) {
            // Save profile data
            navigate('/doctor');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="doctor@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="New York, NY"
                                    />
                                </div>
                                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio *
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Tell us about your medical background and experience..."
                            />
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Languages Spoken *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                                {languages.map(language => (
                                    <label key={language} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.languages.includes(language)}
                                            onChange={() => handleArrayChange('languages', language)}
                                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                        />
                                        <span className="text-sm text-gray-700">{language}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medical License Number *
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="MD12345"
                                />
                                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Expiry Date *
                                </label>
                                <input
                                    type="date"
                                    name="licenseExpiry"
                                    value={formData.licenseExpiry}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                {errors.licenseExpiry && <p className="text-red-500 text-sm mt-1">{errors.licenseExpiry}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medical Specialty *
                            </label>
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="">Select your specialty</option>
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty}>
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                            {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Education *
                            </label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="MD, Harvard Medical School"
                                />
                            </div>
                            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Years of Experience *
                            </label>
                            <div className="relative">
                                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="8 years"
                                />
                            </div>
                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Documents
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Upload your medical license, certifications, and other documents
                                </p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-pink-600 hover:text-pink-700 font-medium"
                                >
                                    Choose Files
                                </label>
                                
                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-200 border-t-pink-500"></div>
                                            <span className="text-sm text-gray-600">Uploading files...</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Uploaded Files List */}
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                                        {uploadedFiles.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Availability</h3>
                            <p className="text-gray-600">Choose when you're available for appointments</p>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(formData.availability).map(([day, schedule]) => (
                                <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 text-sm font-medium text-gray-900 capitalize">
                                            {day}
                                        </div>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={schedule.available}
                                                onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                            />
                                            <span className="text-sm text-gray-700">Available</span>
                                        </label>
                                    </div>
                                    
                                    {schedule.available && (
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <input
                                                type="time"
                                                value={schedule.start}
                                                onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                            <span className="text-gray-500">to</span>
                                            <input
                                                type="time"
                                                value={schedule.end}
                                                onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Fees & Consultation</h3>
                            <p className="text-gray-600">Define your consultation type and service pricing</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Type *
                                </label>
                                <select
                                    name="consultationType"
                                    value={formData.consultationType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="">Select consultation type</option>
                                    <option value="online">Online Consultation</option>
                                    <option value="in-person">In-Person Consultation</option>
                                    <option value="both">Both Online & In-Person</option>
                                </select>
                                {errors.consultationType && <p className="text-red-500 text-sm mt-1">{errors.consultationType}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Duration (minutes) *
                                </label>
                                <input
                                    type="number"
                                    name="appointmentDuration"
                                    value={formData.appointmentDuration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="30"
                                />
                                {errors.appointmentDuration && <p className="text-red-500 text-sm mt-1">{errors.appointmentDuration}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Fee *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="150"
                                    />
                                </div>
                                {errors.consultationFee && <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Follow-up Fee *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="followUpFee"
                                        value={formData.followUpFee}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="100"
                                    />
                                </div>
                                {errors.followUpFee && <p className="text-red-500 text-sm mt-1">{errors.followUpFee}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Emergency Fee *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="emergencyFee"
                                        value={formData.emergencyFee}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="250"
                                    />
                                </div>
                                {errors.emergencyFee && <p className="text-red-500 text-sm mt-1">{errors.emergencyFee}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teleconsultation Fee
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="teleconsultationFee"
                                        value={formData.teleconsultationFee}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="120"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-left mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Set up your doctor profile to start accepting appointments</p>
                </div>

                {/* Progress Steps - match registration style */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-6 md:gap-10">
                        {steps.map((step, index) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                                                isActive
                                                    ? 'bg-pink-500 text-white ring-4 ring-pink-200 scale-110'
                                                    : isCompleted
                                                    ? 'bg-green-500 text-white ring-2 ring-green-200'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-7 h-7" />
                                            ) : (
                                                <span className="text-base">{step.id}</span>
                                            )}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <p className={`text-sm font-semibold ${
                                                currentStep >= step.id ? 'text-pink-600' : 'text-gray-500'
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-10 md:w-16 h-0.5 mx-2 transition-all duration-300 rounded-full ${
                                                currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <Card className="p-0">
                    <div className="px-0 py-8">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 px-8 pb-8">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>

                        <div className="text-sm text-gray-500">
                            Step {currentStep} of {steps.length}
                        </div>

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center space-x-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                            >
                                <span>Next</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <CheckCircle className="h-4 w-4" />
                                <span>Complete Profile</span>
                            </button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-red-700 font-medium flex-1">{toastMessage}</span>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileWizard;


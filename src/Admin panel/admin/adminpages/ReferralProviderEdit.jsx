import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Save, 
    Building2,
    Globe,
    FileText,
    DollarSign,
    Mail,
    CheckCircle,
    X
} from 'lucide-react';
import Card from '../admincomponents/Card';

const ReferralProviderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        baseUrl: '',
        referralParamKey: '',
        commissionModel: '',
        contact: '',
        termsUrl: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [isLoading, setIsLoading] = useState(false);

    // Sample provider data - in real app, fetch by ID
    const providers = [
        {
            id: 1,
            name: 'AirDoctor',
            type: 'Medical Provider',
            totalReferrals: 145,
            successfulBookings: 98,
            conversionRate: 67.6,
            totalRevenue: 14700,
            commissionEarned: 1470,
            status: 'Active',
            logo: 'AD',
            lastActivity: '2024-01-17',
            baseUrl: 'https://airdoctor.com',
            referralParamKey: 'ref_id',
            commissionModel: 'Percentage (10%)',
            contact: 'partnerships@airdoctor.com',
            termsUrl: 'https://airdoctor.com/terms'
        },
        {
            id: 2,
            name: 'Doctor On Call',
            type: 'Telemedicine Platform',
            totalReferrals: 89,
            successfulBookings: 67,
            conversionRate: 75.3,
            totalRevenue: 10050,
            commissionEarned: 1005,
            status: 'Active',
            logo: 'DOC',
            lastActivity: '2024-01-16',
            baseUrl: 'https://doctoroncall.com',
            referralParamKey: 'partner_ref',
            commissionModel: 'Fixed ($15)',
            contact: 'partners@doctoroncall.com',
            termsUrl: 'https://doctoroncall.com/partner-terms'
        },
        {
            id: 3,
            name: 'HealthCare Connect',
            type: 'Healthcare Network',
            totalReferrals: 67,
            successfulBookings: 42,
            conversionRate: 62.7,
            totalRevenue: 6300,
            commissionEarned: 630,
            status: 'Active',
            logo: 'HCC',
            lastActivity: '2024-01-15',
            baseUrl: 'https://healthcareconnect.com',
            referralParamKey: 'source_id',
            commissionModel: 'Percentage (10%)',
            contact: 'contact@healthcareconnect.com',
            termsUrl: 'https://healthcareconnect.com/terms'
        },
        {
            id: 4,
            name: 'MediLink Partners',
            type: 'Medical Services',
            totalReferrals: 34,
            successfulBookings: 23,
            conversionRate: 67.6,
            totalRevenue: 3450,
            commissionEarned: 345,
            status: 'Inactive',
            logo: 'MLP',
            lastActivity: '2024-01-14',
            baseUrl: 'https://medilinkpartners.com',
            referralParamKey: 'ref',
            commissionModel: 'Percentage (10%)',
            contact: 'info@medilinkpartners.com',
            termsUrl: 'https://medilinkpartners.com/terms'
        }
    ];

    useEffect(() => {
        const foundProvider = providers.find(p => p.id === parseInt(id));
        if (foundProvider) {
            setProvider(foundProvider);
            setFormData({
                name: foundProvider.name,
                logo: foundProvider.logo,
                baseUrl: foundProvider.baseUrl,
                referralParamKey: foundProvider.referralParamKey,
                commissionModel: foundProvider.commissionModel,
                contact: foundProvider.contact,
                termsUrl: foundProvider.termsUrl
            });
        }
    }, [id]);

    const showToastNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate('/admin/referral-providers');
    };

    const handleSave = async () => {
        setIsLoading(true);
        
        // Validation
        if (!formData.name || !formData.baseUrl || !formData.referralParamKey || !formData.commissionModel || !formData.contact) {
            showToastNotification('Please fill in all required fields (marked with *)', 'error');
            setIsLoading(false);
            return;
        }

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In real app, update provider via API
            console.log('Updating provider:', formData);
            
            showToastNotification('Provider updated successfully!', 'success');
            
            // Navigate back after success
            setTimeout(() => {
                navigate('/admin/referral-providers');
            }, 1500);
            
        } catch (error) {
            showToastNotification('Failed to update provider. Please try again.', 'error');
            setIsLoading(false);
        }
    };

    if (!provider) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Provider not found</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Provider</h1>
                        <p className="text-sm sm:text-base text-gray-600">Update referral provider information</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Provider Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="e.g., AirDoctor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo (Abbreviation)
                                </label>
                                <input
                                    type="text"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="e.g., AD"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Technical Details */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Base URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    name="baseUrl"
                                    value={formData.baseUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Referral Parameter Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="referralParamKey"
                                    value={formData.referralParamKey}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="e.g., ref_id"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Model <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="commissionModel"
                                    value={formData.commissionModel}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="e.g., Percentage (10%) or Fixed ($15)"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="contact@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Terms & Conditions URL
                                </label>
                                <input
                                    type="url"
                                    name="termsUrl"
                                    value={formData.termsUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="https://example.com/terms"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Provider Status */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Status</span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    provider.status === 'Active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {provider.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last Activity</span>
                                <span className="text-sm font-medium text-gray-900">{provider.lastActivity}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Performance Metrics */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Referrals</span>
                                <span className="text-sm font-medium text-gray-900">{provider.totalReferrals}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Successful Bookings</span>
                                <span className="text-sm font-medium text-gray-900">{provider.successfulBookings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Conversion Rate</span>
                                <span className="text-sm font-medium text-gray-900">{provider.conversionRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Revenue</span>
                                <span className="text-sm font-medium text-gray-900">${provider.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Commission Earned</span>
                                <span className="text-sm font-medium text-gray-900">${provider.commissionEarned.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.open(formData.baseUrl, '_blank')}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span>Visit Website</span>
                            </button>
                            <button
                                onClick={() => window.open(`mailto:${formData.contact}`, '_blank')}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Send Email</span>
                            </button>
                            {formData.termsUrl && (
                                <button
                                    onClick={() => window.open(formData.termsUrl, '_blank')}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>View Terms</span>
                                </button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div 
                    className="fixed top-4 right-4 z-50"
                    style={{
                        animation: 'slideInRight 0.3s ease-out'
                    }}
                >
                    <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] ${
                        toastType === 'success' ? 'bg-green-50 border border-green-200' :
                        toastType === 'error' ? 'bg-red-50 border border-red-200' :
                        'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <div className={`flex-shrink-0 ${
                            toastType === 'success' ? 'text-green-600' :
                            toastType === 'error' ? 'text-red-600' :
                            'text-yellow-600'
                        }`}>
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${
                                toastType === 'success' ? 'text-green-800' :
                                toastType === 'error' ? 'text-red-800' :
                                'text-yellow-800'
                            }`}>
                                {toastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className={`flex-shrink-0 ${
                                toastType === 'success' ? 'text-green-600 hover:text-green-800' :
                                toastType === 'error' ? 'text-red-600 hover:text-red-800' :
                                'text-yellow-600 hover:text-yellow-800'
                            }`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralProviderEdit;

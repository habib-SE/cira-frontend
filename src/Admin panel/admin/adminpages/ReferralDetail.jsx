import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    User, 
    Calendar,
    DollarSign,
    ExternalLink,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    TrendingUp,
    Target,
    X,
    Building2,
    Globe,
    Mail,
    FileText
} from 'lucide-react';
import Card from '../admincomponents/Card';

const ReferralDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [referral, setReferral] = useState(null);

    // Sample referral data - in real app, fetch by ID
    const referrals = [
        {
            id: 1,
            referralId: 'REF-2024-001',
            provider: 'AirDoctor',
            patient: 'John Doe',
            sourcePage: 'landing-page',
            clicks: 145,
            converted: 98,
            commission: 1470.00,
            status: 'Completed',
            createdAt: '2024-01-15',
            appointmentId: 'APT-2024-001',
            doctor: 'Dr. Sarah Johnson',
            amount: 150.00,
            clickSource: 'Google Ads',
            commissionTier: 'Standard',
            conversionRate: 67.6,
            email: 'john.doe@example.com',
            phone: '+1 234-567-8900'
        },
        {
            id: 2,
            referralId: 'REF-2024-002',
            provider: 'Doctor On Call',
            patient: 'Jane Smith',
            sourcePage: 'home-page',
            clicks: 89,
            converted: 67,
            commission: 1005.00,
            status: 'Completed',
            createdAt: '2024-01-15',
            appointmentId: 'APT-2024-002',
            doctor: 'Dr. Michael Chen',
            amount: 120.00,
            clickSource: 'Facebook Ads',
            commissionTier: 'Premium',
            conversionRate: 75.3,
            email: 'jane.smith@example.com',
            phone: '+1 234-567-8901'
        },
        {
            id: 3,
            referralId: 'REF-2024-003',
            provider: 'HealthCare Connect',
            patient: 'Mike Johnson',
            sourcePage: 'search-results',
            clicks: 67,
            converted: 42,
            commission: 630.00,
            status: 'Pending',
            createdAt: '2024-01-16',
            appointmentId: null,
            doctor: null,
            amount: 0.00,
            clickSource: 'Organic Search',
            commissionTier: 'Standard',
            conversionRate: 62.7,
            email: 'mike.johnson@example.com',
            phone: '+1 234-567-8902'
        },
        {
            id: 4,
            referralId: 'REF-2024-004',
            provider: 'AirDoctor',
            patient: 'Sarah Wilson',
            sourcePage: 'doctor-profile',
            clicks: 145,
            converted: 98,
            commission: 1470.00,
            status: 'Completed',
            createdAt: '2024-01-16',
            appointmentId: 'APT-2024-003',
            doctor: 'Dr. David Kim',
            amount: 100.00,
            clickSource: 'Direct Link',
            commissionTier: 'Standard',
            conversionRate: 67.6,
            email: 'sarah.wilson@example.com',
            phone: '+1 234-567-8903'
        },
        {
            id: 5,
            referralId: 'REF-2024-005',
            provider: 'MediLink Partners',
            patient: 'Robert Brown',
            sourcePage: 'pricing-page',
            clicks: 34,
            converted: 23,
            commission: 345.00,
            status: 'Scheduled',
            createdAt: '2024-01-17',
            appointmentId: 'APT-2024-004',
            doctor: 'Dr. Sarah Johnson',
            amount: 150.00,
            clickSource: 'Email Campaign',
            commissionTier: 'Basic',
            conversionRate: 67.6,
            email: 'robert.brown@example.com',
            phone: '+1 234-567-8904'
        },
        {
            id: 6,
            referralId: 'REF-2024-006',
            provider: 'AirDoctor',
            patient: 'Alice Cooper',
            sourcePage: 'landing-page',
            clicks: 145,
            converted: 0,
            commission: 0.00,
            status: 'Not Converted',
            createdAt: '2024-01-17',
            appointmentId: null,
            doctor: null,
            amount: 0.00,
            clickSource: 'Google Ads',
            commissionTier: 'Standard',
            conversionRate: 0,
            email: 'alice.cooper@example.com',
            phone: '+1 234-567-8905'
        }
    ];

    useEffect(() => {
        const foundReferral = referrals.find(r => r.id === parseInt(id));
        setReferral(foundReferral);
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'Not Converted':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Scheduled':
                return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case 'Not Converted':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    if (!referral) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Referral not found</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/referrals')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Referral Details</h1>
                        <p className="text-sm sm:text-base text-gray-600">{referral.referralId}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status}
                    </span>
                </div>
            </div>

            {/* Main Form Layout */}
            <Card className="p-8">
                <div className="space-y-6">
                    {/* Referral Information Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                            Referral Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Referral ID</label>
                                <p className="text-gray-900 font-medium">{referral.referralId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Provider</label>
                                <p className="text-gray-900 font-medium">{referral.provider}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Source Page</label>
                                <p className="text-gray-900">{referral.sourcePage}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Click Source</label>
                                <p className="text-gray-900">{referral.clickSource}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Commission Tier</label>
                                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {referral.commissionTier}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Created At</label>
                                <p className="text-gray-900">{referral.createdAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Information Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-pink-600" />
                            </div>
                            Patient Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                                <p className="text-gray-900 font-medium">{referral.patient}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                <p className="text-gray-900">{referral.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                                <p className="text-gray-900">{referral.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <Target className="w-4 h-4 text-green-600" />
                            </div>
                            Performance Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Total Clicks</label>
                                <p className="text-2xl font-bold text-gray-900">{referral.clicks}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Converted</label>
                                <p className="text-2xl font-bold text-green-600">{referral.converted}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Conversion Rate</label>
                                <p className="text-2xl font-bold text-gray-900">{referral.conversionRate.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                <DollarSign className="w-4 h-4 text-yellow-600" />
                            </div>
                            Financial Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Total Commission</label>
                                <p className="text-2xl font-bold text-green-600">${referral.commission.toFixed(2)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Commission Tier</label>
                                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {referral.commissionTier}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Provider Information Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            Provider Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Provider Name</label>
                                <p className="text-gray-900 font-medium">{referral.provider}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Commission Tier</label>
                                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {referral.commissionTier}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Website</label>
                                <a 
                                    href={
                                        referral.provider === 'AirDoctor' ? 'https://airdoctor.com' : 
                                        referral.provider === 'Doctor On Call' ? 'https://doctoroncall.com' :
                                        referral.provider === 'HealthCare Connect' ? 'https://healthcareconnect.com' :
                                        'https://medilinkpartners.com'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center space-x-1"
                                >
                                    <span>Visit Website</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Contact Email</label>
                                <a 
                                    href={`mailto:${
                                        referral.provider === 'AirDoctor' ? 'partnerships@airdoctor.com' :
                                        referral.provider === 'Doctor On Call' ? 'partners@doctoroncall.com' :
                                        referral.provider === 'HealthCare Connect' ? 'contact@healthcareconnect.com' :
                                        'info@medilinkpartners.com'
                                    }`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {referral.provider === 'AirDoctor' ? 'partnerships@airdoctor.com' :
                                     referral.provider === 'Doctor On Call' ? 'partners@doctoroncall.com' :
                                     referral.provider === 'HealthCare Connect' ? 'contact@healthcareconnect.com' :
                                     'info@medilinkpartners.com'}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Information Section (if exists) */}
                    {referral.appointmentId && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                Appointment Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Appointment ID</label>
                                    <p className="text-gray-900 font-medium">{referral.appointmentId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Doctor</label>
                                    <p className="text-gray-900">{referral.doctor}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Amount</label>
                                    <p className="text-gray-900 font-medium">${referral.amount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:space-x-4 sm:gap-0 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/admin/referrals')}
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
                        >
                            Back to Referrals
                        </button>
                        <button
                            onClick={() => navigate('/admin/referral-providers')}
                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                        >
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span>Manage Providers</span>
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ReferralDetail;

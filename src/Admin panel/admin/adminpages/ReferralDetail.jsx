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
    Target
} from 'lucide-react';
import Card from '../admincomponents/Card';

const ReferralDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [referral, setReferral] = useState(null);
    const [showProviderModal, setShowProviderModal] = useState(false);

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
            </div>

            {/* Status Banner */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(referral.status)}
                        <div>
                            <h3 className="font-semibold text-gray-900">Referral Status</h3>
                            <p className="text-sm text-gray-600">Current status of the referral</p>
                        </div>
                    </div>
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status}
                    </span>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Referral Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Referral ID</p>
                                    <p className="font-medium text-gray-900">{referral.referralId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Provider</p>
                                    <p className="font-medium text-gray-900">{referral.provider}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Source Page</p>
                                    <p className="font-medium text-gray-900">{referral.sourcePage}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Click Source</p>
                                    <p className="font-medium text-gray-900">{referral.clickSource}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Commission Tier</p>
                                    <p className="font-medium text-gray-900">{referral.commissionTier}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Created At</p>
                                    <p className="font-medium text-gray-900">{referral.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Patient Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium text-gray-900">{referral.patient}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{referral.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium text-gray-900">{referral.phone}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Appointment Information */}
                    {referral.appointmentId && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Appointment ID</p>
                                        <p className="font-medium text-gray-900">{referral.appointmentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Doctor</p>
                                        <p className="font-medium text-gray-900">{referral.doctor}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Amount</p>
                                        <p className="font-medium text-gray-900">${referral.amount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Performance Metrics */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-600">Clicks</span>
                                </div>
                                <span className="font-semibold text-gray-900">{referral.clicks}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b">
                                <div className="flex items-center space-x-2">
                                    <Target className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-600">Converted</span>
                                </div>
                                <span className="font-semibold text-gray-900">{referral.converted}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Conversion Rate</span>
                                <span className="font-semibold text-gray-900">{referral.conversionRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </Card>

                    {/* Financial Summary */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Total Commission</span>
                                <span className="font-semibold text-green-600">${referral.commission.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Commission Tier</span>
                                <span className="font-semibold text-gray-900">{referral.commissionTier}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Provider Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider</h2>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Referral Provider</p>
                            <p className="font-medium text-gray-900">{referral.provider}</p>
                            <button 
                                onClick={() => {
                                    console.log('View Provider Details clicked for:', referral.provider);
                                    setShowProviderModal(true);
                                }}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">View Provider Details</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Provider Details Modal */}
            {showProviderModal && referral && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Provider Details</h2>
                                <button
                                    onClick={() => setShowProviderModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Provider Name</p>
                                        <p className="font-medium text-gray-900">{referral.provider}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Commission Tier</p>
                                        <p className="font-medium text-gray-900">{referral.commissionTier}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Website</p>
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
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact Email</p>
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

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold text-gray-900 mb-2">Performance Summary</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Clicks</p>
                                            <p className="font-medium text-gray-900">{referral.clicks}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Converted</p>
                                            <p className="font-medium text-gray-900">{referral.converted}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Conversion Rate</p>
                                            <p className="font-medium text-gray-900">{referral.conversionRate.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowProviderModal(false)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowProviderModal(false);
                                            navigate('/admin/referral-providers');
                                        }}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                    >
                                        Manage Provider
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ReferralDetail;

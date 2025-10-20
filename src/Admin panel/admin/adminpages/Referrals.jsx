import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TrendingUp, 
    Search, 
    Filter, 
    ExternalLink, 
    DollarSign,
    Users,
    Calendar,
    Award,
    Target,
    Eye,
    Settings,
    Plus
} from 'lucide-react';
import Card from '../admincomponents/Card';
import Chart from '../admincomponents/Chart';

const Referrals = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProvider, setFilterProvider] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');

    // Sample referral data with new fields
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
            commissionTier: 'Standard'
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
            commissionTier: 'Premium'
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
            commissionTier: 'Standard'
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
            commissionTier: 'Standard'
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
            commissionTier: 'Basic'
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
            commissionTier: 'Standard'
        }
    ];

    // Sample provider data for provider management
    const referralProviders = [
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

    // Chart data for referral trends
    const referralTrendsData = [
        { name: 'Jan', referrals: 45, bookings: 32 },
        { name: 'Feb', referrals: 52, bookings: 38 },
        { name: 'Mar', referrals: 48, bookings: 35 },
        { name: 'Apr', referrals: 61, bookings: 44 },
        { name: 'May', referrals: 55, bookings: 41 },
        { name: 'Jun', referrals: 67, bookings: 48 },
    ];

    const conversionData = [
        { name: 'Air Doctor', value: 67.6 },
        { name: 'Doctor On Call', value: 75.3 },
        { name: 'HealthCare Connect', value: 62.7 },
        { name: 'MediLink Partners', value: 67.6 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter data
    const filteredProviders = referralProviders.filter(provider => {
        const matchesSearch = searchTerm === '' || 
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProvider = filterProvider === '' || provider.name === filterProvider;
        
        return matchesSearch && matchesProvider;
    });

    const filteredReferrals = referrals.filter(referral => {
        const matchesSearch = searchTerm === '' || 
            referral.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referralId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProvider = filterProvider === '' || referral.provider === filterProvider;
        const matchesStatus = filterStatus === '' || referral.status === filterStatus;
        
        return matchesSearch && matchesProvider && matchesStatus;
    });

    // Calculate statistics
    const totalReferrals = referralProviders.reduce((sum, provider) => sum + provider.totalReferrals, 0);
    const totalBookings = referralProviders.reduce((sum, provider) => sum + provider.successfulBookings, 0);
    const totalCommission = referralProviders.reduce((sum, provider) => sum + provider.commissionEarned, 0);
    const overallConversionRate = totalReferrals > 0 ? ((totalBookings / totalReferrals) * 100).toFixed(1) : 0;

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Referral Management</h1>
                    <p className="text-sm sm:text-base text-gray-600">Track referral bookings and commissions by provider</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate('/admin/referral-providers')}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Manage Providers</span>
                        <span className="sm:hidden">Providers</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Total Referrals</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{totalReferrals}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Successful Bookings</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{totalBookings}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Conversion Rate</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{overallConversionRate}%</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Total Commission</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">${totalCommission.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Referral Trends</h3>
                        <p className="text-sm text-gray-600">Monthly referral and booking trends</p>
                    </div>
                    <Chart type="line" data={referralTrendsData} height={300} />
                </Card>

                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Conversion Rates</h3>
                        <p className="text-sm text-gray-600">Conversion rates by provider</p>
                    </div>
                    <Chart type="bar" data={conversionData} height={300} />
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search referrals, patients, or providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <select
                            value={filterProvider}
                            onChange={(e) => setFilterProvider(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Providers</option>
                            {referralProviders.map(provider => (
                                <option key={provider.id} value={provider.name}>{provider.name}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Not Converted">Not Converted</option>
                        </select>
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Time</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterProvider || filterStatus || filterPeriod) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterProvider('');
                                    setFilterStatus('');
                                    setFilterPeriod('');
                                }}
                                className="w-full sm:w-auto px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm whitespace-nowrap"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Referral Providers */}
            <Card className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Referral Providers</h3>
                <div className="space-y-3 sm:space-y-4">
                    {filteredProviders.map((provider) => (
                        <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                                    {provider.logo}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{provider.name}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{provider.type}</p>
                                    <p className="text-xs text-gray-500">Last activity: {provider.lastActivity}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900">{provider.totalReferrals}</p>
                                        <p className="text-xs text-gray-500">Referrals</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900">{provider.successfulBookings}</p>
                                        <p className="text-xs text-gray-500">Bookings</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900">{provider.conversionRate}%</p>
                                        <p className="text-xs text-gray-500">Conversion</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900">${provider.commissionEarned.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Commission</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center sm:justify-end space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(provider.status)}`}>
                                        {provider.status}
                                    </span>
                                    <button 
                                        onClick={() => {
                                            console.log('View provider details clicked for:', provider.name);
                                            // Navigate to provider management page
                                            navigate('/admin/referral-providers');
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                        title="View Provider Details"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Referrals List */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Referrals List</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Referral ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Provider
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source Page
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Clicks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Converted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReferrals.map((referral) => (
                                <tr key={referral.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{referral.referralId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.provider}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.patient}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.sourcePage}</div>
                                        {referral.clickSource && (
                                            <div className="text-xs text-gray-500">{referral.clickSource}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.clicks}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.converted}</div>
                                        {referral.converted > 0 && (
                                            <div className="text-xs text-gray-500">
                                                {((referral.converted / referral.clicks) * 100).toFixed(1)}%
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-green-600">${referral.commission.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                                            {referral.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{referral.createdAt}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/admin/referrals/${referral.id}`)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {filteredProviders.length === 0 && filteredReferrals.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No referral data found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterProvider || filterStatus || filterPeriod
                                    ? 'No referral data matches your current filters.'
                                    : 'No referral data has been recorded yet.'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            )}
            </div>
        </div>
    );
};

export default Referrals;


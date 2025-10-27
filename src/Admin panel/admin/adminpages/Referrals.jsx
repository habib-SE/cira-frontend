import React, { useState } from 'react';
import { 
    TrendingUp, 
    Search, 
    Filter, 
    ExternalLink, 
    DollarSign,
    Users,
    Calendar,
    Award,
    Target
} from 'lucide-react';
import Card from '../admincomponents/Card';
import { useNavigate } from 'react-router-dom';

const Referrals = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProvider, setFilterProvider] = useState('');

    
    const [filterPeriod, setFilterPeriod] = useState('');

    // Sample referral data
    const referralProviders = [
        {
            id: 1,
            name: 'Air Doctor',
            type: 'Medical Provider',
            totalReferrals: 145,
            successfulBookings: 98,
            conversionRate: 67.6,
            totalRevenue: 14700,
            commissionEarned: 1470,
            status: 'Active',
            logo: 'AD',
            lastActivity: '2024-01-17'
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
            lastActivity: '2024-01-16'
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
            lastActivity: '2024-01-15'
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
            status: 'Pending',
            logo: 'MLP',
            lastActivity: '2024-01-14'
        }
    ];

    const referralList = [
        {
            id: 1,
            referralId: 'REF-2024-001',
            provider: 'Air Doctor',
            patient: 'John Doe',
            sourcePage: 'landing-page',
            clicks: 245,
            converted: 'Yes',
            commission: 147.00,
            status: 'Completed',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            referralId: 'REF-2024-002',
            provider: 'Doctor On Call',
            patient: 'Jane Smith',
            sourcePage: 'home-page',
            clicks: 189,
            converted: 'Yes',
            commission: 120.00,
            status: 'Completed',
            createdAt: '2024-01-15'
        },
        {
            id: 3,
            referralId: 'REF-2024-003',
            provider: 'HealthCare Connect',
            patient: 'Mike Johnson',
            sourcePage: 'search-results',
            clicks: 156,
            converted: 'No',
            commission: 0.00,
            status: 'Pending',
            createdAt: '2024-01-16'
        },
        {
            id: 4,
            referralId: 'REF-2024-004',
            provider: 'Air Doctor',
            patient: 'Sarah Wilson',
            sourcePage: 'doctor-profile',
            clicks: 203,
            converted: 'Yes',
            commission: 100.00,
            status: 'Completed',
            createdAt: '2024-01-16'
        },
        {
            id: 5,
            referralId: 'REF-2024-005',
            provider: 'MediLink Partners',
            patient: 'Robert Brown',
            sourcePage: 'pricing-page',
            clicks: 98,
            converted: 'Yes',
            commission: 150.00,
            status: 'Completed',
            createdAt: '2024-01-17'
        },
        {
            id: 6,
            referralId: 'REF-2024-006',
            provider: 'Air Doctor',
            patient: 'Emily Davis',
            sourcePage: 'landing-page',
            clicks: 134,
            converted: 'No',
            commission: 0.00,
            status: 'Not Converted',
            createdAt: '2024-01-17'
        },
        {
            id: 7,
            referralId: 'REF-2024-007',
            provider: 'Doctor On Call',
            patient: 'Michael Brown',
            sourcePage: 'blog-post',
            clicks: 67,
            converted: 'Yes',
            commission: 95.00,
            status: 'Completed',
            createdAt: '2024-01-18'
        },
        {
            id: 8,
            referralId: 'REF-2024-008',
            provider: 'HealthCare Connect',
            patient: 'Lisa Anderson',
            sourcePage: 'about-page',
            clicks: 45,
            converted: 'No',
            commission: 0.00,
            status: 'Not Converted',
            createdAt: '2024-01-18'
        }
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
            case 'Not Converted':
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

    const filteredReferrals = referralList.filter(referral => {
        const matchesSearch = searchTerm === '' || 
            referral.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            referral.sourcePage.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProvider = filterProvider === '' || referral.provider === filterProvider;
        
        return matchesSearch && matchesProvider;
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Referral Analytics</h1>
                    <p className="text-sm sm:text-base text-gray-600">Track referral bookings and commissions by provider</p>
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

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search referrals, providers, patients, or source pages..."
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
                        {(searchTerm || filterProvider || filterPeriod) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterProvider('');
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
                                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                    onClick={() => navigate(`/admin/referrals/${provider.id}`)}
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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Referrals List</h3>
                    <button
                        onClick={() => navigate('/admin/referral-providers')}
                        className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Manage Providers
                    </button>
                </div>
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
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{referral.clicks}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            referral.converted === 'Yes' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {referral.converted}
                                        </span>
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
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {filteredReferrals.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No referral data found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterProvider || filterPeriod
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


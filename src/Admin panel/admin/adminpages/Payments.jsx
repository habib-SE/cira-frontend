import React, { useState } from 'react';
import { 
    CreditCard, 
    Search, 
    Filter, 
    Download, 
    Send, 
    TrendingUp, 
    TrendingDown,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle
} from 'lucide-react';
import Card from '../admincomponents/Card';
import ResponsiveTable from '../../../components/ResponsiveTable';

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    
    const [_isContentLoading, _setIsContentLoading] = useState(false);
    
    const handleRefreshContent = () => {
        setIsRefreshing(true);
        _setIsContentLoading(true);
        setTimeout(() => {
            setIsRefreshing(false);
            _setIsContentLoading(false);
        }, 1500);
    };

    

    // Sample payments data
    const payments = [
        {
            id: 1,
            transactionId: 'TXN-2024-001',
            patient: 'John Doe',
            doctor: 'Dr. Sarah Johnson',
            amount: 150.00,
            platformCommission: 22.50,
            doctorPayout: 127.50,
            type: 'Consultation',
            status: 'Completed',
            paymentDate: '2024-01-15',
            payoutDate: '2024-01-16',
            paymentMethod: 'Credit Card'
        },
        {
            id: 2,
            transactionId: 'TXN-2024-002',
            patient: 'Jane Smith',
            doctor: 'Dr. Michael Chen',
            amount: 100.00,
            platformCommission: 15.00,
            doctorPayout: 85.00,
            type: 'Follow-up',
            status: 'Completed',
            paymentDate: '2024-01-15',
            payoutDate: '2024-01-16',
            paymentMethod: 'PayPal'
        },
        {
            id: 3,
            transactionId: 'TXN-2024-003',
            patient: 'Mike Johnson',
            doctor: 'Dr. Emily Rodriguez',
            amount: 200.00,
            platformCommission: 30.00,
            doctorPayout: 170.00,
            type: 'Emergency',
            status: 'Pending Payout',
            paymentDate: '2024-01-16',
            payoutDate: null,
            paymentMethod: 'Credit Card'
        },
        {
            id: 4,
            transactionId: 'TXN-2024-004',
            patient: 'Sarah Wilson',
            doctor: 'Dr. David Kim',
            amount: 120.00,
            platformCommission: 18.00,
            doctorPayout: 102.00,
            type: 'Consultation',
            status: 'Failed',
            paymentDate: '2024-01-16',
            payoutDate: null,
            paymentMethod: 'Bank Transfer'
        },
        {
            id: 5,
            transactionId: 'TXN-2024-005',
            patient: 'Robert Brown',
            doctor: 'Dr. Sarah Johnson',
            amount: 80.00,
            platformCommission: 12.00,
            doctorPayout: 68.00,
            type: 'Follow-up',
            status: 'Processing',
            paymentDate: '2024-01-17',
            payoutDate: null,
            paymentMethod: 'Credit Card'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending Payout':
                return 'bg-yellow-100 text-yellow-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            case 'Cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending Payout':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Processing':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            case 'Failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = searchTerm === '' || 
            payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || payment.status === filterStatus;
        const matchesType = filterType === '' || payment.type === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Calculate statistics
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalCommission = payments.reduce((sum, payment) => sum + payment.platformCommission, 0);
    const totalPayouts = payments.filter(p => p.status === 'Completed').reduce((sum, payment) => sum + payment.doctorPayout, 0);
    const pendingPayouts = payments.filter(p => p.status === 'Pending Payout').reduce((sum, payment) => sum + payment.doctorPayout, 0);

    const handleProcessPayout = (payment) => {
        // Implement payout processing logic
    };

    const handleDownloadReport = () => {
        // Implement report download logic
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Payments</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage payment transactions and doctor payouts</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                        onClick={handleRefreshContent}
                        disabled={isRefreshing}
                        className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                    >
                        {isRefreshing ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span className="hidden sm:inline">Refreshing...</span>
                                <span className="sm:hidden">...</span>
                            </div>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Refresh</span>
                                <span className="sm:hidden">↻</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                {/* Content Loader */}
                {isRefreshing && (
                    <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                            <p className="text-gray-600 font-medium">Loading content...</p>
                        </div>
                    </div>
                )}
                
                <div className={`space-y-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Total Revenue</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Platform Commission</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">${totalCommission.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Total Payouts</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">${totalPayouts.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Pending Payouts</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">${pendingPayouts.toFixed(2)}</p>
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
                            placeholder="Search by patient, doctor, or transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending Payout">Pending Payout</option>
                            <option value="Processing">Processing</option>
                            <option value="Failed">Failed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="Consultation">Consultation</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterStatus || filterType) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('');
                                    setFilterType('');
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

            {/* Payments Table */}
            <Card className="overflow-hidden">
                <ResponsiveTable>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor Payout
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                                            <div className="text-sm text-gray-500">{payment.paymentDate}</div>
                                            <div className="text-xs text-gray-400">{payment.paymentMethod}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.patient}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                        <div className="text-sm text-gray-900">{payment.doctor}</div>
                                        <div className="text-sm text-gray-500">{payment.type}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                        <div className="text-sm text-gray-900">${payment.platformCommission.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">({((payment.platformCommission / payment.amount) * 100).toFixed(1)}%)</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                        <div className="text-sm font-medium text-gray-900">${payment.doctorPayout.toFixed(2)}</div>
                                        {payment.payoutDate && (
                                            <div className="text-xs text-gray-500">Paid: {payment.payoutDate}</div>
                                        )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(payment.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {payment.status === 'Pending Payout' && (
                                                <button
                                                    onClick={() => handleProcessPayout(payment)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Process Payout"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {}}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="View Details"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </ResponsiveTable>
            </Card>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
                <Card className="p-6 sm:p-12 text-center">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No payments found</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                {searchTerm || filterStatus || filterType
                                    ? 'No payments match your current filters.'
                                    : 'No payment transactions have been recorded yet.'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            )}
                </div>
            </div>
        </div>
    );
};

export default Payments;


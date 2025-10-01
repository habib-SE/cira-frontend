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

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

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
        console.log('Process payout for:', payment.transactionId);
        // Implement payout processing logic
    };

    const handleDownloadReport = () => {
        console.log('Download payment report');
        // Implement report download logic
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
                    <p className="text-gray-600">Manage payment transactions and doctor payouts</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Platform Commission</p>
                            <p className="text-xl font-bold text-gray-900">${totalCommission.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Payouts</p>
                            <p className="text-xl font-bold text-gray-900">${totalPayouts.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending Payouts</p>
                            <p className="text-xl font-bold text-gray-900">${pendingPayouts.toFixed(2)}</p>
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
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
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
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
                                className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm"
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
                <div className="overflow-x-auto">
                    <table className="w-full">
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
                                        <div className="text-sm text-gray-900">{payment.doctor}</div>
                                        <div className="text-sm text-gray-500">{payment.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${payment.platformCommission.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">({((payment.platformCommission / payment.amount) * 100).toFixed(1)}%)</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">${payment.doctorPayout.toFixed(2)}</div>
                                        {payment.payoutDate && (
                                            <div className="text-xs text-gray-500">Paid: {payment.payoutDate}</div>
                                        )}
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
                                                onClick={() => console.log('View details:', payment)}
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
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-600">
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
    );
};

export default Payments;


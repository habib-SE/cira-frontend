import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    CreditCard,
    Download,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    Wallet,
    Banknote,
    PieChart,
    BarChart3,
    X
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const Earnings = () => {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedView, setSelectedView] = useState('overview');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');

    const handleRefreshContent = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    const handleRequestPayout = () => {
        if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
            setErrorMessage('Please enter a valid payout amount!');
            setShowErrorModal(true);
            return;
        }
        if (parseFloat(payoutAmount) > earningsData.pendingPayout) {
            setErrorMessage('Payout amount cannot exceed pending balance!');
            setShowErrorModal(true);
            return;
        }
        setSuccessMessage(`Payout request of $${payoutAmount} submitted successfully!`);
        setShowSuccessModal(true);
        setShowPayoutModal(false);
        setPayoutAmount('');
        
        // Auto close success modal after 3 seconds
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    };

    const handleNavigateToBankDetails = () => {
        navigate('/doctor/earnings/bank-details');
    };

    const handleDownloadStatement = () => {
        setSuccessMessage('Downloading earnings statement...');
        setShowSuccessModal(true);
        
        // Auto close success modal after 2 seconds
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 2000);
    };

    const handleExportData = () => {
        setSuccessMessage('Exporting earnings data...');
        setShowSuccessModal(true);
        
        // Auto close success modal after 2 seconds
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 2000);
    };

    // Earnings data
    const earningsData = {
        totalEarned: 15420.50,
        commissionDeducted: 1542.05,
        currentBalance: 13878.45,
        lastPayout: 2500.00,
        pendingPayout: 1200.00,
        thisMonth: 3200.50,
        lastMonth: 2800.00,
        growth: 14.3
    };

    // Transaction history (Payments)
    const transactions = [
        {
            id: 1,
            type: 'consultation',
            paymentType: 'Standard',
            source: 'Patient Payment',
            patient: 'John Doe',
            amount: 150.00,
            currency: 'USD',
            commission: 15.00,
            net: 135.00,
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'completed',
            description: 'Initial consultation - Hypertension management'
        },
        {
            id: 2,
            type: 'follow-up',
            paymentType: 'Standard',
            source: 'Patient Payment',
            patient: 'Jane Smith',
            amount: 100.00,
            currency: 'USD',
            commission: 10.00,
            net: 90.00,
            date: '2024-01-15',
            time: '11:00 AM',
            status: 'completed',
            description: 'Follow-up visit - Diabetes monitoring'
        },
        {
            id: 3,
            type: 'emergency',
            paymentType: 'Standard',
            source: 'Insurance',
            patient: 'Mike Johnson',
            amount: 250.00,
            currency: 'USD',
            commission: 25.00,
            net: 225.00,
            date: '2024-01-14',
            time: '02:30 PM',
            status: 'completed',
            description: 'Emergency consultation - Chest pain evaluation'
        },
        {
            id: 4,
            type: 'teleconsultation',
            paymentType: 'Referral',
            source: 'Patient Payment',
            patient: 'Sarah Williams',
            amount: 120.00,
            currency: 'USD',
            commission: 12.00,
            net: 108.00,
            date: '2024-01-14',
            time: '03:00 PM',
            status: 'pending',
            description: 'Teleconsultation - General health check'
        },
        {
            id: 5,
            type: 'payout',
            paymentType: 'Standard',
            source: 'Platform Payout',
            patient: 'Platform Payout',
            amount: 2500.00,
            currency: 'USD',
            commission: 0.00,
            net: 2500.00,
            date: '2024-01-10',
            time: '09:00 AM',
            status: 'completed',
            description: 'Monthly payout to bank account'
        }
    ];

    // Payout history
    const payouts = [
        {
            id: 1,
            doctor: 'Dr. Smith',
            period: 'January 2024',
            gross: 2750.00,
            commission: 250.00,
            net: 2500.00,
            date: '2024-01-10',
            method: 'Bank Transfer',
            status: 'completed',
            reference: 'PAY-2024-001'
        },
        {
            id: 2,
            doctor: 'Dr. Smith',
            period: 'December 2023',
            gross: 2420.00,
            commission: 220.00,
            net: 2200.00,
            date: '2023-12-10',
            method: 'Bank Transfer',
            status: 'completed',
            reference: 'PAY-2023-012'
        },
        {
            id: 3,
            doctor: 'Dr. Smith',
            period: 'November 2023',
            gross: 1980.00,
            commission: 180.00,
            net: 1800.00,
            date: '2023-11-10',
            method: 'Bank Transfer',
            status: 'completed',
            reference: 'PAY-2023-011'
        }
    ];

    // Service breakdown
    const serviceBreakdown = [
        { service: 'Consultations', count: 45, amount: 6750.00, percentage: 43.8 },
        { service: 'Follow-ups', count: 32, amount: 3200.00, percentage: 20.8 },
        { service: 'Emergency', count: 8, amount: 2000.00, percentage: 13.0 },
        { service: 'Teleconsultation', count: 28, amount: 3360.00, percentage: 21.8 },
        { service: 'Other', count: 5, amount: 110.50, percentage: 0.7 }
    ];

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'consultation':
                return <DollarSign className="w-5 h-5 text-blue-500" />;
            case 'follow-up':
                return <Clock className="w-5 h-5 text-green-500" />;
            case 'emergency':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'teleconsultation':
                return <CreditCard className="w-5 h-5 text-purple-500" />;
            case 'payout':
                return <Banknote className="w-5 h-5 text-orange-500" />;
            default:
                return <DollarSign className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'processing':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const periods = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' }
    ];

    const views = [
        { value: 'overview', label: 'Overview', icon: PieChart },
        { value: 'transactions', label: 'Transactions', icon: BarChart3 },
        { value: 'payouts', label: 'Payouts', icon: Wallet }
    ];

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Earnings</h1>
                        <p className="text-sm sm:text-base text-gray-600">Track your earnings, commissions, and payouts</p>
                </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        {periods.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                        <button 
                            onClick={handleExportData}
                            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                        >
                        <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                            <span className="sm:hidden">↓</span>
                    </button>
                    </div>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                {views.map((view) => {
                    const Icon = view.icon;
                    return (
                        <button
                            key={view.value}
                            onClick={() => setSelectedView(view.value)}
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                                selectedView === view.value
                                    ? 'bg-white text-pink-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm sm:text-base">{view.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="space-y-4 sm:space-y-6">
            {selectedView === 'overview' && (
                <>
                    {/* Wallet Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-600">Total Earned</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">${earningsData.totalEarned.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-600">Commission</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">${earningsData.commissionDeducted.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-600">Current Balance</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">${earningsData.currentBalance.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-600">Growth</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">+{earningsData.growth}%</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Monthly Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Comparison</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">This Month</p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">${earningsData.thisMonth.toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 sm:text-right">
                                        <p className="text-sm text-gray-600">Last Month</p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">${earningsData.lastMonth.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${Math.min((earningsData.thisMonth / earningsData.lastMonth) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-green-600 break-words">
                                    +${(earningsData.thisMonth - earningsData.lastMonth).toLocaleString()} increase from last month
                                </p>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Breakdown</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {serviceBreakdown.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <div className="w-3 h-3 rounded-full bg-pink-500 flex-shrink-0"></div>
                                            <span className="text-sm text-gray-700 truncate">{service.service}</span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-medium text-gray-900">${service.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{service.count} sessions</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Pending Payout */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">Pending Payout</h3>
                                <p className="text-gray-600">Amount ready for withdrawal</p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-3">
                                <p className="text-2xl sm:text-3xl font-bold text-pink-600 break-words">${earningsData.pendingPayout.toLocaleString()}</p>
                                <button 
                                    onClick={() => setShowPayoutModal(true)}
                                    className="w-full sm:w-auto px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                                >
                                    Request Payout
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Bank Account Details */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Chase Bank • ****1234 • Checking
                                </p>
                            </div>
                            <button 
                                onClick={handleNavigateToBankDetails}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Update Bank Details
                            </button>
                        </div>
                    </Card>
                </>
            )}

            {selectedView === 'transactions' && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{transaction.patient}</h4>
                                        <p className="text-sm text-gray-600">{transaction.description}</p>
                                        <p className="text-xs text-gray-500">{transaction.date} at {transaction.time}</p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Amount</p>
                                            <p className="font-medium text-gray-900">${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Commission</p>
                                            <p className="font-medium text-red-600">-${transaction.commission ? transaction.commission.toFixed(2) : '0.00'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Net</p>
                                            <p className="font-bold text-green-600">${transaction.net ? transaction.net.toFixed(2) : '0.00'}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(transaction.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {selectedView === 'payouts' && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
                        <button 
                            onClick={handleDownloadStatement}
                            className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Statement</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {payouts.map((payout) => (
                            <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Banknote className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Payout #{payout.reference}</h4>
                                        <p className="text-sm text-gray-600">{payout.method}</p>
                                        <p className="text-xs text-gray-500">{payout.date}</p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Amount</p>
                                            <p className="text-xl font-bold text-gray-900">${payout.amount ? payout.amount.toLocaleString() : '0.00'}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(payout.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                                                {payout.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
            </div>

            {/* Payout Request Modal */}
            {showPayoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Request Payout</h2>
                                <p className="text-sm text-gray-600 mt-1">Withdraw funds to your bank account</p>
                            </div>
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-600">Available Balance</p>
                                <p className="text-3xl font-bold text-pink-600">${earningsData.pendingPayout.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payout Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    max={earningsData.pendingPayout}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Processing Time:</strong> 3-5 business days
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Funds will be transferred to your registered bank account
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleRequestPayout}
                                className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-xl hover:bg-pink-700 transition-colors font-medium"
                            >
                                Request Payout
                            </button>
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Error
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {errorMessage}
                            </p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-medium"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Success!
                            </h3>
                            <p className="text-gray-600">
                                {successMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Earnings;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    XCircle,
    Eye,
    Calendar
} from 'lucide-react';
import Card from '../admincomponents/Card';
import ResponsiveTable from '../../../components/ResponsiveTable';

const Payments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterCurrency, setFilterCurrency] = useState('');
    const [filterProvider, setFilterProvider] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Check for search term from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    // Sample payments data with Standard and Referral types
    const payments = [
        {
            id: 1,
            paymentId: 'PAY-2024-001',
            type: 'Standard',
            source: 'Appointment',
            patient: 'John Doe',
            doctor: 'Dr. Sarah Johnson',
            amount: 150.00,
            currency: 'USD',
            platformCommission: 22.50,
            doctorPayout: 127.50,
            status: 'Completed',
            createdAt: '2024-01-15',
            payoutDate: '2024-01-16',
            paymentMethod: 'Credit Card',
            appointmentId: 'APT-2024-001'
        },
        {
            id: 2,
            paymentId: 'PAY-2024-002',
            type: 'Standard',
            source: 'Subscription',
            patient: 'Jane Smith',
            doctor: 'Dr. Michael Chen',
            amount: 100.00,
            currency: 'USD',
            platformCommission: 15.00,
            doctorPayout: 85.00,
            status: 'Completed',
            createdAt: '2024-01-15',
            payoutDate: '2024-01-16',
            paymentMethod: 'PayPal',
            subscriptionId: 'SUB-2024-001'
        },
        {
            id: 3,
            paymentId: 'PAY-2024-003',
            type: 'Referral',
            source: 'Provider',
            patient: 'Mike Johnson',
            doctor: 'Dr. Emily Rodriguez',
            amount: 200.00,
            currency: 'USD',
            platformCommission: 30.00,
            doctorPayout: 170.00,
            status: 'Pending Payout',
            createdAt: '2024-01-16',
            payoutDate: null,
            paymentMethod: 'Credit Card',
            referralId: 'REF-2024-001',
            referralProvider: 'AirDoctor',
            clickSource: 'landing-page',
            commissionTier: 'Standard',
            payoutBatch: 'BATCH-2024-001'
        },
        {
            id: 4,
            paymentId: 'PAY-2024-004',
            type: 'Standard',
            source: 'Appointment',
            patient: 'Sarah Wilson',
            doctor: 'Dr. David Kim',
            amount: 120.00,
            currency: 'EUR',
            platformCommission: 18.00,
            doctorPayout: 102.00,
            status: 'Failed',
            createdAt: '2024-01-16',
            payoutDate: null,
            paymentMethod: 'Bank Transfer',
            appointmentId: 'APT-2024-002'
        },
        {
            id: 5,
            paymentId: 'PAY-2024-005',
            type: 'Referral',
            source: 'Provider',
            patient: 'Robert Brown',
            doctor: 'Dr. Sarah Johnson',
            amount: 80.00,
            currency: 'USD',
            platformCommission: 12.00,
            doctorPayout: 68.00,
            status: 'Processing',
            createdAt: '2024-01-17',
            payoutDate: null,
            paymentMethod: 'Credit Card',
            referralId: 'REF-2024-002',
            referralProvider: 'Doctor On Call',
            clickSource: 'home-page',
            commissionTier: 'Premium',
            payoutBatch: null
        },
        {
            id: 6,
            paymentId: 'PAY-2024-006',
            type: 'Standard',
            source: 'Subscription',
            patient: 'Alice Cooper',
            doctor: 'Dr. Michael Chen',
            amount: 250.00,
            currency: 'GBP',
            platformCommission: 37.50,
            doctorPayout: 212.50,
            status: 'Completed',
            createdAt: '2024-01-17',
            payoutDate: '2024-01-18',
            paymentMethod: 'Credit Card',
            subscriptionId: 'SUB-2024-002'
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
            payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || payment.status === filterStatus;
        const matchesType = filterType === '' || payment.type === filterType;
        const matchesSource = filterSource === '' || payment.source === filterSource;
        const matchesCurrency = filterCurrency === '' || payment.currency === filterCurrency;
        const matchesProvider = filterProvider === '' || payment.doctor === filterProvider;
        
        // Date range filter
        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
            matchesDate = payment.createdAt >= dateRange.start && payment.createdAt <= dateRange.end;
        }
        
        return matchesSearch && matchesStatus && matchesType && matchesSource && matchesCurrency && matchesProvider && matchesDate;
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
        try {
            // Create HTML content for PDF
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Transactions Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ec4899;
        }
        .header h1 {
            color: #ec4899;
            font-size: 28px;
            margin: 0;
        }
        .header p {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-card .amount {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
        }
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .transactions-table th {
            background-color: #f1f5f9;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
        }
        .transactions-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #334155;
        }
        .transactions-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .transactions-table tr:hover {
            background-color: #f1f5f9;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-completed { background-color: #dcfce7; color: #16a34a; }
        .status-pending { background-color: #fef3c7; color: #d97706; }
        .status-processing { background-color: #dbeafe; color: #2563eb; }
        .status-failed { background-color: #fee2e2; color: #dc2626; }
        .status-cancelled { background-color: #f3f4f6; color: #6b7280; }
        .amount {
            font-weight: 600;
            color: #059669;
        }
        .commission {
            color: #7c3aed;
        }
        .payout {
            color: #dc2626;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .summary-cards { page-break-inside: avoid; }
            .transactions-table { page-break-inside: auto; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CIRA AI Healthcare Platform</h1>
        <p>Payment Transactions Report</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Total Transactions: ${filteredPayments.length}</p>
    </div>

    <div class="summary-cards">
        <div class="summary-card">
            <h3>Total Revenue</h3>
            <div class="amount">$${totalRevenue.toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Platform Commission</h3>
            <div class="amount">$${totalCommission.toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Total Payouts</h3>
            <div class="amount">$${totalPayouts.toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Pending Payouts</h3>
            <div class="amount">$${pendingPayouts.toFixed(2)}</div>
        </div>
    </div>

    <table class="transactions-table">
        <thead>
            <tr>
                <th>Transaction ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Commission</th>
                <th>Doctor Payout</th>
                <th>Payment Date</th>
                <th>Payout Date</th>
                <th>Status</th>
                <th>Payment Method</th>
            </tr>
        </thead>
        <tbody>
            ${filteredPayments.map(payment => `
                <tr>
                    <td>${payment.transactionId}</td>
                    <td>${payment.patient}</td>
                    <td>${payment.doctor}</td>
                    <td>${payment.type}</td>
                    <td class="amount">$${payment.amount.toFixed(2)}</td>
                    <td class="commission">$${payment.platformCommission.toFixed(2)}</td>
                    <td class="payout">$${payment.doctorPayout.toFixed(2)}</td>
                    <td>${payment.paymentDate}</td>
                    <td>${payment.payoutDate || 'Pending'}</td>
                    <td>
                        <span class="status-badge status-${payment.status.toLowerCase().replace(' ', '')}">
                            ${payment.status}
                        </span>
                    </td>
                    <td>${payment.paymentMethod}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>© 2024 CIRA AI Healthcare Platform - Confidential Financial Report</p>
        <p>This report was generated automatically by our system</p>
        <p>Report includes ${filteredPayments.length} payment transactions</p>
    </div>
</body>
</html>`;

            // Create and download HTML file (can be printed as PDF)
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `payment-transactions-report-${new Date().toISOString().split('T')[0]}.html`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Export completed successfully
            console.log(`Successfully exported ${filteredPayments.length} payment transactions as PDF-ready HTML`);
        } catch (error) {
            console.error('Export failed:', error);
        }
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
                        onClick={handleDownloadReport}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
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
                            placeholder="Search by patient, doctor, or payment ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row 1 */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="Standard">Standard</option>
                            <option value="Referral">Referral</option>
                        </select>
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
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Sources</option>
                            <option value="Appointment">Appointment</option>
                            <option value="Subscription">Subscription</option>
                            <option value="Provider">Provider</option>
                        </select>
                        <select
                            value={filterCurrency}
                            onChange={(e) => setFilterCurrency(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Currencies</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>

                    {/* Filter Row 2 - Date Range and Provider */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                                placeholder="Start Date"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">to</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                                placeholder="End Date"
                            />
                        </div>
                        <select
                            value={filterProvider}
                            onChange={(e) => setFilterProvider(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Providers</option>
                            {[...new Set(payments.map(p => p.doctor))].map(doctor => (
                                <option key={doctor} value={doctor}>{doctor}</option>
                            ))}
                        </select>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterStatus || filterType || filterSource || filterCurrency || filterProvider || dateRange.start || dateRange.end) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('');
                                    setFilterType('');
                                    setFilterSource('');
                                    setFilterCurrency('');
                                    setFilterProvider('');
                                    setDateRange({ start: '', end: '' });
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
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Currency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor/Provider
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
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{payment.paymentId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            payment.type === 'Standard' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {payment.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.source}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{payment.currency} {payment.amount.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Commission: {payment.currency} {payment.platformCommission.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.currency}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(payment.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.patient}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm text-gray-900">{payment.doctor}</div>
                                            {payment.type === 'Referral' && payment.referralProvider && (
                                                <div className="text-xs text-purple-600">via {payment.referralProvider}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.createdAt}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/payments/${payment.id}`)}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {payment.status === 'Pending Payout' && (
                                                <button
                                                    onClick={() => handleProcessPayout(payment)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Process Payout"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
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
    );
};

export default Payments;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Download, 
    CreditCard, 
    User, 
    Calendar,
    DollarSign,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    Send,
    Receipt
} from 'lucide-react';
import Card from '../admincomponents/Card';

const PaymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);

    // Sample payment data - in real app, fetch by ID
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
            appointmentId: 'APT-2024-001',
            cardLast4: '4242',
            cardBrand: 'Visa'
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
            subscriptionId: 'SUB-2024-001',
            subscriptionPlan: 'Monthly Premium'
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
            payoutBatch: 'BATCH-2024-001',
            cardLast4: '5555',
            cardBrand: 'Mastercard'
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
            appointmentId: 'APT-2024-002',
            failureReason: 'Insufficient funds'
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
            payoutBatch: null,
            cardLast4: '1234',
            cardBrand: 'Visa'
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
            subscriptionId: 'SUB-2024-002',
            subscriptionPlan: 'Annual Premium',
            cardLast4: '9876',
            cardBrand: 'Amex'
        }
    ];

    useEffect(() => {
        const foundPayment = payments.find(p => p.id === parseInt(id));
        setPayment(foundPayment);
    }, [id]);

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
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Pending Payout':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Processing':
                return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case 'Failed':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleDownloadReceipt = () => {
        // Generate and download receipt
        alert('Receipt download functionality would be implemented here');
    };

    const handleProcessPayout = () => {
        // Process payout
        alert('Payout processing functionality would be implemented here');
    };

    if (!payment) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Payment not found</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/payments')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Details</h1>
                        <p className="text-sm sm:text-base text-gray-600">{payment.paymentId}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDownloadReceipt}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <Receipt className="w-4 h-4" />
                        <span>Receipt</span>
                    </button>
                    {payment.status === 'Pending Payout' && (
                        <button
                            onClick={handleProcessPayout}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            <span>Process Payout</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Status Banner */}
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(payment.status)}
                        <div>
                            <h3 className="font-semibold text-gray-900">Payment Status</h3>
                            <p className="text-sm text-gray-600">Current status of the payment</p>
                        </div>
                    </div>
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                    </span>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Information */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Payment ID</p>
                                    <p className="font-medium text-gray-900">{payment.paymentId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Type</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        payment.type === 'Standard' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {payment.type}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Source</p>
                                    <p className="font-medium text-gray-900">{payment.source}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Currency</p>
                                    <p className="font-medium text-gray-900">{payment.currency}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Amount</p>
                                    <p className="font-medium text-gray-900">{payment.currency} {payment.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-medium text-gray-900">{payment.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Created At</p>
                                    <p className="font-medium text-gray-900">{payment.createdAt}</p>
                                </div>
                                {payment.payoutDate && (
                                    <div>
                                        <p className="text-sm text-gray-600">Payout Date</p>
                                        <p className="font-medium text-gray-900">{payment.payoutDate}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Standard Payment Details */}
                    {payment.type === 'Standard' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reference Information</h2>
                            <div className="space-y-4">
                                {payment.appointmentId && (
                                    <div>
                                        <p className="text-sm text-gray-600">Appointment ID</p>
                                        <p className="font-medium text-gray-900">{payment.appointmentId}</p>
                                    </div>
                                )}
                                {payment.subscriptionId && (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-600">Subscription ID</p>
                                            <p className="font-medium text-gray-900">{payment.subscriptionId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Plan</p>
                                            <p className="font-medium text-gray-900">{payment.subscriptionPlan}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Referral Payment Details */}
                    {payment.type === 'Referral' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Referral ID</p>
                                        <p className="font-medium text-gray-900">{payment.referralId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Provider</p>
                                        <p className="font-medium text-gray-900">{payment.referralProvider}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Click Source</p>
                                        <p className="font-medium text-gray-900">{payment.clickSource}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Commission Tier</p>
                                        <p className="font-medium text-gray-900">{payment.commissionTier}</p>
                                    </div>
                                    {payment.payoutBatch && (
                                        <div>
                                            <p className="text-sm text-gray-600">Payout Batch</p>
                                            <p className="font-medium text-gray-900">{payment.payoutBatch}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Failure Details */}
                    {payment.status === 'Failed' && payment.failureReason && (
                        <Card className="p-6 bg-red-50 border-red-200">
                            <h2 className="text-lg font-semibold text-red-900 mb-2">Failure Information</h2>
                            <p className="text-sm text-red-700">{payment.failureReason}</p>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Financial Summary */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-semibold text-gray-900">{payment.currency} {payment.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Platform Commission</span>
                                <span className="font-semibold text-purple-600">{payment.currency} {payment.platformCommission.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Net to Doctor</span>
                                <span className="font-semibold text-green-600">{payment.currency} {payment.doctorPayout.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Parties Involved */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Parties Involved</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm text-gray-600">Patient</p>
                                </div>
                                <p className="font-medium text-gray-900">{payment.patient}</p>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm text-gray-600">Doctor/Provider</p>
                                </div>
                                <p className="font-medium text-gray-900">{payment.doctor}</p>
                                {payment.type === 'Referral' && payment.referralProvider && (
                                    <p className="text-sm text-purple-600">via {payment.referralProvider}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Payment Method Details */}
                    {payment.cardLast4 && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Card</p>
                                <p className="font-medium text-gray-900">{payment.cardBrand} •••• {payment.cardLast4}</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetail;

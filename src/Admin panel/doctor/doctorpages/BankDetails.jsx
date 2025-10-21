import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Save
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const BankDetails = () => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [bankDetails, setBankDetails] = useState({
        accountHolder: 'Dr. Smith',
        accountNumber: '****1234',
        bankName: 'Chase Bank',
        routingNumber: '****5678',
        accountType: 'Checking'
    });

    const handleSaveBankDetails = () => {
        // Validate required fields
        if (!bankDetails.accountHolder || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.routingNumber) {
            setErrorMessage('Please fill in all required fields!');
            setShowErrorModal(true);
            return;
        }

        // Save bank details (in real app, this would be an API call)
        setShowSuccessModal(true);
        
        // Auto close and navigate back after 2 seconds
        setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/doctor/earnings');
        }, 2000);
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/doctor/earnings')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Bank Account Details
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Update your payout bank information
                    </p>
                </div>
            </div>

            {/* Bank Details Form */}
            <Card className="p-6">
                <div className="max-w-3xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-pink-100 rounded-xl">
                            <CreditCard className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Bank Account Information
                            </h2>
                            <p className="text-sm text-gray-600">
                                Your payout will be transferred to this account
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Account Holder Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name *
                            </label>
                            <input
                                type="text"
                                value={bankDetails.accountHolder}
                                onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                                placeholder="Enter account holder name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                placeholder="Enter bank name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                placeholder="Enter account number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Your account number is encrypted and secure
                            </p>
                        </div>

                        {/* Routing Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Routing Number *
                            </label>
                            <input
                                type="text"
                                value={bankDetails.routingNumber}
                                onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                                placeholder="Enter routing number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type *
                            </label>
                            <select
                                value={bankDetails.accountType}
                                onChange={(e) => setBankDetails({...bankDetails, accountType: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="Checking">Checking</option>
                                <option value="Savings">Savings</option>
                            </select>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-blue-800 mb-1">
                                    Secure Banking Information
                                </p>
                                <p className="text-xs text-blue-600">
                                    All your banking information is encrypted and stored securely. We never share your details with third parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleSaveBankDetails}
                            className="flex-1 flex items-center justify-center space-x-2 bg-pink-600 text-white py-3 px-6 rounded-xl hover:bg-pink-700 transition-colors font-medium"
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                        </button>
                        <button
                            onClick={() => navigate('/doctor/earnings')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Card>

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
                                Bank details saved successfully!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankDetails;


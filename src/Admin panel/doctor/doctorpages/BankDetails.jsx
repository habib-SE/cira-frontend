import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Save,
    X
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const BankDetails = () => {
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: 'Checking'
    });

    // Load bank details from localStorage on component mount
    useEffect(() => {
        const savedBankDetails = localStorage.getItem('doctorBankDetails');
        if (savedBankDetails) {
            try {
                const parsedDetails = JSON.parse(savedBankDetails);
                setBankDetails(parsedDetails);
            } catch (error) {
                console.error('Error parsing saved bank details:', error);
            }
        } else {
            // Set default values if no saved data
            setBankDetails({
                accountHolder: 'Dr. Smith',
                accountNumber: '****1234',
                bankName: 'Chase Bank',
                routingNumber: '****5678',
                accountType: 'Checking'
            });
        }
    }, []);

    const handleSaveBankDetails = () => {
        // Validate required fields
        if (!bankDetails.accountHolder || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.routingNumber) {
            setErrorMessage('Please fill in all required fields!');
            setShowErrorModal(true);
            return;
        }

        // Set loading state
        setIsSaving(true);
        
        // Show toast notification for saving
        setToastMessage('Saving bank details...');
        setShowToast(true);
        
        // Simulate save operation
        setTimeout(() => {
            try {
                // Save bank details to localStorage
                localStorage.setItem('doctorBankDetails', JSON.stringify(bankDetails));
                
                setToastMessage('Bank details saved successfully!');
                setIsSaving(false);
                
                // Navigate back after showing success
                setTimeout(() => {
                    setShowToast(false);
                    navigate('/doctor/earnings');
                }, 2000);
            } catch (error) {
                console.error('Error saving bank details:', error);
                setToastMessage('Error saving bank details. Please try again.');
                setIsSaving(false);
                setTimeout(() => setShowToast(false), 3000);
            }
        }, 1500);
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
                            disabled={isSaving}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-colors font-medium ${
                                isSaving 
                                    ? 'bg-pink-300 cursor-not-allowed' 
                                    : 'bg-pink-400 hover:bg-pink-500'
                            } text-white`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/doctor/earnings')}
                            className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Card>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
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

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
                    <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
                        <div className="flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-pink-500" />
                        </div>
                        <span className="text-pink-700 font-medium flex-1">{toastMessage}</span>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="flex-shrink-0 text-pink-500 hover:text-pink-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankDetails;


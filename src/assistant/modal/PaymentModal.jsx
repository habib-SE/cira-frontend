import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Lock, CreditCard, Shield } from "lucide-react";

const PaymentModal = ({ doctor, onPaymentSuccess, onBack, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Default doctor data with cost
  const defaultDoctor = {
    name: "Dr. Smith",
    specialty: "General Physician",
    cost: 99
  };

  const currentDoctor = doctor || defaultDoctor;

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">💳 Payment</h2>
            <p className="text-pink-100 mt-1">Consultation with {currentDoctor.name}</p>
          </div>
          <button
            onClick={onClose || onBack}
            className="text-white hover:text-pink-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Doctor Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{currentDoctor.name}</h3>
                <p className="text-gray-600 text-sm">{currentDoctor.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${currentDoctor.cost || 99}
                </p>
                <p className="text-gray-500 text-sm">One-time consultation</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-pink-500 focus:ring-pink-500"
                />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="flex-1 font-medium">Credit/Debit Card</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-pink-500 focus:ring-pink-500"
                />
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="flex-1 font-medium">Digital Wallet</span>
              </label>
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
            <Lock className="w-4 h-4" />
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0 rounded-b-2xl bg-white">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay $${currentDoctor.cost || 99}`
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentModal;
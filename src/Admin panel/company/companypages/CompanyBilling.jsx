import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  Settings,
  Plus,
  Edit,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const CompanyBilling = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showManagePlanModal, setShowManagePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ show: false, type: '', message: '' });

  // Mock data
  const currentPlan = {
    name: 'Enterprise Plan',
    price: '$299',
    period: 'per month',
    nextBilling: '2024-02-15',
    status: 'Active'
  };

  const stats = [
    { label: 'Total Spent', value: '$1,293', change: '+12%', positive: true, icon: TrendingUp },
    { label: 'Next Billing', value: 'Feb 15', change: 'Due Soon', positive: null, icon: Calendar },
    { label: 'Invoices', value: '12', change: 'This Year', positive: null, icon: DollarSign }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      features: ['Up to 50 employees', 'Basic AI consultations'],
      popular: false
    },
    {
      name: 'Professional',
      price: '$199',
      period: 'per month',
      features: ['Up to 200 employees', 'Advanced AI consultations'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: 'per month',
      features: ['Up to 500 employees', 'Unlimited consultations'],
      popular: false,
      isCurrent: true
    }
  ];

  const invoices = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '$299.00',
      description: 'Enterprise Plan - January 2024',
      status: 'Paid'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '$299.00',
      description: 'Enterprise Plan - December 2023',
      status: 'Paid'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '$199.00',
      description: 'Professional Plan - November 2023',
      status: 'Paid'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      brand: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    showAlert('success', 'Billing information refreshed successfully!');
  };

  const handleManagePlan = () => {
    setShowManagePlanModal(true);
  };

  const handleCloseManagePlan = () => {
    setShowManagePlanModal(false);
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true);
  };

  const handleCloseAddPayment = () => {
    setShowAddPaymentModal(false);
  };

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
    showAlert('success', `Switching to ${planName} plan. Your subscription will be updated!`);
  };

  const handleDownloadInvoice = (invoiceId) => {
    showAlert('success', `Invoice ${invoiceId} downloaded successfully!`);
  };

  const handleViewAllInvoices = () => {
    showAlert('info', 'Viewing all invoices...');
  };

  const handleEditPaymentMethod = (methodId) => {
    showAlert('info', `Editing payment method ${methodId}...`);
  };

  const ALERT_VARIANTS = {
    success: {
      container: 'bg-pink-50 border-pink-200',
      icon: 'text-pink-600',
      title: 'text-pink-800',
      detail: 'text-pink-700',
      detailText: 'Action completed successfully.',
      close: 'text-pink-400 hover:text-pink-600'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      detail: 'text-red-700',
      detailText: 'Something went wrong. Please try again.',
      close: 'text-red-400 hover:text-red-600'
    },
    info: {
      container: 'bg-pink-50 border-pink-200',
      icon: 'text-pink-600',
      title: 'text-pink-800',
      detail: 'text-pink-700',
      detailText: '',
      close: 'text-pink-400 hover:text-pink-600'
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ show: true, type, message });
    setTimeout(() => {
      setAlertMessage({ show: false, type: '', message: '' });
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-pink-600" />
                </div>
                {stat.positive !== null && (
                  <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                )}
        </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
              {stat.positive === null && (
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              )}
        </div>
          );
        })}
      </div>

      {/* Current Plan & Payment Methods Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Active</span>
                </span>
              </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">{currentPlan.name}</h4>
              <p className="text-4xl font-bold text-pink-600 mb-2">{currentPlan.price}</p>
              <p className="text-sm text-gray-600">{currentPlan.period}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Next billing date</span>
                <span className="text-sm font-medium text-gray-900">{currentPlan.nextBilling}</span>
          </div>
          <button 
            onClick={handleManagePlan}
                className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2 mt-3"
          >
            <Settings className="h-4 w-4" />
            <span>Manage Plan</span>
          </button>
            </div>
        </div>
      </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button 
              onClick={handleAddPaymentMethod}
              className="w-full sm:w-auto bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Method</span>
            </button>
          </div>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-pink-500 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{method.brand} •••• {method.last4}</p>
                      <p className="text-sm text-gray-600">Expires {method.expiry}</p>
        </div>
            </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <button 
                      onClick={() => handleEditPaymentMethod(method.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
            </div>
          </div>
        </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Row */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Plans</h3>
          <p className="text-sm text-gray-600 mt-1">Choose the plan that fits your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border-2 p-5 transition-all cursor-pointer hover:shadow-md ${
                plan.isCurrent
                  ? 'border-pink-500 bg-pink-50'
                  : plan.popular
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center mb-3">
                  Most Popular
                </div>
              )}
              {plan.isCurrent && (
                <div className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center mb-3">
                  Current Plan
                </div>
              )}
              <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-1">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => !plan.isCurrent && handleSelectPlan(plan.name)}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors mt-auto ${
                  plan.isCurrent
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
                disabled={plan.isCurrent}
              >
                {plan.isCurrent ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <p className="text-sm text-gray-600 mt-1">Download and manage your invoices</p>
          </div>
          <button 
            onClick={handleViewAllInvoices}
            className="text-pink-600 hover:text-pink-700 text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Download className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Paid on {invoice.date}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-gray-900">{invoice.amount}</p>
                    <span className="inline-flex items-center space-x-1 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-700 font-medium">{invoice.status}</span>
                      </span>
                  </div>
                  <button 
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="w-full sm:w-auto bg-pink-50 hover:bg-pink-100 p-2.5 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 text-pink-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Notification */}
      {alertMessage.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300 sm:right-4 sm:left-auto left-4 sm:w-auto w-[calc(100%-2rem)]">
          {(() => {
            const variant = ALERT_VARIANTS[alertMessage.type] ?? ALERT_VARIANTS.info;
            return (
              <div className={`rounded-lg border p-4 shadow-lg max-w-sm flex items-start gap-3 ${variant.container}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {alertMessage.type === 'error' ? (
                    <AlertCircle className={`h-5 w-5 ${variant.icon}`} />
                  ) : (
                    <CheckCircle className={`h-5 w-5 ${variant.icon}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${variant.title}`}>
                    {alertMessage.message}
                  </p>
                  {variant.detailText && (
                    <p className={`text-xs mt-1 ${variant.detail}`}>{variant.detailText}</p>
                  )}
                </div>
                <button
                  onClick={() => setAlertMessage({ show: false, type: '', message: '' })}
                  className={`flex-shrink-0 ${variant.close}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Manage Plan Modal */}
      {showManagePlanModal && (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-md flex items-center justify-center px-4 py-6 sm:px-0 sm:py-0 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto sm:mx-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Manage Your Plan</h2>
              <button 
                onClick={handleCloseManagePlan}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">Current Plan: <span className="font-semibold text-gray-900">{currentPlan.name}</span></p>
              <p className="text-gray-600 mb-2">Manage your subscription settings:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Update billing cycle</li>
                <li>Change plan</li>
                <li>Cancel subscription</li>
                <li>Update billing information</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseManagePlan}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showAlert('success', 'Plan settings will be updated.');
                  handleCloseManagePlan();
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-md flex items-center justify-center px-4 py-6 sm:px-0 sm:py-0 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto sm:mx-0 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
              <button 
                onClick={handleCloseAddPayment}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultPayment"
                  className="mr-2"
                />
                <label htmlFor="defaultPayment" className="text-sm text-gray-600">
                  Set as default payment method
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleCloseAddPayment}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showAlert('success', 'Payment method added successfully!');
                  handleCloseAddPayment();
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyBilling;

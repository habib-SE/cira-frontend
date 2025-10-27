import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  RefreshCw,
  Plus,
  Edit
} from 'lucide-react';
import { AlertModal } from '../../../components/shared';

const CompanyBilling = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('current');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    buttonText: 'OK'
  });

  // Mock data - replace with actual API calls
  const currentPlan = {
    name: 'Enterprise Plan',
    price: '$299',
    period: 'per month',
    features: [
      'Up to 500 employees',
      'Unlimited AI consultations',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ],
    renewalDate: '2024-02-15',
    status: 'Active'
  };

  const plans = [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      features: [
        'Up to 50 employees',
        'Basic AI consultations',
        'Email support',
        'Standard analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$199',
      period: 'per month',
      features: [
        'Up to 200 employees',
        'Advanced AI consultations',
        'Priority support',
        'Advanced analytics',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: 'per month',
      features: [
        'Up to 500 employees',
        'Unlimited AI consultations',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ];

  const invoices = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '$299.00',
      status: 'Paid',
      description: 'Enterprise Plan - January 2024'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '$299.00',
      status: 'Paid',
      description: 'Enterprise Plan - December 2023'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '$199.00',
      status: 'Paid',
      description: 'Professional Plan - November 2023'
    }
  ];

  const paymentMethods = [
    {
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      type: 'Bank Account',
      last4: '1234',
      brand: 'Chase',
      expiry: null,
      isDefault: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return CheckCircle;
      case 'Pending':
        return Clock;
      case 'Failed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // Handler functions
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Add your refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showAlert({
        type: 'success',
        title: 'Refreshed',
        message: 'Billing information has been refreshed successfully.',
        buttonText: 'OK'
      });
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to refresh billing information.',
        buttonText: 'OK'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportInvoices = () => {
    showAlert({
      type: 'info',
      title: 'Export Invoices',
      message: 'Invoice export functionality will be available in the next update.',
      buttonText: 'Got it'
    });
  };

  const handleUpdatePayment = () => {
    showAlert({
      type: 'info',
      title: 'Update Payment Method',
      message: 'Payment method update functionality will be available soon.',
      buttonText: 'Got it'
    });
  };

  const handleManagePlan = () => {
    showAlert({
      type: 'info',
      title: 'Manage Plan',
      message: 'Plan management functionality will be available soon.',
      buttonText: 'Got it'
    });
  };

  const handleUpgradePlan = (planName) => {
    showAlert({
      type: 'info',
      title: 'Upgrade Plan',
      message: `Upgrade to ${planName} functionality will be available soon.`,
      buttonText: 'Got it'
    });
  };

  const handleAddPaymentMethod = () => {
    showAlert({
      type: 'info',
      title: 'Add Payment Method',
      message: 'Add payment method functionality will be available soon.',
      buttonText: 'Got it'
    });
  };

  const handleDownloadInvoice = (invoiceId) => {
    showAlert({
      type: 'info',
      title: 'Download Invoice',
      message: `Download invoice ${invoiceId} functionality will be available soon.`,
      buttonText: 'Got it'
    });
  };

  const showAlert = (alertConfig) => {
    setAlertModal({
      isOpen: true,
      ...alertConfig
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage payment plans and subscription details</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleExportInvoices}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleUpdatePayment}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Update Payment
          </button>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentPlan.status)}`}>
                  {currentPlan.status}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {currentPlan.price} <span className="text-lg font-normal text-gray-600">{currentPlan.period}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">Renews on {currentPlan.renewalDate}</p>
            </div>
          </div>
          <button 
            onClick={handleManagePlan}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Manage Plan</span>
          </button>
        </div>
      </div>

      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">$897.00</p>
              <p className="text-xs text-gray-500">Last 3 months</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Billing</p>
              <p className="text-2xl font-bold text-gray-900">Feb 15</p>
              <p className="text-xs text-gray-500">$299.00</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usage</p>
              <p className="text-2xl font-bold text-gray-900">156/500</p>
              <p className="text-xs text-gray-500">Employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg ${
                plan.popular
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {plan.price} <span className="text-lg font-normal text-gray-600">{plan.period}</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleUpgradePlan(plan.name)}
                className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button 
            onClick={handleAddPaymentMethod}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Add Payment Method
          </button>
        </div>
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    {method.type} {method.expiry && `• Expires ${method.expiry}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {method.isDefault && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Default
                  </span>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <button 
            onClick={() => showAlert({
              type: 'info',
              title: 'View All Invoices',
              message: 'View all invoices functionality will be available in the next update. Please contact support for assistance.',
              buttonText: 'Got it'
            })}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {invoices.map((invoice, index) => {
            const StatusIcon = getStatusIcon(invoice.status);
            return (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                    <p className="text-xs text-gray-500">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{invoice.amount}</p>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className="h-4 w-4 text-green-500" />
                      <span className={`text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        buttonText={alertModal.buttonText}
      />
    </div>
  );
};

export default CompanyBilling;

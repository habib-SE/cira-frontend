import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  CreditCard, 
  Calendar, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Camera,
  Download,
  Settings,
  Crown,
  Sparkles
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientSubscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Available plans
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with AI healthcare',
      features: [
        '5 AI consultations per month',
        'Basic health scans',
        'Standard response time',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      limitations: [
        'Limited to 5 consultations',
        'Basic AI capabilities only',
        'Standard support response'
      ],
      popular: false,
      current: false
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$29',
      period: 'per month',
      description: 'Most popular for regular healthcare monitoring',
      features: [
        'Unlimited AI consultations',
        'Advanced health scans',
        'Priority response time',
        '24/7 chat support',
        'Advanced analytics & reports',
        'Mobile & web access',
        'Health trend tracking',
        'Prescription reminders'
      ],
      limitations: [],
      popular: true,
      current: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$79',
      period: 'per month',
      description: 'Complete AI healthcare experience',
      features: [
        'Everything in Basic Plan',
        'Unlimited health scans',
        'Instant AI responses',
        'Dedicated health coach',
        'Advanced AI diagnostics',
        'Family plan (up to 5 members)',
        'Priority customer support',
        'Custom health insights',
        'Integration with wearables',
        'Telemedicine consultations'
      ],
      limitations: [],
      popular: false,
      current: false
    }
  ];

  // Current billing information
  const billingInfo = {
    currentPlan: 'Basic Plan',
    nextBillingDate: 'February 15, 2025',
    amount: '$29.00',
    paymentMethod: 'Visa ending in 4242',
    status: 'active',
    autoRenew: true,
    usage: {
      consultations: 12,
      scans: 8,
      limit: 'unlimited'
    }
  };

  const handlePlanSelect = async (planId) => {
    if (planId === selectedPlan) return;
    
    setIsUpgrading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSelectedPlan(planId);
    setIsUpgrading(false);
    
    // In real app, redirect to payment or show success message
    console.log(`Selected plan: ${planId}`);
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free':
        return <Shield className="h-6 w-6" />;
      case 'basic':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free':
        return 'border-gray-200 bg-gray-50';
      case 'basic':
        return 'border-blue-200 bg-blue-50';
      case 'premium':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPlanButtonColor = (planId) => {
    switch (planId) {
      case 'free':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'basic':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'premium':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Usage Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your healthcare needs</p>
        </div>

        {/* All Plans Section */}
        <div className="mb-12">
         

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative p-6 transition-all duration-200 hover:shadow-lg flex flex-col h-full ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                } ${plan.current ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Current Plan</span>
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${getPlanColor(plan.id)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-gray-600">
                      {getPlanIcon(plan.id)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Content Area - Flex grow to push button down */}
                <div className="flex-grow flex flex-col">
                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <div className="h-1 w-1 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Button - Pushed to bottom with mt-auto */}
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={plan.current || isUpgrading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto ${getPlanButtonColor(plan.id)}`}
                >
                  {isUpgrading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : plan.current ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="h-4 w-4" />
                      <span>Current Plan</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      {plan.id === 'free' ? 'Select Plan' : 'Upgrade Plan'}
                    </div>
                  )}
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Plan Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Status */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing Status</h2>
              <p className="text-gray-600">Your current subscription details</p>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                {/* Current Plan */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Current Plan</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{billingInfo.currentPlan}</div>
                      <div className="text-sm text-gray-600">{billingInfo.amount}/month</div>
                    </div>
                  </div>
                </div>

                {/* Next Billing */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Next Billing</h3>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{billingInfo.nextBillingDate}</div>
                      <div className="text-sm text-gray-600">{billingInfo.amount}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{billingInfo.paymentMethod}</div>
                      <div className="text-sm text-gray-600">
                        {billingInfo.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">This Month's Usage</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AI Consultations</span>
                      <span className="font-medium text-gray-900">{billingInfo.usage.consultations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Health Scans</span>
                      <span className="font-medium text-gray-900">{billingInfo.usage.scans}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Plan Limit</span>
                      <span className="font-medium text-gray-900 capitalize">{billingInfo.usage.limit}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {billingInfo.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
              <p className="text-gray-600">Manage your subscription and billing</p>
            </div>

            <Card className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Manage Billing</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Download Invoice</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Contact Support</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default PatientSubscriptions;
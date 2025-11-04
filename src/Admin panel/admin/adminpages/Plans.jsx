import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, CheckCircle, XCircle, Search, Filter, Shield, Star, Crown, Check } from 'lucide-react';
import Card from '../admincomponents/Card';

const Plans = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const defaultPlans = [
    {
      id: 1,
      name: 'Free',
      tier: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      limits: { aiSessions: 5, vitalsScans: 5 },
      features: { plusAI: false, vitals: true, chat: true },
      trial: false
    },
    {
      id: 2,
      name: 'Basic',
      tier: 'Basic',
      priceMonthly: 40,
      priceAnnual: 190,
      limits: { aiSessions: 10, vitalsScans: 10 },
      features: { plusAI: true, vitals: true, chat: true },
      trial: true
    },
    {
      id: 3,
      name: 'Premium',
      tier: 'Premium',
      priceMonthly: 200,
      priceAnnual: 1998,
      limits: { aiSessions: 20, vitalsScans: 20 },
      features: { plusAI: true, vitals: true, chat: true },
      trial: false
    }
  ];

  const [plans, setPlans] = useState(() => {
    const stored = localStorage.getItem('adminPlans');
    try {
      return stored ? JSON.parse(stored) : defaultPlans;
    } catch {
      return defaultPlans;
    }
  });

  // Persist on changes
  useEffect(() => {
    localStorage.setItem('adminPlans', JSON.stringify(plans));
  }, [plans]);

  // In case edits happened in another route/tab, refresh when storage changes
  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem('adminPlans');
      if (stored) setPlans(JSON.parse(stored));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filtered = useMemo(() => {
    return plans.filter(p => (
      (!tierFilter || p.tier === tierFilter) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    ));
  }, [plans, search, tierFilter]);

  const handleDelete = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    showToastNotification('Plan deleted', 'warning');
  };

  const getPlanIcon = (tier) => {
    switch (tier) {
      case 'Free':
        return <Shield className="h-6 w-6" />;
      case 'Basic':
        return <Star className="h-6 w-6" />;
      case 'Premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (tier) => {
    switch (tier) {
      case 'Free':
        return 'border-gray-200 bg-gray-50';
      case 'Basic':
        return 'border-blue-200 bg-blue-50';
      case 'Premium':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions & Plans</h1>
          <p className="text-gray-600">Manage plan tiers, pricing, limits and features</p>
        </div>
        <button
          onClick={() => navigate('/admin/plans/create')}
          className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" /> New Plan
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plans"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">All Tiers</option>
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(plan => (
          <Card 
            key={plan.id} 
            className="relative p-6 transition-all duration-200 hover:shadow-lg"
          >
            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${getPlanColor(plan.tier)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className="text-gray-600">
                  {getPlanIcon(plan.tier)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">${plan.priceMonthly}</span>
                <span className="text-gray-600 ml-1">/mo</span>
              </div>
              <p className="text-sm text-gray-600">Tier: {plan.tier}</p>
            </div>

            {/* Plan Details */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Plan Details:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Annual: <span className="font-medium">${plan.priceAnnual}/yr</span></span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">AI sessions: <span className="font-medium">{plan.limits.aiSessions}</span></span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Vitals scans: <span className="font-medium">{plan.limits.vitalsScans}</span></span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Trial: <span className="font-medium">{plan.trial ? 'Available' : 'No'}</span></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(`/admin/plans/view/${plan.id}`)} 
                className="flex-1 px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>
              <button 
                onClick={() => navigate(`/admin/plans/edit/${plan.id}`)} 
                className="flex-1 px-3 py-2 border rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button 
                onClick={() => handleDelete(plan.id)} 
                className="flex-1 px-3 py-2 border rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 z-50" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] ${toastType === 'warning' ? 'bg-pink-50 border border-pink-200' : 'bg-green-50 border border-green-200'}`}>
            <CheckCircle className={`w-5 h-5 ${toastType === 'warning' ? 'text-pink-600' : 'text-green-600'}`} />
            <p className={`text-sm font-medium ${toastType === 'warning' ? 'text-pink-800' : 'text-green-800'}`}>{toastMessage}</p>
            <button onClick={() => setShowToast(false)} className={`${toastType === 'warning' ? 'text-pink-600 hover:text-pink-800' : 'text-green-600 hover:text-green-800'}`}>
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;



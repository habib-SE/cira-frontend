import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, CheckCircle, Search, Filter, Shield, Star, Crown } from 'lucide-react';
import Card from '../admincomponents/Card';

const Plans = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');

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

  const filtered = useMemo(() => {
    return plans.filter(p => (
      (!tierFilter || p.tier === tierFilter) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    ));
  }, [plans, search, tierFilter]);

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

  const getPlanAccent = (tier) => {
    switch (tier) {
      case 'Free':
        return 'from-gray-50 via-white to-slate-100';
      case 'Basic':
        return 'from-blue-50 via-white to-pink-50';
      case 'Premium':
        return 'from-purple-50 via-white to-amber-50';
      default:
        return 'from-gray-50 via-white to-slate-100';
    }
  };

  const getIconBackground = (tier) => {
    switch (tier) {
      case 'Free':
        return 'bg-white text-gray-500 border border-gray-200';
      case 'Basic':
        return 'bg-gradient-to-br from-pink-500 to-pink-400 text-white shadow-lg shadow-pink-200/60';
      case 'Premium':
        return 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200/60';
      default:
        return 'bg-white text-gray-500 border border-gray-200';
    }
  };

  const getPlanTagline = (tier) => {
    switch (tier) {
      case 'Free':
        return 'Start exploring core features without cost';
      case 'Basic':
        return 'Scale your team with enhanced automation';
      case 'Premium':
        return 'Unlock enterprise-grade intelligence and care';
      default:
        return '';
    }
  };

  const buildHighlights = (plan) => {
    const highlights = [
      `${plan.limits.aiSessions} AI sessions each month`,
      `${plan.limits.vitalsScans} vitals scans included`,
      plan.features.plusAI ? 'CIRA Plus AI workflows' : 'Core assistant features',
      plan.features.chat ? '24/7 priority chat support' : 'Email support',
      plan.trial ? 'Guided onboarding trial included' : 'On-demand onboarding'
    ];

    return highlights;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions & Plans</h1>
          <p className="text-gray-600">Manage plan tiers, pricing, limits and features</p>
        </div>
        <button
          onClick={() => navigate('/admin/plans/create')}
          className="inline-flex items-center justify-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 self-center sm:self-auto"
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
          <div
            key={plan.id}
            className={`relative group rounded-3xl p-6 md:p-8 bg-white/70 backdrop-blur-lg border border-white/60 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br ${getPlanAccent(plan.tier)}`}
          >
            {plan.tier === 'Basic' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                ⭐ Most Popular
              </div>
            )}
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getIconBackground(plan.tier)}`}>
                  {getPlanIcon(plan.tier)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{getPlanTagline(plan.tier)}</p>
                <div className="flex flex-col items-center gap-1">
                  <div>
                    <span className="text-4xl font-extrabold text-gray-900">${plan.priceMonthly}</span>
                    <span className="text-gray-600 ml-1 text-base font-medium">/mo</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    or ${plan.priceAnnual}/yr billed annually
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {buildHighlights(plan).map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate(`/admin/plans/view/${plan.id}`)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-white hover:border-pink-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View plan
                </button>
                <button
                  onClick={() => navigate(`/admin/plans/edit/${plan.id}`)}
                  className="w-full px-4 py-2.5 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-200/60 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Edit plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;



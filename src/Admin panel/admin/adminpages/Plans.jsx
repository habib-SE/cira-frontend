import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import Card from '../admincomponents/Card';

const Plans = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [plans, setPlans] = useState([
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
      priceMonthly: 9,
      priceAnnual: 90,
      limits: { aiSessions: 50, vitalsScans: 50 },
      features: { plusAI: true, vitals: true, chat: true },
      trial: true
    },
    {
      id: 3,
      name: 'Premium',
      tier: 'Premium',
      priceMonthly: 19,
      priceAnnual: 190,
      limits: { aiSessions: 200, vitalsScans: 200 },
      features: { plusAI: true, vitals: true, chat: true },
      trial: true
    }
  ]);

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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(plan => (
          <Card key={plan.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600">Tier: {plan.tier}</p>
              </div>
              <span className="text-pink-600 font-semibold">${plan.priceMonthly}/mo</span>
            </div>
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>Annual: <span className="font-medium">${plan.priceAnnual}/yr</span></p>
              <p>AI sessions: <span className="font-medium">{plan.limits.aiSessions}</span></p>
              <p>Vitals scans: <span className="font-medium">{plan.limits.vitalsScans}</span></p>
              <p>Trial: <span className="font-medium">{plan.trial ? 'Available' : 'No'}</span></p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => navigate(`/admin/plans/view/${plan.id}`)} className="px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-gray-50"><Eye className="w-4 h-4" /></button>
              <button onClick={() => navigate(`/admin/plans/edit/${plan.id}`)} className="px-3 py-1.5 border rounded-lg text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(plan.id)} className="px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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



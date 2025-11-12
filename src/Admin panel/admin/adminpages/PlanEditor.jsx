import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../admincomponents/Card';

const PlanEditor = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    name: '',
    tier: 'Basic',
    priceMonthly: '',
    priceAnnual: '',
    aiSessions: '',
    vitalsScans: '',
    plusAI: false,
    vitals: true,
    chat: true,
    trial: false
  });

  const [errors, setErrors] = useState({});

  // Tier-based vitals limits
  const getTierBasedVitalsLimit = (tier) => {
    switch (tier) {
      case 'Free':
        return 5;
      case 'Basic':
        return 10;
      case 'Premium':
        return 20;
      default:
        return 0;
    }
  };

  // Tier-based AI sessions limits
  const getTierBasedAISessionsLimit = (tier) => {
    switch (tier) {
      case 'Free':
        return 5;
      case 'Basic':
        return 10;
      case 'Premium':
        return 20;
      default:
        return 0;
    }
  };

  // Tier-based monthly price limits
  const getTierBasedMonthlyPriceLimit = (tier) => {
    switch (tier) {
      case 'Free':
        return 0;
      case 'Basic':
        return 50;
      case 'Premium':
        return 200;
      default:
        return 0;
    }
  };

  // Tier-based annual price limits
  const getTierBasedAnnualPriceLimit = (tier) => {
    switch (tier) {
      case 'Free':
        return 0;
      case 'Basic':
        return 500;
      case 'Premium':
        return 2000;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      const stored = localStorage.getItem('adminPlans');
      if (stored) {
        const plans = JSON.parse(stored);
        const plan = plans.find(p => String(p.id) === String(id));
        if (plan) {
          setForm({
            name: plan.name,
            tier: plan.tier,
            priceMonthly: plan.priceMonthly,
            priceAnnual: plan.priceAnnual,
            aiSessions: plan.limits?.aiSessions ?? '',
            vitalsScans: plan.limits?.vitalsScans ?? '',
            plusAI: plan.features?.plusAI ?? false,
            vitals: plan.features?.vitals ?? true,
            chat: plan.features?.chat ?? true,
            trial: plan.trial ?? false
          });
        }
      }
    } else {
      // Set default limits for new plans based on tier
      setForm(prev => ({
        ...prev,
        vitalsScans: getTierBasedVitalsLimit(prev.tier).toString(),
        aiSessions: getTierBasedAISessionsLimit(prev.tier).toString()
      }));
    }
  }, [isEdit, id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If tier changes, update both vitals scans and AI sessions limits
    if (name === 'tier') {
      const vitalsLimit = getTierBasedVitalsLimit(value);
      const aiSessionsLimit = getTierBasedAISessionsLimit(value);
      setForm(prev => ({ 
        ...prev, 
        [name]: value,
        vitalsScans: vitalsLimit.toString(),
        aiSessions: aiSessionsLimit.toString()
      }));
      // Clear tier-related errors when tier changes
      setErrors(prev => ({ 
        ...prev, 
        aiSessions: '',
        vitalsScans: '',
        priceMonthly: '',
        priceAnnual: ''
      }));
    } else {
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    
    // Real-time validation for AI sessions and vitals scans
    if (name === 'aiSessions' && value !== '') {
      const numValue = Number(value);
      const tierLimit = getTierBasedAISessionsLimit(form.tier);
      if (numValue > tierLimit) {
        setErrors(prev => ({ 
          ...prev, 
          aiSessions: `AI sessions cannot exceed ${tierLimit} for ${form.tier} tier`
        }));
      } else {
        setErrors(prev => ({ ...prev, aiSessions: '' }));
      }
    }
    
    if (name === 'vitalsScans' && value !== '') {
      const numValue = Number(value);
      const tierLimit = getTierBasedVitalsLimit(form.tier);
      if (numValue > tierLimit) {
        setErrors(prev => ({ 
          ...prev, 
          vitalsScans: `Vitals scans cannot exceed ${tierLimit} for ${form.tier} tier`
        }));
      } else {
        setErrors(prev => ({ ...prev, vitalsScans: '' }));
      }
    }

    // Real-time validation for monthly price
    if (name === 'priceMonthly' && value !== '') {
      const numValue = Number(value);
      const tierLimit = getTierBasedMonthlyPriceLimit(form.tier);
      if (form.tier === 'Free' && numValue !== 0) {
        setErrors(prev => ({ 
          ...prev, 
          priceMonthly: 'Free tier must have a price of $0'
        }));
      } else if (numValue > tierLimit) {
        setErrors(prev => ({ 
          ...prev, 
          priceMonthly: `Monthly price cannot exceed $${tierLimit} for ${form.tier} tier`
        }));
      } else {
        setErrors(prev => ({ ...prev, priceMonthly: '' }));
      }
    }

    // Real-time validation for annual price
    if (name === 'priceAnnual' && value !== '') {
      const numValue = Number(value);
      const tierLimit = getTierBasedAnnualPriceLimit(form.tier);
      if (form.tier === 'Free' && numValue !== 0) {
        setErrors(prev => ({ 
          ...prev, 
          priceAnnual: 'Free tier must have a price of $0'
        }));
      } else if (numValue > tierLimit) {
        setErrors(prev => ({ 
          ...prev, 
          priceAnnual: `Annual price cannot exceed $${tierLimit} for ${form.tier} tier`
        }));
      } else {
        setErrors(prev => ({ ...prev, priceAnnual: '' }));
      }
    }
    
    // Clear error for other fields when user starts typing
    if (errors[name] && name !== 'aiSessions' && name !== 'vitalsScans' && name !== 'priceMonthly' && name !== 'priceAnnual') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Plan name is required';
    }
    
    if (!form.priceMonthly || Number(form.priceMonthly) < 0) {
      newErrors.priceMonthly = 'Monthly price must be a valid positive number';
    }

    // Validate tier-based monthly price limits
    const monthlyPriceLimit = getTierBasedMonthlyPriceLimit(form.tier);
    if (form.tier === 'Free' && Number(form.priceMonthly) !== 0) {
      newErrors.priceMonthly = 'Free tier must have a price of $0';
    } else if (Number(form.priceMonthly) > monthlyPriceLimit) {
      newErrors.priceMonthly = `Monthly price cannot exceed $${monthlyPriceLimit} for ${form.tier} tier`;
    }
    
    if (!form.priceAnnual || Number(form.priceAnnual) < 0) {
      newErrors.priceAnnual = 'Annual price must be a valid positive number';
    }

    // Validate tier-based annual price limits
    const annualPriceLimit = getTierBasedAnnualPriceLimit(form.tier);
    if (form.tier === 'Free' && Number(form.priceAnnual) !== 0) {
      newErrors.priceAnnual = 'Free tier must have a price of $0';
    } else if (Number(form.priceAnnual) > annualPriceLimit) {
      newErrors.priceAnnual = `Annual price cannot exceed $${annualPriceLimit} for ${form.tier} tier`;
    }
    
    if (!form.aiSessions || Number(form.aiSessions) < 0) {
      newErrors.aiSessions = 'AI sessions limit is required and must be 0 or greater';
    }
    
    if (!form.vitalsScans || Number(form.vitalsScans) < 0) {
      newErrors.vitalsScans = 'Vitals scans limit is required and must be 0 or greater';
    }

    // Validate tier-based AI sessions limits
    const aiSessionsTierLimit = getTierBasedAISessionsLimit(form.tier);
    if (Number(form.aiSessions) > aiSessionsTierLimit) {
      newErrors.aiSessions = `AI sessions cannot exceed ${aiSessionsTierLimit} for ${form.tier} tier`;
    }

    // Validate tier-based vitals limits
    const vitalsTierLimit = getTierBasedVitalsLimit(form.tier);
    if (Number(form.vitalsScans) > vitalsTierLimit) {
      newErrors.vitalsScans = `Vitals scans cannot exceed ${vitalsTierLimit} for ${form.tier} tier`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const stored = localStorage.getItem('adminPlans');
    const plans = stored ? JSON.parse(stored) : [];
    
    // Remove "$" prefix if present before saving
    const cleanMonthlyPrice = String(form.priceMonthly).replace(/\$\s*/g, '').trim();
    const cleanAnnualPrice = String(form.priceAnnual).replace(/\$\s*/g, '').trim();
    
    if (isEdit && id) {
      const updated = plans.map(p =>
        String(p.id) === String(id)
          ? {
              ...p,
              name: form.name,
              tier: form.tier,
              priceMonthly: Number(cleanMonthlyPrice) || 0,
              priceAnnual: Number(cleanAnnualPrice) || 0,
              limits: { aiSessions: Number(form.aiSessions) || 0, vitalsScans: Number(form.vitalsScans) || 0 },
              features: { plusAI: !!form.plusAI, vitals: !!form.vitals, chat: !!form.chat },
              trial: !!form.trial
            }
          : p
      );
      localStorage.setItem('adminPlans', JSON.stringify(updated));
    } else {
      const nextId = plans.reduce((m, p) => Math.max(m, Number(p.id)), 0) + 1;
      const newPlan = {
        id: nextId,
        name: form.name,
        tier: form.tier,
        priceMonthly: Number(cleanMonthlyPrice) || 0,
        priceAnnual: Number(cleanAnnualPrice) || 0,
        limits: { aiSessions: Number(form.aiSessions) || 0, vitalsScans: Number(form.vitalsScans) || 0 },
        features: { plusAI: !!form.plusAI, vitals: !!form.vitals, chat: !!form.chat },
        trial: !!form.trial
      };
      localStorage.setItem('adminPlans', JSON.stringify([...plans, newPlan]));
    }
    navigate('/admin/plans');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Plan' : 'Create Plan'}</h1>
          <p className="text-gray-600">Configure pricing, limits and features</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={onChange} 
                  className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="e.g., Premium" 
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tier</label>
                <select name="tier" value={form.tier} onChange={onChange} className="w-full px-3 py-2 border rounded-lg">
                  <option>Free</option>
                  <option>Basic</option>
                  <option>Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price / month
                  {form.tier !== 'Free' && (
                    <span className="text-xs text-gray-500 ml-2">(Max: ${getTierBasedMonthlyPriceLimit(form.tier)} for {form.tier})</span>
                  )}
                  {form.tier === 'Free' && (
                    <span className="text-xs text-gray-500 ml-2">(Must be $0)</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                  <input 
                    type="number" 
                    name="priceMonthly" 
                    value={form.priceMonthly} 
                    onChange={onChange} 
                    className={`w-full pl-12 pr-3 py-2 border rounded-lg ${errors.priceMonthly ? 'border-red-500' : ''}`}
                    placeholder="0"
                    min="0"
                    max={getTierBasedMonthlyPriceLimit(form.tier)}
                  />
                </div>
                {errors.priceMonthly && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceMonthly}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Annual price
                  {form.tier !== 'Free' && (
                    <span className="text-xs text-gray-500 ml-2">(Max: ${getTierBasedAnnualPriceLimit(form.tier)} for {form.tier})</span>
                  )}
                  {form.tier === 'Free' && (
                    <span className="text-xs text-gray-500 ml-2">(Must be $0)</span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                  <input 
                    type="number" 
                    name="priceAnnual" 
                    value={form.priceAnnual} 
                    onChange={onChange} 
                    className={`w-full pl-12 pr-3 py-2 border rounded-lg ${errors.priceAnnual ? 'border-red-500' : ''}`}
                    placeholder="0"
                    min="0"
                    max={getTierBasedAnnualPriceLimit(form.tier)}
                  />
                </div>
                {errors.priceAnnual && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceAnnual}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  AI sessions
                  <span className="text-xs text-gray-500 ml-2">(Max: {getTierBasedAISessionsLimit(form.tier)} for {form.tier})</span>
                </label>
                <input 
                  type="number" 
                  name="aiSessions" 
                  value={form.aiSessions} 
                  onChange={onChange} 
                  className={`w-full px-3 py-2 border rounded-lg ${errors.aiSessions ? 'border-red-500' : ''}`}
                  placeholder="0"
                  min="0"
                  max={getTierBasedAISessionsLimit(form.tier)}
                />
                {errors.aiSessions && (
                  <p className="text-red-500 text-xs mt-1">{errors.aiSessions}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vitals scans
                  <span className="text-xs text-gray-500 ml-2">(Max: {getTierBasedVitalsLimit(form.tier)} for {form.tier})</span>
                </label>
                <input 
                  type="number" 
                  name="vitalsScans" 
                  value={form.vitalsScans} 
                  onChange={onChange} 
                  className={`w-full px-3 py-2 border rounded-lg ${errors.vitalsScans ? 'border-red-500' : ''}`}
                  placeholder="0"
                  min="0"
                  max={getTierBasedVitalsLimit(form.tier)}
                />
                {errors.vitalsScans && (
                  <p className="text-red-500 text-xs mt-1">{errors.vitalsScans}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" name="plusAI" checked={form.plusAI} onChange={onChange} /> Plus AI</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" name="vitals" checked={form.vitals} onChange={onChange} /> Vitals</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" name="chat" checked={form.chat} onChange={onChange} /> Messages</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" name="trial" checked={form.trial} onChange={onChange} /> Trial available</label>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{form.name || 'Plan name'}</h3>
                <span className="text-pink-600 font-semibold">${form.priceMonthly || 0}/mo</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Tier: {form.tier}</p>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                <li>AI sessions: {form.aiSessions || 0}</li>
                <li>Vitals scans: {form.vitalsScans || 0}</li>
                <li>Trial: {form.trial ? 'Available' : 'No'}</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button 
          onClick={() => navigate('/admin/plans')} 
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button 
          onClick={onSave} 
          className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>Save Plan</span>
        </button>
      </div>
    </div>
  );
};

export default PlanEditor;



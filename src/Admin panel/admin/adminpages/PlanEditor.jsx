import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
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

  useEffect(() => {
    if (isEdit && id) {
      // In real app, fetch by id
      setForm({
        name: 'Basic', tier: 'Basic', priceMonthly: 9, priceAnnual: 90,
        aiSessions: 50, vitalsScans: 50, plusAI: true, vitals: true, chat: true, trial: true
      });
    }
  }, [isEdit, id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSave = () => {
    // validation minimal
    if (!form.name) return;
    navigate('/admin/plans');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Plan' : 'Create Plan'}</h1>
            <p className="text-gray-600">Configure pricing, limits and features</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/plans')} className="px-4 py-2 border rounded-lg"><X className="w-4 h-4" /></button>
          <button onClick={onSave} className="px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"><Save className="w-4 h-4 mr-2 inline" /> Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input name="name" value={form.name} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Premium" />
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
                <label className="block text-sm font-medium mb-1">Price / month</label>
                <input type="number" name="priceMonthly" value={form.priceMonthly} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual price</label>
                <input type="number" name="priceAnnual" value={form.priceAnnual} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">AI sessions</label>
                <input type="number" name="aiSessions" value={form.aiSessions} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vitals scans</label>
                <input type="number" name="vitalsScans" value={form.vitalsScans} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" />
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
    </div>
  );
};

export default PlanEditor;



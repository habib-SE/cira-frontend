import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import Card from '../admincomponents/Card';

const PlanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // placeholder static content; in real app fetch by id
  const plan = {
    id,
    name: 'Basic',
    tier: 'Basic',
    priceMonthly: 9,
    priceAnnual: 90,
    limits: { aiSessions: 50, vitalsScans: 50 },
    features: { plusAI: true, vitals: true, chat: true },
    trial: true
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plan Detail</h1>
            <p className="text-gray-600">View pricing, limits and features</p>
          </div>
        </div>
        <button onClick={() => navigate(`/admin/plans/edit/${plan.id}`)} className="px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4 inline mr-2" /> Edit</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-600">Plan:</span> <span className="font-medium">{plan.name}</span></div>
              <div><span className="text-gray-600">Tier:</span> <span className="font-medium">{plan.tier}</span></div>
              <div><span className="text-gray-600">Price / month:</span> <span className="font-medium">${plan.priceMonthly}</span></div>
              <div><span className="text-gray-600">Annual price:</span> <span className="font-medium">${plan.priceAnnual}</span></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>AI sessions: <span className="font-medium">{plan.limits.aiSessions}</span></div>
              <div>Vitals scans: <span className="font-medium">{plan.limits.vitalsScans}</span></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Plus AI: {plan.features.plusAI ? 'Yes' : 'No'}</li>
              <li>Vitals: {plan.features.vitals ? 'Yes' : 'No'}</li>
              <li>Messages: {plan.features.chat ? 'Yes' : 'No'}</li>
              <li>Trial: {plan.trial ? 'Available' : 'No'}</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <button onClick={() => navigate(`/admin/plans/edit/${plan.id}`)} className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">Edit Plan</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;



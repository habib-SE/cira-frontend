import React, { useState } from 'react';
import Card from '../../admin/admincomponents/Card';

const Billing = () => {
  const [plan] = useState({
    name: 'Basic',
    renewsOn: '2025-11-01',
    paymentMethod: 'Visa •••• 4242',
    aiUsed: 12,
    aiLimit: 50
  });

  const invoices = [
    { id: 'INV-1001', date: '2025-08-01', amount: 9, status: 'Paid' },
    { id: 'INV-1000', date: '2025-07-01', amount: 9, status: 'Paid' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Billing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">{plan.name}</p>
                <p className="text-sm text-gray-600">Renews on {plan.renewsOn}</p>
                <p className="text-sm text-gray-600">Payment method: {plan.paymentMethod}</p>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Upgrade</button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Downgrade</button>
                <button className="px-3 py-2 border rounded-lg text-red-600 hover:bg-red-50">Cancel</button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
            <div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>AI sessions</span>
                <span>{plan.aiUsed}/{plan.aiLimit}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded mt-2">
                <div className="h-2 bg-pink-500 rounded" style={{ width: `${(plan.aiUsed/plan.aiLimit)*100}%` }} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Invoices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Invoice</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{inv.id}</td>
                      <td className="py-2 pr-4">{inv.date}</td>
                      <td className="py-2 pr-4">${inv.amount}</td>
                      <td className="py-2 pr-4">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50">Update Card</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;



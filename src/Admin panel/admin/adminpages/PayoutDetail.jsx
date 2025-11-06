import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Receipt, 
  DollarSign, 
  Calculator,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import Card from '../admincomponents/Card';
import { RecordHeader, StatusChip } from '../../../components/shared';

const PayoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payout, setPayout] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Sample payout data - in real app, fetch by ID
  useEffect(() => {
    const payouts = [
      {
        id: 'PAYOUT-001',
        doctor: 'Dr. Jane Smith',
        doctorId: 'DOC-001',
        period: '2024-01',
        gross: 15000.00,
        commission: 1500.00,
        net: 13500.00,
        status: 'paid',
        paidDate: '2024-01-31T10:00:00Z',
        method: 'Bank Transfer',
        createdAt: '2024-01-30T09:00:00Z',
        updatedAt: '2024-01-31T10:00:00Z',
        lineItems: [
          { appointment: 'APT-001', amount: 5000, commission: 500, date: '2024-01-15' },
          { appointment: 'APT-002', amount: 7000, commission: 700, date: '2024-01-20' },
          { appointment: 'APT-003', amount: 3000, commission: 300, date: '2024-01-25' }
        ],
        bankDetails: {
          accountNumber: '****1234',
          bankName: 'First National Bank',
          routingNumber: '123456789'
        }
      },
      {
        id: 'PAYOUT-002',
        doctor: 'Dr. Michael Johnson',
        doctorId: 'DOC-002',
        period: '2024-01',
        gross: 12000.00,
        commission: 1200.00,
        net: 10800.00,
        status: 'processing',
        paidDate: null,
        method: 'Bank Transfer',
        createdAt: '2024-01-30T11:00:00Z',
        updatedAt: '2024-01-30T11:00:00Z',
        lineItems: [
          { appointment: 'APT-004', amount: 6000, commission: 600, date: '2024-01-18' },
          { appointment: 'APT-005', amount: 6000, commission: 600, date: '2024-01-22' }
        ],
        bankDetails: {
          accountNumber: '****5678',
          bankName: 'Chase Bank',
          routingNumber: '987654321'
        }
      },
      {
        id: 'PAYOUT-003',
        doctor: 'Dr. Sarah Wilson',
        doctorId: 'DOC-003',
        period: '2024-01',
        gross: 8000.00,
        commission: 800.00,
        net: 7200.00,
        status: 'queued',
        paidDate: null,
        method: 'Bank Transfer',
        createdAt: '2024-01-30T12:00:00Z',
        updatedAt: '2024-01-30T12:00:00Z',
        lineItems: [
          { appointment: 'APT-006', amount: 4000, commission: 400, date: '2024-01-19' },
          { appointment: 'APT-007', amount: 4000, commission: 400, date: '2024-01-26' }
        ],
        bankDetails: {
          accountNumber: '****9012',
          bankName: 'Wells Fargo',
          routingNumber: '456789123'
        }
      },
      {
        id: 'PAYOUT-004',
        doctor: 'Dr. Robert Chen',
        doctorId: 'DOC-004',
        period: '2024-01',
        gross: 20000.00,
        commission: 2000.00,
        net: 18000.00,
        status: 'failed',
        paidDate: null,
        method: 'Bank Transfer',
        createdAt: '2024-01-30T13:00:00Z',
        updatedAt: '2024-01-31T14:00:00Z',
        lineItems: [
          { appointment: 'APT-008', amount: 8000, commission: 800, date: '2024-01-16' },
          { appointment: 'APT-009', amount: 12000, commission: 1200, date: '2024-01-28' }
        ],
        bankDetails: {
          accountNumber: '****3456',
          bankName: 'Bank of America',
          routingNumber: '789123456'
        },
        failureReason: 'Invalid bank account details'
      }
    ];

    // Find payout by ID
    const foundPayout = payouts.find(p => p.id === id);
    if (foundPayout) {
      setPayout(foundPayout);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!payout) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/admin/payouts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payout Not Found</h1>
            <p className="text-gray-600">The payout you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/admin/payouts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Payouts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <RecordHeader
          title={`Payout ${payout.id} - ${payout.doctor}`}
          status={payout.status}
          statusType="payout"
          metadata={[
            { label: 'Period', value: payout.period },
            { label: 'Method', value: payout.method },
            { label: 'Created', value: new Date(payout.createdAt).toLocaleDateString() },
            { label: 'Net Amount', value: `$${payout.net.toLocaleString()}` }
          ]}
          actions={[
            { label: 'Edit', icon: Edit, onClick: () => navigate(`/admin/payouts/edit/${payout.id}`) },
            { label: 'Download Report', icon: Download, onClick: () => console.log('Download', payout.id) },
            { label: 'Delete', icon: Trash2, onClick: () => console.log('Delete', payout.id), destructive: true }
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'line-items', label: 'Line Items' },
              { id: 'banking', label: 'Banking' },
              { id: 'history', label: 'History' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Gross Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${payout.gross.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Calculator className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Commission</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${payout.commission.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Net Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${payout.net.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Paid Date</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {payout.paidDate ? new Date(payout.paidDate).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'line-items' && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Appointment</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Commission</th>
                      <th className="text-right py-2">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payout.lineItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{item.appointment}</td>
                        <td className="py-2 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-2 text-right">${item.amount.toLocaleString()}</td>
                        <td className="py-2 text-right text-red-600">-${item.commission.toLocaleString()}</td>
                        <td className="py-2 text-right font-medium text-green-600">
                          ${(item.amount - item.commission).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'banking' && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <p className="mt-1 text-sm text-gray-900">{payout.bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <p className="mt-1 text-sm text-gray-900">{payout.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                  <p className="mt-1 text-sm text-gray-900">{payout.bankDetails.routingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="mt-1 text-sm text-gray-900">{payout.method}</p>
                </div>
              </div>
              {payout.failureReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div className="ml-2">
                      <h4 className="text-sm font-medium text-red-800">Payment Failed</h4>
                      <p className="text-sm text-red-700 mt-1">{payout.failureReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payout History</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payout created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payout.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {payout.paidDate && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payment completed</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payout.paidDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutDetail;


import React, { useState, useEffect } from 'react';
import { 
  RecordHeader, 
  DataTable, 
  FormTemplate, 
  ConfirmationModal,
  StatusChip 
} from '../../../components/shared';
import Card from '../admincomponents/Card';
import { 
  Receipt, 
  DollarSign, 
  CheckCircle,
  Clock,
  Download,
  FileText,
  Calculator,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  User,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminPayouts = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample payout data
  useEffect(() => {
    setPayouts([
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
    ]);
  }, []);

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      render: (value) => (
        <div className="font-mono text-sm text-gray-600 font-medium">
          #{value}
        </div>
      )
    },
    {
      key: 'doctor',
      label: 'Doctor',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.doctorId}</div>
        </div>
      )
    },
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">
          {value}
        </div>
      )
    },
    {
      key: 'gross',
      label: 'Gross',
      sortable: true,
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">
          ${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'commission',
      label: 'Commission',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-red-600 font-medium">
          -${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'net',
      label: 'Net',
      sortable: true,
      render: (value) => (
        <div className="text-sm font-bold text-green-600">
          ${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusChip status={value} type="payout" />
    },
    {
      key: 'paidDate',
      label: 'Paid Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </div>
      )
    },
    {
      key: 'method',
      label: 'Method',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-600">
          {value}
        </div>
      )
    }
  ];

  const formSections = [
    {
      id: 'payout',
      label: 'Payout Information',
      fields: [
        {
          name: 'doctor',
          label: 'Doctor',
          type: 'select',
          required: true,
          options: [
            { value: 'Dr. Jane Smith', label: 'Dr. Jane Smith' },
            { value: 'Dr. Michael Johnson', label: 'Dr. Michael Johnson' },
            { value: 'Dr. Sarah Wilson', label: 'Dr. Sarah Wilson' },
            { value: 'Dr. Robert Chen', label: 'Dr. Robert Chen' }
          ]
        },
        {
          name: 'period',
          label: 'Period',
          type: 'text',
          required: true,
          placeholder: 'YYYY-MM'
        },
        {
          name: 'method',
          label: 'Payment Method',
          type: 'select',
          required: true,
          options: [
            { value: 'Bank Transfer', label: 'Bank Transfer' },
            { value: 'Check', label: 'Check' },
            { value: 'PayPal', label: 'PayPal' }
          ]
        }
      ]
    },
    {
      id: 'financial',
      label: 'Financial Details',
      fields: [
        {
          name: 'gross',
          label: 'Gross Amount',
          type: 'number',
          required: true,
          placeholder: '0.00',
          step: '0.01'
        },
        {
          name: 'commission',
          label: 'Commission Rate (%)',
          type: 'number',
          required: true,
          placeholder: '10',
          step: '0.1',
          min: '0',
          max: '100'
        },
        {
          name: 'net',
          label: 'Net Amount',
          type: 'number',
          required: true,
          placeholder: '0.00',
          step: '0.01',
          readOnly: true
        }
      ]
    },
    {
      id: 'banking',
      label: 'Banking Information',
      fields: [
        {
          name: 'bankName',
          label: 'Bank Name',
          type: 'text',
          required: true,
          placeholder: 'Enter bank name'
        },
        {
          name: 'accountNumber',
          label: 'Account Number',
          type: 'text',
          required: true,
          placeholder: 'Enter account number'
        },
        {
          name: 'routingNumber',
          label: 'Routing Number',
          type: 'text',
          required: true,
          placeholder: 'Enter routing number'
        }
      ]
    }
  ];

  const handleView = (record) => {
    setSelectedPayout(record);
    setActiveTab('overview');
  };

  const handleEdit = (record) => {
    setSelectedPayout(record);
    setFormData(record);
    setShowForm(true);
  };

  const handleDelete = (record) => {
    setSelectedPayout(record);
    setShowDeleteModal(true);
  };

  const handleDownload = (record) => {
    console.log('Downloading payout report for:', record.id);
  };

  const handleCreate = () => {
    setSelectedPayout(null);
    setFormData({});
    setValidationErrors({});
    setShowForm(true);
  };

  const handleSave = () => {
    // Validate form
    const errors = {};
    formSections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          errors[field.name] = `${field.label} is required`;
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Save logic here
    console.log('Saving payout:', formData);
    setShowForm(false);
    setFormData({});
    setValidationErrors({});
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting payout:', selectedPayout.id);
    setShowDeleteModal(false);
    setSelectedPayout(null);
  };

  const payoutStats = {
    total: payouts.length,
    paid: payouts.filter(p => p.status === 'paid').length,
    processing: payouts.filter(p => p.status === 'processing').length,
    queued: payouts.filter(p => p.status === 'queued').length,
    failed: payouts.filter(p => p.status === 'failed').length,
    totalAmount: payouts.reduce((sum, p) => sum + p.net, 0),
    totalCommission: payouts.reduce((sum, p) => sum + p.commission, 0)
  };

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedPayout ? 'Edit Payout' : 'Create Payout'}
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedPayout ? 'Update payout information' : 'Add a new payout record'}
          </p>
        </div>

        <FormTemplate
          sections={formSections}
          data={formData}
          onChange={setFormData}
          errors={validationErrors}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saveLabel={selectedPayout ? 'Update Payout' : 'Create Payout'}
        />
      </div>
    );
  }

  if (selectedPayout && !showForm) {
    return (
      <div className="p-6">
        <RecordHeader
          title={`Payout ${selectedPayout.id} - ${selectedPayout.doctor}`}
          status={selectedPayout.status}
          statusType="payout"
          metadata={[
            { label: 'Period', value: selectedPayout.period },
            { label: 'Method', value: selectedPayout.method },
            { label: 'Created', value: new Date(selectedPayout.createdAt).toLocaleDateString() },
            { label: 'Net Amount', value: `$${selectedPayout.net.toLocaleString()}` }
          ]}
          actions={[
            { label: 'Edit', icon: Edit, onClick: () => handleEdit(selectedPayout) },
            { label: 'Download Report', icon: Download, onClick: () => handleDownload(selectedPayout) },
            { label: 'Delete', icon: Trash2, onClick: () => handleDelete(selectedPayout), destructive: true }
          ]}
        />

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

          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Gross Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${selectedPayout.gross.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Calculator className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Commission</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${selectedPayout.commission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Net Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${selectedPayout.net.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Paid Date</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedPayout.paidDate ? new Date(selectedPayout.paidDate).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'line-items' && (
              <div className="bg-white p-6 rounded-lg border">
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
                      {selectedPayout.lineItems.map((item, index) => (
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
              </div>
            )}

            {activeTab === 'banking' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayout.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayout.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayout.bankDetails.routingNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayout.method}</p>
                  </div>
                </div>
                {selectedPayout.failureReason && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div className="ml-2">
                        <h4 className="text-sm font-medium text-red-800">Payment Failed</h4>
                        <p className="text-sm text-red-700 mt-1">{selectedPayout.failureReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payout History</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payout created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedPayout.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {selectedPayout.paidDate && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Payment completed</p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedPayout.paidDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
        <p className="text-gray-600 mt-1">
          Manage doctor payouts, commissions, and financial transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Payouts</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{payoutStats.total}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+8%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Paid</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{payoutStats.paid}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+15%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Processing</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{payoutStats.processing}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                <span className="text-xs text-yellow-600 font-medium">+2%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Amount</p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                ${payoutStats.totalAmount.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+23%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={payouts}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search by doctor, ID, period, or status..."
        onRefresh={() => setLoading(true)}
        onRowAction={(action, record) => {
          switch (action) {
            case 'view':
              handleView(record);
              break;
            case 'edit':
              handleEdit(record);
              break;
            case 'delete':
              handleDelete(record);
              break;
            case 'download':
              handleDownload(record);
              break;
            default:
              console.log('Action:', action, record);
          }
        }}
        actions={[
          {
            label: 'Create Payout',
            icon: Plus,
            onClick: handleCreate,
            variant: 'primary'
          },
          {
            label: 'Export Report',
            icon: Download,
            onClick: () => console.log('Export all payouts')
          }
        ]}
        emptyMessage="No payouts found"
        emptyDescription="Get started by creating a new payout record"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Payout"
        message={`Are you sure you want to delete payout ${selectedPayout?.id} for ${selectedPayout?.doctor}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </div>
  );
};

export default AdminPayouts;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { 
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
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp
} from 'lucide-react';

const AdminPayouts = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample payout data
  useEffect(() => {
    const defaultActions = [
      { label: 'View', type: 'view', icon: Eye },
      { label: 'Edit', type: 'edit', icon: Edit },
      { label: 'Download', type: 'download', icon: Download },
      { label: 'Delete', type: 'delete', icon: Trash2, variant: 'danger' }
    ];

    const baseData = [
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

    setPayouts(
      baseData.map(payout => ({
        ...payout,
        actions: defaultActions.map(action => ({ ...action }))
      }))
    );
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
    navigate(`/admin/payouts/${record.id}`);
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
    // Create new PDF document
    const pdf = new jsPDF();
    
    // Set up colors
    const primaryColor = [236, 72, 153]; // Pink color
    const darkColor = [17, 24, 39]; // Dark gray
    
    // Header Section
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CIRA AI Healthcare', 15, 20);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Payout Report', 15, 30);
    
    // Payout Information Section
    let yPosition = 55;
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payout Information', 15, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Payout Details
    const details = [
      ['Payout ID:', record.id],
      ['Doctor:', record.doctor],
      ['Doctor ID:', record.doctorId],
      ['Period:', record.period],
      ['Status:', record.status.charAt(0).toUpperCase() + record.status.slice(1)],
      ['Payment Method:', record.method],
      ['Created:', new Date(record.createdAt).toLocaleDateString()],
      ['Updated:', new Date(record.updatedAt).toLocaleDateString()],
      ['Paid Date:', record.paidDate ? new Date(record.paidDate).toLocaleDateString() : 'Pending']
    ];
    
    details.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, 15, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value || 'N/A', 70, yPosition);
      yPosition += 7;
    });
    
    // Financial Summary Section
    yPosition += 5;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Financial Summary', 15, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    
    // Financial Details Box
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(250, 250, 250);
    pdf.roundedRect(15, yPosition - 5, 180, 30, 3, 3, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gross Amount:', 20, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`$${record.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 80, yPosition + 5);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Commission:', 20, yPosition + 12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`-$${record.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 80, yPosition + 12);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Net Amount:', 20, yPosition + 19);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94); // Green color
    pdf.text(`$${record.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 80, yPosition + 19);
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    // Line Items Section
    if (record.lineItems && record.lineItems.length > 0) {
      yPosition += 40;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Line Items', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(9);
      
      // Table Header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(15, yPosition - 5, 180, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.text('Appointment', 20, yPosition);
      pdf.text('Date', 70, yPosition);
      pdf.text('Amount', 110, yPosition);
      pdf.text('Commission', 140, yPosition);
      pdf.text('Net', 175, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      
      record.lineItems.forEach((item) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const itemNet = item.amount - item.commission;
        pdf.text(item.appointment, 20, yPosition);
        pdf.text(new Date(item.date).toLocaleDateString(), 70, yPosition);
        pdf.text(`$${item.amount.toLocaleString()}`, 110, yPosition);
        pdf.text(`-$${item.commission.toLocaleString()}`, 140, yPosition);
        pdf.text(`$${itemNet.toLocaleString()}`, 175, yPosition);
        yPosition += 7;
      });
    }
    
    // Banking Information Section
    if (record.bankDetails) {
      yPosition += 10;
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Banking Information', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const bankDetails = [
        ['Bank Name:', record.bankDetails.bankName],
        ['Account Number:', record.bankDetails.accountNumber],
        ['Routing Number:', record.bankDetails.routingNumber]
      ];
      
      bankDetails.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 15, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value || 'N/A', 70, yPosition);
        yPosition += 7;
      });
    }
    
    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
        105,
        290,
        { align: 'center' }
      );
      pdf.text('© 2025 CIRA AI. All rights reserved.', 105, 295, { align: 'center' });
    }
    
    // Download PDF
    pdf.save(`Payout-${record.id}-${record.doctor.replace(/\s+/g, '-')}.pdf`);
  };

  const handleCreate = () => {
    setSelectedPayout(null);
    setFormData({});
    setValidationErrors({});
    setShowForm(true);
  };

  const handleSave = (updatedData = null) => {
    const dataToValidate = updatedData || formData;
    
    // Validate form - only validate fields that have been touched or on submit
    const errors = {};
    formSections.forEach(section => {
      section.fields.forEach(field => {
        const fieldName = field.name || field.id;
        if (field.required && !dataToValidate[fieldName]) {
          // Only add error if field has value or is being validated
          if (dataToValidate[fieldName] !== undefined && dataToValidate[fieldName] !== '') {
            errors[fieldName] = `${field.label} is required`;
          }
        }
      });
    });

    // Update form data if provided
    if (updatedData) {
      setFormData(updatedData);
    }

    // Only set errors if there are actual validation issues
    if (Object.keys(errors).length > 0) {
      // Don't set errors on initial save - let FormTemplate handle validation
      // setValidationErrors(errors);
      // return;
    }

    // Save logic here
    console.log('Saving payout:', updatedData || formData);
  };

  const handleSubmit = (updatedData = null) => {
    const dataToValidate = updatedData || formData;
    
    // Validate all sections
    const errors = {};
    formSections.forEach(section => {
      const sectionErrors = {};
      section.fields.forEach(field => {
        const fieldName = field.name || field.id;
        if (field.required && !dataToValidate[fieldName]) {
          sectionErrors[fieldName] = `${field.label} is required`;
        }
      });
      if (Object.keys(sectionErrors).length > 0) {
        errors[section.id] = sectionErrors;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Final submit - close form
    console.log('Submitting payout:', updatedData || formData);
    setShowForm(false);
    setFormData({});
    setValidationErrors({});
  };

  const handleDeleteConfirm = () => {
    if (selectedPayout) {
      setPayouts(prev => prev.filter(payout => payout.id !== selectedPayout.id));
    }
    setShowDeleteModal(false);
    setSelectedPayout(null);
  };

  const handleDeleteCancel = () => {
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
          title={selectedPayout ? 'Edit Payout' : 'Create Payout'}
          sections={formSections}
          initialData={formData}
          validationErrors={validationErrors}
          onSave={handleSave}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Payout</h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete payout{' '}
                <span className="font-medium text-gray-900">
                  {selectedPayout?.id}
                </span>{' '}
                for{' '}
                <span className="font-medium text-gray-900">
                  {selectedPayout?.doctor}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts;
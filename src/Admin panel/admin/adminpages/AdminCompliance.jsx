import React, { useState, useEffect } from 'react';
import { 
  RecordHeader, 
  DataTable, 
  FormTemplate, 
  StatusChip 
} from '../../../components/shared';
import Card from '../admincomponents/Card';
import { 
  Shield, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Filter,
  Plus,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

const AdminCompliance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Load compliance data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('adminComplianceRecords');
    if (savedRecords) {
      setComplianceRecords(JSON.parse(savedRecords));
    } else {
      // Default sample data
      const defaultRecords = [
      {
        id: 'COMP-001',
        type: 'HIPAA Audit',
        entity: 'Dr. Jane Smith',
        entityType: 'Doctor',
        status: 'passed',
        score: 95,
        auditDate: '2024-01-15T10:00:00Z',
        nextAudit: '2024-07-15T10:00:00Z',
        auditor: 'John Compliance',
        findings: 2,
        criticalIssues: 0,
        recommendations: 5,
        documents: ['audit-report.pdf', 'compliance-checklist.pdf']
      },
      {
        id: 'COMP-002',
        type: 'Data Privacy Review',
        entity: 'Cardiology Department',
        entityType: 'Department',
        status: 'pending',
        score: null,
        auditDate: '2024-01-20T14:30:00Z',
        nextAudit: '2024-07-20T14:30:00Z',
        auditor: 'Sarah Privacy',
        findings: null,
        criticalIssues: null,
        recommendations: null,
        documents: ['privacy-assessment.pdf']
      },
      {
        id: 'COMP-003',
        type: 'Security Assessment',
        entity: 'IT Infrastructure',
        entityType: 'System',
        status: 'failed',
        score: 68,
        auditDate: '2024-01-10T09:00:00Z',
        nextAudit: '2024-04-10T09:00:00Z',
        auditor: 'Mike Security',
        findings: 8,
        criticalIssues: 3,
        recommendations: 12,
        documents: ['security-report.pdf', 'vulnerability-scan.pdf']
      },
      {
        id: 'COMP-004',
        type: 'Consent Management',
        entity: 'Patient Portal',
        entityType: 'Application',
        status: 'passed',
        score: 88,
        auditDate: '2024-01-05T11:15:00Z',
        nextAudit: '2024-07-05T11:15:00Z',
        auditor: 'Lisa Legal',
        findings: 1,
        criticalIssues: 0,
        recommendations: 3,
        documents: ['consent-audit.pdf']
      }
      ];
      setComplianceRecords(defaultRecords);
      localStorage.setItem('adminComplianceRecords', JSON.stringify(defaultRecords));
    }
  }, []);

  // Save to localStorage whenever records change
  const saveToLocalStorage = (records) => {
    localStorage.setItem('adminComplianceRecords', JSON.stringify(records));
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

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
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'entity',
      label: 'Entity',
      sortable: true,
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900">{record.entity}</div>
          <div className="text-sm text-gray-500">{record.entityType}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusChip status={value} type="compliance" />
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (value, record) => (
        <div className="text-center">
          {value ? (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value >= 90 ? 'bg-green-100 text-green-800' :
              value >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {value}%
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      )
    },
    {
      key: 'auditDate',
      label: 'Audit Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'auditor',
      label: 'Auditor',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      )
    }
  ];

  const formSections = [
    {
      id: 'basic',
      label: 'Basic Information',
      fields: [
        {
          name: 'type',
          label: 'Compliance Type',
          type: 'select',
          required: true,
          options: [
            { value: 'HIPAA Audit', label: 'HIPAA Audit' },
            { value: 'Data Privacy Review', label: 'Data Privacy Review' },
            { value: 'Security Assessment', label: 'Security Assessment' },
            { value: 'Consent Management', label: 'Consent Management' },
            { value: 'Access Control Review', label: 'Access Control Review' },
            { value: 'Incident Response', label: 'Incident Response' }
          ]
        },
        {
          name: 'entity',
          label: 'Entity Name',
          type: 'text',
          required: true,
          placeholder: 'Enter entity name'
        },
        {
          name: 'entityType',
          label: 'Entity Type',
          type: 'select',
          required: true,
          options: [
            { value: 'Doctor', label: 'Doctor' },
            { value: 'Department', label: 'Department' },
            { value: 'System', label: 'System' },
            { value: 'Application', label: 'Application' },
            { value: 'Process', label: 'Process' }
          ]
        },
        {
          name: 'auditor',
          label: 'Auditor',
          type: 'text',
          required: true,
          placeholder: 'Enter auditor name'
        }
      ]
    },
    {
      id: 'schedule',
      label: 'Schedule & Status',
      fields: [
        {
          name: 'auditDate',
          label: 'Audit Date',
          type: 'datetime-local',
          required: true
        },
        {
          name: 'nextAudit',
          label: 'Next Audit Date',
          type: 'datetime-local',
          required: true
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'passed', label: 'Passed' },
            { value: 'failed', label: 'Failed' },
            { value: 'requires-action', label: 'Requires Action' }
          ]
        },
        {
          name: 'score',
          label: 'Compliance Score',
          type: 'number',
          min: 0,
          max: 100,
          placeholder: 'Enter score (0-100)'
        }
      ]
    },
    {
      id: 'results',
      label: 'Audit Results',
      fields: [
        {
          name: 'findings',
          label: 'Number of Findings',
          type: 'number',
          min: 0,
          placeholder: 'Enter number of findings'
        },
        {
          name: 'criticalIssues',
          label: 'Critical Issues',
          type: 'number',
          min: 0,
          placeholder: 'Enter number of critical issues'
        },
        {
          name: 'recommendations',
          label: 'Recommendations',
          type: 'number',
          min: 0,
          placeholder: 'Enter number of recommendations'
        },
        {
          name: 'notes',
          label: 'Additional Notes',
          type: 'textarea',
          rows: 4,
          placeholder: 'Enter any additional notes or comments'
        }
      ]
    }
  ];

  const handleView = (record) => {
    setSelectedRecord(record);
    setActiveTab('overview');
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData(record);
    setShowForm(true);
  };

  const handleDelete = (record) => {
    // Delete the record directly
    const updatedRecords = complianceRecords.filter(r => r.id !== record.id);
    setComplianceRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
    showToast('Compliance record deleted successfully', 'success');
    
    // If we're viewing this record in detail, go back to list
    if (selectedRecord && selectedRecord.id === record.id) {
      setSelectedRecord(null);
    }
  };

  const handleDownload = (record) => {
    // Generate downloadable report
    const reportContent = `
COMPLIANCE AUDIT REPORT
========================

Audit ID: ${record.id}
Type: ${record.type}
Entity: ${record.entity}
Entity Type: ${record.entityType}

Audit Details:
--------------
Status: ${record.status}
Score: ${record.score ? record.score + '%' : 'N/A'}
Audit Date: ${new Date(record.auditDate).toLocaleString()}
Next Audit: ${new Date(record.nextAudit).toLocaleString()}
Auditor: ${record.auditor}

Findings Summary:
-----------------
Total Findings: ${record.findings || 0}
Critical Issues: ${record.criticalIssues || 0}
Recommendations: ${record.recommendations || 0}

Documents:
----------
${record.documents?.join('\n') || 'No documents attached'}

Generated: ${new Date().toLocaleString()}
    `.trim();

    // Create download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-report-${record.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showToast('Report downloaded successfully', 'success');
  };

  const handleCreate = () => {
    setSelectedRecord(null);
    setFormData({});
    setValidationErrors({});
    setShowForm(true);
  };

  const validateForm = (dataToValidate = formData) => {
    const errors = {};
    formSections.forEach(section => {
      const sectionErrors = {};
      section.fields.forEach(field => {
        if (field.required && !dataToValidate[field.name]) {
          sectionErrors[field.name] = `${field.label} is required`;
        }
      });
      if (Object.keys(sectionErrors).length > 0) {
        errors[section.id] = sectionErrors;
      }
    });
    return errors;
  };

  const handleFormChange = (newData) => {
    setFormData(newData);
    // Validate on change to show real-time errors
    const errors = validateForm(newData);
    setValidationErrors(errors);
  };

  const handleSave = (data = formData) => {
    // Validate form
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    let updatedRecords;
    if (selectedRecord) {
      // Update existing record
      updatedRecords = complianceRecords.map(record =>
        record.id === selectedRecord.id ? { ...record, ...data } : record
      );
      showToast('Compliance record updated successfully', 'success');
    } else {
      // Create new record
      const newRecord = {
        ...data,
        id: `COMP-${String(complianceRecords.length + 1).padStart(3, '0')}`,
        documents: []
      };
      updatedRecords = [...complianceRecords, newRecord];
      showToast('Compliance record created successfully', 'success');
    }

    setComplianceRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
    setShowForm(false);
    setFormData({});
    setValidationErrors({});
    setSelectedRecord(null);
  };


  const filteredRecords = complianceRecords.filter(record => {
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    
    return matchesStatus && matchesType;
  });

  const complianceStats = {
    total: complianceRecords.length,
    passed: complianceRecords.filter(r => r.status === 'passed').length,
    failed: complianceRecords.filter(r => r.status === 'failed').length,
    pending: complianceRecords.filter(r => r.status === 'pending').length,
    averageScore: complianceRecords.filter(r => r.score).reduce((acc, r) => acc + r.score, 0) / complianceRecords.filter(r => r.score).length || 0
  };

  if (showForm) {
    return (
      <div className="p-6">
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              <div className={`w-5 h-5 flex-shrink-0 ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className={`ml-2 text-sm ${
                  toast.type === 'success' ? 'text-green-600' : 'text-red-600'
                } hover:opacity-70`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedRecord ? 'Edit Compliance Record' : 'Create Compliance Record'}
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedRecord ? 'Update compliance audit information' : 'Add a new compliance audit record'}
          </p>
        </div>

        <FormTemplate
          sections={formSections}
          initialData={formData}
          data={formData}
          onChange={handleFormChange}
          validationErrors={validationErrors}
          onSave={handleSave}
          onSubmit={() => handleSave(formData)}
          onCancel={() => {
            setShowForm(false);
            setFormData({});
            setValidationErrors({});
          }}
          saveLabel={selectedRecord ? 'Update Record' : 'Create Record'}
        />
      </div>
    );
  }

  if (selectedRecord && !showForm) {
    return (
      <div className="p-6">
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              <div className={`w-5 h-5 flex-shrink-0 ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className={`ml-2 text-sm ${
                  toast.type === 'success' ? 'text-green-600' : 'text-red-600'
                } hover:opacity-70`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setSelectedRecord(null)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>

        <RecordHeader
          title={`${selectedRecord.type} - ${selectedRecord.entity}`}
          status={selectedRecord.status}
          statusType="compliance"
          metadata={[
            { label: 'ID', value: selectedRecord.id },
            { label: 'Auditor', value: selectedRecord.auditor },
            { label: 'Audit Date', value: new Date(selectedRecord.auditDate).toLocaleDateString() },
            { label: 'Score', value: selectedRecord.score ? `${selectedRecord.score}%` : 'N/A' }
          ]}
          secondaryActions={[
            { label: 'Edit', icon: Edit, onClick: () => handleEdit(selectedRecord) },
            { label: 'Download Report', icon: Download, onClick: () => handleDownload(selectedRecord) },
            { label: 'Delete', icon: Trash2, onClick: () => handleDelete(selectedRecord), variant: 'danger' }
          ]}
        />

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'details', label: 'Details' },
                { id: 'documents', label: 'Documents' },
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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecord.score ? `${selectedRecord.score}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Findings</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecord.findings || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecord.criticalIssues || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Recommendations</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedRecord.recommendations || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entity Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRecord.entityType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Next Audit Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRecord.nextAudit).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auditor</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRecord.auditor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <StatusChip status={selectedRecord.status} type="compliance" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Documents</h3>
                <div className="space-y-3">
                  {selectedRecord.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{doc}</span>
                      </div>
                      <button 
                        onClick={() => {
                          // Simulate document download
                          const link = document.createElement('a');
                          link.href = '#';
                          link.download = doc;
                          showToast(`Downloading ${doc}`, 'success');
                        }}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                  {(!selectedRecord.documents || selectedRecord.documents.length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-4">No documents available</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Audit History</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Audit completed</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedRecord.auditDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
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
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className={`w-5 h-5 flex-shrink-0 ${
              toast.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className={`ml-2 text-sm ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
              } hover:opacity-70`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage compliance audits, assessments, and regulatory requirements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Audits</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{complianceStats.total}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+5%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Passed</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{complianceStats.passed}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+12%</span>
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
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Failed</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{complianceStats.failed}</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-red-500 flex-shrink-0" />
                <span className="text-xs text-red-600 font-medium">-3%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1 truncate">Average Score</p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {Math.round(complianceStats.averageScore)}%
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">+2%</span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredRecords}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search compliance records..."
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
            label: 'Create Compliance Record',
            icon: Plus,
            onClick: handleCreate,
            variant: 'primary'
          }
        ]}
        showPageSize={false}
        emptyMessage="No compliance records found"
        emptyDescription="Get started by creating a new compliance audit record"
      />
    </div>
  );
};

export default AdminCompliance;

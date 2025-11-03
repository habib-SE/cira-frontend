import React, { useState, useEffect } from 'react';
import { 
  RecordHeader, 
  DataTable, 
  FormTemplate, 
  ConfirmationModal,
  StatusChip 
} from '../../../components/shared';
import { 
  Users, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  Mail,
  Key,
  Shield,
  Download
} from 'lucide-react';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual API calls
  useEffect(() => {
    setUsers([
      {
        id: 'USR-001',
        name: 'Dr. Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Doctor',
        status: 'verified',
        lastLogin: '2024-01-20T09:15:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        department: 'Cardiology',
        dob: '1985-03-15',
        gender: 'Female'
      },
      {
        id: 'USR-002',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 987-6543',
        role: 'Patient',
        status: 'active',
        lastLogin: '2024-01-19T16:20:00Z',
        createdAt: '2024-01-10T08:45:00Z',
        department: null,
        dob: '1990-07-22',
        gender: 'Male'
      },
      {
        id: 'USR-003',
        name: 'Dr. Michael Johnson',
        email: 'michael.johnson@example.com',
        phone: '+1 (555) 456-7890',
        role: 'Doctor',
        status: 'pending',
        lastLogin: 'Never',
        createdAt: '2024-01-18T11:30:00Z',
        department: 'Neurology',
        dob: '1978-11-08',
        gender: 'Male'
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
          CIRA-{String(value).replace('USR-', '').padStart(4, '0')}
        </div>
      )
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value) => <StatusChip status={value} type="verification" />
    },
    { key: 'lastLogin', label: 'Last Login', sortable: true },
    { key: 'createdAt', label: 'Created At', sortable: true }
  ];

  const formSections = [
    {
      id: 'profile',
      label: 'Profile Information',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true,
          placeholder: 'Enter first name'
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          required: true,
          placeholder: 'Enter last name'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
          placeholder: 'Enter email address'
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: '+1 (555) 123-4567',
          pattern: '^\\+?[1-9]\\d{1,14}$'
        },
        {
          id: 'dob',
          type: 'text',
          label: 'Date of Birth',
          placeholder: 'YYYY-MM-DD'
        },
        {
          id: 'gender',
          type: 'select',
          label: 'Gender',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]
        }
      ]
    },
    {
      id: 'account',
      label: 'Account Settings',
      fields: [
        {
          id: 'role',
          type: 'select',
          label: 'Role',
          required: true,
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'doctor', label: 'Doctor' },
            { value: 'user', label: 'Patient' },
            { value: 'company', label: 'Company' }
          ]
        },
        {
          id: 'department',
          type: 'text',
          label: 'Department',
          placeholder: 'Enter department (for doctors)'
        },
        {
          id: 'status',
          type: 'select',
          label: 'Status',
          required: true,
          options: [
            { value: 'active', label: 'Active' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'pending', label: 'Pending' }
          ]
        },
        {
          id: 'password',
          type: 'text',
          label: 'Password',
          required: true,
          placeholder: 'Enter password'
        }
      ]
    },
    {
      id: 'health',
      label: 'Health Information',
      fields: [
        {
          id: 'medicalHistory',
          type: 'textarea',
          label: 'Medical History',
          placeholder: 'Enter medical history',
          rows: 4
        },
        {
          id: 'allergies',
          type: 'textarea',
          label: 'Allergies',
          placeholder: 'Enter known allergies',
          rows: 3
        },
        {
          id: 'medications',
          type: 'textarea',
          label: 'Current Medications',
          placeholder: 'Enter current medications',
          rows: 3
        }
      ]
    },
    {
      id: 'privacy',
      label: 'Privacy & Consent',
      fields: [
        {
          id: 'consentStatus',
          type: 'select',
          label: 'Consent Status',
          required: true,
          options: [
            { value: 'granted', label: 'Granted' },
            { value: 'pending', label: 'Pending' },
            { value: 'revoked', label: 'Revoked' }
          ]
        },
        {
          id: 'consentDate',
          type: 'text',
          label: 'Consent Date',
          placeholder: 'YYYY-MM-DD'
        },
        {
          id: 'dataRetention',
          type: 'select',
          label: 'Data Retention Policy',
          options: [
            { value: 'standard', label: 'Standard (7 years)' },
            { value: 'extended', label: 'Extended (10 years)' },
            { value: 'minimal', label: 'Minimal (3 years)' }
          ]
        }
      ]
    }
  ];

  const handleRecordAction = (actionId) => {
    switch (actionId) {
      case 'edit':
        setShowForm(true);
        break;
      case 'approve':
        console.log('Approving user:', selectedUser?.name);
        break;
      case 'reject':
        console.log('Rejecting user:', selectedUser?.name);
        break;
      case 'suspend':
        console.log('Suspending user:', selectedUser?.name);
        break;
      case 'activate':
        console.log('Activating user:', selectedUser?.name);
        break;
      case 'reset-password':
        console.log('Resetting password for:', selectedUser?.name);
        break;
      case 'send-link':
        console.log('Sending magic link to:', selectedUser?.name);
        break;
      case 'download':
        console.log('Downloading user data for:', selectedUser?.name);
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
    setShowForm(false);
  };

  const handleFormSave = (data) => {
    console.log('Form saved as draft:', data);
  };

  const handleFormSaveAndClose = (data) => {
    console.log('Form saved and closed:', data);
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting user:', selectedUser?.name);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleRowAction = (actionId, rowData) => {
    switch (actionId) {
      case 'view':
        setSelectedUser(rowData);
        break;
      case 'edit':
        setSelectedUser(rowData);
        setFormData(rowData);
        setShowForm(true);
        break;
      case 'delete':
        setSelectedUser(rowData);
        setShowDeleteModal(true);
        break;
      case 'suspend':
        console.log('Suspending user:', rowData.name);
        break;
      case 'activate':
        console.log('Activating user:', rowData.name);
        break;
      case 'reset-password':
        console.log('Resetting password for:', rowData.name);
        break;
      case 'send-link':
        console.log('Sending magic link to:', rowData.name);
        break;
      default:
        console.log('Row action:', actionId, rowData);
    }
  };

  if (showForm) {
    return (
      <FormTemplate
        title={selectedUser ? `Edit User: ${selectedUser.name}` : 'Create New User'}
        sections={formSections}
        initialData={formData}
        validationErrors={validationErrors}
        onSubmit={handleFormSubmit}
        onSave={handleFormSave}
        onSaveAndClose={handleFormSaveAndClose}
        onCancel={() => {
          setShowForm(false);
          setSelectedUser(null);
          setFormData({});
        }}
        lastSaved={new Date().toISOString()}
        isDraft={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Record Header for selected user */}
      {selectedUser && (
        <RecordHeader
          title={selectedUser.name}
          status={selectedUser.status}
          statusType="verification"
          metadata={{
            id: selectedUser.id,
            createdAt: selectedUser.createdAt,
            updatedAt: selectedUser.updatedAt,
            owner: 'Admin User',
            department: selectedUser.department,
            phone: selectedUser.phone,
            email: selectedUser.email
          }}
          primaryActions={[
            { id: 'edit', label: 'Edit', variant: 'primary' },
            { id: 'approve', label: 'Approve', variant: 'success' },
            { id: 'reject', label: 'Reject', variant: 'danger' },
            { id: 'suspend', label: 'Suspend', variant: 'warning' },
            { id: 'activate', label: 'Activate', variant: 'success' }
          ]}
          secondaryActions={[
            { id: 'reset-password', label: 'Reset Password' },
            { id: 'send-link', label: 'Send Magic Link' },
            { id: 'download', label: 'Download Data' }
          ]}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' },
            { id: 'history', label: 'History' },
            { id: 'files', label: 'Files' },
            { id: 'related', label: 'Related' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAction={handleRecordAction}
        />
      )}

      {/* Data Table */}
      <div className="p-6">
        <DataTable
          title="Users"
          count={users.length}
          primaryCTA={{ 
            label: 'Create User', 
            onClick: () => {
              setSelectedUser(null);
              setFormData({});
              setShowForm(true);
            }
          }}
          secondaryActions={[
            { label: 'Export CSV', onClick: () => console.log('Export CSV') }
          ]}
          columns={columns}
          data={users}
          searchPlaceholder="Search by name, email, ID, role, department, or status..."
          filters={[]}
          onRowAction={handleRowAction}
          lastUpdated={new Date().toISOString()}
          loading={loading}
          emptyState={{
            icon: '👥',
            title: 'No users found',
            description: 'Get started by creating your first user.',
            action: { 
              label: 'Create User', 
              onClick: () => {
                setSelectedUser(null);
                setFormData({});
                setShowForm(true);
              }
            }
          }}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        type="delete"
        itemName={selectedUser?.name || 'User'}
        itemType="user"
        impact="This will permanently remove the user and all associated data from the system."
        isDestructive={true}
      />
    </div>
  );
};

export default AdminUsers;

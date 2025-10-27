import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../../Admin panel/admin/admincomponents/Card';
import Button from '../shared/Button';
import ConfirmationModal from '../shared/ConfirmationModal';

const DataManagement = ({ 
  userData = {},
  onExportData,
  onDeleteData,
  className = ''
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dataCategories = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Personal details, contact information, and account settings',
      icon: User,
      size: '2.3 KB',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'health',
      title: 'Health Data',
      description: 'Medical history, symptoms, vital signs, and health records',
      icon: FileText,
      size: '15.7 KB',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'ai_reports',
      title: 'AI Reports',
      description: 'Generated health reports, recommendations, and analysis',
      icon: Shield,
      size: '8.2 KB',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Scheduled visits, consultation history, and doctor notes',
      icon: Calendar,
      size: '4.1 KB',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'activity',
      title: 'Activity Logs',
      description: 'App usage, session data, and interaction history',
      icon: Clock,
      size: '12.5 KB',
      lastUpdated: '2024-01-15'
    }
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      if (onExportData) {
        await onExportData(exportFormat);
      }
      // Simulate export process
      setTimeout(() => {
        setIsExporting(false);
        // Show success message
      }, 2000);
    } catch (error) {
      setIsExporting(false);
      // Handle error
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      if (onDeleteData) {
        await onDeleteData();
      }
      // Simulate deletion process
      setTimeout(() => {
        setIsDeleting(false);
        setShowDeleteModal(false);
        // Show success message
      }, 3000);
    } catch (error) {
      setIsDeleting(false);
      // Handle error
    }
  };

  const getTotalDataSize = () => {
    return dataCategories.reduce((total, category) => {
      const size = parseFloat(category.size);
      return total + size;
    }, 0).toFixed(1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
          <p className="text-gray-600">Export or delete your personal data</p>
        </div>
        <div className="text-sm text-gray-500">
          Total data size: {getTotalDataSize()} KB
        </div>
      </div>

      {/* Data Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{category.size}</span>
                    <span className="text-xs text-gray-500">{category.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Export Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Download className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Download a copy of all your personal data in your preferred format.
        </p>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Format:</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          
          <Button
            variant="primary"
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Delete Section */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Delete Your Data</h3>
        </div>
        <div className="space-y-3">
          <p className="text-gray-700">
            Permanently delete all your personal data from our systems. This action cannot be undone.
          </p>
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>All your health records and AI reports will be permanently deleted</li>
                <li>Your account will be deactivated and cannot be recovered</li>
                <li>Any pending appointments will be cancelled</li>
                <li>This action is irreversible</li>
              </ul>
            </div>
          </div>
          
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            className="mt-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>
        </div>
      </Card>

      {/* Consent History */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Consent History</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              date: '2024-01-15 14:30',
              action: 'Privacy Policy Updated',
              status: 'Accepted',
              version: 'v2.1'
            },
            {
              date: '2024-01-10 09:15',
              action: 'Data Processing Consent',
              status: 'Accepted',
              version: 'v2.0'
            },
            {
              date: '2024-01-01 16:45',
              action: 'Initial Consent',
              status: 'Accepted',
              version: 'v1.0'
            }
          ].map((consent, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{consent.action}</p>
                <p className="text-sm text-gray-600">{consent.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">v{consent.version}</span>
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {consent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteData}
        title="Delete All Personal Data"
        message="Are you sure you want to permanently delete all your personal data? This action cannot be undone and will result in the complete removal of your account and all associated data."
        confirmText="Delete All Data"
        cancelText="Cancel"
        type="danger"
        requireTextInput={true}
        confirmInputText="DELETE"
        loading={isDeleting}
      />
    </div>
  );
};

export default DataManagement;

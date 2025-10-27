import React from 'react';
import { 
  Edit, 
  Download, 
  Share2, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import StatusChip from './StatusChip';
import Button from './Button';

const RecordHeader = ({
  title,
  subtitle,
  status,
  statusType = 'default',
  metadata = [],
  primaryActions = [],
  secondaryActions = [],
  tabs = [],
  activeTab,
  onTabChange,
  className = ''
}) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'active':
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'suspended':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getMetadataIcon = (type) => {
    switch (type) {
      case 'id':
        return <Tag className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Title and Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {status && (
                <StatusChip 
                  status={status} 
                  type={statusType}
                  size="md"
                />
              )}
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
            )}

            {/* Metadata */}
            {metadata.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {metadata.map((item, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    {getMetadataIcon(item.type) && (
                      <div className="text-gray-400">
                        {getMetadataIcon(item.type)}
                      </div>
                    )}
                    <span className="font-medium">{item.label}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Primary Actions */}
            {primaryActions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {primaryActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'primary'}
                    size={action.size || 'md'}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={action.className}
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Secondary Actions */}
            {secondaryActions.length > 0 && (
              <div className="flex items-center space-x-2">
                {secondaryActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="flex items-center space-x-1"
                  >
                    {action.icon && <action.icon className="w-4 h-4" />}
                    {action.label && <span className="hidden sm:inline">{action.label}</span>}
                  </Button>
                ))}
              </div>
            )}

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                className="p-2"
                onClick={() => {/* Handle more actions */}}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline" />}
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default RecordHeader;

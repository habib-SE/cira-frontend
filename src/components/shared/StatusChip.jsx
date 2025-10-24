import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  DollarSign,
  FileText,
  TrendingUp,
  Shield
} from 'lucide-react';

const StatusChip = ({ 
  status, 
  type = 'default', 
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStatusConfig = (status, type) => {
    const statusLower = status?.toLowerCase();
    
    // Verification statuses
    if (type === 'verification' || ['pending', 'verified', 'rejected', 'suspended'].includes(statusLower)) {
      switch (statusLower) {
        case 'pending':
          return {
            icon: Clock,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            label: 'Pending'
          };
        case 'verified':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Verified'
          };
        case 'rejected':
          return {
            icon: XCircle,
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            label: 'Rejected'
          };
        case 'suspended':
          return {
            icon: AlertCircle,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: 'Suspended'
          };
        default:
          return {
            icon: Clock,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Appointment statuses
    if (type === 'appointment' || ['requested', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(statusLower)) {
      switch (statusLower) {
        case 'requested':
          return {
            icon: Clock,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            label: 'Requested'
          };
        case 'confirmed':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Confirmed'
          };
        case 'completed':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Completed'
          };
        case 'cancelled':
          return {
            icon: XCircle,
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            label: 'Cancelled'
          };
        case 'no-show':
          return {
            icon: AlertCircle,
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-800',
            borderColor: 'border-orange-200',
            label: 'No Show'
          };
        default:
          return {
            icon: Clock,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Payment statuses
    if (type === 'payment' || ['pending', 'paid', 'refunded', 'failed'].includes(statusLower)) {
      switch (statusLower) {
        case 'pending':
          return {
            icon: Clock,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            label: 'Pending'
          };
        case 'paid':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Paid'
          };
        case 'refunded':
          return {
            icon: DollarSign,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            label: 'Refunded'
          };
        case 'failed':
          return {
            icon: XCircle,
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            label: 'Failed'
          };
        default:
          return {
            icon: Clock,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Payout statuses
    if (type === 'payout' || ['queued', 'processing', 'paid', 'failed'].includes(statusLower)) {
      switch (statusLower) {
        case 'queued':
          return {
            icon: Clock,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            label: 'Queued'
          };
        case 'processing':
          return {
            icon: Clock,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            label: 'Processing'
          };
        case 'paid':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Paid'
          };
        case 'failed':
          return {
            icon: XCircle,
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            label: 'Failed'
          };
        default:
          return {
            icon: Clock,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Report statuses
    if (type === 'report' || ['draft', 'finalized', 'shared'].includes(statusLower)) {
      switch (statusLower) {
        case 'draft':
          return {
            icon: FileText,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: 'Draft'
          };
        case 'finalized':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Finalized'
          };
        case 'shared':
          return {
            icon: Shield,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            label: 'Shared'
          };
        default:
          return {
            icon: FileText,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Referral statuses
    if (type === 'referral' || ['tracked', 'converted', 'commission due', 'settled'].includes(statusLower)) {
      switch (statusLower) {
        case 'tracked':
          return {
            icon: TrendingUp,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            label: 'Tracked'
          };
        case 'converted':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Converted'
          };
        case 'commission due':
          return {
            icon: DollarSign,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            label: 'Commission Due'
          };
        case 'settled':
          return {
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            label: 'Settled'
          };
        default:
          return {
            icon: TrendingUp,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-200',
            label: status
          };
      }
    }

    // Default fallback
    return {
      icon: Clock,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      label: status
    };
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      case 'xl':
        return 'px-5 py-3 text-base';
      default: // md
        return 'px-3 py-1.5 text-sm';
    }
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center space-x-1 font-semibold rounded-full border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${getSizeClasses(size)}
        ${className}
      `}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusChip;

import React from 'react';
import { CheckCircle, Clock, AlertCircle, Ban, X } from 'lucide-react';

const MetaChips = ({ status, id, date, owner, statusColor = 'blue' }) => {
  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
      case 'scheduled':
        return <Clock className="w-3 h-3" />;
      case 'in progress':
        return <Clock className="w-3 h-3 animate-spin" />;
      case 'cancelled':
      case 'rejected':
        return <X className="w-3 h-3" />;
      case 'suspended':
        return <Ban className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'active':
      case 'confirmed':
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
      case 'rejected':
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {status && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{status}</span>
        </div>
      )}
      
      {id && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          <span className="text-gray-500">ID:</span>
          <span>{id}</span>
        </div>
      )}
      
      {date && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          <Clock className="w-3 h-3" />
          <span>{date}</span>
        </div>
      )}
      
      {owner && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          <span className="text-gray-500">Owner:</span>
          <span>{owner}</span>
        </div>
      )}
    </div>
  );
};

export default MetaChips;


import React, { useState, useEffect, useRef } from 'react';
import { Shield, CheckCircle, Clock, X } from 'lucide-react';

const ConsentIndicator = () => {
  const [showDetails, setShowDetails] = useState(false);
  const dropdownRef = useRef(null);
  
  // Mock consent data - in real app, this would come from API
  const consentData = {
    lastUpdated: '2024-01-15',
    status: 'active',
    version: '2.1',
    expiresIn: '90 days'
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  const getStatusColor = () => {
    switch (consentData.status) {
      case 'active':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (consentData.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Consent indicator button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
      >
        <Shield className={`w-4 h-4 ${getStatusColor()}`} />
        <span className="text-gray-700 font-medium">Consent</span>
        <span className={`text-xs ${getStatusColor()}`}>
          {consentData.status}
        </span>
      </button>

      {/* Consent details dropdown */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Consent Status
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="font-medium capitalize">{consentData.status}</span>
                </div>
              </div>

              {/* Version */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="text-sm font-medium text-gray-900">{consentData.version}</span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm font-medium text-gray-900">{consentData.lastUpdated}</span>
              </div>

              {/* Expires In */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expires In:</span>
                <span className="text-sm font-medium text-gray-900">{consentData.expiresIn}</span>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Your consent is active and up to date. You can view the full consent log at any time.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Navigate to consent log
                    setShowDetails(false);
                  }}
                  className="w-full px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors font-medium"
                >
                  View Consent Log
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ConsentIndicator;


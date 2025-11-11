import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  Trash2, 
  UserX, 
  CreditCard,
  FileText,
  Copy
} from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'delete', // 'delete', 'suspend', 'refund', 'archive'
  itemName,
  itemType = 'item',
  impact = '',
  isDestructive = true,
  confirmText = '',
  requireInput = true,
  isLoading = false,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(!requireInput);

  useEffect(() => {
    setInputValue('');
    setIsConfirmed(!requireInput);
  }, [requireInput, isOpen]);

  const getModalConfig = () => {
    switch (type) {
      case 'delete':
        return {
          icon: Trash2,
          title: 'Delete Item',
          description: `Are you sure you want to delete "${itemName}"?`,
          confirmLabel: 'Delete',
          confirmText: `Type "DELETE" to confirm`,
          buttonVariant: 'danger'
        };
      case 'suspend':
        return {
          icon: UserX,
          title: 'Suspend User',
          description: `Are you sure you want to suspend "${itemName}"?`,
          confirmLabel: 'Suspend',
          confirmText: `Type "SUSPEND" to confirm`,
          buttonVariant: 'warning'
        };
      case 'refund':
        return {
          icon: CreditCard,
          title: 'Process Refund',
          description: `Are you sure you want to refund "${itemName}"?`,
          confirmLabel: 'Refund',
          confirmText: `Type "REFUND" to confirm`,
          buttonVariant: 'warning'
        };
      case 'archive':
        return {
          icon: FileText,
          title: 'Archive Item',
          description: `Are you sure you want to archive "${itemName}"?`,
          confirmLabel: 'Archive',
          confirmText: `Type "ARCHIVE" to confirm`,
          buttonVariant: 'secondary'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Confirm Action',
          description: `Are you sure you want to proceed with "${itemName}"?`,
          confirmLabel: 'Confirm',
          confirmText: `Type "CONFIRM" to proceed`,
          buttonVariant: 'primary'
        };
    }
  };

  const config = getModalConfig();
  const requiredText = confirmText || config.confirmText.split('"')[1];
  const shouldRenderInput = requireInput && requiredText;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsConfirmed(value === requiredText);
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      handleClose();
    }
  };

  const handleClose = () => {
    setInputValue('');
    setIsConfirmed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* Icon */}
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                config.buttonVariant === 'danger' ? 'bg-red-100' :
                config.buttonVariant === 'warning' ? 'bg-yellow-100' :
                config.buttonVariant === 'secondary' ? 'bg-gray-100' :
                'bg-pink-100'
              }`}>
                <config.icon className={`h-6 w-6 ${
                  config.buttonVariant === 'danger' ? 'text-red-600' :
                  config.buttonVariant === 'warning' ? 'text-yellow-600' :
                  config.buttonVariant === 'secondary' ? 'text-gray-600' :
                  'text-pink-600'
                }`} />
              </div>

              {/* Content */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {config.title}
                </h3>
                
                <div className="text-sm text-gray-500 mb-4">
                  <p className="mb-2">{config.description}</p>
                  
                  {/* Impact description */}
                  {impact && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <div className="flex">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 font-medium">Impact:</p>
                          <p className="text-sm text-yellow-700">{impact}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Irreversible note */}
                  {isDestructive && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-800 font-medium">Warning:</p>
                          <p className="text-sm text-red-700">This action cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmation input */}
                {shouldRenderInput && (
                  <div className="mt-4">
                    <label htmlFor="confirm-input" className="block text-sm font-medium text-gray-700 mb-2">
                      {config.confirmText}
                    </label>
                    <input
                      id="confirm-input"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={requiredText}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmed || isLoading}
              className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                config.buttonVariant === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : config.buttonVariant === 'warning'
                  ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  : config.buttonVariant === 'secondary'
                  ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                  : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                config.confirmLabel
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
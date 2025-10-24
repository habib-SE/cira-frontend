import React from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  XCircle,
  Trash2,
  AlertCircle
} from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  requireTextInput = false,
  confirmInputText = '',
  onInputChange,
  loading = false,
  className = ''
}) => {
  if (!isOpen) return null;

  const getTypeConfig = (type) => {
    switch (type) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          buttonVariant: 'danger'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          iconBg: 'bg-green-100',
          buttonVariant: 'primary'
        };
      case 'info':
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
          buttonVariant: 'primary'
        };
      default: // warning
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-100',
          buttonVariant: 'warning'
        };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  const handleConfirm = () => {
    if (requireTextInput && confirmInputText !== confirmText) {
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg max-h-[95vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-4">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${config.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                <Icon className={`h-6 w-6 ${config.iconColor}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>

                {/* Text input requirement */}
                {requireTextInput && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="font-bold text-red-600">{confirmText}</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmInputText}
                      onChange={(e) => onInputChange && onInputChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder={confirmText}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              variant={config.buttonVariant}
              onClick={handleConfirm}
              disabled={loading || (requireTextInput && confirmInputText !== confirmText)}
              className="w-full sm:w-auto sm:ml-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

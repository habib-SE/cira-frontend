import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const FormTemplate = ({
  title,
  sections = [],
  onSubmit,
  onCancel,
  onSave,
  onSaveAndClose,
  initialData = {},
  validationErrors = {},
  isSubmitting = false,
  isDraft = false,
  lastSaved = null,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && !isSubmitting) {
      const autoSaveTimer = setTimeout(() => {
        setIsAutoSaving(true);
        if (onSave) {
          onSave(formData);
        }
        setTimeout(() => {
          setIsAutoSaving(false);
          setHasUnsavedChanges(false);
        }, 1000);
      }, 2000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData, hasUnsavedChanges, isSubmitting, onSave]);

  const handleInputChange = (sectionId, fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = (sectionId, fieldId, files) => {
    const fileList = Array.from(files);
    handleInputChange(sectionId, fieldId, fileList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveAndClose = () => {
    if (onSaveAndClose) {
      onSaveAndClose(formData);
      setHasUnsavedChanges(false);
    }
  };

  const renderField = (field, sectionId) => {
    const fieldId = field.id;
    const value = formData[sectionId]?.[fieldId] || '';
    const error = validationErrors[sectionId]?.[fieldId];

    const commonProps = {
      id: fieldId,
      name: fieldId,
      value: value,
      onChange: (e) => handleInputChange(sectionId, fieldId, e.target.value),
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      }`,
      placeholder: field.placeholder,
      required: field.required
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={fieldId} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              {...commonProps}
              type={field.type}
              pattern={field.pattern}
              maxLength={field.maxLength}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldId} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...commonProps}
              rows={field.rows || 3}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={fieldId} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select {...commonProps}>
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={fieldId} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id={fieldId}
                type="file"
                multiple={field.multiple}
                accept={field.accept}
                onChange={(e) => handleFileUpload(sectionId, fieldId, e.target.files)}
                className="hidden"
              />
              <label htmlFor={fieldId} className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or <span className="text-pink-600">browse</span>
                </p>
                {field.maxSize && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max size: {field.maxSize}
                  </p>
                )}
                {field.allowedTypes && (
                  <p className="text-xs text-gray-500">
                    Allowed: {field.allowedTypes.join(', ')}
                  </p>
                )}
              </label>
            </div>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          
          {/* Auto-save indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isAutoSaving && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {isDraft && !isAutoSaving && (
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Draft saved</span>
              </div>
            )}
            {lastSaved && (
              <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Section Navigation */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.label}
                {validationErrors[section.id] && Object.keys(validationErrors[section.id]).length > 0 && (
                  <AlertCircle className="w-4 h-4 inline ml-2 text-red-500" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`space-y-4 ${activeSection === section.id ? 'block' : 'hidden'}`}
              >
                <h2 className="text-lg font-medium text-gray-900">{section.label}</h2>
                
                {/* Section-level errors */}
                {validationErrors[section.id] && Object.keys(validationErrors[section.id]).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-red-700">
                        Please fix the errors below to continue
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => renderField(field, section.id))}
                </div>
              </div>
            ))}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Close
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormTemplate;
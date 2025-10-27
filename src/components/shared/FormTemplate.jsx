import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from '../../Admin panel/admin/admincomponents/Card';
import Button from './Button';

const FormTemplate = ({
  title,
  description,
  sections = [],
  onSubmit,
  onCancel,
  onSave,
  onSaveAndClose,
  loading = false,
  errors = {},
  values = {},
  onChange,
  autoSave = false,
  autoSaveDelay = 2000,
  showSectionNav = true,
  showActions = true,
  children
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [formData, setFormData] = useState(values);
  const [sectionErrors, setSectionErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isDirty) {
      const timer = setTimeout(() => {
        if (onSave) {
          onSave(formData);
        }
      }, autoSaveDelay);

      return () => clearTimeout(timer);
    }
  }, [formData, autoSave, isDirty, autoSaveDelay, onSave]);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setIsDirty(true);
    
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleFileUpload = (field, files) => {
    const fileList = Array.from(files);
    const newData = { ...formData, [field]: fileList };
    setFormData(newData);
    setIsDirty(true);
    
    if (onChange) {
      onChange(field, fileList);
    }
  };

  const validateSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return true;

    const sectionErrors = {};
    section.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        sectionErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.validation && formData[field.name]) {
        const validationResult = field.validation(formData[field.name]);
        if (validationResult !== true) {
          sectionErrors[field.name] = validationResult;
        }
      }
    });

    setSectionErrors(prev => ({ ...prev, [sectionId]: sectionErrors }));
    return Object.keys(sectionErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all sections
    let isValid = true;
    sections.forEach(section => {
      if (!validateSection(section.id)) {
        isValid = false;
      }
    });

    if (isValid && onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const fieldError = errors[field.name] || sectionErrors[activeSection]?.[field.name];
    const fieldValue = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                fieldError ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={field.disabled}
            />
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      case 'password':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword[field.name] ? 'text' : 'password'}
                name={field.name}
                value={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  fieldError ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={field.disabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword[field.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                fieldError ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={field.disabled}
            />
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                fieldError ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={field.disabled}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                disabled={field.disabled}
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {field.helpText && (
              <p className="text-sm text-gray-500 ml-6">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1 ml-6">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <input
                type="file"
                name={field.name}
                onChange={(e) => handleFileUpload(field.name, e.target.files)}
                multiple={field.multiple}
                accept={field.accept}
                className="hidden"
                id={`file-${field.name}`}
                disabled={field.disabled}
              />
              <label
                htmlFor={`file-${field.name}`}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Choose Files
              </label>
            </div>
            {fieldValue && fieldValue.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="text-sm text-gray-500">
                  {fieldValue.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fieldError}</span>
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderSection = (section) => {
    const hasErrors = sectionErrors[section.id] && Object.keys(sectionErrors[section.id]).length > 0;
    
    return (
      <div key={section.id} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            {section.icon && <section.icon className="w-5 h-5" />}
            <span>{section.title}</span>
            {hasErrors && <AlertCircle className="w-5 h-5 text-red-500" />}
          </h3>
          {section.description && (
            <p className="mt-1 text-sm text-gray-600">{section.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.fields.map(renderField)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {autoSave && isDirty && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span>Auto-saved</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          {showSectionNav && sections.length > 1 && (
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const hasErrors = sectionErrors[section.id] && Object.keys(sectionErrors[section.id]).length > 0;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-pink-50 text-pink-600 border border-pink-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {section.icon && <section.icon className="w-4 h-4" />}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">{section.title}</span>
                          {hasErrors && (
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>
          )}

          {/* Form Content */}
          <div className={showSectionNav ? 'lg:col-span-3' : 'col-span-full'}>
            <Card className="p-6">
              {children || sections.map(renderSection)}
            </Card>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            
            {onSave && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onSave(formData)}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
            
            {onSaveAndClose && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onSaveAndClose(formData)}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Close
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormTemplate;

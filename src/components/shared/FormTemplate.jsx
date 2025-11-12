import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const FormTemplate = ({
  title,
  sections = [],
  onSubmit,
  onCancel,
  onSave,
  onSaveAndClose,
  initialData = {},
  data,
  onChange,
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
  const [touchedFields, setTouchedFields] = useState({});
  const [shouldValidate, setShouldValidate] = useState(false);

  // Sync internal state with parent data when it changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  // Sync with initialData when it changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Auto-save functionality - Disabled for better UX
  // Save only happens on final submit
  // useEffect(() => {
  //   if (hasUnsavedChanges && !isSubmitting) {
  //     const autoSaveTimer = setTimeout(() => {
  //       setIsAutoSaving(true);
  //       if (onSave) {
  //         onSave(formData);
  //       }
  //       setTimeout(() => {
  //         setIsAutoSaving(false);
  //         setHasUnsavedChanges(false);
  //       }, 1000);
  //     }, 2000);

  //     return () => clearTimeout(autoSaveTimer);
  //   }
  // }, [formData, hasUnsavedChanges, isSubmitting, onSave]);

  const handleInputChange = (sectionId, fieldId, value) => {
    const newData = (() => {
      // Support both nested (section-based) and flat data structures
      if (formData[sectionId]) {
        return {
          ...formData,
          [sectionId]: {
            ...formData[sectionId],
            [fieldId]: value
          }
        };
      } else {
        return {
          ...formData,
          [fieldId]: value
        };
      }
    })();
    
    setFormData(newData);
    setHasUnsavedChanges(true);
    
    // Call parent onChange if provided
    if (onChange) {
      onChange(newData);
    }
  };

  const handleFieldBlur = (sectionId, fieldId) => {
    // Mark field as touched when user leaves it
    const fieldKey = `${sectionId}_${fieldId}`;
    setTouchedFields(prev => ({
      ...prev,
      [fieldKey]: true
    }));
  };

  const handleFileUpload = (sectionId, fieldId, files) => {
    const fileList = Array.from(files);
    handleInputChange(sectionId, fieldId, fileList);
  };


  // These are kept for compatibility but don't auto-save
  // Save only happens on final submit
  const handleSave = () => {
    // Data is already synced via onChange
    // No need to save here
  };

  const handleSaveAndClose = () => {
    if (onSaveAndClose) {
      onSaveAndClose(formData);
      setHasUnsavedChanges(false);
    }
  };

  const handleNext = () => {
    // Mark all fields in current section as touched to show validation errors
    const currentSection = sections.find(s => s.id === activeSection);
    if (currentSection) {
      const newTouched = { ...touchedFields };
      currentSection.fields.forEach(field => {
        const fieldId = field.id || field.name;
        const fieldKey = `${activeSection}_${fieldId}`;
        newTouched[fieldKey] = true;
      });
      setTouchedFields(newTouched);
      setShouldValidate(true);
      
      // Trigger validation by calling onChange with current data
      if (onChange) {
        onChange(formData);
      }
    }

    // Wait for validation to complete, then check errors
    setTimeout(() => {
      const currentSectionErrors = validationErrors[activeSection] || {};
      const hasErrors = Object.keys(currentSectionErrors).length > 0;
      
      if (hasErrors) {
        // Don't move if there are validation errors
        return;
      }

      // Don't save on Next - just move to next section
      // Data is already synced via onChange
      
      // Reset validation state for next section
      setShouldValidate(false);
      
      // Move to next section
      const currentIndex = sections.findIndex(s => s.id === activeSection);
      if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
      }
    }, 100);
  };

  const handleBack = () => {
    // Move to previous section
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all validation errors
    const newTouched = { ...touchedFields };
    sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldId = field.id || field.name;
        const fieldKey = `${section.id}_${fieldId}`;
        newTouched[fieldKey] = true;
      });
    });
    setTouchedFields(newTouched);
    setShouldValidate(true);

    // Check if there are any validation errors
    let hasErrors = false;
    sections.forEach(section => {
      const sectionErrors = validationErrors[section.id] || {};
      if (Object.keys(sectionErrors).length > 0) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      // Don't submit if there are validation errors
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const isLastSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    return currentIndex === sections.length - 1;
  };

  const isFirstSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    return currentIndex === 0;
  };

  const renderField = (field, sectionId) => {
    const fieldId = field.id || field.name;
    let value = formData[sectionId]?.[fieldId] || formData[fieldId] || '';
    
    // Handle number fields - ensure proper value format
    if (field.type === 'number') {
      if (value === '' || value === null || value === undefined) {
        value = '';
      } else {
        value = Number(value);
      }
    }
    
    const error = validationErrors[sectionId]?.[fieldId] || validationErrors[fieldId];
    const fieldKey = `${sectionId}_${fieldId}`;
    const isTouched = touchedFields[fieldKey] || false;
    const shouldShowError = isTouched || shouldValidate;
    const showError = shouldShowError && error;

    const commonProps = {
      id: fieldId,
      name: fieldId,
      value: value,
      onChange: (e) => {
        let newValue = e.target.value;
        // For number fields, calculate net amount if needed
        if (fieldId === 'gross' || fieldId === 'commission') {
          handleInputChange(sectionId, fieldId, newValue);
          // Auto-calculate net amount
          if (sectionId === 'financial') {
            const gross = fieldId === 'gross' ? parseFloat(newValue) || 0 : parseFloat(formData.gross || formData[sectionId]?.gross || 0);
            const commission = fieldId === 'commission' ? parseFloat(newValue) || 0 : parseFloat(formData.commission || formData[sectionId]?.commission || 0);
            const net = gross - (gross * commission / 100);
            handleInputChange(sectionId, 'net', net.toFixed(2));
          }
        } else {
          handleInputChange(sectionId, fieldId, newValue);
        }
      },
      onBlur: () => handleFieldBlur(sectionId, fieldId),
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
        showError ? 'border-red-300' : 'border-gray-300'
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
            {showError && (
              <p className="text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={fieldId} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              name={fieldId}
              type="number"
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;
                handleInputChange(sectionId, fieldId, newValue);
                
                // Auto-calculate net amount for financial section
                if (sectionId === 'financial') {
                  const currentGross = fieldId === 'gross' ? parseFloat(newValue) || 0 : parseFloat(formData.gross || formData[sectionId]?.gross || 0);
                  const currentCommission = fieldId === 'commission' ? parseFloat(newValue) || 0 : parseFloat(formData.commission || formData[sectionId]?.commission || 0);
                  if (currentGross > 0 && currentCommission >= 0) {
                    const commissionAmount = currentGross * (currentCommission / 100);
                    const netAmount = currentGross - commissionAmount;
                    handleInputChange(sectionId, 'net', netAmount.toFixed(2));
                  }
                }
              }}
              onBlur={() => handleFieldBlur(sectionId, fieldId)}
              step={field.step || '1'}
              min={field.min}
              max={field.max}
              readOnly={field.readOnly || false}
              disabled={field.readOnly || false}
              placeholder={field.placeholder}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                showError ? 'border-red-300' : 'border-gray-300'
              } ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {showError && (
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
              onBlur={() => handleFieldBlur(sectionId, fieldId)}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            {showError && (
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
            <select 
              {...commonProps}
              onBlur={() => handleFieldBlur(sectionId, fieldId)}
            >
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
            {showError && (
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
            {showError && (
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
          <form onSubmit={handleSubmitForm} className="space-y-6">
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
                className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[120px]"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <div className="flex items-center space-x-3">
                {/* Back Button - Show on all pages except first */}
                {!isFirstSection() && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 min-w-[120px]"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                )}

                {/* Next or Submit Button */}
                {!isLastSection() ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 min-w-[120px]"
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
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormTemplate;
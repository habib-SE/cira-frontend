import React from 'react';
import FormicaValidatedForm from './FormicaValidatedForm';
import FormicaFormField from './FormicaFormField';
import FormicaFormSelect from './FormicaFormSelect';
import FormicaFormTextarea from './FormicaFormTextarea';

/**
 * Unified Formica Form Component
 * Combines all form field types for maximum reusability
 */
const FormicaForm = ({ 
  schema, 
  onSubmit, 
  onError, 
  defaultValues = {}, 
  children,
  className = '',
  mode = 'onChange',
  ...props 
}) => {
  return (
    <FormicaValidatedForm
      schema={schema}
      onSubmit={onSubmit}
      onError={onError}
      defaultValues={defaultValues}
      className={className}
      mode={mode}
      {...props}
    >
      {(formContext) => (
        <div className="formica-form-container">
          {children({
            ...formContext,
            // Unified field components with pre-configured props
            Field: (fieldProps) => <FormicaFormField {...fieldProps} {...formContext} />,
            Select: (selectProps) => <FormicaFormSelect {...selectProps} {...formContext} />,
            Textarea: (textareaProps) => <FormicaFormTextarea {...textareaProps} {...formContext} />,
            // Legacy support
            FormField: (fieldProps) => <FormicaFormField {...fieldProps} {...formContext} />,
            FormSelect: (selectProps) => <FormicaFormSelect {...selectProps} {...formContext} />,
            FormTextarea: (textareaProps) => <FormicaFormTextarea {...textareaProps} {...formContext} />
          })}
        </div>
      )}
    </FormicaValidatedForm>
  );
};

export default FormicaForm;

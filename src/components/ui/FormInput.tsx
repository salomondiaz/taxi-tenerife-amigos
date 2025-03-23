
import React, { forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
  icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, id, className = "", icon, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`input-field ${
              error ? "border-red-500 focus:ring-red-500" : ""
            } ${icon ? "pl-10" : ""} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

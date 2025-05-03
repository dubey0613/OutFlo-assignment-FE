import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, fullWidth = false, icon, className = '', ...props }, ref) => {
    const inputClasses = `
      px-4 py-2 bg-white dark:bg-slate-800 border rounded-md
      text-sm transition-colors duration-200
      focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600'}
      ${fullWidth ? 'w-full' : ''}
      ${icon ? 'pl-10' : ''}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              {icon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>
        {(helperText || error) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
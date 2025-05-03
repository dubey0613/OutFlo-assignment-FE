import React, { useState } from 'react';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <span className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <button
        type="button"
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        disabled={disabled}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-1'}
          `}
        />
      </button>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Toggle;
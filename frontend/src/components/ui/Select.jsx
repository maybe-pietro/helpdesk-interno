import { forwardRef } from 'react';

const Select = forwardRef(function Select({ className = '', error = false, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`w-full border rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-400 ${
        error ? 'border-red-400' : 'border-slate-300'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

export default Select;

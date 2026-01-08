import { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, containerClassName = '', labelClassName = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center ${containerClassName}`}>
        <input
          type="checkbox"
          ref={ref}
          className={`form-checkbox h-12 w-5 text-primary rounded focus:ring-primary border-gray-300 ${props.className}`}
          {...props}
        />
        {label && (
          <span className={`ml-2 text-black text-sm font-semibold ${labelClassName}`}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
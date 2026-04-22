import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { auth } from './authTheme';

type Props = {
  label: string;
  hint?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const AuthField = forwardRef<HTMLInputElement, Props>(function AuthField(
  { label, className = '', id, hint, children, ...rest },
  ref
) {
  const inputId = id ?? label.replace(/\s/g, '-').toLowerCase();
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <label htmlFor={inputId} className={auth.label}>
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={`${auth.input} ${className}`}
          {...rest}
        />
        {children}
      </div>
    </div>
  );
});

export default AuthField;

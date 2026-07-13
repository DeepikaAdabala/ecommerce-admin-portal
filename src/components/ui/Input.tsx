import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default Input;

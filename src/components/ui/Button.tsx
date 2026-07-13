import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-secondary';
}

function Button({ children, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button type={type} className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

export default Button;

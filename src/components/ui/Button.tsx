import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  to?: string;
  href?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  to,
  href,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-forest-700 text-white hover:bg-forest-800 shadow-lg hover:shadow-xl',
    secondary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

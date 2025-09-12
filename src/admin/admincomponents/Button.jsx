import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = `
    w-full py-4 px-6 rounded-xl font-semibold text-base
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-[1.02] active:scale-[0.98]
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-pink-500 to-pink-600 
      hover:from-pink-600 hover:to-pink-700 
      active:from-pink-700 active:to-pink-800
      text-white shadow-lg hover:shadow-xl
      focus:ring-pink-500
    `,
    secondary: `
      bg-white border-2 border-gray-200
      hover:border-gray-300 hover:bg-gray-50
      active:bg-gray-100
      text-gray-700
      focus:ring-gray-500
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

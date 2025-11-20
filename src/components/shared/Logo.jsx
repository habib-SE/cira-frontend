import React from 'react';
import logo from '../../assets/Logo.png';
import loginLogo from '../../assets/LoginLogo.png';

/**
 * Reusable Logo Component
 * @param {string} variant - 'default' (Logo.png) or 'login' (LoginLogo.png)
 * @param {string} className - Additional CSS classes
 * @param {string} alt - Alt text for the image
 * @param {number|string} height - Height of the logo (default: auto)
 * @param {number|string} width - Width of the logo (default: auto)
 */
const Logo = ({ 
  variant = 'default', 
  className = '', 
  alt = 'CIRA Logo',
  height = 'auto',
  width = 'auto',
  ...props 
}) => {
  const logoSrc = variant === 'login' ? loginLogo : logo;
  
  return (
    <img 
      src={logoSrc} 
      alt={alt}
      className={className}
      style={{ height, width }}
      {...props}
    />
  );
};

export default Logo;


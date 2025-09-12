import React from 'react';
import logo from '../../assets/Logo.png';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Cira Logo */}
      <div className="flex items-center">
        <img 
          src={logo} 
          alt="Cira Logo" 
          className="h-8 w-auto"
        />
      </div>
      
      {/* Flag Icon */}
      <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
        <span className="text-xs">🇳🇱</span>
      </div>
    </div>
  );
};

export default Header;

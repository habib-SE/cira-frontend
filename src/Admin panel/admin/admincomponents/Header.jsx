import React from 'react';
import Stars from '../../../assets/stars.svg';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Cira Logo */}
      <div className="flex items-center">
        <div className="flex-shrink-0 flex gap-2 items-center">
          <img src={Stars} alt="stars logo" className="w-[20%]"/>
          <span className="text-xl font-semibold text-gray-900">Cira</span>
        </div>
      </div>
      
      {/* Flag Icon */}
      <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
        <span className="text-xs">🇳🇱</span>
      </div>
    </div>
  );
};

export default Header;

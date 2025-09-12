import React from 'react';

const ProfileIcon = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="w-20 h-20 bg-white rounded-full border-2 border-pink-200 flex items-center justify-center shadow-lg">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center relative">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-pink-200 shadow-sm">
          <span className="text-pink-500 font-bold text-xs">+</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileIcon;

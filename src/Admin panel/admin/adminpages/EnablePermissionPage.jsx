import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, Calendar, MapPin, Image, Check, X } from 'lucide-react';
import Stars from '../../../assets/stars.svg';
import '../../../styles/banner.css';

const EnablePermissionPage = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success');

  const handleEnablePermissions = () => {
    // Simulate enabling permissions
    console.log('Enabling permissions');
    
    // Show success banner
    setBannerMessage('Permissions enabled successfully! Welcome to Cira!');
    setBannerType('success');
    setShowBanner(true);
    
    // Hide banner after 3 seconds and navigate
    setTimeout(() => {
      setShowBanner(false);
      navigate('/plus-unlocked');
    }, 3000);
  };

  const permissionCards = [
    {
      id: 'notification',
      title: 'Notification Access',
      description: 'Allow access to enhance functionality and improve experience',
      icon: <Quote className="w-4 h-4 text-white fill-current " />
    },
    {
      id: 'calendar',
      title: 'Calendar Access',
      description: 'Allow access to enhance functionality and improve experience',
      icon: <Calendar className="w-4 h-4 text-white stroke-[4]" />
    },
    {
      id: 'location',
      title: 'Location Access',
      description: 'Allow access to enhance functionality and improve experience',
      icon: <MapPin className="w-6 h-6 text-pink-500 stroke-[3.5]" />
    },
    {
      id: 'gallery',
      title: 'Gallery or File Access',
      description: 'Allow access to enhance functionality and improve experience',
      icon: <Image className="w-5 h-5 text-pink-500 stroke-[3]" />
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col px-4 py-5 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
    >
      {/* Success Banner */}
      {showBanner && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`px-6 py-4 rounded-2xl shadow-lg border ${
            bannerType === 'success' 
              ? 'bg-green-500 text-white border-green-600' 
              : 'bg-red-500 text-white border-red-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {bannerType === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </div>
              <p className="font-medium text-sm">{bannerMessage}</p>
            </div>
          </div>
        </div>
      )}
      {/* Header - Fixed at top */}
      <div className="w-full flex justify-start items-center mb-4">
                <div className="flex items-center pl-4">
                    <div className="flex-shrink-0 flex gap-2 items-center">
                        <img src={Stars} alt="stars logo" className="w-[20%]"/>
                        <span className="text-xl font-semibold text-gray-900">Cira</span>
                    </div>
                </div>
            </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full text-center">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Enable Permission
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            Allow access to enhance functionality and improve experience
          </p>

          {/* Permission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4 max-w-sm mx-auto">
            {permissionCards.map((card) => (
              <div
                key={card.id}
                className="bg-white/40 border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center hover:bg-transparent transition-colors duration-200 cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-3 ${
                  card.id === 'location' || card.id === 'gallery' 
                    ? 'bg-transparent' 
                    : 'bg-pink-500'
                }`}>
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 select-none">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed select-none">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Enable Permission Button */}
          <button
            onClick={handleEnablePermissions}
            className="w-full max-w-sm mx-auto py-3 bg-pink-500 text-white rounded-3xl font-semibold text-lg hover:bg-pink-600 active:bg-pink-700 transform active:scale-95 transition-all duration-200"
          >
            Enable Permission
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnablePermissionPage;

import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  preset, // Preset name for exact button style
  variant = "primary", // "primary" | "secondary" | "outline" | "danger" | "success"
  size = "md", // "sm" | "md" | "lg"
  className = "", // Additional classes (will be appended)
  useMotion = false, // Use framer-motion button
  disabled = false,
  loading = false,
  icon,
  icon: Icon, // Support icon as component
  iconPosition = "left",
  onClick,
  type = "button",
  whileHover,
  whileTap,
  active, // For pill buttons
  ...props
}) => {
  // Preset styles - exact matches from codebase
  const getPresetClasses = (presetName) => {
    const presets = {
      // HeroSection - Topic buttons
      "topic-button": "px-4 py-2 md:px-5 md:py-2.5 bg-white hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-800 text-xs md:text-sm font-semibold transition-all duration-200",
      
      // HeroSection - Get Started button
      "get-started": "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold px-4 md:px-6 py-2.5 rounded-full shadow-md text-sm md:text-base whitespace-nowrap font-sans",
      
      // GlobalVoiceSection - CTA button
      "cta-gradient": "px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto",
      
      // GlobalVoiceSection - More languages button
      "more-languages": "flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-semibold hover:from-pink-200 hover:to-purple-200 transition-all cursor-pointer shadow-sm",
      
      // DoctorConnectionSection - 24/7 button
      "outline-teal": "mt-6 md:mt-10 inline-flex items-center text-teal-500 border-2 border-teal-500 hover:bg-teal-500 hover:text-gray-100 text-xs md:text-sm font-medium px-4 py-1.5 md:px-8 md:py-4 rounded-full transition-all duration-20",
      
      // ChatInput - Speak button
      "speak": "absolute bottom-2 left-3 flex items-center gap-1 px-3 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-800 shadow-sm hover:bg-pink-200 transition-all duration-200",
      
      // ChatInput - Send button
      "send": "absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold px-3 md:px-5 py-2 rounded-sm transition-all duration-200 shadow-md text-sm whitespace-nowrap flex items-center gap-2 justify-center",
      
      // ReferralCheckout - Pill button (active)
      "pill-active": "px-3 py-1.5 rounded-full text-sm border transition bg-pink-600 text-white border-pink-600",
      
      // ReferralCheckout - Pill button (inactive)
      "pill-inactive": "px-3 py-1.5 rounded-full text-sm border transition bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
      
      // ReferralCheckout - Refer Patient button
      "refer-patient": "w-full sm:w-auto px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700",
      
      // ReferralCheckout - Modal buttons
      "modal-primary": "px-5 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2",
      "modal-secondary": "px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300",
      "modal-cancel": "px-4 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200",
      "modal-send": "px-5 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60 flex items-center gap-2",
      
      // Icon button (close, etc.)
      "icon-close": "p-1 rounded hover:bg-gray-100",
      
      // CiraAssistant buttons
      "control-stop": "bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors",
      "control-mute-red": "p-3 rounded-full bg-red-500 text-white hover:opacity-90 transition-colors",
      "control-mute-green": "p-3 rounded-full bg-green-500 text-white hover:opacity-90 transition-colors",
      "start-conversation": "flex items-center gap-2 rounded-full px-4 py-3 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
      "start-conversation-disabled": "flex items-center gap-2 rounded-full px-4 py-3 bg-gray-400 text-white font-medium transition-all duration-300 cursor-not-allowed",
      "test-flow": "flex items-center gap-2 rounded-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
      
      // CiraChatAssistant buttons
      "download-reports": "w-full inline-flex items-center justify-between px-4 py-2 sm:py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors",
      "download-menu-item": "group w-full flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 hover:text-purple-700 active:bg-purple-100 transition-colors",
      "find-doctor": "flex-1 bg-[#E4ECFF] text-[#2F4EBB] rounded-lg text-sm py-2.5",
      
      // AINurseInterface - image remove button
      "image-remove": "absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1",
      
      // Disclaimer close button
      "disclaimer-close": "text-yellow-600 hover:text-yellow-800",
    };
    
    // Handle pill button with active state
    if (presetName === "pill") {
      return active ? presets["pill-active"] : presets["pill-inactive"];
    }
    
    return presets[presetName] || "";
  };
  
  // Variant/size system (default API)
  const getVariantSizeClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    };
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    const variantClass = variantClasses[variant] || "";
    const sizeClass = sizeClasses[size] || "";
    
    return `${baseClasses} ${variantClass} ${sizeClass}`.trim();
  };
  
  // Get preset classes or variant/size classes
  const presetClasses = preset ? getPresetClasses(preset) : getVariantSizeClasses();
  
  // Combine classes
  const combinedClasses = `${presetClasses} ${className}`.trim();
  
  // Default motion props
  const defaultMotionProps = {
    whileHover: whileHover !== undefined ? whileHover : (preset === "topic-button" || preset === "cta-gradient" || preset === "more-languages" ? { scale: 1.05 } : undefined),
    whileTap: whileTap !== undefined ? whileTap : (preset === "topic-button" || preset === "cta-gradient" || preset === "more-languages" ? { scale: 0.95 } : undefined),
  };
  
  // Render loading spinner
  const renderLoading = () => {
    if (loading) {
      return (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
      );
    }
    return null;
  };
  
  // Render icon - support both icon (React element) and Icon (component)
  const renderIcon = () => {
    if (loading) return renderLoading();
    const iconElement = icon || (Icon && <Icon className="w-4 h-4" />);
    if (iconElement && iconPosition === "left") {
      // For speak button, icon is already in gap-1, so no margin needed
      if (preset === "speak") {
        return iconElement;
      }
      return <span className="mr-2">{iconElement}</span>;
    }
    return null;
  };
  
  const renderRightIcon = () => {
    if (icon && iconPosition === "right") {
      return <span className="ml-2">{icon}</span>;
    }
    return null;
  };
  
  // Use motion button if specified or if preset requires it
  const shouldUseMotion = useMotion || preset === "topic-button" || preset === "get-started" || preset === "cta-gradient" || preset === "more-languages" || preset === "outline-teal" || preset === "send";
  
  if (shouldUseMotion) {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={combinedClasses}
        {...defaultMotionProps}
        {...props}
      >
        {renderIcon()}
        {children}
        {renderRightIcon()}
      </motion.button>
    );
  }
  
  // Regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {renderIcon()}
      {children}
      {renderRightIcon()}
    </button>
  );
};

export default Button;

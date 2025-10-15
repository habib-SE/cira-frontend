import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import '../styles/auth.css';

/**
 * Authentication Layout Component
 * Provides a consistent layout for all authentication pages
 */
const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  showBanner = false, 
  bannerType = 'success', 
  bannerMessage = '', 
  onCloseBanner 
}) => {
  return (
    <div className="auth-container">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="auth-blob"></div>
        <div className="auth-blob"></div>
        <div className="auth-blob"></div>
      </div>

      {/* Success Banner */}
      {showBanner && bannerType === 'success' && (
        <div className="auth-banner auth-banner-success">
          <Check className="w-5 h-5" />
          <span>{bannerMessage}</span>
          {onCloseBanner && (
            <button
              onClick={onCloseBanner}
              className="auth-banner-close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Error Banner */}
      {showBanner && bannerType === 'error' && (
        <div className="auth-banner auth-banner-error">
          <AlertCircle className="w-5 h-5" />
          <span>{bannerMessage}</span>
          {onCloseBanner && (
            <button
              onClick={onCloseBanner}
              className="auth-banner-close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="auth-card">
        {(title || subtitle) && (
          <div className="auth-header">
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

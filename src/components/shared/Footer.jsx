import React from 'react';
import { Heart, Mail, Phone, HelpCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto w-full">
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
        {/* Main content - stacked on mobile, row on larger screens */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Left side - Version & Copyright */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>Version</span>
              <span className="font-semibold text-pink-600">2.0.1</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>© {currentYear} CIRA AI. All rights reserved.</span>
          </div>

          {/* Center - Made with love */}
          <div className="flex items-center justify-center md:justify-center space-x-1 text-xs sm:text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 fill-pink-500" />
            <span>for healthcare</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center justify-center md:justify-end flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              Legal
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Support</span>
            </a>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-center sm:justify-start items-center sm:items-center gap-3 sm:gap-4 text-xs text-gray-500">
          <a 
            href="mailto:support@cira.ai" 
            className="flex items-center space-x-1.5 hover:text-pink-600 transition-colors"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="break-all">support@cira.ai</span>
          </a>
          <span className="hidden sm:inline">•</span>
          <a 
            href="tel:+1234567890" 
            className="flex items-center space-x-1.5 hover:text-pink-600 transition-colors"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


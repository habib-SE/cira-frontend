import React from 'react';
import { Heart, Mail, Phone, HelpCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-start items-start space-y-4 sm:space-y-0 sm:space-x-8">
          {/* Left side - Version & Copyright */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>Version</span>
              <span className="font-semibold text-pink-600">2.0.1</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-1">
              <span>© {currentYear} CIRA AI.</span>
              <span>All rights reserved.</span>
            </span>
          </div>

          {/* Center - Made with love */}
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>for healthcare</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center space-x-6 text-sm">
            {/* Legal */}
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>Legal</span>
            </a>

            {/* Privacy */}
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <span>Privacy</span>
            </a>

            {/* Support */}
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </a>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-start items-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-gray-500">
          <a 
            href="mailto:support@cira.ai" 
            className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span>support@cira.ai</span>
          </a>
          <span className="hidden sm:inline">•</span>
          <a 
            href="tel:+1234567890" 
            className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


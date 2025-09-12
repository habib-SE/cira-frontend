import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isAssistantPage = location.pathname === "/assistant";

  return (
    <header className="w-full" style={{
      background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0 flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-lg"
              style={{
                background:
                  "linear-gradient(to bottom right, #ff9fd1, #ff76a2)",
              }}
            >
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Cira
            </Link>
          </div>

          {/* Navigation - Right Side (hide on /assistant) */}
          {!isAssistantPage && (
            <nav className="flex items-center space-x-8">
              <Link
                to="/contact-us"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium relative group transition-all duration-300 ease-in-out"
              >
                <span className="relative z-10">Contact Us</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
              <Link
                to="/assistant"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

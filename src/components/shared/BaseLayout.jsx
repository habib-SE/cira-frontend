import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';
import Footer from './Footer';

const BaseLayout = ({ 
  Sidebar, 
  Navbar, 
  sidebarProps = {},
  navbarProps = {},
  mainContentClass = "",
  sidebarClass = "",
  showMobileOverlay = true,
  sidebarBehavior = "toggle", // "toggle" | "persistent"
  pageBackground = "pink-50" // Background for main content area
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && sidebarBehavior === "persistent") {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Show loader when route changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close mobile menu when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024 && sidebarBehavior === "toggle") {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, sidebarBehavior]);

  const getSidebarClasses = () => {
    if (sidebarBehavior === "persistent") {
      return `block lg:flex fixed lg:relative z-50 lg:z-[1000px] h-screen ${sidebarClass}`;
    }
    return `${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-50 lg:z-auto h-screen transition-all duration-300 ${sidebarClass}`;
  };

  const getMainContentClasses = () => {
    if (sidebarBehavior === "persistent") {
      return `flex-1 flex flex-col h-screen ${mainContentClass}`;
    }
    return `flex-1 flex flex-col h-screen min-w-0 ${mainContentClass}`;
  };

  return (
    <div 
      className="h-screen flex zoom-consistent overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
    >
      {/* Sidebar */}
      <div className={getSidebarClasses()}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed}
          {...sidebarProps}
        />
      </div>

      {/* Mobile overlay */}
      {showMobileOverlay && isMobileMenuOpen && sidebarBehavior === "toggle" && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={getMainContentClasses()}>
        {/* Navbar */}
        <Navbar 
          onMenuClick={handleMenuClick} 
          isMobileMenuOpen={isMobileMenuOpen}
          {...navbarProps}
        />

        {/* Page content */}
        <main 
          className={`flex-1 overflow-y-auto overflow-x-hidden relative min-h-0 px-2 sm:px-3 lg:px-4 ${pageBackground ? `bg-${pageBackground}` : ''}`}
        >
          <PageLoader isLoading={isLoading}>    
            <div className="min-h-full flex flex-col min-w-0">
              <div className="flex-1 w-full mx-auto max-w-[1600px]">
                <Outlet />
              </div>
              {/* Footer - only shows at bottom of content, not fixed */}
              <Footer />
            </div>
          </PageLoader>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;

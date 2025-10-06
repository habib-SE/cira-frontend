import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PatientSidebar from './PatientSidebar';
import PatientNavbar from './PatientNavbar';

const PatientLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 1024; // collapse on mobile/tablet
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

    return (
        <div 
            className="h-screen flex"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Sidebar - always visible on mobile */}
            <div className={`block lg:flex fixed lg:relative z-50 lg:z-[1000px] h-screen`}>
                <PatientSidebar 
                    isCollapsed={isSidebarCollapsed} 
                    setIsCollapsed={setIsSidebarCollapsed} 
                />
            </div>

            {/* Mobile overlay removed since sidebar is persistent on mobile */}

            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen lg:ml-0 ml-20">
                {/* Navbar */}
                <PatientNavbar 
                    onMenuClick={handleMenuClick} 
                    isMobileMenuOpen={isMobileMenuOpen}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    {/* Loader */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                                <p className="text-gray-600 font-medium">Loading...</p>
                            </div>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;

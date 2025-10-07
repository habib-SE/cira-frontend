import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
            className="h-screen flex zoom-consistent overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Sidebar */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-50 lg:z-auto h-screen`}>
                <DoctorSidebar 
                    isCollapsed={isSidebarCollapsed} 
                    setIsCollapsed={setIsSidebarCollapsed} 
                />
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen min-w-0">
                {/* Navbar */}
                <DoctorNavbar 
                    onMenuClick={handleMenuClick} 
                    isMobileMenuOpen={isMobileMenuOpen}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative min-h-0">
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

export default DoctorLayout;

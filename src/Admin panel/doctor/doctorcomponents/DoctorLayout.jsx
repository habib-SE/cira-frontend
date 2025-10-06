import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div 
            className="h-screen flex zoom-consistent"
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
                <main className="flex-1 overflow-y-auto relative min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;

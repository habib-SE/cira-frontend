import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div 
            className="h-screen flex"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Sidebar */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-50 lg:z-auto h-screen`}>
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    setIsCollapsed={setIsSidebarCollapsed} 
                />
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Navbar */}
                <Navbar 
                    onMenuClick={handleMenuClick} 
                    isMobileMenuOpen={isMobileMenuOpen}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

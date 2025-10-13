import React from 'react';
import BaseLayout from '../../../components/shared/BaseLayout';
import { UnifiedSidebar, UnifiedNavbar } from '../../shared';

const AdminLayout = () => {
    return (
        <BaseLayout
            Sidebar={UnifiedSidebar}
            Navbar={UnifiedNavbar}
            sidebarProps={{
                portalType: "admin"
            }}
            navbarProps={{
                portalType: "admin",
                showSearch: true
            }}
            sidebarBehavior="toggle"
            showMobileOverlay={true}
        />
    );
};

export default AdminLayout;

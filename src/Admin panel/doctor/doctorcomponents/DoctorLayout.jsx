import React from 'react';
import BaseLayout from '../../../components/shared/BaseLayout';
import { UnifiedSidebar, UnifiedNavbar } from '../../shared';

const DoctorLayout = () => {
    return (
        <BaseLayout
            Sidebar={UnifiedSidebar}
            Navbar={UnifiedNavbar}
            sidebarProps={{
                portalType: "doctor"
            }}
            navbarProps={{
                portalType: "doctor",
                showSearch: true
            }}
            sidebarBehavior="toggle"
            showMobileOverlay={true}
        />
    );
};

export default DoctorLayout;

import React from 'react';
import BaseLayout from '../../../components/shared/BaseLayout';
import { UnifiedSidebar, UnifiedNavbar } from '../../shared';

const PatientLayout = () => {
    return (
        <BaseLayout
            Sidebar={UnifiedSidebar}
            Navbar={UnifiedNavbar}
            sidebarProps={{
                portalType: "user"
            }}
            navbarProps={{
                portalType: "user",
                showSearch: false
            }}
            sidebarBehavior="toggle"
            showMobileOverlay={true}
            pageBackground="pink-50"
        />
    );
};

export default PatientLayout;

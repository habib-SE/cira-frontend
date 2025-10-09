import React from 'react';
import BaseLayout from '../../../components/shared/BaseLayout';
import { UnifiedSidebar, UnifiedNavbar } from '../../shared';

const PatientLayout = () => {
    return (
        <BaseLayout
            Sidebar={UnifiedSidebar}
            Navbar={UnifiedNavbar}
            sidebarProps={{
                portalType: "patient"
            }}
            navbarProps={{
                portalType: "patient",
                showSearch: false
            }}
            sidebarBehavior="persistent"
            showMobileOverlay={false}
            mainContentClass="lg:ml-0 ml-20"
            pageBackground="pink-50"
        />
    );
};

export default PatientLayout;

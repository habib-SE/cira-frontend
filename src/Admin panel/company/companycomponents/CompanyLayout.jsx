import React from 'react';
import BaseLayout from '../../../components/shared/BaseLayout';
import { UnifiedSidebar, UnifiedNavbar } from '../../shared';

const CompanyLayout = () => {
    return (
        <BaseLayout
            Sidebar={UnifiedSidebar}
            Navbar={UnifiedNavbar}
            sidebarProps={{
                portalType: "company"
            }}
            navbarProps={{
                portalType: "company",
                showSearch: true
            }}
            sidebarBehavior="toggle"
            showMobileOverlay={true}
        />
    );
};

export default CompanyLayout;

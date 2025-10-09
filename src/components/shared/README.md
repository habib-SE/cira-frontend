# Shared Components

This directory contains reusable components that can be used across Admin, Patient, and Doctor panels to maintain consistency and reduce code duplication.

## Components

### Layout Components

#### BaseLayout
A flexible layout component that handles sidebar, navbar, and main content area.

**Props:**
- `Sidebar`: Component for the sidebar
- `Navbar`: Component for the navbar
- `sidebarProps`: Props to pass to the sidebar
- `navbarProps`: Props to pass to the navbar
- `mainContentClass`: Additional CSS classes for main content
- `sidebarClass`: Additional CSS classes for sidebar
- `showMobileOverlay`: Whether to show mobile overlay
- `sidebarBehavior`: "toggle" | "persistent"
- `pageBackground`: Background color for main content

**Usage:**
```jsx
<BaseLayout
  Sidebar={AdminSidebar}
  Navbar={BaseNavbar}
  navbarProps={{ userRole: "admin", showSearch: true }}
  sidebarBehavior="toggle"
  showMobileOverlay={true}
/>
```

#### PageLoader
Handles loading states with different variants.

**Props:**
- `isLoading`: Boolean to show/hide loader
- `children`: Content to wrap
- `variant`: "default" | "blur"

#### PageWrapper
Standard wrapper for page content with consistent styling.

**Props:**
- `children`: Page content
- `className`: Additional CSS classes
- `background`: Background color
- `padding`: Padding classes
- `minHeight`: Minimum height

#### PageHeader
Standardized page header with title, description, and optional action button.

**Props:**
- `title`: Page title
- `description`: Page description
- `actionButton`: Optional action button
- `className`: Additional CSS classes

### UI Components

#### BaseNavbar
Reusable navbar component with role-based customization.

**Props:**
- `onMenuClick`: Mobile menu click handler
- `isMobileMenuOpen`: Mobile menu state
- `userRole`: "admin" | "doctor" | "patient"
- `showSearch`: Whether to show search bar
- `customNotifications`: Custom notifications array
- `customUserMenu`: Custom user menu items
- `className`: Additional CSS classes

#### FormInput
Standardized form input component.

**Props:**
- `type`: Input type
- `label`: Input label
- `value`: Input value
- `onChange`: Change handler
- `placeholder`: Input placeholder
- `disabled`: Disabled state
- `required`: Required field
- `error`: Error message
- `icon`: Icon component
- `className`: Additional CSS classes
- `inputClassName`: Additional input CSS classes

#### Button
Standardized button component with multiple variants.

**Props:**
- `children`: Button content
- `variant`: "primary" | "secondary" | "outline" | "danger" | "success"
- `size`: "sm" | "md" | "lg"
- `disabled`: Disabled state
- `loading`: Loading state
- `icon`: Icon component
- `onClick`: Click handler
- `className`: Additional CSS classes
- `type`: Button type

#### StatsCard
Reusable stats card component for displaying metrics.

**Props:**
- `title`: Card title
- `value`: Main value
- `change`: Change indicator
- `icon`: Icon component
- `color`: Icon color
- `bgColor`: Icon background color
- `hover`: Hover effect
- `className`: Additional CSS classes
- `onClick`: Click handler

## Usage Examples

### Creating a New Page
```jsx
import React from 'react';
import { PageWrapper, PageHeader, StatsCard, Button } from '../../../components/shared';
import { Calendar, Users } from 'lucide-react';

const MyPage = () => {
  return (
    <PageWrapper>
      <PageHeader
        title="My Page"
        description="Page description"
        actionButton={
          <Button variant="primary" icon={Calendar}>
            Add New
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="1,234"
          change="+12% this month"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>
    </PageWrapper>
  );
};
```

### Creating a Layout
```jsx
import React from 'react';
import { BaseLayout, BaseNavbar } from '../../../components/shared';
import MySidebar from './MySidebar';

const MyLayout = () => {
  return (
    <BaseLayout
      Sidebar={MySidebar}
      Navbar={BaseNavbar}
      navbarProps={{
        userRole: "admin",
        showSearch: true
      }}
      sidebarBehavior="toggle"
      showMobileOverlay={true}
    />
  );
};
```

## Benefits

1. **Consistency**: All panels use the same components ensuring consistent UI/UX
2. **Maintainability**: Changes to shared components automatically apply to all panels
3. **Reusability**: Components can be easily reused across different pages
4. **Type Safety**: Props are clearly defined and documented
5. **Customization**: Components accept props for customization while maintaining defaults
6. **Performance**: Reduced bundle size due to code reuse


# Enhanced DataTable Component Documentation

## Overview
The enhanced DataTable component provides a comprehensive data management interface with advanced features including debounced search, filters, column management, bulk actions, and multiple display states.

## Features Implemented

### ✅ Header Bar
- **Title**: Dynamic page title
- **Count**: Item count with badge styling
- **Primary CTA**: Main action button (e.g., "Add User")
- **Secondary Actions**: Additional action buttons
- **Last Updated**: Timestamp showing when data was last refreshed
- **Refresh Button**: Manual data refresh
- **Export Button**: CSV export functionality

### ✅ Toolbar
- **Debounced Search**: 300ms delay for performance
- **Filters Drawer**: Collapsible filter panel with active filter count
- **Column Picker**: Show/hide columns with checkboxes
- **Density Control**: Compact/Regular row spacing
- **Page Size**: 10/25/50/100 items per page

### ✅ Table Features
- **Sorting**: Click column headers to sort
- **Multi-select**: Checkbox selection with select all
- **Pagination**: Navigate through pages
- **Row Actions**: View, Edit, Delete, and custom actions
- **Density Support**: Compact and regular spacing
- **Avatar Column Type**: User avatars with initials
- **Status Column Type**: Colored status badges with icons
- **Date Column Type**: Formatted date display
- **Currency Column Type**: Formatted currency display

### ✅ States
- **Loading State**: Skeleton rows during data fetch
- **Empty State**: Customizable empty state with CTA
- **Error State**: Error display with retry button and error ID
- **Bulk Actions**: Actions for selected items

## Usage Example

```jsx
import DataTable from '../../../components/shared/DataTable';
import { Plus, Download, RefreshCw } from 'lucide-react';

const MyPage = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [density, setDensity] = useState('regular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      key: 'avatar',
      label: 'User',
      type: 'avatar',
      sortable: true
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      sortable: true
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      type: 'date',
      sortable: true
    },
    {
      key: 'salary',
      label: 'Salary',
      type: 'currency',
      sortable: true
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' }
      ]
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      type: 'date'
    }
  ];

  const bulkActions = [
    {
      label: 'Activate',
      icon: UserCheck,
      onClick: (selectedIds) => {
        // Handle bulk activation
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: (selectedIds) => {
        // Handle bulk deletion
      }
    }
  ];

  const handleRowAction = (action, row) => {
    switch (action) {
      case 'view':
        // Navigate to view page
        break;
      case 'edit':
        // Navigate to edit page
        break;
      case 'delete':
        // Handle deletion
        break;
    }
  };

  const handleExport = () => {
    // Export to CSV
  };

  const handleRefresh = () => {
    // Refresh data
  };

  return (
    <DataTable
      title="Users"
      count={data.length}
      columns={columns}
      data={data}
      searchPlaceholder="Search users..."
      filters={filters}
      loading={loading}
      error={error}
      onRetry={() => setError(null)}
      lastUpdated={new Date()}
      density={density}
      onDensityChange={setDensity}
      selectedRows={selectedRows}
      onRowSelect={(id, checked) => {
        if (checked) {
          setSelectedRows(prev => [...prev, id]);
        } else {
          setSelectedRows(prev => prev.filter(rowId => rowId !== id));
        }
      }}
      onSelectAll={(checked) => {
        setSelectedRows(checked ? data.map(item => item.id) : []);
      }}
      onRowAction={handleRowAction}
      bulkActions={bulkActions}
      onExport={handleExport}
      onRefresh={handleRefresh}
      primaryCTA={{
        label: 'Add User',
        icon: Plus,
        onClick: () => navigate('/users/add')
      }}
      secondaryActions={[
        {
          label: 'Export',
          icon: Download,
          onClick: handleExport
        }
      ]}
      emptyState={
        <div className="text-center py-8">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first user.</p>
          <button onClick={() => navigate('/users/add')}>
            Add User
          </button>
        </div>
      }
    />
  );
};
```

## Column Types

### Avatar Type
```jsx
{
  key: 'avatar',
  label: 'User',
  type: 'avatar'
}
```
Displays user avatar with initials and name.

### Status Type
```jsx
{
  key: 'status',
  label: 'Status',
  type: 'status'
}
```
Displays colored status badges with icons:
- Active/Verified/Paid/Completed: Green
- Pending/Processing: Yellow
- Inactive/Suspended/Cancelled: Red

### Date Type
```jsx
{
  key: 'joinDate',
  label: 'Join Date',
  type: 'date'
}
```
Formats dates using `toLocaleDateString()`.

### Currency Type
```jsx
{
  key: 'salary',
  label: 'Salary',
  type: 'currency'
}
```
Formats numbers as currency with `$` prefix and commas.

### Custom Render
```jsx
{
  key: 'lastActive',
  label: 'Last Active',
  render: (value) => getRelativeTime(value)
}
```
Use custom render function for complex formatting.

## Filter Types

### Select Filter
```jsx
{
  key: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]
}
```

### Date Filter
```jsx
{
  key: 'joinDate',
  label: 'Join Date',
  type: 'date'
}
```

### Text Filter
```jsx
{
  key: 'name',
  label: 'Name',
  type: 'text',
  placeholder: 'Filter by name'
}
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Table title |
| `count` | number | - | Total item count |
| `columns` | array | [] | Column definitions |
| `data` | array | [] | Table data |
| `searchPlaceholder` | string | "Search..." | Search input placeholder |
| `filters` | array | [] | Filter definitions |
| `loading` | boolean | false | Show loading state |
| `error` | object | null | Error state object |
| `onRetry` | function | - | Retry callback |
| `lastUpdated` | Date | - | Last update timestamp |
| `density` | string | 'regular' | Row density |
| `onDensityChange` | function | - | Density change callback |
| `selectedRows` | array | [] | Selected row IDs |
| `onRowSelect` | function | - | Row selection callback |
| `onSelectAll` | function | - | Select all callback |
| `onRowAction` | function | - | Row action callback |
| `bulkActions` | array | [] | Bulk action definitions |
| `onExport` | function | - | Export callback |
| `onRefresh` | function | - | Refresh callback |
| `primaryCTA` | object | - | Primary action button |
| `secondaryActions` | array | [] | Secondary action buttons |
| `emptyState` | ReactNode | - | Custom empty state |
| `pageSize` | number | 10 | Items per page |
| `pageSizeOptions` | array | [10,25,50,100] | Page size options |
| `showColumnPicker` | boolean | true | Show column picker |
| `showFiltersDrawer` | boolean | true | Show filters drawer |
| `showDensity` | boolean | true | Show density control |

## Implementation Status

✅ **Completed Features:**
- Header bar with title, count, CTA, and timestamp
- Debounced search (300ms delay)
- Filters drawer with active filter count
- Column picker with show/hide functionality
- Density control (compact/regular)
- Table sorting on all columns
- Multi-select with select all
- Pagination with configurable page sizes
- Row actions (view, edit, delete, custom)
- Bulk actions for selected items
- Loading skeleton state
- Empty state with custom content
- Error state with retry and error ID
- Export CSV functionality
- Refresh functionality
- Avatar, status, date, currency column types
- Custom render functions
- Responsive design

The enhanced DataTable component is now ready for use across all admin pages and provides a comprehensive data management interface with all requested features.


import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  AlertCircle,
  RefreshCw,
  Columns,
  Grid3X3,
  List,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import Card from '../../Admin panel/admin/admincomponents/Card';

const DataTable = ({
  title,
  count,
  primaryCTA,
  secondaryActions = [],
  columns = [],
  data = [],
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilter,
  onRowAction,
  onBulkAction,
  loading = false,
  emptyState,
  errorState,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showDensity = true,
  density = 'regular',
  onDensityChange,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  lastUpdated,
  showFiltersDrawer = true,
  bulkActions = [],
  onExport,
  onRefresh,
  error = null,
  onRetry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));
  const [activeFilters, setActiveFilters] = useState({});

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeFilters]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (debouncedSearchTerm) {
      const searchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(row => {
        // Search across all visible columns
        return columns.some(col => {
          const value = row[col.key];
          if (!value) return false;
          
          const stringValue = value.toString().toLowerCase();
          
          // Handle special search patterns
          if (searchTerm.startsWith('role:')) {
            const roleSearch = searchTerm.replace('role:', '').trim();
            return col.key === 'role' && stringValue.includes(roleSearch);
          }
          
          if (searchTerm.startsWith('dept:') || searchTerm.startsWith('department:')) {
            const deptSearch = searchTerm.replace(/^(dept:|department:)/, '').trim();
            return col.key === 'department' && stringValue.includes(deptSearch);
          }
          
          if (searchTerm.startsWith('status:')) {
            const statusSearch = searchTerm.replace('status:', '').trim();
            return col.key === 'status' && stringValue.includes(statusSearch);
          }
          
          if (searchTerm.startsWith('id:')) {
            const idSearch = searchTerm.replace('id:', '').trim();
            return col.key === 'id' && stringValue.includes(idSearch);
          }
          
          // Regular search across all fields
          return stringValue.includes(searchTerm);
        });
      });
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(row => {
          const rowValue = row[key];
          if (typeof value === 'string') {
            return rowValue && rowValue.toString().toLowerCase().includes(value.toLowerCase());
          }
          return rowValue === value;
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, debouncedSearchTerm, sortColumn, sortDirection, columns, activeFilters]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleFilter = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    if (onFilter) onFilter(key, value);
  };

  const clearFilters = () => {
    setActiveFilters({});
    filters.forEach(filter => {
      if (onFilter) onFilter(filter.key, '');
    });
  };

  const handleRowSelect = (rowId, checked) => {
    if (onRowSelect) onRowSelect(rowId, checked);
  };

  const handleSelectAll = (checked) => {
    if (onSelectAll) onSelectAll(checked);
  };

  const handlePageSizeChange = (newPageSize) => {
    setCurrentPage(1);
    // This would typically be handled by parent component
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== '').length;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'inactive':
      case 'suspended':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'suspended':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {count !== undefined && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {count} items
              </span>
            )}
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                action.variant === 'primary'
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </button>
          ))}
          {primaryCTA && (
            <button
              onClick={primaryCTA.onClick}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center space-x-2"
            >
              {primaryCTA.icon && <primaryCTA.icon className="w-4 h-4" />}
              <span>{primaryCTA.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex gap-2">
            {showFiltersDrawer && filters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors ${
                  getActiveFilterCount() > 0 
                    ? 'border-pink-300 bg-pink-50 text-pink-700' 
                    : 'border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="px-1.5 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            )}

            {showColumnPicker && (
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Columns className="w-4 h-4" />
                <span>Columns</span>
              </button>
            )}

            {showDensity && (
              <select
                value={density}
                onChange={(e) => onDensityChange && onDensityChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="compact">Compact</option>
                <option value="regular">Regular</option>
              </select>
            )}

            {showPageSize && (
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && filters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map((filter, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilter(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'date' ? (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilter(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  ) : (
                    <input
                      type={filter.type}
                      placeholder={filter.placeholder || `Filter by ${filter.label}`}
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilter(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column Picker */}
        {showColumnPicker && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Show Columns</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {columns.map((column) => (
                <label key={column.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setVisibleColumns(prev => [...prev, column.key]);
                      } else {
                        setVisibleColumns(prev => prev.filter(key => key !== column.key));
                      }
                    }}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && bulkActions.length > 0 && (
        <Card className="p-4 bg-pink-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-pink-700">
                {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => onSelectAll && onSelectAll(false)}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                Clear selection
              </button>
            </div>
            <div className="flex space-x-2">
              {bulkActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => action.onClick(selectedRows)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    action.variant === 'danger'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
                >
                  {action.icon && <action.icon className="w-4 h-4 mr-1" />}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Error/Table Content */}
      {error ? (
        <Card className="p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading data</h3>
            <p className="text-gray-600 mb-4">{error.message || 'Something went wrong'}</p>
            {error.id && (
              <p className="text-sm text-gray-500 mb-4">Error ID: {error.id}</p>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {onRowSelect && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                  </th>
                )}
                {columns
                  .filter(col => visibleColumns.includes(col.key))
                  .map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-pink-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  {onRowSelect && (
                    <td className={`px-4 ${density === 'compact' ? 'py-2' : 'py-4'}`}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                    </td>
                  )}
                  {columns
                    .filter(col => visibleColumns.includes(col.key))
                    .map((column) => (
                      <td key={column.key} className={`px-4 ${density === 'compact' ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-900`}>
                        {column.type === 'status' ? (
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row[column.key])}`}>
                            {getStatusIcon(row[column.key])}
                            <span>{row[column.key]}</span>
                          </span>
                        ) : column.type === 'date' ? (
                          new Date(row[column.key]).toLocaleDateString()
                        ) : column.type === 'currency' ? (
                          `$${row[column.key]?.toLocaleString() || 0}`
                        ) : column.type === 'avatar' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                              <span className="text-pink-600 font-semibold text-sm">
                                {row[column.key] || row.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <span>{row.name || row[column.key]}</span>
                          </div>
                        ) : column.render ? (
                          column.render(row[column.key], row)
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                  <td className={`px-4 ${density === 'compact' ? 'py-2' : 'py-4'} whitespace-nowrap text-sm font-medium`}>
                    <div className="flex space-x-1">
                      {row.actions ? (
                        row.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => onRowAction && onRowAction(action.type, row)}
                            className={`p-1 rounded transition-colors ${
                              action.variant === 'danger' 
                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                : action.variant === 'success'
                                ? 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            title={action.label}
                          >
                            <action.icon className="w-4 h-4" />
                          </button>
                        ))
                      ) : (
                        <>
                          <button
                            onClick={() => onRowAction && onRowAction('view', row)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRowAction && onRowAction('edit', row)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRowAction && onRowAction('download', row)}
                            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRowAction && onRowAction('delete', row)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && !loading && (
          <div className="p-8 text-center">
            {emptyState || (
              <>
                <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                <p className="text-gray-600 mb-4">
                  {debouncedSearchTerm || getActiveFilterCount() > 0 
                    ? 'No items match your current search and filters.' 
                    : 'No items available.'}
                </p>
                {(debouncedSearchTerm || getActiveFilterCount() > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      clearFilters();
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </Card>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

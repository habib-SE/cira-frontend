import React, { useState, useMemo } from 'react';
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
  Clock
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
  pagination = true,
  pageSize = 10,
  showDensity = true,
  density = 'regular',
  onDensityChange,
  selectedRows = [],
  onRowSelect,
  onSelectAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row => 
        columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

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
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

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

  const handleRowSelect = (rowId, checked) => {
    if (onRowSelect) onRowSelect(rowId, checked);
  };

  const handleSelectAll = (checked) => {
    if (onSelectAll) onSelectAll(checked);
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
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {count !== undefined && (
            <p className="text-sm text-gray-600">{count} items</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
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

          {/* Filters */}
          <div className="flex gap-2">
            {filters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            )}

            {showColumnPicker && (
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <MoreHorizontal className="w-4 h-4" />
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
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && filters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map((filter, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={filter.value}
                      onChange={(e) => onFilter && onFilter(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type}
                      value={filter.value}
                      onChange={(e) => onFilter && onFilter(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Table */}
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
                    <td className="px-4 py-4">
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
                      <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.type === 'status' ? (
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row[column.key])}`}>
                            {getStatusIcon(row[column.key])}
                            <span>{row[column.key]}</span>
                          </span>
                        ) : column.type === 'date' ? (
                          new Date(row[column.key]).toLocaleDateString()
                        ) : column.type === 'currency' ? (
                          `$${row[column.key]?.toLocaleString() || 0}`
                        ) : column.render ? (
                          column.render(row[column.key], row)
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onRowAction && onRowAction('view', row)}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRowAction && onRowAction('edit', row)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRowAction && onRowAction('delete', row)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="p-8 text-center">
            {emptyState || (
              <>
                <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                <p className="text-gray-600">No items match your current filters.</p>
              </>
            )}
          </div>
        )}
      </Card>

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

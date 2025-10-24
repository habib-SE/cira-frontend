import { AppBar, Box, Button, Card, CardContent, Container, Grid, IconButton, Paper, Toolbar, Typography, useTheme, styled } from '@mui/material';
import { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FileText, Download, Upload, Search, Filter, Eye, Bot, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const aiReports = [
    { 
      id: 1, 
      date: 'Sept 30, 2025', 
      summary: 'Daily health checkup completed with AI analysis ', 
      status: 'Completed',
      type: 'Daily Checkup',
      duration: '15 minutes',
      aiScore: 95
    },
    { 
      id: 2, 
      date: 'Sept 29, 2025', 
      summary: 'Medication adherence monitoring and side effects assessment', 
      status: 'Completed',
      type: 'Medication Review',
      duration: '8 minutes',
      aiScore: 88
    },
    { 
      id: 3, 
      date: 'Sept 28, 2025', 
      summary: 'Symptom analysis for headache and fatigue', 
      status: 'In Progress',
      type: 'Symptom Analysis',
      duration: '12 minutes',
      aiScore: 76
    },
    { 
      id: 4, 
      date: 'Sept 27, 2025', 
      summary: 'Weekly wellness assessment', 
      status: 'Completed',
      type: 'Wellness Check',
      duration: '20 minutes',
      aiScore: 92
    },
    { 
      id: 5, 
      date: 'Sept 26, 2025', 
      summary: 'Emergency health consultation for chest pain', 
      status: 'Pending',
      type: 'Emergency Consult',
      duration: '5 minutes',
      aiScore: 65
    },
    { 
      id: 6, 
      date: 'Sept 25, 2025', 
      summary: 'Sleep pattern analysis and recommendations for better rest', 
      status: 'Completed',
      type: 'Sleep Analysis',
      duration: '18 minutes',
      aiScore: 89
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      'In Progress': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: Clock,
        iconColor: 'text-yellow-600'
      },
      'Pending': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: AlertCircle,
        iconColor: 'text-red-600'
      }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center ju space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}>
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        <span className="leading-none">{status}</span>
      </span>
    );
  };

  const filteredReports = aiReports.filter(report => {
    const matchesSearch = report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const columns = useMemo(
    () => [
     {
  field: 'date',
  headerName: 'Date',
  flex: 0.8,
  minWidth: 120,
  renderCell: (params) => (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      <div className="leading-tight flex flex-col"> {/* reduces vertical spacing */}
        <span className="text-sm font-medium text-gray-900 block">
          {params.row.date}
        </span>
        <p className="text-xs text-gray-500 mt-0.5">{params.row.duration}</p>
      </div>
    </div>
  ),
},
      {
        field: 'summary',
        headerName: 'Summary',
        flex: 1.4,
        minWidth: 200,
        renderCell: (params) => (
          <span className="text-sm text-gray-900">{params.row.summary}</span>
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {params.row.type}
          </span>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => getStatusBadge(params.row.status),
      },
      {
        field: 'aiScore',
        headerName: 'AI Score',
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  params.row.aiScore >= 90 ? 'bg-green-500' : 
                  params.row.aiScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${params.row.aiScore}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{params.row.aiScore}%</span>
          </div>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.9,
        minWidth: 120,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(`/patient/reports/${params.row.id}`)}
              title="View"
              className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">View</span>
            </button>
            <button
              type="button"
              title="Download"
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
 <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">AI Nurse Reports</h1>
          <p className="text-gray-600 text-sm lg:text-base">View and manage your AI-powered health consultations and reports</p>
        </div>
        <div className="flex items-center justify-center lg:justify-end space-x-3 w-full lg:w-1/2">
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 text-white px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors font-medium">
          <Upload className="w-5 h-5" />
            <span>Upload Report</span>
        </button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 lg:p-6 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by summary, type, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* AI Reports List */}
      <Card className="p-4 lg:p-6 w-full max-w-[1200px] mx-auto">
        <div className="mb-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 text-center lg:text-left">AI Nurse Consultation Reports</h3>
          <p className="text-sm text-gray-600 text-center lg:text-left">Your AI-powered health consultations and analysis reports</p>
        </div>

        {/* Desktop Table View */}
       {/* Desktop Table View */}
<div className="hidden lg:block w-full">
  <div 
    className="relative w-full overflow-x-auto rounded-xl border border-gray-200"
    style={{ maxWidth: '100%', height: 600 }}
  >
    <div style={{ minWidth: 1000 }}> {/* ensures horizontal scroll */}
      <DataGrid
        rows={filteredReports}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pagination
        paginationMode="client"
        paginationModel={{ page: 0, pageSize: 25 }}
        pageSizeOptions={[5, 10, 20, 25]}
        sx={{
          color: '#111827',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f9fafb',
            color: '#111827',
            borderColor: '#e5e7eb',
            fontWeight: 600,
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            borderColor: '#f3f4f6',
            color: '#111827',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            color: '#111827',
          },
          '& .MuiTablePagination-root': {
            color: '#111827',
          },
          '& .MuiButtonBase-root': {
            color: '#111827',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f9fafb',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#f3f4f6 !important',
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: '#e5e7eb !important',
          },
        }}
      />
    </div>
  </div>
</div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{report.date}</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                      {report.type}
                    </span>
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  {getStatusBadge(report.status)}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.summary}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div className="hidden items-center space-x-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          report.aiScore >= 90 ? 'bg-green-500' : 
                          report.aiScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${report.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{report.aiScore}%</span>
                  </div>
                  <span className="text-xs text-gray-500">{report.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2 justify-start sm:justify-end">
                  <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientReports;
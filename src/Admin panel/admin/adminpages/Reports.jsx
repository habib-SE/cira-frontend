import React, { useState } from 'react';
import { 
    FileText, 
    Search, 
    Filter, 
    Download, 
    Eye, 
    Calendar,
    User,
    Stethoscope,
    Clock,
    AlertTriangle,
    CheckCircle,
    File
} from 'lucide-react';
import Card from '../admincomponents/Card';

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    
    const [_isContentLoading, _setIsContentLoading] = useState(false);
    
    const handleRefreshContent = () => {
        setIsRefreshing(true);
        _setIsContentLoading(true);
        setTimeout(() => {
            setIsRefreshing(false);
            _setIsContentLoading(false);
        }, 1500);
    };

    

    // Sample AI Nurse reports data
    const reports = [
        {
            id: 1,
            patient: 'John Doe',
            doctor: 'Dr. Sarah Johnson',
            reportType: 'Health Assessment',
            generatedDate: '2024-01-15',
            appointmentDate: '2024-01-15',
            status: 'Completed',
            priority: 'Normal',
            summary: 'Patient shows signs of improved blood pressure management with current medication regimen.',
            findings: [
                'Blood pressure readings within normal range',
                'Medication compliance: 95%',
                'Lifestyle modifications showing positive results',
                'Next follow-up recommended in 3 months'
            ],
            recommendations: [
                'Continue current medication dosage',
                'Maintain regular exercise routine',
                'Monitor blood pressure weekly',
                'Schedule follow-up appointment'
            ],
            fileSize: '2.3 MB',
            downloadCount: 3
        },
        {
            id: 2,
            patient: 'Jane Smith',
            doctor: 'Dr. Michael Chen',
            reportType: 'Risk Assessment',
            generatedDate: '2024-01-15',
            appointmentDate: '2024-01-15',
            status: 'Completed',
            priority: 'High',
            summary: 'High risk factors identified requiring immediate attention and lifestyle modifications.',
            findings: [
                'Elevated cholesterol levels detected',
                'Family history of cardiovascular disease',
                'Sedentary lifestyle patterns observed',
                'Dietary habits need improvement'
            ],
            recommendations: [
                'Immediate dietary consultation required',
                'Start cholesterol-lowering medication',
                'Implement regular exercise program',
                'Monthly monitoring appointments needed'
            ],
            fileSize: '3.1 MB',
            downloadCount: 5
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            doctor: 'Dr. Emily Rodriguez',
            reportType: 'Treatment Plan',
            generatedDate: '2024-01-16',
            appointmentDate: '2024-01-16',
            status: 'Pending Review',
            priority: 'Normal',
            summary: 'Comprehensive treatment plan developed for chronic condition management.',
            findings: [
                'Stable condition with current treatment',
                'Minor adjustments needed to medication',
                'Patient education completed successfully',
                'Support system in place'
            ],
            recommendations: [
                'Adjust medication dosage by 10%',
                'Continue current therapy regimen',
                'Regular monitoring every 6 weeks',
                'Patient education follow-up in 2 weeks'
            ],
            fileSize: '2.8 MB',
            downloadCount: 1
        },
        {
            id: 4,
            patient: 'Sarah Wilson',
            doctor: 'Dr. David Kim',
            reportType: 'Emergency Assessment',
            generatedDate: '2024-01-16',
            appointmentDate: '2024-01-16',
            status: 'Completed',
            priority: 'Urgent',
            summary: 'Emergency assessment completed with immediate action items identified.',
            findings: [
                'Acute symptoms resolved successfully',
                'No immediate complications detected',
                'Patient stable and responsive',
                'Vital signs within acceptable range'
            ],
            recommendations: [
                'Continue monitoring for 24 hours',
                'Follow-up appointment in 48 hours',
                'Patient advised to seek immediate care if symptoms worsen',
                'Emergency contact information provided'
            ],
            fileSize: '1.9 MB',
            downloadCount: 7
        },
        {
            id: 5,
            patient: 'Robert Brown',
            doctor: 'Dr. Sarah Johnson',
            reportType: 'Follow-up Report',
            generatedDate: '2024-01-17',
            appointmentDate: '2024-01-17',
            status: 'Completed',
            priority: 'Normal',
            summary: 'Follow-up assessment shows excellent progress with treatment plan.',
            findings: [
                'Significant improvement in all key metrics',
                'Patient compliance: 100%',
                'Positive response to treatment',
                'Quality of life improvements noted'
            ],
            recommendations: [
                'Continue current treatment plan',
                'Gradual reduction in monitoring frequency',
                'Next appointment in 2 months',
                'Maintain current lifestyle modifications'
            ],
            fileSize: '2.1 MB',
            downloadCount: 2
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending Review':
                return 'bg-yellow-100 text-yellow-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-100 text-red-800';
            case 'High':
                return 'bg-orange-100 text-orange-800';
            case 'Normal':
                return 'bg-blue-100 text-blue-800';
            case 'Low':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Urgent':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'High':
                return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case 'Normal':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'Low':
                return <CheckCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch = searchTerm === '' || 
            report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.summary.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDoctor = filterDoctor === '' || report.doctor === filterDoctor;
        const matchesDate = filterDate === '' || report.generatedDate.includes(filterDate);
        const matchesType = filterType === '' || report.reportType === filterType;
        
        return matchesSearch && matchesDoctor && matchesDate && matchesType;
    });

    // Calculate statistics
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'Completed').length;
    const pendingReports = reports.filter(r => r.status === 'Pending Review').length;
    const urgentReports = reports.filter(r => r.priority === 'Urgent').length;

    const handleViewReport = (report) => {
        // Implement view report functionality
    };

    const handleDownloadReport = (report) => {
        // Implement download functionality
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">AI Nurse Reports</h1>
                    <p className="text-sm sm:text-base text-gray-600">Central archive of AI-generated healthcare reports</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                    onClick={handleRefreshContent}
                    disabled={isRefreshing}
                        className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                >
                    {isRefreshing ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span className="hidden sm:inline">Refreshing...</span>
                                <span className="sm:hidden">...</span>
                        </div>
                    ) : (
                            <>
                                <span className="hidden sm:inline">Refresh</span>
                                <span className="sm:hidden">↻</span>
                            </>
                    )}
                </button>
                    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export All</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                {/* Content Loader */}
                {isRefreshing && (
                    <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                            <p className="text-gray-600 font-medium">Loading content...</p>
                        </div>
                    </div>
                )}
                
                <div className={`space-y-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Reports</p>
                            <p className="text-xl font-bold text-gray-900">{totalReports}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-xl font-bold text-gray-900">{completedReports}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending Review</p>
                            <p className="text-xl font-bold text-gray-900">{pendingReports}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Urgent</p>
                            <p className="text-xl font-bold text-gray-900">{urgentReports}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-3 sm:space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports by patient, doctor, type, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                        <select
                            value={filterDoctor}
                            onChange={(e) => setFilterDoctor(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Doctors</option>
                            <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                            <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                            <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                            <option value="Dr. David Kim">Dr. David Kim</option>
                        </select>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="Health Assessment">Health Assessment</option>
                            <option value="Risk Assessment">Risk Assessment</option>
                            <option value="Treatment Plan">Treatment Plan</option>
                            <option value="Emergency Assessment">Emergency Assessment</option>
                            <option value="Follow-up Report">Follow-up Report</option>
                        </select>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            placeholder="Filter by date"
                        />
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterDoctor || filterType || filterDate) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterDoctor('');
                                    setFilterType('');
                                    setFilterDate('');
                                }}
                                className="w-full sm:w-auto px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm whitespace-nowrap"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Reports List */}
            <div className="space-y-3 sm:space-y-4">
                {filteredReports.map((report) => (
                    <Card key={report.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{report.reportType}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                                        {getPriorityIcon(report.priority)}
                                        <span className="ml-1">{report.priority}</span>
                                    </span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Patient</p>
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{report.patient}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Doctor</p>
                                        <div className="flex items-center space-x-2">
                                            <Stethoscope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{report.doctor}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Generated</p>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-900 text-sm sm:text-base">{report.generatedDate}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Appointment</p>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-900 text-sm sm:text-base">{report.appointmentDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Summary</p>
                                    <p className="text-sm sm:text-base text-gray-900">{report.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Key Findings</p>
                                        <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                                            {report.findings.slice(0, 2).map((finding, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                                    <span className="break-words">{finding}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Recommendations</p>
                                        <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                                            {report.recommendations.slice(0, 2).map((rec, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                                    <span className="break-words">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                    <span>File Size: {report.fileSize}</span>
                                    <span>Downloads: {report.downloadCount}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end sm:justify-start space-x-2 mt-3 sm:mt-0">
                                <button
                                    onClick={() => handleViewReport(report)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                    title="View Report"
                                >
                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button
                                    onClick={() => handleDownloadReport(report)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                    title="Download Report"
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterDoctor || filterType || filterDate
                                    ? 'No reports match your current filters.'
                                    : 'No AI reports have been generated yet.'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            )}
                </div>
            </div>
        </div>
    );
};

export default Reports;

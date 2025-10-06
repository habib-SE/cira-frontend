import React from 'react';
import { Brain, Download, Eye, Filter, Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../admincomponents/Card';
import Chart from '../admincomponents/Chart';

const AIReports = () => {
    const reportData = [
        { name: 'Jan', value: 45 },
        { name: 'Feb', value: 52 },
        { name: 'Mar', value: 48 },
        { name: 'Apr', value: 61 },
        { name: 'May', value: 55 },
        { name: 'Jun', value: 67 },
    ];

    const accuracyData = [
        { name: 'Cardiology', value: 94 },
        { name: 'Neurology', value: 89 },
        { name: 'Dermatology', value: 96 },
        { name: 'Orthopedics', value: 91 },
    ];

    const reports = [
        {
            id: 1,
            patient: 'John Doe',
            type: 'Cardiac Analysis',
            status: 'Completed',
            accuracy: 94,
            generatedAt: '2024-01-20 09:15 AM',
            findings: 'Normal sinus rhythm detected',
            confidence: 'High'
        },
        {
            id: 2,
            patient: 'Jane Smith',
            type: 'Neurological Assessment',
            status: 'In Progress',
            accuracy: 89,
            generatedAt: '2024-01-20 10:30 AM',
            findings: 'Mild cognitive impairment indicators',
            confidence: 'Medium'
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            type: 'Dermatological Scan',
            status: 'Completed',
            accuracy: 96,
            generatedAt: '2024-01-20 11:45 AM',
            findings: 'Benign mole characteristics identified',
            confidence: 'High'
        },
        {
            id: 4,
            patient: 'Sarah Wilson',
            type: 'Orthopedic Evaluation',
            status: 'Pending Review',
            accuracy: 91,
            generatedAt: '2024-01-20 02:20 PM',
            findings: 'Minor joint inflammation detected',
            confidence: 'Medium'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pending Review':
                return 'bg-blue-100 text-blue-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case 'High':
                return 'text-green-600';
            case 'Medium':
                return 'text-yellow-600';
            case 'Low':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Reports</h1>
                    <p className="text-gray-600">AI-generated medical reports and analysis</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200">
                    <Brain className="w-4 h-4" />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Reports</p>
                            <p className="text-xl font-bold text-gray-900">1,247</p>
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
                            <p className="text-xl font-bold text-gray-900">1,189</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">In Progress</p>
                            <p className="text-xl font-bold text-gray-900">43</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Avg Accuracy</p>
                            <p className="text-xl font-bold text-gray-900">92.5%</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Report Generation Trends</h3>
                        <p className="text-sm text-gray-600">Monthly AI report generation</p>
                    </div>
                    <Chart type="line" data={reportData} height={300} />
                </Card>
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Accuracy by Specialty</h3>
                        <p className="text-sm text-gray-600">AI accuracy across medical specialties</p>
                    </div>
                    <Chart type="pie" data={accuracyData} height={300} />
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports by patient, type, or findings..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
                {reports.map((report) => (
                    <Card key={report.id} hover className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {report.patient.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{report.patient}</h3>
                                    <p className="text-sm text-gray-600">{report.type}</p>
                                    <p className="text-xs text-gray-500">{report.generatedAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">Accuracy: {report.accuracy}%</p>
                                    <p className={`text-sm font-medium ${getConfidenceColor(report.confidence)}`}>
                                        Confidence: {report.confidence}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-pink-600 hover:text-pink-900 p-1">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-900 p-1">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Findings:</span> {report.findings}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AIReports;

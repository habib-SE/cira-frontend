import React from 'react';
import { FileText, Download, Eye, Filter, Search, Calendar, TrendingUp } from 'lucide-react';
import Card from '../admincomponents/Card';
import Chart from '../admincomponents/Chart';

const Reports = () => {
    const monthlyData = [
        { name: 'Jan', patients: 120, appointments: 180, revenue: 45000 },
        { name: 'Feb', patients: 135, appointments: 200, revenue: 52000 },
        { name: 'Mar', patients: 150, appointments: 220, revenue: 58000 },
        { name: 'Apr', patients: 165, appointments: 240, revenue: 62000 },
        { name: 'May', patients: 180, appointments: 260, revenue: 68000 },
        { name: 'Jun', patients: 195, appointments: 280, revenue: 72000 },
    ];

    const specialtyData = [
        { name: 'Cardiology', value: 35 },
        { name: 'Neurology', value: 25 },
        { name: 'Dermatology', value: 20 },
        { name: 'Orthopedics', value: 20 },
    ];

    const reports = [
        {
            id: 1,
            title: 'Monthly Patient Report',
            type: 'Patient Analytics',
            generatedAt: '2024-01-20 09:00 AM',
            period: 'December 2023',
            status: 'Ready',
            size: '2.4 MB'
        },
        {
            id: 2,
            title: 'Revenue Analysis',
            type: 'Financial Report',
            generatedAt: '2024-01-19 14:30 PM',
            period: 'Q4 2023',
            status: 'Ready',
            size: '1.8 MB'
        },
        {
            id: 3,
            title: 'Appointment Statistics',
            type: 'Operational Report',
            generatedAt: '2024-01-19 11:15 AM',
            period: 'January 2024',
            status: 'Generating',
            size: '1.2 MB'
        },
        {
            id: 4,
            title: 'AI Performance Report',
            type: 'AI Analytics',
            generatedAt: '2024-01-18 16:45 PM',
            period: 'January 2024',
            status: 'Ready',
            size: '3.1 MB'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ready':
                return 'bg-green-100 text-green-800';
            case 'Generating':
                return 'bg-yellow-100 text-yellow-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
                    <p className="text-gray-600">Generate and manage comprehensive healthcare reports</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200">
                    <FileText className="w-4 h-4" />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Reports</p>
                            <p className="text-xl font-bold text-gray-900">247</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">This Month</p>
                            <p className="text-xl font-bold text-gray-900">23</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Avg Size</p>
                            <p className="text-xl font-bold text-gray-900">2.1 MB</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Downloads</p>
                            <p className="text-xl font-bold text-gray-900">1,847</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Monthly Overview</h3>
                        <p className="text-sm text-gray-600">Patients, appointments, and revenue trends</p>
                    </div>
                    <Chart type="line" data={monthlyData} height={300} />
                </Card>
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Specialty Distribution</h3>
                        <p className="text-sm text-gray-600">Patient distribution by medical specialty</p>
                    </div>
                    <Chart type="pie" data={specialtyData} height={300} />
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports by title, type, or period..."
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
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                    <p className="text-sm text-gray-600">{report.type} • {report.period}</p>
                                    <p className="text-xs text-gray-500">{report.generatedAt} • {report.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
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
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Reports;

import React, { useState } from 'react';
import { 
    TrendingUp, 
    TrendingDown, 
    Users, 
    Calendar, 
    DollarSign, 
    Clock,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Award,
    Star
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const Analytics = () => {

    // Sample analytics data
    const analyticsData = {
        overview: {
            totalPatients: 1247,
            totalAppointments: 3456,
            totalEarnings: 125000,
            averageRating: 4.8,
            growthRate: 15.2
        },
        monthlyStats: [
            { month: 'Jan', patients: 120, appointments: 280, earnings: 8500 },
            { month: 'Feb', patients: 135, appointments: 320, earnings: 9200 },
            { month: 'Mar', patients: 150, appointments: 380, earnings: 10800 },
            { month: 'Apr', patients: 165, appointments: 420, earnings: 12500 },
            { month: 'May', patients: 180, appointments: 450, earnings: 14200 },
            { month: 'Jun', patients: 195, appointments: 480, earnings: 15800 }
        ],
        topServices: [
            { name: 'General Consultation', count: 450, revenue: 22500 },
            { name: 'Follow-up Visit', count: 320, revenue: 16000 },
            { name: 'Emergency Consultation', count: 180, revenue: 27000 },
            { name: 'Teleconsultation', count: 280, revenue: 14000 }
        ],
        patientDemographics: [
            { ageGroup: '18-25', percentage: 15, count: 187 },
            { ageGroup: '26-35', percentage: 25, count: 312 },
            { ageGroup: '36-45', percentage: 30, count: 374 },
            { ageGroup: '46-55', percentage: 20, count: 249 },
            { ageGroup: '56+', percentage: 10, count: 125 }
        ]
    };

    const stats = [
        {
            icon: Users,
            title: 'Total Patients',
            value: analyticsData.overview.totalPatients.toLocaleString(),
            change: '+12% from last month',
            bgColor: 'bg-blue-50',
            color: 'text-blue-600',
            trend: 'up'
        },
        {
            icon: Calendar,
            title: 'Total Appointments',
            value: analyticsData.overview.totalAppointments.toLocaleString(),
            change: '+8% from last month',
            bgColor: 'bg-green-50',
            color: 'text-green-600',
            trend: 'up'
        },
        {
            icon: DollarSign,
            title: 'Total Earnings',
            value: `$${analyticsData.overview.totalEarnings.toLocaleString()}`,
            change: '+15% from last month',
            bgColor: 'bg-purple-50',
            color: 'text-purple-600',
            trend: 'up'
        },
        {
            icon: Star,
            title: 'Average Rating',
            value: analyticsData.overview.averageRating.toString(),
            change: '+0.2 from last month',
            bgColor: 'bg-yellow-50',
            color: 'text-yellow-600',
            trend: 'up'
        }
    ];

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Analytics</h1>
                    <p className="text-sm sm:text-base text-gray-600">Track your practice performance and insights</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-3 sm:p-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500 truncate">{stat.change}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Monthly Performance Chart */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {analyticsData.monthlyStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                        <span className="text-pink-600 font-semibold text-xs">{stat.month}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{stat.patients} patients</p>
                                        <p className="text-sm text-gray-600">{stat.appointments} appointments</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${stat.earnings.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">earnings</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Top Services */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Services</h3>
                        <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {analyticsData.topServices.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{service.name}</p>
                                    <p className="text-sm text-gray-600">{service.count} appointments</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${service.revenue.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Patient Demographics */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {analyticsData.patientDemographics.map((demo, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">{demo.ageGroup}</span>
                                    <span className="text-sm text-gray-600">{demo.percentage}% ({demo.count})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${demo.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Performance Metrics */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Target className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Patient Satisfaction</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">94%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Avg. Response Time</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">2.3 hrs</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Award className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">98%</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;

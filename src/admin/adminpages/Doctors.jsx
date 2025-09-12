import React from 'react';
import { Users, Plus, Search, Filter, MoreVertical } from 'lucide-react';
import Card from '../admincomponents/Card';

const Doctors = () => {
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            experience: '8 years',
            patients: 245,
            rating: 4.9,
            status: 'online',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            experience: '12 years',
            patients: 189,
            rating: 4.8,
            status: 'busy',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Dermatology',
            experience: '6 years',
            patients: 312,
            rating: 4.9,
            status: 'online',
            avatar: 'ER'
        },
        {
            id: 4,
            name: 'Dr. David Kim',
            specialty: 'Orthopedics',
            experience: '15 years',
            patients: 198,
            rating: 4.7,
            status: 'offline',
            avatar: 'DK'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'busy':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctors</h1>
                    <p className="text-gray-600">Manage your medical team and their schedules</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Add Doctor</span>
                </button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </Card>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <Card key={doctor.id} hover className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {doctor.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Experience</span>
                                <span className="text-sm font-medium text-gray-900">{doctor.experience}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Patients</span>
                                <span className="text-sm font-medium text-gray-900">{doctor.patients}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Rating</span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(doctor.status)}`}></div>
                                <span className="text-sm text-gray-600 capitalize">{doctor.status}</span>
                            </div>
                            <button className="px-3 py-1 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors duration-200">
                                View Profile
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Doctors;

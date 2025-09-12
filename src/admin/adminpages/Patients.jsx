import React from 'react';
import { Stethoscope, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../admincomponents/Card';

const Patients = () => {
    const patients = [
        {
            id: 1,
            name: 'John Doe',
            age: 45,
            gender: 'Male',
            condition: 'Hypertension',
            lastVisit: '2024-01-15',
            status: 'Active',
            priority: 'High'
        },
        {
            id: 2,
            name: 'Jane Smith',
            age: 32,
            gender: 'Female',
            condition: 'Diabetes Type 2',
            lastVisit: '2024-01-14',
            status: 'Active',
            priority: 'Medium'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            age: 58,
            gender: 'Male',
            condition: 'Cardiac Arrhythmia',
            lastVisit: '2024-01-13',
            status: 'Monitoring',
            priority: 'High'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            age: 28,
            gender: 'Female',
            condition: 'Migraine',
            lastVisit: '2024-01-12',
            status: 'Active',
            priority: 'Low'
        },
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Monitoring':
                return 'bg-blue-100 text-blue-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
                    <p className="text-gray-600">Manage patient records and health information</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Add Patient</span>
                </button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients by name, condition, or ID..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </Card>

            {/* Patients Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Condition
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Visit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-500">{patient.age} years • {patient.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{patient.condition}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                                            {patient.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-pink-600 hover:text-pink-900 p-1">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900 p-1">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Patients;

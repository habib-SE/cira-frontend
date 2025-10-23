import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Power,
    PowerOff,
    Search,
    Filter,
    Building2,
    Globe,
    Mail,
    FileText,
    DollarSign,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Card from '../admincomponents/Card';

const ReferralProviders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // success, error, warning
    const [editingProvider, setEditingProvider] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        baseUrl: '',
        referralParamKey: '',
        commissionModel: '',
        contact: '',
        termsUrl: ''
    });

    // Sample provider data
    const [providers, setProviders] = useState([
        {
            id: 1,
            name: 'AirDoctor',
            type: 'Medical Provider',
            totalReferrals: 145,
            successfulBookings: 98,
            conversionRate: 67.6,
            totalRevenue: 14700,
            commissionEarned: 1470,
            status: 'Active',
            logo: 'AD',
            lastActivity: '2024-01-17',
            baseUrl: 'https://airdoctor.com',
            referralParamKey: 'ref_id',
            commissionModel: 'Percentage (10%)',
            contact: 'partnerships@airdoctor.com',
            termsUrl: 'https://airdoctor.com/terms'
        },
        {
            id: 2,
            name: 'Doctor On Call',
            type: 'Telemedicine Platform',
            totalReferrals: 89,
            successfulBookings: 67,
            conversionRate: 75.3,
            totalRevenue: 10050,
            commissionEarned: 1005,
            status: 'Active',
            logo: 'DOC',
            lastActivity: '2024-01-16',
            baseUrl: 'https://doctoroncall.com',
            referralParamKey: 'partner_ref',
            commissionModel: 'Fixed ($15)',
            contact: 'partners@doctoroncall.com',
            termsUrl: 'https://doctoroncall.com/partner-terms'
        },
        {
            id: 3,
            name: 'HealthCare Connect',
            type: 'Healthcare Network',
            totalReferrals: 67,
            successfulBookings: 42,
            conversionRate: 62.7,
            totalRevenue: 6300,
            commissionEarned: 630,
            status: 'Active',
            logo: 'HCC',
            lastActivity: '2024-01-15',
            baseUrl: 'https://healthcareconnect.com',
            referralParamKey: 'source_id',
            commissionModel: 'Percentage (10%)',
            contact: 'contact@healthcareconnect.com',
            termsUrl: 'https://healthcareconnect.com/terms'
        },
        {
            id: 4,
            name: 'MediLink Partners',
            type: 'Medical Services',
            totalReferrals: 34,
            successfulBookings: 23,
            conversionRate: 67.6,
            totalRevenue: 3450,
            commissionEarned: 345,
            status: 'Inactive',
            logo: 'MLP',
            lastActivity: '2024-01-14',
            baseUrl: 'https://medilinkpartners.com',
            referralParamKey: 'ref',
            commissionModel: 'Percentage (10%)',
            contact: 'info@medilinkpartners.com',
            termsUrl: 'https://medilinkpartners.com/terms'
        }
    ]);

    const filteredProviders = providers.filter(provider => {
        const matchesSearch = searchTerm === '' || 
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || provider.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const handleAddProvider = () => {
        console.log('Add Provider button clicked');
        setEditingProvider(null);
        setFormData({
            name: '',
            logo: '',
            baseUrl: '',
            referralParamKey: '',
            commissionModel: '',
            contact: '',
            termsUrl: ''
        });
        setShowModal(true);
    };

    const handleEditProvider = (provider) => {
        console.log('Edit Provider button clicked for:', provider.name);
        // Navigate to edit page instead of opening modal
        navigate(`/admin/referral-providers/edit/${provider.id}`);
    };

    // Toast notification helper
    const showToastNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleSaveProvider = () => {
        console.log('Save Provider button clicked');
        if (!formData.name || !formData.baseUrl || !formData.referralParamKey || !formData.commissionModel || !formData.contact) {
            showToastNotification('Please fill in all required fields (marked with *)', 'error');
            return;
        }

        if (editingProvider) {
            // Update existing provider
            console.log('Updating provider:', editingProvider.name);
            setProviders(providers.map(p => 
                p.id === editingProvider.id 
                    ? { ...p, ...formData }
                    : p
            ));
            showToastNotification('Provider updated successfully!', 'success');
        } else {
            // Add new provider
            console.log('Adding new provider:', formData.name);
            const newProvider = {
                id: providers.length + 1,
                ...formData,
                type: 'Medical Provider',
                totalReferrals: 0,
                successfulBookings: 0,
                conversionRate: 0,
                totalRevenue: 0,
                commissionEarned: 0,
                status: 'Active',
                lastActivity: new Date().toISOString().split('T')[0]
            };
            setProviders([...providers, newProvider]);
            showToastNotification('Provider added successfully!', 'success');
        }
        setShowModal(false);
    };

    const handleDeleteProvider = (id) => {
        const provider = providers.find(p => p.id === id);
        console.log('Delete Provider button clicked for:', provider?.name);
        
        // Delete immediately and show success toast
        setProviders(providers.filter(p => p.id !== id));
        showToastNotification('Referral deleted successfully!', 'warning');
    };

    const handleToggleStatus = (id) => {
        const provider = providers.find(p => p.id === id);
        console.log('Toggle Status button clicked for:', provider?.name);
        const newStatus = provider.status === 'Active' ? 'Inactive' : 'Active';
        setProviders(providers.map(p => 
            p.id === id 
                ? { ...p, status: newStatus }
                : p
        ));
        showToastNotification(`Provider status changed to ${newStatus}`, 'success');
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/referrals')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Referral Providers</h1>
                        <p className="text-sm sm:text-base text-gray-600">Manage third-party referral providers</p>
                    </div>
                </div>
                <button
                    onClick={handleAddProvider}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Provider</span>
                </button>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by provider name, ID, or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    {(searchTerm || filterStatus) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('');
                            }}
                            className="w-full sm:w-auto px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm whitespace-nowrap"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>
            </Card>

            {/* Providers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {provider.logo}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                                    <p className="text-sm text-gray-600">{provider.type}</p>
                                </div>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                provider.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {provider.status}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Base URL:</span>
                                <a href={provider.baseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {provider.baseUrl}
                                </a>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Referral Param:</span>
                                <span className="font-medium text-gray-900">{provider.referralParamKey}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Commission Model:</span>
                                <span className="font-medium text-gray-900">{provider.commissionModel}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Contact:</span>
                                <a href={`mailto:${provider.contact}`} className="text-blue-600 hover:underline">
                                    {provider.contact}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-xs text-gray-500">
                                Last activity: {provider.lastActivity}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleToggleStatus(provider.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        provider.status === 'Active'
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-green-600 hover:bg-green-50'
                                    }`}
                                    title={provider.status === 'Active' ? 'Disable' : 'Enable'}
                                >
                                    {provider.status === 'Active' ? (
                                        <PowerOff className="w-4 h-4" />
                                    ) : (
                                        <Power className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleEditProvider(provider)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteProvider(provider.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredProviders.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterStatus
                                    ? 'No providers match your current filters.'
                                    : 'No referral providers have been added yet.'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {editingProvider ? 'Edit Provider' : 'Add New Provider'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="e.g., AirDoctor"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Logo (Abbreviation)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="e.g., AD"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Base URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.baseUrl}
                                        onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Referral Param Key <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.referralParamKey}
                                        onChange={(e) => setFormData({ ...formData, referralParamKey: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="e.g., ref_id"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Commission Model <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.commissionModel}
                                        onChange={(e) => setFormData({ ...formData, commissionModel: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="e.g., Percentage (10%) or Fixed ($15)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Terms URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.termsUrl}
                                        onChange={(e) => setFormData({ ...formData, termsUrl: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="https://example.com/terms"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProvider}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                >
                                    {editingProvider ? 'Update' : 'Add'} Provider
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}


            {/* Toast Notification */}
            {showToast && (
                <div 
                    className="fixed top-4 right-4 z-50"
                    style={{
                        animation: 'slideInRight 0.3s ease-out'
                    }}
                >
                    <div 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] ${
                            toastType === 'success' ? 'bg-green-50 border border-green-200' :
                            toastType === 'error' ? 'bg-red-50 border border-red-200' :
                            toastType === 'warning' ? 'bg-pink-50 border border-pink-200' :
                            'bg-yellow-50 border border-yellow-200'
                        }`}
                    >
                        <div className={`flex-shrink-0 ${
                            toastType === 'success' ? 'text-green-600' :
                            toastType === 'error' ? 'text-red-600' :
                            toastType === 'warning' ? 'text-pink-600' :
                            'text-yellow-600'
                        }`}>
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${
                                toastType === 'success' ? 'text-green-800' :
                                toastType === 'error' ? 'text-red-800' :
                                toastType === 'warning' ? 'text-pink-800' :
                                'text-yellow-800'
                            }`}>
                                {toastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className={`flex-shrink-0 ${
                                toastType === 'success' ? 'text-green-600 hover:text-green-800' :
                                toastType === 'error' ? 'text-red-600 hover:text-red-800' :
                                toastType === 'warning' ? 'text-pink-600 hover:text-pink-800' :
                                'text-yellow-600 hover:text-yellow-800'
                            }`}
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralProviders;

import React, { useState } from 'react';
import { 
  Wallet, 
  Download, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  X
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorPayouts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Sample payout data
  const payoutData = [
    {
      id: 'PAY-001',
      period: '2024-01',
      grossAmount: 12500.00,
      commission: 1250.00,
      netAmount: 11250.00,
      status: 'Paid',
      paidDate: '2024-02-01',
      method: 'Bank Transfer',
      bankAccount: '****1234'
    },
    {
      id: 'PAY-002',
      period: '2024-02',
      grossAmount: 15200.00,
      commission: 1520.00,
      netAmount: 13680.00,
      status: 'Processing',
      paidDate: null,
      method: 'Bank Transfer',
      bankAccount: '****1234'
    },
    {
      id: 'PAY-003',
      period: '2024-03',
      grossAmount: 9800.00,
      commission: 980.00,
      netAmount: 8820.00,
      status: 'Queued',
      paidDate: null,
      method: 'Bank Transfer',
      bankAccount: '****1234'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Queued':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Queued':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayouts = payoutData.filter(payout => {
    const matchesSearch = payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payout.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = payoutData.reduce((sum, payout) => sum + payout.grossAmount, 0);
  const totalCommission = payoutData.reduce((sum, payout) => sum + payout.commission, 0);
  const totalNet = payoutData.reduce((sum, payout) => sum + payout.netAmount, 0);

  const handleExportAll = async () => {
    setIsExporting(true);
    setToastMessage('Exporting payout data...');
    setShowToast(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create comprehensive export data
      const exportData = `CIRA Healthcare Platform - Payout Export Report
Generated: ${new Date().toLocaleString()}

SUMMARY STATISTICS
==================
Total Earnings: $${totalEarnings.toLocaleString()}
Platform Commission: $${totalCommission.toLocaleString()}
Net Payouts: $${totalNet.toLocaleString()}
Total Records: ${payoutData.length}

DETAILED PAYOUT RECORDS
=======================

${payoutData.map((payout, index) => `
${index + 1}. PAYOUT ID: ${payout.id}
   Period: ${payout.period}
   Gross Amount: $${payout.grossAmount.toLocaleString()}
   Commission: $${payout.commission.toLocaleString()}
   Net Amount: $${payout.netAmount.toLocaleString()}
   Status: ${payout.status}
   Paid Date: ${payout.paidDate || 'Not yet paid'}
   Payment Method: ${payout.method}
   Bank Account: ${payout.bankAccount}
   ---`).join('')}

EXPORT METADATA
===============
Export Date: ${new Date().toISOString()}
Platform: CIRA AI Healthcare Platform
Report Type: Complete Payout History
Format: Text Export

---
This report contains confidential financial information.
Please handle with appropriate security measures.`;

      // Create and download the file
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CIRA_Payouts_Export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToastMessage('Payout data exported successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage('Failed to export data. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsExporting(false);
    }
  };


  const handleDownloadPayout = (payout) => {
    // Create payout report content
    const payoutContent = `CIRA Healthcare Platform - Payout Report

Payout ID: ${payout.id}
Period: ${payout.period}
Gross Amount: $${payout.grossAmount.toLocaleString()}
Commission: $${payout.commission.toLocaleString()}
Net Amount: $${payout.netAmount.toLocaleString()}
Status: ${payout.status}
Paid Date: ${payout.paidDate || 'Not yet paid'}
Payment Method: ${payout.method}
Bank Account: ${payout.bankAccount}

---
Report Generated: ${new Date().toLocaleString()}
Platform: CIRA AI Healthcare Platform`;

    // Create and download the file
    const blob = new Blob([payoutContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payout_${payout.id}_${payout.period}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Payouts</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your earnings and payout history</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={handleExportAll}
              disabled={isExporting}
              className="px-3 sm:px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Total Earnings</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Platform Commission</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">${totalCommission.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Net Payouts</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">${totalNet.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Next Payout</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">Feb 15</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payouts Table */}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payout.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.period}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payout.grossAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payout.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payout.netAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      <span>{payout.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.paidDate || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.method}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDownloadPayout(payout)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredPayouts.length === 0 && (
        <Card className="p-8 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts found</h3>
          <p className="text-gray-600">No payouts match your current filters.</p>
        </Card>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-pink-500" />
            </div>
            <span className="text-pink-700 font-medium flex-1">{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 text-pink-500 hover:text-pink-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPayouts;

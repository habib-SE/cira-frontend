import React from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import Card from '../../Admin panel/admin/admincomponents/Card';
import Chart from '../../Admin panel/admin/admincomponents/Chart';

const DashboardKPIs = ({ 
  role = 'admin', 
  data = {},
  className = '' 
}) => {
  const getAdminKPIs = () => [
    {
      title: 'Active Users',
      value: data.activeUsers || '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total registered users'
    },
    {
      title: 'Active Doctors',
      value: data.activeDoctors || '47',
      change: '+8%',
      changeType: 'positive',
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Verified healthcare providers'
    },
    {
      title: 'Appointments (Week)',
      value: data.weeklyAppointments || '156',
      change: '+15%',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'This week\'s appointments'
    },
    {
      title: 'Revenue (Month)',
      value: `$${data.monthlyRevenue || '45,230'}`,
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Total monthly revenue'
    },
    {
      title: 'Referral Conversion',
      value: `${data.referralConversion || '12.5'}%`,
      change: '+3.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Referral to appointment rate'
    },
    {
      title: 'Payouts Due',
      value: `$${data.payoutsDue || '12,450'}`,
      change: '-5%',
      changeType: 'negative',
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Pending doctor payouts'
    }
  ];

  const getDoctorKPIs = () => [
    {
      title: 'Today\'s Appointments',
      value: data.todaysAppointments || '4',
      change: '+1',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Scheduled for today'
    },
    {
      title: 'This Week',
      value: data.weeklyAppointments || '18',
      change: '+3',
      changeType: 'positive',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Upcoming appointments'
    },
    {
      title: 'Monthly Earnings',
      value: `$${data.monthlyEarnings || '8,450'}`,
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Current month revenue'
    },
    {
      title: 'Payout Status',
      value: data.payoutStatus || 'Processing',
      change: 'Due Feb 15',
      changeType: 'neutral',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Next payout date'
    },
    {
      title: 'Patient Follow-ups',
      value: data.patientFollowups || '7',
      change: '+2',
      changeType: 'positive',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Pending follow-ups'
    },
    {
      title: 'Unread Messages',
      value: data.unreadMessages || '3',
      change: '+1',
      changeType: 'neutral',
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Patient messages'
    }
  ];

  const getPatientKPIs = () => [
    {
      title: 'AI Sessions Used',
      value: `${data.aiSessionsUsed || '12'}/${data.aiSessionsLimit || '20'}`,
      change: '60% used',
      changeType: 'neutral',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'This month\'s AI sessions'
    },
    {
      title: 'Last AI Report',
      value: data.lastReportDate || '2 days ago',
      change: 'Ready',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Most recent health report'
    },
    {
      title: 'Upcoming Appointment',
      value: data.nextAppointment || 'Tomorrow 2PM',
      change: 'Dr. Smith',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Next scheduled visit'
    },
    {
      title: 'Subscription Status',
      value: data.subscriptionStatus || 'Premium',
      change: 'Active',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Current plan status'
    }
  ];

  const getKPIs = () => {
    switch (role) {
      case 'doctor':
        return getDoctorKPIs();
      case 'patient':
        return getPatientKPIs();
      default:
        return getAdminKPIs();
    }
  };

  const kpis = getKPIs();

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">
                    {kpi.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(kpi.changeType)}
                    <span className={`text-xs font-medium ${getChangeColor(kpi.changeType)}`}>
                      {kpi.change}
                    </span>
                  </div>
                  {kpi.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {kpi.description}
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 ${kpi.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Trend Chart */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Appointments Trend</h3>
              <p className="text-sm text-gray-600">Weekly appointment bookings</p>
            </div>
            <div className="h-64">
              <Chart 
                type="line" 
                data={[
                  { name: 'Week 1', value: 45 },
                  { name: 'Week 2', value: 52 },
                  { name: 'Week 3', value: 38 },
                  { name: 'Week 4', value: 61 },
                  { name: 'Week 5', value: 48 },
                  { name: 'Week 6', value: 55 }
                ]} 
                height={250} 
              />
            </div>
          </Card>

          {/* Revenue Split Chart */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Revenue Split</h3>
              <p className="text-sm text-gray-600">Standard vs Referral revenue</p>
            </div>
            <div className="h-64">
              <Chart 
                type="pie" 
                data={[
                  { name: 'Standard', value: 75 },
                  { name: 'Referral', value: 25 }
                ]} 
                height={250} 
              />
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity Tables */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pending Doctor Approvals</h3>
              <p className="text-sm text-gray-600">Awaiting verification</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', submitted: '2 hours ago' },
                { name: 'Dr. Michael Chen', specialty: 'Dermatology', submitted: '4 hours ago' },
                { name: 'Dr. Emily Davis', specialty: 'Pediatrics', submitted: '1 day ago' }
              ].map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{doctor.submitted}</p>
                    <div className="flex space-x-2 mt-1">
                      <button className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Payments */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Payments</h3>
              <p className="text-sm text-gray-600">Latest transactions</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'PAY-001', amount: '$150', patient: 'John Doe', status: 'Paid' },
                { id: 'PAY-002', amount: '$200', patient: 'Jane Smith', status: 'Processing' },
                { id: 'PAY-003', amount: '$75', patient: 'Mike Johnson', status: 'Paid' }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.id}</p>
                    <p className="text-sm text-gray-600">{payment.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{payment.amount}</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardKPIs;

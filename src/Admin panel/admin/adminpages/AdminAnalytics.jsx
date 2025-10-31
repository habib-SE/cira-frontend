import React from 'react';
import { Users, Stethoscope, DollarSign, CheckCircle, Activity } from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

const KPI = ({ icon: Icon, label, value, color = 'text-gray-900', bg = 'bg-gray-50' }) => (
    <Card className="p-4">
        <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </Card>
);

const ProgressRow = ({ label, percent, colorClass }) => (
    <div>
        <div className="flex items-center justify-between mb-1 text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-900 font-medium">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-2 ${colorClass}`} style={{ width: `${percent}%` }} />
        </div>
    </div>
);

const AdminAnalytics = () => {
    // Static sample metrics for now
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Sample chart data
    const weeklySignups = [12, 18, 14, 22, 28, 26, 31];
    const weeklySignupLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueSeries = [42, 55, 50, 63, 58, 70, 68, 75, 73, 82, 79, 88];
    const revenueLabels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

    const ChartCard = ({ title, period, data, labels = [], color = '#ec4899', format = (n) => n, type = 'line' }) => {
        const width = 820; // responsive container will scale
        const height = 260;
        const padding = 24;
        const innerW = width - padding * 2;
        const xLabelSpace = 28;
        const innerH = height - padding * 2 - xLabelSpace;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = Math.max(1, max - min);
        const stepX = innerW / Math.max(1, data.length - 1);
        const last = data[data.length - 1] ?? 0;
        const first = data[0] ?? 0;
        const diff = last - first;
        const changePct = first === 0 ? 0 : Math.round((diff / first) * 100);
        const isUp = diff >= 0;
        const gradientId = `grad-${title.replace(/\s+/g, '-')}`;
        const points = data
            .map((v, i) => {
                const x = padding + i * stepX;
                const y = padding + innerH - ((v - min) / range) * innerH;
                return `${x},${y}`;
            })
            .join(' ');

        return (
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <span className="text-sm text-gray-500">{period}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{format(last)}</div>
                        <div className="text-xs text-gray-500">Current</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs(changePct)}%
                    </span>
                </div>
                <div className="w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
                        <defs>
                            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* background */}
                        <rect x="0" y="0" width={width} height={height} rx="12" fill="transparent" />
                        {/* subtle grid */}
                        <g stroke="#eee">
                            {/* y-grid lines */}
                            {Array.from({ length: 4 }, (_, i) => {
                                const y = padding + (innerH / 4) * (i + 1);
                                return <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} />;
                            })}
                            {/* axes */}
                            <line x1={padding} y1={padding + innerH} x2={width - padding} y2={padding + innerH} />
                            <line x1={padding} y1={padding} x2={padding} y2={padding + innerH} />
                        </g>
                        {type === 'line' ? (
                            <>
                                {/* area under line */}
                                {points && (
                                    <polyline
                                        points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`}
                                        fill={`url(#${gradientId})`}
                                        stroke="none"
                                    />
                                )}
                                {/* line path */}
                                <polyline fill="none" stroke={color} strokeWidth="4" points={points} strokeLinejoin="round" strokeLinecap="round" />
                                {/* end dot */}
                                {data.length > 0 && (
                                    <circle
                                        cx={padding + (data.length - 1) * stepX}
                                        cy={padding + innerH - ((data[data.length - 1] - min) / range) * innerH}
                                        r="5"
                                        fill={color}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {/* bars */}
                                {data.map((v, i) => {
                                    const barW = Math.max(6, innerW / data.length * 0.6);
                                    const x = padding + i * stepX - barW / 2;
                                    const h = ((v - min) / range) * innerH;
                                    const y = padding + innerH - h;
                                    return (
                                        <g key={i}>
                                            <title>{`${labels[i] ?? i + 1}: ${format(v)}`}</title>
                                            <rect x={x} y={y} width={barW} height={h} rx="6" fill={`url(#${gradientId})`} />
                                            <rect x={x} y={y} width={barW} height={Math.max(2, h * 0.55)} rx="6" fill={color} opacity="0.9" />
                                            {/* value label */}
                                            <text x={x + barW / 2} y={Math.max(y - 6, padding + 10)} textAnchor="middle" fontSize="10" fill="#64748b">{format(v)}</text>
                                        </g>
                                    );
                                })}
                            </>
                        )}
                        {/* x labels */}
                        {labels.length > 0 && (
                            <g>
                                {data.map((_, i) => (
                                    <text key={i} x={padding + i * stepX} y={height - padding + 16} textAnchor="middle" fontSize="11" fill="#94a3b8">
                                        {labels[i]}
                                    </text>
                                ))}
                            </g>
                        )}
                    </svg>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span>Series</span>
                    </div>
                    <span>First: {format(first)}</span>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            <Breadcrumbs />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                    <p className="text-sm sm:text-base text-gray-600">Key performance and platform metrics</p>
                    <MetaChips status="Overview" id="Admin Analytics" date={today} owner="Admin" />
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <KPI icon={Users} label="Total Users" value="4,218" color="text-blue-600" bg="bg-blue-50" />
                <KPI icon={Stethoscope} label="Active Doctors" value="312" color="text-purple-600" bg="bg-purple-50" />
                <KPI icon={DollarSign} label="Revenue (MTD)" value="$128k" color="text-green-600" bg="bg-green-50" />
                <KPI icon={CheckCircle} label="Pending Approvals" value="7" color="text-yellow-600" bg="bg-yellow-50" />
            </div>

            {/* Removed intermediate cards as requested */}

            {/* Big Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Weekly Signups" period="Last 7 days" data={weeklySignups} labels={weeklySignupLabels} color="#0ea5e9" type="bar" />
                <ChartCard title="Revenue Trend" period="12 weeks" data={revenueSeries} labels={revenueLabels} color="#ec4899" format={(n) => `$${n}k`} type="bar" />
            </div>
        </div>
    );
};

export default AdminAnalytics;



import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
    File,
    Brain,
    Heart,
    Activity,
    TrendingUp,
    Zap,
    Bot,
    ArrowLeft
} from 'lucide-react';
import Card from '../admincomponents/Card';

const Reports = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: reportIdParam } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Toast notification helper
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Check for search term from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    // Export all reports functionality
    const handleExportAll = () => {
        try {
            // Create HTML content for PDF
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI Nurse Reports - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ec4899;
        }
        .header h1 {
            color: #ec4899;
            font-size: 28px;
            margin: 0;
        }
        .header p {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .report {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background-color: #fafafa;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        }
        .report-id {
            font-size: 12px;
            color: #6b7280;
        }
        .status-badges {
            display: flex;
            gap: 8px;
        }
        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-normal { background-color: #dbeafe; color: #1e40af; }
        .badge-urgent { background-color: #fee2e2; color: #dc2626; }
        .badge-high { background-color: #fed7aa; color: #ea580c; }
        .badge-completed { background-color: #dcfce7; color: #16a34a; }
        .badge-pending { background-color: #fef3c7; color: #d97706; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }
        .info-section {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .info-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 13px;
        }
        .info-label {
            font-weight: 500;
            color: #6b7280;
        }
        .info-value {
            color: #1f2937;
        }
        .summary-section {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 15px;
        }
        .summary-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }
        .summary-text {
            font-size: 13px;
            line-height: 1.5;
            color: #4b5563;
        }
        .findings-section, .recommendations-section {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 15px;
        }
        .findings-section h3, .recommendations-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }
        .findings-list, .recommendations-list {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .findings-list li, .recommendations-list li {
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
        }
        .findings-list li:before {
            content: "•";
            color: #ec4899;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .recommendations-list li:before {
            content: "•";
            color: #10b981;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .file-info {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 13px;
        }
        .file-info div {
            display: flex;
            justify-content: space-between;
        }
        .file-info-label {
            font-weight: 500;
            color: #6b7280;
        }
        .file-info-value {
            color: #1f2937;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .report { page-break-inside: avoid; margin-bottom: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CIRA AI Healthcare Platform</h1>
        <p>AI Nurse Reports - Generated on ${new Date().toLocaleDateString()}</p>
        <p>Total Reports: ${filteredReports.length}</p>
    </div>

    ${filteredReports.map(report => `
        <div class="report">
            <div class="report-header">
                <div>
                    <div class="report-title">${report.reportType}</div>
                    <div class="report-id">Report #${report.id}</div>
                </div>
                <div class="status-badges">
                    <span class="badge badge-${report.priority.toLowerCase()}">${report.priority}</span>
                    <span class="badge badge-${report.status.toLowerCase().replace(' ', '')}">${report.status}</span>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-section">
                    <h3>Patient Information</h3>
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${report.patient}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Generated:</span>
                        <span class="info-value">${report.generatedDate}</span>
                    </div>
                </div>
                <div class="info-section">
                    <h3>Doctor Information</h3>
                    <div class="info-row">
                        <span class="info-label">Doctor:</span>
                        <span class="info-value">${report.doctor}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Appointment:</span>
                        <span class="info-value">${report.appointmentDate}</span>
                    </div>
                </div>
            </div>

            <div class="summary-section">
                <h3>Summary</h3>
                <div class="summary-text">${report.summary}</div>
            </div>

            ${report.keyFindings ? `
                <div class="findings-section">
                    <h3>Key Findings</h3>
                    <ul class="findings-list">
                        ${report.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${report.recommendations ? `
                <div class="recommendations-section">
                    <h3>Recommendations</h3>
                    <ul class="recommendations-list">
                        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="file-info">
                <div>
                    <span class="file-info-label">File Size:</span>
                    <span class="file-info-value">${report.fileSize || 'N/A'}</span>
                </div>
                <div>
                    <span class="file-info-label">Downloads:</span>
                    <span class="file-info-value">${report.downloads || 0}</span>
                </div>
            </div>
        </div>
    `).join('')}

    <div class="footer">
        <p>© 2024 CIRA AI Healthcare Platform - Confidential Medical Report</p>
        <p>This report was generated automatically by our AI system</p>
    </div>
</body>
</html>`;

            // Create and download HTML file (can be printed as PDF)
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `ai-nurse-reports-${new Date().toISOString().split('T')[0]}.html`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast(`Successfully exported ${filteredReports.length} reports as PDF-ready HTML`, 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showToast('Failed to export reports. Please try again.', 'error');
        }
    };

    

    // Sample AI Nurse reports data
    const reports = [
        {
            id: 1,
            patient: 'John Doe',
            patientId: 'P-2024-001',
            age: 45,
            gender: 'Male',
            doctor: 'Dr. Sarah Johnson',
            reportType: 'AI Nurse Health Assessment',
            generatedDate: '2024-01-15',
            generatedTime: '10:30 AM',
            appointmentDate: '2024-01-15',
            status: 'Completed',
            priority: 'Normal',
            riskLevel: 'Low',
            summary: 'Patient shows signs of improved blood pressure management with current medication regimen.',
            aiInsights: 'AI analysis indicates stable cardiovascular health with positive response to current treatment plan.',
            confidence: 94,
            aiNurseVersion: 'v2.1',
            findings: [
                'Blood pressure readings within normal range',
                'Medication compliance: 95%',
                'Lifestyle modifications showing positive results',
                'Next follow-up recommended in 3 months'
            ],
            vitals: {
                bloodPressure: '120/80 mmHg',
                heartRate: '72 bpm',
                temperature: '98.6°F',
                oxygenSaturation: '98%'
            },
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
            patientId: 'P-2024-002',
            age: 38,
            gender: 'Female',
            doctor: 'Dr. Michael Chen',
            reportType: 'AI Nurse Risk Assessment',
            generatedDate: '2024-01-15',
            generatedTime: '02:15 PM',
            appointmentDate: '2024-01-15',
            status: 'Completed',
            priority: 'High',
            riskLevel: 'High',
            summary: 'High risk factors identified requiring immediate attention and lifestyle modifications.',
            aiInsights: 'AI analysis indicates elevated risk factors requiring immediate medical intervention and lifestyle changes.',
            confidence: 87,
            aiNurseVersion: 'v2.1',
            findings: [
                'Elevated cholesterol levels detected',
                'Family history of cardiovascular disease',
                'Sedentary lifestyle patterns observed',
                'Dietary habits need improvement'
            ],
            vitals: {
                bloodPressure: '135/88 mmHg',
                heartRate: '82 bpm',
                temperature: '98.4°F',
                oxygenSaturation: '96%'
            },
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
    const filteredReports = useMemo(() => reports.filter(report => {
        const matchesSearch = searchTerm === '' || 
            report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.summary.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDoctor = filterDoctor === '' || report.doctor === filterDoctor;
        const matchesDate = filterDate === '' || report.generatedDate.includes(filterDate);
        const matchesType = filterType === '' || report.reportType === filterType;
        
        return matchesSearch && matchesDoctor && matchesDate && matchesType;
    }), [reports, searchTerm, filterDoctor, filterDate, filterType]);

    const detailReport = useMemo(
        () => (reportIdParam ? reports.find(r => r.id === Number(reportIdParam)) : null),
        [reportIdParam, reports]
    );

    // Calculate statistics
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'Completed').length;
    const pendingReports = reports.filter(r => r.status === 'Pending Review').length;
    const urgentReports = reports.filter(r => r.priority === 'Urgent').length;

    const handleViewReport = (report) => {
        navigate(`/admin/reports/${report.id}`);
    };

    const handleDownloadReport = (report) => {
        try {
            // Create HTML content for PDF
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report.reportType} - ${report.patient}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ec4899;
        }
        .header h1 {
            color: #ec4899;
            font-size: 28px;
            margin: 0;
        }
        .header p {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .report-card {
            margin-bottom: 20px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background-color: #fafafa;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
        }
        .report-id {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
        }
        .status-badges {
            display: flex;
            gap: 10px;
        }
        .badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .badge-normal { background-color: #dbeafe; color: #1e40af; }
        .badge-urgent { background-color: #fee2e2; color: #dc2626; }
        .badge-high { background-color: #fed7aa; color: #ea580c; }
        .badge-completed { background-color: #dcfce7; color: #16a34a; }
        .badge-pending { background-color: #fef3c7; color: #d97706; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .info-section {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .info-section h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .info-label {
            font-weight: 500;
            color: #6b7280;
        }
        .info-value {
            color: #1f2937;
            font-weight: 600;
        }
        .content-section {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 20px;
        }
        .content-section h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #ec4899;
            padding-bottom: 8px;
        }
        .summary-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
        }
        .findings-list, .recommendations-list {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .findings-list li, .recommendations-list li {
            font-size: 14px;
            color: #4b5563;
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
            line-height: 1.5;
        }
        .findings-list li:before {
            content: "●";
            color: #ec4899;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        .recommendations-list li:before {
            content: "●";
            color: #10b981;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        .file-info {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            font-size: 14px;
        }
        .file-info div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .file-info-label {
            font-weight: 500;
            color: #6b7280;
        }
        .file-info-value {
            color: #1f2937;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .report-card { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CIRA AI Healthcare Platform</h1>
        <p>Medical Report - ${report.reportType}</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="report-card">
        <div class="report-header">
            <div>
                <div class="report-title">${report.reportType}</div>
                <div class="report-id">Report #${report.id}</div>
            </div>
            <div class="status-badges">
                <span class="badge badge-${report.priority.toLowerCase()}">${report.priority}</span>
                <span class="badge badge-${report.status.toLowerCase().replace(' ', '')}">${report.status}</span>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Patient Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${report.patient}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Generated:</span>
                    <span class="info-value">${report.generatedDate}</span>
                </div>
            </div>
            <div class="info-section">
                <h3>Doctor Information</h3>
                <div class="info-row">
                    <span class="info-label">Doctor:</span>
                    <span class="info-value">${report.doctor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Appointment:</span>
                    <span class="info-value">${report.appointmentDate}</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <h3>Summary</h3>
            <div class="summary-text">${report.summary}</div>
        </div>

        ${report.keyFindings ? `
            <div class="content-section">
                <h3>Key Findings</h3>
                <ul class="findings-list">
                    ${report.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${report.recommendations ? `
            <div class="content-section">
                <h3>Recommendations</h3>
                <ul class="recommendations-list">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="file-info">
            <div>
                <span class="file-info-label">File Size:</span>
                <span class="file-info-value">${report.fileSize || 'N/A'}</span>
            </div>
            <div>
                <span class="file-info-label">Downloads:</span>
                <span class="file-info-value">${report.downloads || 0}</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>© 2024 CIRA AI Healthcare Platform - Confidential Medical Report</p>
        <p>This report was generated automatically by our AI system</p>
        <p>Report ID: ${report.id} | Patient: ${report.patient} | Generated: ${report.generatedDate}</p>
    </div>
</body>
</html>`;

            // Create and download HTML file (can be printed as PDF)
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${report.reportType.toLowerCase().replace(/\s+/g, '-')}-${report.patient.replace(/\s+/g, '-')}-${report.generatedDate}.html`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast(`Report for ${report.patient} downloaded successfully as PDF-ready HTML`, 'success');
        } catch (error) {
            console.error('Download failed:', error);
            showToast('Failed to download report. Please try again.', 'error');
        }
    };

    useEffect(() => {
        if (reportIdParam && !detailReport) {
            navigate('/admin/reports');
        }
    }, [reportIdParam, detailReport, navigate]);

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
                        toast.type === 'success' 
                            ? 'bg-pink-50 border-pink-500 text-pink-800' 
                            : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                        <div className={`w-5 h-5 flex-shrink-0 ${
                            toast.type === 'success' ? 'text-pink-600' : 'text-red-600'
                        }`}>
                            {toast.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertTriangle className="w-5 h-5" />
                            )}
                        </div>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: '' })}
                            className={`ml-2 text-sm ${
                                toast.type === 'success' ? 'text-pink-600' : 'text-red-600'
                            } hover:opacity-70`}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            {!detailReport && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">AI Nurse Reports</h1>
                    <p className="text-sm sm:text-base text-gray-600">Central archive of AI-generated healthcare reports</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                        onClick={handleExportAll}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export All</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>
            )}

            {/* Main Content Area */}
            <div className="relative min-h-[600px]">
        {detailReport ? (
          <div className="space-y-6 mt-6">
            {/* Back Button and Title */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/admin/reports')}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-bold text-pink-600">View Page</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900">{detailReport.reportType}</h2>
                      <span className="text-sm text-gray-500">#{detailReport.id}</span>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(detailReport.priority)}`}>
                        {detailReport.priority}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(detailReport.status)}`}>
                        {detailReport.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Generated on {detailReport.generatedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadReport(detailReport)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 shadow-lg shadow-pink-200/60"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      Patient Information
                    </h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-600">Name:</span> {detailReport.patient}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        <span className="font-medium text-gray-600">Generated:</span> {detailReport.generatedDate}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-gray-500" />
                      Doctor Information
                    </h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-600">Doctor:</span> {detailReport.doctor}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>
                        <span className="font-medium text-gray-600">Appointment:</span> {detailReport.appointmentDate}
                      </span>
                    </p>
                  </div>
                </div>

                {detailReport.summary && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{detailReport.summary}</p>
                  </div>
                )}

                {detailReport.keyFindings && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                    <ul className="space-y-2 text-gray-700">
                      {detailReport.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailReport.recommendations && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <ul className="space-y-2 text-gray-700">
                      {detailReport.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-600">File Size:</span> {detailReport.fileSize || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Downloads:</span> {detailReport.downloadCount || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
                <div className="space-y-6">
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

            <Card className="p-4">
                <div className="space-y-3 sm:space-y-4">
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

            <div className="space-y-4">
                {filteredReports.map((report) => (
                    <Card key={report.id} className="p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Section */}
                            <div className="flex-1 space-y-4">
                                {/* Header with AI Nurse Icon and Title */}
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <Bot className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {report.reportType || 'AI Nurse Report'}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                            <span>{report.patient || 'Unknown'}</span>
                                            {report.patientId && <span>• {report.patientId}</span>}
                                            {(report.age || report.gender) && (
                                                <span>• {report.age || ''} {report.age && report.gender ? 'years,' : ''} {report.gender || ''}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                                        {getPriorityIcon(report.priority)}
                                        <span className="ml-1">{report.priority}</span>
                                    </span>
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                    {report.riskLevel && (
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                                            report.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                            report.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {report.riskLevel} Risk
                                        </span>
                                    )}
                                </div>

                                {/* AI Insight Section */}
                                {report.aiInsights && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                        <div className="flex items-start gap-2">
                                            <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-semibold text-blue-900 mb-1">AI Insight</h4>
                                                <p className="text-sm text-blue-800">{report.aiInsights}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Key Findings */}
                                {report.findings && report.findings.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Findings:</h4>
                                        <ul className="space-y-1.5">
                                            {report.findings.slice(0, 2).map((finding, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                                    <span>{finding}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Vitals */}
                                {report.vitals && (
                                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                        {report.vitals.bloodPressure && (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Heart className="w-4 h-4 text-red-500" />
                                                <span className="text-gray-700">{report.vitals.bloodPressure}</span>
                                            </div>
                                        )}
                                        {report.vitals.heartRate && (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Activity className="w-4 h-4 text-blue-500" />
                                                <span className="text-gray-700">{report.vitals.heartRate}</span>
                                            </div>
                                        )}
                                        {report.vitals.temperature && (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                                <span className="text-gray-700">{report.vitals.temperature}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Section - Metadata and Actions */}
                            <div className="lg:w-64 flex flex-col gap-4 lg:border-l lg:pl-6">
                                {/* AI Confidence */}
                                {report.confidence && (
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-600">AI Confidence</span>
                                            <span className="text-xs font-bold text-gray-900">{report.confidence}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                                style={{ width: `${report.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Metadata Row */}
                                <div className="space-y-2 text-xs text-gray-600">
                                    {(report.generatedDate || report.generatedTime) && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{report.generatedDate} {report.generatedTime || ''}</span>
                                        </div>
                                    )}
                                    {report.aiNurseVersion && (
                                        <div className="flex items-center gap-1">
                                            <Bot className="w-3.5 h-3.5" />
                                            <span>AI {report.aiNurseVersion}</span>
                                        </div>
                                    )}
                                    {report.fileSize && (
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>{report.fileSize}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => handleViewReport(report)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        title="View Report"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownloadReport(report)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        title="Download Report"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

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
                        : 'No AI reports have been generated yet.'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
                                    </div>
                                )}
                                    </div>
        </div>
    );
};

export default Reports;

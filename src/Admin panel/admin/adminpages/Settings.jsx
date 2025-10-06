import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Save, Users, FileText, CreditCard, Key, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../admincomponents/Card';

const Settings = () => {
    const [isContentLoading, setIsContentLoading] = useState(false);

    const handleRefreshContent = () => {
        setIsContentLoading(true);
        setTimeout(() => {
            setIsContentLoading(false);
        }, 1500);
    };

    // Auto-trigger loader on component mount
    useEffect(() => {
        setIsContentLoading(true);
        setTimeout(() => {
            setIsContentLoading(false);
        }, 2000);
    }, []);

    const [settings, setSettings] = useState({
        roles: {
            adminPermissions: true,
            doctorPermissions: true,
            patientPermissions: true,
            customRoles: false,
        },
        policies: {
            dataRetention: '2years',
            privacyPolicy: 'v2.1',
            termsOfService: 'v1.8',
            cookiePolicy: 'v1.3',
        },
        apiKeys: {
            airDoctorApi: 'ak_********************',
            doctorOnCallApi: 'doc_********************',
            healthCareConnectApi: 'hcc_********************',
            mediLinkApi: 'ml_********************',
        },
        security: {
            twoFactorAuth: true,
            sessionTimeout: '8hours',
            passwordPolicy: 'strong',
            ipWhitelist: false,
        },
        integrations: {
            emailProvider: 'sendgrid',
            smsProvider: 'twilio',
            paymentGateway: 'stripe',
            analyticsProvider: 'google',
        }
    });

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSave = () => {
        // Save settings logic here
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage platform-level settings and configurations</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefreshContent}
                        className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                    >
                        Refresh
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                {/* Content Loader */}
                {isContentLoading && (
                    <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                            <p className="text-gray-600 font-medium">Loading content...</p>
                        </div>
                    </div>
                )}
                
                <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {/* Settings Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roles & Permissions */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-pink-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Roles & Permissions</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(settings.roles).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {key === 'adminPermissions' && 'Admin Permissions'}
                                        {key === 'doctorPermissions' && 'Doctor Permissions'}
                                        {key === 'patientPermissions' && 'Patient Permissions'}
                                        {key === 'customRoles' && 'Custom Roles'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {key === 'adminPermissions' && 'Full platform access and management'}
                                        {key === 'doctorPermissions' && 'Doctor-specific features and data access'}
                                        {key === 'patientPermissions' && 'Patient portal and appointment access'}
                                        {key === 'customRoles' && 'Enable custom role creation and management'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handleSettingChange('roles', key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Policies */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Policies</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
                            <select
                                value={settings.policies.dataRetention}
                                onChange={(e) => handleSettingChange('policies', 'dataRetention', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="1year">1 Year</option>
                                <option value="2years">2 Years</option>
                                <option value="5years">5 Years</option>
                                <option value="indefinite">Indefinite</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Privacy Policy</p>
                                    <p className="text-sm text-gray-600">Current version: {settings.policies.privacyPolicy}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Update</button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Terms of Service</p>
                                    <p className="text-sm text-gray-600">Current version: {settings.policies.termsOfService}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Update</button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Cookie Policy</p>
                                    <p className="text-sm text-gray-600">Current version: {settings.policies.cookiePolicy}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Update</button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* API Keys */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(settings.apiKeys).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {key.replace('Api', ' API Key')}
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="password"
                                        value={value}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-mono"
                                    />
                                    <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Security */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-600">Require 2FA for admin access</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.security.twoFactorAuth}
                                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                            <select
                                value={settings.security.sessionTimeout}
                                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="2hours">2 Hours</option>
                                <option value="4hours">4 Hours</option>
                                <option value="8hours">8 Hours</option>
                                <option value="24hours">24 Hours</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                            <select
                                value={settings.security.passwordPolicy}
                                onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="basic">Basic (8 characters)</option>
                                <option value="medium">Medium (12 characters + numbers)</option>
                                <option value="strong">Strong (12+ characters + symbols)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">IP Whitelist</p>
                                <p className="text-sm text-gray-600">Restrict admin access to specific IPs</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.security.ipWhitelist}
                                    onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Integrations */}
                <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Provider Integrations</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(settings.integrations).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {key.replace('Provider', ' Provider')}
                                </label>
                                <select
                                    value={value}
                                    onChange={(e) => handleSettingChange('integrations', key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {key === 'emailProvider' && (
                                        <>
                                            <option value="sendgrid">SendGrid</option>
                                            <option value="mailgun">Mailgun</option>
                                            <option value="ses">Amazon SES</option>
                                        </>
                                    )}
                                    {key === 'smsProvider' && (
                                        <>
                                            <option value="twilio">Twilio</option>
                                            <option value="aws">AWS SNS</option>
                                            <option value="messagebird">MessageBird</option>
                                        </>
                                    )}
                                    {key === 'paymentGateway' && (
                                        <>
                                            <option value="stripe">Stripe</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="square">Square</option>
                                        </>
                                    )}
                                    {key === 'analyticsProvider' && (
                                        <>
                                            <option value="google">Google Analytics</option>
                                            <option value="mixpanel">Mixpanel</option>
                                            <option value="amplitude">Amplitude</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        ))}
                    </div>
                </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

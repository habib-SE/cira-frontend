import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Users, Calendar, Brain } from 'lucide-react';
import logo from '../../assets/Logo.png';

const AdminLandingPage = () => {
    const navigate = useNavigate();
    const [counters, setCounters] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
        accuracy: 0
    });

    const handleStartJourney = () => {
        navigate('/admin/dashboard');
    };

    // Counter animation effect
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;

        const targets = { patients: 500, doctors: 50, appointments: 1000, accuracy: 99 };
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setCounters({
                patients: Math.floor(targets.patients * progress),
                doctors: Math.floor(targets.doctors * progress),
                appointments: Math.floor(targets.appointments * progress),
                accuracy: Math.floor(targets.accuracy * progress)
            });

            if (step >= steps) {
                clearInterval(timer);
                setCounters(targets);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            y: -5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div 
            className="h-screen flex flex-col items-center justify-center px-4 py-4 overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <motion.div 
                className="relative z-10 text-center max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo Section */}
                <motion.div className="mb-4" variants={itemVariants}>
                    <motion.div 
                        className="inline-flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <img 
                            src={logo} 
                            alt="Doctor AI Logo" 
                            className="w-20 h-20 object-contain"
                        />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Doctor AI
                    </h1>
                    <p className="text-lg text-gray-600 mb-1">
                        Advanced Healthcare Management
                    </p>
                    <p className="text-sm text-gray-500">
                        Intelligent patient care powered by artificial intelligence
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"
                    variants={containerVariants}
                >
                    <motion.div 
                        className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Users className="w-5 h-5 text-white" />
                        </motion.div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Patient Management</h3>
                        <p className="text-gray-600 text-xs">Comprehensive patient records and health monitoring</p>
                    </motion.div>

                    <motion.div 
                        className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Calendar className="w-5 h-5 text-white" />
                        </motion.div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Smart Scheduling</h3>
                        <p className="text-gray-600 text-xs">AI-powered appointment optimization and management</p>
                    </motion.div>

                    <motion.div 
                        className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <motion.div 
                            className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Brain className="w-5 h-5 text-white" />
                        </motion.div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">AI Diagnostics</h3>
                        <p className="text-gray-600 text-xs">Advanced AI analysis for accurate medical insights</p>
                    </motion.div>
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-100"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-center mb-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Activity className="w-6 h-6 text-pink-500 mr-2" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                    </div>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm">
                        Access the comprehensive Doctor AI admin panel to manage patients, appointments, 
                        AI reports, and healthcare analytics with intelligent insights.
                    </p>
                    <motion.button
                        onClick={handleStartJourney}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-base rounded-2xl hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 transform active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Journey
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.div>
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div 
                    className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
                    variants={containerVariants}
                >
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div 
                            className="text-2xl font-bold text-pink-500 mb-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {counters.patients}+
                        </motion.div>
                        <div className="text-xs text-gray-600">Patients</div>
                    </motion.div>
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div 
                            className="text-2xl font-bold text-pink-500 mb-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            {counters.doctors}+
                        </motion.div>
                        <div className="text-xs text-gray-600">Doctors</div>
                    </motion.div>
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div 
                            className="text-2xl font-bold text-pink-500 mb-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            {counters.appointments}+
                        </motion.div>
                        <div className="text-xs text-gray-600">Appointments</div>
                    </motion.div>
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div 
                            className="text-2xl font-bold text-pink-500 mb-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                        >
                            {counters.accuracy}%
                        </motion.div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminLandingPage;

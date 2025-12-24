import { motion } from 'framer-motion';
import { 
  Bot,
  FileBarChart, 
  Stethoscope, 
  Database, 
  Wallet, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function BigFeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const supportingFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Nurse Conversations",
      description: "Get instant, personalized health guidance through natural conversations.",
      value: "24/7 health support",
    },
    {
      icon: <FileBarChart className="w-6 h-6" />,
      title: "Smart AI Health Reports",
      description: "Automatically generated reports with conditions and recommendations.",
      value: "Clear insights",
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Doctor Consultations",
      description: "Book online or offline consultations with verified doctors.",
      value: "Expert care when needed",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Secure Health History",
      description: "Access, download, and manage your reports anytime.",
      value: "Your data, always",
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Flexible Payments & Plans",
      description: "Secure payments, subscriptions, and pay-per-use options.",
      value: "Choose your plan",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Privacy & Compliance",
      description: "Built with HIPAA & GDPR standards to keep your data safe.",
      value: "Enterprise-grade security",
    },
  ];

  return (
    <motion.section
      className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden  md:mb-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background Gradient */}
      <div className="absolute " />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-gray-950 leading-tight mb-4">
            Not Just <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent font-serif bg-clip-text">an AI Nurse</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-tight mb-8 md:mb-10">
            From AI health guidance to expert doctor consultations all in one place.
          </p>
        </motion.div>

        {/* All Supporting Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-10"
          variants={containerVariants}
        >
          {supportingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-pink-100/50 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Hover Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Value Badge */}
                  <div className="text-xs font-semibold text-pink-600 mb-1 uppercase tracking-wide">
                    {feature.value}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-950 mb-1">
                    {feature.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 leading-tight">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}


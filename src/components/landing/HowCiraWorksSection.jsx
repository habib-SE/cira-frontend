import { motion } from 'framer-motion';

export default function HowCiraWorksSection() {
  const steps = [
    {
      number: "01",
      description: "  Cira AI Nurse asks about your symptoms through natural conversation.",
      highlight: "asks about your symptoms",
    },
    {
      number: "02",
      description: "Gather comprehensive information including medical history, symptoms, and health data.",
      highlight: "Gather comprehensive information",
    },
    {
      number: "03",
      description: "Receive a detailed summary with patient info, measurements, top 3 conditions, confidence above 85%, and self-care tips.",
      highlight: "detailed summary",
    },
    {
      number: "04",
      description: "Download two reports: Doctor report (reduces inquiry time) and SOAP notes for medical documentation.",
      highlight: "two reports",
    },
   
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -30, y: 20 },
    show: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    show: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <motion.span 
          key={index} 
          className="text-pink-600 font-semibold inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ scale: 1.05 }}
        >
          {part}
        </motion.span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.section
      className="relative pb-16 md:pb-24 lg:pb-32 px-4 md:px-6 overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Background with animated gradient */}
      <div className="absolute " />
      
      <div className="max-w-5xl mx-auto relative z-10 px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-gray-950 leading-tight mb-4">
            How <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent font-serif bg-clip-text">Cira</span> Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get health insights in just a few simple steps
          </p>
        </motion.div>

        {/* Steps List */}
        <motion.div 
          className="flex flex-col gap-6 md:gap-8"
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="flex gap-4 md:gap-6 items-center group"
              whileHover={{ x: 5, scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <motion.div
                  className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text leading-none"
                  variants={numberVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <motion.span
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                  >
                    {step.number}
                  </motion.span>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div 
                className="flex-1 min-w-0"
                variants={textVariants}
              >
                <motion.p 
                  className="text-base md:text-lg text-gray-700 leading-tight"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                >
                  {highlightText(step.description, step.highlight)}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

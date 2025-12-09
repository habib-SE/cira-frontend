import { motion } from "framer-motion";
import { Globe, Languages, RefreshCcw, ChevronRight } from "lucide-react";
import Flag from "react-world-flags";
// ⬇️ import your globe image here (update the path/filename as needed)
import GlobeImage from "../../assets/earth.png";

const GlobalVoiceSection = () => {
  const languages = [
    { name: "English", code: "GB" },
    { name: "French", code: "FR" },
    { name: "German", code: "DE" },
    { name: "Hindi", code: "IN" },
    { name: "Spanish", code: "ES" },
  ];

  const floatingLanguages = [
    { name: "French", code: "FR" },
    { name: "Spanish", code: "ES" },
    { name: "Chinese", code: "CN" },
    { name: "English", code: "GB" },
  ];

  const features = [
    {
      icon: <Languages className="w-5 h-5" />,
      title: "Automatic Language Detection",
      desc: "Cira understands and detects your language instantly — no setup needed.",
    },
    {
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Live Language Switching",
      desc: "Switch languages naturally in the same conversation.",
    },
  ];

 return (
  <motion.section
    className="relative overflow-hidden py-16"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* -------- HEADER -------- */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
          <Globe className="w-4 h-4" />
          Global & Human by Design
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug">
          Speak in your language.
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Cira will understand.
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Cira connects with you across languages — naturally, privately, and safely.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* -------- LEFT CONTENT -------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-md flex gap-4 border border-pink-100"
            >
              <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* LANG TAGS WITH FLAGS */}
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-gray-700 text-sm font-medium"
              >
                <Flag code={lang.code} className="w-5 h-3 rounded-sm object-cover" />
                {lang.name}
              </div>
            ))}
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
              +27 more
            </span>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg font-semibold"
          >
            Try Cira Now
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* -------- RIGHT VISUAL / GLOBE IMAGE -------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative flex justify-center items-center"
        >
          {/* Smooth floating container */}
          <motion.div
            className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <motion.img
              src={GlobeImage}
              alt="Global voice assistant coverage"
              className="w-full h-full rounded-full object-cover"
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* FLOATING LANGUAGE FLAGS */}
          {floatingLanguages.map((lang, i) => (
            <motion.div
              key={lang.name}
              className="absolute bg-white flex items-center gap-1 text-gray-700 text-xs px-2 py-1 rounded-full shadow-md"
              style={{
                top: `${20 + i * 15}%`,
                left: i % 2 ? "70%" : "10%",
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Flag code={lang.code} className="w-4 h-3 object-cover rounded-sm" />
              <span>{lang.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </motion.section>
);

};

export default GlobalVoiceSection;

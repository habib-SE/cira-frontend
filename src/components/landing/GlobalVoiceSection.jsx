import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Languages, RefreshCcw, ChevronRight, X, Search } from "lucide-react";
import Flag from "react-world-flags";
// ⬇️ import your globe image here (update the path/filename as needed)
import GlobeImage from "../../assets/earth.png";

// Separate Modal Component
const LanguagesModal = ({ isOpen, onClose, searchQuery, setSearchQuery, allLanguages }) => {
  const filteredLanguages = allLanguages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-8 border-b border-pink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-pink-600" />
                    </div>
                    <h2 className="text-3xl font-serif font-normal text-gray-900">
                      Global Language Support
                    </h2>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    Cira understands and responds naturally in over {allLanguages.length} languages. 
                    Switch between them seamlessly in any conversation.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center hover:bg-pink-200 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-pink-50">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-pink-50 border border-pink-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Showing {filteredLanguages.length} of {allLanguages.length} languages
                </p>
              </div>

              {/* Language Grid */}
              <div className="p-6 overflow-y-auto flex-grow">
                {filteredLanguages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredLanguages.map((lang) => (
                      <motion.div
                        key={`${lang.code}-${lang.name}`}
                        className="flex flex-col items-center p-5 bg-white rounded-2xl border border-pink-50 hover:border-pink-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        whileHover={{ y: -8, scale: 1.05 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-16 h-12 mb-3 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                          <Flag 
                            code={lang.code} 
                            className="w-full h-full object-cover"
                            fallback={<div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-600">🌐</div>}
                          />
                        </div>
                        <span className="font-semibold text-gray-800 text-center group-hover:text-pink-600 transition-colors">
                          {lang.name}
                        </span>
                        <div className="mt-2 w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                      <Search className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No languages found</h3>
                    <p className="text-gray-600">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-700 font-medium">
                      Don't see your language?
                    </p>
                    <p className="text-gray-600 text-sm">
                      We're constantly expanding our language support.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow"
                  >
                    Request a Language
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Component
const GlobalVoiceSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const languages = [
    { name: "English", code: "GB" },
    { name: "French", code: "FR" },
    { name: "German", code: "DE" },
    { name: "Hindi", code: "IN" },
    { name: "Spanish", code: "ES" },
  ];

  const allLanguages = [
    { name: "English", code: "GB" },
    { name: "French", code: "FR" },
    { name: "German", code: "DE" },
    { name: "Hindi", code: "IN" },
    { name: "Spanish", code: "ES" },
    { name: "Chinese", code: "CN" },
    { name: "Arabic", code: "SA" },
    { name: "Portuguese", code: "PT" },
    { name: "Russian", code: "RU" },
    { name: "Japanese", code: "JP" },
    { name: "Italian", code: "IT" },
    { name: "Korean", code: "KR" },
    { name: "Dutch", code: "NL" },
    { name: "Turkish", code: "TR" },
    { name: "Polish", code: "PL" },
    { name: "Thai", code: "TH" },
    { name: "Swedish", code: "SE" },
    { name: "Danish", code: "DK" },
    { name: "Norwegian", code: "NO" },
    { name: "Finnish", code: "FI" },
    { name: "Greek", code: "GR" },
    { name: "Czech", code: "CZ" },
    { name: "Romanian", code: "RO" },
    { name: "Hungarian", code: "HU" },
    { name: "Hebrew", code: "IL" },
    { name: "Malay", code: "MY" },
    { name: "Vietnamese", code: "VN" },
    { name: "Indonesian", code: "ID" },
    { name: "Ukrainian", code: "UA" },
    { name: "Bengali", code: "BD" },
    { name: "Punjabi", code: "IN" },
    { name: "Tagalog", code: "PH" },
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery(""); // Reset search when closing modal
  };

  return (
    <>
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
            <div className="inline-flex font-serif items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
              <Globe className="w-4 h-4" />
              Global & Human by Design
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-normal text-gray-900 leading-snug">
              Speak in your language.
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent font-serif bg-clip-text">
                Cira will understand.
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Cira connects with you across languages — naturally, privately, and safely.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-14 items-center md:pl-10">
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
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-gray-700 text-sm font-medium"
                  >
                    <Flag code={lang.code} className="w-5 h-3 rounded-sm object-cover" />
                    {lang.name}
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-semibold hover:from-pink-200 hover:to-purple-200 transition-all cursor-pointer shadow-sm"
                >
                  +{allLanguages.length - 5} more
                </motion.button>
              </div>

              {/* CTA */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg font-semibold"
              >
                Try Cira Now
                <ChevronRight className="w-4 h-4" />
              </motion.button> */}
            </motion.div>

            {/* -------- RIGHT VISUAL / GLOBE IMAGE -------- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative flex justify-center items-center md:pl-9"
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

      {/* Render the Modal as a separate component */}
      <LanguagesModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allLanguages={allLanguages}
      />
    </>
  );
};

export default GlobalVoiceSection;
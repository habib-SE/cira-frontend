import React from "react";

export default function TrustedSection() {
  return (
    <section className="w-full bg-white pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Trusted By Text */}
        <p className="text-gray-400 text-lg mb-12">
          Trusted by the top companies in the world
        </p>

        {/* Company Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {/* Evernote Logo */}
          <div className="flex items-center justify-center w-24 h-12 opacity-60 hover:opacity-80 transition-opacity">
            <img 
              src="/src/assets/Evernote_logo.png" 
              alt="Evernote" 
              className="h-8 w-auto object-contain filter grayscale"
            />
          </div>

          {/* Amazon Logo */}
          <div className="flex items-center justify-center w-24 h-12 opacity-60 hover:opacity-80 transition-opacity">
            <img 
              src="/src/assets/Amazon_logo.webp" 
              alt="Amazon" 
              className="h-8 w-auto object-contain filter grayscale"
            />
          </div>

          {/* Airtable Logo */}
          <div className="flex items-center justify-center w-24 h-12 opacity-60 hover:opacity-80 transition-opacity">
            <img 
              src="/src/assets/Airtable_logo.webp" 
              alt="Airtable" 
              className="h-52 w-auto object-contain filter grayscale"
            />
          </div>

          {/* Gumroad Logo */}
          <div className="flex items-center justify-center w-24 h-12 opacity-60 hover:opacity-80 transition-opacity">
            <img 
              src="/src/assets/Evernote_logo.png" 
              alt="Gumroad" 
              className="h-8 w-auto object-contain filter grayscale"
            />
          </div>

          {/* Notion Logo */}
          <div className="flex items-center justify-center w-24 h-12 opacity-60 hover:opacity-80 transition-opacity">
            <img 
              src="/src/assets/Notion_logo.webp" 
              alt="Notion" 
              className="h-52 w-auto object-contain filter grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

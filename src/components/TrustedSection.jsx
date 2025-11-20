import React from "react";
import EvernoteLogo from "../assets/Evernote_logo.png";
import AmazonLogo from "../assets/Amazon_logo.webp";
import AirtableLogo from "../assets/Airtable_logo.webp";
import GumroadLogo from "../assets/Gumrad_logo.png";
import NotionLogo from "../assets/Notion_logo.webp";

export default function TrustedSection() {
  const logos = [
    { src: EvernoteLogo, alt: "Evernote", className: "w-24" },
    { src: AmazonLogo, alt: "Amazon", className: "w-24" },
    { src: AirtableLogo, alt: "Airtable", className: "w-32" },
    { src: GumroadLogo, alt: "Gumroad", className: "w-20" },
    { src: NotionLogo, alt: "Notion", className: "w-20" },
  ];

  return (
    <section className="w-full bg-white pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-400 text-lg mb-12">
          Trusted by the top companies in the world
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-28 h-12 opacity-60 hover:opacity-80 transition-opacity"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.className} object-contain filter grayscale`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

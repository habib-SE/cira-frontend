import React from "react";
import { Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
        {/* Products Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-500 font-semibold">Products</h3>
          <a href="/#about-zofy" className="text-black hover:underline">About Zofy</a>
          <a href="/#integrations" className="text-black hover:underline">Integrations</a>
          <a href="/cms/blog" className="text-black hover:underline">Blog</a>
        </div>

        {/* Company Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-500 font-semibold">Company</h3>
          <a href="/company" className="text-black hover:underline">About Us</a>
          <a href="/careers" className="text-black hover:underline">Career</a>
          <a href="/contact-us" className="text-black hover:underline">Contact</a>
        </div>
        {/* Connect Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-500 font-semibold">Connect</h3>
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-black" />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-black" />
            <span>Linkedin</span>
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-black" />
            <span>Youtube</span>
          </div>
        </div>

        {/* Legal Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-500 font-semibold">Legal</h3>
          <a href="/privacy-policy" className="text-black hover:underline">Privacy Policy</a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
        <a href="/privacy-policy">
          © 2024 Zofy AI, d.o.o / Privacy Policy
        </a>
      </div>
    </footer>
  );
}

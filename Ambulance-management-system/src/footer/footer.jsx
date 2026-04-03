import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Hyper Ambulance</h3>
            <p className="text-neutral-400 text-sm mt-1">
              Your safety, our priority. Available 24/7.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-6">
          <p className="text-neutral-500 text-xs text-center">
            &copy; {new Date().getFullYear()} Hyper Ambulance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

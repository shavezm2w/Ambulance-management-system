import React from "react";

export function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="loader-spinner mb-4"></div>
      <p className="text-sm text-neutral-500 font-medium tracking-wide">{message}</p>
    </div>
  );
}

export function ButtonLoader() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="loader-btn-spinner"></span>
      Processing...
    </span>
  );
}

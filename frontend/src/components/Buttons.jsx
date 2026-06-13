import React from 'react';

export const GhostButton = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`rounded-full bg-transparent border border-storm-gray px-6 py-3 font-['Inter'] text-[16px] font-medium text-bone-white transition-all duration-300 hover:border-iris hover:shadow-[0_0_12px_rgba(175,80,255,0.4)] ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const FilledPillButton = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`rounded-full bg-void border border-bone-white px-5 py-2 font-['Inter'] text-[16px] font-semibold text-bone-white transition-all duration-300 hover:shadow-[0_0_12px_rgba(175,80,255,0.4)] hover:border-iris ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const IrisAccentButton = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`rounded-full bg-iris border-none px-7 py-3 font-['Inter'] text-[16px] font-semibold text-void transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_12px_rgba(175,80,255,0.4)] ${className}`}
    {...props}
  >
    {children}
  </button>
);

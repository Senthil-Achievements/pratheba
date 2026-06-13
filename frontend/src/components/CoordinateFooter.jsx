import React from 'react';
import { Link } from 'react-router-dom';

const CoordinateFooter = () => {
  return (
    <>
      <div className="h-[36px]"></div>
      <footer className="fixed bottom-0 left-0 w-full h-[36px] bg-[#090909] border-t border-[#333333] px-[40px] flex justify-between items-center z-[50]">
        <Link className="font-sans text-[12px] font-[400] text-[#6b6b6b] hover:text-[#f7f9fa] transition-colors" to="/upload">
          + Analyze Direct — ATS Resume Checker
        </Link>
        <span className="font-sans text-[12px] font-[400] text-[#6b6b6b]">
          28.6139° N, 77.2090° E ♥
        </span>
      </footer>
    </>
  );
};

export default CoordinateFooter;

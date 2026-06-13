import React, { useEffect, useState } from 'react';

const ProgressBar = ({ label, percentage }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Small delay to trigger transition on mount
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex items-center gap-[16px] w-full">
      <div className="w-[140px] flex-shrink-0">
        <span className="font-['Inter'] text-[14px] font-normal text-ash">{label}</span>
      </div>
      <div className="flex-grow h-[6px] bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${width}%`,
            background: 'linear-gradient(90deg, #7f56d9, #af50ff)'
          }}
        />
      </div>
      <div className="w-[40px] flex-shrink-0 text-right">
        <span className="font-['JetBrains_Mono'] text-[14px] text-slate">{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;

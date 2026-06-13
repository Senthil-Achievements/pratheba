import React, { useEffect, useState } from 'react';

const ScoreRing = ({ score = 0 }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Count up animation
    let start = 0;
    const duration = 1500; // 1.5s
    const increment = score / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let strokeColor = '#10b981'; // Green 90-100%
  if (score < 41) strokeColor = '#ef4444'; // Red 0-40%
  else if (score < 71) strokeColor = '#f59e0b'; // Amber 41-70%
  else if (score < 90) strokeColor = '#7f56d9'; // Plum 71-89%

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        {/* Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={strokeColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
      </svg>
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span className="font-['Inter'] text-[48px] font-bold text-bone-white leading-none tracking-tight">
            {currentScore}
          </span>
          <span className="font-['Inter'] text-[14px] font-normal text-slate ml-1">%</span>
        </div>
        <span className="font-['Inter'] text-[14px] font-normal text-slate mt-1">Match</span>
      </div>
    </div>
  );
};

export default ScoreRing;

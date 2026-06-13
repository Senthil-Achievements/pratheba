import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Lightbulb } from 'lucide-react';

const SuggestionCard = ({ title, type, excerpt, fullText, codeExample }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = type === 'missing' ? Sparkles : Lightbulb;

  return (
    <div 
      className="bg-white/5 border border-graphite rounded-[19.2px] p-[24px] cursor-pointer transition-colors hover:border-graphite/80 relative overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-[24px] bottom-[24px] w-[3px] bg-iris rounded-r-[2px]" />

      <div className="flex items-start justify-between pl-[12px]">
        <div className="flex items-start gap-[12px] flex-grow pr-[16px]">
          <Icon className="w-[20px] h-[20px] text-iris stroke-[1.5px] flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h4 className="font-['Inter'] text-[16px] font-semibold text-bone-white">{title}</h4>
            <AnimatePresence initial={false}>
              {!isExpanded && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-['Inter'] text-[14px] text-slate leading-[1.6] mt-[8px] line-clamp-2"
                >
                  {excerpt}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="font-['Inter'] text-[14px] text-slate leading-[1.6] mt-[8px]">
                    {fullText}
                  </p>

                  {codeExample && (
                    <div className="mt-[16px] bg-iris/10 border border-iris/20 rounded-[8px] p-[12px] px-[16px]">
                      {codeExample.map((line, idx) => (
                        <div key={idx} className="font-['JetBrains_Mono'] text-[13px] leading-[1.6] flex gap-2">
                          <span className={line.startsWith('✗') ? 'text-[#ef4444]' : line.startsWith('✓') ? 'text-[#10b981]' : 'text-slate'}>
                            {line.charAt(0)}
                          </span>
                          <span className="text-bone-white">{line.slice(1)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-shrink-0 mt-1">
          <ChevronDown 
            className={`w-[20px] h-[20px] text-iris transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
          {!isExpanded && (
            <span className="font-['JetBrains_Mono'] text-[12px] text-iris mt-2">Expand ↓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;

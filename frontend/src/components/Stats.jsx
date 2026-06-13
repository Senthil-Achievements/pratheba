import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

const Stats = () => {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Section fade in
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    );

    // Numbers count up
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const items = sectionRef.current.querySelectorAll('.stat-num');
        items.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const obj = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate() {
              const v = obj.val;
              const formatted = isDecimal ? v.toFixed(1) : Math.round(v);
              el.textContent = `${formatted}${suffix}`;
            },
          });
        });
      },
    });

    return () => st.kill();
  }, []);

  const stats = [
    { target: 98, suffix: '%', label: 'ATS PASS RATE' },
    { target: 2.4, suffix: 's', label: 'AVERAGE ANALYSIS TIME' },
    { target: 50, suffix: 'K+', label: 'RESUMES ANALYZED' },
    { target: 8.3, suffix: '/10', label: 'AVERAGE SCORE IMPROVEMENT' },
  ];

  return (
    <section
      ref={sectionRef}
      className="stats-section"
      style={{
        width: '100%',
        paddingTop: '120px',
        paddingBottom: '120px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'radial-gradient(ellipse at center, rgba(108,75,214,0.12) 0%, transparent 65%)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                textAlign: 'center',
                padding: '40px 24px',
                borderRight: idx !== stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div
                className="stat-num"
                data-target={stat.target}
                data-suffix={stat.suffix}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#f7f9fa',
                }}
              >
                0
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '0.10em',
                  color: '#6b6b6b',
                  textTransform: 'uppercase',
                  marginTop: '8px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-section .container > div { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-section .container > div > div { border-right: none !important; }
        }
      `}</style>
    </section>
  );
};

export default Stats;

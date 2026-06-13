import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SplitType from 'split-type';
import { gsap, ScrollTrigger } from '../lib/gsap';
import Antigravity from './Antigravity';

const Hero = () => {
  const particleColor = '#af50ff';
  useEffect(() => {
    // 1. Label badge
    gsap.fromTo('.hero-label',
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: 0.3 }
    );

    // 2. Headline — SplitType on the wrapper
    const split = new SplitType('.hero-headline', { types: 'chars' });
    gsap.fromTo(split.chars,
      { opacity: 0, y: 80, rotateX: -90 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.7,
        ease: 'power4.out',
        stagger: { amount: 0.6 },
        delay: 0.5,
      }
    );

    // 3. Subheadline
    gsap.fromTo('.hero-sub',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.0 }
    );

    // 4. CTA buttons stagger
    gsap.fromTo('.hero-cta-btn',
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: 'power3.out',
        stagger: 0.12, delay: 1.2,
      }
    );

    // 5. Scroll indicator
    gsap.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 1.6 }
    );
    gsap.to('.scroll-dot', {
      y: 40, duration: 1.2, ease: 'power1.inOut', repeat: -1, yoyo: true,
    });

    // 6. Radial glow parallax on scroll
    gsap.to('.hero-glow', {
      y: -120,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // 7. Hero content fades on exit
    gsap.to('.hero-content', {
      opacity: 0,
      y: -60,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'center top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#090909',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '72px', /* below navbar */
      }}
    >
      {/* Radial glow */}
      <div
        className="hero-glow"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(108,75,214,0.20) 0%, transparent 70%)',
        }}
      />

      {/* Antigravity Canvas — contained to hero only */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Antigravity
          count={250}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.2}
          lerpSpeed={0.05}
          color={particleColor}
          autoAnimate={true}
          particleVariance={1}
          rotationSpeed={0.05}
          depthFactor={0.8}
          pulseSpeed={2}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      {/* Text Content */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        {/* Label badge */}
        <div
          className="hero-label"
          style={{
            display: 'inline-flex',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.20em',
            color: '#af50ff',
            textTransform: 'uppercase',
            border: '1px solid rgba(175,80,255,0.3)',
            borderRadius: '9999px',
            padding: '6px 16px',
            background: 'rgba(175,80,255,0.06)',
            marginBottom: '24px',
          }}
        >
          ATS RESUME CHECKER
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 300,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#f7f9fa',
            }}
          >
            Is your resume
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#f7f9fa',
            }}
          >
            ATS-Ready?
          </span>
        </h1>

        {/* Sub */}
        <p
          className="hero-sub"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(15px, 1.2vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'rgba(247,249,250,0.65)',
            maxWidth: '540px',
            marginTop: '32px',
            textAlign: 'center',
          }}
        >
          Upload your resume, paste the job description, and get an instant ATS score
          with AI-powered suggestions that tell you exactly what to fix.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px',
          }}
        >
          <Link to="/upload" className="hero-cta-btn btn-pill btn-iris">
            CHECK MY RESUME →
          </Link>
          <a href="#how-it-works" className="hero-cta-btn btn-pill btn-ghost">
            SEE HOW IT WORKS
          </a>
        </div>

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator"
          style={{
            marginTop: '64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '48px',
              background: '#475467',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              className="scroll-dot"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1px',
                height: '8px',
                background: '#af50ff',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.20em',
              color: '#6b6b6b',
              textTransform: 'uppercase',
            }}
          >
            SCROLL
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

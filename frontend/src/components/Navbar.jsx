import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gsap, ScrollTrigger } from '../lib/gsap';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  }, []);

  const scrollToSection = (id) => {
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(id);
      if (el) {
        const navHeight = 72;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(top, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 100);
      }
    };
    tryScroll();
  };

  const scrollToTop = () => {
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(0, {
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    if (link.isRoute) {
      navigate(link.target);
      return;
    }
    if (link.target === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToTop(), 400);
      } else {
        scrollToTop();
      }
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(link.target), 400);
    } else {
      scrollToSection(link.target);
    }
  };

  const navLinks = [
    { label: 'HOME',          target: 'home'          },
    { label: 'HOW IT WORKS',  target: 'how-it-works'  },
    { label: 'FEATURES',      target: 'features'      },
    { label: 'TIPS',          target: '/tips', isRoute: true },
  ];

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (error) { console.error('Failed to log out', error); }
  };

  return (
    <nav ref={navRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, height: '72px', display: 'flex', alignItems: 'center', background: 'rgba(9,9,9,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ width: '100%', maxWidth: '1280px', height: '100%', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
        <div
          className="navbar-logo"
          onClick={() => handleNavClick(
            { preventDefault: () => {} },
            { label: 'HOME', target: 'home' }
          )}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '0.04em', color: '#f7f9fa', textDecoration: 'none', flexShrink: 0, cursor: 'pointer' }}
        >
          RESUMESCAN
        </div>

        <div className="nav-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '36px' }}>
          {navLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.isRoute ? link.target : `#${link.target}`} 
              onClick={(e) => handleNavClick(e, link)} 
              style={navLinkStyle} 
              onMouseEnter={(e)=>e.currentTarget.style.color='#af50ff'} 
              onMouseLeave={(e)=>e.currentTarget.style.color='#f7f9fa'}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {currentUser ? (
            <>
              <span style={{ background: 'rgba(175,80,255,0.08)', border: '1px solid rgba(175,80,255,0.25)', borderRadius: '9999px', padding: '6px 14px', fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 500, color: '#af50ff', maxWidth: '200px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.email}</span>
              <button onClick={handleLogout} className="btn-pill-sm btn-ghost" style={{ padding: '8px 18px', fontSize: '13px', minHeight: '36px' }}>LOG OUT</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-pill-sm btn-ghost" style={{ padding: '10px 22px', fontSize: '14px', fontWeight: 500, minHeight: '40px' }}>LOG IN</Link>
              <Link to="/upload" className="btn-pill-sm btn-iris" style={{ padding: '10px 22px', fontSize: '14px', minHeight: '40px' }}>GET STARTED →</Link>
            </>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .nav-center { display: none !important; } }`}</style>
    </nav>
  );
};

const navLinkStyle = { fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#f7f9fa', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease' };

export default Navbar;

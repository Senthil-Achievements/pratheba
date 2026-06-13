import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CoordinateFooter from './components/CoordinateFooter';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import TipsPage from './pages/TipsPage';
import LoginPage from './pages/LoginPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { initLenis } from './lib/lenis';
import { gsap, ScrollTrigger } from './lib/gsap';

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => ScrollTrigger.refresh(), 500);
  }, [location.pathname]);

  return (
    <main style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      background: '#090909'
    }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/upload" element={<PageTransition><UploadPage /></PageTransition>} />
          <Route path="/results" element={<PageTransition><DashboardPage /></PageTransition>} />
          <Route path="/tips" element={<PageTransition><TipsPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </main>
  );
};

function App() {
  const lenisRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.globalTimeline.timeScale(0);
    }
    lenisRef.current = initLenis();
    return () => { lenisRef.current?.destroy(); };
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1, transformOrigin: 'left center', ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });
    }
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div ref={progressRef} style={{ position: 'fixed', top: 0, left: 0, height: '2px', width: '100%', background: 'var(--accent-iris)', transformOrigin: 'left center', transform: 'scaleX(0)', zIndex: 9999, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-void)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", position: 'relative', width: '100%', overflowX: 'hidden' }}>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <CoordinateFooter />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

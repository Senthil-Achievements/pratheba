import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
};

export default LandingPage;

import React, { useEffect } from 'react';
import SplitType from 'split-type';
import { gsap } from '../lib/gsap';

const topicBlock = { marginTop: '80px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.08)' };
const topicHeaderRow = { display: 'flex', alignItems: 'baseline', gap: '24px', marginBottom: '32px' };
const topicNum = { fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 400, letterSpacing: '0.20em', color: '#af50ff' };
const topicTitle = { fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', color: '#f7f9fa' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' };
const subTitle = { fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: '#f7f9fa' };
const subBody = { fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#6b6b6b', lineHeight: 1.7, marginTop: '12px' };
const icon = (name) => (<span className="material-symbols-outlined" style={{ color: '#af50ff', fontSize: '24px', display: 'block', marginBottom: '16px' }}>{name}</span>);

const TipsPage = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType('.tips-heading', { types: 'words' });
      gsap.fromTo(split.words, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
      gsap.utils.toArray('.tips-topic').forEach((topic) => {
        gsap.fromTo(topic, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: topic, start: 'top 80%', toggleActions: 'play none none reverse' } });
        const cards = topic.querySelectorAll('.tips-card');
        gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: topic, start: 'top 75%' } });
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px', background: '#090909' }}>
      <div className="container">
        {/* Hero */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '16px' }}>
          THE GUIDE
        </div>
        <h1 className="tips-heading" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, lineHeight: 1.05, color: '#f7f9fa' }}>Write a resume that</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f7f9fa', marginTop: '8px' }}>flies through ATS.</span>
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 400, color: 'rgba(247,249,250,0.65)', maxWidth: '600px', lineHeight: 1.6, marginTop: '24px' }}>
          Data-driven strategies that keep your professional narrative readable by machines without sacrificing human appeal.
        </p>

        {/* 01 Do/Don't */}
        <section className="tips-topic" style={topicBlock}>
          <div style={topicHeaderRow}>
            <span style={topicNum}>01</span>
            <h2 style={topicTitle}>Do's &amp; Don'ts</h2>
          </div>
          <div style={grid}>
            <div className="tips-card">{icon('check_circle')}<h3 style={subTitle}>Standard Headings</h3><p style={subBody}>Stick to "Experience", "Education", and "Skills" so parsers map your sections correctly.</p></div>
            <div className="tips-card">{icon('description')}<h3 style={subTitle}>Submit .docx or .pdf</h3><p style={subBody}>Standard formats keep formatting intact during text extraction.</p></div>
            <div className="tips-card">{icon('cancel')}<h3 style={subTitle}>Avoid Graphics</h3><p style={subBody}>Charts, images and headshots often turn into gibberish inside an ATS database.</p></div>
          </div>
        </section>

        {/* 02 Keyword strategy */}
        <section className="tips-topic" style={topicBlock}>
          <div style={topicHeaderRow}>
            <span style={topicNum}>02</span>
            <h2 style={topicTitle}>Keyword Strategy</h2>
          </div>
          <div style={grid}>
            <div className="tips-card">{icon('data_usage')}<h3 style={subTitle}>Contextual Density</h3><p style={subBody}>Prove skills inside bullet points. Modern ATS measure proximity of skills to experience.</p></div>
            <div className="tips-card">{icon('bolt')}<h3 style={subTitle}>Hard Skill Priority</h3><p style={subBody}>Lead with software, certifications and methodologies. Soft skills are secondary keywords.</p></div>
            <div className="tips-card">{icon('sync_alt')}<h3 style={subTitle}>Mirror the Posting</h3><p style={subBody}>Reuse exact phrasing from the job description where it is truthful and relevant.</p></div>
          </div>
        </section>

        {/* 03 Advanced mechanics */}
        <section className="tips-topic" style={topicBlock}>
          <div style={topicHeaderRow}>
            <span style={topicNum}>03</span>
            <h2 style={topicTitle}>Advanced Mechanics</h2>
          </div>
          <div style={grid}>
            <div className="tips-card">{icon('qr_code_scanner')}<h3 style={subTitle}>Font Selection</h3><p style={subBody}>Sans-serif fonts like Calibri, Arial or Roboto recognize more reliably than decorative serifs.</p></div>
            <div className="tips-card">{icon('reorder')}<h3 style={subTitle}>Bullet Logic</h3><p style={subBody}>Use standard round bullets. Exotic symbols can cause parsing errors or merged lines.</p></div>
            <div className="tips-card">{icon('terminal')}<h3 style={subTitle}>Standardize Abbreviations</h3><p style={subBody}>Include both acronym and full name, e.g. "Certified Public Accountant (CPA)".</p></div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TipsPage;

import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import CssLab from './components/CssLab';
import ArcadeGame from './components/ArcadeGame';
import ContactForm from './components/ContactForm';
import { ShoppingCart, Code2, Palette, Server, Cloud, Database } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function App() {
  const [hue, setHue] = useState(280);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [blurVal, setBlurVal] = useState(16);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // ── Sync state → CSS custom properties so the whole page reacts live ──
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hue', hue);
    document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 100%, 65%)`);
    document.documentElement.style.setProperty('--primary-glow', `hsl(${hue}, 100%, 65%, 0.4)`);
  }, [hue]);

  useEffect(() => {
    document.documentElement.style.setProperty('--blur-val', `${blurVal}px`);
  }, [blurVal]);

  const navLinks = [
    { href: '#experience', label: 'Experience' },
    { href: '#projects',   label: 'Projects' },
    { href: '#skills',     label: 'Capabilities' },
    { href: '#css-lab',    label: 'CSS Lab' },
    { href: '#arcade',     label: 'Arcade' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="relative min-h-screen text-[#f0f3fe]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Custom Cursor */}
      <div className="cursor-dot"      style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />
      <div className="cursor-outline"  style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />

      <BackgroundCanvas hue={hue} speedMultiplier={speedMultiplier} />

      {/* ── Navbar ── (no backdrop-filter here to avoid containing-block issue) */}
      <nav
        className="fixed top-0 left-0 w-full z-[1000] px-6 md:px-10 py-4 border-b border-white/10"
        style={{ background: 'rgba(7,9,19,0.80)' }}
      >
        <div className="max-w-[1300px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#hero" className="font-mono text-xl md:text-2xl font-extrabold text-[#f0f3fe] no-underline">
            <span className="text-[#00f0ff]">&lt;</span>Pratik
            <span style={{ color: 'var(--primary-color)' }}>.Dev</span>
            <span className="text-[#00f0ff]">/&gt;</span>
          </a>

          {/* Desktop links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
            {navLinks.map(l => (
              <li key={l.href}>
                <a href={l.href} className="text-[#94a3b8] text-sm font-medium no-underline hover:text-[#00f0ff] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="px-5 py-2 rounded-full text-sm font-semibold no-underline text-[#f0f3fe] bg-white/5 border transition-all hover:shadow-[0_0_20px_var(--primary-glow)]"
                style={{ borderColor: 'var(--primary-color)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-color)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Contact Me
              </a>
            </li>
          </ul>

          {/* Mobile hamburger — visible only on mobile */}
          <button
            className="md:hidden bg-transparent border-none text-2xl text-[#f0f3fe] cursor-pointer p-2 leading-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── OUTSIDE nav to avoid containing-block clip */}
      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[999] md:hidden"
          style={{ background: 'rgba(7,9,19,0.5)' }}
          onClick={closeMenu}
        />
      )}
      {/* Drawer Panel */}
      <div
        className="fixed top-0 right-0 h-screen w-72 z-[1000] flex flex-col items-center pt-12 pb-10 gap-0 md:hidden transition-transform duration-300 ease-in-out border-l border-white/10 overflow-y-auto"
        style={{
          background: 'rgba(7,9,19,0.97)',
          backdropFilter: 'blur(24px)',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: mobileMenuOpen ? '-10px 0 40px rgba(0,0,0,0.8)' : 'none',
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-xl text-[#94a3b8] cursor-pointer hover:text-[#f0f3fe] transition-colors"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Profile photo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-3">
            <img
              src="/pratik-profile.jpg"
              alt="Pratik Kumar"
              className="w-full h-full rounded-full object-cover object-[center_15%]"
              style={{ border: '2px solid var(--primary-color)', boxShadow: '0 0 20px var(--primary-glow)' }}
            />
            {/* Online dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#27c93f] border-2 border-[#070913]" />
          </div>
          <p className="font-bold text-sm text-[#f0f3fe]">Pratik Kumar</p>
          <p className="text-xs text-[#00f0ff] font-mono mt-0.5">Full-Stack Java Dev</p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-white/10 mb-7" />

        {/* Nav links */}
        <div className="flex flex-col items-center gap-6 w-full px-6 flex-1">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[#94a3b8] text-base font-medium no-underline hover:text-[#00f0ff] transition-colors w-full text-center py-1"
              onClick={closeMenu}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Contact CTA */}
        <a
          href="#contact"
          className="mt-8 px-7 py-2.5 rounded-full text-white font-semibold no-underline text-sm"
          style={{ background: 'var(--primary-color)', boxShadow: '0 4px 20px var(--primary-glow)' }}
          onClick={closeMenu}
        >
          Contact Me ✉️
        </a>
      </div>

      {/* ── Main Content ── */}
      <main>
        <Hero />

        <Experience />

        <Projects />

        {/* Capabilities / Skills Section */}
        <section id="skills" className="py-28 px-4 md:px-8 relative">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-tag">&lt;What I Build & Master/&gt;</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
                Full-Stack & Cloud <span className="gradient-text">Capabilities</span>
              </h2>
              <p className="text-[#94a3b8] text-lg">
                Spring Boot RESTful APIs, Microservices, Real-Time Dashboards, E-Commerce & Payment Gateway integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Server size={28} />,
                  title: 'Backend Engineering & Microservices',
                  desc: 'Designed and deployed 100+ RESTful APIs using Java, Spring Boot, Spring MVC, Spring JPA, Hibernate, and DTO data pipelines.',
                  tags: ['Java','Spring Boot','REST API','Microservices']
                },
                {
                  icon: <Code2 size={28} />,
                  title: 'Frontend Dashboards & React / Vue.js',
                  desc: 'Engineered real-time server health monitoring dashboards (Vue.js/React) reducing diagnostic time by 40%. Full i18n & multi-timezone support.',
                  tags: ['Vue.js','React.js','ES6+','Tailwind']
                },
                {
                  icon: <ShoppingCart size={28} />,
                  title: 'E-Commerce & Payment Systems',
                  desc: 'Resolved high-priority Juspay & Stripe payment gateway integrations, micropayments, edge-case transaction handling, and e-commerce stores.',
                  tags: ['Juspay','Stripe','E-Commerce','DTO']
                },
                {
                  icon: <Cloud size={28} />,
                  title: 'Cloud DevOps & CI/CD Pipelines',
                  desc: 'Automated deployments across AWS, Azure, and GCP. Configured Jenkins CI/CD pipelines for staging & production environments.',
                  tags: ['AWS','Azure','GCP','Jenkins','Git']
                },
                {
                  icon: <Database size={28} />,
                  title: 'Databases & Data Management',
                  desc: 'High-availability relational database management, query optimization, data structures, and OOP design patterns.',
                  tags: ['PostgreSQL','MySQL','JPA','SQL']
                },
                {
                  icon: <Palette size={28} />,
                  title: 'Crazy CSS & Creative Front-End',
                  desc: 'Dynamic 3D glassmorphic card effects, particle physics shaders, Canvas games, responsive UI/UX, and custom dark mode themes.',
                  tags: ['CSS3','SCSS','HTML5','Canvas']
                }
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 15px 40px var(--primary-glow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff] mb-5">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map(t => (
                      <span key={t} className="text-xs font-mono px-2 py-1 bg-white/5 border border-white/10 rounded text-[#94a3b8]">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CssLab hue={hue} setHue={setHue} speedMultiplier={speedMultiplier} setSpeedMultiplier={setSpeedMultiplier} blurVal={blurVal} setBlurVal={setBlurVal} />

        <ArcadeGame />

        <ContactForm />
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-white/10" style={{ background: 'rgba(5,7,15,0.95)' }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-[#94a3b8] text-sm">
              © 2026 Crafted with ❤️ & Crazy CSS by <strong className="gradient-text">PRATIK BHATT</strong>
            </p>
            <span className="font-mono text-xs text-[#94a3b8]">
              Senior Full-Stack Software Engineer
            </span>
          </div>
          <div className="flex gap-3">
            {[
              { href: 'https://www.linkedin.com/in/pratik-kumar-76b96417a/', icon: <FaLinkedin size={18} /> },
              { href: 'https://github.com/PratikBhatt4215', icon: <FaGithub size={18} /> },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-[#f0f3fe] flex items-center justify-center no-underline transition-all hover:-translate-y-1"
                style={{ transition: 'all 0.25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

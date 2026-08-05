import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Hero() {
  const [typingText, setTypingText] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    const roles = [
      "Full-Stack Java Engineer",
      "Spring Boot & Microservices Specialist",
      "Vue.js & React Frontend Architect",
      "AWS / Azure / GCP DevOps Engineer",
      "E-Commerce & Payment Systems Dev"
    ];
    let roleIdx = 0, charIdx = 0, isDeleting = false, timeoutId;

    const type = () => {
      const cur = roles[roleIdx];
      setTypingText(isDeleting ? cur.substring(0, charIdx - 1) : cur.substring(0, charIdx + 1));
      isDeleting ? charIdx-- : charIdx++;
      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx === cur.length) { speed = 2000; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 500; }
      timeoutId = setTimeout(type, speed);
    };
    type();
    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const inner = cardRef.current.querySelector('.glass-card-inner');
    if (inner) inner.style.transform = `rotateX(${(y / rect.height) * -20}deg) rotateY(${(x / rect.width) * 20}deg) scale3d(1.02,1.02,1.02)`;
  };

  const handleMouseLeave = () => {
    const inner = cardRef.current?.querySelector('.glass-card-inner');
    if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  return (
    <section id="hero" className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center">
      <div className="max-w-[1300px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">

        {/* ── Left: Hero Content ── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.25)] text-[#00f0ff] text-sm">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-[pulse_2s_infinite]" />
            Full Stack Java & Enterprise Web Engineer • 3+ Yrs Exp
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
            Hi, I'm <span className="gradient-text">Pratik Kumar</span>
            <br />
            <span className="typing-text">{typingText}</span>
          </h1>

          <p className="text-[#94a3b8] text-base md:text-lg mb-8 max-w-xl">
            Senior Full-Stack Software Engineer. Specializing in Java Spring Boot RESTful APIs, Vue.js / React real-time dashboards, Juspay Payment Systems, and Cloud DevOps (AWS, Azure, GCP).
          </p>

          <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
            <a href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white no-underline transition-all hover:-translate-y-1 hover:shadow-[0_8px_35px_var(--primary-glow)]"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), #8a2be2)', boxShadow: '0 4px 25px var(--primary-glow)' }}
            >
              <span>Hire Me / Start a Project</span>
              <ArrowRight size={18} />
            </a>
            <a href="#experience"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-[#f0f3fe] no-underline bg-white/5 border border-white/15 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:-translate-y-1"
            >
              View Work Experience
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-5 border-t border-white/10">
            {[
              { num: '100', plus: '+', label: 'RESTful APIs Built' },
              { num: '500', plus: '+', label: 'Prod Bugs Resolved' },
              { num: '3',   plus: '+ Yrs', label: 'Enterprise Experience' },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="text-4xl font-black leading-none">
                  {s.num}<span style={{ color: 'var(--primary-color)' }} className="text-2xl">{s.plus}</span>
                </span>
                <span className="text-xs text-[#94a3b8] mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 3D Profile Card ── */}
        <div className="flex justify-center">
          <div className="profile-card-3d w-full max-w-sm" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="glass-card-inner bg-[rgba(18,22,40,0.65)] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Avatar */}
              <div className="relative w-36 h-36 mx-auto mb-5">
                <img
                  src="/pratik-profile.jpg"
                  alt="Pratik Kumar"
                  className="w-full h-full rounded-full object-cover object-[center_15%] relative z-10"
                  style={{ border: '3px solid var(--primary-color)' }}
                />
                <div className="avatar-glow" />
              </div>

              {/* Info */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold">Pratik Kumar</h3>
                <p className="text-[#00f0ff] text-sm mt-1">Senior Software Engineer</p>
                <div className="flex justify-center gap-3 mt-3">
                  {[
                    { href: 'https://www.linkedin.com/in/pratik-kumar-76b96417a/', icon: <FaLinkedin size={17} /> },
                    { href: 'https://github.com/PratikBhatt4215', icon: <FaGithub size={17} /> },
                    { href: 'mailto:pk4789218@gmail.com', icon: <FaEnvelope size={17} /> },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[#f0f3fe] flex items-center justify-center no-underline transition-all hover:bg-[var(--primary-color)] hover:border-[var(--primary-color)] hover:shadow-[0_0_15px_var(--primary-glow)] hover:-translate-y-1"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Code Snippet */}
              <div className="bg-[rgba(5,7,15,0.8)] border border-white/10 rounded-xl p-3 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="code-filename">PratikKumar.java</span>
                </div>
                <pre className="text-[0.72rem] leading-relaxed whitespace-pre-wrap break-words overflow-hidden"><code>
                  <span className="keyword">public class</span> <span className="variable">PratikKumar</span> &#123;{"\n"}
                  {'  '}<span className="keyword">String</span> superPower ={"\n"}
                  {'    '}<span className="string">"Zero limits. Pure code. 💎"</span>;{"\n"}
                  {'  '}<span className="keyword">String</span> status ={"\n"}
                  {'    '}<span className="string">"Ready to Code 🔥"</span>;{"\n"}
                  &#125;
                </code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

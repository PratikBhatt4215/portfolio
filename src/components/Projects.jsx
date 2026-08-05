import React from 'react';
import { ExternalLink, ShoppingCart, Server, Code2, ShieldCheck, CreditCard, Cpu } from 'lucide-react';
import { FaJava, FaVuejs, FaReact, FaAws } from 'react-icons/fa';
import { SiSpringboot, SiTailwindcss } from 'react-icons/si';

export default function Projects() {
  const projects = [
    {
      title: "Kyvos Manager",
      subtitle: "Enterprise Node Management Dashboard",
      description: "25+ Spring Boot REST APIs + Vue.js real-time server health monitoring dashboard. Reduced diagnostic time by 40%.",
      tags: ["Java", "Spring Boot", "Vue.js", "AWS"],
      icons: [<FaJava key="1" />, <SiSpringboot key="2" />, <FaVuejs key="3" />, <FaAws key="4" />],
      link: "https://github.com/PratikBhatt4215",
      badge: "Enterprise"
    },
    {
      title: "E-Commerce + Juspay",
      subtitle: "Microservices & Payment Gateway",
      description: "Scalable DTOs, microservices data flow, high-priority Juspay & Stripe edge-case payment handling.",
      tags: ["Spring Boot", "Juspay", "Stripe", "MySQL"],
      icons: [<FaJava key="1" />, <SiSpringboot key="2" />, <ShoppingCart key="3" />, <CreditCard key="4" />],
      link: "https://github.com/PratikBhatt4215",
      badge: "Payments"
    },
    {
      title: "Legal Doc Maker",
      subtitle: "Lawyer & Court Affidavit Platform",
      description: "Automates court affidavits, agreement templates, and legal document generation with instant downloads.",
      tags: ["React.js", "Node.js", "Legal Tech"],
      icons: [<ShieldCheck key="1" />, <FaReact key="2" />, <Code2 key="3" />],
      link: "https://github.com/PratikBhatt4215/legal-doc-maker",
      badge: "SaaS"
    },
    {
      title: "Netflix GPT",
      subtitle: "AI Movie Recommendation Platform",
      description: "Netflix clone with OpenAI GPT for intelligent movie search & recommendations using React + Firebase.",
      tags: ["React.js", "OpenAI GPT", "Firebase", "Tailwind"],
      icons: [<FaReact key="1" />, <SiTailwindcss key="2" />, <Cpu key="3" />],
      link: "https://github.com/PratikBhatt4215",
      badge: "AI"
    },
    {
      title: "Online Shopping Store",
      subtitle: "Full-Stack E-Commerce + Razorpay",
      description: "Cart management, admin dashboard, order tracking, and Razorpay POS integration — end-to-end.",
      tags: ["React.js", "Node.js", "MongoDB", "Razorpay"],
      icons: [<FaReact key="1" />, <Code2 key="2" />, <ShoppingCart key="3" />],
      link: "https://github.com/PratikBhatt4215",
      badge: "E-Commerce"
    }
  ];

  return (
    <section id="projects" className="py-24 px-4 md:px-8 relative bg-[rgba(5,7,17,0.5)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-tag">&lt;GitHub & Portfolio Showcase/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Enterprise platforms, microservices, AI tools, and creative full-stack projects.
          </p>
        </div>

        {/* Compact grid — 3 columns on large screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="relative flex flex-col bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-5 backdrop-blur-xl transition-all duration-300"
              style={{ transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 12px 35px var(--primary-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Top row: icons + badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2 text-xl text-[#00f0ff]">
                  {proj.icons.map((ic, i) => <span key={i}>{ic}</span>)}
                </div>
                <span className="font-mono text-[0.68rem] px-2 py-0.5 bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.25)] rounded-full text-[#00f0ff] whitespace-nowrap">
                  {proj.badge}
                </span>
              </div>

              {/* Title & subtitle */}
              <h3 className="text-base font-extrabold leading-tight mb-0.5">{proj.title}</h3>
              <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>{proj.subtitle}</h4>

              {/* Description */}
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-3 flex-1">{proj.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.tags.map((t, tIdx) => (
                  <span key={tIdx} className="font-mono text-[0.65rem] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[#94a3b8]">{t}</span>
                ))}
              </div>

              {/* Link */}
              <a
                href={proj.link}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 self-start px-4 py-1.5 rounded-full font-semibold text-xs no-underline border transition-all"
                style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary-color)'; }}
              >
                <span>View Repo</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

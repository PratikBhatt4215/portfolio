import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      company: "Intellicus Technologies",
      role: "Full-stack Developer",
      period: "Dec 2024 - Present",
      location: "Indore, Madhya Pradesh, India",
      highlights: [
        "Spearheaded development of 'Kyvos Manager', designing and deploying 25+ high-performance RESTful APIs for node management and system configuration using Java Spring Boot.",
        "Built a responsive Node Monitoring dashboard in Vue.js to visualize server health, uptime, and real-time metrics — reducing diagnostic time by 40%.",
        "Engineered scalable Internationalization (i18n) and multi-timezone support systems (UTC, IST) across logs and schedulers for global enterprise users.",
        "Managed production deployments across AWS, Azure, and GCP; configured Jenkins CI/CD pipelines for automated builds and led full release management."
      ]
    },
    {
      company: "Techouts",
      role: "Associate Software Developer & Entry Level Developer",
      period: "Nov 2022 - Dec 2024 (2 yrs 2 mos)",
      location: "Hyderabad, Telangana, India",
      highlights: [
        "Owned production stability of critical enterprise modules — diagnosed and resolved 500+ complex production bugs, significantly improving system reliability.",
        "Resolved high-priority Juspay payment gateway issues, implementing logic to handle micropayments and edge-case transactions seamlessly.",
        "Designed a generic email notification framework using server-side scripting and event registries to automate user alerts across the platform.",
        "Developed Data Transfer Objects (DTOs) and models to streamline microservices data flow."
      ]
    },
    {
      company: "SkillVertex",
      role: "Web Development Intern",
      period: "Oct 2021 - Nov 2021",
      location: "India",
      highlights: [
        "Completed web development internship, mastering core JavaScript, HTML5, CSS3, and responsive layout fundamentals."
      ]
    }
  ];

  return (
    <section id="experience" className="py-28 px-4 md:px-8 relative bg-[rgba(10,13,26,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-tag">&lt;Career Milestones/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-[#94a3b8] text-lg">
            Proven track record building enterprise web apps, microservices APIs, and payment systems.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto pl-8 border-l-2 border-dashed border-white/10">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative mb-10 last:mb-0">
              {/* Badge */}
              <div
                className="absolute -left-[2.75rem] top-0 w-10 h-10 rounded-full flex items-center justify-center text-[#00f0ff]"
                style={{
                  background: '#070913',
                  border: '2px solid var(--primary-color)',
                  boxShadow: '0 0 15px var(--primary-glow)'
                }}
              >
                <Briefcase size={18} />
              </div>

              {/* Card */}
              <div className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary-color)] hover:translate-x-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#f0f3fe]">{exp.company}</h3>
                    <h4 className="text-base font-semibold text-[#00f0ff]">{exp.role}</h4>
                  </div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[#94a3b8]">
                    <Calendar size={13} /> {exp.period}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-[#94a3b8] mb-4">
                  <MapPin size={13} /> {exp.location}
                </div>

                <ul className="flex flex-col gap-3">
                  {exp.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2 text-sm text-[#94a3b8] leading-relaxed">
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#00f0ff]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

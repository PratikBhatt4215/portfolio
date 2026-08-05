import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, Phone, X, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

// ─────────────────────────────────────────────────────────────
// 🔧 EMAILJS CONFIG
//   Service ID  : from Email Services tab
//   Template ID : from Email Templates tab (Auto-Reply is built into the same template)
//   Public Key  : Account → General → Public Key
// ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID       = 'service_o626a4p';      // ✅ your service ID
const EMAILJS_TEMPLATE_OWNER     = 'template_5tvgbmz';     // ✅ template ID for owner email
const EMAILJS_TEMPLATE_AUTOREPLY = 'template_lctipu2';     // ✅ template ID for auto-reply email
const EMAILJS_PUBLIC_KEY         = 'vHQBLdpQ763-OmZyd';      // ✅ your public key

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Java / Spring Boot App',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, message: '' });

    // Email 1 — sent TO YOU (Pratik) with full inquiry details
    const ownerParams = {
      from_name:    formData.name,
      from_email:   formData.email,
      email:        formData.email,
      project_type: formData.projectType,
      message:      formData.message,
      to_email:     'pk4789218@gmail.com',
    };

    // Email 2 — auto-reply TO THE USER with acknowledgement (supporting all standard variable name formats)
    const autoReplyParams = {
      to_name:      formData.name,
      to_email:     formData.email,
      from_name:    formData.name,
      from_email:   formData.email,
      email:        formData.email,
      project_type: formData.projectType,
    };

    try {
      await Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER,   ownerParams,     EMAILJS_PUBLIC_KEY),
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, autoReplyParams, EMAILJS_PUBLIC_KEY),
      ]);
      setStatus({
        loading: false, success: true,
        message: `Thank you ${formData.name}! ✅ Your message was sent. A confirmation email has been sent to ${formData.email}.`
      });
      setFormData({ name: '', email: '', projectType: 'Full-Stack Java / Spring Boot App', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus({ loading: false, success: false, message: 'Could not send email. Please reach out directly at pk4789218@gmail.com' });
    } finally {
      setShowToast(true);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-[#050710] border border-white/10 rounded-xl text-[#f0f3fe] text-sm outline-none transition-all focus:border-[var(--primary-color)] focus:shadow-[0_0_15px_var(--primary-glow)]";

  const contactItems = [
    { icon: <Mail size={19} />,       title: 'Email',    content: <a href="mailto:pk4789218@gmail.com" className="text-[#94a3b8] hover:text-[#00f0ff] transition-colors text-sm no-underline">pk4789218@gmail.com</a> },
    { icon: <FaLinkedin size={19} />, title: 'LinkedIn', content: <a href="https://www.linkedin.com/in/pratik-kumar-76b96417a/" target="_blank" rel="noopener" className="text-[#94a3b8] hover:text-[#00f0ff] transition-colors text-sm no-underline">linkedin.com/in/pratik-kumar</a> },
    { icon: <FaGithub size={19} />,   title: 'GitHub',   content: <a href="https://github.com/PratikBhatt4215" target="_blank" rel="noopener" className="text-[#94a3b8] hover:text-[#00f0ff] transition-colors text-sm no-underline">github.com/PratikBhatt4215</a> },
    { icon: <MapPin size={19} />,     title: 'Location', content: <p className="text-[#94a3b8] text-sm">Indore / Bokaro Steel City</p> },
  ];

  return (
    <section id="contact" className="py-28 px-4 md:px-8 relative">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-tag">&lt;Let's Connect/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Have a Project in Mind? <span className="gradient-text">Contact Me</span>
          </h2>
          <p className="text-[#94a3b8] text-lg">
            Fill the form — your message lands directly in Pratik's inbox. ✉️
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Card */}
          <div className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-7 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-2">Get In Touch</h3>
            <p className="text-[#94a3b8] text-sm mb-7 leading-relaxed">
              Available for Full-Stack Engineering, Spring Boot APIs, E-Commerce, Vue.js/React projects, and cloud integrations.
            </p>

            <div className="flex flex-col gap-5">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5">{item.title}</h4>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <form
            className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-7 backdrop-blur-xl flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Project Type</label>
              <select name="projectType" value={formData.projectType} onChange={handleChange} className={inputCls}>
                <option>Full-Stack Java / Spring Boot App</option>
                <option>Vue.js / React Frontend Application</option>
                <option>E-Commerce & Payment Systems</option>
                <option>Cloud DevOps / CI-CD Setup</option>
                <option>Crazy CSS / Creative Front-End</option>
                <option>Hire Full-Time / Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Message *</label>
              <textarea
                name="message" rows={5} value={formData.message} onChange={handleChange}
                placeholder="Tell me about your project goals, timeline, and tech stack..."
                required className={inputCls + ' resize-none'}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-3.5 rounded-full font-semibold text-white border-0 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_35px_var(--primary-glow)] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), #8a2be2)', boxShadow: '0 4px 25px var(--primary-glow)' }}
            >
              {status.loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message to Pratik ✉️
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className={`toast-notification ${status.success ? 'success' : 'error'}`}>
          <div className="flex items-center gap-3 text-sm font-medium">
            {status.success
              ? <CheckCircle size={20} className="toast-icon-success" />
              : <AlertTriangle size={20} className="toast-icon-error" />
            }
            <span>{status.message}</span>
          </div>
          <button onClick={() => setShowToast(false)} className="bg-transparent border-none text-[#94a3b8] cursor-pointer p-1 rounded-full hover:text-[#f0f3fe] transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

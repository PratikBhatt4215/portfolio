import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trash2, HelpCircle } from 'lucide-react';

export default function ParticleSandbox() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [particleCount, setParticleCount] = useState(1500);
  const [clickAction, setClickAction] = useState('pull'); // pull, push, orbit
  const [colorMode, setColorMode] = useState('match'); // match, rainbow, electric
  const [fps, setFps] = useState(60);

  const requestRef = useRef();
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  // Initialize particles
  const initParticles = (width, height, count) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 1.8 + 0.6,
        hue: Math.random() * 360,
      });
    }
    particles.current = arr;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.width; // Keep it square
      initParticles(canvas.width, canvas.height, particleCount);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();
    let frames = 0;

    const animate = (time) => {
      // Calculate FPS
      frames++;
      if (time > lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (time - lastTime)));
        frames = 0;
        lastTime = time;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Semi-transparent clear for tail effect
      ctx.fillStyle = 'rgba(5, 7, 19, 0.2)';
      ctx.fillRect(0, 0, w, h);

      const rootStyle = getComputedStyle(document.documentElement);
      const primaryColorStr = rootStyle.getPropertyValue('--primary-color').trim() || '#a855f7';

      // Update and draw particles
      const list = particles.current;
      const action = clickAction;
      const mode = colorMode;
      const m = mouse.current;

      for (let i = 0; i < list.length; i++) {
        const p = list[i];

        // Apply physics/forces if mouse is active
        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist < 220) {
            const force = (220 - dist) / 220; // 0 (far) to 1 (near)

            if (action === 'pull') {
              // Gravitational pull
              p.vx += (dx / dist) * force * 0.45;
              p.vy += (dy / dist) * force * 0.45;
            } else if (action === 'push') {
              // Repulsion force
              p.vx -= (dx / dist) * force * 0.6;
              p.vy -= (dy / dist) * force * 0.6;
            } else if (action === 'orbit') {
              // Spiral force
              p.vx += (-dy / dist) * force * 0.5 + (dx / dist) * 0.05;
              p.vy += (dx / dist) * force * 0.5 + (dy / dist) * 0.05;
            }
          }
        }

        // Apply natural drag/damping
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Add tiny noise float
        p.vx += (Math.random() - 0.5) * 0.12;
        p.vy += (Math.random() - 0.5) * 0.12;

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Boundary collision wrapping
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Set color
        if (mode === 'match') {
          ctx.fillStyle = primaryColorStr;
        } else if (mode === 'rainbow') {
          p.hue = (p.hue + 0.5) % 360;
          ctx.fillStyle = `hsl(${p.hue}, 100%, 65%)`;
        } else {
          // Electric Blue/Cyan neon mix
          ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#ff0077';
        }

        // Draw particle
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [clickAction, colorMode, particleCount]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
  };

  return (
    <section id="arcade" className="py-24 px-4 md:px-8 relative bg-[rgba(5,7,17,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-tag">&lt;Interactive Physics Sandbox/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            The Neon <span className="gradient-text">Gravity Sandbox</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Click, drag, and interact with 1,500+ real-time physics particles. Master fluid flow fields and orbital drag.
          </p>
        </div>

        {/* Sandbox Wrapper */}
        <div className="max-w-[850px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          
          {/* Canvas Area */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-square bg-[#050713] rounded-2xl overflow-hidden border border-white/10 cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseDown={() => { mouse.current.active = true; }}
            onMouseUp={() => { mouse.current.active = false; }}
            onMouseLeave={() => { mouse.current.active = false; }}
            onTouchStart={(e) => {
              mouse.current.active = true;
              const canvas = canvasRef.current;
              if (canvas && e.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                mouse.current.x = e.touches[0].clientX - rect.left;
                mouse.current.y = e.touches[0].clientY - rect.top;
              }
            }}
            onTouchMove={(e) => {
              const canvas = canvasRef.current;
              if (canvas && e.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                mouse.current.x = e.touches[0].clientX - rect.left;
                mouse.current.y = e.touches[0].clientY - rect.top;
              }
            }}
            onTouchEnd={() => { mouse.current.active = false; }}
          >
            <canvas ref={canvasRef} className="block w-full h-full" />
            
            {/* FPS & Particle Count Info badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="font-mono text-[0.65rem] px-2.5 py-1 bg-[#050713]/80 border border-white/10 rounded-full text-[#94a3b8]">
                🟢 {fps} FPS
              </span>
              <span className="font-mono text-[0.65rem] px-2.5 py-1 bg-[#050713]/80 border border-white/10 rounded-full text-[#94a3b8]">
                ✨ {particleCount} particles
              </span>
            </div>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 pointer-events-none">
              <span className="text-[0.65rem] text-[#94a3b8] font-mono px-3 py-1 bg-[#050713]/90 border border-white/10 rounded-full flex items-center gap-1">
                <HelpCircle size={10} /> Click and hold inside the sandbox to interact
              </span>
            </div>
          </div>

          {/* Sandbox Controls Side */}
          <div className="flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-base font-bold mb-4 text-[#00f0ff] flex items-center gap-2">
                <Sparkles size={16} /> Force Field Controls
              </h3>

              {/* Force selection buttons */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">Interaction Mode</label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'pull',  label: '🧲 Gravity Well', desc: 'Pulls particles toward cursor' },
                    { id: 'push',  label: '💨 Repulsion Field', desc: 'Blows particles away from cursor' },
                    { id: 'orbit', label: '🌀 Orbital Spiral', desc: 'Creates spinning orbit vortex' },
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setClickAction(mode.id)}
                      className="w-full text-left px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex flex-col gap-0.5"
                      style={{
                        background:  clickAction === mode.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                        borderColor: clickAction === mode.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                        color: '#f0f3fe',
                        boxShadow:   clickAction === mode.id ? '0 0 12px var(--primary-glow)' : 'none',
                      }}
                    >
                      <span>{mode.label}</span>
                      <span className="text-[0.65rem] opacity-75">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Colors */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">Particle Color Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'match',   label: 'Theme' },
                    { id: 'rainbow', label: 'Rainbow' },
                    { id: 'electric',label: 'Neon Mix' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setColorMode(c.id)}
                      className="px-2 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-all text-center"
                      style={{
                        background:  colorMode === c.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                        borderColor: colorMode === c.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                        color: '#f0f3fe',
                        boxShadow:   colorMode === c.id ? '0 0 10px var(--primary-glow)' : 'none',
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Count selection */}
              <div className="mb-2">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">Density (Particles)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1500, 2500].map(count => (
                    <button
                      key={count}
                      onClick={() => setParticleCount(count)}
                      className="py-1.5 rounded-xl text-xs font-mono cursor-pointer border transition-all text-center"
                      style={{
                        background:  particleCount === count ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                        borderColor: particleCount === count ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                        color: '#f0f3fe',
                        boxShadow:   particleCount === count ? '0 0 10px var(--primary-glow)' : 'none',
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear/Reset button */}
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (canvas) initParticles(canvas.width, canvas.height, particleCount);
              }}
              className="w-full py-3 rounded-xl border border-dashed border-[#ff0077]/40 bg-[#ff0077]/5 text-[#ff0077] hover:bg-[#ff0077]/10 hover:border-[#ff0077]/65 transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 size={13} /> Reset Force Fields
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}

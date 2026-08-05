import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import TechNews from './TechNews';

export default function CssLab({ hue, setHue, speedMultiplier, setSpeedMultiplier, blurVal, setBlurVal }) {
  const [activeTheme, setActiveTheme] = useState('cyber');

  const presets = [
    { id: 'cyber',  name: '🟣 Cyberpunk',    hue: 280 },
    { id: 'matrix', name: '🟢 Matrix Green', hue: 130 },
    { id: 'sunset', name: '🟠 Solar Sunset', hue: 20  },
    { id: 'neon',   name: '🔵 Ultra Neon',   hue: 320 }
  ];

  const handlePreset = (preset) => {
    setActiveTheme(preset.id);
    setHue(preset.hue);
  };

  return (
    <section id="css-lab" className="py-24 px-4 md:px-8 relative bg-[rgba(10,13,26,0.4)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-tag">&lt;Interactive Showcase/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            The Crazy <span className="gradient-text">CSS & Web Lab</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Tweak the live theme controls on the left — watch the entire portfolio change in real time. Plus, stay updated with the latest in tech.
          </p>
        </div>

        {/* Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Visual Controls ── */}
          <div className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#00f0ff]">
              <Sliders size={16} /> Live Portfolio Controls
            </h3>

            {/* Hue */}
            <div>
              <label className="flex justify-between text-xs font-medium mb-2 text-[#94a3b8]">
                <span>🌈 Neon Color</span>
                <span className="font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5" style={{ color: `hsl(${hue},100%,70%)` }}>{hue}°</span>
              </label>
              <input type="range" min={0} max={360} step={1} value={hue} onChange={e => setHue(parseInt(e.target.value))} className="w-full" />
            </div>

            {/* Speed */}
            <div>
              <label className="flex justify-between text-xs font-medium mb-2 text-[#94a3b8]">
                <span>⚡ Particle Speed</span>
                <span className="font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#94a3b8]">{speedMultiplier.toFixed(1)}x</span>
              </label>
              <input type="range" min={1} max={50} step={1} value={speedMultiplier * 10} onChange={e => setSpeedMultiplier(e.target.value / 10)} className="w-full" />
            </div>

            {/* Blur */}
            <div>
              <label className="flex justify-between text-xs font-medium mb-2 text-[#94a3b8]">
                <span>💧 Glass Blur</span>
                <span className="font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#94a3b8]">{blurVal}px</span>
              </label>
              <input type="range" min={0} max={40} step={1} value={blurVal} onChange={e => setBlurVal(parseInt(e.target.value))} className="w-full" />
            </div>

            {/* Preset Buttons */}
            <div>
              <label className="block text-xs font-medium mb-2 text-[#94a3b8]">🎨 Theme Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePreset(p)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all"
                    style={{
                      background:  activeTheme === p.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.04)',
                      borderColor: activeTheme === p.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.10)',
                      color: '#f0f3fe',
                      boxShadow:   activeTheme === p.id ? '0 0 14px var(--primary-glow)' : 'none',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Live Tech News ── */}
          <TechNews />
        </div>
      </div>
    </section>
  );
}

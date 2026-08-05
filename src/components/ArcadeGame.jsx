import React, { useState, useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';

export default function ArcadeGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('pratik_snake_highscore') || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameText, setGameText] = useState('CYBER SNAKE ACCELERATOR');

  const gridSize = 20;

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tileCount = canvas.width / gridSize;

    let snake = [
      { x: 5 * gridSize, y: 10 * gridSize },
      { x: 4 * gridSize, y: 10 * gridSize },
      { x: 3 * gridSize, y: 10 * gridSize }
    ];
    let food = { x: 10 * gridSize, y: 10 * gridSize };
    let dx = gridSize, dy = 0, currentScore = 0;

    const spawnFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount) * gridSize,
        y: Math.floor(Math.random() * tileCount) * gridSize
      };
    };

    const handleKey = (e) => {
      if ((e.key === 'ArrowUp'    || e.key === 'w') && dy === 0) { dx = 0;         dy = -gridSize; }
      if ((e.key === 'ArrowDown'  || e.key === 's') && dy === 0) { dx = 0;         dy =  gridSize; }
      if ((e.key === 'ArrowLeft'  || e.key === 'a') && dx === 0) { dx = -gridSize; dy =  0; }
      if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx =  gridSize; dy =  0; }
    };
    window.addEventListener('keydown', handleKey);

    const interval = setInterval(() => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      if (head.x < 0) head.x = canvas.width - gridSize;
      if (head.x >= canvas.width) head.x = 0;
      if (head.y < 0) head.y = canvas.height - gridSize;
      if (head.y >= canvas.height) head.y = 0;

      for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
          setIsPlaying(false);
          setGameText(`GAME OVER - Score: ${currentScore}`);
          clearInterval(interval);
          return;
        }
      }
      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        if (currentScore > highScore) {
          setHighScore(currentScore);
          localStorage.setItem('pratik_snake_highscore', currentScore);
        }
        spawnFood();
      } else {
        snake.pop();
      }

      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      snake.forEach((part, idx) => {
        ctx.fillStyle = idx === 0 ? 'var(--primary-color)' : 'rgba(168,85,247,0.8)';
        ctx.fillRect(part.x + 1, part.y + 1, gridSize - 2, gridSize - 2);
      });
    }, 100);

    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKey); };
  }, [isPlaying, highScore]);

  return (
    <section id="arcade" className="py-28 px-4 md:px-8 relative bg-[rgba(5,7,17,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-tag">&lt;Interactive Arcade/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Take a Break & <span className="gradient-text">Play Cyber-Snake</span>
          </h2>
          <p className="text-[#94a3b8] text-lg">
            Built using React Hooks & Canvas. Enjoy retro gaming while exploring my skills!
          </p>
        </div>

        {/* Game Wrapper */}
        <div className="max-w-[500px] mx-auto bg-[rgba(18,22,40,0.65)] border-2 border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {/* Score Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10 font-mono">
            <div className="flex gap-5 text-sm">
              <span>SCORE: <strong className="text-[#00f0ff]">{score}</strong></span>
              <span>HIGH SCORE: <strong className="text-[#00f0ff]">{highScore}</strong></span>
            </div>
            <span className="text-xs text-[#94a3b8] flex items-center gap-1">
              <Keyboard size={15} /> WASD / Arrow Keys
            </span>
          </div>

          {/* Canvas */}
          <div className="relative w-full aspect-square bg-[#03050c] rounded-2xl overflow-hidden border border-white/10">
            <canvas ref={canvasRef} id="gameCanvas" width={400} height={400} />
            {!isPlaying && (
              <div className="absolute inset-0 bg-[rgba(7,9,19,0.85)] backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-8 text-center z-10">
                <h3 className="font-mono text-xl text-[#00f0ff]">{gameText}</h3>
                <p className="text-sm text-[#94a3b8]">Click Start to Launch</p>
                <button
                  onClick={() => { setScore(0); setIsPlaying(true); }}
                  className="px-7 py-3 rounded-full font-semibold text-white text-sm cursor-pointer border-0 transition-all hover:-translate-y-1 hover:shadow-[0_8px_25px_var(--primary-glow)]"
                  style={{ background: 'linear-gradient(135deg, var(--primary-color), #8a2be2)', boxShadow: '0 4px 20px var(--primary-glow)' }}
                >
                  {score > 0 ? 'Play Again' : 'Start Game'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

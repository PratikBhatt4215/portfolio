import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, X, Smartphone, Monitor, ChevronRight, Play } from 'lucide-react';

// ==========================================
// 🍬 CANDY CRUSH ENGINE CONFIG & DATA
// ==========================================
const CRUSH_SIZE = 6;
const CANDY_TYPES = [
  { char: '💎', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
  { char: '🍬', color: '#ff0077', glow: 'rgba(255, 0, 119, 0.4)' },
  { char: '🌟', color: '#ffcc00', glow: 'rgba(255, 204, 0, 0.4)' },
  { char: '🍀', color: '#39ff14', glow: 'rgba(57, 255, 20, 0.4)' },
  { char: '🔮', color: '#8a2be2', glow: 'rgba(138, 43, 226, 0.4)' }
];

export default function ArcadeHub() {
  const [activeGame, setActiveGame] = useState(null); // 'snake' or 'crush'
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);

  // -------------------------------------------------------------
  // 🐍 RETRO SNAKE GAME STATES & ENGINE
  // -------------------------------------------------------------
  const snakeCanvasRef = useRef(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(() => parseInt(localStorage.getItem('snake_high') || '0'));
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeRunning, setSnakeRunning] = useState(false);

  const snakeStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    gridSize: 20,
    speed: 110,
    loopId: null
  });

  const initSnakeGame = () => {
    const state = snakeStateRef.current;
    state.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    state.dir = { x: 1, y: 0 };
    state.nextDir = { x: 1, y: 0 };
    setSnakeScore(0);
    setSnakeGameOver(false);
    setSnakeRunning(true);
    spawnSnakeFood(state.snake);
  };

  const spawnSnakeFood = (snakeBody) => {
    const state = snakeStateRef.current;
    const tileCount = 20; // 400x400 canvas / 20px grid
    let newFood;
    let onSnake;
    do {
      onSnake = false;
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // eslint-disable-next-line no-loop-func
      for (let cell of snakeBody) {
        if (cell.x === newFood.x && cell.y === newFood.y) onSnake = true;
      }
    } while (onSnake);
    state.food = newFood;
  };

  useEffect(() => {
    if (activeGame !== 'snake' || snakeGameOver || !snakeRunning) return;

    const handleKeyDown = (e) => {
      const dir = snakeStateRef.current.dir;
      const next = snakeStateRef.current.nextDir;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) snakeStateRef.current.nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) snakeStateRef.current.nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) snakeStateRef.current.nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) snakeStateRef.current.nextDir = { x: 1, y: 0 };
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const snakeLoop = () => {
      const state = snakeStateRef.current;
      const canvas = snakeCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Update direction to avoid rapid keyboard double tap self-collision
      state.dir = state.nextDir;

      // Calculate new head position
      const head = {
        x: state.snake[0].x + state.dir.x,
        y: state.snake[0].y + state.dir.y
      };

      // Collision boundary check
      const tileCount = 20;
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endSnakeGame();
        return;
      }

      // Self collision check
      for (let cell of state.snake) {
        if (cell.x === head.x && cell.y === head.y) {
          endSnakeGame();
          return;
        }
      }

      // Add new head
      state.snake.unshift(head);

      // Check if food eaten
      if (head.x === state.food.x && head.y === state.food.y) {
        setSnakeScore(prev => {
          const nextScore = prev + 10;
          if (nextScore > snakeHighScore) {
            setSnakeHighScore(nextScore);
            localStorage.setItem('snake_high', nextScore.toString());
          }
          return nextScore;
        });
        spawnSnakeFood(state.snake);
      } else {
        state.snake.pop(); // Remove tail
      }

      // Render board
      ctx.fillStyle = '#050713';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid helper lines
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * state.gridSize, 0);
        ctx.lineTo(i * state.gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * state.gridSize);
        ctx.lineTo(canvas.width, i * state.gridSize);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#ff0077';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0077';
      ctx.beginPath();
      ctx.arc(
        state.food.x * state.gridSize + state.gridSize / 2,
        state.food.y * state.gridSize + state.gridSize / 2,
        state.gridSize / 2 - 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Draw Snake
      state.snake.forEach((cell, idx) => {
        ctx.fillStyle = idx === 0 ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)';
        if (idx === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'var(--primary-color)';
        }
        ctx.fillRect(
          cell.x * state.gridSize + 1,
          cell.y * state.gridSize + 1,
          state.gridSize - 2,
          state.gridSize - 2
        );
        ctx.shadowBlur = 0;
      });

      state.loopId = setTimeout(snakeLoop, state.speed);
    };

    snakeLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(snakeStateRef.current.loopId);
    };
  }, [activeGame, snakeGameOver, snakeRunning]);

  const endSnakeGame = () => {
    setSnakeGameOver(true);
    setSnakeRunning(false);
    clearTimeout(snakeStateRef.current.loopId);
  };

  // -------------------------------------------------------------
  // 🍬 CANDY CRUSH SIMULATOR SYSTEM
  // -------------------------------------------------------------
  const [crushBoard, setCrushBoard] = useState([]);
  const [crushSelected, setCrushSelected] = useState(null);
  const [crushScore, setCrushScore] = useState(0);
  const [crushMoves, setCrushMoves] = useState(20);
  const [crushHighScore, setCrushHighScore] = useState(() => parseInt(localStorage.getItem('crush_high') || '0'));
  const [crushSwapping, setCrushSwapping] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const initCrushGame = () => {
    let arr = [];
    for (let i = 0; i < CRUSH_SIZE * CRUSH_SIZE; i++) {
      let randomCandy;
      do {
        randomCandy = Math.floor(Math.random() * CANDY_TYPES.length);
      } while (
        (i >= 2 && arr[i - 1] === randomCandy && arr[i - 2] === randomCandy && i % CRUSH_SIZE >= 2) ||
        (i >= CRUSH_SIZE * 2 && arr[i - CRUSH_SIZE] === randomCandy && arr[i - CRUSH_SIZE * 2] === randomCandy)
      );
      arr.push(randomCandy);
    }
    setCrushBoard(arr);
    setCrushScore(0);
    setCrushMoves(20);
    setCrushSelected(null);
  };

  const getCrushMatches = (boardList) => {
    const matched = new Set();
    // Horizontal
    for (let r = 0; r < CRUSH_SIZE; r++) {
      for (let c = 0; c < CRUSH_SIZE - 2; c++) {
        const i1 = r * CRUSH_SIZE + c;
        const i2 = i1 + 1;
        const i3 = i1 + 2;
        if (boardList[i1] !== null && boardList[i1] === boardList[i2] && boardList[i1] === boardList[i3]) {
          matched.add(i1); matched.add(i2); matched.add(i3);
        }
      }
    }
    // Vertical
    for (let c = 0; c < CRUSH_SIZE; c++) {
      for (let r = 0; r < CRUSH_SIZE - 2; r++) {
        const i1 = r * CRUSH_SIZE + c;
        const i2 = i1 + CRUSH_SIZE;
        const i3 = i2 + CRUSH_SIZE;
        if (boardList[i1] !== null && boardList[i1] === boardList[i2] && boardList[i1] === boardList[i3]) {
          matched.add(i1); matched.add(i2); matched.add(i3);
        }
      }
    }
    return Array.from(matched);
  };

  const applyCrushGravity = async (boardList) => {
    const temp = [...boardList];
    for (let c = 0; c < CRUSH_SIZE; c++) {
      for (let r = CRUSH_SIZE - 1; r > 0; r--) {
        const idx = r * CRUSH_SIZE + c;
        if (temp[idx] === null) {
          let aboveR = r - 1;
          while (aboveR >= 0 && temp[aboveR * CRUSH_SIZE + c] === null) aboveR--;
          if (aboveR >= 0) {
            const aboveIdx = aboveR * CRUSH_SIZE + c;
            temp[idx] = temp[aboveIdx];
            temp[aboveIdx] = null;
          }
        }
      }
    }
    for (let i = 0; i < CRUSH_SIZE * CRUSH_SIZE; i++) {
      if (temp[i] === null) temp[i] = Math.floor(Math.random() * CANDY_TYPES.length);
    }
    return temp;
  };

  const checkAndRunMatches = async (boardList, multiplier = 1) => {
    const matches = getCrushMatches(boardList);
    if (matches.length > 0) {
      const temp = [...boardList];
      matches.forEach(idx => { temp[idx] = null; });
      setCrushBoard(temp);

      const added = matches.length * 10 * multiplier;
      setCrushScore(prev => {
        const next = prev + added;
        if (next > crushHighScore) {
          setCrushHighScore(next);
          localStorage.setItem('crush_high', next.toString());
        }
        return next;
      });

      await new Promise(r => setTimeout(r, 200));
      const afterGravity = await applyCrushGravity(temp);
      setCrushBoard(afterGravity);

      await new Promise(r => setTimeout(r, 200));
      await checkAndRunMatches(afterGravity, multiplier + 1);
    }
  };

  const triggerSwapAction = async (idx1, idx2) => {
    const r1 = Math.floor(idx1 / CRUSH_SIZE);
    const c1 = idx1 % CRUSH_SIZE;
    const r2 = Math.floor(idx2 / CRUSH_SIZE);
    const c2 = idx2 % CRUSH_SIZE;
    const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);

    if (isAdjacent) {
      setCrushSwapping(true);
      const swapped = [...crushBoard];
      swapped[idx1] = crushBoard[idx2];
      swapped[idx2] = crushBoard[idx1];
      setCrushBoard(swapped);

      await new Promise(r => setTimeout(r, 150));
      const matches = getCrushMatches(swapped);

      if (matches.length > 0) {
        setCrushMoves(prev => prev - 1);
        await checkAndRunMatches(swapped);
      } else {
        // Rollback
        const rollback = [...swapped];
        rollback[idx1] = swapped[idx2];
        rollback[idx2] = swapped[idx1];
        setCrushBoard(rollback);
      }
      setCrushSwapping(false);
    }
  };

  const handleTileClick = (index) => {
    if (crushMoves <= 0 || crushSwapping) return;
    if (crushSelected === null) {
      setCrushSelected(index);
    } else {
      triggerSwapAction(crushSelected, index);
      setCrushSelected(null);
    }
  };

  // Drag and drop event handlers
  const handleDragStart = (e, index) => {
    if (crushMoves <= 0 || crushSwapping) return;
    setDraggedIdx(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || crushSwapping || crushMoves <= 0) return;
    triggerSwapAction(draggedIdx, index);
    setDraggedIdx(null);
  };

  const openCandyCrush = () => {
    initCrushGame();
    setActiveGame('crush');
    setShowMobileSimulator(true);
  };

  const closeCandyCrush = () => {
    setShowMobileSimulator(false);
    setActiveGame(null);
  };

  return (
    <section id="arcade" className="py-24 px-4 md:px-8 relative bg-[rgba(5,7,17,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-tag">&lt;Creative Zone/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            The Retro <span className="gradient-text">Arcade Hub</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Choose your device mode and play. Experience keyboard snake on desktop, or launch a full-screen mobile smartphone simulator to crush candies.
          </p>
        </div>

        {/* Selection Area / Dashboard */}
        {activeGame === null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {/* Game Card 1: Snake */}
            <div className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between hover:border-[#00f0ff]/40 transition-all group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  🐍
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#f0f3fe]">Retro Snake</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                  Classic 8-bit desktop crawler. Navigate using arrow keys or WASD, collect energy orbs, and beat your high score.
                </p>
                <div className="flex items-center gap-2 mb-6 text-[0.7rem] font-mono text-[#94a3b8] bg-[#050713] p-2.5 rounded-xl border border-white/5">
                  <Monitor size={12} className="text-[#00f0ff]" /> Best Fit: PC / Desktop
                </div>
              </div>
              <button
                onClick={() => { setActiveGame('snake'); setTimeout(initSnakeGame, 100); }}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 hover:text-[#00f0ff] transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                <Play size={13} /> Launch on Canvas
              </button>
            </div>

            {/* Game Card 2: Candy Crush */}
            <div className="bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between hover:border-[#ff0077]/40 transition-all group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#ff0077]/10 border border-[#ff0077]/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  🍬
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#f0f3fe]">Neon Candy Crush</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                  Match-3 puzzle solver. Swipe and drag or click adjacent neon candies to trigger blast combos and gravity cascades.
                </p>
                <div className="flex items-center gap-2 mb-6 text-[0.7rem] font-mono text-[#94a3b8] bg-[#050713] p-2.5 rounded-xl border border-white/5">
                  <Smartphone size={12} className="text-[#ff0077]" /> Best Fit: Mobile / Touch Device
                </div>
              </div>
              <button
                onClick={openCandyCrush}
                className="w-full py-3.5 rounded-xl bg-[#ff0077]/10 border border-[#ff0077]/30 text-[#ff0077] hover:bg-[#ff0077]/20 hover:border-[#ff0077]/50 transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
                style={{ boxShadow: '0 0 20px rgba(255,0,119,0.1)' }}
              >
                <Smartphone size={13} /> Open Smartphone App
              </button>
            </div>
          </div>
        )}

        {/* 🐍 RETRO SNAKE SCREEN */}
        {activeGame === 'snake' && (
          <div className="max-w-[450px] mx-auto bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative">
            {/* Header controls */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-[#94a3b8] flex items-center gap-1.5">
                🏆 Score: <strong className="text-white text-sm">{snakeScore}</strong>
              </span>
              <button
                onClick={() => setActiveGame(null)}
                className="p-1 bg-transparent border-none text-[#94a3b8] hover:text-white cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Snake Canvas Box */}
            <div className="relative w-full aspect-square bg-[#050713] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
              <canvas ref={snakeCanvasRef} width={400} height={400} className="w-full h-full block" />
              
              {/* Game Over Screen */}
              {snakeGameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 text-center p-4">
                  <span className="text-3xl">💀</span>
                  <h3 className="text-xl font-bold text-white">Game Over</h3>
                  <div className="text-xs text-[#94a3b8]">
                    Score: <span className="text-white font-bold">{snakeScore}</span> • Best: <span className="text-[#00f0ff] font-bold">{snakeHighScore}</span>
                  </div>
                  <button
                    onClick={initSnakeGame}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#00f0ff] text-black border-none cursor-pointer flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
                  >
                    <RotateCcw size={12} /> Play Again
                  </button>
                </div>
              )}
            </div>

            {/* Scoreboard info footer */}
            <div className="mt-4 flex justify-between items-center text-[0.7rem] text-[#94a3b8] font-mono">
              <span>High Score: {snakeHighScore}</span>
              <span>Controls: Arrow keys / WASD</span>
            </div>
          </div>
        )}

        {/* 🍬 CANDY CRUSH PHONE SIMULATOR OVERLAY */}
        {showMobileSimulator && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            
            {/* Simulator Smartphone Body */}
            <div className="relative w-full max-w-[370px] h-[670px] bg-[#0c0f1c] border-[8px] border-[#1d233d] rounded-[48px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
              
              {/* Smartphone Notch / Status Bar */}
              <div className="h-6 bg-[#0a0d18] w-full flex justify-between items-center px-6 relative z-10 shrink-0">
                <span className="text-[0.62rem] text-[#94a3b8] font-mono">9:41</span>
                {/* Notch */}
                <div className="w-24 h-4 bg-black rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
                  <div className="w-8 h-1 bg-[#111] rounded-full" />
                </div>
                <span className="text-[0.62rem] text-[#94a3b8] font-mono">🔋 100%</span>
              </div>

              {/* Close Button overlay */}
              <button
                onClick={closeCandyCrush}
                className="absolute top-8 right-4 z-20 w-8 h-8 rounded-full bg-[#181d35] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white cursor-pointer"
                title="Close Game"
              >
                <X size={15} />
              </button>

              {/* Game Viewport Area */}
              <div className="flex-1 flex flex-col justify-between p-5 pt-10">
                {/* App Name */}
                <div className="text-center">
                  <h4 className="text-sm font-black tracking-wider text-[#ff0077]">NEON CRUSH</h4>
                  <div className="flex gap-2 justify-center mt-2">
                    <span className="text-[0.62rem] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#94a3b8]">
                      Moves: <strong className="text-white">{crushMoves}</strong>
                    </span>
                    <span className="text-[0.62rem] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#00f0ff]">
                      Score: <strong className="text-[#00f0ff]">{crushScore}</strong>
                    </span>
                  </div>
                </div>

                {/* 6x6 Matching Grid */}
                <div className="grid grid-cols-6 gap-1 bg-[#050713] p-2 rounded-2xl border border-white/10 aspect-square my-3">
                  {crushBoard.map((typeIdx, i) => {
                    const candy = CANDY_TYPES[typeIdx];
                    const isSelected = crushSelected === i;

                    return (
                      <button
                        key={i}
                        disabled={crushMoves <= 0 || crushSwapping}
                        onClick={() => handleTileClick(i)}
                        draggable={crushMoves > 0 && !crushSwapping}
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, i)}
                        className="w-full h-full aspect-square rounded-lg flex items-center justify-center text-xl cursor-pointer select-none border transition-all duration-150 relative bg-white/[0.02] p-0"
                        style={{
                          borderColor: isSelected ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                          boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none',
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        }}
                      >
                        {candy && (
                          <span 
                            className="block text-center scale-95 md:scale-100"
                            style={{ textShadow: `0 0 8px ${candy.glow}` }}
                          >
                            {candy.char}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Play controls / game state */}
                <div className="space-y-3">
                  {crushMoves <= 0 && (
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#ff0077] animate-pulse">🎮 Game Over! Final Score: {crushScore}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={initCrushGame}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff0077] text-white transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={12} /> {crushMoves <= 0 ? 'Restart' : 'Reset'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Smartphone Home Bar Indicator */}
              <div className="h-4 bg-[#0a0d18] w-full flex justify-center items-center shrink-0">
                <div className="w-28 h-1 bg-white/30 rounded-full" />
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

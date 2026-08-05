import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Award, Zap } from 'lucide-react';

const BOARD_SIZE = 6; // 6x6 grid
const CANDY_TYPES = [
  { char: '💎', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
  { char: '🍬', color: '#ff0077', glow: 'rgba(255, 0, 119, 0.4)' },
  { char: '🌟', color: '#ffcc00', glow: 'rgba(255, 204, 0, 0.4)' },
  { char: '🍀', color: '#39ff14', glow: 'rgba(57, 255, 20, 0.4)' },
  { char: '🔮', color: '#8a2be2', glow: 'rgba(138, 43, 226, 0.4)' }
];

export default function CandyCrush() {
  const [board, setBoard] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(20);
  const [isSwapping, setIsSwapping] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('crush_high') || '0'));

  // Initialize Board
  const createBoard = () => {
    let newBoard = [];
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      let randomCandy;
      // Avoid initial matches of 3 on creation
      do {
        randomCandy = Math.floor(Math.random() * CANDY_TYPES.length);
      } while (
        (i >= 2 && newBoard[i - 1] === randomCandy && newBoard[i - 2] === randomCandy && i % BOARD_SIZE >= 2) ||
        (i >= BOARD_SIZE * 2 && newBoard[i - BOARD_SIZE] === randomCandy && newBoard[i - BOARD_SIZE * 2] === randomCandy)
      );
      newBoard.push(randomCandy);
    }
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(20);
    setSelectedIdx(null);
  };

  useEffect(() => {
    createBoard();
  }, []);

  // Check for matches (3 or more in a row or col)
  const getMatches = (currentBoard) => {
    const matched = new Set();

    // Check horizontal matches
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE - 2; c++) {
        const idx1 = r * BOARD_SIZE + c;
        const idx2 = idx1 + 1;
        const idx3 = idx1 + 2;
        const val = currentBoard[idx1];
        if (val !== null && val === currentBoard[idx2] && val === currentBoard[idx3]) {
          matched.add(idx1);
          matched.add(idx2);
          matched.add(idx3);
        }
      }
    }

    // Check vertical matches
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (let r = 0; r < BOARD_SIZE - 2; r++) {
        const idx1 = r * BOARD_SIZE + c;
        const idx2 = idx1 + BOARD_SIZE;
        const idx3 = idx2 + BOARD_SIZE;
        const val = currentBoard[idx1];
        if (val !== null && val === currentBoard[idx2] && val === currentBoard[idx3]) {
          matched.add(idx1);
          matched.add(idx2);
          matched.add(idx3);
        }
      }
    }

    return Array.from(matched);
  };

  // Shift board down (Gravity) and fill empty tiles
  const applyGravity = async (currentBoard) => {
    let hasChanged = false;
    const tempBoard = [...currentBoard];

    // Shift down empty spaces
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (let r = BOARD_SIZE - 1; r > 0; r--) {
        const idx = r * BOARD_SIZE + c;
        if (tempBoard[idx] === null) {
          // Find first non-null above
          let aboveR = r - 1;
          while (aboveR >= 0 && tempBoard[aboveR * BOARD_SIZE + c] === null) {
            aboveR--;
          }
          if (aboveR >= 0) {
            const aboveIdx = aboveR * BOARD_SIZE + c;
            tempBoard[idx] = tempBoard[aboveIdx];
            tempBoard[aboveIdx] = null;
            hasChanged = true;
          }
        }
      }
    }

    // Fill empty spots at top
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      if (tempBoard[i] === null) {
        tempBoard[i] = Math.floor(Math.random() * CANDY_TYPES.length);
        hasChanged = true;
      }
    }

    return { board: tempBoard, changed: hasChanged };
  };

  // Run the match-3 logic loop (cascades)
  const processMatches = async (currentBoard, multiply = 1) => {
    const matches = getMatches(currentBoard);
    if (matches.length > 0) {
      // Create empty spots
      const tempBoard = [...currentBoard];
      matches.forEach(idx => {
        tempBoard[idx] = null;
      });
      setBoard(tempBoard);

      // Add points
      const pointsEarned = matches.length * 10 * multiply;
      setScore(prev => {
        const newScore = prev + pointsEarned;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('crush_high', newScore.toString());
        }
        return newScore;
      });

      // Wait a tiny moment for visual disappear effect
      await new Promise(resolve => setTimeout(resolve, 200));

      // Apply gravity
      const gravityResult = await applyGravity(tempBoard);
      setBoard(gravityResult.board);

      // Wait for gravity fall animation finish
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check again for cascade matches
      await processMatches(gravityResult.board, multiply + 1);
    }
  };

  const handleTileClick = async (index) => {
    if (movesLeft <= 0 || isSwapping) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      const firstIdx = selectedIdx;
      const secondIdx = index;
      setSelectedIdx(null);

      // Check if they are adjacent
      const r1 = Math.floor(firstIdx / BOARD_SIZE);
      const c1 = firstIdx % BOARD_SIZE;
      const r2 = Math.floor(secondIdx / BOARD_SIZE);
      const c2 = secondIdx % BOARD_SIZE;

      const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || 
                        (Math.abs(c1 - c2) === 1 && r1 === r2);

      if (isAdjacent) {
        setIsSwapping(true);

        // Swap board tiles
        const newBoard = [...board];
        newBoard[firstIdx] = board[secondIdx];
        newBoard[secondIdx] = board[firstIdx];
        setBoard(newBoard);

        // Wait for swap animation
        await new Promise(resolve => setTimeout(resolve, 150));

        // Check if swap results in a match
        const matches = getMatches(newBoard);
        if (matches.length > 0) {
          setMovesLeft(prev => prev - 1);
          await processMatches(newBoard);
        } else {
          // If no matches, swap them back!
          const rolledBackBoard = [...newBoard];
          rolledBackBoard[firstIdx] = newBoard[secondIdx];
          rolledBackBoard[secondIdx] = newBoard[firstIdx];
          setBoard(rolledBackBoard);
        }
        setIsSwapping(false);
      }
    }
  };

  return (
    <section id="arcade" className="py-24 px-4 md:px-8 relative bg-[rgba(5,7,17,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-tag">&lt;Interactive Mini-Game/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            Neon <span className="gradient-text">Candy Crush</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Swap adjacent neon blocks to match 3 or more of the same type. Score combos and chain reactions!
          </p>
        </div>

        {/* Game Area */}
        <div className="max-w-[700px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Stats Column */}
          <div className="flex flex-col justify-between gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#00f0ff] flex items-center gap-2">
                <Zap size={16} /> Game Stats
              </h3>

              {/* Move counter */}
              <div className="flex justify-between items-center bg-[#050713] px-4 py-3 rounded-xl border border-white/5">
                <span className="text-xs text-[#94a3b8] font-medium uppercase">Moves Left</span>
                <span className="text-xl font-bold font-mono text-white">{movesLeft}</span>
              </div>

              {/* Current Score */}
              <div className="flex justify-between items-center bg-[#050713] px-4 py-3 rounded-xl border border-white/5">
                <span className="text-xs text-[#94a3b8] font-medium uppercase flex items-center gap-1">
                  <Trophy size={12} className="text-[#ffcc00]" /> Score
                </span>
                <span className="text-xl font-bold font-mono text-[#00f0ff]">{score}</span>
              </div>

              {/* Best Score */}
              <div className="flex justify-between items-center bg-[#050713] px-4 py-3 rounded-xl border border-white/5">
                <span className="text-xs text-[#94a3b8] font-medium uppercase flex items-center gap-1">
                  <Award size={12} className="text-[#ff0077]" /> Best
                </span>
                <span className="text-xl font-bold font-mono text-[#ff0077]">{highScore}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              {movesLeft <= 0 && (
                <div className="text-center py-2 text-xs font-bold text-[#ff0077] animate-pulse">
                  🎮 Game Over!
                </div>
              )}
              <button
                onClick={createBoard}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-white/[0.08] transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={13} /> {movesLeft <= 0 ? 'Play Again' : 'Restart Board'}
              </button>
            </div>
          </div>

          {/* 6x6 Candy Board */}
          <div className="grid grid-cols-6 gap-2 bg-[#050713] p-3 rounded-2xl border border-white/10 aspect-square">
            {board.map((typeIdx, i) => {
              const candy = CANDY_TYPES[typeIdx];
              const isSelected = selectedIdx === i;

              return (
                <button
                  key={i}
                  disabled={movesLeft <= 0 || isSwapping}
                  onClick={() => handleTileClick(i)}
                  className="w-full h-full aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer select-none border transition-all duration-150 relative bg-white/[0.02]"
                  style={{
                    borderColor: isSelected 
                      ? 'var(--primary-color)' 
                      : 'rgba(255, 255, 255, 0.06)',
                    boxShadow: isSelected 
                      ? `0 0 15px var(--primary-glow)` 
                      : 'none',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    zIndex: isSelected ? 10 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!isSelected && movesLeft > 0) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected && movesLeft > 0) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }
                  }}
                >
                  {/* Glowing candy piece */}
                  {candy && (
                    <span 
                      className="transition-all animate-fade-in block"
                      style={{ 
                        textShadow: `0 0 10px ${candy.glow}`,
                      }}
                    >
                      {candy.char}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

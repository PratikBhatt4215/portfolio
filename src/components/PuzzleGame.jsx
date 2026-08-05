import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';

export default function PuzzleGame() {
  const [board, setBoard] = useState([1, 2, 3, 4, 5, 6, 7, 8, null]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isImageMode, setIsImageMode] = useState(true);

  // Check if board is solved
  const checkWin = (currentBoard) => {
    const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    return currentBoard.every((val, index) => val === winState[index]);
  };

  // Check if puzzle is solvable
  const isSolvable = (grid) => {
    let inversions = 0;
    const list = grid.filter(x => x !== null);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i] > list[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  // Shuffle board
  const shuffleBoard = () => {
    let shuffled;
    do {
      shuffled = [1, 2, 3, 4, 5, 6, 7, 8, null];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (!isSolvable(shuffled) || checkWin(shuffled));

    setBoard(shuffled);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    shuffleBoard();
  }, []);

  const handleTileClick = (index) => {
    if (isWon) return;

    const row = Math.floor(index / 3);
    const col = index % 3;

    // Find empty index
    const emptyIndex = board.indexOf(null);
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if clicked tile is adjacent to empty tile
    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newBoard = [...board];
      newBoard[emptyIndex] = board[index];
      newBoard[index] = null;
      setBoard(newBoard);
      setMoves(prev => prev + 1);

      if (checkWin(newBoard)) {
        setIsWon(true);
      }
    }
  };

  // Helper to get background position for image pieces
  const getBgPos = (value) => {
    if (value === null) return '';
    const index = value - 1;
    const x = (index % 3) * 50; // 50% spacing
    const y = Math.floor(index / 3) * 50;
    return `${x}% ${y}%`;
  };

  return (
    <section id="arcade" className="py-24 px-4 md:px-8 relative bg-[rgba(5,7,17,0.6)]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-tag">&lt;Interactive Mini-Game/&gt;</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">
            The Grid <span className="gradient-text">Slide Puzzle</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Slide the glowing tiles to reconstruct the picture or align numbers 1 to 8. Simple, satisfying, and quick!
          </p>
        </div>

        {/* Puzzle Board Container */}
        <div className="max-w-[450px] mx-auto bg-[rgba(18,22,40,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Top Panel stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <span className="font-mono text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[#94a3b8]">
                ⚡ {moves} moves
              </span>
            </div>
            <button
              onClick={() => setIsImageMode(!isImageMode)}
              className="text-xs font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#94a3b8] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-colors cursor-pointer"
            >
              Mode: {isImageMode ? '🖼️ Image' : '🔢 Numbers'}
            </button>
          </div>

          {/* Actual 3x3 Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#050713] p-3 rounded-2xl border border-white/10 aspect-square">
            {board.map((val, i) => {
              const isCorrectPos = val !== null && val === i + 1;
              const isEmpty = val === null;

              return (
                <button
                  key={i}
                  disabled={isEmpty || isWon}
                  onClick={() => handleTileClick(i)}
                  className={`w-full h-full rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-150 select-none overflow-hidden relative border ${
                    isEmpty 
                      ? 'border-transparent bg-transparent cursor-default' 
                      : 'border-white/10 text-white shadow-lg'
                  }`}
                  style={{
                    background: isEmpty
                      ? 'transparent'
                      : isImageMode
                        ? `url('/pratik-profile.jpg')`
                        : 'rgba(255, 255, 255, 0.04)',
                    backgroundSize: '300% 300%',
                    backgroundPosition: isImageMode ? getBgPos(val) : '',
                    borderColor: isCorrectPos ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                    boxShadow: isCorrectPos ? 'inset 0 0 12px var(--primary-glow)' : 'none',
                    transform: isEmpty ? 'none' : 'scale(0.98) translateZ(0)',
                  }}
                  onMouseEnter={e => {
                    if (!isEmpty && !isWon) {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isEmpty && !isWon) {
                      e.currentTarget.style.borderColor = isCorrectPos ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                >
                  {/* Numbers overlay when image mode is off, or showing mini helper number in image mode */}
                  {!isEmpty && (
                    <>
                      {!isImageMode ? (
                        <span className="text-xl font-black font-mono tracking-tighter" style={{ color: isCorrectPos ? 'var(--primary-color)' : '#f0f3fe' }}>
                          {val}
                        </span>
                      ) : (
                        <span className="absolute top-1 left-1.5 text-[0.6rem] font-mono opacity-50 bg-[#050713]/80 px-1 rounded border border-white/5">
                          {val}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Overlay banner */}
          {isWon && (
            <div className="mt-5 p-4 rounded-xl border border-[#27c93f]/30 bg-[#27c93f]/5 text-center flex flex-col items-center gap-1.5 animate-pulse">
              <Trophy className="text-[#27c93f]" size={24} />
              <h4 className="text-sm font-bold text-[#f0f3fe]">Solved in {moves} moves!</h4>
              <p className="text-xs text-[#94a3b8]">You have excellent spatial logic. 🏆</p>
            </div>
          )}

          {/* Reset / Action button */}
          <div className="mt-5">
            <button
              onClick={shuffleBoard}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-white/[0.08] transition-all text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} /> {isWon ? 'Play Again' : 'Shuffle Board'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

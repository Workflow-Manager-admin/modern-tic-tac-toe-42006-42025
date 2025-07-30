import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Color constants based on provided theme
 */
const COLORS = {
  primary: "#4F8A8B",
  secondary: "#FBD46D",
  accent: "#FF6363",
  boardBg: "#fff", // or use the light theme background
};

const initialBoard = () => Array(9).fill(null);

/**
 * Calculate winner and winning line based on board state
 * @param {Array} squares Array of 9 cell values
 * @returns {{winner: string|null, line: Array<number>|null}}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  // State
  const [board, setBoard] = useState(initialBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });

  // Responsiveness: for mobile layout tweak
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 500);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update winner on board change
  useEffect(() => {
    setWinnerInfo(calculateWinner(board));
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winnerInfo.winner) return;
    const next = [...board];
    next[idx] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(initialBoard());
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
  }

  // Game status handling
  const movesLeft = board.includes(null);
  let status;
  if (winnerInfo.winner) {
    status = (
      <span style={{ color: COLORS.primary, fontWeight: 600 }}>
        Winner: {winnerInfo.winner}
      </span>
    );
  } else if (!movesLeft) {
    status = (
      <span style={{ color: COLORS.accent, fontWeight: 600 }}>
        Draw!
      </span>
    );
  } else {
    status = (
      <span>
        Current Turn:{" "}
        <span style={{
          color: xIsNext ? COLORS.primary : COLORS.accent,
          fontWeight: 600,
          letterSpacing: "1px"
        }}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  // Render Board (3x3)
  function renderSquare(idx) {
    const highlight =
      winnerInfo.line && winnerInfo.line.includes(idx) ? "square--highlight" : "";
    return (
      <button
        className={`board-square ${highlight}`}
        onClick={() => handleClick(idx)}
        key={idx}
        aria-label={`cell ${idx + 1} ${board[idx] ? board[idx] : ""}`}
        disabled={!!board[idx] || !!winnerInfo.winner}
        tabIndex={movesLeft && !winnerInfo.winner ? 0 : -1}
      >
        {board[idx]}
      </button>
    );
  }

  return (
    <div className="ttt-app-outer" style={{ background: COLORS.boardBg }}>
      <main className="ttt-main-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary }}>
          Tic Tac Toe
        </h1>
        <div className="ttt-status">{status}</div>
        <Board
          renderSquare={renderSquare}
          isMobile={isMobile}
        />
        <GameControls
          onReset={handleReset}
          disabled={board.every(c => c === null)}
          accent={COLORS.accent}
          secondary={COLORS.secondary}
        />
        <footer className="ttt-footer">
          <span style={{ fontSize: '13px', color: '#999' }}>
            Two Player Local | Minimal Design
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ renderSquare, isMobile }) {
  return (
    <div
      className={`ttt-board ${isMobile ? "ttt-board--mobile" : ""}`}
      role="grid"
      aria-label="tic tac toe board"
    >
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function GameControls({ onReset, disabled, accent, secondary }) {
  return (
    <div className="ttt-controls">
      <button
        className="ttt-reset-btn"
        onClick={onReset}
        disabled={disabled}
        style={{
          background: accent,
          color: "#fff",
          borderColor: secondary,
          opacity: disabled ? 0.6 : 1,
        }}
        aria-label="Reset Board"
      >
        Reset Board
      </button>
    </div>
  );
}

export default App;

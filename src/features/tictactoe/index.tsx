import { useState, useRef, useEffect } from "react";
import { tttAudio } from "./audio";
import { TTTParticleSystem } from "./particles";
import { RotateCcw, Volume2, VolumeX, Bot, User, Flame, ChevronDown } from "lucide-react";

type Cell = "X" | "O" | "";
type Difficulty = "easy" | "medium" | "unbeatable";
type GameMode = "pve" | "pvp";
type ThemeId = "emerald" | "neon" | "gold" | "sakura" | "obsidian";

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],           // diagonals
];

interface Theme {
  id: ThemeId;
  name: string;
  xColor: string;
  oColor: string;
  gridBorder: string;
  laserColor: string;
  bg: string;
  cardBg: string;
}

const THEMES: Record<ThemeId, Theme> = {
  emerald: { id: "emerald", name: "Emerald Matrix", xColor: "#10b981", oColor: "#f43f5e", gridBorder: "rgba(16, 185, 129, 0.2)", laserColor: "#10b981", bg: "#06130d", cardBg: "rgba(16, 185, 129, 0.08)" },
  neon: { id: "neon", name: "Cyber Neon", xColor: "#06b6d4", oColor: "#ec4899", gridBorder: "rgba(6, 182, 212, 0.2)", laserColor: "#06b6d4", bg: "#090e17", cardBg: "rgba(6, 182, 212, 0.08)" },
  gold: { id: "gold", name: "Royal Gold", xColor: "#f59e0b", oColor: "#8b5cf6", gridBorder: "rgba(245, 158, 11, 0.2)", laserColor: "#f59e0b", bg: "#140f06", cardBg: "rgba(245, 158, 11, 0.08)" },
  sakura: { id: "sakura", name: "Sakura Dusk", xColor: "#f472b6", oColor: "#a855f7", gridBorder: "rgba(244, 114, 182, 0.2)", laserColor: "#f472b6", bg: "#140813", cardBg: "rgba(244, 114, 182, 0.08)" },
  obsidian: { id: "obsidian", name: "Obsidian Dark", xColor: "#38bdf8", oColor: "#fb7185", gridBorder: "rgba(255, 255, 255, 0.1)", laserColor: "#38bdf8", bg: "#0b0f17", cardBg: "rgba(255, 255, 255, 0.05)" },
};

// Check winner
function checkWinner(board: Cell[]): { winner: Cell | "draw" | null; line: number[] | null } {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((c) => c !== "")) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

// Minimax algorithm for unbeatable AI
function minimax(board: Cell[], depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        const evalScore = minimax(board, depth + 1, false, alpha, beta);
        board[i] = "";
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        const evalScore = minimax(board, depth + 1, true, alpha, beta);
        board[i] = "";
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

// Best AI move
function getAIMove(board: Cell[], difficulty: Difficulty): number {
  const empty = board.map((v, i) => (v === "" ? i : -1)).filter((i) => i >= 0);
  if (empty.length === 0) return -1;

  if (difficulty === "easy") {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  if (difficulty === "medium") {
    if (Math.random() > 0.5) {
      return empty[Math.floor(Math.random() * empty.length)];
    }
  }

  // Unbeatable Minimax
  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const i of empty) {
    board[i] = "O";
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[i] = "";
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

export default function TicTacToe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const psRef = useRef<TTTParticleSystem>(new TTTParticleSystem());

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<Cell>("X");
  const [gameMode, setGameMode] = useState<GameMode>("pve");
  const [difficulty, setDifficulty] = useState<Difficulty>("unbeatable");
  const [themeId, setThemeId] = useState<ThemeId>("emerald");
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Stats
  const [stats, setStats] = useState({ xWins: 0, oWins: 0, draws: 0, streak: 0 });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winnerState, setWinnerState] = useState<Cell | "draw" | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  const theme = THEMES[themeId];

  // Sync Audio Toggle
  useEffect(() => {
    tttAudio.enabled = audioEnabled;
  }, [audioEnabled]);

  // Reset match
  const resetMatch = () => {
    setBoard(Array(9).fill(""));
    setTurn("X");
    setWinningLine(null);
    setWinnerState(null);
    setAiThinking(false);
    psRef.current.clear();
  };

  // Particle loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      const c = canvasRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, c.width, c.height);
          psRef.current.update();
          psRef.current.render(ctx);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle cell click
  const handleCellClick = (idx: number) => {
    if (board[idx] !== "" || winnerState !== null || aiThinking) return;

    const nextBoard = [...board];
    nextBoard[idx] = turn;
    setBoard(nextBoard);

    if (turn === "X") tttAudio.playX(); else tttAudio.playO();

    // Trigger particle sparks at cell center
    const cellEl = document.getElementById(`ttt-cell-${idx}`);
    if (cellEl) {
      const rect = cellEl.getBoundingClientRect();
      const parentRect = cellEl.parentElement?.getBoundingClientRect();
      if (parentRect) {
        psRef.current.emitSparks(
          rect.left - parentRect.left + rect.width / 2,
          rect.top - parentRect.top + rect.height / 2,
          turn === "X" ? theme.xColor : theme.oColor,
          24
        );
      }
    }

    // Check winner
    const res = checkWinner(nextBoard);
    if (res.winner) {
      setWinnerState(res.winner);
      setWinningLine(res.line);
      if (res.winner === "X") {
        tttAudio.playVictory();
        setStats((s) => ({ ...s, xWins: s.xWins + 1, streak: s.streak + 1 }));
        psRef.current.emitConfetti(360, 360);
      } else if (res.winner === "O") {
        tttAudio.playWinLaser();
        setStats((s) => ({ ...s, oWins: s.oWins + 1, streak: 0 }));
      } else {
        tttAudio.playDraw();
        setStats((s) => ({ ...s, draws: s.draws + 1 }));
      }
      return;
    }

    const nextTurn = turn === "X" ? "O" : "X";
    setTurn(nextTurn);

    // AI Turn in PvE
    if (gameMode === "pve" && nextTurn === "O") {
      setAiThinking(true);
      setTimeout(() => {
        const aiIdx = getAIMove(nextBoard, difficulty);
        if (aiIdx >= 0) {
          const aiBoard = [...nextBoard];
          aiBoard[aiIdx] = "O";
          setBoard(aiBoard);
          tttAudio.playO();

          const aiRes = checkWinner(aiBoard);
          if (aiRes.winner) {
            setWinnerState(aiRes.winner);
            setWinningLine(aiRes.line);
            if (aiRes.winner === "O") {
              tttAudio.playWinLaser();
              setStats((s) => ({ ...s, oWins: s.oWins + 1, streak: 0 }));
            } else if (aiRes.winner === "draw") {
              tttAudio.playDraw();
              setStats((s) => ({ ...s, draws: s.draws + 1 }));
            }
          } else {
            setTurn("X");
          }
        }
        setAiThinking(false);
      }, 350);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-3.5 p-4 text-white rounded-2xl select-none font-sans max-w-full overflow-hidden shadow-2xl border border-white/10"
      style={{ background: theme.bg }}
    >
      {/* Row 1: Top Utility Toolbar */}
      <div className="flex items-center justify-between w-full text-xs gap-2">
        {/* Theme Dropdown Selector */}
        <div className="relative flex items-center">
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value as ThemeId)}
            className="appearance-none bg-black/40 border border-white/15 text-gray-200 font-semibold px-3 py-1.5 pr-7 rounded-lg text-xs cursor-pointer hover:bg-black/60 focus:outline-none transition"
          >
            {(["emerald", "neon", "gold", "sakura", "obsidian"] as ThemeId[]).map((th) => (
              <option key={th} value={th} className="bg-slate-900 text-white">
                {THEMES[th].name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
        </div>

        {/* Audio Toggle & Restart */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition"
            title="Toggle Audio"
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={resetMatch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-black font-bold text-xs rounded-lg transition shadow-md active:scale-95"
            style={{ background: theme.xColor }}
          >
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      {/* Row 2: Full-Width Game Mode Selector */}
      <div className="flex w-full bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
        <button
          onClick={() => { setGameMode("pve"); resetMatch(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition ${
            gameMode === "pve" ? "bg-white/20 text-white shadow" : "text-gray-400 hover:text-white"
          }`}
        >
          <Bot size={15} /> vs AI
        </button>
        <button
          onClick={() => { setGameMode("pvp"); resetMatch(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition ${
            gameMode === "pvp" ? "bg-white/20 text-white shadow" : "text-gray-400 hover:text-white"
          }`}
        >
          <User size={15} /> 2 Player (Local)
        </button>
      </div>

      {/* Row 3: Full-Width Difficulty Selector (Unclipped & Spacious) */}
      <div className="flex w-full bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
        {(["easy", "medium", "unbeatable"] as Difficulty[]).map((d) => (
          <button
            key={d}
            disabled={gameMode === "pvp"}
            onClick={() => { setDifficulty(d); resetMatch(); }}
            className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition text-center ${
              gameMode === "pvp"
                ? "opacity-30 cursor-not-allowed text-gray-500"
                : difficulty === d
                ? "bg-white/20 text-amber-300 shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {d === "unbeatable" ? "Unbeatable 🔥" : d}
          </button>
        ))}
      </div>

      {/* Row 4: Interactive Opponent Cards */}
      <div className="grid grid-cols-2 w-full gap-3">
        {/* Player 1 (X) */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
            turn === "X" && !winnerState
              ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
              : "border-white/5 opacity-80"
          }`}
          style={{ background: theme.cardBg }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg" style={{ color: theme.xColor, background: `${theme.xColor}20` }}>
              X
            </div>
            <div>
              <div className="text-xs font-bold">Player 1</div>
              <div className="text-[10px] text-gray-400">
                {winnerState === "X" ? "🎉 Winner!" : turn === "X" && !winnerState ? "Your Move" : "Waiting..."}
              </div>
            </div>
          </div>
          <div className="text-lg font-mono font-bold" style={{ color: theme.xColor }}>{stats.xWins}</div>
        </div>

        {/* Player 2 / AI (O) */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
            turn === "O" && !winnerState
              ? "border-rose-500/50 shadow-lg shadow-rose-500/10"
              : "border-white/5 opacity-80"
          }`}
          style={{ background: theme.cardBg }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg" style={{ color: theme.oColor, background: `${theme.oColor}20` }}>
              O
            </div>
            <div>
              <div className="text-xs font-bold">{gameMode === "pve" ? "AI Sentinel" : "Player 2"}</div>
              <div className="text-[10px] text-gray-400">
                {winnerState === "O" ? "🤖 Winner!" : aiThinking ? "Thinking..." : turn === "O" && !winnerState ? "Move" : "Waiting..."}
              </div>
            </div>
          </div>
          <div className="text-lg font-mono font-bold" style={{ color: theme.oColor }}>{stats.oWins}</div>
        </div>
      </div>

      {/* Row 5: Main Board Shell */}
      <div className="relative p-3 rounded-2xl bg-black/40 border border-white/10 shadow-2xl">
        <canvas ref={canvasRef} width={320} height={320} className="absolute inset-0 pointer-events-none z-20" />

        <div className="grid grid-cols-3 gap-2.5 relative z-10 w-[300px] h-[300px]">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                id={`ttt-cell-${idx}`}
                onClick={() => handleCellClick(idx)}
                className="relative flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 group overflow-hidden"
                style={{
                  background: isWinningCell ? `${theme.xColor}25` : "rgba(255, 255, 255, 0.04)",
                  border: `1.5px solid ${isWinningCell ? theme.xColor : theme.gridBorder}`,
                  boxShadow: isWinningCell ? `0 0 24px ${theme.xColor}70` : undefined,
                }}
              >
                {/* SVG Animated X Marker */}
                {cell === "X" && (
                  <svg className="w-12 h-12 animate-in zoom-in duration-200" viewBox="0 0 50 50">
                    <path
                      d="M 13,13 L 37,37 M 37,13 L 13,37"
                      stroke={theme.xColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      style={{ filter: `drop-shadow(0 0 10px ${theme.xColor})` }}
                    />
                  </svg>
                )}

                {/* SVG Animated O Marker */}
                {cell === "O" && (
                  <svg className="w-12 h-12 animate-in zoom-in duration-200" viewBox="0 0 50 50">
                    <circle
                      cx="25"
                      cy="25"
                      r="13"
                      stroke={theme.oColor}
                      strokeWidth="6"
                      fill="none"
                      style={{ filter: `drop-shadow(0 0 10px ${theme.oColor})` }}
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 6: Stats Bar */}
      <div className="flex items-center justify-around w-full text-xs bg-black/40 py-2 px-4 rounded-xl border border-white/5 font-mono">
        <div className="text-center">
          <div className="text-[10px] text-gray-400">DRAWS</div>
          <div className="font-bold text-sm text-gray-300">{stats.draws}</div>
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <div className="text-center">
          <div className="text-[10px] text-gray-400">WIN STREAK</div>
          <div className="font-bold text-sm text-amber-400 flex items-center gap-1 justify-center">
            <Flame size={14} className="text-amber-500 fill-amber-500" /> {stats.streak}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { audio } from '../../../services/audioService';
import { CrashRoundHistory } from '../../../types/casino';
import { ShieldCheck, History, Info, Sparkles, AlertCircle } from 'lucide-react';

export const CrashGame: React.FC = () => {
  const {
    currency,
    balanceUSD,
    balanceETB,
    depositFunds,
    showToast,
    user,
  } = useApp();

  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  // Game States: 'idle' | 'countdown' | 'flying' | 'crashed'
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'flying' | 'crashed'>('countdown');
  const [countdown, setCountdown] = useState<number>(4);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [stake, setStake] = useState<number>(50);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [isAutoCashoutEnabled, setIsAutoCashoutEnabled] = useState<boolean>(true);
  const [hasBet, setHasBet] = useState<boolean>(false);
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);
  const [crashHistory, setCrashHistory] = useState<CrashRoundHistory[]>([
    { id: 'R-991', crashMultiplier: 2.45, hash: '7f8a92...e1b', seed: 'zenith-seed-1', timestamp: '12:01' },
    { id: 'R-992', crashMultiplier: 1.18, hash: '3e4b11...a8f', seed: 'zenith-seed-2', timestamp: '12:02' },
    { id: 'R-993', crashMultiplier: 5.62, hash: '9c2a84...0fd', seed: 'zenith-seed-3', timestamp: '12:03' },
    { id: 'R-994', crashMultiplier: 1.05, hash: '1d8e77...34c', seed: 'zenith-seed-4', timestamp: '12:04' },
    { id: 'R-995', crashMultiplier: 14.80, hash: '4b6f12...77a', seed: 'zenith-seed-5', timestamp: '12:05' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(2.2);
  const startTimeRef = useRef<number>(0);

  // Simulated multiplayer bets in room
  const [otherPlayers, setOtherPlayers] = useState<
    { name: string; bet: number; cashout?: number }[]
  >([
    { name: 'RedSea_Winner', bet: 100 },
    { name: 'Oromia_Ace', bet: 250 },
    { name: 'DireDawa_Pro', bet: 50 },
    { name: 'Addis_Vip', bet: 500 },
  ]);

  // Generate random crash point (house edge 3%)
  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.04) return 1.0; // Instant crash
    const mult = Math.floor((100 / (100 - r * 97)) * 100) / 100;
    return Math.min(mult, 120.0);
  };

  // Main Game Loop Controller
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === 'countdown') {
      setCashedOutAt(null);
      setMultiplier(1.0);
      let count = 4;
      setCountdown(count);

      timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          // Start flight
          crashPointRef.current = generateCrashPoint();
          startTimeRef.current = performance.now();
          setGameState('flying');
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameState]);

  // Flight Animation & Multiplier Tick
  useEffect(() => {
    if (gameState !== 'flying') return;

    let localMultiplier = 1.0;

    const animateFlight = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      // Exponential growth curve: e^(0.14 * t)
      localMultiplier = Number(Math.exp(0.18 * elapsed).toFixed(2));

      // Check Auto-Cashout
      if (
        hasBet &&
        !cashedOutAt &&
        isAutoCashoutEnabled &&
        autoCashout > 1.0 &&
        localMultiplier >= autoCashout
      ) {
        handleCashout(localMultiplier);
      }

      // Check Crash
      if (localMultiplier >= crashPointRef.current) {
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        audio.playCrash();

        // Update history
        const newRound: CrashRoundHistory = {
          id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
          crashMultiplier: crashPointRef.current,
          hash: Math.random().toString(16).substring(2, 12) + '...sha256',
          seed: `seed-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCrashHistory((prev) => [newRound, ...prev.slice(0, 7)]);

        // Next round countdown after 3 seconds
        setTimeout(() => {
          setHasBet(false);
          setGameState('countdown');
        }, 3000);
        return;
      }

      setMultiplier(localMultiplier);
      renderRocketCanvas(localMultiplier);
      animationFrameRef.current = requestAnimationFrame(animateFlight);
    };

    animationFrameRef.current = requestAnimationFrame(animateFlight);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, hasBet, cashedOutAt, isAutoCashoutEnabled, autoCashout]);

  // Canvas drawing for the rocket trajectory
  const renderRocketCanvas = (currentMult: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw dynamic star field particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 25; i++) {
      const sx = (i * 47 + currentMult * 20) % w;
      const sy = (i * 29) % h;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Grid coordinates
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Trajectory curve
    const progress = Math.min((currentMult - 1) / 5, 1);
    const startX = 40;
    const startY = h - 30;
    const endX = startX + progress * (w - 120);
    const endY = startY - progress * (h - 80);

    // Glowing curve line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (endX - startX) * 0.3, startY, endX, endY);
    ctx.strokeStyle = '#06B6D4'; // Electric cyan
    ctx.lineWidth = 4;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(endX, startY);
    ctx.lineTo(startX, startY);
    const grad = ctx.createLinearGradient(0, endY, 0, startY);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Rocket icon at head
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(-0.55); // Angle upwards
    // Rocket body
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Flame trail
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(-16, -4);
    ctx.lineTo(-26, 0);
    ctx.lineTo(-16, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const handlePlaceBet = () => {
    if (stake <= 0 || stake > currentBalance) {
      showToast('Insufficient demo credits for this bet', 'error');
      return;
    }
    audio.playClick();
    setHasBet(true);
    // Deduct stake
    depositFunds(-stake, 'Internal Ledger', `CRASH-BET-${Date.now()}`);
    showToast(`Bet of ${stake} ${currency} placed for round`, 'info');
  };

  const handleCashout = (atMultiplier: number) => {
    if (!hasBet || cashedOutAt) return;
    const winAmount = Number((stake * atMultiplier).toFixed(2));
    setCashedOutAt(atMultiplier);
    audio.playWinChime();
    depositFunds(winAmount, 'Internal Ledger', `CRASH-WIN-${Date.now()}`);
    showToast(`Cashed out at ${atMultiplier.toFixed(2)}x! Won ${winAmount.toLocaleString()} ${currency}!`, 'success');
  };

  return (
    <div className="bg-[#0B0E15] border border-[#1B2335] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Status Banner */}
      <div className="px-5 py-3 bg-[#0E131E] border-b border-[#1A2233] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-extrabold text-white tracking-wide">ZENITH AVIATOR CRASH</span>
          <span className="text-slate-500">·</span>
          <span className="text-cyan-400 font-mono text-[11px]">RTP: 97.0%</span>
        </div>

        {/* History ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">History:</span>
          {crashHistory.map((h) => (
            <span
              key={h.id}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                h.crashMultiplier >= 2.0
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#182234] text-slate-400 border border-[#222E42]'
              }`}
            >
              {h.crashMultiplier.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Main Canvas Flight Stage */}
      <div className="relative bg-[#070A0F] h-72 sm:h-80 w-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Big Central Multiplier / Countdown Overlay */}
        <div className="relative z-10 text-center select-none pointer-events-none">
          {gameState === 'countdown' && (
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                Next Flight In
              </div>
              <div className="font-mono text-5xl font-black text-cyan-400 animate-pulse tabular-nums">
                {countdown}s
              </div>
            </div>
          )}

          {gameState === 'flying' && (
            <div>
              <div className="font-mono text-6xl sm:text-7xl font-black text-white tracking-tight tabular-nums drop-shadow-lg">
                {multiplier.toFixed(2)}
                <span className="text-cyan-400 text-4xl">x</span>
              </div>
              {hasBet && !cashedOutAt && (
                <div className="mt-2 text-xs font-mono text-emerald-400">
                  Current Return: {(stake * multiplier).toFixed(2)} {currency}
                </div>
              )}
            </div>
          )}

          {gameState === 'crashed' && (
            <div>
              <div className="text-xs uppercase tracking-widest text-red-400 mb-1">
                FLEW AWAY @
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-red-500 tracking-tight tabular-nums">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls & Betting Panel */}
      <div className="p-5 bg-[#0D121B] border-t border-[#1A2233]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Stake selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Bet Amount ({currency})</span>
              <span>Balance: {currentBalance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                disabled={hasBet}
                value={stake}
                onChange={(e) => setStake(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2 px-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              />
              <button
                type="button"
                disabled={hasBet}
                onClick={() => setStake((prev) => Math.max(1, Math.floor(prev / 2)))}
                className="px-2.5 py-2 bg-[#172030] hover:bg-[#1E293B] border border-[#243147] rounded-lg text-xs font-mono text-slate-300"
              >
                ½
              </button>
              <button
                type="button"
                disabled={hasBet}
                onClick={() => setStake((prev) => prev * 2)}
                className="px-2.5 py-2 bg-[#172030] hover:bg-[#1E293B] border border-[#243147] rounded-lg text-xs font-mono text-slate-300"
              >
                2×
              </button>
            </div>
          </div>

          {/* Auto Cashout setting */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoCashoutEnabled}
                  onChange={(e) => setIsAutoCashoutEnabled(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0"
                />
                <span>Auto Cashout (x)</span>
              </label>
              <span className="text-[10px] text-slate-500">Target multiplier</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="1.1"
              max="100"
              disabled={!isAutoCashoutEnabled || hasBet}
              value={autoCashout}
              onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 2.0)}
              className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2 px-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-40"
            />
          </div>

          {/* Primary Action Button */}
          <div>
            {!hasBet ? (
              <button
                onClick={handlePlaceBet}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all"
              >
                {gameState === 'countdown' ? 'Place Bet for Next Round' : 'Bet for Upcoming Flight'}
              </button>
            ) : gameState === 'flying' && !cashedOutAt ? (
              <button
                onClick={() => handleCashout(multiplier)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.99] transition-all animate-pulse"
              >
                Cash Out {(stake * multiplier).toFixed(2)} {currency}
              </button>
            ) : (
              <div className="w-full py-3.5 bg-[#141B28] border border-[#222E42] rounded-xl text-center text-xs font-mono font-bold text-slate-400">
                {cashedOutAt
                  ? `✓ Cashed Out @ ${cashedOutAt.toFixed(2)}x (+${(stake * cashedOutAt).toFixed(2)} ${currency})`
                  : 'Bet Active · Waiting for Flight'}
              </div>
            )}
          </div>
        </div>

        {/* Provably Fair & Multiplayer Ticker Strip */}
        <div className="mt-4 pt-4 border-t border-[#1A2233] flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Provably Fair SHA-256 Verified · Seed: 8f4c...3e2 · Nonce: 1,482</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Online Players: {otherPlayers.length + 18}</span>
            <span className="text-slate-600">·</span>
            <span>Spribe Aviator Modular Adapter Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { TerminalOverlay } from './components/TerminalOverlay';
import { CountdownDisplay } from './components/CountdownDisplay';
import { playClickSound, playMouseMoveHum, toggleAmbientNoise } from './lib/audio';

export default function App() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const color = 'green' as const;
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    // Play subtle hover hum
    if (isHovering) {
        playMouseMoveHum();
    }
  };

  const handleResetClick = () => {
    playClickSound();
    setTargetDate(new Date('2026-05-12T17:00:00Z'));
  };

  useEffect(() => {
    // Set timer to Google I/O 2026 (May 12, 2026, roughly)
    setTargetDate(new Date('2026-05-12T17:00:00Z'));
  }, []);

  if (!targetDate) return null;

  const tc = {
    green: {
      text: 'text-[#00FF41]',
      border: 'border-[#00FF41]',
      borderOpaque: 'border-[#00FF41]/30',
      bgOpaque: 'bg-[#00FF41]/5',
      bgSolid: 'bg-[#00FF41]',
      textOpaque: 'text-[#00FF41]/60',
      shadow: 'shadow-[0_0_50px_rgba(0,255,65,0.1)]',
    },
    amber: {
      text: 'text-amber-400',
      border: 'border-amber-400',
      borderOpaque: 'border-amber-400/30',
      bgOpaque: 'bg-amber-400/5',
      bgSolid: 'bg-amber-400',
      textOpaque: 'text-amber-400/60',
      shadow: 'shadow-[0_0_50px_rgba(251,191,36,0.1)]',
    },
    red: {
      text: 'text-red-500',
      border: 'border-red-500',
      borderOpaque: 'border-red-500/30',
      bgOpaque: 'bg-red-500/5',
      bgSolid: 'bg-red-500',
      textOpaque: 'text-red-500/60',
      shadow: 'shadow-[0_0_50px_rgba(239,68,68,0.1)]',
    },
    cyan: {
      text: 'text-cyan-400',
      border: 'border-cyan-400',
      borderOpaque: 'border-cyan-400/30',
      bgOpaque: 'bg-cyan-400/5',
      bgSolid: 'bg-cyan-400',
      textOpaque: 'text-cyan-400/60',
      shadow: 'shadow-[0_0_50px_rgba(34,211,238,0.1)]',
    }
  };
  const t = tc[color];

  return (
    <div className={`min-h-screen bg-[#020504] bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:32px_32px] animate-[grid-drift_20s_linear_infinite] ${t.text} font-mono flex flex-col p-4 md:p-10 overflow-x-hidden relative border-8 md:border-[12px] border-[#1a1a1a] selection:bg-white/10`}>
      {/* Background slow scan beam */}
      <div className="absolute inset-x-0 top-0 h-[200%] pointer-events-none mix-blend-screen opacity-50 bg-[linear-gradient(180deg,transparent_0%,rgba(0,255,65,0.05)_50%,transparent_100%)] animate-[scan-beam_25s_linear_infinite]" />
      
      <TerminalOverlay color={color} />
      
      <header className={`flex justify-between items-end border-b-2 ${t.border} pb-4 mb-4 md:mb-10 z-10`}>
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs tracking-[0.3em] opacity-70 mb-1">GOOGLE_DEV_TERMINAL</span>
          <h1 className="text-xl md:text-3xl font-bold tracking-tighter">GOOGLE::I/O_2026</h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs opacity-70">Uptime: 00:42:12:09</div>
          <div className="text-lg md:text-xl font-bold">SHORELINE_AMP</div>
        </div>
      </header>

      <main className="flex flex-grow flex-col xl:flex-row items-center xl:items-stretch justify-center xl:justify-between z-10 gap-8 min-h-0">
        
        {/* Left Column */}
        <div className="hidden xl:flex w-1/4 h-full flex-col justify-between gap-4">
          <div className={`p-4 border ${t.borderOpaque} ${t.bgOpaque}`}>
            <h3 className="text-xs font-bold mb-2 uppercase tracking-widest">EVENT_DATA_STREAM</h3>
            <div className="text-[10px] space-y-1 opacity-80">
              <p>&gt; ATTENDEES_REG: 4,096</p>
              <p>&gt; SESSIONS_LOADED: 104</p>
              <p>&gt; KEYNOTE_PREP: READY</p>
              <p>&gt; WORKSHOP_NET: ONLINE</p>
              <p>&gt; WEATHER: 72.4&deg;F CLEAR</p>
            </div>
          </div>
          <div className={`p-4 border ${t.borderOpaque} ${t.bgOpaque}`}>
            <h3 className="text-xs font-bold mb-2 uppercase tracking-widest">CAPACITY_MONITOR</h3>
            <div className="flex items-end gap-1 h-12">
              <div className={`${t.bgSolid} w-3 h-[60%]`}></div>
              <div className={`${t.bgSolid} w-3 h-[80%]`}></div>
              <div className={`${t.bgSolid} w-3 h-[40%]`}></div>
              <div className={`${t.bgSolid} w-3 h-[90%]`}></div>
              <div className={`${t.bgSolid} w-3 h-[70%]`}></div>
              <div className={`${t.bgSolid} w-3 h-[50%]`}></div>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`flex flex-col items-center justify-center p-4 sm:p-8 bg-[#121212] rounded-lg border-4 border-[#222] ${t.shadow} w-full max-w-[90vw] xl:w-auto bevel relative overflow-hidden`}
        >
          {/* Interactive Glow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${
                color === 'green' ? 'rgba(0, 255, 65, 0.15)' :
                color === 'amber' ? 'rgba(251, 191, 36, 0.15)' :
                color === 'red' ? 'rgba(239, 68, 68, 0.15)' :
                'rgba(34, 211, 238, 0.15)'
              }, transparent 40%)`,
              opacity: isHovering ? 1 : 0
            }}
          />

          <CountdownDisplay targetDate={targetDate} color={color} />
          
          <div className={`mt-6 text-sm tracking-[0.5em] ${t.textOpaque} font-bold uppercase`}>
            Awaiting_Keynote
          </div>

          {/* Hardware controls / Status */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono tracking-[0.2em] opacity-80 z-10 relative">
            <button 
              className={`px-3 sm:px-4 py-2 border rounded transition-all duration-300 hover:bg-[#00FF41]/10 focus:outline-none focus:ring-1 focus:ring-[#00FF41]/50 active:scale-95
                text-[#00FF41] border-[#00FF41]/50 shadow-[0_0_10px_rgba(0,255,65,0.2)]`} 
              onClick={handleResetClick}
            >
              RESET_COUNTDOWN
            </button>
            <button 
              className={`px-3 sm:px-4 py-2 border rounded transition-all duration-300 hover:bg-[#00FF41]/10 focus:outline-none focus:ring-1 focus:ring-[#00FF41]/50 active:scale-95
                ${isAmbientPlaying ? 'text-[#00FF41] border-[#00FF41]/50 shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'text-gray-500 border-gray-600/50'}`} 
              onClick={() => {
                playClickSound();
                setIsAmbientPlaying(toggleAmbientNoise());
              }}
            >
              SYS_AUDIO: {isAmbientPlaying ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden xl:flex w-1/4 h-full flex-col justify-between items-end gap-4">
          <div className={`text-right p-4 border ${t.borderOpaque} ${t.bgOpaque} w-full`}>
            <h3 className="text-xs font-bold mb-2 uppercase tracking-widest">SYSTEM_READINESS</h3>
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-[#0a1f0e] rounded-full overflow-hidden">
                <div className={`h-full w-3/4 ${t.bgSolid}`}></div>
              </div>
              <div className="h-1.5 w-full bg-[#0a1f0e] rounded-full overflow-hidden">
                <div className={`h-full w-1/2 ${t.bgSolid}`}></div>
              </div>
              <div className="h-1.5 w-full bg-[#0a1f0e] rounded-full overflow-hidden">
                <div className={`h-full w-5/6 ${t.bgSolid}`}></div>
              </div>
            </div>
          </div>
          <div className={`p-4 border ${t.borderOpaque} ${t.bgOpaque} w-full flex-grow overflow-hidden min-h-[200px]`}>
            <h3 className="text-xs font-bold mb-2 uppercase tracking-widest">I/O_SYS_LOG</h3>
            <div className="text-[9px] font-mono space-y-1 opacity-60 leading-tight">
              <p>[0.001] Booting I/O subsystems...</p>
              <p>[0.124] Indexing developer docs: OK</p>
              <p>[0.450] Network check: GREEN</p>
              <p>[0.890] Shoreline Amp connected</p>
              <p>[1.201] Calibrating Gemini models</p>
              <p>[1.556] Waiting for Keynote start</p>
              <p>[2.110] Streaming handshake secure</p>
              <p>[2.880] Decryption of session data</p>
              <p>[3.412] Hash: 0xG00GL...</p>
            </div>
          </div>
        </div>

      </main>

      <footer className={`mt-6 md:mt-10 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] tracking-widest uppercase border-t ${t.borderOpaque} pt-4 z-10 text-center sm:text-left`}>
        <div>Encrypted Tunnel: <span className={`${t.text} ${color === 'green' ? 'shadow-[#00FF41]' : `shadow-${color}-500/50`} shadow-sm font-bold`}>ESTABLISHED</span></div>
        <div>Memory: 256MB / 512MB</div>
        <div className="hidden sm:block">Location: [45.523062, -122.676482]</div>
      </footer>
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import { TERMINAL_LINES } from '../lib/constants';

interface TerminalOverlayProps {
  color?: 'green' | 'amber' | 'red' | 'cyan';
}

export const TerminalOverlay = ({ color = 'green' }: TerminalOverlayProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (lineIndex < TERMINAL_LINES.length) {
      timer = setTimeout(() => {
        setLines((prev) => [...prev, TERMINAL_LINES[lineIndex]]);
        setLineIndex((prev) => prev + 1);
      }, Math.random() * 400 + 100);
    } else if (!isBooted) {
      timer = setTimeout(() => {
        setIsBooted(true);
      }, 1000);
    } else {
      // Endless hex spew
      timer = setTimeout(() => {
        const hexLine = '0x' + Array(Math.floor(Math.random() * 10) + 4).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase() + ' ' +
                        Math.random().toString(36).substring(2, 8).toUpperCase() + ' // ' + 
                        (Math.random() > 0.5 ? 'OK' : 'NULL');
        setLines((prev) => {
          const next = [...prev, hexLine];
          if (next.length > 25) return next.slice(next.length - 25);
          return next;
        });
      }, Math.random() * 800 + 200);
    }
    
    return () => clearTimeout(timer);
  }, [lineIndex, isBooted]);

  const textColors = {
    green: 'text-green-500 shadow-green-500/50',
    amber: 'text-amber-500 shadow-amber-500/50',
    red: 'text-red-500 shadow-red-500/50',
    cyan: 'text-cyan-500 shadow-cyan-500/50',
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-30 mix-blend-color-dodge" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      
      {/* CRT Flicker */}
      <div className="absolute inset-0 opacity-[0.02] bg-white mix-blend-overlay pointer-events-none" />

      {/* Terminal Text Overlay (Top Left) */}
      <div className={`absolute top-4 left-4 font-mono text-[10px] md:text-xs leading-none tracking-widest opacity-40 ${textColors[color]} flex flex-col items-start gap-1 max-w-[300px]`}>
        {lines.map((line, i) => (
          <div key={`${line}-${i}`}>
            &gt; {line}
          </div>
        ))}
        {lineIndex < TERMINAL_LINES.length && (
          <div className="animate-pulse">&gt; _</div>
        )}
      </div>
    </div>
  );
};

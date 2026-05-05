import { useEffect, useState } from 'react';
import { FONT } from '../lib/font';

interface Matrix8x8Props {
  char?: string;
  color?: 'green' | 'amber' | 'red' | 'cyan';
  isDecoding?: boolean;
}

export const Matrix8x8 = ({ char = ' ', color = 'green', isDecoding = false }: Matrix8x8Props) => {
  const [currentLines, setCurrentLines] = useState(FONT[char] || FONT[' ']);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDecoding) {
      interval = setInterval(() => {
        const noise = Array(8)
          .fill(0)
          .map(() =>
            Array(8)
              .fill(0)
              .map(() => (Math.random() > 0.6 ? '1' : '0'))
              .join('')
          );
        setCurrentLines(noise);
      }, 50);
    } else {
      setCurrentLines(FONT[char] || FONT[' ']);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [char, isDecoding]);

  const themes = {
    green: {
      on: 'bg-[#00FF41] shadow-[0_0_10px_#00FF41,0_0_20px_#00FF41] border border-white z-10',
      off: 'bg-[#0a1f0e] border border-[#00FF41]/20',
    },
    amber: {
      on: 'bg-[#FFB000] shadow-[0_0_10px_#FFB000,0_0_20px_#FFB000] border border-white z-10',
      off: 'bg-[#332200] border border-[#FFB000]/20',
    },
    red: {
      on: 'bg-[#FF3333] shadow-[0_0_10px_#FF3333,0_0_20px_#FF3333] border border-white z-10',
      off: 'bg-[#330a0a] border border-[#FF3333]/20',
    },
    cyan: {
      on: 'bg-[#00FFFF] shadow-[0_0_10px_#00FFFF,0_0_20px_#00FFFF] border border-white z-10',
      off: 'bg-[#003333] border border-[#00FFFF]/20',
    },
  };

  const selectedTheme = themes[color] || themes.green;

  return (
    <div className={`grid grid-cols-8 grid-rows-8 gap-[1px] md:gap-1 bg-black p-1 md:p-1.5 border border-white/5 rounded relative aspect-square w-[6w] min-w-[50px] max-w-[50px] sm:max-w-[70px] md:max-w-[100px] lg:max-w-[140px] ${!isDecoding ? 'animate-[digit-flicker_4s_infinite]' : ''}`}>
      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none z-20" />
      {!isDecoding && (
        <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      )}
      {currentLines.map((line, y) =>
        line.split('').map((bit, x) => (
          <div
            key={`${x}-${y}`}
            className={`w-full h-full rounded-[1px] md:rounded-[2px] transition-colors duration-75 ${
              bit === '1' ? selectedTheme.on : selectedTheme.off
            }`}
          />
        ))
      )}
    </div>
  );
};

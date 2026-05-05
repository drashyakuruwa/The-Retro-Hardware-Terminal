import { useState, useEffect } from 'react';
import { Matrix8x8 } from './Matrix8x8';

interface CountdownDisplayProps {
  targetDate: Date;
  color?: 'green' | 'amber' | 'red' | 'cyan';
}

export const CountdownDisplay = ({ targetDate, color = 'green' }: CountdownDisplayProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isDecoding, setIsDecoding] = useState(true);

  // Decoding effect for the first 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDecoding(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetDate.getTime() - Date.now());
      setTimeRemaining(remaining);
    }, 50); // Update frequently to capture ms or rapid ticks

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const hours = pad(Math.floor(timeRemaining / (1000 * 60 * 60)));
  const minutes = pad(Math.floor((timeRemaining / (1000 * 60)) % 60));
  const seconds = pad(Math.floor((timeRemaining / 1000) % 60));
  const msStr = pad(Math.floor((timeRemaining % 1000) / 10)); // Top 2 digits of ms

  // On small screens we might want to stack HH:MM and SS:MS or just show one line.
  // Using flex wrapping with responsive gaps.
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-6 z-10">
      
      {/* Hours */}
      <div className="flex gap-1 sm:gap-2 items-center">
        <Matrix8x8 char={hours[0]} color={color} isDecoding={isDecoding} />
        <Matrix8x8 char={hours[1]} color={color} isDecoding={isDecoding} />
        <div className="hidden md:block">
          <Matrix8x8 char=":" color={color} isDecoding={isDecoding} />
        </div>
      </div>

      {/* Minutes */}
      <div className="flex gap-1 sm:gap-2 items-center">
        <Matrix8x8 char={minutes[0]} color={color} isDecoding={isDecoding} />
        <Matrix8x8 char={minutes[1]} color={color} isDecoding={isDecoding} />
        <div className="hidden md:block">
          <Matrix8x8 char=":" color={color} isDecoding={isDecoding} />
        </div>
      </div>

      {/* Seconds & MS */}
      <div className="flex gap-1 sm:gap-2 items-center">
        <Matrix8x8 char={seconds[0]} color={color} isDecoding={isDecoding} />
        <Matrix8x8 char={seconds[1]} color={color} isDecoding={isDecoding} />
        {/* We can hide MS on smallest screens if we want, or keep it. Let's keep it but slightly smaller if needed. */}
        <div className="hidden lg:block ml-4">
            <div className="flex gap-1 sm:gap-2 opacity-50 scale-75 origin-left">
              <Matrix8x8 char={msStr[0]} color={color} isDecoding={isDecoding} />
              <Matrix8x8 char={msStr[1]} color={color} isDecoding={isDecoding} />
            </div>
        </div>
      </div>

    </div>
  );
};

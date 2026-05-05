export const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors
  }
};

let lastMoveTime = 0;
let moveAudioCtx: AudioContext | null = null;

export const playMouseMoveHum = () => {
  const now = Date.now();
  if (now - lastMoveTime < 100) return; // Throttle to prevent overwhelming the audio context
  lastMoveTime = now;
  
  try {
    if (!moveAudioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        moveAudioCtx = new AudioContext();
    }
    
    // Only play if user has interacted (context is running)
    if (moveAudioCtx.state !== 'running') return;
    
    const osc = moveAudioCtx.createOscillator();
    const gainNode = moveAudioCtx.createGain();
    
    osc.type = 'sine';
    // Deep hum that slightly varies
    osc.frequency.setValueAtTime(50 + Math.random() * 20, moveAudioCtx.currentTime);
    
    // Very quiet volume
    gainNode.gain.setValueAtTime(0.01, moveAudioCtx.currentTime);
    gainNode.gain.setTargetAtTime(0, moveAudioCtx.currentTime, 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(moveAudioCtx.destination);
    
    osc.start();
    osc.stop(moveAudioCtx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio errors
  }
};

let ambientAudioCtx: AudioContext | null = null;
let ambientGainNode: GainNode | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let humOscillator: OscillatorNode | null = null;
let isAmbientPlaying = false;

export const toggleAmbientNoise = () => {
  try {
    if (!ambientAudioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return false;
      ambientAudioCtx = new AudioContext();
    }

    if (isAmbientPlaying) {
      if (ambientGainNode) {
        ambientGainNode.gain.setTargetAtTime(0, ambientAudioCtx.currentTime, 0.5);
      }
      isAmbientPlaying = false;
      return false;
    } else {
      if (ambientAudioCtx.state === 'suspended') {
        ambientAudioCtx.resume();
      }

      if (!ambientGainNode) {
        ambientGainNode = ambientAudioCtx.createGain();
        ambientGainNode.gain.value = 0;
        ambientGainNode.connect(ambientAudioCtx.destination);

        // Low hum
        humOscillator = ambientAudioCtx.createOscillator();
        humOscillator.type = 'sine';
        humOscillator.frequency.value = 55; // 55Hz hum
        
        const humGain = ambientAudioCtx.createGain();
        humGain.gain.value = 0.5;
        humOscillator.connect(humGain);
        humGain.connect(ambientGainNode);
        humOscillator.start();

        // Static noise
        const bufferSize = ambientAudioCtx.sampleRate * 2; // 2 seconds loop
        const noiseBuffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        noiseSource = ambientAudioCtx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const noiseFilter = ambientAudioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = ambientAudioCtx.createGain();
        noiseGain.gain.value = 0.03; // Subtle static

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ambientGainNode);

        noiseSource.start();
      }

      ambientGainNode.gain.setTargetAtTime(0.3, ambientAudioCtx.currentTime, 1); // Fade in over 1 second
      isAmbientPlaying = true;
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

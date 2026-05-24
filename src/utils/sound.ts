export const playSound = (soundId: number) => {
  if (localStorage.getItem('timegig_sound_enabled') === 'false') return;
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioCtx.currentTime;
  
  // Cinematic FM profiles
  const profiles = [
    { attack: 0.02, duration: 0.3, type: 'sine' as OscillatorType, modFreq: 50, modAmount: 200 },
    { attack: 0.01, duration: 0.2, type: 'triangle' as OscillatorType, modFreq: 120, modAmount: 400 },
    { attack: 0.05, duration: 0.4, type: 'sine' as OscillatorType, modFreq: 30, modAmount: 100 },
    { attack: 0.01, duration: 0.25, type: 'triangle' as OscillatorType, modFreq: 200, modAmount: 600 },
    { attack: 0.03, duration: 0.35, type: 'sine' as OscillatorType, modFreq: 80, modAmount: 300 },
  ];

  const profile = profiles[soundId % 5];
  const { attack, duration, type, modFreq, modAmount } = profile;
  
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  
  // Carrier
  const carrier = audioCtx.createOscillator();
  carrier.type = type;
  const baseFreq = 220 + (soundId * 44);
  carrier.frequency.setValueAtTime(baseFreq, now);
  carrier.connect(masterGain);
  
  // Modulator
  const modulator = audioCtx.createOscillator();
  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(modFreq, now);
  const modGain = audioCtx.createGain();
  modGain.gain.setValueAtTime(modAmount, now);
  modulator.connect(modGain);
  modGain.connect(carrier.frequency); // FM modulation
  
  // Envelope
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.1, now + attack);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
  carrier.start(now);
  modulator.start(now);
  carrier.stop(now + duration);
  modulator.stop(now + duration);
};

export const playNotificationSound = () => {
  const soundId = parseInt(localStorage.getItem('timegig_notification_sound') || '0');
  playSound(soundId);
};

export const playClickSound = () => {
  if (localStorage.getItem('timegig_sound_enabled') === 'false') return;
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioCtx.currentTime;
  
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  
  // Carrier - high frequency, short duration
  const carrier = audioCtx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(800, now);
  carrier.frequency.exponentialRampToValueAtTime(400, now + 0.02);
  carrier.connect(masterGain);
  
  // Modulator - quick FM for "click" texture
  const modulator = audioCtx.createOscillator();
  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(400, now);
  const modGain = audioCtx.createGain();
  modGain.gain.setValueAtTime(200, now);
  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  
  // Envelope - very fast attack, very short decay
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.05, now + 0.005);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  carrier.start(now);
  modulator.start(now);
  carrier.stop(now + 0.03);
  modulator.stop(now + 0.03);
};

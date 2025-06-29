// Typing Rain 音频子系统（模块化实现）

let audioContext;
export let soundEnabled = true;

export function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    window.audioContext = audioContext; // 兼容旧代码
  } catch (e) {
    console.warn('Web Audio API is not supported');
    soundEnabled = false;
    window.soundEnabled = false;
  }
}

function playTone(generatorFn, duration = 0.2) {
  if (!soundEnabled || !audioContext) return;

  const oscNodes = generatorFn(audioContext);
  const gain = audioContext.createGain();

  (Array.isArray(oscNodes) ? oscNodes : [oscNodes]).forEach((osc) => {
    osc.connect(gain);
  });
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.2, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  (Array.isArray(oscNodes) ? oscNodes : [oscNodes]).forEach((osc) => {
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
  });
}

export function playKeySound(isCorrect = true) {
  playTone((ctx) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const startFreq = isCorrect ? 800 : 200;
    const endFreq = isCorrect ? 400 : 100;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.1);
    return osc;
  }, 0.1);
}

export function playWordCompleteSound() {
  playTone((ctx) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    return osc;
  }, 0.2);
}

export function playMissSound() {
  playTone((ctx) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
    return osc;
  }, 0.3);
}

export function playPowerUpSound() {
  playTone((ctx) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';

    const seq = [523, 659, 784];
    seq.forEach((f, i) => osc1.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1));

    const seq2 = [1047, 1319, 1568];
    seq2.forEach((f, i) => osc2.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1));

    return [osc1, osc2];
  }, 0.4);
}

export function playPowerUpObtainedSound() {
  playTone((ctx) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const seq = [440, 554, 659, 880];
    seq.forEach((f, i) => osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1));
    return osc;
  }, 0.5);
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  if (!soundEnabled && audioContext) {
    audioContext.suspend();
  } else if (soundEnabled && audioContext) {
    audioContext.resume();
  }
  const btn = document.getElementById('sound-toggle');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
}

// 全局兼容挂钩
if (typeof window !== 'undefined') {
  window.soundEnabled = soundEnabled;
  window.initAudio = initAudio;
  window.playKeySound = playKeySound;
  window.playWordCompleteSound = playWordCompleteSound;
  window.playMissSound = playMissSound;
  window.playPowerUpSound = playPowerUpSound;
  window.playPowerUpObtainedSound = playPowerUpObtainedSound;
  window.toggleSound = toggleSound;

  window.audioBridge = {
    initAudio,
    playKeySound,
    playWordCompleteSound,
    playMissSound,
    playPowerUpSound,
    playPowerUpObtainedSound,
  };
} 
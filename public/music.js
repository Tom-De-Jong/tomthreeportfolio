const audio = new Audio('./music/ambient.mp3');
audio.loop = true;
audio.volume = 0.2;

audio.play().catch(() => {
  document.addEventListener('click', () => audio.play(), { once: true });
  document.addEventListener('touchstart', () => audio.play(), { once: true });
});

//click sound
const clickSound = new Audio('./music/click.mp3');
clickSound.volume = 0.5;

document.addEventListener('click', (e) => {
  clickSound.currentTime = 0;
  clickSound.play();
});

//mousemove sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let lastX = 0, lastY = 0, lastTime = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTime < 50) return;
  lastTime = now;

  const speed = Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
  lastX = e.clientX;
  lastY = e.clientY;

  if (speed < 10) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = Math.min(200 + speed * 3, 800);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
});
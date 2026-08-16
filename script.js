/* ============================================================
   buat kamu 💗 — script.js
   Vanilla JS, tanpa framework & tanpa library eksternal.
   ============================================================ */
'use strict';

/* ===================== 1. KONFIGURASI ===================== */
const CONFIG = {
  friendName: '', // ← Ganti dengan nama temanmu, contoh: 'Dita'. Kosong = pakai "kamu"
  musicFile: 'assets/music/you-and-i.mp3', // ← lagu One Direction "You & I". Kosongkan ('') kalau mau pakai melodi bawaan
};

/* ===================== 2. Helper kecil ===================== */
const $ = (id) => document.getElementById(id);
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Restart animasi CSS (supaya pop-in jalan lagi tiap teks berubah)
function restartAnimation(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

// Semburan emoji kecil di sekitar sebuah elemen
function emojiBurst(el, emojis, count = 8) {
  if (reducedMotion) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = pick(emojis);
    s.style.fontSize = rand(0.9, 1.6) + 'rem';
    s.style.left = cx + rand(-50, 50) + 'px';
    s.style.top = cy + rand(-35, 35) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

/* ===================== 3. Toast ===================== */
const toastEl = $('toast');
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ===================== 4. Tema (light/dark) ===================== */
const themeBtn = $('theme-btn');

function safeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, val); } catch (e) { /* abaikan */ }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  safeSet('cute-theme', theme);
}

(function initTheme() {
  const saved = safeGet('cute-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(next);
});

/* ===================== 5. Particle background ===================== */
function initParticles() {
  const host = $('particles');
  if (!host || reducedMotion) return;
  const EMOJIS = ['💗', '⭐', '🌸', '✨', '☁️', '🎀', '🐰'];
  const count = Math.min(24, Math.max(10, Math.floor(window.innerWidth / 65)));
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'particle';
    s.textContent = pick(EMOJIS);
    s.style.fontSize = rand(14, 26) + 'px';
    s.style.left = rand(0, 100) + 'vw';
    s.style.setProperty('--drift', rand(-60, 60) + 'px');
    s.style.setProperty('--particle-opacity', rand(0.25, 0.6).toFixed(2));
    const dur = rand(12, 24);
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = -rand(0, dur) + 's'; // mulai dari tengah-tengah animasi
    host.appendChild(s);
  }
}

/* ===================== 6. Cursor sparkle (desktop only) ===================== */
function initCursorSparkles() {
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (!fine || reducedMotion) return;
  const EMOJIS = ['✨', '⭐', '💗', '🌸'];
  let last = 0;
  document.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 55) return; // throttle biar ringan
    last = now;
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = pick(EMOJIS);
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  });
}

/* ===================== 7. Scroll reveal ===================== */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* ===================== 8. Nama teman ===================== */
(function setFriendName() {
  if (!CONFIG.friendName) return;
  const heroSub = $('hero-sub');
  if (heroSub) {
    heroSub.innerHTML = 'Aku bikin sesuatu kecil buat <strong>' + escapeHtml(CONFIG.friendName) + '</strong>...';
  }
})();

/* ===================== 9. Hero button ===================== */
$('hero-btn').addEventListener('click', () => {
  emojiBurst($('hero-btn'), ['💗', '✨', '⭐'], 10);
  $('surprise').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
});

/* ===================== 10. Tombol "Jangan klik" ===================== */
const naughtyBtn = $('naughty-btn');
const naughtyMsg = $('naughty-msg');
const naughtyCount = $('naughty-count');

const NAUGHTY = [
  { btn: 'Klik lagi',           msg: 'Kan udah dibilang jangan 😭' },
  { btn: 'Terakhir deh',        msg: 'Serius kamu nggak punya rasa takut ya?' },
  { btn: '🏳️ Oke, aku menyerah', msg: 'Yaudah... ternyata kamu memang suka tombol 😂', done: true },
];

let naughtyStep = 0;
let naughtyClicks = 0;

naughtyBtn.addEventListener('click', () => {
  naughtyClicks++;
  naughtyCount.textContent = 'Total klik: ' + naughtyClicks + ' — niat banget sih 😤';

  if (naughtyStep < NAUGHTY.length) {
    const stage = NAUGHTY[naughtyStep];
    naughtyMsg.textContent = stage.msg;
    restartAnimation(naughtyMsg);
    naughtyStep++;

    if (stage.done) {
      naughtyBtn.textContent = stage.btn;
      naughtyBtn.disabled = true;
      emojiBurst(naughtyBtn, ['💗', '😂', '⭐', '🎉'], 10);
    } else {
      naughtyBtn.textContent = stage.btn;
    }
  }
});

/* ===================== 11. Fun facts ===================== */
document.querySelectorAll('.fact-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (card.classList.contains('fact-special')) {
      card.classList.add('revealed');
      toast('404 sih... gimana mau ketemu 😂');
      emojiBurst(card, ['❓', '😂', '💫'], 6);
      return;
    }
    if (card.dataset.done) return;
    card.dataset.done = '1';

    const pct = parseInt(card.dataset.pct, 10);
    const fill = card.querySelector('.fact-fill');
    const val = card.querySelector('.fact-val');
    const bar = pct === 100 ? '██████████' : '█████████░';

    card.classList.add('revealed');
    fill.style.width = pct + '%'; // bar mengisi dengan transisi CSS

    // Angka berjalan naik
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + 3, pct);
      val.textContent = bar + ' ' + cur + '%';
      if (cur >= pct) clearInterval(timer);
    }, 30);
  });
});

/* ===================== 12. Tes Keberuntungan ===================== */
const luckBtn = $('luck-btn');
const slotBox = $('slot-box');
const slotEmoji = $('slot-emoji');
const slotResult = $('slot-result');

const LUCK = [
  { e: '🍀', t: 'Hari ini kamu beruntung!' },
  { e: '✨', t: 'Kamu mendapatkan keberuntungan +10' },
  { e: '😂', t: 'Kamu mendapatkan... tidak ada apa-apa' },
  { e: '💗', t: 'Kamu mendapatkan satu website random' },
  { e: '🐰', t: 'Kamu mendapatkan kelinci virtual' },
  { e: '🎉', t: 'Selamat! Kamu menang... tapi aku juga nggak tahu menang apa' },
];
const ROLL_EMOJIS = ['🎲', '🍀', '✨', '💗', '🐰', '🎉', '😂', '⭐', '🌸'];

let rolling = false;
luckBtn.addEventListener('click', () => {
  if (rolling) return;
  rolling = true;
  luckBtn.disabled = true;

  slotBox.classList.add('rolling');
  slotResult.classList.remove('hit');
  slotResult.textContent = 'Hmm... diputar dulu ya...';

  const cycle = setInterval(() => {
    slotEmoji.textContent = pick(ROLL_EMOJIS);
  }, 90);

  setTimeout(() => {
    clearInterval(cycle);
    slotBox.classList.remove('rolling');

    const result = pick(LUCK);
    slotEmoji.textContent = result.e;
    restartAnimation(slotBox);
    slotBox.classList.add('win');
    slotResult.textContent = result.t;
    slotResult.classList.add('hit');

    rolling = false;
    luckBtn.disabled = false;
    emojiBurst(slotBox, ['✨', '💗', '⭐'], 8);
  }, rand(700, 1100));
});

/* ===================== 13. Game "Pilihan sulit" ===================== */
const choiceProgress = $('choice-progress');
const choiceQ = $('choice-q');
const choiceGrid = $('choice-grid');
const choiceFb = $('choice-fb');

const QUESTIONS = [
  {
    q: 'Mana yang kamu pilih?',
    opts: ['☕ Kopi', '🍵 Teh'],
    fb: ['Ah, pejuang kafein. Respect ☕', 'Pilihan yang menenangkan. Hidupmu adem terus ya?'],
  },
  {
    q: 'Weekend? Akhir pekan yang ideal tuh kayak gimana?',
    opts: ['🏠 Rebahan', '🚗 Jalan-jalan'],
    fb: ['Man of culture. Rebahan is love 🛋️', 'Energik! Kapan-kapan ajak aku ya 😄'],
  },
  {
    q: 'Lapar tengah malam. Pilihanmu?',
    opts: ['🍜 Makan', '😴 Tidur dulu'],
    fb: ['Paling bener. Makan > segalanya 🍜', 'Kamu tahu apa yang kamu lakukan. Nanti juga lapar lagi 😴'],
  },
];

let qIdx = 0;

function renderProgress() {
  choiceProgress.innerHTML = '';
  for (let k = 0; k < QUESTIONS.length; k++) {
    const dot = document.createElement('span');
    dot.className = 'choice-dot' + (k <= Math.min(qIdx, QUESTIONS.length - 1) ? ' active' : '');
    choiceProgress.appendChild(dot);
  }
}

function renderQuestion(i) {
  renderProgress();
  if (i >= QUESTIONS.length) {
    finishChoices();
    return;
  }
  const q = QUESTIONS[i];
  choiceQ.textContent = q.q;
  choiceFb.textContent = '';
  choiceGrid.innerHTML = '';

  q.opts.forEach((opt, oi) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'choice-btn';
    b.textContent = opt;
    b.addEventListener('click', () => {
      b.classList.add('picked');
      choiceGrid.querySelectorAll('.choice-btn').forEach((x) => (x.disabled = true));
      choiceFb.textContent = q.fb[oi];
      restartAnimation(choiceFb);
      setTimeout(() => {
        qIdx++;
        renderQuestion(qIdx);
      }, 1600);
    });
    choiceGrid.appendChild(b);
  });
}

function finishChoices() {
  choiceQ.textContent = '🏆 Selesai!';
  choiceFb.textContent = 'Selamat! Kamu resmi lulus jadi orang  yang paling seru. 🎓';
  choiceGrid.innerHTML = '';
  const again = document.createElement('button');
  again.type = 'button';
  again.className = 'btn btn-ghost';
  again.textContent = 'Main lagi 🔁';
  again.addEventListener('click', () => {
    qIdx = 0;
    renderQuestion(0);
  });
  choiceGrid.appendChild(again);
  emojiBurst(choiceGrid, ['🎉', '🏆', '⭐', '💗'], 10);
}

renderQuestion(0);

/* ===================== 14. Musik =====================
   Mainkan file mp3 dari assets/music/ kalau ada.
   Kalau file-nya belum ada / gagal dimuat, otomatis pakai
   melodi WebAudio bawaan (jadi website tetap aman dibuka).
   ======================================================= */
const Music = (() => {
  const STEP_MS = 240;
  // Melodi 32 step (4 bar): Cmaj7 → Am7 → Fmaj7 → G
  const MELODY = [
    261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63,
    220.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63,
    174.61, 220.00, 261.63, 329.63, 349.23, 329.63, 261.63, 220.00,
    196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66, 246.94,
  ];
  const BASS = [130.81, 110.00, 87.31, 98.00]; // per bar

  let ctx = null;
  let master = null;
  let timer = null;
  let step = 0;
  let playing = false;
  let audio = null;      // <audio> untuk file mp3
  let fileBroken = false; // jadi true kalau file mp3 gagal dimuat

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  // Nada "pluck" lembut: triangle + sine, lowpass, envelope cepat
  function pluck(freq, when = 0, vol = 0.16) {
    if (!ctx || !master) return;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.8);
    osc2.stop(t + 0.8);
  }

  function schedule() {
    const bar = Math.floor(step / 8) % 4;
    if (step % 8 === 0) pluck(BASS[bar], 0, 0.12); // bass di awal bar
    const f = MELODY[step % 32];
    if (f) pluck(f, 0.02);
    step = (step + 1) % 32;
  }

  function startSynth() {
    if (!ensureCtx()) return false;
    if (timer) return true;
    schedule();
    timer = setInterval(schedule, STEP_MS);
    return true;
  }

  function start() {
    if (playing) return true;
    if (CONFIG.musicFile && !fileBroken) {
      if (!audio) {
        audio = new Audio(CONFIG.musicFile);
        audio.loop = true;
        audio.volume = 0.75;
        audio.addEventListener('error', () => {
          // File rusak / nggak ada → pakai melodi bawaan
          fileBroken = true;
          if (!playing) startSynth();
        }, { once: true });
      }
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.then(() => {
          playing = true;
        }).catch((err) => {
          if (err && err.name === 'NotAllowedError') {
            // Autoplay diblokir browser (belum ada gestur user).
            // Jangan tandai file rusak — nanti dicoba ulang saat user klik.
            return;
          }
          // File gagal dimuat → fallback ke melodi WebAudio
          fileBroken = true;
          if (!playing) startSynth();
        });
      } else {
        playing = true;
      }
      return true;
    }
    return startSynth();
  }

  // Benar-benar bersuara sekarang? (file lagi jalan / synth lagi jalan)
  function isReallyPlaying() {
    if (CONFIG.musicFile && !fileBroken && audio) {
      return !audio.paused && audio.error === null && !audio.ended;
    }
    return !!(ctx && ctx.state === 'running' && timer);
  }

  function stop() {
    if (audio && !audio.paused) audio.pause();
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    playing = false;
  }

  // 'started' = musik jalan · 'stopped' = berhenti · 'failed' = nggak bisa mulai
  function toggle() {
    if (playing) {
      stop();
      return 'stopped';
    }
    return start() ? 'started' : 'failed';
  }

  // Jingle singkat untuk momen SURPRISE
  function jingle() {
    if (!ensureCtx()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => pluck(f, i * 0.12, 0.2));
  }

  return { start, stop, toggle, jingle, isReallyPlaying };
})();

const musicBtn = $('music-btn');
const musicIcon = $('music-icon');
const musicLabel = $('music-label');

function setMusicUI(on) {
  musicBtn.classList.toggle('playing', on);
  musicIcon.textContent = on ? '🔊' : '🎵';
  musicLabel.textContent = on ? 'Stop' : 'Play our vibe';
}

musicBtn.addEventListener('click', () => {
  const result = Music.toggle();
  if (result === 'started') {
    setMusicUI(true);
    toast('Musik diputar 🎶 (kecilin volume dulu ya 😅)');
  } else if (result === 'stopped') {
    setMusicUI(false);
  } else {
    setMusicUI(false);
    toast('Browser kamu nggak support musik 😢');
  }
});

/* ============ 14b. Autoplay best-effort + fallback gestur ============ */
// Browser memblokir suara otomatis sebelum user berinteraksi.
// Strategi: coba autoplay → kalau diblokir, nyalakan otomatis saat
// user klik/tap/ketik pertama kali di mana pun.
function startOnFirstGesture() {
  const startOnce = (e) => {
    // Kalau yang diklik justru tombol musik, biarkan tombol itu yang handle
    if (e.target === musicBtn || musicBtn.contains(e.target)) return;
    document.removeEventListener('pointerdown', startOnce);
    document.removeEventListener('touchstart', startOnce);
    document.removeEventListener('keydown', startOnce);
    if (Music.isReallyPlaying()) return;
    if (Music.start()) setMusicUI(true);
  };
  document.addEventListener('pointerdown', startOnce);
  document.addEventListener('touchstart', startOnce);
  document.addEventListener('keydown', startOnce);
}

function tryAutoplay() {
  const started = Music.start();
  if (!started) return;
  setMusicUI(true);
  // Verifikasi sebentar lagi: kalau browser menolak autoplay,
  // turunkan UI dan tunggu gestur pertama user.
  setTimeout(() => {
    if (!Music.isReallyPlaying()) {
      Music.stop();
      setMusicUI(false);
      startOnFirstGesture();
      toast('Musik nggak bisa auto-play 😢 — klik di mana aja buat nyalain 🎵');
    }
  }, 800);
}

/* ===================== 15. Confetti (canvas, buatan sendiri) ===================== */
const Confetti = (() => {
  const canvas = $('confetti');
  const ctx2d = canvas.getContext('2d');
  const COLORS = ['#ff8fab', '#ffc8dd', '#cdb4db', '#a2d2ff', '#ffd6a5', '#bde0fe', '#ffafcc'];
  let pieces = [];
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx2d.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function tick() {
    ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravitasi
      p.rot += p.vr;
      if (p.y > window.innerHeight + 20) continue;
      alive++;
      ctx2d.save();
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate(p.rot);
      ctx2d.fillStyle = p.color;
      ctx2d.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx2d.restore();
    }
    pieces = pieces.filter((p) => p.y <= window.innerHeight + 20);
    if (alive > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function burst(count = 140) {
    if (reducedMotion) return;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 3.5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.25,
        color: pick(COLORS),
      });
    }
    if (!rafId) tick();
  }

  return { burst };
})();

/* ===================== 16. Final surprise ===================== */
const finaleBtn = $('finale-btn');
const overlay = $('overlay');
const loader = $('loader');
const overlayText = $('overlay-text');
const overlayDone = $('overlay-done');
const overlayClose = $('overlay-close');

const OVERLAY_STEPS = [
  ['Preparing surprise...', 700],
  ['Loading...', 700],
  ['Almost there...', 700],
  ['99%...', 700],
  ['99.9%...', 600],
];
let overlayTimers = [];

function startFinale() {
  finaleBtn.disabled = true;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  loader.hidden = false;
  overlayDone.hidden = true;
  loader.classList.remove('error');
  overlayText.textContent = 'Preparing surprise...';

  let t = 0;
  for (const [txt, dur] of OVERLAY_STEPS) {
    overlayTimers.push(setTimeout(() => { overlayText.textContent = txt; }, t));
    t += dur;
  }

  overlayTimers.push(setTimeout(() => { // ERROR 😭
    loader.classList.add('error');
    overlayText.textContent = 'ERROR 😭';
  }, t));
  t += 900;

  overlayTimers.push(setTimeout(() => { // HAHA bercanda.
    loader.classList.remove('error');
    overlayText.textContent = 'HAHA bercanda.';
  }, t));
  t += 900;

  overlayTimers.push(setTimeout(() => { // 🎉 SURPRISE 🎉
    loader.hidden = true;
    overlayDone.hidden = false;
    Confetti.burst(160);
    Music.jingle();
  }, t));
}

function closeFinale() {
  overlayTimers.forEach(clearTimeout);
  overlayTimers = [];
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  finaleBtn.disabled = false;
}

finaleBtn.addEventListener('click', startFinale);
overlayClose.addEventListener('click', closeFinale);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeFinale(); // klik di luar kotak = tutup
});

/* ===================== 17. Tahun footer ===================== */
$('year').textContent = new Date().getFullYear();

/* ===================== 18. Inisialisasi ===================== */
initParticles();
initCursorSparkles();
initReveal();
tryAutoplay(); // musik diputar otomatis (best-effort, lihat 14b)

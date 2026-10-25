/* ============================================================
   SETTINGS: put your sound file name here.
   Your file must be inside the folder:  Files/SoundS/
   Example: if your file is "lofi.mp3" ->  "Files/SoundS/lofi.mp3"
   NOTE: Render is case-sensitive, so "SoundS" must match exactly.
   ============================================================ */
const MUSIC_SRC = "Files/SoundS/Background.mp3";
const MUSIC_VOLUME = 0.5; // 0 to 1

const roles = [
  "Beginner web developer",
  "Learning HTML, CSS & JavaScript",
  "Building simple, creative websites",
  "Always learning, always growing"
];

/* ---------- Music + splash ---------- */
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
const splash = document.getElementById("splash");
const enterBtn = document.getElementById("enterBtn");

bgm.src = MUSIC_SRC;
bgm.volume = MUSIC_VOLUME;
document.body.classList.add("locked");
musicBtn.classList.add("muted");

function setPlaying(on) {
  musicBtn.classList.toggle("muted", !on);
}

enterBtn.addEventListener("click", () => {
  bgm.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  splash.classList.add("hide");
  document.body.classList.remove("locked");
  setTimeout(() => splash.remove(), 1000);
  startReveal();
  typeLoop();
});

musicBtn.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play().then(() => setPlaying(true)).catch(() => {});
  } else {
    bgm.pause();
    setPlaying(false);
  }
});

/* ---------- Typing effect ---------- */
const typedEl = document.getElementById("typed");
let started = false;
function typeLoop() {
  if (started) return;
  started = true;
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; return setTimeout(tick, 60); }
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1400); }
    if (deleting && c > 0) { c--; return setTimeout(tick, 30); }
    deleting = false; r = (r + 1) % roles.length;
    setTimeout(tick, 300);
  })();
}

/* ---------- Scroll reveal ---------- */
function startReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (el.closest(".hero")) el.style.transitionDelay = i * 0.12 + "s";
    io.observe(el);
  });
}

/* ---------- Cursor glow ---------- */
const glow = document.getElementById("cursorGlow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* ---------- 3D tilt + light on cards ---------- */
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -10;
    const ry = ((x / r.width) - 0.5) * 10;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

/* ---------- Particles ---------- */
(function () {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, dots;
  const mouse = { x: -999, y: -999 };

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    const n = Math.min(90, Math.floor((w * h) / 17000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6
    }));
  }
  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 120, 120, 0.7)";
      ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const o = dots[j];
        const dist = Math.hypot(d.x - o.x, d.y - o.y);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(255, 31, 61, ${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
        }
      }
      const md = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      if (md < 150) {
        ctx.strokeStyle = `rgba(255, 216, 74, ${0.35 * (1 - md / 150)})`;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
       

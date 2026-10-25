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
const bgv = document.getElementById("bgv");
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

if (bgv) {
  bgv.muted = true;
  const kick = () => { if (bgv.paused) bgv.play().catch(() => {}); };
  kick();
  ["touchstart", "pointerdown", "click", "scroll"].forEach((ev) =>
    addEventListener(ev, kick, { passive: true, once: ev !== "scroll" }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) kick(); });
  bgv.addEventListener("stalled", kick);
  bgv.addEventListener("pause", () => { if (!document.hidden) setTimeout(kick, 300); });
}

enterBtn.addEventListener("click", () => {
  if (bgv) bgv.play().catch(() => {});
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
    const n = Math.min(38, Math.floor((w * h) / 26000));
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
    if (document.hidden) { requestAnimationFrame(frame); return; }
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
        if (dist < 100) {
          ctx.strokeStyle = `rgba(255, 31, 61, ${0.18 * (1 - dist / 100)})`;
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


/* ---------- Chat (DM style contact, answers come from response.json) ---------- */
(function () {
  const IG_DM = "https://ig.me/m/lor.zxa";
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const chips = document.getElementById("chips");
  if (!body || !form) return;

  /* Used only if response.json cannot be loaded */
  let data = {
    welcome: [
      "Good day! Thank you for visiting my portfolio.",
      "Please feel free to send me a message regarding collaboration or any inquiries."
    ],
    rules: [
      { keywords: ["hi", "hello", "hey", "good day"], replies: ["Good day to you as well! 😊", "How may I help you today?"] },
      { keywords: ["work with", "work together", "collab*", "hire*", "project*"], replies: ["Thank you for your interest in working with me!", "Please send me the details on Instagram, and I will reply as soon as I can."], action: "copy_ig" },
      { keywords: ["question*", "inquir*", "ask"], replies: ["Of course, feel free to ask.", "Type your question below."] }
    ],
    fallback: {
      replies: ["Thank you for your message.", "Please tap the button below and send it to me on Instagram."],
      action: "copy_ig"
    }
  };

  const ready = fetch("response.json?v=" + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((j) => { if (j && Array.isArray(j.rules)) data = j; })
    .catch(() => {});

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  function bubble(text, who) {
    const el = document.createElement("div");
    el.className = "msg " + who;
    el.textContent = text;
    body.appendChild(el);
    scrollDown();
  }

  async function botSay(text) {
    const t = document.createElement("div");
    t.className = "msg them typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(t);
    scrollDown();
    await wait(Math.min(1500, 550 + text.length * 14));
    t.remove();
    bubble(text, "them");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (e) { return false; }
    }
  }

  function igLink() {
    const a = document.createElement("a");
    a.className = "msg them msg-link";
    a.href = IG_DM; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = '<i class="fa-brands fa-instagram"></i> Open Instagram DM';
    body.appendChild(a);
    scrollDown();
  }

  /* ---- keyword matching ---- */
  const normalize = (s) =>
    " " + s.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, " ").replace(/\s+/g, " ").trim() + " ";

  const esc = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

  function keywordScore(text, kw) {
    kw = kw.toLowerCase().trim();
    if (!kw) return 0;
    const pattern = esc(kw).replace(/\*/g, "\\p{L}*");
    const re = new RegExp("\\s" + pattern + "\\s", "u");
    if (!re.test(text)) return 0;
    return kw.split(/\s+/).length * 10 + Math.min(kw.length, 9);
  }

  function findReply(message) {
    const text = normalize(message);
    let best = null, bestScore = 0;
    for (const rule of data.rules) {
      let score = 0;
      for (const kw of rule.keywords || []) score += keywordScore(text, kw);
      if (score > bestScore) { best = rule; bestScore = score; }
    }
    return best || data.fallback;
  }

  let busy = false;
  async function send(message) {
    message = message.trim();
    if (!message || busy) return;
    busy = true;
    bubble(message, "me");
    input.value = "";
    const rule = findReply(message);
    const copyPromise = rule.action === "copy_ig" ? copyText(message) : null;
    for (const line of rule.replies || []) await botSay(line);
    if (copyPromise) {
      const ok = await copyPromise;
      if (ok) await botSay("Your message has been copied. Please paste it after opening my Instagram DM.");
    }
    if (rule.action === "ig" || rule.action === "copy_ig") igLink();
    busy = false;
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) send(b.dataset.msg || b.textContent);
  });

  let greeted = false;
  async function greet() {
    if (greeted) return;
    greeted = true;
    await ready;
    for (const line of data.welcome || []) await botSay(line);
  }

  new IntersectionObserver((entries, io) => {
    if (entries.some((e) => e.isIntersecting)) { greet(); io.disconnect(); }
  }, { threshold: 0.3 }).observe(body);
})();
     

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
  let ruleIdx = null, packIdx = null;

  const ready = fetch("response.json?v=" + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((j) => { if (j && Array.isArray(j.rules)) { data = j; ruleIdx = packIdx = null; } })
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

  /* ---------- text helpers ---------- */
  const normalize = (s) =>
    String(s).toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
      .replace(/['’`]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const esc = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];

  /* ---------- rule index (keywords) ---------- */
  function buildRules() {
    const exact = new Map(), wild = [];
    let maxWords = 1;
    data.rules.forEach((rule, ri) => {
      for (const kw of rule.keywords || []) {
        if (kw.indexOf("*") >= 0) {
          const parts = kw.toLowerCase().split("*").map(normalize);
          const flat = parts.join(" ").trim();
          if (!flat) continue;
          wild.push({
            ri,
            re: new RegExp("(?:^| )" + parts.map(esc).join("\\p{L}*") + "(?: |$)", "u"),
            score: flat.split(" ").length * 10 + Math.min(flat.length, 9)
          });
        } else {
          const k = normalize(kw);
          if (!k) continue;
          const w = k.split(" ").length;
          if (w > maxWords) maxWords = w;
          if (!exact.has(k)) exact.set(k, []);
          exact.get(k).push(ri);
        }
      }
    });
    return { exact, wild, maxWords };
  }

  function scoreRules(text, tokens) {
    if (!ruleIdx) ruleIdx = buildRules();
    const scores = new Map(), seen = new Set();
    const add = (ri, s) => scores.set(ri, (scores.get(ri) || 0) + s);
    const top = Math.min(ruleIdx.maxWords, tokens.length);
    for (let n = top; n >= 1; n--) {
      for (let i = 0; i + n <= tokens.length; i++) {
        const key = tokens.slice(i, i + n).join(" ");
        if (seen.has(key)) continue;
        const list = ruleIdx.exact.get(key);
        if (!list) continue;
        seen.add(key);
        const s = n * 10 + Math.min(key.length, 9);
        for (const ri of list) add(ri, s);
      }
    }
    for (const w of ruleIdx.wild) if (w.re.test(text)) add(w.ri, w.score);
    let best = -1, bestScore = 0, prio = -1;
    for (const [ri, s] of scores) {
      if (data.rules[ri].priority) { if (prio < 0 || s > scores.get(prio)) prio = ri; }
      if (s > bestScore || (s === bestScore && ri < best)) { best = ri; bestScore = s; }
    }
    return { best, bestScore, prio };
  }

  /* ---------- knowledge packs ---------- */
  function buildPacks() {
    const map = new Map();
    let maxWords = 1;
    const packs = data.packs || {};
    for (const name of Object.keys(packs)) {
      const p = packs[name];
      p._cue = (p.cue || []).map(normalize).filter(Boolean);
      p._xcue = (p.xcue || p.cue || []).map(normalize).filter(Boolean);
      p.items.forEach((it, ii) => {
        const reg = (list, x) => {
          for (const k of list) {
            const w = k.split(" ").length;
            if (w > maxWords) maxWords = w;
            let arr = map.get(k);
            if (!arr) map.set(k, (arr = []));
            arr.push({ p, ii, x });
          }
        };
        reg(it[0], false);
        reg(it[1], true);
      });
    }
    return { map, maxWords };
  }

  const LEAD = new Set("what whats is are a an the does do did define definition explain tell me about please pls po who was whos ano ang yung ng ba can you could would i want to know meaning of give show how".split(" "));
  const TRAIL = new Set("mean means meaning stand stands for do does is are po please pls ba used".split(" "));
  const NOUNS = new Set("tag tags property properties command commands keyword element elements symbol symbols file files extension format key shortcut port".split(" "));

  function soloCandidates(tokens) {
    let a = 0, b = tokens.length;
    while (a < b && LEAD.has(tokens[a])) a++;
    while (b > a && TRAIL.has(tokens[b - 1])) b--;
    const base = tokens.slice(a, b);
    const out = [base.join(" ")];
    let c = base.length;
    while (c > 1 && NOUNS.has(base[c - 1])) c--;
    if (c !== base.length) out.push(base.slice(0, c).join(" "));
    let d = 0;
    while (d < base.length - 1 && NOUNS.has(base[d])) d++;
    if (d) out.push(base.slice(d).join(" "));
    return out.filter(Boolean);
  }

  function lookupPacks(text, tokens) {
    if (!data.packs) return null;
    if (!packIdx) packIdx = buildPacks();
    const solos = soloCandidates(tokens);
    const padded = " " + text + " ";
    const cueCache = new Map();
    const hasCue = (p, x) => {
      const list = x ? p._xcue : p._cue;
      const ck = (x ? "x" : "n") + list.join("|");
      if (cueCache.has(ck)) return cueCache.get(ck);
      const r = list.some((c) => padded.indexOf(" " + c + " ") >= 0);
      cueCache.set(ck, r);
      return r;
    };
    let best = null, bestScore = 0;
    const top = Math.min(packIdx.maxWords, tokens.length);
    for (let n = top; n >= 1; n--) {
      for (let i = 0; i + n <= tokens.length; i++) {
        const key = tokens.slice(i, i + n).join(" ");
        const hits = packIdx.map.get(key);
        if (!hits) continue;
        const isSolo = solos.indexOf(key) >= 0;
        
        for (const h of hits) {
          if (n === 1 && key.length <= 2 && /\D/.test(key) && !h.x && !isSolo) continue;
          const ok = h.p.any || hasCue(h.p, h.x) || (isSolo && !h.x);
          if (!ok) continue;
          const s = n * 10 + Math.min(key.length, 9) + 5 + (isSolo ? 10 : 0) + (h.x ? 3 : 0);
          if (s > bestScore) { bestScore = s; best = h; }
        }
      }
    }
    return best ? { score: bestScore, replies: [best.p.items[best.ii][2]] } : null;
  }

  /* ---------- dynamic answers (math, time, dice, converters) ---------- */
  function fmtNum(v) {
    if (!isFinite(v)) return null;
    const r = Math.round(v * 1e10) / 1e10;
    return r.toLocaleString("en-US", { maximumFractionDigits: 10 });
  }

  function mathReply(raw) {
    let s = raw.toLowerCase().replace(/(\d),(?=\d{3}(\D|$))/g, "$1").replace(/[?=!]/g, " ");
    if (/\d+\s*[-\/.]\s*\d+\s*[-\/]\s*\d+/.test(s)) return null;
    s = s.replace(/\b(what is|whats|what's|calculate|compute|solve|how much is|how many is|find|evaluate|answer of|answer|equals?|result of|tell me|please|pls|the|value of|ano ang|magkano ang|ilan ang|is)\b/g, " ")
      .replace(/\b(?:square root of|sqrt of|root of)\b/g, " sqrt ")
      .replace(/(\d+(?:\.\d+)?)\s*(?:percent|%)\s*of\s*(\d+(?:\.\d+)?)/g, "($1/100*$2)")
      .replace(/(\d+(?:\.\d+)?)\s*squared\b/g, "($1^2)")
      .replace(/(\d+(?:\.\d+)?)\s*cubed\b/g, "($1^3)")
      .replace(/\b(?:plus|added to|add)\b/g, "+")
      .replace(/\b(?:minus|subtract|less)\b/g, "-")
      .replace(/\b(?:times|multiplied by|multiply by|multiplied)\b/g, "*")
      .replace(/(\d)\s*x\s*(\d)/g, "$1*$2")
      .replace(/\b(?:divided by|divide by|over)\b/g, "/")
      .replace(/\b(?:to the power of|power of|raised to)\b/g, "^")
      .replace(/×/g, "*").replace(/÷/g, "/");
    const tokRe = /\d+(?:\.\d+)?|sqrt|[+\-*\/^()%]/g;
    if (s.replace(tokRe, "").trim() !== "") return null;
    const toks = s.match(tokRe) || [];
    if (!toks.some((t) => /\d/.test(t))) return null;
    if (!toks.some((t) => /^(?:[+\-*\/^%]|sqrt)$/.test(t))) return null;
    let pos = 0, err = null;
    const peek = () => toks[pos];
    function expr() { let v = term(); while (peek() === "+" || peek() === "-") { const o = toks[pos++]; const r = term(); v = o === "+" ? v + r : v - r; } return v; }
    function term() { let v = pw(); while (peek() === "*" || peek() === "/") { const o = toks[pos++]; const r = pw(); if (o === "/" && r === 0) err = "zero"; v = o === "*" ? v * r : v / r; } return v; }
    function pw() { const b = un(); if (peek() === "^") { pos++; return Math.pow(b, pw()); } return b; }
    function un() { if (peek() === "-") { pos++; return -un(); } if (peek() === "+") { pos++; return un(); } return atom(); }
    function atom() {
      const t = toks[pos++];
      if (t === undefined) { err = "bad"; return 0; }
      if (t === "(") { const v = expr(); if (peek() === ")") pos++; else err = "bad"; return v; }
      if (t === "sqrt") { const v = atom(); if (v < 0) err = "neg"; return Math.sqrt(v); }
      if (/^\d/.test(t)) { let v = parseFloat(t); while (peek() === "%") { pos++; v /= 100; } return v; }
      err = "bad"; return 0;
    }
    let v;
    try { v = expr(); } catch (e) { return null; }
    if (err === "zero") return ["I cannot divide by zero. 😅"];
    if (err === "neg") return ["I cannot take the square root of a negative number here."];
    if (err || pos < toks.length) return null;
    const out = fmtNum(v);
    return out === null ? null : ["The answer is " + out + ". 🧮"];
  }

  const UNITS = (() => {
    const u = {}, add = (type, names, f) => names.split(" ").forEach((n) => (u[n] = { type, f }));
    add("len", "m meter meters metre metres", 1); add("len", "km kilometer kilometers kilometre kilometres", 1000);
    add("len", "mi mile miles", 1609.344); add("len", "ft foot feet", 0.3048); add("len", "cm centimeter centimeters", 0.01);
    add("len", "mm millimeter millimeters", 0.001); add("len", "in inch inches", 0.0254); add("len", "yd yard yards", 0.9144);
    add("mass", "kg kilogram kilograms kilo kilos", 1); add("mass", "g gram grams", 0.001);
    add("mass", "lb lbs pound pounds", 0.45359237); add("mass", "oz ounce ounces", 0.028349523);
    add("vol", "l liter liters litre litres", 1); add("vol", "ml milliliter milliliters", 0.001); add("vol", "gal gallon gallons", 3.785411784);
    add("temp", "c celsius", 0); add("temp", "f fahrenheit", 0); add("temp", "k kelvin", 0);
    return u;
  })();
  const UNIT_NAME = { m: "meters", km: "kilometers", mi: "miles", ft: "feet", cm: "centimeters", mm: "millimeters", in: "inches", yd: "yards", kg: "kilograms", g: "grams", lb: "pounds", oz: "ounces", l: "liters", ml: "milliliters", gal: "gallons", c: "°C", f: "°F", k: "K" };
  const canon = (n) => ({ meter: "m", meters: "m", metre: "m", metres: "m", kilometer: "km", kilometers: "km", kilometre: "km", kilometres: "km", mile: "mi", miles: "mi", foot: "ft", feet: "ft", centimeter: "cm", centimeters: "cm", millimeter: "mm", millimeters: "mm", inch: "in", inches: "in", yard: "yd", yards: "yd", kilogram: "kg", kilograms: "kg", kilo: "kg", kilos: "kg", gram: "g", grams: "g", lbs: "lb", pound: "lb", pounds: "lb", ounce: "oz", ounces: "oz", liter: "l", liters: "l", litre: "l", litres: "l", milliliter: "ml", milliliters: "ml", gallon: "gal", gallons: "gal", celsius: "c", fahrenheit: "f", kelvin: "k" }[n] || n);

  function unitReply(raw) {
    const m = raw.toLowerCase().replace(/(\d),(?=\d{3})/g, "$1").match(/(-?\d+(?:\.\d+)?)\s*°?\s*([a-z]+)\s*(?:to|in|into|=|as)\s*°?\s*([a-z]+)/);
    if (!m) return null;
    const val = parseFloat(m[1]), a = UNITS[m[2]], b = UNITS[m[3]];
    if (!a || !b || a.type !== b.type) return null;
    const ca = canon(m[2]), cb = canon(m[3]);
    let out;
    if (a.type === "temp") {
      let c = ca === "c" ? val : ca === "f" ? (val - 32) * 5 / 9 : val - 273.15;
      out = cb === "c" ? c : cb === "f" ? c * 9 / 5 + 32 : c + 273.15;
    } else out = val * a.f / b.f;
    const r = fmtNum(out);
    return r === null ? null : [fmtNum(val) + " " + (UNIT_NAME[ca] || m[2]) + " is about " + r + " " + (UNIT_NAME[cb] || m[3]) + ". 📏"

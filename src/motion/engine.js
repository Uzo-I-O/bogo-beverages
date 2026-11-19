// One requestAnimationFrame loop drives the whole landing page:
// units + layout modes, the dotted globe, the gold horizon glow, the hero
// glitch-out, stat count-ups and the scrubbed bottle scene.
import landDots from "./landdots.json";
import bottleSprite from "../assets/bottle-frames.webp";

const GOLD = "#cc8f1b";
const GOLD_RGB = "204,143,27";
const INK = "#111111";

// ---- bottle sprite (40 frames of the Bogo bottle reel) ----
const FW = 240;
const FH = 777;
const COLS = 8;
const BASE_PAD = 6 / 1079; // transparent rows under the bottle base
const DUR = [
  200, 200, 200, 200, 200, 500, 200, 200, 200, 200, 200, 500, 200, 200, 200, 200,
  200, 500, 200, 200, 200, 200, 200, 500, 200, 200, 200, 200, 200, 200, 500, 200,
  200, 200, 200, 200, 500, 200, 200, 200,
];
const LIT = [
  0, 0.22, 0.39, 0.81, 1, 1, 0.41, 0.22, 0, 0.21, 0.6, 1, 0.4, 0.21, 0, 0.24, 0.4, 1,
  0.44, 0.24, 0, 0.25, 0.44, 1, 0.82, 0.25, 0, 0.5, 0.61, 0.83, 1, 0.89, 0.61, 0.5,
  0.21, 0.39, 1, 0.4, 0.21, 0,
];
const CYCLE = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4,
  4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5,
];
// Play bottles 2–6 first and finish on the gold Bottega bottle (frames 0–5).
const ORDER = [];
for (let i = 8; i < 40; i += 1) ORDER.push(i);
for (let i = 0; i <= 5; i += 1) ORDER.push(i);

// Scroll pacing. The GIF's own timings make each bottle drop to black in a few
// quick steps, which feels abrupt when scrubbed. Each bottle holds at full
// brightness for PEAK_HOLD, then its fade-out steps run FADE_OUT_SLOW times
// longer. Fade-ins keep the GIF timing.
const FADE_OUT_SLOW = 2;
const PEAK_HOLD = 300; // ms

// Original GIF timeline, used to keep the scroll pace and the end of the scene unchanged.
let BASE_TOTAL = 0;
let BASE_LAST = 0; // start of the final Bottega bottle
for (let k = 0; k < ORDER.length - 1; k += 1) {
  if (ORDER[k] === 0) BASE_LAST = BASE_TOTAL;
  BASE_TOTAL += DUR[ORDER[k]] / 1000;
}

const SEQ = [];
const SEQ_T = [0];
let LAST_T = 0;
for (let k = 0; k < ORDER.length; k += 1) {
  const f = ORDER[k];
  const next = ORDER[k + 1];
  let d = DUR[f];
  if (f === 0) LAST_T = SEQ_T[SEQ_T.length - 1];
  if (next !== undefined && LIT[next] < LIT[f]) {
    if (LIT[f] === 1) {
      SEQ.push(f);
      SEQ_T.push(SEQ_T[SEQ_T.length - 1] + PEAK_HOLD / 1000);
    }
    d *= FADE_OUT_SLOW;
  }
  SEQ.push(f);
  if (next !== undefined) SEQ_T.push(SEQ_T[SEQ_T.length - 1] + d / 1000);
}
const SEQ_TOTAL = SEQ_T[SEQ_T.length - 1];
// Lengthen the scroll track so the rest of the reel scrolls at its original pace.
const SCENE_A = (2.4 * SEQ_TOTAL) / BASE_TOTAL;
// Camera pull-back and settle points, kept at the same place relative to the final bottle.
const PULL_START = LAST_T - (BASE_LAST - 0.72 * BASE_TOTAL);
const PULL_LEN = 0.2 * BASE_TOTAL;
const SETTLE_T = SEQ_TOTAL - 0.06 * BASE_TOTAL;

// ---- intro pour (gold mark → Cavatina bottle → glass → gold flood) ----
const IA_L = 4.6; // viewport heights of scrolling while the intro is pinned
const IA_TILT = 108; // degrees the bottle tips to pour
const LOGO_AR = 533 / 468; // gold-logo.png height / width
const LOGO_TOP = 0.054; // transparent margin above the mark, as a share of its height
const BOTTLE_AR = 267 / 933; // cavatina.png width / height
// phase windows, as fractions of the pinned scroll
const IA = {
  flip: [0.04, 0.24],
  rise: [0.24, 0.4],
  logoOut: [0.37, 0.48],
  shift: [0.4, 0.5],
  glass: [0.42, 0.54],
  tilt: [0.5, 0.63],
  stream: [0.6, 0.645],
  fill: [0.625, 0.84],
  flood: [0.82, 1],
};
const IA_HASH = Array.from({ length: 32 }, (_, i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
});

// ---- globe ----
const START_LON = 30; // degrees; Europe + West Africa begin left of centre
const SPIN = 2.4; // degrees per second
const TILT = (9 * Math.PI) / 180;
const CITIES = [
  { name: "Ireland", lat: 53.35, lon: -6.26 },
  { name: "Spain", lat: 40.42, lon: -3.7 },
  { name: "Italy", lat: 45.89, lon: 12.3 },
  { name: "Lagos", lat: 6.45, lon: 3.39 },
];
const ROUTES = [
  [0, 3],
  [1, 3],
  [2, 3],
];

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const smooth = (t) => t * t * (3 - 2 * t);
const seg = (p, w) => clamp((p - w[0]) / (w[1] - w[0]));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const f1 = (v) => v.toFixed(1);

function unit(lat, lon) {
  const p = (lat * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
}

export function startMotion() {
  const html = document.documentElement;
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rec = new URLSearchParams(window.location.search).get("rec") === "1";

  const el = {
    ia: q("#mh-ia"),
    iaGlow: q("#mh-ia-glow"),
    iaSparks: qa(".mh-ia-spark"),
    iaSvg: q("#mh-ia-svg"),
    iaGlass: q("#mh-ia-glass"),
    iaBowl: q("#mh-ia-bowl"),
    iaBowlIn: q("#mh-ia-bowl-in"),
    iaGlassLine: q("#mh-ia-glass-line"),
    iaGlassHi: q("#mh-ia-glass-hi"),
    iaLiquid: q("#mh-ia-liquid"),
    iaSurface: q("#mh-ia-surface"),
    iaBubbles: qa(".mh-ia-bubble"),
    iaStream: q("#mh-ia-stream"),
    iaStreamHi: q("#mh-ia-stream-hi"),
    iaDrops: qa(".mh-ia-drop"),
    iaBottle: q("#mh-ia-bottle"),
    iaLogo: q("#mh-ia-logo"),
    iaLogoIn: q("#mh-ia-logo-in"),
    iaSheen: q("#mh-ia-sheen"),
    iaFloodSvg: q("#mh-ia-flood-svg"),
    iaFloodGrad: q("#mh-ia-flood-g"),
    iaFlood: q("#mh-ia-flood"),
    iaFloodBack: q("#mh-ia-flood-back"),
    iaBrand: q("#mh-ia-brand"),
    iaCue: q("#mh-ia-cue"),
    iaEdge: q("#mh-ia-edge"),
    iaEdgeA: q("#mh-ia-edge-a"),
    iaEdgeB: q("#mh-ia-edge-b"),
    hwrap: q("#mh-hwrap"),
    hero: q("#top"),
    hf: q("#mh-hf"),
    logo: q("#mh-logo"),
    vnav: q("#mh-vnav"),
    navItems: qa(".mh-vnav-item"),
    copy: q("#mh-copy"),
    overline: q("#mh-overline"),
    lines: qa("#mh-hl .mh-ln"),
    lede: q("#mh-lede"),
    btns: q("#mh-btns"),
    gwrap: q("#mh-gwrap"),
    globe: q("#mh-globe"),
    hz: q("#mh-hz"),
    ph: q("#mh-ph"),
    phImg: q("#mh-ph .mh-ph-img"),
    intro: q("#mh-intro"),
    big: q("#mh-big"),
    bigLines: qa("#mh-big .mh-ln"),
    nums: qa("#mh-nums .mh-num"),
    track: q("#brands"),
    scene: q("#mh-scene"),
    spot: q("#mh-spot"),
    giant: q("#mh-giant"),
    bottle: q("#mh-bottle"),
    count: q("#mh-count"),
    speed: q("#mh-speed"),
    strip: q("#mh-strip"),
    cards: qa("#mh-strip .mh-card"),
    upOver: q(".mh-up-over"),
    upHl: q("#mh-up-hl"),
    upLines: qa("#mh-up-hl .mh-ln"),
    upCards: qa(".mh-up-card"),
  };

  html.classList.add("mhp", "js-anim");

  const anims = [];
  const timers = [];
  const observers = [];
  let raf = 0;
  const t0 = performance.now();

  // ---------------------------------------------------------------- state
  const S = {
    vw: 0,
    vh: 0,
    uc: 1,
    uv: 1,
    us: 1,
    u: 1,
    port: false,
    land: false,
    hp: false,
    sticky: false,
    heroH: 0,
    wrapH: 0,
    dpr: 1,
    gw: 0,
    gh: 0,
    gcx: 0,
    gcy: 0,
    gR: 0,
    gScale: 1,
    trackTop: 0,
    trackH: 0,
    A: SCENE_A,
    B: 1,
    stripW: 0,
    lettersW: 0,
    cardLefts: [],
    sw: 0,
    sh: 0,
    headlineReady: reduce,
    clipCur: 0,
    lastY: window.scrollY,
    lastT: performance.now(),
    speed: 0,
    phOn: -1,
    // intro
    introTop: 0,
    introH: 0,
    heroTop: 0,
    iaCur: 0,
    iaG: null,
    heroStarted: false,
  };
  const hasIntro = !!el.ia;

  // ---------------------------------------------------------------- globe data
  const N = landDots.length / 2;
  const DX = new Float32Array(N);
  const DY = new Float32Array(N);
  const DZ = new Float32Array(N);
  for (let i = 0; i < N; i += 1) {
    const v = unit(landDots[i * 2 + 1] / 10, landDots[i * 2] / 10);
    DX[i] = v[0];
    DY[i] = v[1];
    DZ[i] = v[2];
  }
  const buckets = [0, 1, 2, 3, 4].map(() => new Float32Array(N * 3));
  const bucketLen = new Int32Array(5);

  const cityVec = CITIES.map((c) => unit(c.lat, c.lon));
  const arcPts = ROUTES.map(([a, b]) => {
    const A = cityVec[a];
    const B = cityVec[b];
    const dot = clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1);
    const w = Math.acos(dot);
    const sw = Math.sin(w);
    const pts = [];
    for (let i = 0; i < 57; i += 1) {
      const t = i / 56;
      const ka = Math.sin((1 - t) * w) / sw;
      const kb = Math.sin(t * w) / sw;
      const lift = 1 + (0.07 + (0.42 * w) / Math.PI) * Math.sin(Math.PI * t);
      pts.push([
        (A[0] * ka + B[0] * kb) * lift,
        (A[1] * ka + B[1] * kb) * lift,
        (A[2] * ka + B[2] * kb) * lift,
      ]);
    }
    return pts;
  });

  const gctx = el.globe.getContext("2d");
  const bctx = el.bottle.getContext("2d");
  const sprite = new Image();
  let spriteReady = false;
  sprite.onload = () => {
    spriteReady = true;
  };
  sprite.src = bottleSprite;

  // ---------------------------------------------------------------- layout
  function layout() {
    const vw = html.clientWidth;
    const vh = html.clientHeight;
    S.vw = vw;
    S.vh = vh;
    S.port = vw <= vh;
    S.land = !S.port && vh < 500;
    S.hp = S.port || S.land || vw < 768;
    S.sticky = !S.port && !S.land;
    html.classList.toggle("m-port", S.port);
    html.classList.toggle("m-land", S.land);
    html.classList.toggle("m-hp", S.hp);
    html.classList.toggle("sticky", S.sticky);

    S.uc = vh < 520 ? Math.min(vw / 1440, Math.max(vh / 900, 0.6)) : Math.min(vw / 1440, vh / 900);
    S.us = vw / 1440;
    if (S.land) S.u = vh / 430;
    else if (S.hp) S.u = Math.min(vw / 430, 1.4);
    else S.u = Math.min(vw / 1440, vh / 960);

    const st = html.style;
    st.setProperty("--uc", `${S.uc}px`);
    st.setProperty("--us", `${S.us}px`);
    st.setProperty("--u", `${S.u}px`);
    st.setProperty("--vw", `${vw}px`);
    st.setProperty("--vh", `${vh}px`);

    // intro pour
    if (hasIntro) layoutIntro(vw, vh);
    S.heroTop = el.hwrap.getBoundingClientRect().top + window.scrollY;

    // hero
    el.hero.style.height = "";
    const hfTop = S.port ? 0 : Math.max(0, (vh - 900 * S.uc) / 2);
    el.hf.style.setProperty("--hf-top", `${hfTop}px`);
    if (S.port) {
      S.heroH = el.hero.offsetHeight;
    } else if (S.land) {
      const copyBottom = hfTop + el.copy.offsetTop + el.copy.offsetHeight;
      S.heroH = Math.max(vh, 900 * S.uc, copyBottom + 28);
      el.hero.style.height = `${S.heroH}px`;
    } else {
      S.heroH = vh;
    }
    S.uv = Math.max(vw / 1440, S.heroH / 900);
    st.setProperty("--uv", `${S.uv}px`);
    S.wrapH = S.sticky ? 1.65 * vh : Math.max(1.65 * vh, S.heroH + 0.12 * vh);
    el.hwrap.style.height = `${S.wrapH}px`;

    // globe canvas
    S.dpr = Math.min(2, window.devicePixelRatio || 1);
    S.gw = el.gwrap.clientWidth;
    S.gh = el.gwrap.clientHeight;
    el.globe.width = Math.round(S.gw * S.dpr);
    el.globe.height = Math.round(S.gh * S.dpr);
    let ox;
    let oy;
    if (S.port) {
      const up = (1.25 * vw) / 800;
      S.gScale = up;
      ox = vw - 1440 * up;
      oy = 16 - 130 * up;
    } else {
      S.gScale = S.uv;
      ox = vw - 1440 * S.uv;
      oy = Math.min(0, (S.heroH - 900 * S.uv) / 2);
    }
    S.gcx = ox + 1166 * S.gScale;
    S.gcy = oy + 530 * S.gScale;
    S.gR = 400 * S.gScale;

    // brands scene
    S.sw = el.scene.clientWidth || vw;
    S.sh = el.scene.clientHeight || vh;
    el.bottle.width = Math.round(S.sw * S.dpr);
    el.bottle.height = Math.round(S.sh * S.dpr);
    S.stripW = el.strip.offsetWidth;
    S.lettersW = el.giant.offsetWidth;
    S.cardLefts = el.cards.map((c) => c.offsetLeft);
    S.B = ((S.stripW + 0.45 * vw) / vw) * 1.1;
    S.trackH = (1 + S.A + S.B) * vh;
    el.track.style.height = `${S.trackH}px`;
    S.trackTop = el.track.getBoundingClientRect().top + window.scrollY;

    frame(performance.now(), true);
  }

  // ---------------------------------------------------------------- intro pour
  // Glass outline in units of U, relative to (glass centre x, glass base y).
  const GLASS_OUT = [
    ["M", -0.085, -0.4],
    ["C", -0.095, -0.36, -0.107, -0.33, -0.105, -0.29],
    ["C", -0.103, -0.22, -0.05, -0.17, -0.008, -0.165],
    ["L", -0.006, -0.03],
    ["C", -0.006, -0.012, -0.06, -0.012, -0.085, -0.006],
    ["L", -0.085, 0],
    ["L", 0.085, 0],
    ["L", 0.085, -0.006],
    ["C", 0.06, -0.012, 0.006, -0.012, 0.006, -0.03],
    ["L", 0.008, -0.165],
    ["C", 0.05, -0.17, 0.103, -0.22, 0.105, -0.29],
    ["C", 0.107, -0.33, 0.095, -0.36, 0.085, -0.4],
  ];
  const BOWL_IN = [
    ["M", -0.081, -0.4],
    ["C", -0.091, -0.36, -0.103, -0.33, -0.101, -0.29],
    ["C", -0.099, -0.225, -0.05, -0.177, 0, -0.175],
    ["C", 0.05, -0.177, 0.099, -0.225, 0.101, -0.29],
    ["C", 0.103, -0.33, 0.091, -0.36, 0.081, -0.4],
    ["Z"],
  ];
  const GLASS_HI = [
    ["M", -0.083, -0.355],
    ["C", -0.094, -0.31, -0.09, -0.255, -0.066, -0.222],
  ];
  function glassPath(cmds, cx, by, U) {
    return cmds
      .map(([c, ...n]) => c + n.map((v, i) => f1(i % 2 ? by + v * U : cx + v * U)).join(" "))
      .join(" ");
  }

  function layoutIntro(vw, vh) {
    const U = Math.min(vh, 1.3 * vw);
    const port = vw <= vh;
    S.introH = (1 + IA_L) * vh;
    el.ia.style.height = `${S.introH}px`;
    S.introTop = el.ia.getBoundingClientRect().top + window.scrollY;

    // mark: large and centred, then smaller and lower once flipped
    const lh0 = 0.46 * U;
    const lw0 = lh0 / LOGO_AR;
    const lh1 = 0.26 * U;
    const ly1 = vh / 2 + 0.3 * U;
    // line the bottle appears from: just inside the top of the flipped mark
    const line = ly1 - lh1 / 2 + (LOGO_TOP + 0.15) * lh1;

    const bh = (port ? 0.5 : 0.6) * U;
    const bw = bh * BOTTLE_AR;

    // glass to the right of centre
    const gx = Math.min(vw / 2 + 0.2 * U, vw - 0.15 * U);
    const gb = vh / 2 + 0.36 * U;
    const rim = gb - 0.4 * U;

    // bottle centre once it has risen, after the shift, and in the pour pose
    const upY = line + 0.02 * U - bh / 2;
    const shiftX = vw / 2 - 0.1 * U;
    const th = (IA_TILT * Math.PI) / 180;
    const d = 0.496 * bh; // centre → mouth
    const mouthX = gx - 0.025 * U;
    const mouthY = rim - 0.13 * U;
    const pourX = mouthX - d * Math.sin(th);
    const pourY = mouthY + d * Math.cos(th);

    S.iaG = { U, lh0, lw0, lh1, ly1, line, bh, bw, gx, gb, rim, upY, shiftX, pourX, pourY, d };

    el.iaLogo.style.width = `${f1(lw0)}px`;
    el.iaLogo.style.height = `${f1(lh0)}px`;
    el.iaBottle.style.width = `${f1(bw)}px`;
    el.iaBottle.style.height = `${f1(bh)}px`;
    el.iaGlow.style.width = `${f1(1.3 * lh0)}px`;
    el.iaGlow.style.height = `${f1(1.3 * lh0)}px`;

    const vb = `0 0 ${vw} ${vh}`;
    el.iaSvg.setAttribute("viewBox", vb);
    el.iaFloodSvg.setAttribute("viewBox", vb);
    el.iaFloodGrad.setAttribute("y2", String(vh));
    el.iaEdge.setAttribute("viewBox", `0 0 ${vw} ${f1(0.14 * vh)}`);
    el.iaEdge.setAttribute("preserveAspectRatio", "none");

    el.iaBowl.setAttribute("d", `${glassPath(GLASS_OUT, gx, gb, U)} Z`);
    el.iaGlassLine.setAttribute("d", glassPath(GLASS_OUT, gx, gb, U));
    el.iaBowlIn.setAttribute("d", glassPath(BOWL_IN, gx, gb, U));
    el.iaGlassHi.setAttribute("d", glassPath(GLASS_HI, gx, gb, U));
    el.iaGlassHi.style.strokeWidth = f1(Math.max(1.5, 0.006 * U));
    el.iaStream.style.strokeWidth = f1(Math.max(3, 0.012 * U));
    el.iaStreamHi.style.strokeWidth = f1(Math.max(1, 0.0035 * U));
  }

  function wavePath(x0, x1, y, amp, len, phase, bottom, amp2 = 0) {
    const n = Math.max(48, Math.ceil((x1 - x0) / 10));
    let dpath = `M${f1(x0)} ${f1(bottom)}`;
    for (let i = 0; i <= n; i += 1) {
      const x = x0 + ((x1 - x0) * i) / n;
      const yy =
        y +
        amp * Math.sin((x / len) * Math.PI * 2 + phase) +
        amp2 * Math.sin((x / len) * Math.PI * 2 * 2.3 - phase * 1.7);
      dpath += ` L${f1(x)} ${f1(yy)}`;
    }
    return `${dpath} L${f1(x1)} ${f1(bottom)} Z`;
  }

  function startHeroEntrance() {
    if (S.heroStarted) return;
    S.heroStarted = true;
    if (reduce) return;
    fadeUp(el.logo, 8, 700, 0);
    el.navItems.forEach((n, i) => fadeUp(n, 8, 700, 70 + i * 70));
    fadeUp(el.overline, 10, 700, 150);
    el.lines.forEach((n, i) => glitch(n, 260 + i * 130));
    fadeUp(el.lede, 14, 800, 900);
    fadeUp(el.btns, 14, 800, 1040);
    later(() => {
      S.headlineReady = true;
    }, 260 + (el.lines.length - 1) * 130 + 900 + 30);
    later(() => html.classList.add("anim-done"), 4000);
  }

  function updateIntro(sy, t, forced) {
    const G = S.iaG;
    if (!G) return;
    const { vw, vh } = S;
    const pinEnd = S.introTop + IA_L * vh;

    // hand-off: start the hero's entrance as the flood begins to lift
    if (!S.heroStarted && sy >= pinEnd + 0.22 * vh) startHeroEntrance();

    const visible = sy < S.introTop + S.introH + 0.14 * vh && sy + vh > S.introTop;
    if (!visible && !forced) return;

    const target = clamp((sy - S.introTop) / (IA_L * vh));
    if (reduce || forced) S.iaCur = target;
    else {
      S.iaCur += (target - S.iaCur) * 0.16;
      if (Math.abs(target - S.iaCur) < 0.0004) S.iaCur = target;
    }
    const p = S.iaCur;
    const tt = reduce ? 0 : t;
    const { U } = G;

    // ---- the gold mark: twirl-flip upside down, sink, then fade
    const fl = easeInOutCubic(seg(p, IA.flip));
    const pulse = Math.sin(Math.PI * fl);
    const lo = easeInOutCubic(seg(p, IA.logoOut));
    const idle = (1 - fl) * Math.sin(tt * 1.3) * 0.008 * U;
    const ly = lerp(vh / 2, G.ly1, fl) + idle + 0.08 * U * lo;
    const ls = lerp(1, G.lh1 / G.lh0, fl) * (1 - 0.1 * pulse) * (1 - 0.18 * lo);
    el.iaLogo.style.transform =
      `translate3d(${f1(vw / 2 - G.lw0 / 2)}px,${f1(ly - G.lh0 / 2)}px,0) perspective(${f1(2.4 * G.lh0)}px) ` +
      `rotateY(${(360 * fl).toFixed(2)}deg) rotateZ(${(180 * fl).toFixed(2)}deg) scale(${ls.toFixed(4)})`;
    el.iaLogo.style.opacity = String(1 - lo);
    el.iaLogo.style.visibility = lo >= 1 ? "hidden" : "";
    el.iaLogoIn.style.setProperty("--glow", `${f1((6 + 22 * pulse) * (U / 900))}px`);
    el.iaSheen.style.setProperty("--sheen", `${f1(100 - 100 * fl)}%`);

    // ---- bottle: rises out of the flipped mark, shifts left, tips and pours
    const rs = easeInOutCubic(seg(p, IA.rise));
    const sh = easeInOutCubic(seg(p, IA.shift));
    const tl = easeInOutCubic(seg(p, IA.tilt));
    let bx = lerp(vw / 2, G.shiftX, sh);
    let by = lerp(G.line + G.bh / 2, G.upY, rs);
    bx = lerp(bx, G.pourX, tl);
    by = lerp(by, G.pourY, tl) - 0.05 * U * Math.sin(Math.PI * tl);
    const pouring = seg(p, IA.stream);
    by += pouring * Math.sin(tt * 2.1) * 0.003 * U;
    const th = IA_TILT * tl;
    el.iaBottle.style.visibility = p <= IA.rise[0] ? "hidden" : "";
    el.iaBottle.style.transform = `translate3d(${f1(bx - G.bw / 2)}px,${f1(by - G.bh / 2)}px,0) rotate(${th.toFixed(2)}deg)`;
    el.iaBottle.style.clipPath =
      p < IA.rise[1] ? `inset(0 0 ${f1(clamp(by + G.bh / 2 - G.line, 0, G.bh))}px 0)` : "";

    // ---- glow behind the mark: flares mid-flip and as the bottle emerges
    const emerge = Math.sin(Math.PI * rs) * (1 - lo);
    const glowA = Math.max(0.35 * (1 - fl) + 0.9 * pulse, 0.85 * emerge) * (1 - lo);
    const gy = lerp(ly, G.line, clamp(rs * 2));
    const gsz = 1.3 * G.lh0;
    el.iaGlow.style.opacity = glowA.toFixed(3);
    el.iaGlow.style.transform = `translate3d(${f1(vw / 2 - gsz / 2)}px,${f1(gy - gsz / 2)}px,0) scale(${(0.7 + 0.3 * pulse + 0.1 * emerge).toFixed(3)})`;

    // ---- sparks burst outward as the flip lands
    const sp = clamp((fl - 0.45) / 0.55);
    el.iaSparks.forEach((n, i) => {
      if (sp <= 0 || sp >= 1) {
        n.style.opacity = "0";
        return;
      }
      const a = (i / el.iaSparks.length) * Math.PI * 2 + 0.35 + IA_HASH[i] * 0.5;
      const r = easeOutCubic(sp) * (0.22 + 0.26 * IA_HASH[i + 8]) * U;
      const x = vw / 2 + Math.cos(a) * r;
      const y = ly + Math.sin(a) * r * 0.9;
      n.style.opacity = (Math.sin(Math.PI * sp) * (0.6 + 0.4 * IA_HASH[i + 16])).toFixed(3);
      n.style.transform = `translate3d(${f1(x)}px,${f1(y)}px,0) scale(${(1.4 - sp).toFixed(3)})`;
    });

    // ---- glass
    const ga = easeOutCubic(seg(p, IA.glass));
    el.iaGlass.style.opacity = ga.toFixed(3);
    el.iaGlass.setAttribute("transform", `translate(0 ${f1((1 - ga) * 0.06 * U)})`);

    // ---- liquid level, surface, bubbles
    const fillT = easeInOutCubic(seg(p, IA.fill));
    const bottom = G.gb - 0.175 * U;
    const level = lerp(bottom + 0.004 * U, G.gb - 0.37 * U, fillT);
    const amp = (0.0025 + 0.004 * pouring) * U;
    if (fillT > 0) {
      el.iaLiquid.setAttribute(
        "d",
        wavePath(G.gx - 0.12 * U, G.gx + 0.12 * U, level, amp, 0.09 * U, tt * 3.2, bottom + 0.01 * U)
      );
      el.iaSurface.setAttribute(
        "d",
        wavePath(G.gx - 0.12 * U, G.gx + 0.12 * U, level, amp, 0.09 * U, tt * 3.2, level).replace(/ L[^L]*Z$/, "")
      );
    } else {
      el.iaLiquid.setAttribute("d", "");
      el.iaSurface.setAttribute("d", "");
    }
    const depth = bottom - level;
    el.iaBubbles.forEach((n, i) => {
      if (fillT < 0.05 || depth < 0.01 * U) {
        n.setAttribute("r", "0");
        return;
      }
      const ph = (tt * (0.25 + 0.35 * IA_HASH[i]) + IA_HASH[i + 10]) % 1;
      const x = G.gx + (IA_HASH[i + 4] - 0.5) * 0.13 * U + Math.sin(tt * 2 + i) * 0.003 * U;
      const y = bottom - ph * depth;
      n.setAttribute("cx", f1(x));
      n.setAttribute("cy", f1(y));
      n.setAttribute("r", f1((0.002 + 0.003 * IA_HASH[i + 20]) * U * (0.4 + 0.6 * ph)));
    });

    // ---- the pour: from the bottle mouth, arcing down into the glass
    const thr = (th * Math.PI) / 180;
    const dx = Math.sin(thr);
    const dy = -Math.cos(thr);
    const mx = bx + G.d * dx;
    const my = by + G.d * dy;
    const ix = G.gx + 0.008 * U;
    const iy = level - amp;
    const wob = Math.sin(tt * 7) * 0.003 * U;
    if (pouring > 0 && p < IA.flood[1]) {
      const dpath =
        `M${f1(mx)} ${f1(my)} C${f1(mx + dx * 0.05 * U)} ${f1(my + dy * 0.05 * U)} ` +
        `${f1(ix - 0.004 * U + wob)} ${f1(my + 0.07 * U)} ${f1(ix)} ${f1(iy)}`;
      el.iaStream.setAttribute("d", dpath);
      el.iaStreamHi.setAttribute("d", dpath);
      const off = (1 - easeOutCubic(pouring)).toFixed(4);
      el.iaStream.style.strokeDashoffset = off;
      el.iaStreamHi.style.strokeDashoffset = off;
    } else {
      el.iaStream.style.strokeDashoffset = "1";
      el.iaStreamHi.style.strokeDashoffset = "1";
    }

    // splash droplets where the pour hits the wine
    const splash = pouring >= 1 ? 1 : 0;
    el.iaDrops.forEach((n, i) => {
      if (!splash || reduce) {
        n.setAttribute("r", "0");
        return;
      }
      const ph = (tt * 1.7 + i / el.iaDrops.length) % 1;
      const side = IA_HASH[i + 3] - 0.5;
      n.setAttribute("cx", f1(ix + side * 0.06 * U * ph));
      n.setAttribute("cy", f1(iy - Math.sin(Math.PI * ph) * (0.015 + 0.025 * IA_HASH[i + 12]) * U));
      n.setAttribute("r", f1(0.0035 * U * (1 - ph)));
    });

    // ---- the glass overflows: wine rises up and floods the screen
    const fd = easeInOutCubic(seg(p, IA.flood));
    const fAmp = 0.016 * vh;
    const fy = lerp(vh + 0.08 * vh, -0.08 * vh, fd);
    if (fd > 0) {
      el.iaFlood.setAttribute("d", wavePath(-20, vw + 20, fy, fAmp, 0.55 * vw, tt * 1.6, vh + 20, 0.4 * fAmp));
      el.iaFloodBack.setAttribute(
        "d",
        wavePath(-20, vw + 20, fy - 0.045 * vh, fAmp * 1.1, 0.42 * vw, -tt * 1.3 + 1.7, vh + 20, 0.3 * fAmp)
      );
    } else {
      el.iaFlood.setAttribute("d", "");
      el.iaFloodBack.setAttribute("d", "");
    }

    // captions
    el.iaCue.style.opacity = String(1 - clamp(p / 0.04));
    el.iaBrand.style.opacity = String(1 - clamp((p - 0.82) / 0.08));

    // ---- liquid edge that trails the scene as it lifts off the hero
    el.iaEdge.style.visibility = fd >= 0.999 ? "" : "hidden";
    el.iaEdgeA.setAttribute("d", wavePath(-20, vw + 20, 0.055 * vh, 0.018 * vh, 0.5 * vw, tt * 1.6, -2, 0.006 * vh));
    el.iaEdgeB.setAttribute("d", wavePath(-20, vw + 20, 0.095 * vh, 0.022 * vh, 0.38 * vw, -tt * 1.2 + 2.1, -2, 0.007 * vh));
  }

  // ---------------------------------------------------------------- animations
  function keep(a, node) {
    anims.push(a);
    a.onfinish = () => {
      if (node) node.classList.remove("ent");
      a.cancel();
    };
    return a;
  }

  function fadeUp(node, dy, duration, delay) {
    if (!node) return null;
    return keep(
      node.animate(
        [
          { opacity: 0, transform: `translateY(${dy}px)` },
          { opacity: 1, transform: "none" },
        ],
        { duration, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
      ),
      node
    );
  }

  const G = GOLD_RGB;
  function glitch(node, delay) {
    if (!node) return null;
    return keep(
      node.animate(
        [
          {
            offset: 0,
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            transform: "translateX(-.05em)",
            textShadow: `-.12em 0 0 rgba(${G},.8), .07em 0 0 rgba(17,17,17,.25)`,
          },
          {
            offset: 0.3,
            opacity: 1,
            clipPath: "inset(0 38% 0 0)",
            transform: "translateX(.035em)",
            textShadow: `.09em 0 0 rgba(${G},.65), -.05em 0 0 rgba(17,17,17,.3)`,
          },
          {
            offset: 0.55,
            opacity: 0.8,
            clipPath: "inset(0 0 0 0)",
            transform: "translateX(-.018em)",
            textShadow: `-.045em 0 0 rgba(${G},.55), .025em 0 0 rgba(17,17,17,.2)`,
          },
          {
            offset: 0.78,
            opacity: 1,
            clipPath: "inset(0 0 0 0)",
            transform: "translateX(.008em)",
            textShadow: `.015em 0 0 rgba(${G},.35), 0 0 0 rgba(17,17,17,0)`,
          },
          {
            offset: 1,
            opacity: 1,
            clipPath: "inset(0 0 0 0)",
            transform: "none",
            textShadow: `0 0 0 rgba(${G},0), 0 0 0 rgba(17,17,17,0)`,
          },
        ],
        { duration: 900, delay, easing: "steps(14, end)", fill: "both" }
      ),
      node
    );
  }

  function later(fn, ms) {
    timers.push(window.setTimeout(fn, ms));
  }

  // hero load timeline: plays on load, or at the intro hand-off when the intro is present
  if (reduce) {
    html.classList.add("anim-done");
  } else if (hasIntro) {
    keep(
      el.iaLogoIn.animate(
        [
          { opacity: 0, transform: "scale(.82)", filter: "blur(6px)" },
          { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: 1300, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
      )
    );
    fadeUp(el.iaBrand, 8, 900, 300);
    fadeUp(el.iaCue, 10, 900, 700);
  } else {
    startHeroEntrance();
  }

  // ---------------------------------------------------------------- stats + updates reveals
  const counters = [];
  function zeroForm(li) {
    const dec = Number(li.dataset.dec || 0);
    return `${(0).toFixed(dec)}${li.dataset.suf || ""}`;
  }
  function fmt(v, dec, suf) {
    let s = v.toFixed(dec);
    if (dec === 0) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return s + suf;
  }

  if (!reduce) {
    el.nums.forEach((li) => {
      if (li.dataset.to) li.querySelector(".mh-n").textContent = zeroForm(li);
      li.style.setProperty("--hl", "0");
    });
    if (el.ph) el.ph.style.clipPath = "inset(100% 0 0 0)";
  }

  function reveal(target) {
    if (target === el.ph) {
      el.ph.style.clipPath = "";
      keep(
        el.ph.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
          duration: 1100,
          easing: "cubic-bezier(.7,0,.2,1)",
          fill: "both",
        })
      );
      keep(
        el.phImg.animate([{ transform: "scale(1.12)" }, { transform: "scale(1)" }], {
          duration: 1600,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "both",
        })
      );
      fadeUp(el.intro, 14, 900, 250);
    } else if (target === el.big) {
      el.bigLines.forEach((n, i) => glitch(n, i * 130));
    } else if (target === el.upHl) {
      fadeUp(el.upOver, 10, 700, 0);
      el.upLines.forEach((n, i) => glitch(n, 80 + i * 130));
    } else if (target.classList.contains("mh-up-card")) {
      fadeUp(target, 18, 900, el.upCards.indexOf(target) * 120);
    } else if (target.classList.contains("mh-num")) {
      const li = target;
      fadeUp(li, 12, 700, 0);
      glitch(li.querySelector(".mh-n"), 60);
      const hl = li.animate([{ "--hl": 0 }, { "--hl": 1 }], {
        duration: 900,
        delay: 60,
        easing: "cubic-bezier(.7,0,.2,1)",
        fill: "both",
      });
      anims.push(hl);
      hl.onfinish = () => {
        li.style.setProperty("--hl", "1");
        hl.cancel();
      };
      if (li.dataset.to) {
        counters.push({
          node: li.querySelector(".mh-n"),
          to: Number(li.dataset.to),
          dec: Number(li.dataset.dec || 0),
          suf: li.dataset.suf || "",
          start: performance.now() + 60,
        });
      }
    }
  }

  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          reveal(en.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    observers.push(io);
    [el.ph, el.big, el.upHl, ...el.nums, ...el.upCards].forEach((n) => n && io.observe(n));
  } else {
    html.classList.add("anim-done");
  }

  function runCounters(now) {
    for (let i = counters.length - 1; i >= 0; i -= 1) {
      const c = counters[i];
      const k = clamp((now - c.start) / 1600);
      const e = 1 - Math.pow(1 - k, 3);
      c.node.textContent = fmt(c.to * e, c.dec, c.suf);
      if (k >= 1) counters.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- globe draw
  function drawGlobe(t) {
    const ctx = gctx;
    const { dpr, gw, gh, gcx: cx, gcy: cy, gR: R, gScale: uv } = S;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, gw, gh);
    const intro = reduce ? 1 : 1 - Math.pow(1 - clamp(t / 1.1), 3);
    ctx.globalAlpha = intro;

    // 1. haze + rim glow
    let g = ctx.createRadialGradient(cx - 0.05 * R, cy + 0.08 * R, 0.9 * R, cx - 0.05 * R, cy + 0.08 * R, 1.5 * R);
    g.addColorStop(0, "rgba(204,143,27,.5)");
    g.addColorStop(0.12, "rgba(224,170,69,.3)");
    g.addColorStop(0.4, "rgba(240,207,138,.16)");
    g.addColorStop(1, "rgba(251,243,226,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, gw, gh);

    // 2. sphere body
    g = ctx.createRadialGradient(cx + 0.3 * R, cy - 0.42 * R, 0.05 * R, cx + 0.1 * R, cy - 0.15 * R, 1.25 * R);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#fffaf1");
    g.addColorStop(0.85, "#fbefd8");
    g.addColorStop(1, "#f4dfb3");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // 3. inner shading (clipped)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    g = ctx.createRadialGradient(cx, cy, 0.8 * R, cx, cy, R);
    g.addColorStop(0, "rgba(204,143,27,0)");
    g.addColorStop(0.75, "rgba(204,143,27,.10)");
    g.addColorStop(1, "rgba(204,143,27,.42)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    g = ctx.createLinearGradient(cx - 0.8 * R, cy + 0.8 * R, cx + 0.2 * R, cy - 0.2 * R);
    g.addColorStop(0, "rgba(204,143,27,.30)");
    g.addColorStop(1, "rgba(204,143,27,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);

    // 4. land dots
    const V = ((START_LON - (reduce ? 0 : t * SPIN)) * Math.PI) / 180;
    const cV = Math.cos(V);
    const sV = Math.sin(V);
    const cT = Math.cos(TILT);
    const sT = Math.sin(TILT);
    const rot = (x, y, z) => {
      const x1 = x * cV - z * sV;
      const z1 = z * cV + x * sV;
      return [x1, y * cT - z1 * sT, z1 * cT + y * sT];
    };
    bucketLen.fill(0);
    const rBase = Math.max(0.9, 1.75 * uv);
    for (let i = 0; i < N; i += 1) {
      const x1 = DX[i] * cV - DZ[i] * sV;
      const z1 = DZ[i] * cV + DX[i] * sV;
      const z = z1 * cT + DY[i] * sT;
      if (z <= 0.02) continue;
      const y = DY[i] * cT - z1 * sT;
      const b = Math.min(4, Math.floor(z * 5.5));
      const o = bucketLen[b] * 3;
      const arr = buckets[b];
      arr[o] = cx + R * x1;
      arr[o + 1] = cy - R * y;
      arr[o + 2] = rBase * (0.5 + 0.5 * Math.sqrt(z));
      bucketLen[b] += 1;
    }
    ctx.fillStyle = INK;
    for (let b = 0; b < 5; b += 1) {
      const arr = buckets[b];
      const n = bucketLen[b];
      if (!n) continue;
      ctx.globalAlpha = intro * (0.22 + b * 0.19);
      ctx.beginPath();
      for (let i = 0; i < n; i += 1) {
        const x = arr[i * 3];
        const y = arr[i * 3 + 1];
        const r = arr[i * 3 + 2];
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = intro;

    // 5. rim
    ctx.lineWidth = Math.max(1, 1.4 * uv);
    ctx.strokeStyle = "rgba(204,143,27,.38)";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.beginPath();
    ctx.arc(cx, cy, R - 0.8, -2.4, -0.3);
    ctx.stroke();

    // 6. route arcs
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = Math.max(1, 1.15 * uv);
    ctx.lineCap = "round";
    arcPts.forEach((pts, ai) => {
      const p = reduce ? 1 : clamp((t - (1.0 + ai * 0.18)) / 1.1);
      if (p <= 0) return;
      const segs = p * 56;
      ctx.globalAlpha = intro * 0.8;
      ctx.beginPath();
      let pen = false;
      let prev = rot(...pts[0]);
      for (let i = 1; i <= Math.ceil(segs); i += 1) {
        let cur = rot(...pts[i]);
        if (i > segs) {
          const f = segs - (i - 1);
          cur = [lerp(prev[0], cur[0], f), lerp(prev[1], cur[1], f), lerp(prev[2], cur[2], f)];
        }
        const vis = cur[2] > 0 || cur[0] * cur[0] + cur[1] * cur[1] > 1;
        if (vis) {
          if (!pen) ctx.moveTo(cx + R * prev[0], cy - R * prev[1]);
          ctx.lineTo(cx + R * cur[0], cy - R * cur[1]);
          pen = true;
        } else {
          pen = false;
        }
        prev = cur;
      }
      ctx.stroke();
    });

    // 7. pins + labels
    const label = S.port ? Math.max(9.5, 12.5 * uv) : 12.5 * uv;
    const pr = Math.max(3, 4.6 * uv);
    ctx.font = `500 ${label}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${0.05 * label}px`;
    cityVec.forEach((v, i) => {
      const p = reduce ? 1 : clamp((t - (0.8 + i * 0.16)) / 0.6);
      const r = rot(...v);
      const a = clamp(r[2] * 5) * p;
      if (a <= 0) return;
      const x = cx + R * r[0];
      const y = cy - R * r[1];
      ctx.globalAlpha = intro * a;
      ctx.beginPath();
      ctx.arc(x, y, pr + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, pr, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.fill();
      ctx.fillStyle = INK;
      ctx.fillText(CITIES[i].name.toUpperCase(), x, y - (pr + 0.55 * label));
    });
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- hero + glow
  function updateHero(e, t) {
    const k = clamp((0.95 - e) / 0.42);
    el.copy.style.opacity = String(1 - k);
    el.copy.style.transform = k > 0 ? `translateY(${-5 * k * (S.vh / 100)}px)` : "";

    if (S.headlineReady) {
      const j = k > 0 && k < 1 ? (((Math.floor(k * 16) * 9301 + 49297) % 233280) / 233280 - 0.5) : 0;
      el.lines.forEach((ln, i) => {
        if (k <= 0) {
          ln.style.transform = "";
          ln.style.textShadow = "";
          ln.style.clipPath = "";
          return;
        }
        const o = j * 0.09 * (i % 2 ? -1 : 1);
        ln.style.transform = `translateX(${o}em)`;
        ln.style.textShadow = `${-1.6 * o}em 0 0 rgba(${GOLD_RGB},${0.7 * k + 0.15}), ${0.8 * o}em 0 0 rgba(17,17,17,.25)`;
        ln.style.clipPath = `inset(0 ${k * k * 100}% 0 0)`;
      });
    }

    const n = 1 - clamp((0.85 - e) / 0.4);
    el.logo.style.opacity = String(n);
    el.vnav.style.opacity = String(n);

    el.globe.style.opacity = String(0.45 + 0.55 * clamp(e / 0.7));
    if (S.sticky) el.hero.style.visibility = e < -0.06 ? "hidden" : "";
    else el.hero.style.visibility = "";

    const hy = window.scrollY - S.heroTop;
    const covered = hy < -S.vh; // the intro still fills the screen
    if (S.sticky && covered) el.hero.style.visibility = "hidden";
    const heroOnScreen = !covered && (S.sticky ? e >= -0.1 : hy < S.heroH);
    if (e >= -0.1 && heroOnScreen) drawGlobe(t);
  }

  function updateGlow(e) {
    const hz = el.hz;
    if (e > 1.04) {
      hz.style.display = "none";
      return;
    }
    const drawn = e > 0.12 ? e : -0.03 + 0.15 * Math.exp((e - 0.12) / 0.15);
    const op = 1 - easeInOutQuad(clamp((-0.12 - e) / 0.4));
    if (op < 0.002) {
      hz.style.display = "none";
      return;
    }
    const { vw, vh } = S;
    const Rx = Math.max(0.75 * vw, 0.9 * vh);
    const Ry = 0.72 * vh;
    const cyy = drawn * vh - Ry;
    const s = (m) => `${(m * Rx).toFixed(1)}px`;
    hz.style.display = "block";
    hz.style.opacity = String(op);
    hz.style.background = `radial-gradient(${Rx.toFixed(1)}px ${Ry.toFixed(1)}px at 50% ${cyy.toFixed(1)}px,
      rgba(255,255,255,0) 0,
      rgba(251,243,226,0) ${s(0.985)},
      rgba(245,225,185,.6) ${s(1)},
      #f2d397 ${s(1.06)},
      #e2ad4a ${s(1.14)},
      #cc8f1b ${s(1.236)},
      #e2ad4a ${s(1.32)},
      #f2d397 ${s(1.42)},
      #faeccf ${s(1.53)},
      #ffffff ${s(1.65)})`;
  }

  // ---------------------------------------------------------------- bottle scene
  function seqPos(time) {
    let i = 0;
    while (i < SEQ_T.length - 2 && SEQ_T[i + 1] <= time) i += 1;
    const span = SEQ_T[i + 1] - SEQ_T[i];
    return i + clamp((time - SEQ_T[i]) / span);
  }

  function drawFrame(ctx, f, dx, dy, dw, dh) {
    const sx = (f % COLS) * FW;
    const sy = Math.floor(f / COLS) * FH;
    ctx.drawImage(sprite, sx, sy, FW, FH, dx, dy, dw, dh);
  }

  function updateScene(sy, now, forced) {
    const { vw, vh, trackTop, A, B } = S;
    const inView = sy + vh > trackTop - 2 && sy < trackTop + S.trackH;
    if (!inView && !forced) return;

    const qn = clamp((sy - trackTop) / (A * vh));
    const target = qn * SEQ_TOTAL;
    if (reduce || forced) S.clipCur = target;
    else {
      S.clipCur += (target - S.clipCur) * 0.2;
      if (Math.abs(target - S.clipCur) < 0.0005) S.clipCur = target;
    }
    const pos = seqPos(S.clipCur);
    const i0 = Math.floor(pos);
    const frac = pos - i0;
    const fA = SEQ[i0];
    const fB = SEQ[Math.min(SEQ.length - 1, i0 + 1)];

    // camera pull-back as the last bottle lights up
    const p = smooth(clamp((target - PULL_START) / PULL_LEN));
    let E0 = 0.86;
    let E1 = 0.56;
    let H0 = 0.8;
    let H1 = 0.46;
    let X0 = 0.5;
    let X1 = 0.36;
    if (S.port) {
      E0 = 0.8; E1 = 0.42; H0 = 0.62; H1 = 0.32; X0 = 0.5; X1 = 0.5;
    } else if (S.land) {
      E0 = 0.86; E1 = 0.42; H0 = 0.78; H1 = 0.36; X0 = 0.5; X1 = 0.5;
    } else if (S.hp) {
      E0 = 0.84; E1 = 0.48; H0 = 0.74; H1 = 0.4; X0 = 0.5; X1 = 0.42;
    }
    const sh = S.sh;
    const edge = lerp(E0, E1, p) * sh;
    const bh = lerp(H0, H1, p) * sh;
    const bw = (bh * FW) / FH;
    const bx = lerp(X0, X1, p) * vw;
    el.scene.style.setProperty("--edge-px", `${edge.toFixed(1)}px`);

    // spotlight follows the brightness of the current frame
    const lit = lerp(LIT[fA], LIT[fB], frac);
    el.spot.style.background = `radial-gradient(${(bw * 2.4).toFixed(0)}px ${(bh * 0.75).toFixed(0)}px at ${bx.toFixed(0)}px ${(edge - bh * 0.42).toFixed(0)}px, rgba(${GOLD_RGB},${(0.08 + 0.2 * lit).toFixed(3)}), rgba(${GOLD_RGB},0) 100%), radial-gradient(${(bw * 1.8).toFixed(0)}px ${(bh * 0.08).toFixed(0)}px at ${bx.toFixed(0)}px ${edge.toFixed(0)}px, rgba(255,214,140,${(0.1 + 0.3 * lit).toFixed(3)}), rgba(255,214,140,0) 100%)`;

    const ctx = bctx;
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    ctx.clearRect(0, 0, S.sw, sh);
    if (spriteReady) {
      const dy = edge - bh * (1 - BASE_PAD);
      const dx = bx - bw / 2;
      ctx.globalAlpha = 1;
      drawFrame(ctx, fA, dx, dy, bw, bh);
      if (frac > 0.01 && fB !== fA) {
        ctx.globalAlpha = frac;
        drawFrame(ctx, fB, dx, dy, bw, bh);
      }
      // reflection on the floor
      ctx.save();
      ctx.translate(0, 2 * edge);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.14;
      drawFrame(ctx, fA, dx, dy, bw, bh);
      ctx.restore();
      const rg = ctx.createLinearGradient(0, edge, 0, edge + bh * 0.32);
      rg.addColorStop(0, "rgba(13,11,8,0)");
      rg.addColorStop(1, "rgba(13,11,8,1)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = rg;
      ctx.fillRect(dx - 4, edge, bw + 8, bh * 0.34);
    }

    const cyc = CYCLE[fA];
    const num = cyc === 0 ? 6 : cyc;
    el.count.textContent = `0${num} / 06`;

    const settled = target >= SETTLE_T ? 1 : 0;
    if (settled !== S.phOn) {
      S.phOn = settled;
      el.scene.style.setProperty("--ph", String(settled));
    }

    const r = clamp((sy - trackTop - A * vh) / (B * vh));
    const stripX = vw - r * (S.stripW + 0.45 * vw);
    el.strip.style.transform = `translate3d(${stripX.toFixed(1)}px,0,0)`;
    el.giant.style.transform = `translate3d(${(vw - r * (S.lettersW + vw)).toFixed(1)}px,0,0)`;
    el.cards.forEach((card, i) => {
      const left = stripX + S.cardLefts[i];
      const s = clamp((0.98 - left / vw) / 0.3, -0.4, 1.6) * 100;
      card.style.setProperty("--s", `${s.toFixed(1)}%`);
    });
  }

  function updateSpeed(sy, now) {
    const dt = Math.max(1, now - S.lastT) / 1000;
    const inst = Math.abs(sy - S.lastY) / dt / 32;
    S.speed += (inst - S.speed) * 0.1;
    S.lastY = sy;
    S.lastT = now;
    const v = Math.min(99, Math.round(S.speed));
    el.speed.textContent = `${v < 10 ? "0" : ""}${v} ML/S`;
  }

  // ---------------------------------------------------------------- loop
  function frame(now, forced) {
    const sy = window.scrollY;
    const t = (now - t0) / 1000;
    const e = (S.wrapH - (sy - S.heroTop)) / S.vh - 0.47;
    if (hasIntro) updateIntro(sy, t, forced === true);
    updateHero(e, t);
    updateGlow(e);
    if (counters.length) runCounters(now);
    updateScene(sy, now, forced === true);
    if (!rec) updateSpeed(sy, now);
  }

  function loop(now) {
    frame(now);
    raf = window.requestAnimationFrame(loop);
  }

  // recorder mode: deterministic path through the brands scene
  if (rec) {
    const bez = (x) => {
      // cubic-bezier(.4,.05,.55,.95) solved for y at x
      let lo = 0;
      let hi = 1;
      const bx = (s) => 3 * (1 - s) * (1 - s) * s * 0.4 + 3 * (1 - s) * s * s * 0.55 + s * s * s;
      const by = (s) => 3 * (1 - s) * (1 - s) * s * 0.05 + 3 * (1 - s) * s * s * 0.95 + s * s * s;
      for (let i = 0; i < 30; i += 1) {
        const m = (lo + hi) / 2;
        if (bx(m) < x) lo = m;
        else hi = m;
      }
      return by((lo + hi) / 2);
    };
    let prevY = null;
    window.__recTime = (_video, tt) => {
      const k = bez(clamp((tt - 0.44) / (10.56 - 0.44)));
      const y = S.trackTop + k * (S.trackH - S.vh);
      window.scrollTo(0, y);
      const v = prevY === null ? 0 : Math.min(99, Math.round((Math.abs(y - prevY) * 60) / 32));
      prevY = y;
      el.speed.textContent = `${v < 10 ? "0" : ""}${v} ML/S`;
      frame(t0 + tt * 1000, true);
      return S.clipCur;
    };
  }

  const onResize = () => layout();
  window.addEventListener("resize", onResize);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  sprite.addEventListener("load", () => frame(performance.now(), true));
  if (rec) frame(performance.now(), true);
  else raf = window.requestAnimationFrame(loop);

  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    timers.forEach((id) => window.clearTimeout(id));
    observers.forEach((o) => o.disconnect());
    anims.forEach((a) => {
      a.onfinish = null;
      a.cancel();
    });
    html.classList.remove("mhp", "m-port", "m-land", "m-hp", "sticky", "anim-done");
    ["--uc", "--uv", "--us", "--u", "--vw", "--vh"].forEach((p) => html.style.removeProperty(p));
  };
}

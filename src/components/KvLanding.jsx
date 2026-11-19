import { useEffect, useRef } from "react";

const serviceVideo1080 =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4";
const serviceVideo720 =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4";
const servicePoster =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2307e4bf-be39-42b4-b579-e168aeccabf0.jpg";
const portPhoto =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261116_131941_31d10ef7-4bff-4a6b-94a7-27e15c950f26.png&w=1200&q=85";

const dots = [];
const landBlobs = [
  [-100, 45, 28, 22], [-74, 9, 18, 30], [-60, -15, 18, 38],
  [-45, -12, 12, 22], [-105, 25, 18, 18], [-83, -5, 12, 18],
  [15, 48, 34, 20], [28, 25, 28, 25], [18, 7, 24, 28],
  [25, -18, 20, 33], [48, 22, 18, 18], [70, 42, 28, 15],
  [88, 27, 24, 18], [125, 45, 24, 20], [138, 30, 18, 18],
  [115, 8, 40, 26], [135, -24, 24, 18], [145, -38, 12, 12],
  [-5, 72, 22, 10], [35, 67, 25, 12], [140, 65, 16, 10],
];

for (let lat = -58; lat <= 80; lat += 2.2) {
  const count = Math.round((360 * Math.cos((lat * Math.PI) / 180)) / 2.2);
  for (let i = 0; i < count; i += 1) {
    const lon = -180 + ((i + (Math.abs(lat) % 4 ? 0.5 : 0)) * 360) / count;
    const onLand = landBlobs.some(([cx, cy, rx, ry]) => {
      const dx = (lon - cx) / rx;
      const dy = (lat - cy) / ry;
      return dx * dx + dy * dy < 1;
    });
    if (onLand) dots.push([lon, lat]);
  }
}

const cities = [
  { name: "Lagos", lon: 3.39, lat: 6.45 },
  { name: "London", lon: -0.12, lat: 51.5 },
  { name: "Cape Town", lon: 18.42, lat: -33.92 },
];

const services = [
  ["AIR / FREIGHT", "Express, priority and deferred options across global lanes, booked and tracked end to end."],
  ["OCEAN / FREIGHT", "FCL and LCL sailings with carrier choice based on cost and transit time."],
  ["CUSTOMS / BROKERAGE", "Licensed expertise for classification, duties and inspections, so goods clear first time."],
  ["WAREHOUSING / 3PL", "Storage, pick and pack, and distribution that plugs straight into transport."],
  ["PROJECT / CARGO", "Oversized and heavy-lift moves, engineered from factory to foundation."],
];

function Globe({ canvasRef }) {
  return <canvas ref={canvasRef} className="kv-globe" aria-label="Rotating Bogo global trade network" />;
}

function ServiceIcon({ index }) {
  const paths = [
    "M4 20 20 4M8 4h12v12M4 20h8",
    "M3 16h18M5 16l2-7h10l3 7M9 9l2-4h2l2 4M7 20h2M15 20h2",
    "M5 3h10l4 4v14H5zM15 3v5h4M8 13l2 2 5-5",
    "M3 20h18M5 20V9h14v11M8 9V5h8v4M8 13h8M8 17h8",
    "M4 18h16M7 18V8h10v10M7 8l5-4 5 4M12 14v4",
  ];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[index]} />
    </svg>
  );
}

export default function KvLanding() {
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const sceneRef = useRef(null);
  const horizonRef = useRef(null);
  const heroCopyRef = useRef(null);
  const heroNavRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const video = videoRef.current;
    const scene = sceneRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let last = performance.now();
    let currentTime = 0;
    let angle = -10;
    let speed = 0;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const project = (lon, lat, rotation, radius, cx, cy, tilt) => {
      const longitude = ((lon + rotation) * Math.PI) / 180;
      const latitude = (lat * Math.PI) / 180;
      const x0 = Math.cos(latitude) * Math.sin(longitude);
      const y0 = Math.sin(latitude);
      const z0 = Math.cos(latitude) * Math.cos(longitude);
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      return { x: cx + x0 * radius, y: cy - y * radius, z };
    };

    const drawGlobe = (now) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const elapsed = now / 1000;
      const radius = Math.min(height * 0.44, width * 0.39);
      const cx = width * 0.78;
      const cy = height * 0.52;
      const tilt = 0.16;
      angle = reduced ? -10 : -10 - elapsed * 2.4;
      ctx.clearRect(0, 0, width, height);
      const haze = ctx.createRadialGradient(cx - radius * 0.2, cy + radius * 0.2, radius * 0.5, cx, cy, radius * 1.65);
      haze.addColorStop(0, "rgba(204,143,27,.28)");
      haze.addColorStop(0.35, "rgba(255,199,0,.13)");
      haze.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);
      const body = ctx.createRadialGradient(cx + radius * 0.3, cy - radius * 0.4, radius * 0.05, cx + radius * 0.1, cy - radius * 0.1, radius * 1.25);
      body.addColorStop(0, "#fff");
      body.addColorStop(0.65, "#fffaf0");
      body.addColorStop(1, "#f1dfb8");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      const dotsByDepth = [[], [], [], [], []];
      dots.forEach(([lon, lat]) => {
        const point = project(lon, lat, angle, radius, cx, cy, tilt);
        if (point.z > 0.02) dotsByDepth[Math.min(4, Math.floor(point.z * 5.5))].push(point);
      });
      dotsByDepth.forEach((bucket, index) => {
        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.2 + index * 0.18;
        bucket.forEach((point) => {
          const dotRadius = Math.max(0.8, radius * 0.004 * (0.5 + 0.5 * Math.sqrt(point.z)));
          ctx.beginPath();
          ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.globalAlpha = 0.8;
      const arcPairs = [[cities[1], cities[0]], [cities[1], cities[2]], [cities[0], cities[2]]];
      arcPairs.forEach(([from, to], arcIndex) => {
        const progress = reduced ? 1 : clamp((elapsed - 1 - arcIndex * 0.18) / 1.1);
        if (!progress) return;
        ctx.strokeStyle = "#cc8f1b";
        ctx.lineWidth = Math.max(1, radius * 0.003);
        ctx.beginPath();
        for (let i = 0; i <= 56 * progress; i += 1) {
          const t = i / 56;
          const lon = from.lon + (to.lon - from.lon) * t;
          const lat = from.lat + (to.lat - from.lat) * t + Math.sin(Math.PI * t) * 18;
          const point = project(lon, lat, angle, radius * (1 + Math.sin(Math.PI * t) * 0.05), cx, cy, tilt);
          if (point.z > 0) i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
        }
        ctx.stroke();
      });
      ctx.restore();
      ctx.strokeStyle = "rgba(204,143,27,.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      cities.forEach((city, index) => {
        const point = project(city.lon, city.lat, angle, radius, cx, cy, tilt);
        const pinProgress = reduced ? 1 : clamp((elapsed - 0.8 - index * 0.16) / 0.6);
        if (point.z <= 0.02 || !pinProgress) return;
        ctx.globalAlpha = clamp(point.z * 5) * pinProgress;
        ctx.fillStyle = "#cc8f1b";
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(3, radius * 0.011), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = `${Math.max(10, radius * 0.03)}px "Poppins", sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#111";
        ctx.fillText(city.name.toUpperCase(), point.x, point.y - radius * 0.04);
      });
      ctx.globalAlpha = 1;
    };

    const update = (now) => {
      const dt = Math.max(16, now - last);
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const trackTop = track.offsetTop;
      const horizon = horizonRef.current;
      const clipLength = heroHeight * 2.4;
      const q = clamp((scrollY - trackTop) / clipLength);
      const r = clamp((scrollY - trackTop - clipLength) / Math.max(heroHeight * 1.2, track.offsetHeight - clipLength));
      const horizonEdge = 1.18 - scrollY / heroHeight;
      const horizonProgress = clamp((1.04 - horizonEdge) / 1.45);
      horizon.style.transform = `translateY(${(1 - horizonProgress) * 80}%)`;
      horizon.style.opacity = String(clamp(1 - Math.max(0, -horizonEdge) / 0.4) * 0.8);
      const fadeProgress = clamp((0.95 - horizonEdge) / 0.42);
      heroCopyRef.current.style.opacity = String(1 - fadeProgress);
      heroCopyRef.current.style.transform = `translateY(${-5 * fadeProgress}vh)`;
      heroNavRef.current.style.opacity = String(1 - clamp((0.85 - horizonEdge) / 0.4));
      const targetTime = q * Math.max(0, (video.duration || 4.04) - 1 / 48);
      currentTime += (targetTime - currentTime) * 0.2;
      if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - currentTime) > 1 / 60) {
        video.currentTime = currentTime;
      }
      const nextSpeed = Math.min(99, Math.abs(scrollY - (update.lastScroll || scrollY)) / dt * 1000 / 32);
      speed += (nextSpeed - speed) * 0.1;
      update.lastScroll = scrollY;
      scene.style.setProperty("--service-progress", r);
      scene.style.setProperty("--service-speed", `"${String(Math.round(speed)).padStart(2, "0")} KM/H"`);
      scene.classList.toggle("is-settled", q >= 0.94);
      drawGlobe(now);
      last = now;
      raf = requestAnimationFrame(update);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="kv-experience">
      <div className="kv-hwrap">
        <section className="kv-hero" id="kv-top">
          <div className="kv-globe-wrap"><Globe canvasRef={canvasRef} /></div>
          <div className="kv-hero-copy">
            <a className="kv-mark" href="#kv-top" aria-label="Bogo Beverages home">
              <img src="/images/logo.png" alt="" />
            </a>
            <nav className="kv-nav" ref={heroNavRef} aria-label="Section navigation">
              <a href="/company/">ABOUT US</a>
              <a href="/brands/">BRANDS</a>
              <a href="/contact/">CONTACTS</a>
            </nav>
            <div className="kv-copy" ref={heroCopyRef}>
              <p className="kv-overline">ONE PORTFOLIO</p>
              <h1><span>EVERY POUR</span><span>HAS A</span><span>STORY.</span></h1>
              <p className="kv-lede">Premium wines, spirits and drinks, brought together for the moments that move Africa.</p>
              <div className="kv-buttons">
                <a className="kv-button kv-button-fill" href="#kv-about">EXPLORE PORTFOLIO</a>
                <a className="kv-button" href="#kv-services">OUR SERVICES</a>
              </div>
            </div>
          </div>
        </section>
        <div className="kv-horizon" ref={horizonRef} aria-hidden="true" />
      </div>

      <section className="kv-stats" id="kv-about">
        <div className="kv-stats-pin">
          <div className="kv-photo" style={{ backgroundImage: `url("${portPhoto}")` }} />
          <h2><span>WE MOVE</span><span>GOOD TASTE.</span><span>WE BUILD</span><span>THE MOMENT.</span></h2>
        </div>
        <div className="kv-stats-scroll">
          <div className="kv-intro">
            <p>With every part of the portfolio under one roof, Bogo brings the right drink to every occasion.</p>
            <p>From wine and spirits to refreshing everyday pours, we pair global reach with local insight to keep the good times moving.</p>
            <div><a href="#brands">Our portfolio</a><a href="#kv-top">Back to top</a></div>
          </div>
          <ul className="kv-numbers">
            <li><strong>150+</strong><span>Premium brands</span></li>
            <li><strong>4</strong><span>Countries connected</span></li>
            <li><strong>120+</strong><span>Years of experience</span></li>
            <li><strong>24/7</strong><span>Ideas in motion</span></li>
          </ul>
        </div>
      </section>

      <section className="kv-track" id="kv-services" ref={trackRef}>
        <div className="kv-scene" ref={sceneRef}>
          <video ref={videoRef} className="kv-video" muted playsInline preload="auto" poster={servicePoster}>
            <source src={serviceVideo1080} type="video/mp4" media="(min-width: 901px)" />
            <source src={serviceVideo720} type="video/mp4" />
          </video>
          <div className="kv-service-letters" aria-hidden="true">OUR SERVICES</div>
          <div className="kv-speed" aria-hidden="true">00 KM/H</div>
          <div className="kv-service-band">
            <div className="kv-service-strip">
              <div className="kv-service-lead"><h2>EVERYTHING YOUR<br />DRINKS NEED.<br /><em>UNDER ONE GROUP.</em></h2><div><p>From sourcing to shelf, we bring decades of craft to every beverage discipline.</p><p>One connected portfolio means one trusted partner and full visibility from idea to occasion.</p></div></div>
              {services.map(([title, body], index) => <article className="kv-card" key={title}><ServiceIcon index={index} /><h3>{title.split(" / ").map((line) => <span key={line}>{line}</span>)}</h3><p>{body}</p></article>)}
            </div>
            <a className="kv-services-pill" href="#brands">OUR PORTFOLIO</a>
          </div>
        </div>
      </section>
    </div>
  );
}

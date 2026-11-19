import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * The bottle is drawn inline so the liquid can be clipped by the SVG cavity
 * without a separate bottle image request. Distances are in the 320 x 760
 * viewBox coordinate system.
 *
 * The cavity floor is y = 694 and the wave crest sits 18 units above the
 * liquid group origin, so 712 puts the crest exactly on the floor at
 * progress 0 (empty bottle).
 */
const LIQUID_START = 712;
const WAVE_PATH =
  "M0 20 C26 2 54 2 80 20 S134 38 160 20 S214 2 240 20 S294 38 320 20 S374 2 400 20 S454 38 480 20 S534 2 560 20 S614 38 640 20 L640 40 L0 40 Z";

const BOTTLE_BODY =
  "M138 60 H182 V148 C182 168 191 183 207 197 C241 225 261 263 261 309 V656 C261 690 242 708 212 708 H108 C78 708 59 690 59 656 V309 C59 263 79 225 113 197 C129 183 138 168 138 148 Z";

const BOTTLE_CAVITY =
  "M144 92 H176 V150 C176 170 186 185 201 199 C233 227 251 265 251 309 V650 C251 677 237 694 210 694 H110 C83 694 69 677 69 650 V309 C69 265 87 227 119 199 C134 185 144 170 144 150 Z";

const bubbles = [
  { cx: 112, cy: 636, r: 2.6, delay: -0.4, duration: 5.8 },
  { cx: 198, cy: 608, r: 3.4, delay: -2.1, duration: 6.6 },
  { cx: 146, cy: 574, r: 1.8, delay: -3.5, duration: 5.2 },
  { cx: 212, cy: 512, r: 2.2, delay: -1.3, duration: 7.1 },
  { cx: 124, cy: 474, r: 3, delay: -4.2, duration: 6.2 },
  { cx: 178, cy: 402, r: 1.6, delay: -2.8, duration: 5.6 },
  { cx: 154, cy: 318, r: 2.4, delay: -1.8, duration: 6.9 },
];

export default function BottlePour() {
  const layerRef = useRef(null);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const main = layer?.closest("main");
    const aboutSection = main?.querySelector(".about");
    const statsSection = main?.querySelector(".stats");
    if (!layer || !main || !aboutSection || !statsSection) return undefined;

    const liquid = layer.querySelector(".pour-liquid");
    const waveFront = layer.querySelector(".pour-wave--front");
    const waveBack = layer.querySelector(".pour-wave--back");
    const label = layer.querySelector(".pour-label");
    const labelGlow = layer.querySelector(".pour-label-glow");
    const sweep = layer.querySelector(".pour-sweep");
    const sweepBar = layer.querySelector(".pour-sweep-bar");
    const halo = layer.querySelector(".pour-halo");
    const mm = gsap.matchMedia();
    gsap.set(layer, { autoAlpha: 0 });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(liquid, { y: 0 });
      gsap.set(label, { opacity: 1 });
      gsap.set(labelGlow, { opacity: 0.55 });
      gsap.set(sweep, { opacity: 0 });
      gsap.set(halo, { opacity: 1 });
      layer.style.setProperty("--pour-progress", "1");
      layer.style.setProperty("--pour-slosh", "1");
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(liquid, { y: LIQUID_START });
      gsap.set(label, { opacity: 0.5 });
      gsap.set(labelGlow, { opacity: 0 });
      gsap.set(sweep, { opacity: 0 });
      gsap.set(sweepBar, { x: -180 });
      gsap.set(halo, { opacity: 0.45 });
      layer.style.setProperty("--pour-progress", "0");
      layer.style.setProperty("--pour-slosh", "1");

      const waveLoops = [
        gsap.to(waveFront, {
          x: -320,
          duration: 6.4,
          ease: "none",
          repeat: -1,
        }),
        gsap.to(waveBack, {
          x: -320,
          duration: 9.6,
          ease: "none",
          repeat: -1,
        }),
      ];

      const slosh = { value: 1, target: 1, lastMove: 0 };

      const settleWaves = () => {
        if (performance.now() - slosh.lastMove > 120) slosh.target = 1;

        slosh.value += (slosh.target - slosh.value) * 0.07;
        const value = Math.abs(slosh.value - 1) < 0.001 ? 1 : slosh.value;

        layer.style.setProperty("--pour-slosh", value.toFixed(4));
      };

      gsap.ticker.add(settleWaves);

      /*
       * The bottle is a fixed background layer behind the About and Stats
       * sections. Its scroll range ends when the bottom of the fixed bottle
       * stage meets the bottom of the Stats section.
       */
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: aboutSection,
          start: "top bottom",
          endTrigger: statsSection,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => gsap.to(layer, { autoAlpha: 1, duration: 0.25 }),
          onLeaveBack: () => gsap.to(layer, { autoAlpha: 0, duration: 0.25 }),
          onUpdate: (self) => {
            layer.style.setProperty(
              "--pour-progress",
              self.progress.toFixed(4)
            );

            slosh.lastMove = performance.now();
            slosh.target =
              1 + Math.min(Math.abs(self.getVelocity()) / 4200, 0.4);
          },
          onLeave: () => gsap.to(layer, { autoAlpha: 0, duration: 0.25, overwrite: true }),
          onEnterBack: () => {
            gsap.to(layer, { autoAlpha: 1, duration: 0.25, overwrite: true });
          },
        },
      });

      /*
       * Keep every tween inside 0 - 1 so the final timeline duration is exactly
       * 1. ScrollTrigger maps scroll progress onto the timeline duration, so a
       * longer timeline would leave the bottle only partly filled at progress 1.
       */
      timeline
        .to(halo, { opacity: 1, duration: 1 }, 0)
        .to(liquid, { y: 0, duration: 1 }, 0)
        .to(label, { opacity: 1, duration: 0.64 }, 0.16)
        .to(labelGlow, { opacity: 0.55, duration: 0.18 }, 0.78)
        .fromTo(
          sweep,
          { opacity: 0 },
          { opacity: 0.5, duration: 0.04 },
          0.84
        )
        .fromTo(
          sweepBar,
          { x: -180 },
          { x: 380, duration: 0.14, ease: "power1.inOut" },
          0.84
        )
        .to(sweep, { opacity: 0, duration: 0.04 }, 0.94);

      return () => {
        gsap.ticker.remove(settleWaves);
        waveLoops.forEach((loop) => loop.kill());
      };
    });

    let cancelled = false;
    let refreshFrame = 0;

    const refreshWhenReady = () => {
      if (cancelled) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    /*
     * The section images load after mount and change the main content height.
     * Refresh when that happens so the scroll range still ends exactly when
     * the last section reaches the bottom of the viewport.
     */
    const resizeObserver = new ResizeObserver(refreshWhenReady);
    resizeObserver.observe(main);
    window.addEventListener("load", refreshWhenReady);

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshWhenReady);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(refreshFrame);
      resizeObserver.disconnect();
      window.removeEventListener("load", refreshWhenReady);
      mm.revert();
    };
  }, []);

  return (
    <div className="bottle-bg" ref={layerRef} aria-hidden="true">
      <div className="bottle-bg-inner">
        <div className="bottle-bg-stage">
          <div className="pour-halo" />
          <svg
            className="pour-bottle"
            viewBox="0 0 320 760"
            focusable="false"
          >
            <defs>
              <linearGradient id="pour-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#101612" />
                <stop offset="0.26" stopColor="#263129" />
                <stop offset="0.52" stopColor="#111713" />
                <stop offset="0.76" stopColor="#222d26" />
                <stop offset="1" stopColor="#0a0f0c" />
              </linearGradient>

              <linearGradient id="pour-liquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f0b74a" />
                <stop offset="0.16" stopColor="#d99a2b" />
                <stop offset="0.62" stopColor="#ac6510" />
                <stop offset="1" stopColor="#773b04" />
              </linearGradient>

              <linearGradient
                id="pour-liquid-shade"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0" stopColor="#2e1700" stopOpacity="0.45" />
                <stop offset="0.28" stopColor="#2e1700" stopOpacity="0" />
                <stop offset="0.7" stopColor="#2e1700" stopOpacity="0" />
                <stop offset="1" stopColor="#2e1700" stopOpacity="0.5" />
              </linearGradient>

              <linearGradient id="pour-cap" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#7d520c" />
                <stop offset="0.28" stopColor="#e1b558" />
                <stop offset="0.52" stopColor="#a9771f" />
                <stop offset="0.76" stopColor="#f2cd79" />
                <stop offset="1" stopColor="#6f4708" />
              </linearGradient>

              <linearGradient id="pour-label" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#faf4e7" />
                <stop offset="1" stopColor="#e8dabe" />
              </linearGradient>

              <radialGradient id="pour-label-glow">
                <stop offset="0" stopColor="#ffd983" stopOpacity="0.85" />
                <stop offset="0.55" stopColor="#dfa532" stopOpacity="0.35" />
                <stop offset="1" stopColor="#dfa532" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="pour-sweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="0.45" stopColor="#fff7df" stopOpacity="0.8" />
                <stop offset="0.55" stopColor="#fff7df" stopOpacity="0.8" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="pour-shadow">
                <stop offset="0" stopColor="#c38a1d" stopOpacity="0.28" />
                <stop offset="1" stopColor="#c38a1d" stopOpacity="0" />
              </radialGradient>

              <clipPath id="pour-outer" clipPathUnits="userSpaceOnUse">
                <path d={BOTTLE_BODY} />
              </clipPath>

              <clipPath id="pour-inner" clipPathUnits="userSpaceOnUse">
                <path d={BOTTLE_CAVITY} />
              </clipPath>
            </defs>

            <ellipse
              className="pour-shadow"
              cx="160"
              cy="720"
              rx="104"
              ry="20"
              fill="url(#pour-shadow)"
            />

            {/* Translucent glass behind the liquid. */}
            <path
              d={BOTTLE_BODY}
              fill="url(#pour-glass)"
              fillOpacity="0.62"
            />

            {/* Liquid is drawn above the glass so the fill is always visible. */}
            <g clipPath="url(#pour-inner)">
              <g className="pour-liquid">
                <rect
                  x="-40"
                  y="20"
                  width="400"
                  height="740"
                  fill="url(#pour-liquid)"
                />
                <rect
                  x="-40"
                  y="20"
                  width="400"
                  height="740"
                  fill="url(#pour-liquid-shade)"
                />

                <g className="pour-bubbles">
                  {bubbles.map((bubble) => (
                    <circle
                      key={`${bubble.cx}-${bubble.cy}`}
                      className="pour-bubble"
                      cx={bubble.cx}
                      cy={bubble.cy}
                      r={bubble.r}
                      style={{
                        animationDelay: `${bubble.delay}s`,
                        animationDuration: `${bubble.duration}s`,
                      }}
                    />
                  ))}
                </g>

                <g className="pour-waves" transform="translate(0 -20)">
                  <g className="pour-wave-scale">
                    <g className="pour-wave pour-wave--back">
                      <path d={WAVE_PATH} fill="#9b5d0c" opacity="0.58" />
                    </g>
                    <g className="pour-wave pour-wave--front">
                      <path d={WAVE_PATH} fill="#e5a636" />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            {/* Glass reflections sit on top of the liquid. */}
            <g className="pour-glass-shine">
              <path
                d="M92 330 C85 432 87 552 100 646"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.14"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M231 336 C238 438 235 548 223 638"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.06"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M78 646 C103 681 217 681 242 646"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.07"
                strokeWidth="3"
              />
            </g>

            <path
              d={BOTTLE_BODY}
              fill="none"
              stroke="#c69434"
              strokeOpacity="0.65"
              strokeWidth="1.5"
            />

            <g className="pour-cap-group">
              <rect
                x="127"
                y="14"
                width="66"
                height="50"
                rx="8"
                fill="url(#pour-cap)"
              />
              <path
                d="M139 18 V60 M150 16 V61 M161 16 V61 M172 16 V61 M183 18 V60"
                stroke="#422a04"
                strokeOpacity="0.35"
                strokeWidth="2"
              />
              <rect
                x="132"
                y="61"
                width="56"
                height="11"
                rx="4"
                fill="url(#pour-cap)"
              />
              <rect
                x="142"
                y="29"
                width="8"
                height="22"
                rx="4"
                fill="#fff4d2"
                opacity="0.18"
              />
            </g>

            <g className="pour-label">
              <rect
                className="pour-label-glow"
                x="64"
                y="430"
                width="192"
                height="196"
                fill="url(#pour-label-glow)"
                opacity="0"
              />
              <rect
                x="84"
                y="452"
                width="152"
                height="150"
                rx="3"
                fill="url(#pour-label)"
                stroke="#bd8a2a"
                strokeWidth="1"
              />
              <path
                d="M102 474 H218 M115 581 H205"
                stroke="#b9852c"
                strokeWidth="1"
                opacity="0.7"
              />
              <text
                x="160"
                y="523"
                textAnchor="middle"
                fill="#251a08"
                fontSize="32"
                fontWeight="700"
                letterSpacing="5"
              >
                BOGO
              </text>
              <text
                x="160"
                y="545"
                textAnchor="middle"
                fill="#5e4a24"
                fontSize="7.5"
                fontWeight="500"
                letterSpacing="2.2"
              >
                PREMIUM BEVERAGES
              </text>
              <text
                x="160"
                y="566"
                textAnchor="middle"
                fill="#8a6a2c"
                fontSize="6.5"
                fontWeight="400"
                letterSpacing="2.6"
              >
                AFRICA · 24/7
              </text>
              <circle cx="160" cy="488" r="2.5" fill="#bd8a2a" />
            </g>

            {/* Light sweep on top of the label, still clipped to the glass. */}
            <g clipPath="url(#pour-inner)">
              <g className="pour-sweep">
                <g transform="rotate(16 160 380)">
                  <rect
                    className="pour-sweep-bar"
                    x="-180"
                    y="-40"
                    width="68"
                    height="860"
                    fill="url(#pour-sweep)"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

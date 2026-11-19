import goldLogo from "../../assets/gold-logo.png";
import cavatina from "../../assets/cavatina.png";

// Scroll-driven opener: the gold mark flips upside down, a Cavatina bottle rises
// out of it, slides left and pours into a glass, the glass overflows into a gold
// flood, and the flood lifts away to reveal the globe hero. Driven by
// updateIntro() in src/motion/engine.js.
const SPARKS = 14;
const BUBBLES = 12;
const DROPS = 6;

export default function IntroPour() {
  return (
    <section className="mh-ia" id="mh-ia" aria-label="Bogo Beverages">
      <div className="mh-ia-scene" id="mh-ia-scene">
        <div className="mh-ia-stage">
          <div className="mh-ia-bg" aria-hidden="true" />
          <div className="mh-ia-glow" id="mh-ia-glow" aria-hidden="true" />
          <div className="mh-ia-sparks" id="mh-ia-sparks" aria-hidden="true">
            {Array.from({ length: SPARKS }, (_, i) => (
              <i key={i} className="mh-ia-spark" />
            ))}
          </div>

          <svg className="mh-ia-svg" id="mh-ia-svg" aria-hidden="true">
            <defs>
              <linearGradient id="mh-ia-wine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6dc93" />
                <stop offset="0.45" stopColor="#e7b552" />
                <stop offset="1" stopColor="#c98d1f" />
              </linearGradient>
              <clipPath id="mh-ia-bowl-clip">
                <path id="mh-ia-bowl-in" />
              </clipPath>
            </defs>
            <g id="mh-ia-glass">
              <path className="mh-ia-glass-fill" id="mh-ia-bowl" />
              <g clipPath="url(#mh-ia-bowl-clip)">
                <path id="mh-ia-liquid" fill="url(#mh-ia-wine)" />
                <path className="mh-ia-surface" id="mh-ia-surface" />
                <g id="mh-ia-bubbles">
                  {Array.from({ length: BUBBLES }, (_, i) => (
                    <circle key={i} className="mh-ia-bubble" r="0" />
                  ))}
                </g>
              </g>
              <path className="mh-ia-glass-line" id="mh-ia-glass-line" />
              <path className="mh-ia-glass-hi" id="mh-ia-glass-hi" />
            </g>
            <path className="mh-ia-stream" id="mh-ia-stream" pathLength="1" />
            <path className="mh-ia-stream-hi" id="mh-ia-stream-hi" pathLength="1" />
            <g id="mh-ia-drops">
              {Array.from({ length: DROPS }, (_, i) => (
                <circle key={i} className="mh-ia-drop" r="0" />
              ))}
            </g>
          </svg>

          <div className="mh-ia-bottle" id="mh-ia-bottle" aria-hidden="true">
            <img src={cavatina} alt="" draggable="false" />
          </div>

          <div className="mh-ia-logo" id="mh-ia-logo" aria-hidden="true">
            <div className="mh-ia-logo-in" id="mh-ia-logo-in">
              <img src={goldLogo} alt="" draggable="false" />
              <i
                className="mh-ia-sheen"
                id="mh-ia-sheen"
                style={{ WebkitMaskImage: `url(${goldLogo})`, maskImage: `url(${goldLogo})` }}
              />
            </div>
          </div>

          <svg className="mh-ia-flood" id="mh-ia-flood-svg" aria-hidden="true">
            <defs>
              <linearGradient id="mh-ia-flood-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="900">
                <stop offset="0" stopColor="#f1cf7e" />
                <stop offset="0.55" stopColor="#dca443" />
                <stop offset="1" stopColor="#c4881a" />
              </linearGradient>
            </defs>
            <path id="mh-ia-flood-back" fill="#f6e2ae" />
            <path id="mh-ia-flood" fill="url(#mh-ia-flood-g)" />
          </svg>

          <p className="mh-ia-brand" id="mh-ia-brand">Bogo Beverages</p>
          <p className="mh-ia-cue" id="mh-ia-cue" aria-hidden="true">
            <span>Scroll to pour</span>
            <i className="mh-ia-cue-line" />
          </p>
        </div>

        <svg className="mh-ia-edge" id="mh-ia-edge" aria-hidden="true">
          <path id="mh-ia-edge-b" fill="#f6e2ae" />
          <path id="mh-ia-edge-a" fill="#c4881a" />
        </svg>
      </div>
    </section>
  );
}

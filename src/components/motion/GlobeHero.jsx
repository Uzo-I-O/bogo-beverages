import logoDark from "../../assets/logo-dark.png";

export default function GlobeHero() {
  return (
    <div className="mh-hwrap" id="mh-hwrap">
      <section className="mh-hero" id="top">
        <div className="mh-hf" id="mh-hf">
          <a className="mh-logo ent" id="mh-logo" href="#mh-hwrap" aria-label="Bogo Beverages home">
            <img className="mh-logo-img" src={logoDark} alt="Bogo Beverages Limited" />
          </a>

          <ul className="mh-vnav" id="mh-vnav">
            <li className="mh-vnav-item ent">
              <a className="mh-vnav-link" href="#about">About</a>
            </li>
            <li className="mh-vnav-item ent">
              <a className="mh-vnav-link" href="#brands">Brands</a>
            </li>
            <li className="mh-vnav-item ent">
              <a className="mh-vnav-link" href="#updates">Updates</a>
            </li>
            <li className="mh-vnav-item ent">
              <a className="mh-vnav-link" href="/contact/">Contact</a>
            </li>
          </ul>

          <div className="mh-copy" id="mh-copy">
            <p className="mh-overline ent" id="mh-overline">Premium beverages · Africa</p>
            <h1 className="mh-hl" id="mh-hl">
              <span className="mh-ln ent">Make room</span>
              <span className="mh-ln ent">for</span>
              <span className="mh-ln ent">taste.</span>
            </h1>
            <p className="mh-lede ent" id="mh-lede">
              A new generation of drinks for the moments that bring us together.
            </p>
            <div className="mh-btns ent" id="mh-btns">
              <a className="mh-btn mh-btn-fill" href="#about">Learn more</a>
              <a className="mh-btn mh-btn-line" href="#brands">Our brands</a>
            </div>
          </div>
        </div>

        <div className="mh-gwrap" id="mh-gwrap">
          <canvas className="mh-globe" id="mh-globe" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}

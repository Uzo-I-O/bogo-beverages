import iconStill from "../../assets/icon-still-wine.svg";
import iconSparkling from "../../assets/icon-sparkling.svg";
import iconSpirits from "../../assets/icon-spirits.svg";
import iconRefresh from "../../assets/icon-refreshment.svg";

export default function BrandsScene() {
  return (
    <section className="mh-track" id="brands">
      <div className="mh-scene" id="mh-scene">
        <div className="mh-spot" id="mh-spot" aria-hidden="true" />
        <div className="mh-band-bg" aria-hidden="true" />
        <div className="mh-giant" id="mh-giant" aria-hidden="true">Our brands</div>
        <canvas className="mh-bottle" id="mh-bottle" aria-hidden="true" />

        <div className="mh-readout" id="mh-readout" aria-hidden="true">
          <span className="mh-readout-count" id="mh-count">01 / 06</span>
          <span className="mh-readout-speed" id="mh-speed">00 ML/S</span>
        </div>

        <div className="mh-band">
          <div className="mh-strip" id="mh-strip">
            <div className="mh-lead">
              <h2 className="mh-lead-hl">
                <span className="mh-lead-ln">Every occasion.</span>
                <span className="mh-lead-ln">One portfolio.</span>
                <span className="mh-lead-ln mh-lead-ln-gold">Made for Africa.</span>
              </h2>
              <div className="mh-lead-copy">
                <p className="mh-lead-p">
                  An impressive portfolio of world-renowned names and emerging
                  icons, from the cellar to the celebration.
                </p>
                <p className="mh-lead-p">
                  We support consumer drinking occasions 24/7 across the year,
                  creating choice for every moment.
                </p>
              </div>
            </div>

            <a className="mh-card" href="https://bogobeverages.com/brands/still-wine/">
              <img className="mh-card-icon" src={iconStill} alt="" />
              <h3 className="mh-card-title mh-sweep">Still<br />wines</h3>
              <p className="mh-card-body mh-sweep">
                Sweet and dry wines from the Gran Castillo range, made for every
                table and every toast.
              </p>
            </a>

            <a className="mh-card" href="https://bogobeverages.com/brands/sparkling-wines/">
              <img className="mh-card-icon" src={iconSparkling} alt="" />
              <h3 className="mh-card-title mh-sweep">Sparkling<br />wines</h3>
              <p className="mh-card-body mh-sweep">
                Bottega sparkling wines for the launches, weddings and
                celebrations worth remembering.
              </p>
            </a>

            <a className="mh-card" href="https://bogobeverages.com/brands/spirits/">
              <img className="mh-card-icon" src={iconSpirits} alt="" />
              <h3 className="mh-card-title mh-sweep">Spirits &amp;<br />liqueurs</h3>
              <p className="mh-card-body mh-sweep">
                Whisky, brandy, gin, vodka and cream liqueur for every
                celebration.
              </p>
            </a>

            <a className="mh-card" href="/brands/">
              <img className="mh-card-icon" src={iconRefresh} alt="" />
              <h3 className="mh-card-title mh-sweep">Everyday<br />refreshment</h3>
              <p className="mh-card-body mh-sweep">
                Bitter, energy drink, aperitif, juice and water to support every
                day, all year round.
              </p>
            </a>
          </div>

          <a className="mh-pill" id="mh-pill" href="/brands/">Our brands</a>
        </div>
      </div>
    </section>
  );
}

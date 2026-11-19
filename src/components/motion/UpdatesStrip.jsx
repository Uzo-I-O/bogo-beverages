import updateLive from "../../assets/update-live.webp";
import updateBottega from "../../assets/update-bottega.webp";
import updateGranCastillo from "../../assets/update-gran-castillo.webp";

export default function UpdatesStrip() {
  return (
    <section className="mh-updates" id="updates">
      <div className="mh-up-head">
        <p className="mh-up-over ent">Journal</p>
        <h2 className="mh-up-hl" id="mh-up-hl">
          <span className="mh-ln ent">Latest</span>
          <span className="mh-ln ent">updates.</span>
        </h2>
      </div>

      <div className="mh-up-grid">
        <a
          className="mh-up-card ent"
          href="https://bogobeverages.com/we-have-just-launched-bogo-is-now-live/"
        >
          <span className="mh-up-ph">
            <img className="mh-up-img" src={updateLive} alt="" />
          </span>
          <span className="mh-up-date">01</span>
          <span className="mh-up-title">We have just launched. BOGO is now live!</span>
        </a>

        <a
          className="mh-up-card ent"
          href="https://bogobeverages.com/bogo-unveils-shooter-across-west-africa/"
        >
          <span className="mh-up-ph">
            <img className="mh-up-img" src={updateBottega} alt="" />
          </span>
          <span className="mh-up-date">02</span>
          <span className="mh-up-title">BOGO unveils Bottega in Nigeria</span>
        </a>

        <a
          className="mh-up-card ent"
          href="https://bogobeverages.com/we-have-just-launched-bogo-is-now-live-2/"
        >
          <span className="mh-up-ph">
            <img className="mh-up-img" src={updateGranCastillo} alt="" />
          </span>
          <span className="mh-up-date">03</span>
          <span className="mh-up-title">Introducing the Gran Castillo wine range</span>
        </a>
      </div>
    </section>
  );
}

import cellar from "../../assets/cellar.webp";

export default function StatsPinned() {
  return (
    <section className="mh-stats" id="about">
      <div className="mh-pin">
        <div className="mh-ph" id="mh-ph">
          <i className="mh-ph-img" style={{ backgroundImage: `url(${cellar})` }} />
        </div>
        <h2 className="mh-big" id="mh-big">
          <span className="mh-ln ent">Built on</span>
          <span className="mh-ln ent">experience.</span>
          <span className="mh-ln ent">Made for</span>
          <span className="mh-ln ent">what’s next.</span>
        </h2>
      </div>

      <div className="mh-col">
        <div className="mh-intro ent" id="mh-intro">
          <p className="mh-intro-p">
            Bogo Beverage Limited is a young and dynamic food and beverage
            company built around the manufacturing, distribution and marketing
            of quality products.
          </p>
          <p className="mh-intro-p">
            Our ambition is to be the best-performing, most trusted and most
            respected food and beverage company in Africa.
          </p>
          <div className="mh-intro-links">
            <a className="mh-intro-link" href="/company/">Our company</a>
            <a className="mh-intro-link" href="#brands">Our brands</a>
          </div>
        </div>

        <ul className="mh-nums" id="mh-nums">
          <li className="mh-num ent" data-to="4" data-dec="0" data-suf="">
            <span className="mh-n ent">4</span>
            <span className="mh-c">Countries</span>
          </li>
          <li className="mh-num ent" data-to="150" data-dec="0" data-suf="+">
            <span className="mh-n ent">150+</span>
            <span className="mh-c">Premium brands</span>
          </li>
          <li className="mh-num ent" data-to="120" data-dec="0" data-suf="+">
            <span className="mh-n ent">120+</span>
            <span className="mh-c">Years of experience</span>
          </li>
          <li className="mh-num ent">
            <span className="mh-n ent">24/7</span>
            <span className="mh-c">Drinking occasions, all year round</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

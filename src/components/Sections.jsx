import { brands, SOURCE_URL, updates } from "../data/content";

export function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="row">
          <div className="col-md-8 about-copy">
            <h2>INNOVATION | EXPERIENCE | AMBITION</h2>
            <p className="short-desc">
              Bogo is unlocking new possibilities in Africa.
            </p>
            <a href={`${SOURCE_URL}/about-us/`} className="btn btn-white">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { icon: "/images/globe.svg", label: "4 Countries" },
  { icon: "/images/award.svg", label: "150+ Premium Brands" },
  { icon: "/images/calendar.svg", label: "120+ Years Experience" },
];

export function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="row">
          {stats.map((stat) => (
            <div className="col-md-4 stats-col" key={stat.label}>
              <img src={stat.icon} alt="" />
              <h3>{stat.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Brands() {
  return (
    <section className="brands">
      <div className="container">
        <div className="row">
          <div className="col-md-3 brands-intro">
            <h3>Our Brands</h3>
            <p className="brand-desc">
              An impressive portfolio of world-renowned names and emerging
              icons.
            </p>
            <a className="brand-link" href="/brands/">
              Discover our brands
            </a>
          </div>

          {brands.map((brand) => (
            <div className="col-md-3 brand-col" key={brand.title}>
              <div className="brand-container">
                <div className="brand-img-container">
                  <img
                    src={brand.image}
                    alt={brand.imageAlt}
                    className="brand-img"
                  />
                </div>

                <div className="brand-info">
                  <div className="brand-info-row">
                    <p className="title">{brand.title}</p>
                    <a
                      href={brand.href}
                      className="arrow-container"
                      aria-label={`Explore ${brand.title}`}
                    >
                      <img src="/images/arrow-right.svg" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Updates() {
  return (
    <section className="updates">
      <div className="container">
        <div className="row updates-heading-row">
          <div className="col-12">
            <h4>Latest Updates</h4>
          </div>
        </div>

        <div className="row">
          {updates.map((update) => (
            <div className="col-md-4 update-col" key={update.title}>
              <div className="updates-container">
                <img
                  src={update.image}
                  alt=""
                  className="featured-img"
                />
                <div className="update-info">
                  <p className="title">{update.title}</p>
                </div>
                <a
                  href={update.href}
                  className="arrow-container"
                  aria-label={`Read update: ${update.title}`}
                >
                  <img src="/images/arrow-right.svg" alt="" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

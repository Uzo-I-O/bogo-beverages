import Navbar from "./Navbar";

const heroProducts = [
  {
    name: "Gran Castillo",
    category: "Still wine",
    image: "/images/granca.png",
  },
  {
    name: "Bottega",
    category: "Sparkling wine",
    image: "/images/bottega-portfolio.png",
  },
  {
    name: "Bogo Spirits",
    category: "Spirits",
    image: "/images/grace-portfolio.png",
  },
];

export default function Hero() {
  return (
    <header className="home">
      <Navbar />

      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-glow" />
      </div>

      <div className="container p-top-300">
        <div className="hero-row">
          <div className="hero-title-col">
            <div className="hero-copy">
              <p className="hero-kicker"><span>01</span> Premium beverages · Africa</p>
              <h1 className="header-title">
                Make room
                <br />
                for taste.
              </h1>
              <p className="hero-intro">
                A new generation of drinks for the moments that bring us
                together.
              </p>
              <a className="hero-cta" href="#about">
                Explore the portfolio <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>

          <div className="hero-image-col">
            <div className="img-slide">
              {heroProducts.map((product, index) => (
                <figure className={`hero-product hero-product-${index + 1}`} key={product.name}>
                  <img src={product.image} alt={`${product.name} ${product.category}`} />
                  <figcaption>
                    <span>{product.category}</span>
                    <strong>{product.name}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="hero-image-caption">Curated for every occasion</p>
          </div>
        </div>
      </div>

      <a href="#about" className="scrolldown" aria-label="Scroll to about Bogo">
        <img src="/images/arrow-down.svg" alt="" />
      </a>
    </header>
  );
}

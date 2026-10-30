import Navbar from "./Navbar";

export default function Hero() {
  return (
    <header className="home">
      <Navbar />

      <div className="container p-top-300">
        <div className="hero-row">
          <div className="hero-title-col">
            <h1 className="header-title">
              Welcome to a whole <br /> new world of taste.
            </h1>
          </div>

          <div className="hero-image-col">
            <div className="img-slide">
              <img src="/images/bogo-new.gif" alt="" />
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scrolldown" aria-label="Scroll to about Bogo">
        <img src="/images/arrow-down.svg" alt="" />
      </a>
    </header>
  );
}

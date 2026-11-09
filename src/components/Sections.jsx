import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands, SOURCE_URL, updates } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const revealDelay = (ms) => ({ "--reveal-delay": `${ms}ms` });

export function About() {
  return (
    <section id="about" className="about">
      <div className="about-energy" aria-hidden="true">
        <div className="about-energy-ring about-energy-ring-one" />
        <div className="about-energy-ring about-energy-ring-two" />
        <div className="about-energy-line about-energy-line-one" />
        <div className="about-energy-line about-energy-line-two" />
        <span className="about-energy-orb about-energy-orb-one" />
        <span className="about-energy-orb about-energy-orb-two" />
      </div>
      <div className="container">
        <div className="about-grid">
          <div className="about-marker">
            <span>02</span>
            <span>About Bogo</span>
          </div>
          <div className="about-copy">
            <p className="section-kicker" data-reveal>Designed for the way Africa drinks</p>
            <h2 data-reveal data-reveal-repeat>
              Good taste is a <em>way of life.</em>
            </h2>
            <p
              className="short-desc"
              data-reveal
              data-reveal-repeat
              style={revealDelay(120)}
            >
              We bring together trusted expertise, bold thinking and a portfolio
              of premium beverages built for memorable moments.
            </p>
            <a
              href="/company/"
              className="btn btn-white"
              data-reveal
              data-reveal-repeat
              style={revealDelay(240)}
            >
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
  const statementRef = useRef(null);

  useLayoutEffect(() => {
    const statement = statementRef.current;
    if (!statement) return undefined;

    const words = statement.querySelectorAll(".stats-statement-word");
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set(words, { clearProps: "all" });
        return;
      }

      gsap.from(words, {
        y: -70,
        opacity: 0,
        rotation: () => gsap.utils.random(-18, 18),
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.12,
        scrollTrigger: {
          trigger: statement,
          start: "top 82%",
          toggleActions: "restart reverse restart reverse",
        },
      });
    }, statement);

    return () => context.revert();
  }, []);

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-heading">
          <p className="section-kicker">The Bogo standard</p>
          <p ref={statementRef} className="stats-statement">
            <span className="stats-statement-line">
              <span className="stats-statement-word">Built</span>{" "}
              <span className="stats-statement-word">on</span>{" "}
              <span className="stats-statement-word">experience.</span>
            </span>
            <br />
            <span className="stats-statement-line">
              <span className="stats-statement-word">Made</span>{" "}
              <span className="stats-statement-word">for</span>{" "}
              <span className="stats-statement-word">what’s</span>{" "}
              <span className="stats-statement-word">next.</span>
            </span>
          </p>
        </div>
        <div className="row">
          {stats.map((stat, index) => (
            <div
              className="col-md-4 stats-col"
              key={stat.label}
              data-reveal
              style={revealDelay(index * 120)}
            >
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
  const portfolioRef = useRef(null);

  useLayoutEffect(() => {
    const section = portfolioRef.current;
    if (!section) return undefined;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const topLines = section.querySelectorAll(".portfolio-lines-top span");
      const bottomLines = section.querySelectorAll(".portfolio-lines-bottom span");
      const allLines = [...topLines, ...bottomLines];

      if (reduceMotion) {
        gsap.set(allLines, { x: 0, y: 0, opacity: 1 });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "bottom 12%",
          scrub: 0.8,
        },
      });

      timeline
        .fromTo(
          topLines,
          { x: 115, y: -105 },
          { x: 0, y: 0, duration: 0.3 },
          0
        )
        .fromTo(
          bottomLines,
          { x: -115, y: 105 },
          { x: 0, y: 0, duration: 0.3 },
          0
        )
        .to(topLines, { x: 115, y: -105, duration: 0.3 }, 0.7)
        .to(bottomLines, { x: -115, y: 105, duration: 0.3 }, 0.7);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="brands" ref={portfolioRef}>
      <div className="portfolio-lines portfolio-lines-top" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={`top-${index}`} />
        ))}
      </div>
      <div className="portfolio-lines portfolio-lines-bottom" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={`bottom-${index}`} />
        ))}
      </div>
      <div className="container">
        <div className="brands-topline">
          <span>03</span>
          <span>Our portfolio</span>
        </div>
        <div className="row">
          <div className="col-md-3 brands-intro" data-reveal>
            <h3>Find your<br /><em>favourite.</em></h3>
            <p className="brand-desc">
              An impressive portfolio of world-renowned names and emerging
              icons.
            </p>
            <a className="brand-link" href="/brands/">
              Explore all brands
            </a>
          </div>

          {brands.map((brand, index) => (
            <div
              className={`col-md-3 brand-col brand-col-${index}`}
              key={brand.title}
              data-reveal
              style={revealDelay(100 + index * 120)}
            >
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
        <div className="updates-topline">
          <span>04</span>
          <span>Journal</span>
        </div>
        <div className="row updates-heading-row">
          <div className="col-12" data-reveal>
            <h4>Latest Updates</h4>
          </div>
        </div>

        <div className="row">
          {updates.map((update, index) => (
            <div
              className="col-md-4 update-col"
              key={update.title}
              data-reveal
              style={revealDelay(index * 120)}
            >
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

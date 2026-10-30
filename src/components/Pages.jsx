import Navbar from "./Navbar";
import Footer from "./Footer";
import { brandCategories, companyContent } from "../data/content";

export function CompanyPage() {
  return (
    <>
      <header className="inner-header">
        <Navbar />
        <div className="container inner-header-content">
          <p className="page-eyebrow">{companyContent.eyebrow}</p>
          <h1>{companyContent.title}</h1>
        </div>
      </header>

      <main className="company-page">
        <section className="company-intro">
          <div className="container company-intro-grid">
            <div>
              <p className="section-eyebrow">Who we are</p>
              <h2>Built for the way Africa drinks.</h2>
            </div>
            <div className="company-copy">
              <p>{companyContent.intro}</p>
              {companyContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="company-values">
          <div className="container">
            <p className="section-eyebrow">What drives us</p>
            <h2>Innovation | Experience | Ambition</h2>
            <div className="values-grid">
              {companyContent.values.map((value, index) => (
                <article className="value-card" key={value.title}>
                  <span>0{index + 1}</span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function BrandsPage() {
  return (
    <>
      <header className="inner-header brands-header">
        <Navbar />
        <div className="container inner-header-content">
          <p className="page-eyebrow">Our portfolio</p>
          <h1>Brands for every occasion.</h1>
        </div>
      </header>

      <main className="brands-page">
        <section className="brands-page-intro">
          <div className="container">
            <p className="section-eyebrow">Our brands</p>
            <h2>A world of taste, made for Africa.</h2>
            <p>
              From a relaxed toast to a celebration that lasts all night, our
              portfolio brings quality food and beverages to consumers across
              the continent.
            </p>
          </div>
        </section>

        <section className="brand-category-grid container">
          {brandCategories.map((category) => (
            <article className="brand-category" key={category.title}>
              <div className="brand-category-image">
                <img src={category.image} alt={category.imageAlt} />
              </div>
              <div className="brand-category-content">
                <p className="section-eyebrow">Bogo portfolio</p>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

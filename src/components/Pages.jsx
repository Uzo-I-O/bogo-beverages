import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  brandCategories,
  companyContent,
  contactDetails,
  team,
  updates,
} from "../data/content";

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

function PageHero({ eyebrow, title, className = "" }) {
  return (
    <header className={`inner-header ${className}`}>
      <Navbar />
      <div className="container inner-header-content">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
    </header>
  );
}

export function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The people behind Bogo"
        title="One team. One ambition."
        className="team-header"
      />
      <main className="team-page">
        <section className="team-intro">
          <div className="container team-intro-grid">
            <div>
              <p className="section-eyebrow">Our team</p>
              <h2>People with the drive to make a difference.</h2>
            </div>
            <p>
              Bogo is powered by a dynamic team of thinkers, builders and
              doers. Together, we bring entrepreneurial energy, local insight
              and commercial excellence to every part of our business.
            </p>
          </div>
        </section>
        <section className="team-grid-section">
          <div className="container team-grid">
            {team.map((member, index) => (
              <article className="team-card" key={member.title}>
                <div className="team-card-number">0{index + 1}</div>
                <h3>{member.title}</h3>
                <p>{member.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function UpdatesPage() {
  return (
    <>
      <PageHero
        eyebrow="News & stories"
        title="What’s happening at Bogo."
        className="updates-header"
      />
      <main className="updates-page">
        <section className="updates-page-intro">
          <div className="container">
            <p className="section-eyebrow">Latest updates</p>
            <h2>Ideas, launches and stories from our world.</h2>
          </div>
        </section>
        <section className="updates-page-grid container">
          {updates.map((update) => (
            <article className="updates-page-card" key={update.title}>
              <img src={update.image} alt="" />
              <div className="updates-page-card-content">
                <p className="section-eyebrow">Bogo news</p>
                <h3>{update.title}</h3>
                <a href={update.href}>Read story <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="We’d love to hear from you"
        title="Let’s start a conversation."
        className="contact-header"
      />
      <main className="contact-page">
        <section className="contact-section">
          <div className="container contact-grid">
            <div className="contact-details">
              <p className="section-eyebrow">Get in touch</p>
              <h2>Tell us what’s on your mind.</h2>
              <p>
                Whether you are looking to partner with us, ask about our
                brands or simply say hello, our team would be happy to hear
                from you.
              </p>
              <dl>
                <div>
                  <dt>Visit us</dt>
                  <dd>{contactDetails.address}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></dd>
                </div>
                <div>
                  <dt>Call us</dt>
                  <dd><a href={`tel:${contactDetails.phone.replace(/\D/g, "")}`}>{contactDetails.phone}</a></dd>
                </div>
              </dl>
            </div>
            <form
              className="contact-form"
              action={`mailto:${contactDetails.email}`}
              method="post"
              encType="text/plain"
            >
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" required />
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" required />
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="6" required />
              <button className="btn" type="submit">Send message</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

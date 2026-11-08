const socialLinks = [
  ["Instagram", "https://www.instagram.com/bogobeverages/"],
  ["LinkedIn", "https://www.linkedin.com/company/bogobeverages/"],
  ["YouTube", "https://www.youtube.com/@BogoBeverages"],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-head">
          <p className="section-kicker">Let’s make something memorable.</p>
          <a className="footer-email" href="mailto:info@bogobeverages.com">
            info@bogobeverages.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <h5>Visit us</h5>
            <p>BOGO Beverages Limited<br />21, Sanusi Fafunwa Street<br />Victoria Island, Lagos</p>
          </div>
          <div>
            <h5>Explore</h5>
            <a href="/company/">Company</a>
            <a href="/brands/">Brands</a>
            <a href="/updates/">Updates</a>
            <a href="/contact/">Contact</a>
          </div>
          <div>
            <h5>Follow along</h5>
            {socialLinks.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bogo Beverages</span>
          <span>Premium beverages, thoughtfully chosen.</span>
        </div>
      </div>
    </footer>
  );
}

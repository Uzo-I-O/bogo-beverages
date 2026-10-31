import { useEffect, useState } from "react";
import { SOURCE_URL } from "../data/content";

const aboutLinks = [
  { label: "Company", href: "/company/" },
  { label: "Team", href: "/team/" },
  { label: "Updates", href: "/updates/" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAboutOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  return (
    <nav className="navbar" id="main-nav">
      <div className="nav-fluid">
        <a className="logo-text" href="/" aria-label="Bogo Beverages home">
          <img className="logo-img" src="/images/logo.png" alt="" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarCollapse"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`navbar-collapse${menuOpen ? " show" : ""}`}
          id="navbarCollapse"
        >
          <ul className="navbar-nav" id="menu-main-menu">
            <li
              className={`nav-item dropdown${aboutOpen ? " open" : ""}`}
            >
              <button
                className="nav-link dropdown-toggle"
                type="button"
                aria-expanded={aboutOpen}
                onClick={() => setAboutOpen((open) => !open)}
              >
                About Us
              </button>

              <div className="dropdown-menu">
                {aboutLinks.map((link) => (
                  <a
                    className="dropdown-item"
                    href={link.href}
                    key={link.label}
                    onClick={closeMenus}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="/brands/"
                onClick={closeMenus}
              >
                Brands
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="/contact/"
                onClick={closeMenus}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

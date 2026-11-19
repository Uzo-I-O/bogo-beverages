import { useEffect } from "react";
import Footer from "./components/Footer";
import IntroPour from "./components/motion/IntroPour";
import GlobeHero from "./components/motion/GlobeHero";
import StatsPinned from "./components/motion/StatsPinned";
import BrandsScene from "./components/motion/BrandsScene";
import UpdatesStrip from "./components/motion/UpdatesStrip";
import { startMotion } from "./motion/engine";
import {
  BrandsPage,
  CompanyPage,
  ContactPage,
  TeamPage,
  UpdatesPage,
} from "./components/Pages";

function LandingPage() {
  useEffect(() => startMotion(), []);

  return (
    <>
      <main className="mh">
        <IntroPour />
        <GlobeHero />
        <div className="mh-hz" id="mh-hz" aria-hidden="true" />
        <StatsPinned />
        <BrandsScene />
        <UpdatesStrip />
      </main>
      <div className="mh-foot">
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/company" || path === "/about-us") {
    return <CompanyPage />;
  }

  if (path === "/brands") {
    return <BrandsPage />;
  }

  if (path === "/team" || path === "/teams") {
    return <TeamPage />;
  }

  if (path === "/updates") {
    return <UpdatesPage />;
  }

  if (path === "/contact") {
    return <ContactPage />;
  }

  return <LandingPage />;
}

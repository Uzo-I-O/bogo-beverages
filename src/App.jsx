import Hero from "./components/Hero";
import Footer from "./components/Footer";
import {
  BrandsPage,
  CompanyPage,
  ContactPage,
  TeamPage,
  UpdatesPage,
} from "./components/Pages";
import { About, Brands, Stats, Updates } from "./components/Sections";

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

  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Brands />
      <Updates />
      <Footer />
    </>
  );
}

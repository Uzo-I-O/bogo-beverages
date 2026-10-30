import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { BrandsPage, CompanyPage } from "./components/Pages";
import { About, Brands, Stats, Updates } from "./components/Sections";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/company" || path === "/about-us") {
    return <CompanyPage />;
  }

  if (path === "/brands") {
    return <BrandsPage />;
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

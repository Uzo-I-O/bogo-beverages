import { useEffect } from "react";

/**
 * Reveals elements marked with `data-reveal` as they scroll into view.
 * Elements can stagger themselves with a `--reveal-delay` custom property.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const elements = [...document.querySelectorAll("[data-reveal]")];
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const repeats = entry.target.hasAttribute("data-reveal-repeat");

          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (!repeats) observer.unobserve(entry.target);
            return;
          }

          if (repeats) entry.target.classList.remove("is-visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

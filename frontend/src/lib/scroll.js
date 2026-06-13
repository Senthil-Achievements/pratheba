// Smooth-scroll helper shared by the Navbar and in-page anchors (Issue #1).
// Uses the globally-exposed Lenis instance when available, with a native fallback.

export function scrollToSection(targetId) {
  const target = document.querySelector("#" + targetId);
  if (!target) return;

  const lenis = window.lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, {
      offset: -80,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

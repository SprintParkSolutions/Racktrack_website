// The step cards used to tilt toward the cursor (a [data-tilt] handler that
// wrote an inline rotateX/rotateY transform on every pointermove). It was
// removed in favour of the plain CSS lift on .why-step-card:hover — an
// inline transform beats the [data-reveal] rule's own transform, so hovering
// a card while it was still animating in snapped it straight to its resting
// position mid-reveal, and the per-pixel rotation read as wobble rather than
// polish. The CSS hover needs no JS and can't collide with the reveal.

// Evidence compare slider: one photo, drag to reveal "unverified" (desaturated
// overlay) vs "verified" (the base photo showing through). A native range
// input drives it — free keyboard/touch/screen-reader support, no hand-rolled
// pointer-drag math to get wrong.
const compare = document.querySelector("[data-compare]");

if (compare) {
  const range = compare.querySelector(".why-compare-range");
  const frame = compare.querySelector(".why-compare-frame");

  const setReveal = () => frame.style.setProperty("--reveal", `${range.value}%`);

  setReveal();
  range.addEventListener("input", setReveal);
}

// Scroll reveal: sections animate in as they're scrolled to, instead of
// sitting fully rendered on load. The hero is deliberately excluded — it
// must be visible the instant the page loads, only later sections reveal.
// ponytail: single shared observer + CSS transition, no animation library.
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length && wantsMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealDelay || 0) * 90;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));

  // Safety net: force-reveal anything the observer hasn't caught a few
  // seconds after load, so nothing can stay permanently blank.
  window.setTimeout(() => {
    revealTargets.forEach((el) => {
      if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
    });
  }, 2500);
} else {
  // No IntersectionObserver, or the visitor asked for reduced motion:
  // show everything immediately rather than leaving it hidden forever.
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

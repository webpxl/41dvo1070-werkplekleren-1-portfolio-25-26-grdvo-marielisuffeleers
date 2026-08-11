/**
 * reveal.js — the entrance and the scroll reveals.
 *
 * Content is visible in CSS by default; this opts elements into being hidden
 * and then reveals them, so a JS failure leaves a readable page, not a blank
 * one. Under prefers-reduced-motion it does nothing.
 *
 * One orchestrated entrance (the hero lines), then rows fade and rise once.
 * Nothing repeats on scroll back up.
 */

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  if (reduced()) return;

  // 1. The page-load stagger: hero lines, 60ms apart.
  const staggered = Array.from(document.querySelectorAll('[data-stagger]'));
  staggered.forEach((element) => element.classList.add('stagger'));

  requestAnimationFrame(() => {
    staggered.forEach((element) => {
      const order = Number(element.dataset.stagger) || 0;
      element.style.setProperty('--stagger-delay', order * 60 + 'ms');
      element.classList.add('is-in');
    });
  });

  // 2. Scroll reveals, once each.
  const targets = Array.from(document.querySelectorAll('.reveal, .index-row'));
  if (!targets.length || !('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-in'));
    return;
  }

  targets.forEach((element) => element.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((element) => observer.observe(element));
}

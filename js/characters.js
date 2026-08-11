/**
 * characters.js — character motion.
 *
 * Breathing runs only on the character in the viewport. Hover on a cast card
 * fires one squash-and-stretch, no loop. Under prefers-reduced-motion this
 * returns immediately: characters stay put, they just stop moving.
 *
 * Each svg.char gets an inner <g> because the positioning classes already own
 * `transform` on the outer element, and animating it in two places means one
 * silently wins.
 */

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCharacters() {
  if (reduced()) return;

  const characters = Array.from(document.querySelectorAll('svg.char'));
  if (!characters.length) return;

  // Wrap each <use> so breathing animates the inner group, not the positioned
  // outer element.
  characters.forEach((svg) => {
    const use = svg.querySelector('use');
    if (!use) return;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'char-inner');
    svg.replaceChild(group, use);
    group.appendChild(use);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const group = entry.target.querySelector('.char-inner');
          if (group) group.classList.toggle('is-breathing', entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    characters.forEach((svg) => observer.observe(svg));
  } else {
    document
      .querySelectorAll('.char-inner')
      .forEach((g) => g.classList.add('is-breathing'));
  }

  // One squash per hover, and only once it has finished.
  document.querySelectorAll('[data-cast]').forEach((card) => {
    const group = card.querySelector('.char-inner');
    if (!group) return;
    card.addEventListener('pointerenter', () => {
      if (group.classList.contains('is-squashing')) return;
      group.classList.remove('is-breathing');
      group.classList.add('is-squashing');
      group.addEventListener(
        'animationend',
        () => {
          group.classList.remove('is-squashing');
          group.classList.add('is-breathing');
        },
        { once: true }
      );
    });
  });
}

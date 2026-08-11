/**
 * main.js — entry point. Every module is opt-in on the presence of its markup,
 * so all four pages load this and nothing runs where it has nothing to do.
 */

import { initCompare } from './compare.js';
import { initFilters } from './filters.js';
import { initAccordion } from './accordion.js';
import { initForm } from './form.js';
import { initReveal } from './reveal.js';
import { initCharacters } from './characters.js';

/* Sticky header past 80px. */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-stuck', scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Full-screen mobile menu. */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('navmenu');
  const close = document.getElementById('navmenu-close');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = menu.querySelector('.navmenu-link');
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(menu.dataset.open !== 'true'));
  if (close) close.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('.navmenu-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.dataset.open === 'true') setOpen(false);
  });
}

/* Thumbnail pinned to the cursor. Pointer devices only. */
function initThumbs() {
  const holder = document.getElementById('index-thumb');
  const image = document.getElementById('index-thumb-img');
  const index = document.querySelector('[data-thumbs]');
  if (!holder || !image || !index) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  let raf = null;
  let x = 0;
  let y = 0;

  const draw = () => {
    holder.style.transform = `translate(${x + 20}px, ${y - 82}px)`;
    raf = null;
  };

  index.querySelectorAll('[data-thumb]').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      image.src = row.dataset.thumb;
      holder.classList.add('is-visible');
    });
    row.addEventListener('pointerleave', () => {
      holder.classList.remove('is-visible');
    });
  });

  index.addEventListener('pointermove', (event) => {
    x = event.clientX;
    y = event.clientY;
    if (!raf) raf = requestAnimationFrame(draw);
  });
}

function boot() {
  initHeader();
  initNav();
  initThumbs();

  const compare = document.getElementById('compare');
  if (compare) initCompare(compare);

  const filters = document.querySelector('.filters');
  if (filters) initFilters(filters);

  const idx = document.querySelector('.index');
  if (idx && document.querySelector('.index-detail')) initAccordion(idx);

  const form = document.querySelector('.form');
  if (form) initForm(form);

  initReveal();
  initCharacters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

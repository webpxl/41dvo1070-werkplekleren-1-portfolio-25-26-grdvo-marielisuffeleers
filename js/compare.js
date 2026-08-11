/**
 * compare.js — the sketch → final drag-to-reveal.
 *
 * The signature element. Dragging DE DAGDROOM wipes between the pencil sketch
 * and the finished piece, answering "did a model make this?" in two seconds.
 *
 * The handle is a real <button role="slider">, so pointer, touch and keyboard
 * all drive one source of truth: the --split custom property.
 */

const clamp = (n) => Math.min(100, Math.max(0, n));

export function initCompare(root) {
  const handle = root.querySelector('.compare-handle');
  if (!handle) return;

  let split = 50;

  const set = (pct) => {
    split = clamp(pct);
    root.style.setProperty('--split', split + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(split)));
  };

  const fromPointer = (event) => {
    const box = root.getBoundingClientRect();
    if (!box.width) return split;
    return ((event.clientX - box.left) / box.width) * 100;
  };

  let dragging = false;

  root.addEventListener('pointerdown', (event) => {
    // Ignore secondary buttons so a right-click doesn't yank the handle.
    if (event.button !== 0) return;
    dragging = true;
    root.setPointerCapture(event.pointerId);
    set(fromPointer(event));
    event.preventDefault();
  });

  root.addEventListener('pointermove', (event) => {
    if (dragging) set(fromPointer(event));
  });

  const stop = (event) => {
    if (!dragging) return;
    dragging = false;
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
  };

  root.addEventListener('pointerup', stop);
  root.addEventListener('pointercancel', stop);

  handle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 10 : 2;
    let next = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = split - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = split + step;
    else if (event.key === 'PageDown') next = split - 10;
    else if (event.key === 'PageUp') next = split + 10;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;
    set(next);
    event.preventDefault();
  });

  set(split);
}

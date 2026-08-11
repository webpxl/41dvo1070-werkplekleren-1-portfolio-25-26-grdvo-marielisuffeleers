/**
 * accordion.js — inline project detail.
 *
 * Rows expand in place rather than opening a fourth page type, keeping the site
 * inside its three-page scope. Height animates with grid-template-rows 0fr →
 * 1fr, so no pixel height is ever measured.
 *
 * (§7's file list doesn't name this module — filtering and expanding are
 * separate jobs, so it isn't folded into filters.js.)
 */

export function initAccordion(root) {
  const rows = Array.from(root.querySelectorAll('.index-row[data-tags]'));
  if (!rows.length) return;

  const panels = rows
    .map((row) => ({
      row,
      head: row.querySelector('.index-head'),
      detail: row.querySelector('.index-detail'),
    }))
    .filter((panel) => panel.head && panel.detail);

  const setOpen = (panel, open) => {
    panel.head.setAttribute('aria-expanded', String(open));
    panel.detail.dataset.open = String(open);
    const toggle = panel.head.querySelector('.index-toggle');
    if (toggle) toggle.textContent = open ? 'Sluit −' : 'Bekijk →';
  };

  panels.forEach((panel) => {
    setOpen(panel, false);

    panel.head.addEventListener('click', () => {
      const open = panel.head.getAttribute('aria-expanded') === 'true';
      // One panel at a time — several open at once turns the index into a wall.
      panels.forEach((other) => other !== panel && setOpen(other, false));
      setOpen(panel, !open);

      if (!open) {
        history.replaceState(null, '', '#' + panel.row.id);
      }
    });
  });

  // Deep link straight into an open project.
  const target = location.hash.replace('#', '');
  const match = panels.find((panel) => panel.row.id === target);
  if (match) {
    setOpen(match, true);
    match.row.scrollIntoView({ block: 'start' });
  }
}

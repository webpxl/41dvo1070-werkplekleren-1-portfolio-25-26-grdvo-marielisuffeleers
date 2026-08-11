/**
 * filters.js — discipline filtering for the project index.
 *
 * Rows are real markup carrying data-tags; this only toggles [hidden], so every
 * project stays in the source for search engines and still lists with JS off.
 * State goes to the hash so a view is linkable. A filter with fewer than two
 * projects is removed — it makes the set look thinner than it is.
 */

const ALL = 'alles';

export function initFilters(root) {
  const buttons = Array.from(root.querySelectorAll('.filter'));
  const rows = Array.from(document.querySelectorAll('.index-row[data-tags]'));
  const empty = document.querySelector('.empty');
  if (!buttons.length || !rows.length) return;

  const tagsOf = (row) => (row.dataset.tags || '').split(/\s+/).filter(Boolean);

  const live = buttons;

  const apply = (tag, pushHash) => {
    const known = live.some((button) => button.dataset.filter === tag);
    const active = known ? tag : ALL;
    let shown = 0;

    rows.forEach((row) => {
      const match = active === ALL || tagsOf(row).includes(active);
      row.hidden = !match;
      if (match) shown += 1;
      // Collapse anything filtered away, so it doesn't reappear half-open.
      if (!match) {
        const head = row.querySelector('.index-head');
        const detail = row.querySelector('.index-detail');
        if (head && detail) {
          head.setAttribute('aria-expanded', 'false');
          detail.dataset.open = 'false';
        }
      }
    });

    live.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === active));
    });

    if (empty) empty.dataset.visible = String(shown === 0);

    if (pushHash) {
      const hash = active === ALL ? ' ' : '#' + active;
      history.replaceState(null, '', active === ALL ? location.pathname : hash);
    }
  };

  live.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset.filter, true));
  });

  window.addEventListener('hashchange', () => {
    apply(location.hash.replace('#', '') || ALL, false);
  });

  // A deep link can point at either a filter or a single project.
  const initial = location.hash.replace('#', '');
  const isProject = rows.some((row) => row.id === initial);
  apply(isProject ? ALL : initial || ALL, false);
}

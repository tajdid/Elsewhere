import { places } from '../lib/places';
import { filterPlaces, parseSaved, evidenceLabel, evidenceTone, type Filters } from '../lib/discovery';

const key = 'elsewhere:saved:v1';
const ids = places.map(p => p.id);
const status = document.querySelector<HTMLElement>('#app-status');
const announce = (s: string) => { if (status) status.textContent = s; };

let saved: string[] = [];
let storageOK = true;
try {
  saved = parseSaved(localStorage.getItem(key), ids);
  const probe = `${key}:probe`; localStorage.setItem(probe, '1'); localStorage.removeItem(probe);
} catch { storageOK = false; }

const listing = document.querySelector<HTMLElement>('[data-listing]');
const savedOnly = listing?.dataset.savedOnly === 'true';
const form = document.querySelector<HTMLFormElement>('#filters');
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-place]'));
const compareRows = Array.from(document.querySelectorAll<HTMLElement>('[data-compare]'));
const compare = document.querySelector<HTMLElement>('#compare');
const toggle = document.querySelector<HTMLButtonElement>('#filter-toggle');
const filterCount = document.querySelector<HTMLElement>('#filter-count');
const extra = document.querySelector<HTMLElement>('#extra-filters');

// Evidence freshness is re-evaluated at visit time, so a long-lived static build never keeps a stale "Verified".
document.querySelectorAll<HTMLElement>('[data-evidence][data-place-id]').forEach(el => {
  const p = places.find(p => p.id === el.dataset.placeId);
  const e = p?.amenities[el.dataset.evidence as keyof typeof p.amenities];
  const label = el.querySelector<HTMLElement>('[data-evidence-label]') ?? el;
  if (e) { label.textContent = evidenceLabel(e); el.dataset.tone = evidenceTone(e); }
});

function syncButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach(b => {
    const active = saved.includes(b.dataset.save!);
    b.hidden = false;
    b.setAttribute('aria-pressed', String(active));
    const text = b.querySelector<HTMLElement>('.save-text');
    if (text) text.textContent = active ? 'Saved' : 'Save';
    b.setAttribute('aria-label', `${active ? 'Remove' : 'Save'} ${b.dataset.name}${active ? ' from saved places' : ''}`);
  });
}

function storageNotice() {
  const n = document.querySelector<HTMLElement>('#storage-note');
  if (n && !storageOK) { n.hidden = false; n.textContent = 'Browser storage is unavailable. Saves will last only on this page.'; }
}

function readFilters(): Required<Filters> {
  const d = form ? new FormData(form) : null;
  return {
    q: String(d?.get('q') || ''), category: String(d?.get('category') || ''), neighbourhood: String(d?.get('neighbourhood') || ''),
    mode: String(d?.get('mode') || ''), wifi: d?.has('wifi') || false, power: d?.has('power') || false,
  };
}

function render(updateUrl = false) {
  if (!listing) return;
  const filters = readFilters();
  const matches = savedOnly ? places.filter(p => saved.includes(p.id)) : filterPlaces(places, filters);
  const visible = new Set(matches.map(p => p.id));
  cards.forEach(c => { c.hidden = !visible.has(c.dataset.place!); });
  compareRows.forEach(r => { r.hidden = !visible.has(r.dataset.compare!); });
  if (compare) compare.hidden = matches.length === 0;
  const count = document.querySelector('#result-count');
  if (count) count.textContent = `${matches.length} ${savedOnly ? 'saved' : 'matching fictional'} ${matches.length === 1 ? 'place' : 'places'}`;
  const empty = document.querySelector<HTMLElement>('#empty');
  if (empty) empty.hidden = matches.length > 0;
  // The collapsed disclosure on smaller screens still says how many of its filters are on.
  const hiddenActive = [filters.category, filters.neighbourhood, filters.wifi, filters.power].filter(Boolean).length;
  if (filterCount) filterCount.textContent = hiddenActive ? ` · ${hiddenActive} active` : '';
  if (updateUrl) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    const next = `${location.pathname}${params.size ? '?' + params : ''}`;
    if (next !== `${location.pathname}${location.search}`) history.pushState(null, '', next);
  }
}

let restoringURL = false;
function readURL() {
  if (!form) return;
  restoringURL = true;
  form.reset();
  const params = new URLSearchParams(location.search);
  for (const [k, v] of params) {
    const fields = Array.from(form.elements).filter((el): el is HTMLInputElement | HTMLSelectElement =>
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) && el.name === k);
    const radios = fields.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el.type === 'radio');
    // Unknown radio values keep the default ("Any") rather than leaving the group with nothing selected.
    if (radios.length) { const match = radios.find(r => r.value === v); if (match) match.checked = true; continue; }
    fields.forEach(el => {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') el.checked = v === 'true';
      else if (el instanceof HTMLSelectElement) { el.value = v; if (el.value !== v) el.value = ''; }
      else el.value = v.slice(0, 120);
    });
  }
  restoringURL = false;
  render();
}

syncButtons();
storageNotice();
listing?.removeAttribute('data-pending');
if (form) readURL(); else render();

document.addEventListener('animationend', e => { (e.target as Element).closest?.('.save')?.classList.remove('is-pulsing'); });

document.addEventListener('click', e => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-save]');
  if (!b) return;
  const id = b.dataset.save!;
  const removing = saved.includes(id);
  saved = removing ? saved.filter(x => x !== id) : [...saved, id];
  try { if (storageOK) localStorage.setItem(key, JSON.stringify({ version: 1, ids: saved })); } catch { storageOK = false; }
  syncButtons(); render(); storageNotice();
  // A one-off pulse on the heart confirms a new save (CSS drops it under reduced motion).
  if (!removing) { b.classList.remove('is-pulsing'); void b.offsetWidth; b.classList.add('is-pulsing'); }
  announce(`${removing ? 'Removed' : 'Saved'} ${b.dataset.name}.${storageOK ? '' : ' Browser storage unavailable; this page only.'}`);
  if (savedOnly && removing) {
    const next = document.querySelector<HTMLButtonElement>('[data-place]:not([hidden]) [data-save]');
    (next || document.querySelector<HTMLAnchorElement>('#empty a'))?.focus();
  }
});

window.addEventListener('storage', e => {
  if (e.key === key || e.key === null) { saved = parseSaved(e.newValue, ids); syncButtons(); render(); }
});
form?.addEventListener('submit', e => { e.preventDefault(); render(true); });
form?.addEventListener('change', e => { if ((e.target as HTMLElement).id !== 'q') render(true); });
form?.addEventListener('reset', () => { if (!restoringURL) setTimeout(() => render(true), 0); });
window.addEventListener('popstate', readURL);
document.querySelector('#empty-clear')?.addEventListener('click', () => form?.reset());

if (toggle && extra) {
  extra.dataset.enhanced = 'true';
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    extra.classList.toggle('is-open', open);
  });
}

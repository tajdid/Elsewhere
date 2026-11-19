// Place search for Submit a place: an accessible combobox on the "Place name" field, backed by /api/places
// (Google Places). Picking a suggestion fills the name, keeps Google's place ID, address and coordinates in hidden
// fields, suggests the neighbourhood, and eases a small Google map to the place. Without the endpoint, or if it
// fails, the field stays a plain text box. The map only loads once a place is picked.
import { matchArea } from '../lib/areas';

declare const google: any; // loaded on demand from maps.googleapis.com

const form = document.querySelector<HTMLFormElement>('#submit-form');
const input = document.querySelector<HTMLInputElement>('#name');
const list = document.querySelector<HTMLUListElement>('#name-options');
const endpoint = form?.dataset.placesEndpoint ?? '';

interface Suggestion { placeId: string; name: string; detail: string }
interface Details { placeId: string; address: string; lat: number; lng: number; area: string | null }

if (form && input && list && endpoint) {
  const status = document.querySelector<HTMLElement>('#app-status');
  const announce = (s: string) => { if (status) status.textContent = s; };
  const hidden = (id: string) => form.querySelector<HTMLInputElement>(`#${id}`)!;
  const picked = document.querySelector<HTMLElement>('#place-picked')!;
  const mapEl = document.querySelector<HTMLElement>('#place-map')!;
  const addressText = document.querySelector<HTMLElement>('#place-address-text')!;
  const neighbourhood = form.querySelector<HTMLInputElement>('#neighbourhood')!;
  const areas: string[] = JSON.parse(form.dataset.areas || '[]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Turn the plain field into a combobox only now that search is available.
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', list.id);
  document.querySelector<HTMLElement>('#name-help')!.hidden = false;

  let session = crypto.randomUUID();
  let items: Suggestion[] = [];
  let active = -1;
  let seq = 0;
  let timer: number | undefined;
  let pickedName = '';
  let disabled = false;
  let neighbourhoodFilled = false;

  const call = async <T,>(payload: object): Promise<T | null> => {
    if (disabled) return null;
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, session }) });
      if (res.status === 503 || res.status === 404) { disabled = true; return null; } // not configured: plain field from now on
      return res.ok ? await res.json() as T : null;
    } catch { return null; }
  };

  function close() {
    list!.hidden = true; input!.setAttribute('aria-expanded', 'false'); input!.removeAttribute('aria-activedescendant'); active = -1;
  }
  function setActive(i: number) {
    active = i;
    [...list!.children].forEach((li, n) => li.setAttribute('aria-selected', String(n === i)));
    if (i >= 0) { input!.setAttribute('aria-activedescendant', `name-option-${i}`); list!.children[i]?.scrollIntoView({ block: 'nearest' }); }
    else input!.removeAttribute('aria-activedescendant');
  }
  function render() {
    list!.replaceChildren(...items.map((s, i) => {
      const li = document.createElement('li');
      li.id = `name-option-${i}`; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
      const name = document.createElement('span'); name.className = 'combo-name'; name.textContent = s.name;
      const detail = document.createElement('span'); detail.className = 'combo-detail'; detail.textContent = s.detail;
      li.append(name, detail);
      li.addEventListener('mousedown', e => e.preventDefault()); // keep focus in the field
      li.addEventListener('click', () => choose(i));
      return li;
    }));
    const open = items.length > 0;
    list!.hidden = !open; input!.setAttribute('aria-expanded', String(open)); setActive(-1);
    announce(open ? `${items.length} ${items.length === 1 ? 'place' : 'places'} found. Use the arrow keys to choose.` : '');
  }

  function clearPick(keepName = true) {
    pickedName = '';
    ['googlePlaceId', 'placeAddress', 'lat', 'lng'].forEach(id => { hidden(id).value = ''; });
    picked.hidden = true;
    if (neighbourhoodFilled) { neighbourhood.value = ''; neighbourhoodFilled = false; }
    if (!keepName) input!.value = '';
  }

  async function choose(i: number) {
    const s = items[i];
    if (!s) return;
    close();
    input!.value = s.name;
    const mine = ++seq;
    const res = await call<{ place: Details }>({ action: 'details', placeId: s.placeId });
    session = crypto.randomUUID(); // a session ends with the details call
    if (mine !== seq || !res) return;
    const p = res.place;
    pickedName = s.name;
    hidden('googlePlaceId').value = p.placeId;
    hidden('placeAddress').value = p.address;
    hidden('lat').value = String(p.lat);
    hidden('lng').value = String(p.lng);
    addressText.textContent = p.address;
    picked.hidden = false;
    // Suggest the neighbourhood only when the visitor hasn't typed one.
    const area = matchArea(p.area, areas);
    if (area && !neighbourhood.value.trim()) { neighbourhood.value = area; neighbourhoodFilled = true; }
    announce(`${s.name} selected. ${p.address}`);
    showMap(p.lat, p.lng);
  }

  input.addEventListener('input', () => {
    if (pickedName && input.value !== pickedName) clearPick();
    window.clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 2) { items = []; close(); return; }
    timer = window.setTimeout(async () => {
      const mine = ++seq;
      const res = await call<{ suggestions: Suggestion[] }>({ action: 'suggest', input: q });
      if (mine !== seq || document.activeElement !== input) return;
      items = res?.suggestions ?? [];
      render();
    }, 250);
  });
  input.addEventListener('keydown', e => {
    if (list.hidden) { if (e.key === 'ArrowDown' && items.length) { list.hidden = false; input.setAttribute('aria-expanded', 'true'); setActive(0); e.preventDefault(); } return; }
    if (e.key === 'ArrowDown') { setActive((active + 1) % items.length); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setActive(active <= 0 ? items.length - 1 : active - 1); e.preventDefault(); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { close(); e.preventDefault(); }
  });
  input.addEventListener('blur', () => close());
  document.querySelector('#place-clear')!.addEventListener('click', () => { clearPick(false); input.focus(); });
  form.addEventListener('reset', () => { items = []; close(); clearPick(false); });

  // ---- Map preview: one small Google map, eased to the place with restraint. ----
  const key = form.dataset.mapsKey ?? '';
  let mapReady: Promise<{ map: any; marker: any }> | null = null;
  function loadMap() {
    if (!key) return null;
    mapReady ??= new Promise<void>((resolve, reject) => {
      (window as any).__elsewhereMaps = () => resolve();
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__elsewhereMaps`;
      s.async = true; s.onerror = () => reject(new Error('maps'));
      document.head.append(s);
    }).then(async () => {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
      mapEl.hidden = false;
      const map = new Map(mapEl, {
        center: { lat: 25.15, lng: 55.25 }, zoom: 11, mapId: form!.dataset.mapId || 'DEMO_MAP_ID',
        disableDefaultUI: true, gestureHandling: 'none', keyboardShortcuts: false, clickableIcons: false,
      });
      return { map, marker: new AdvancedMarkerElement({ map }) };
    });
    return mapReady;
  }
  async function showMap(lat: number, lng: number) {
    const ready = loadMap();
    if (!ready) return;
    let m;
    try { m = await ready; } catch { mapEl.hidden = true; return; }
    const target = { lat, lng };
    m.marker.position = target;
    if (reduceMotion) { m.map.setCenter(target); m.map.setZoom(16); return; }
    // Pan, then zoom in a level at a time: about a second, no fly-over.
    m.map.setZoom(Math.min(m.map.getZoom(), 13));
    m.map.panTo(target);
    let z = m.map.getZoom();
    const step = () => { if (z < 16) { z += 1; m.map.setZoom(z); window.setTimeout(step, 140); } };
    window.setTimeout(step, 300);
  }
}

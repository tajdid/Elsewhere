import { buildSubmission, validateSubmission, parseReports, addReport, dubaiToday, parseMbps, SUBMISSIONS_KEY, FIELD_ORDER, type StoredReport, type FieldError } from '../lib/submissions';
import { speedTier, formatMbps } from '../lib/details';

const form = document.querySelector<HTMLFormElement>('#submit-form');
const done = document.querySelector<HTMLElement>('#submit-done');
const status = document.querySelector<HTMLElement>('#app-status');
const announce = (s: string) => { if (status) status.textContent = s; };

interface Known { slug: string; id: string; name: string; category: string | null; neighbourhood: string; }

if (form && done) {
  const known: Known[] = JSON.parse(form.dataset.places || '[]');
  const target = known.find(p => p.slug === new URLSearchParams(location.search).get('place')) ?? null;
  const field = <T extends HTMLElement>(id: string) => form.querySelector<T>(`#${id}`)!;
  const submitLabel = form.querySelector<HTMLElement>('.submit-label')!;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const formError = document.querySelector<HTMLElement>('#form-error')!;
  const date = field<HTMLInputElement>('visitedOn');

  // Answers are tiles (radio groups): read the checked value by name.
  const radio = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? '';
  const check = (name: string, value: string) => { const r = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`); if (r) r.checked = true; };

  // The password field only shows when the visitor says the Wi-Fi needs a password from staff.
  const passwordField = document.querySelector<HTMLElement>('#wifiPassword-field')!;
  const syncPassword = () => { passwordField.hidden = radio('wifiAccess') !== 'password'; };

  // "Is parking free?" only shows once the visitor says there is parking to pay for; otherwise it goes back to Not sure.
  const parkingCost = document.querySelector<HTMLElement>('#parkingCost-field')!;
  const syncParking = () => {
    const show = ['street', 'carpark', 'valet'].includes(radio('parking'));
    parkingCost.hidden = !show;
    if (!show) form.querySelectorAll<HTMLInputElement>('input[name=parkingCost]').forEach(r => { r.checked = false; });
  };

  // Speed and access only matter when there is Wi-Fi.
  const wifiMore = Array.from(document.querySelectorAll<HTMLElement>('[data-wifi-more], #wifi-access-row'));
  const syncWifi = () => { wifiMore.forEach(el => { el.hidden = radio('wifi') === 'no'; }); };
  form.addEventListener('change', e => {
    const name = (e.target as HTMLInputElement).name;
    if (name === 'wifiAccess') syncPassword();
    if (name === 'parking') syncParking();
    if (name === 'wifi') syncWifi();
  });

  // The speed field fills a four-step gauge and says what the number means.
  const speedInput = field<HTMLInputElement>('wifiSpeed');
  const gauge = Array.from(document.querySelectorAll<HTMLElement>('#speed-gauge i'));
  const tierText = document.querySelector<HTMLElement>('#speed-tier')!;
  const syncSpeed = () => {
    const n = parseMbps(speedInput.value);
    const lit = n ? [0, 5, 20, 50].filter(t => n >= t).length : 0;
    gauge.forEach((g, i) => g.classList.toggle('on', i < lit));
    tierText.textContent = n ? `${formatMbps(n)}: ${speedTier(n).toLowerCase()}.` : '';
  };
  speedInput.addEventListener('input', syncSpeed);

  // Opening hours: "Not sure", one pair for every day, or each day (with Closed). Only the chosen block shows.
  const hoursSame = document.querySelector<HTMLElement>('#hours-same')!;
  const hoursDays = document.querySelector<HTMLElement>('#hours-days')!;
  const hoursMode = () => (form.querySelector<HTMLInputElement>('input[name=hoursMode]:checked')?.value ?? 'unsure');
  const syncHours = () => {
    hoursSame.hidden = hoursMode() !== 'same';
    hoursDays.hidden = hoursMode() !== 'days';
    hoursDays.querySelectorAll<HTMLElement>('.hours-day').forEach(row => {
      const closed = row.querySelector<HTMLInputElement>('input[type=checkbox]')!.checked;
      row.querySelectorAll<HTMLInputElement>('input[type=time]').forEach(t => { t.disabled = closed; });
      row.classList.toggle('is-closed', closed);
    });
  };
  form.addEventListener('change', e => { if ((e.target as HTMLInputElement).name === 'hoursMode' || (e.target as HTMLInputElement).type === 'checkbox') syncHours(); });
  document.querySelector('#hours-copy')!.addEventListener('click', () => {
    const get = (id: string) => field<HTMLInputElement>(id);
    const closed = form.querySelector<HTMLInputElement>('input[name=monClosed]')!.checked;
    ['tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(d => {
      get(`${d}Open`).value = get('monOpen').value; get(`${d}Close`).value = get('monClose').value;
      form.querySelector<HTMLInputElement>(`input[name=${d}Closed]`)!.checked = closed;
    });
    syncHours();
    announce('Monday’s hours copied to every day.');
  });

  // openedAt lets the server turn away forms sent faster than a person could; localId ties retries of one report together.
  let openedAt = Date.now();
  let localId = crypto.randomUUID();

  // Reporting on a listed place: prefill what we already know and say so.
  function setDefaults() {
    openedAt = Date.now();
    localId = crypto.randomUUID();
    syncPassword();
    syncParking();
    syncWifi();
    syncSpeed();
    syncHours();
    date.max = dubaiToday();
    date.value = dubaiToday();
    if (!target) return;
    field<HTMLInputElement>('placeId').value = target.id;
    field<HTMLInputElement>('name').value = target.name;
    if (target.category) check('category', target.category);
    field<HTMLInputElement>('neighbourhood').value = target.neighbourhood;
  }
  if (target) {
    document.querySelector('#submit-title')!.textContent = `Report on ${target.name}.`;
    document.querySelector('#submit-intro')!.textContent = 'Been here lately? Tell us what you found, amenity by amenity.';
    document.title = `Report on ${target.name} · Elsewhere`;
    submitLabel.textContent = 'Send report';
    const back = document.querySelector<HTMLAnchorElement>('#done-back')!;
    back.href = `/places/${target.slug}/`;
    back.firstChild!.textContent = `Back to ${target.name}`;
  }
  setDefaults();

  function readStored(): StoredReport[] { try { return parseReports(localStorage.getItem(SUBMISSIONS_KEY)); } catch { return []; } }

  function renderReports() {
    const list = readStored();
    const wrap = document.querySelector<HTMLElement>('#my-reports')!;
    const ul = document.querySelector<HTMLUListElement>('#my-reports-list')!;
    wrap.hidden = list.length === 0;
    ul.replaceChildren(...list.slice(0, 10).map(r => {
      const li = document.createElement('li');
      const when = new Date(`${r.visitedOn}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const title = document.createElement('strong'); title.textContent = r.name;
      const meta = document.createElement('span'); meta.textContent = `${r.kind === 'update' ? 'Report' : 'New place'} · visited ${when}`;
      const chip = document.createElement('span'); chip.className = 'pill'; chip.dataset.tone = r.delivery === 'sent' ? 'positive' : 'unknown';
      chip.textContent = r.delivery === 'sent' ? 'Sent' : 'Saved on this device';
      const text = document.createElement('div'); text.append(title, meta);
      li.append(text, chip); return li;
    }));
  }
  renderReports();

  function showErrors(errors: FieldError[]) {
    // Hours have no single input: mark the empty, enabled time fields in the chosen block.
    const visibleTimes = () => [...form!.querySelectorAll<HTMLInputElement>(`${hoursMode() === 'same' ? '#hours-same' : '#hours-days'} input[type=time]`)].filter(t => !t.disabled);
    form!.querySelectorAll<HTMLInputElement>('input[type=time]').forEach(t => t.removeAttribute('aria-invalid'));
    FIELD_ORDER.forEach(id => {
      const bad = errors.includes(id);
      if (id === 'hours') { if (bad) visibleTimes().filter(t => !t.value).forEach(t => t.setAttribute('aria-invalid', 'true')); }
      else field<HTMLInputElement>(id).setAttribute('aria-invalid', String(bad));
      document.querySelector<HTMLElement>(`#${id}-error`)!.hidden = !bad;
    });
    const target = (e: FieldError) => e === 'hours' ? visibleTimes().find(t => !t.value) ?? visibleTimes()[0] : field<HTMLInputElement>(e);
    if (errors.length) { target(errors[0])?.focus(); announce(`Check ${errors.length === 1 ? 'one field' : `${errors.length} fields`} before sending.`); }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    formError.hidden = true;
    const values = Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]));
    // No Wi-Fi: speed and access answers left over from an earlier choice don't apply.
    if (values.wifi === 'no') { values.wifiSpeed = ''; values.wifiAccess = 'unsure'; values.wifiPassword = ''; }
    const errors = validateSubmission(values);
    showErrors(errors);
    if (errors.length) return;

    const payload = buildSubmission(values, values.placeId || null);
    const endpoint = form.dataset.endpoint || '';
    let delivery: StoredReport['delivery'] = 'device';
    let serverId: string | undefined;
    // The local copy never includes the contact email.
    const store = (d: StoredReport['delivery']) => {
      try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(addReport(readStored(), { ...payload, delivery: d, localId, ...(serverId ? { id: serverId } : {}) }))); return true; } catch { return false; }
    };
    if (endpoint) {
      submitButton.disabled = true; submitButton.setAttribute('aria-busy', 'true');
      const label = submitLabel.textContent; submitLabel.textContent = 'Sending…';
      try {
        const wifiPassword = payload.wifiAccess === 'password' ? (values.wifiPassword ?? '').trim().slice(0, 64) : '';
        // The place picked from the search, if any: Google's place ID, address and coordinates, sent together or not at all.
        const lat = Number(values.lat), lng = Number(values.lng);
        const located = values.googlePlaceId && Number.isFinite(lat) && Number.isFinite(lng) && values.lat !== '' && values.lng !== '';
        const place = located ? { googlePlaceId: values.googlePlaceId, address: (values.placeAddress ?? '').slice(0, 300), lat, lng } : {};
        const body = { ...payload, email: (values.email ?? '').trim(), wifiPassword, ...place, hp: values.elsewhere_hp ?? '', openedAt };
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
        if (res.status !== 201 && res.status !== 200) throw new Error(String(res.status));
        serverId = ((await res.json().catch(() => ({}))) as { id?: string }).id;
        delivery = 'sent';
      } catch {
        // Not saved on the server: keep a copy here, keep the form filled, and say exactly that.
        const kept = store('device');
        formError.textContent = kept
          ? 'We couldn’t send your report. It’s saved on this device; try again in a moment.'
          : 'We couldn’t send your report. Check your connection and try again; nothing you entered has been lost.';
        formError.hidden = false; // role=alert announces it
        renderReports();
        return;
      } finally {
        submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); submitLabel.textContent = label;
        // Disabling the button while sending drops focus to the page; put it back where the visitor was.
        if (document.activeElement === document.body) submitButton.focus();
      }
    }

    const stored = store(delivery);
    if (delivery === 'device' && !stored) {
      formError.textContent = 'This browser is blocking storage, so your report couldn’t be saved. Allow site data and try again.';
      formError.hidden = false;
      return;
    }

    document.querySelector('#done-title')!.textContent = delivery === 'sent' ? 'Thanks, that’s in.' : 'Report saved.';
    document.querySelector('#done-text')!.textContent = delivery === 'sent'
      ? `We’ll review what you found at ${payload.name}. Until someone checks it in person, it counts as Reported.`
      : `Your report on ${payload.name} is saved in this browser. It hasn’t been sent anywhere yet.`;
    form.hidden = true; done.hidden = false;
    document.querySelector<HTMLElement>('#done-title')!.focus();
    announce(delivery === 'sent' ? 'Report sent.' : 'Report saved in this browser.');
    renderReports();
  });

  document.querySelector('#submit-another')!.addEventListener('click', () => {
    form.reset(); setDefaults(); showErrors([]); formError.hidden = true;
    done.hidden = true; form.hidden = false;
    field<HTMLInputElement>(target ? 'visitedOn' : 'name').focus();
  });
}

import { buildSubmission, validateSubmission, parseReports, addReport, dubaiToday, SUBMISSIONS_KEY, type StoredReport, type FieldError } from '../lib/submissions';

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

  // Reporting on a listed place: prefill what we already know and say so.
  function setDefaults() {
    date.max = dubaiToday();
    date.value = dubaiToday();
    if (!target) return;
    field<HTMLInputElement>('placeId').value = target.id;
    field<HTMLInputElement>('name').value = target.name;
    if (target.category) field<HTMLSelectElement>('category').value = target.category;
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
    (['name', 'neighbourhood', 'wifiSpeed', 'visitedOn'] as FieldError[]).forEach(id => {
      const bad = errors.includes(id);
      field<HTMLInputElement>(id).setAttribute('aria-invalid', String(bad));
      document.querySelector<HTMLElement>(`#${id}-error`)!.hidden = !bad;
    });
    if (errors.length) { field<HTMLInputElement>(errors[0]).focus(); announce(`Check ${errors.length === 1 ? 'one field' : `${errors.length} fields`} before sending.`); }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    formError.hidden = true;
    const values = Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]));
    const errors = validateSubmission(values);
    showErrors(errors);
    if (errors.length) return;

    const payload = buildSubmission(values, values.placeId || null);
    const endpoint = form.dataset.endpoint || '';
    let delivery: StoredReport['delivery'] = 'device';
    if (endpoint) {
      submitButton.disabled = true; submitButton.setAttribute('aria-busy', 'true');
      const label = submitLabel.textContent; submitLabel.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
        delivery = 'sent';
      } catch {
        formError.textContent = 'We couldn’t send your report. Check your connection and try again; nothing you entered has been lost.';
        formError.hidden = false;
        return;
      } finally {
        submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); submitLabel.textContent = label;
      }
    }

    let stored = true;
    try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(addReport(readStored(), { ...payload, delivery }))); } catch { stored = false; }
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

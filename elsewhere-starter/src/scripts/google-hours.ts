// "Show hours from Google" on place pages: fetches Google's usual weekly hours when the visitor asks, shows them
// with their source, and keeps nothing. Google's terms don't allow storing them, and asking only on a tap keeps the
// paid lookups inside the free allowance. No "open now" claim: holiday hours can differ.
const box = document.querySelector<HTMLElement>('[data-google-hours]');
if (box) {
  const button = box.querySelector<HTMLButtonElement>('[data-hours-btn]')!;
  const out = box.querySelector<HTMLElement>('[data-hours-out]')!;
  const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'Asia/Dubai' }).toLowerCase().slice(0, 3);
  const label = button.lastChild!;

  button.addEventListener('click', async () => {
    button.disabled = true; button.setAttribute('aria-busy', 'true'); label.textContent = 'Loading hours…';
    let hours: string[] | null | undefined;
    try {
      const res = await fetch(box.dataset.endpoint!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'hours', placeId: box.dataset.googleHours }) });
      if (res.ok) hours = ((await res.json()) as { hours: string[] | null }).hours;
    } catch { /* shown below */ }
    button.disabled = false; button.removeAttribute('aria-busy');
    if (hours === undefined) { label.textContent = 'Couldn’t load hours. Try again'; button.focus(); return; }

    const note = document.createElement('p'); note.className = 'visit-small';
    if (!hours) {
      note.textContent = 'Google Maps doesn’t list hours for this place.';
      out.replaceChildren(note);
    } else {
      const ul = document.createElement('ul'); ul.className = 'week';
      hours.forEach((line, i) => {
        const at = line.indexOf(': ');
        const li = document.createElement('li'); li.dataset.day = keys[i];
        if (keys[i] === today) li.setAttribute('aria-current', 'date');
        const day = document.createElement('span'); day.textContent = at > 0 ? line.slice(0, at).slice(0, 3) : '';
        const time = document.createElement('span'); time.textContent = at > 0 ? line.slice(at + 2) : line;
        li.append(day, time); ul.append(li);
      });
      note.textContent = 'From Google Maps, just now. Holiday hours can differ.';
      out.replaceChildren(ul, note);
    }
    button.remove(); out.hidden = false; out.focus();
  });
}

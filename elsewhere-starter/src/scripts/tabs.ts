// Main navigation: one white pill that slides to the item under the mouse or keyboard focus,
// and returns to the current page when the pointer or focus leaves. Without this script each
// current link keeps its own white background (CSS), so nothing depends on it.
const nav = document.querySelector<HTMLElement>('.tabs');
if (nav) {
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  const pill = document.createElement('span');
  pill.className = 'tabs-pill';
  pill.setAttribute('aria-hidden', 'true');
  nav.prepend(pill);
  const current = () => links.find(a => a.hasAttribute('aria-current')) ?? null;
  let target: HTMLAnchorElement | null = null;

  const place = (a: HTMLAnchorElement | null, animate = true) => {
    target = a;
    // Appearing from nowhere should fade in place, not slide in from the left edge.
    const instant = !animate || !pill.classList.contains('is-on');
    const firstPaint = !animate && !pill.dataset.ready;
    if (instant) pill.classList.add(firstPaint ? 'no-anim' : 'no-slide');
    if (a) {
      pill.style.width = `${a.offsetWidth}px`;
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
      pill.classList.add('is-on');
    } else pill.classList.remove('is-on');
    if (instant) { void pill.offsetWidth; pill.classList.remove('no-slide', 'no-anim'); }
    pill.dataset.ready = '1';
    links.forEach(l => l.classList.toggle('is-lit', l === a));
  };

  nav.dataset.slider = '';
  place(current(), false);
  links.forEach(a => {
    a.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') place(a); });
    a.addEventListener('focus', () => { if (a.matches(':focus-visible')) place(a); });
  });
  nav.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') place(current()); });
  nav.addEventListener('focusout', e => { if (!nav.contains(e.relatedTarget as Node)) place(current()); });
  // Widths change when the web font loads or the layout switches at a breakpoint.
  new ResizeObserver(() => place(target, false)).observe(nav);
  document.fonts?.ready.then(() => place(target, false));
}

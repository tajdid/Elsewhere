// Featured-places carousel. The track is a native scroll-snap list, so it swipes (and works) without this script;
// the script adds previous/next and dot controls, keeps the current slide in sync, and keeps hidden slides out of the tab order.
const root = document.querySelector<HTMLElement>('[data-carousel]');
if (root) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const slides = Array.from(track.children) as HTMLElement[];
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-dot]'));
  const status = root.querySelector<HTMLElement>('[data-carousel-status]')!;
  const controls = root.querySelector<HTMLElement>('[data-controls]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let target: number | null = null; // set while a button-driven scroll is still travelling

  const sync = (i: number) => {
    current = i;
    dots.forEach((d, n) => d.setAttribute('aria-current', String(n === i)));
    slides.forEach((s, n) => { s.inert = n !== i; });
  };
  const go = (i: number, announce = true) => {
    const n = (i + slides.length) % slides.length;
    target = n;
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce.matches ? 'auto' : 'smooth' });
    sync(n);
    if (announce) status.textContent = slides[n].getAttribute('aria-label') ?? '';
  };

  root.querySelector('[data-prev]')!.addEventListener('click', () => go(current - 1));
  root.querySelector('[data-next]')!.addEventListener('click', () => go(current + 1));
  dots.forEach((d, n) => d.addEventListener('click', () => go(n)));

  // Swipes and trackpad scrolls settle on a slide; follow them without announcing.
  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (target !== null) { if (Math.abs(track.scrollLeft - target * track.clientWidth) < 2) target = null; return; }
      if (i !== current && i >= 0 && i < slides.length) sync(i);
    });
  }, { passive: true });
  // A swipe that interrupts a button-driven scroll hands control back to the swipe.
  track.addEventListener('pointerdown', () => { target = null; });
  track.addEventListener('wheel', () => { target = null; }, { passive: true });
  // Keep the current slide in place when the layout width changes.
  new ResizeObserver(() => { track.scrollLeft = current * track.clientWidth; }).observe(track);

  // Autoplay every 3 seconds. It pauses while the pointer or keyboard focus is on the carousel or the tab is hidden,
  // stops for good with the pause button (WCAG 2.2.2), and never starts under reduced motion.
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;
  let playing = !reduce.matches;
  let held = false;
  let timer = 0;
  const schedule = () => {
    clearInterval(timer);
    if (playing && !held && !document.hidden) timer = window.setInterval(() => go(current + 1, false), 3000);
  };
  const setPlaying = (on: boolean) => {
    playing = on;
    playBtn.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
    playBtn.dataset.state = on ? 'playing' : 'paused';
    schedule();
  };
  playBtn.addEventListener('click', () => setPlaying(!playing));
  root.addEventListener('pointerenter', () => { held = true; schedule(); });
  root.addEventListener('pointerleave', () => { held = false; schedule(); });
  root.addEventListener('focusin', () => { held = true; schedule(); });
  root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget as Node)) { held = false; schedule(); } });
  document.addEventListener('visibilitychange', schedule);
  reduce.addEventListener('change', () => setPlaying(playing && !reduce.matches));

  controls.hidden = false;
  sync(0);
  setPlaying(playing);
}

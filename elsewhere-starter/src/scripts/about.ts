// About page: on wide screens the step in the middle of the screen drives the pinned picture. Without this script,
// or on narrow screens, every step shows its own picture. Nothing here changes content.
// ---- How submitting works: the step in the middle of the screen drives the pinned picture. ----
const scene = document.querySelector<HTMLElement>('[data-steps]');
const wide = matchMedia('(min-width: 900px)');
if (scene) {
  const items = [...scene.querySelectorAll<HTMLElement>('.steps-list > li')];
  const win = scene.querySelector<HTMLElement>('.steps-window')!;
  const setActive = (i: number) => {
    items.forEach((li, n) => li.classList.toggle('is-active', n === i));
    win.dataset.active = String(i);
  };
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
  }, { rootMargin: '-45% 0px -45% 0px' });
  const sync = () => {
    io.disconnect();
    scene.classList.toggle('is-live', wide.matches);
    if (wide.matches) items.forEach(li => io.observe(li)); else setActive(0);
  };
  wide.addEventListener('change', sync);
  sync();
}

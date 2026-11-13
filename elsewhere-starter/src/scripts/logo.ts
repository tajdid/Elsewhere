// Header logo motion. The hover wave always runs to the end (never snaps back mid-wave),
// and the once-per-visit intro class is cleared when it finishes so it can't replay.
const mark = document.querySelector<HTMLElement>('.wordmark');
const letters = mark ? Array.from(mark.querySelectorAll<SVGPathElement>('.logo path')) : [];
const last = letters.reduce<SVGPathElement | null>((a, p) => (!a || Number(p.style.getPropertyValue('--i')) > Number(a.style.getPropertyValue('--i')) ? p : a), null);
if (mark && last) {
  const root = document.documentElement;
  last.addEventListener('animationend', e => {
    if (e.animationName === 'logo-rise') root.classList.remove('intro');
    if (e.animationName === 'logo-wave') mark.classList.remove('is-waving');
  });
  mark.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'mouse' || root.classList.contains('intro')) return;
    mark.classList.add('is-waving');
  });
}

// Footer logo: the letters rise from the baseline, staggered, the first time the footer scrolls into view.
// It's only armed (hidden) by script and never under reduced motion, so without either it simply shows.
const big = document.querySelector<HTMLElement>('.footer-mark');
if (big && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  big.classList.add('is-armed');
  const io = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    io.disconnect();
    big.classList.add('is-revealing');
    requestAnimationFrame(() => big.classList.remove('is-armed'));
    // Longest delay (8 × 70ms) plus the 900ms rise, then hand back to the quick hover transition.
    window.setTimeout(() => big.classList.remove('is-revealing'), 8 * 70 + 950);
  }, { threshold: 0.35 });
  io.observe(big);
}

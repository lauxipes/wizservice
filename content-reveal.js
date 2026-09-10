(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const frames = document.querySelectorAll('.magic-frame');
  if (!frames.length) return;

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  frames.forEach((frame) => observer.observe(frame));
})();

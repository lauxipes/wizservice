(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isInternalPage = (link) => {
    const url = new URL(link.href, window.location.href);
    return url.origin === window.location.origin &&
      url.pathname !== window.location.pathname &&
      url.hash === '' &&
      !link.target &&
      !link.hasAttribute('download');
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        !isInternalPage(link)) return;

    event.preventDefault();
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => { window.location.href = link.href; }, 220);
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-is-leaving');
  });
})();

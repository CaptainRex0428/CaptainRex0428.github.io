function initScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) {
            setTimeout(() => el.classList.add('revealed'), Number(delay));
          } else {
            el.classList.add('revealed');
          }
          observer.unobserve(el);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// Initial load
initScrollReveal();

// Re-init after View Transitions page swap
document.addEventListener('astro:page-load', initScrollReveal);

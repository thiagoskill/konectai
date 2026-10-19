const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('opacity-0', '-translate-x-24', 'translate-x-24', 'translate-y-10');
    entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -70px 0px'
});

revealItems.forEach((item) => revealObserver.observe(item));

const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const sections = [...document.querySelectorAll('section[id]')];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('text-white', active);
      link.classList.toggle('bg-white/10', active);
      link.classList.toggle('text-slate-300', !active);
    });
  });
}, {
  threshold: 0.38,
  rootMargin: '-90px 0px -35% 0px'
});

sections.forEach((section) => sectionObserver.observe(section));

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

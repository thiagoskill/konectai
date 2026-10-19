/* @sidebar — gaveta off-canvas no mobile.
 *
 * O painel e o gatilho são elementos irmãos: [data-sidebar] e
 * [data-sidebar-toggle]. Ficam separados de propósito — o translate que tira a
 * sidebar da tela cria um containing block, então um botão dentro dela sairia
 * junto e ficaria inalcançável.
 *
 * O estado vive no atributo data-open da sidebar; o CSS
 * (max-md:data-[open]:translate-x-0) cuida do resto. */

document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('[data-sidebar]');
  var toggles = document.querySelectorAll('[data-sidebar-toggle]');
  if (!sidebar || !toggles.length) return;

  if (!sidebar.id) sidebar.id = 'seed-sidebar';

  function isOpen() {
    return sidebar.hasAttribute('data-open');
  }

  function setOpen(open) {
    if (open) {
      sidebar.setAttribute('data-open', '');
    } else {
      sidebar.removeAttribute('data-open');
    }
    document.body.classList.toggle('seed-sidebar-open', open);
    toggles.forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-controls', sidebar.id);
    });
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(!isOpen());
    });
  });

  // Clique fora fecha. Faz o papel de overlay sem exigir markup extra.
  document.addEventListener('click', function (event) {
    if (isOpen() && !sidebar.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) setOpen(false);
  });

  sidebar.addEventListener('click', function (event) {
    if (event.target.closest('a[href]')) setOpen(false);
  });

  // Passar para o desktop deixaria o body travado com a classe do overlay.
  window.addEventListener('resize', function () {
    if (isOpen() && window.innerWidth >= 768) setOpen(false);
  });

  setOpen(false);
});

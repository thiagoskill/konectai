document.addEventListener("DOMContentLoaded", function () {
  // Inject carousel styles once
  var style = document.createElement("style");
  style.textContent =
    "[data-carousel-dot]{width:.5rem;height:.5rem;border-radius:9999px;border:none;padding:0;cursor:pointer;background:#d1d5db;transition:background .2s}" +
    "[data-carousel-dot][data-active=true]{background:#1f2937}";
  document.head.appendChild(style);

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-carousel-track]");
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dotsContainer = root.querySelector("[data-carousel-dots]");
    var slides = track.children;
    var current = 0;
    var autoplayTimer = null;

    if (slides.length <= 1) {
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      if (dotsContainer) dotsContainer.hidden = true;
      return;
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      updateDots();
    }

    function updateDots() {
      var dots = dotsContainer.children;
      for (var j = 0; j < dots.length; j++) {
        dots[j].dataset.active = j === current ? "true" : "";
      }
    }

    function buildDots() {
      dotsContainer.innerHTML = "";
      for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement("button");
        dot.setAttribute("data-carousel-dot", "");
        dot.addEventListener("click", (function (idx) {
          return function () { goTo(idx); resetAutoplay(); };
        })(i));
        dotsContainer.appendChild(dot);
      }
    }

    function startAutoplay() {
      var delay = root.getAttribute("autoplay");
      var ms = delay && delay !== "true" && delay !== "" ? parseInt(delay, 10) : 5000;
      if (isNaN(ms) || ms < 500) ms = 5000;
      autoplayTimer = setInterval(function () { goTo(current + 1); }, ms);
    }

    function resetAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        startAutoplay();
      }
    }

    prev.addEventListener("click", function () { goTo(current - 1); resetAutoplay(); });
    next.addEventListener("click", function () { goTo(current + 1); resetAutoplay(); });

    buildDots();
    goTo(0);

    if (root.hasAttribute("autoplay")) {
      startAutoplay();
      root.addEventListener("mouseenter", function () {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
      });
      root.addEventListener("mouseleave", function () { startAutoplay(); });
    }
  });
});

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

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var items = root.querySelectorAll("[data-tabs-group] button");
    var panels = root.querySelectorAll("[data-tabs-panel]");
    function activate(i) {
      items.forEach(function (btn, j) { btn.dataset.active = i === j ? "true" : ""; });
      panels.forEach(function (p, j) { p.hidden = i !== j; });
    }
    items.forEach(function (btn, i) { btn.addEventListener("click", function () { activate(i); }); });
    if (items.length) activate(0);
  });
});

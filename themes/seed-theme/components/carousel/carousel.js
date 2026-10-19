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

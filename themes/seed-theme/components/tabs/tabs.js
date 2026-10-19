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

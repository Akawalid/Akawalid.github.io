// Dark by default; the sun/moon button switches to the soft light theme and
// remembers the choice. Fires "themechange" so the Fourier portrait can
// pick up the new colours.

(function () {
  var STORAGE_KEY = "site-theme";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  });
})();

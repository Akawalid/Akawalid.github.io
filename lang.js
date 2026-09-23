// Language switching engine. Reads window.i18n (set up in i18n.js) and
// applies the chosen language to every [data-i18n] element, the
// Education/Skills lists, and fires a "langchange" event so main.js /
// project.js can re-render their data-driven lists (research, projects,
// project detail) in the new language.

(function () {
  var STORAGE_KEY = "site-lang";
  var SUPPORTED = ["en", "fr", "kab"];

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* localStorage unavailable - fall through */ }
    return "en";
  }

  function t() {
    return window.i18n[getLang()];
  }

  function renderListInto(containerId, items, mapFn) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    items.forEach(function (item) {
      el.appendChild(mapFn(item));
    });
  }

  function applyStatic() {
    var dict = t();

    document.documentElement.lang = getLang() === "kab" ? "kab" : getLang();
    document.documentElement.classList.toggle("lang-kab", getLang() === "kab");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    if (document.getElementById("education-list")) {
      renderListInto("education-list", dict.education, function (entry) {
        var li = document.createElement("li");

        var titleP = document.createElement("p");
        titleP.className = "entry-title";
        var strong = document.createElement("strong");
        strong.textContent = entry.years;
        titleP.appendChild(strong);
        titleP.appendChild(document.createTextNode(" - " + entry.text));
        li.appendChild(titleP);

        if (entry.coursework) {
          var bodyP = document.createElement("p");
          bodyP.className = "entry-body";
          var label = document.createElement("strong");
          label.textContent = dict.courseworkLabel;
          bodyP.appendChild(label);
          bodyP.appendChild(document.createTextNode(": " + entry.coursework));
          li.appendChild(bodyP);
        }

        return li;
      });
    }

    if (document.getElementById("skills-list")) {
      renderListInto("skills-list", dict.skills, function (entry) {
        var li = document.createElement("li");

        var titleP = document.createElement("p");
        titleP.className = "entry-title";
        var strong = document.createElement("strong");
        strong.textContent = entry.label;
        titleP.appendChild(strong);
        li.appendChild(titleP);

        var bodyP = document.createElement("p");
        bodyP.className = "entry-body";
        bodyP.appendChild(document.createTextNode(entry.text));
        li.appendChild(bodyP);

        return li;
      });
    }

    if (document.getElementById("awards-list")) {
      renderListInto("awards-list", dict.awards, function (text) {
        var li = document.createElement("li");
        var p = document.createElement("p");
        p.className = "entry-title";
        p.appendChild(document.createTextNode(text));
        li.appendChild(p);
        return li;
      });
    }

    if (document.getElementById("publications-list")) {
      renderListInto("publications-list", dict.publications, function (text) {
        var li = document.createElement("li");
        var p = document.createElement("p");
        p.className = "entry-title";
        p.appendChild(document.createTextNode(text));
        li.appendChild(p);
        return li;
      });
    }

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === getLang());
    });
  }

  function setLang(code) {
    if (SUPPORTED.indexOf(code) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ }
    applyStatic();
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: code } }));
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
    applyStatic();
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: getLang() } }));
  });

  window.siteLang = { getLang: getLang, t: t, setLang: setLang };
})();

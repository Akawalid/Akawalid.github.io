// Language switching engine. Reads window.i18n (set up in i18n.js) and
// applies the chosen language to every [data-i18n] element, the
// Education/Skills lists, and fires a "langchange" event so main.js /
// project.js can re-render their data-driven lists (research, projects,
// project detail) in the new language.

(function () {
  var STORAGE_KEY = "site-lang";
  var SUPPORTED = ["en", "fr", "ar", "kab"];
  // what a language shows where a string or a write-up is not translated yet
  var FALLBACK = { kab: "fr", ar: "en", fr: "en", en: "en" };

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

  function fallback() { return FALLBACK[getLang()]; }

  // the current language's version of a translated field ({ en, fr, ar, kab })
  function pick(field) {
    if (!field) return "";
    var l = getLang();
    return field[l] !== undefined ? field[l] : field[FALLBACK[l]] !== undefined ? field[FALLBACK[l]] : field.en;
  }

  function renderListInto(containerId, items, mapFn) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    items.forEach(function (item) {
      el.appendChild(mapFn(item));
    });
  }

  // one CV row: a date (or label) column on the left, the content on the right
  function makeEntry(dateText) {
    var li = document.createElement("li");
    li.className = "entry";
    var date = document.createElement("div");
    date.className = "entry-date";
    date.textContent = dateText.replace(/ - /g, "–");
    var main = document.createElement("div");
    main.className = "entry-main";
    li.appendChild(date);
    li.appendChild(main);
    return { li: li, main: main };
  }

  function addLine(parent, className, text) {
    var p = document.createElement("p");
    p.className = className;
    p.textContent = text;
    parent.appendChild(p);
    return p;
  }

  // "Degree, Institution - 16.5/20 (...)" -> degree / "Institution · 16.5/20 (...)"
  // (Arabic entries use the Arabic comma "، ")
  function splitEducation(text) {
    var grade = "";
    var m = text.match(/^(.*) - (\d[\d.,]*\/20.*)$/);
    if (m) { text = m[1]; grade = m[2]; }
    var cut = Math.max(text.lastIndexOf(", "), text.lastIndexOf("، "));
    var degree = cut === -1 ? text : text.slice(0, cut);
    var place = cut === -1 ? "" : text.slice(cut + 2);
    return { degree: degree, place: [place, grade].filter(Boolean).join(" · ") };
  }

  function applyStatic() {
    var dict = t();

    var lang = getLang(), backup = window.i18n[fallback()];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("lang-kab", lang === "kab");

    // strings not translated yet use the fallback language
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = dict[key] !== undefined ? dict[key] : backup[key];
      if (value !== undefined) el.textContent = value;
    });

    if (document.getElementById("education-list")) {
      renderListInto("education-list", dict.education, function (entry) {
        var e = makeEntry(entry.years);
        var parts = splitEducation(entry.text);

        addLine(e.main, "entry-title", parts.degree);
        if (parts.place) addLine(e.main, "entry-sub", parts.place);

        if (entry.coursework) {
          var bodyP = addLine(e.main, "entry-text", "");
          var label = document.createElement("span");
          label.className = "entry-label";
          label.textContent = dict.courseworkLabel + ": ";
          bodyP.appendChild(label);
          bodyP.appendChild(document.createTextNode(entry.coursework));
        }

        if (entry.moreCoursework) {
          var details = document.createElement("details");
          details.className = "coursework-more";
          var summary = document.createElement("summary");
          summary.textContent = dict.moreDetails;
          details.appendChild(summary);
          addLine(details, "entry-text", entry.moreCoursework);
          e.main.appendChild(details);
        }

        return e.li;
      });
    }

    if (document.getElementById("skills-list")) {
      renderListInto("skills-list", dict.skills, function (entry) {
        var e = makeEntry(entry.label);
        addLine(e.main, "entry-text", entry.text);
        return e.li;
      });
    }

    if (document.getElementById("experience-list")) {
      renderListInto("experience-list", dict.experience || backup.experience, function (entry) {
        var e = makeEntry(entry.years);
        addLine(e.main, "entry-title", entry.title);
        addLine(e.main, "entry-sub", entry.place);
        addLine(e.main, "entry-text", entry.text);
        return e.li;
      });
    }

    ["awards", "publications"].forEach(function (key) {
      if (!document.getElementById(key + "-list")) return;
      renderListInto(key + "-list", dict[key], function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        return li;
      });
    });

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

  window.siteLang = { getLang: getLang, t: t, fallback: fallback, pick: pick, setLang: setLang, makeEntry: makeEntry, addLine: addLine };
})();

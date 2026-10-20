// Research and project rows: the title links to the project's own page.
function renderEntries(listId, type) {
  var list = document.getElementById(listId);
  if (!list) return;
  var lang = window.siteLang.getLang();
  list.innerHTML = "";
  window.projects.filter(function (p) { return p.type === type; }).forEach(function (project) {
    var e = window.siteLang.makeEntry(project.period[lang]);

    var titleP = window.siteLang.addLine(e.main, "entry-title", "");
    var link = document.createElement("a");
    link.href = "project.html?id=" + encodeURIComponent(project.slug);
    link.textContent = project.title[lang];
    titleP.appendChild(link);

    if (project.lab) window.siteLang.addLine(e.main, "entry-sub", project.lab[lang]);
    window.siteLang.addLine(e.main, "entry-text", project.description[lang].replace(/\n\n/g, " "));

    if (project.tags && project.tags.length) {
      var tags = document.createElement("ul");
      tags.className = "tag-list";
      project.tags.forEach(function (tag) {
        var li = document.createElement("li");
        li.textContent = tag;
        tags.appendChild(li);
      });
      e.main.appendChild(tags);
    }

    list.appendChild(e.li);
  });
}

function renderAllLists() {
  renderEntries("research-list", "research");
  renderEntries("project-list", "project");
}

window.addEventListener("langchange", renderAllLists);
renderAllLists();

// the lists above are filled in by script, after the browser's own jump to
// a #section link - so jump again once everything is in place
window.addEventListener("load", function () {
  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: "instant" });
});

// Section menu: highlight the section currently being read - the last one
// whose top has passed under the menu (or the last one at the page bottom).
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".section-nav a"));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  if (!links.length) return;
  var current = -1;
  var ticking = false;

  function update() {
    ticking = false;
    var index = 0;
    sections.forEach(function (section, i) {
      if (section && section.getBoundingClientRect().top <= 120) index = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      index = sections.length - 1;
    }
    if (index === current) return;
    current = index;
    links.forEach(function (a, i) { a.classList.toggle("active", i === index); });
    // keep the active item visible when the menu scrolls sideways on phones
    var link = links[index];
    var bar = link.parentNode;
    bar.scrollTo({ left: link.offsetLeft - bar.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("load", update);
  update();
})();

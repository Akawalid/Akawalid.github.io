// Project lists: the selected work on the home page, and the full research
// and project lists on their own pages. Every title links to the entry's page.

function projectHref(project) {
  return "project.html?id=" + encodeURIComponent(project.slug);
}

// technology tags, led by a "live demo" badge when the entry has one
function tagList(project, dict) {
  if (!(project.tags && project.tags.length) && !project.demo) return null;
  var tags = document.createElement("ul");
  tags.className = "tag-list";
  if (project.demo) {
    var badge = document.createElement("li");
    badge.className = "demo-tag";
    var demoLink = document.createElement("a");
    demoLink.href = projectHref(project) + "#demo";
    demoLink.textContent = "▶ " + (dict.demoBadge || window.i18n.fr.demoBadge);
    badge.appendChild(demoLink);
    tags.appendChild(badge);
  }
  (project.tags || []).forEach(function (tag) {
    var li = document.createElement("li");
    li.textContent = tag;
    tags.appendChild(li);
  });
  return tags;
}

function previewLink(project, className) {
  var thumb = document.createElement("a");
  thumb.className = className;
  thumb.href = projectHref(project);
  thumb.tabIndex = -1;
  thumb.setAttribute("aria-hidden", "true");
  var img = document.createElement("img");
  img.src = project.preview;
  img.alt = "";
  img.loading = "lazy";
  img.width = 640;
  img.height = 400;
  thumb.appendChild(img);
  return thumb;
}

function renderEntries(listId, type) {
  var list = document.getElementById(listId);
  if (!list) return;
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();
  list.innerHTML = "";
  window.projects.filter(function (p) { return p.type === type; }).forEach(function (project) {
    var e = window.siteLang.makeEntry(project.period[lang]);

    // a preview image under the date, for entries that have a telling visual
    if (project.preview) e.li.querySelector(".entry-date").appendChild(previewLink(project, "entry-thumb"));

    var titleP = window.siteLang.addLine(e.main, "entry-title", "");
    var link = document.createElement("a");
    link.href = projectHref(project);
    link.textContent = project.title[lang];
    titleP.appendChild(link);

    if (project.lab) window.siteLang.addLine(e.main, "entry-sub", project.lab[lang]);
    window.siteLang.addLine(e.main, "entry-text", project.description[lang].replace(/\n\n/g, " "));

    var tags = tagList(project, dict);
    if (tags) e.main.appendChild(tags);

    list.appendChild(e.li);
  });
}

// home page: a few entries shown as larger cards
function renderFeatured() {
  var list = document.getElementById("featured-list");
  if (!list) return;
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();
  list.innerHTML = "";
  window.featuredProjects.forEach(function (slug) {
    var project = window.projects.find(function (p) { return p.slug === slug; });
    if (!project) return;
    var li = document.createElement("li");
    li.className = "feature";
    if (project.preview) li.appendChild(previewLink(project, "feature-thumb"));

    var main = document.createElement("div");
    main.className = "feature-main";
    var meta = project.period[lang].replace(/ - /g, "–") + (project.lab ? " · " + project.lab[lang] : "");
    window.siteLang.addLine(main, "feature-meta", meta);

    var title = document.createElement("h3");
    title.className = "feature-title";
    var link = document.createElement("a");
    link.href = projectHref(project);
    link.textContent = project.title[lang];
    title.appendChild(link);
    main.appendChild(title);

    var pitch = (project.pitch && project.pitch[lang]) || project.summary[lang];
    window.siteLang.addLine(main, "feature-text", pitch);

    var tags = tagList(project, dict);
    if (tags) main.appendChild(tags);
    li.appendChild(main);
    list.appendChild(li);
  });
}

function renderAllLists() {
  renderFeatured();
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

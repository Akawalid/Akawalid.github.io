function getProjectSlug() {
  var params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// same order as the home page: research entries first, then projects
function orderedProjects() {
  return window.projects.filter(function (p) { return p.type === "research"; })
    .concat(window.projects.filter(function (p) { return p.type === "project"; }));
}

// one block of the detail write-up: a paragraph string, or
// { h }, { code, caption }, { img, alt } or { table: { head, rows }, caption }
function renderBlock(block, container) {
  if (typeof block === "string") {
    container.appendChild(el("p", "", block));
  } else if (block.h) {
    container.appendChild(el("h3", "detail-heading", block.h));
  } else if (block.code) {
    var pre = el("pre", "detail-code");
    pre.appendChild(el("code", "", block.code));
    container.appendChild(pre);
    if (block.caption) container.appendChild(el("p", "detail-code-caption", block.caption));
  } else if (block.img) {
    var figure = el("figure", "detail-figure");
    var img = el("img");
    img.src = block.img;
    img.alt = block.alt || "";
    img.loading = "lazy";
    figure.appendChild(img);
    if (block.alt) figure.appendChild(el("figcaption", "", block.alt));
    container.appendChild(figure);
  } else if (block.table) {
    var wrap = el("div", "detail-table");
    var table = el("table");
    var headRow = el("tr");
    block.table.head.forEach(function (cell) { headRow.appendChild(el("th", "", cell)); });
    var thead = el("thead");
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = el("tbody");
    block.table.rows.forEach(function (row) {
      var tr = el("tr");
      row.forEach(function (cell) { tr.appendChild(el("td", "", cell)); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    container.appendChild(wrap);
    if (block.caption) container.appendChild(el("p", "detail-code-caption", block.caption));
  }
}

function renderProject() {
  var slug = getProjectSlug();
  var project = window.projects.find(function (p) {
    return p.slug === slug;
  });
  var container = document.getElementById("project-detail");
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();

  if (!project) {
    container.textContent = "";
    container.appendChild(el("p", "", dict.projectNotFound));
    return;
  }

  document.getElementById("page-title").textContent = project.title[lang];

  // "back" returns to the page this entry is listed on, which the top bar marks too
  var isResearch = project.type === "research";
  var listPage = isResearch ? "research.html" : "projects.html";
  var back = document.querySelector(".back-link");
  if (back) {
    back.href = listPage;
    back.textContent = "← " + (isResearch ? dict.navResearch : dict.navProjects);
  }
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    var on = a.getAttribute("href") === listPage;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });

  container.textContent = "";

  container.appendChild(el("h2", "", project.title[lang]));
  container.appendChild(el("p", "period", project.period[lang].replace(/ - /g, "–")));

  if (project.type === "research") {
    container.appendChild(el("p", "research-meta", project.lab[lang] + " - " + dict.supervisedBy + " " + project.supervisors));
  }

  if (project.tags && project.tags.length) {
    var tags = el("ul", "tag-list");
    project.tags.forEach(function (tag) { tags.appendChild(el("li", "", tag)); });
    container.appendChild(tags);
  }

  if (project.links && project.links.length) {
    var links = el("p", "project-links");
    project.links.forEach(function (link) {
      var a = el("a", "", (dict.linkLabels[link.label] || link.label) + " ↗");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      links.appendChild(a);
    });
    container.appendChild(links);
  }

  // same short text as the home-page list - kept identical on purpose
  var intro = el("div", "project-intro");
  project.description[lang].split("\n\n").forEach(function (para) {
    intro.appendChild(el("p", "", para));
  });
  container.appendChild(intro);

  if (project.demo && window.siteDemos && window.siteDemos[project.demo]) {
    var demo = el("div", "demo-section");
    demo.id = "demo";
    demo.appendChild(el("h3", "detail-heading", dict.demoTitle || window.i18n.fr.demoTitle));
    var demoBox = el("div", "demo-box");
    demo.appendChild(demoBox);
    container.appendChild(demo);
    window.siteDemos[project.demo].mount(demoBox);
  }

  // the richer write-up; entries written only in English and French show
  // the French text on the Kabyle page
  var details = project.details && (project.details[lang] || project.details.fr || project.details.en);
  if (details) {
    details.forEach(function (block) { if (block) renderBlock(block, container); });
  }

  if (project.images && project.images.length > 0) {
    var gallery = el("div", "gallery");
    project.images.forEach(function (image) {
      var img = el("img");
      img.src = typeof image === "string" ? image : image.src;
      img.alt = typeof image === "string" ? (project.title[lang] + " screenshot") : image.alt;
      gallery.appendChild(img);
    });
    container.appendChild(gallery);
  }

  // previous / next entry, in home-page order
  var all = orderedProjects();
  var index = all.indexOf(project);
  var pager = el("nav", "project-pager");
  [[all[index - 1], "prev", "← "], [all[index + 1], "next", ""]].forEach(function (item) {
    var target = item[0];
    if (!target) { pager.appendChild(el("span")); return; }
    var a = el("a", item[1], item[2] + target.title[lang] + (item[1] === "next" ? " →" : ""));
    a.href = "project.html?id=" + encodeURIComponent(target.slug);
    pager.appendChild(a);
  });
  container.appendChild(pager);

  if (window.renderMathInElement) {
    window.renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }
}

window.addEventListener("langchange", renderProject);
renderProject();

// a link to "#demo" lands on the demo once the page has been built
window.addEventListener("load", function () {
  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: "instant" });
});

function renderResearchList() {
  var list = document.getElementById("research-list");
  if (!list) return;
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();
  list.innerHTML = "";
  window.projects.filter(function (p) { return p.type === "research"; }).forEach(function (project) {
    var item = document.createElement("li");

    var titleP = document.createElement("p");
    titleP.className = "entry-title";
    var strong = document.createElement("strong");
    strong.textContent = project.title[lang];
    titleP.appendChild(strong);
    titleP.appendChild(document.createTextNode(" (" + project.period[lang] + ")"));
    item.appendChild(titleP);

    var bodyP = document.createElement("p");
    bodyP.className = "entry-body";
    bodyP.appendChild(document.createTextNode(project.description[lang] + " "));
    var link = document.createElement("a");
    link.href = "project.html?id=" + encodeURIComponent(project.slug);
    link.textContent = dict.moreDetails;
    bodyP.appendChild(link);
    item.appendChild(bodyP);

    list.appendChild(item);
  });
}

function renderProjectList() {
  var list = document.getElementById("project-list");
  if (!list) return;
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();
  list.innerHTML = "";
  window.projects.filter(function (p) { return p.type === "project"; }).forEach(function (project) {
    var item = document.createElement("li");

    var titleP = document.createElement("p");
    titleP.className = "entry-title";
    var strong = document.createElement("strong");
    strong.textContent = project.title[lang];
    titleP.appendChild(strong);
    titleP.appendChild(document.createTextNode(" (" + project.period[lang] + ")"));
    item.appendChild(titleP);

    var bodyP = document.createElement("p");
    bodyP.className = "entry-body";
    bodyP.appendChild(document.createTextNode(project.description[lang] + " "));
    var link = document.createElement("a");
    link.href = "project.html?id=" + encodeURIComponent(project.slug);
    link.textContent = dict.moreDetails;
    bodyP.appendChild(link);
    item.appendChild(bodyP);

    list.appendChild(item);
  });
}

function renderAllLists() {
  renderResearchList();
  renderProjectList();
}

window.addEventListener("langchange", renderAllLists);
renderAllLists();

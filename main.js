function renderProjectList() {
  var list = document.getElementById("project-list");
  window.projects.forEach(function (project) {
    var item = document.createElement("li");

    var link = document.createElement("a");
    link.href = "project.html?id=" + encodeURIComponent(project.slug);
    link.textContent = project.title;

    var period = document.createElement("span");
    period.className = "period";
    period.textContent = project.period;

    item.appendChild(link);
    item.appendChild(period);
    list.appendChild(item);
  });
}

renderProjectList();

function renderProjectGrid() {
  var grid = document.getElementById("project-grid");
  window.projects.forEach(function (project) {
    var card = document.createElement("a");
    card.className = "project-card";
    card.href = "project.html?id=" + encodeURIComponent(project.slug);

    var title = document.createElement("h3");
    title.textContent = project.title;

    var period = document.createElement("p");
    period.className = "period";
    period.textContent = project.period;

    var summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = project.summary;

    card.appendChild(title);
    card.appendChild(period);
    card.appendChild(summary);
    grid.appendChild(card);
  });
}

renderProjectGrid();

function getProjectSlug() {
  var params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderProject() {
  var slug = getProjectSlug();
  var project = window.projects.find(function (p) {
    return p.slug === slug;
  });
  var container = document.getElementById("project-detail");

  if (!project) {
    container.innerHTML = "<p>Project not found.</p>";
    return;
  }

  document.getElementById("page-title").textContent = project.title;

  var html = "";
  html += "<h2>" + project.title + "</h2>";
  html += "<p class=\"period\">" + project.period + "</p>";
  html += "<p>" + project.description + "</p>";

  if (project.links && project.links.length > 0) {
    html += "<div class=\"project-links\">";
    project.links.forEach(function (link) {
      html += "<a href=\"" + link.url + "\" target=\"_blank\" rel=\"noopener\">" + link.label + "</a>";
    });
    html += "</div>";
  }

  if (project.images && project.images.length > 0) {
    html += "<div class=\"gallery\">";
    project.images.forEach(function (src) {
      html += "<img src=\"" + src + "\" alt=\"" + project.title + " screenshot\">";
    });
    html += "</div>";
  } else {
    html += "<p class=\"no-images\">No images yet for this project.</p>";
  }

  container.innerHTML = html;
}

renderProject();

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
  var lang = window.siteLang.getLang();
  var dict = window.siteLang.t();

  if (!project) {
    container.textContent = "";
    var msg = document.createElement("p");
    msg.textContent = dict.projectNotFound;
    container.appendChild(msg);
    return;
  }

  document.getElementById("page-title").textContent = project.title[lang];

  container.textContent = "";

  var h2 = document.createElement("h2");
  h2.textContent = project.title[lang];
  container.appendChild(h2);

  var period = document.createElement("p");
  period.className = "period";
  period.textContent = project.period[lang];
  container.appendChild(period);

  if (project.type === "research") {
    var meta = document.createElement("p");
    meta.className = "research-meta";
    meta.textContent = project.lab[lang] + " - " + dict.supervisedBy + " " + project.supervisors;
    container.appendChild(meta);
  }

  // same short text as the home-page list - kept identical on purpose
  project.description[lang].split("\n\n").forEach(function (para) {
    var p = document.createElement("p");
    p.textContent = para;
    container.appendChild(p);
  });

  // optional richer write-up, detail-page only: an array of paragraph
  // strings and { img, alt } figures, interleaved in reading order
  var details = project.details && project.details[lang];
  if (details) {
    details.forEach(function (block) {
      if (typeof block === "string") {
        var p = document.createElement("p");
        p.textContent = block;
        container.appendChild(p);
      } else if (block && block.code) {
        var pre = document.createElement("pre");
        pre.className = "detail-code";
        var code = document.createElement("code");
        code.textContent = block.code;
        pre.appendChild(code);
        container.appendChild(pre);
        if (block.caption) {
          var codeCaption = document.createElement("p");
          codeCaption.className = "detail-code-caption";
          codeCaption.textContent = block.caption;
          container.appendChild(codeCaption);
        }
      } else if (block && block.img) {
        var figure = document.createElement("figure");
        figure.className = "detail-figure";
        var img = document.createElement("img");
        img.src = block.img;
        img.alt = block.alt || "";
        figure.appendChild(img);
        if (block.alt) {
          var figcaption = document.createElement("figcaption");
          figcaption.textContent = block.alt;
          figure.appendChild(figcaption);
        }
        container.appendChild(figure);
      }
    });
  }

  if (project.links && project.links.length > 0) {
    var linksDiv = document.createElement("div");
    linksDiv.className = "project-links";
    project.links.forEach(function (link) {
      var a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = dict.linkLabels[link.label] || link.label;
      linksDiv.appendChild(a);
    });
    container.appendChild(linksDiv);
  }

  if (project.images && project.images.length > 0) {
    var gallery = document.createElement("div");
    gallery.className = "gallery";
    project.images.forEach(function (image) {
      var img = document.createElement("img");
      img.src = typeof image === "string" ? image : image.src;
      img.alt = typeof image === "string" ? (project.title[lang] + " screenshot") : image.alt;
      gallery.appendChild(img);
    });
    container.appendChild(gallery);
  } else if (!details) {
    var noImages = document.createElement("p");
    noImages.className = "no-images";
    noImages.textContent = dict.noImages;
    container.appendChild(noImages);
  }

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

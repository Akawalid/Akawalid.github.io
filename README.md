# Oualid Chabane - Personal Site

A single-page profile with clickable project pages, built with plain HTML/CSS/JS (no build step, no framework).

## Structure

- `index.html` - the profile page (about, education, skills, project grid)
- `project.html` - a generic project page, filled in from `projects.js` based on the `?id=` in the URL
- `projects.js` - all project data (title, dates, description, links, images) in one place
- `style.css` - shared styling
- `main.js` - renders the project cards on the home page
- `project.js` - renders a single project's detail page
- `images/` - put project screenshots here

## Adding images to a project

1. Add your image files to `images/`, e.g. `images/diffusion-model-1.jpg`
2. In `projects.js`, find the matching project and fill its `images` array:

```
images: ["images/diffusion-model-1.jpg", "images/diffusion-model-2.jpg"]
```

## Deploying to GitHub Pages

1. Create a repository named `<your-username>.github.io` (for a profile-root site) or any name (for a project site)
2. Push these files to the repository's root (or to a `docs/` folder if you prefer)
3. In the repository settings, go to **Pages** and set the source to the branch/folder you pushed to
4. Your site will be live at `https://<your-username>.github.io/` (or `/<repo-name>/` for a project site)

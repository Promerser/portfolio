const params = new URLSearchParams(window.location.search);
const slug = params.get("project");
const rawProject = PROJECTS[slug] || PROJECTS.b2bright;

const project = {
  category: rawProject.category || "",
  year: rawProject.year || "",
  title: rawProject.title,
  description: rawProject.description || [],
  task: rawProject.task || "",
  solution: rawProject.solution || "",
  result: rawProject.result || "",
  figmaLink:
    rawProject.figmaLink && rawProject.figmaLink !== "#"
      ? rawProject.figmaLink
      : "",
  heroImage: rawProject.heroImage || {},
  images:
    rawProject.images && rawProject.images.length
      ? rawProject.images
      : [
          { src: "" },
          { src: "" },
          { src: "", full: true },
        ],
};

document.title = project.title;

const hasYear = Boolean(project.year);
document.getElementById("bc_category").textContent = project.category;
document.getElementById("bc_separator").style.display = hasYear ? "" : "none";
const bcYear = document.getElementById("bc_year");
bcYear.style.display = hasYear ? "" : "none";
bcYear.textContent = project.year;

document.getElementById("project_title").textContent = project.title;

const descEl = document.getElementById("project_desc");
project.description.forEach((text) => {
  const p = document.createElement("p");
  p.textContent = text;
  descEl.appendChild(p);
});

if (project.figmaLink) {
  const figmaLink = document.createElement("a");
  figmaLink.className = "project_figma_link";
  figmaLink.href = project.figmaLink;
  figmaLink.textContent = "ОТКРЫТЬ ПРОЕКТ В FIGMA";
  descEl.appendChild(figmaLink);
}

const infoFields = [
  ["info_task", project.task],
  ["info_solution", project.solution],
  ["info_result", project.result],
];

const infoWrap = document.getElementById("project_info");
let hasInfo = false;

function fillInfoRow(row, value) {
  let text = "";
  let items = [];

  if (Array.isArray(value)) {
    items = value;
  } else if (value && typeof value === "object") {
    text = value.text || "";
    items = value.items || [];
  } else {
    text = value || "";
  }

  const hasText = Boolean(text && text.trim());
  const listItems = items.filter((item) => item && item.trim());

  if (!hasText && !listItems.length) {
    row.remove();
    return;
  }

  const p = row.querySelector("p");
  let content = p;

  if (listItems.length) {
    const wrapper = document.createElement("div");
    wrapper.className = "project_info_content";
    row.replaceChild(wrapper, p);
    wrapper.appendChild(p);
    content = wrapper;
  }

  if (hasText) {
    p.textContent = text;
  } else {
    p.remove();
  }

  if (listItems.length) {
    const ul = document.createElement("ul");
    ul.className = "project_info_list";
    listItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }
}

infoFields.forEach(([id, value]) => {
  const row = document.getElementById(id);
  fillInfoRow(row, value);
  if (document.contains(row)) {
    hasInfo = true;
  }
});

if (!hasInfo) {
  infoWrap.classList.add("hidden");
}

function createImage(item, index) {
  if (item.src) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "";
    return img;
  }
  const ph = document.createElement("div");
  ph.className = "placeholder";
  ph.textContent =
    item.alt || `ИЗОБРАЖЕНИЕ ${String(index + 1).padStart(2, "0")}`;
  return ph;
}

document
  .getElementById("project_hero_image")
  .appendChild(createImage(project.heroImage, 0));

const gallery = document.getElementById("project_gallery");
project.images.forEach((item, index) => {
  const el = document.createElement("div");
  el.className = item.full ? "gallery_item full" : "gallery_item";
  el.appendChild(createImage(item, index));
  gallery.appendChild(el);
});

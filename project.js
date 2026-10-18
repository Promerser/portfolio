const params = new URLSearchParams(window.location.search);
const slug = params.get("project");
const rawProject = PROJECTS[slug] || PROJECTS.b2bright;

const rawImages =
  rawProject.images && rawProject.images.length
    ? rawProject.images
    : [{ src: "" }, { src: "" }, { src: "" }];

const galleryImages = rawImages.map((item) => ({ ...item }));

// Шаблоны галереи по количеству изображений (десктоп):
// 1  — на всю ширину, естественная высота
// 3  — 1, 2 по половине ширины, 600px; 3-е на всю ширину,
//       естественная высота
// 5  — 1, 2 (и 4, 5) по половине ширины, 550px; 3-е на всю ширину,
//       естественная высота (у delfanto — блок 1180px со скроллом)
// 7  — 1, 2 на всю ширину, естественная высота; 3, 4 по половине, 880px;
//       5, 6, 7 по трети, 580px
function galleryClass(index, count) {
  if (count === 1) {
    return "span-6 auto";
  }
  if (count === 3 || count === 5) {
    if (index === 2) {
      return slug === "delfanto" ? "span-6 h-1180" : "span-6 auto";
    }
    return count === 5 ? "span-3 h-550" : "span-3 h-600";
  }
  if (count === 7) {
    if (index <= 1) return "span-6 auto";
    if (index <= 3) return "span-3 h-880";
    return "span-2 h-580";
  }
  return "span-3 h-600";
}

const project = {
  category: rawProject.category || "",
  year: rawProject.year || "",
  title: rawProject.title,
  description: Array.isArray(rawProject.description)
    ? rawProject.description
    : [rawProject.description],
  task: rawProject.task || "",
  solution: rawProject.solution || "",
  result: rawProject.result || "",
  figmaLink:
    rawProject.figmaLink && rawProject.figmaLink !== "#"
      ? rawProject.figmaLink
      : "",
  heroImage: rawProject.heroImage || {},
  images: galleryImages,
};

document.title = project.title;

const hasYear = Boolean(project.year);
document.getElementById("bc_category").textContent = project.category;
document.getElementById("bc_separator").style.display = hasYear ? "" : "none";
const bcYear = document.getElementById("bc_year");
bcYear.style.display = hasYear ? "" : "none";
bcYear.textContent = project.year;

document.getElementById("project_back").addEventListener("click", (e) => {
  e.preventDefault();
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = "works.html";
  }
});

document.getElementById("project_title").textContent = project.title;

const descEl = document.getElementById("project_desc");
project.description
  .filter((text) => text && text.trim())
  .forEach((text) => {
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
  if (item.srcTablet || item.srcMobile) {
    const picture = document.createElement("picture");
    if (item.srcMobile) {
      const mobile = document.createElement("source");
      mobile.media = "(max-width: 767px)";
      mobile.srcset = item.srcMobile;
      picture.appendChild(mobile);
    }
    if (item.srcTablet) {
      const tablet = document.createElement("source");
      tablet.media = "(min-width: 768px) and (max-width: 1024px)";
      tablet.srcset = item.srcTablet;
      picture.appendChild(tablet);
    }
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "";
    picture.appendChild(img);
    return picture;
  }
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
const scrollSyncs = [];

function createScrollIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "scroll_indicator";
  const label = document.createElement("span");
  label.textContent = "SCROLL";
  const icon = document.createElement("img");
  icon.src = "content/icons/scroll_mouse.svg";
  icon.alt = "";
  indicator.appendChild(label);
  indicator.appendChild(icon);
  return indicator;
}

function syncRowHeights() {
  const items = Array.from(gallery.children);
  if (window.innerWidth <= 1024) {
    items.forEach((el) => (el.style.height = ""));
    return;
  }

  const byRow = new Map();
  items.forEach((el) => {
    const row = byRow.get(el.offsetTop) || [];
    row.push(el);
    byRow.set(el.offsetTop, row);
  });

  byRow.forEach((row) => {
    if (row.length < 2) {
      return;
    }
    // высота картинки, а не scrollHeight контейнера: тот не бывает меньше
    // уже выставленной высоты, и при уменьшении окна строка залипала
    const min = Math.min(
      ...row.map((el) => el.firstElementChild.firstElementChild.offsetHeight)
    );
    if (min === 0) {
      return;
    }
    row.forEach((el) => (el.style.height = min + "px"));
  });
}

project.images.forEach((item, index) => {
  const el = document.createElement("div");
  el.className = "gallery_item " + galleryClass(index, galleryImages.length);
  const scroller = document.createElement("div");
  scroller.className = "gallery_item_scroll";
  const content = createImage(item, index);
  scroller.appendChild(content);
  el.appendChild(scroller);
  gallery.appendChild(el);

  const syncIndicator = () => {
    syncRowHeights();
    const scrollable = el.scrollHeight > el.clientHeight;
    if (scrollable && !el.querySelector(".scroll_indicator")) {
      el.appendChild(createScrollIndicator());
    } else if (!scrollable) {
      const indicator = el.querySelector(".scroll_indicator");
      if (indicator) {
        indicator.remove();
      }
    }
  };

  const imgEl =
    content.tagName === "IMG" ? content : content.querySelector("img");
  if (imgEl) {
    if (imgEl.complete) {
      syncIndicator();
    } else {
      imgEl.addEventListener("load", syncIndicator);
    }
  } else {
    syncIndicator();
  }
  scrollSyncs.push(syncIndicator);
});

window.addEventListener("resize", () => {
  scrollSyncs.forEach((sync) => sync());
});

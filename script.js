const menuButton = document.getElementById("menu_button");
const menu = document.getElementById("menu");

menuButton.addEventListener("click", () => {
  menu.classList.toggle("open");
});

menu.querySelectorAll(".menu_left a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
  });
});

const themeButton = document.querySelector(".theme_button");
themeButton.classList.toggle(
  "moon",
  document.documentElement.classList.contains("light")
);
themeButton.addEventListener("click", () => {
  const light = document.documentElement.classList.toggle("light");
  themeButton.classList.toggle("moon", light);
  localStorage.setItem("theme", light ? "light" : "dark");
});

const scrollButton = document.querySelector(".scroll_button");
if (scrollButton) {
  scrollButton.addEventListener("click", () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  });
}

const filters = document.querySelector(".filters");
if (filters) {
  const cards = Array.from(document.querySelectorAll(".project_card"));

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) {
      return;
    }

    filters
      .querySelectorAll(".filter")
      .forEach((b) => b.classList.toggle("active", b === btn));

    const key = btn.dataset.filter;
    cards.forEach((card) => {
      card.style.display =
        key === "all" || card.dataset.category === key ? "" : "none";
    });
  });
}


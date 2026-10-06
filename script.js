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

const counter = document.querySelector(".second_other .counter span");
const cards = document.querySelectorAll(".second_other article");

if (counter) {
  let bestIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    let bestRatio = 0;

    entries.forEach((entry) => {
      if (entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        bestIndex = Array.from(cards).indexOf(entry.target);
      }
    });

    counter.textContent = String(bestIndex + 1).padStart(2, "0");
  }, { threshold: 0 });

  cards.forEach((card) => observer.observe(card));
}

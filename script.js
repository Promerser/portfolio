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
  let ticking = false;

  function updateCounter() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      let bestRatio = 0;
      cards.forEach((card, i) => {
        if (card.intersectionRatio > bestRatio) {
          bestRatio = card.intersectionRatio;
          bestIndex = i;
        }
      });
      counter.textContent = String(bestIndex + 1).padStart(2, "0");
      ticking = false;
    });
  }

  const observer = new IntersectionObserver(updateCounter, { threshold: [0.25, 0.5, 0.75, 1] });
  cards.forEach((card) => observer.observe(card));
}

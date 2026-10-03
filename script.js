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
themeButton.addEventListener("click", () => {
  themeButton.classList.toggle("moon");
});

const scrollButton = document.querySelector(".scroll_button");
scrollButton.addEventListener("click", () => {
  window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
});

const counter = document.querySelector(".second_other .counter span");
const cards = document.querySelectorAll(".second_other article");

function updateCounter() {
  const mid = window.innerHeight / 5;
  let index = 0;

  cards.forEach((card, i) => {
    if (card.getBoundingClientRect().top <= mid) {
      index = i;
    }
  });

  counter.textContent = String(index + 1).padStart(2, "0");
}

window.addEventListener("scroll", updateCounter);
window.addEventListener("resize", updateCounter);
updateCounter();

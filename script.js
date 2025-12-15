const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const darkBtn = document.getElementById("darkModeBtn");

function toggleActive() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

hamburger.addEventListener("click", toggleActive);
navLinks.forEach(link => link.addEventListener("click", closeMenu));
darkBtn.addEventListener("click", toggleDarkMode);

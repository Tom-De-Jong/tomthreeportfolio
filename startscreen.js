document.querySelector(".startScreen").addEventListener("click", () => {
  const screen = document.querySelector(".startScreen");
  screen.style.opacity = "0";
  screen.style.pointerEvents = "none";
  setTimeout(() => screen.style.display = "none", 2000);
});
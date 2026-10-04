
const nav = document.querySelector(".topbar nav");
const menuBtn = document.querySelector("#menuToggle");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const current = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".topbar nav a").forEach(a => {
  const href = a.getAttribute("href")?.split("/").pop();
  if (href === current) a.classList.add("active");
});

const loginView = document.querySelector("#login-view");
const appShell = document.querySelector("#app-shell");
const sidebar = document.querySelector("#sidebar");
const pageTitle = document.querySelector("#page-title");
const pageSubtitle = document.querySelector("#page-subtitle");
const modal = document.querySelector("#invoice-modal");
const toast = document.querySelector("#toast");

const screenCopy = {
  dashboard: ["Dashboard", "Sunday, 26 July 2026"],
  billing: ["Billing", "Invoices, payments and collections"],
  inventory: ["Inventory", "Products, stock and movements"],
  customers: ["Customers", "Relationships and balances"],
  reports: ["Reports", "Business performance and insights"],
  settings: ["Settings", "Configure your TigerOne workspace"],
};

function showScreen(name) {
  const target = document.querySelector(`#${name}`);
  if (!target) return;
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  document.querySelectorAll("[data-screen]").forEach((link) => link.classList.toggle("active", link.dataset.screen === name));
  target.classList.add("active");
  pageTitle.textContent = screenCopy[name][0];
  pageSubtitle.textContent = screenCopy[name][1];
  sidebar.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function enterPrototype() {
  loginView.hidden = true;
  appShell.hidden = false;
  showScreen(location.hash.slice(1) || "dashboard");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  location.hash = "dashboard";
  enterPrototype();
});

document.querySelector("#toggle-password").addEventListener("click", (event) => {
  const input = document.querySelector("#login-password");
  input.type = input.type === "password" ? "text" : "password";
  event.currentTarget.textContent = input.type === "password" ? "Show" : "Hide";
});

document.querySelectorAll("[data-screen]").forEach((link) => link.addEventListener("click", () => showScreen(link.dataset.screen)));
document.querySelectorAll("[data-screen-link]").forEach((button) => button.addEventListener("click", () => {
  location.hash = button.dataset.screenLink;
  showScreen(button.dataset.screenLink);
}));
document.querySelectorAll("[data-open='new-invoice']").forEach((button) => button.addEventListener("click", () => { modal.hidden = false; }));
document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => {
  if (button.closest(".modal")) modal.hidden = true;
  showToast(button.dataset.toast);
}));
document.querySelector("#close-modal").addEventListener("click", () => { modal.hidden = true; });
document.querySelector("#cancel-modal").addEventListener("click", () => { modal.hidden = true; });
modal.addEventListener("click", (event) => { if (event.target === modal) modal.hidden = true; });
document.querySelector("#menu-button").addEventListener("click", () => sidebar.classList.add("open"));
document.querySelector("#close-nav").addEventListener("click", () => sidebar.classList.remove("open"));
document.querySelector("#logout-button").addEventListener("click", () => {
  appShell.hidden = true;
  loginView.hidden = false;
  location.hash = "";
});
window.addEventListener("hashchange", () => {
  const screen = location.hash.slice(1);
  if (appShell.hidden === false && screenCopy[screen]) showScreen(screen);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.hidden = true;
    sidebar.classList.remove("open");
  }
});

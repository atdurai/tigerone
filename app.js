const loginView = document.querySelector("#login-view");
const appShell = document.querySelector("#app-shell");
const sidebar = document.querySelector("#sidebar");
const pageTitle = document.querySelector("#page-title");
const pageSubtitle = document.querySelector("#page-subtitle");
const modal = document.querySelector("#invoice-modal");
const toast = document.querySelector("#toast");

const screenCopy = {
  dashboard: ["Dashboard", "Sunday, 26 July 2026"],
  orders: ["Orders", "Jobs, production and billing"],
  "create-order": ["Create Order", "New printing job"],
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
const assistantButton = document.querySelector("#assistant-button");
const assistantInput = document.querySelector("#assistant-input");
if (assistantButton && assistantInput) {
  assistantButton.addEventListener("click", () => {
    showToast(assistantInput.value.trim() ? `Prototype question received: ${assistantInput.value.trim()}` : "Try asking about delayed orders, stock or payments");
    assistantInput.value = "";
  });
  assistantInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") assistantButton.click();
  });
}

const orderFields = {
  customer: document.querySelector("#order-customer"),
  product: document.querySelector("#product-type"),
  job: document.querySelector("#job-name"),
  width: document.querySelector("#job-width"),
  height: document.querySelector("#job-height"),
  quantity: document.querySelector("#job-quantity"),
  material: document.querySelector("#order-material"),
  rate: document.querySelector("#selling-rate"),
  finishing: document.querySelector("#finishing-charge"),
  design: document.querySelector("#design-charge"),
  discount: document.querySelector("#order-discount"),
  tax: document.querySelector("#order-tax"),
  advance: document.querySelector("#order-advance"),
  delivery: document.querySelector("#delivery-date"),
};

const moduleLabels = {
  material: "Material",
  design: "Design",
  "job-work": "Job work",
  inventory: "Inventory reduction",
  pricing: "Pricing",
};
const attachedModules = new Set(["material", "design", "pricing"]);

function syncOrderModules() {
  document.querySelectorAll("[data-order-module]").forEach((section) => {
    section.hidden = !attachedModules.has(section.dataset.orderModule);
  });
  document.querySelectorAll("[data-module-toggle]").forEach((button) => {
    const attached = attachedModules.has(button.dataset.moduleToggle);
    button.classList.toggle("attached", attached);
    button.querySelector("em").textContent = attached ? "Remove" : "+ Add";
  });
  document.querySelector("#attached-module-count").textContent = attachedModules.size;
  const summary = document.querySelector("#summary-modules");
  summary.innerHTML = [...attachedModules].map((module) => `<span data-summary-module="${module}">${moduleLabels[module]}</span>`).join("");
  updateOrderSummary();
}

const currency = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function updateOrderSummary() {
  const width = Math.max(0, Number(orderFields.width.value) || 0);
  const height = Math.max(0, Number(orderFields.height.value) || 0);
  const quantity = Math.max(1, Number(orderFields.quantity.value) || 1);
  const area = width * height * quantity;
  const stock = Number(orderFields.material.selectedOptions[0]?.dataset.stock || 0);
  const remaining = stock - area;
  const pricingEnabled = attachedModules.has("pricing");
  const printing = pricingEnabled ? area * (Number(orderFields.rate.value) || 0) : 0;
  const finishing = pricingEnabled && attachedModules.has("material") ? Number(orderFields.finishing.value) || 0 : 0;
  const design = pricingEnabled && attachedModules.has("design") ? Number(orderFields.design.value) || 0 : 0;
  const jobWork = pricingEnabled && attachedModules.has("job-work")
    ? [...document.querySelectorAll(".job-work-charge")].reduce((sum, input) => sum + (Number(input.value) || 0), 0)
    : 0;
  const discount = Number(orderFields.discount.value) || 0;
  const subtotal = Math.max(0, printing + finishing + design + jobWork - discount);
  const tax = subtotal * ((Number(orderFields.tax.value) || 0) / 100);
  const total = subtotal + tax;
  const advance = Math.min(total, Number(orderFields.advance.value) || 0);

  document.querySelector("#print-area").textContent = area.toFixed(area % 1 ? 1 : 0);
  document.querySelector("#material-required").textContent = area.toFixed(area % 1 ? 1 : 0);
  document.querySelector("#material-available").textContent = stock;
  document.querySelector("#material-remaining").textContent = remaining.toFixed(remaining % 1 ? 1 : 0);
  document.querySelector("#allocation-quantity").textContent = area.toFixed(area % 1 ? 1 : 0);
  const status = document.querySelector("#material-status");
  status.textContent = remaining >= 0 ? "Stock available" : `Short by ${Math.abs(remaining).toFixed(1)} sq. ft.`;
  status.className = remaining >= 0 ? "stock-ok" : "stock-short";

  document.querySelector("#summary-job").textContent = orderFields.job.value || "Untitled printing job";
  document.querySelector("#summary-customer").textContent = orderFields.customer.value || "No customer selected";
  document.querySelector("#summary-product").textContent = orderFields.product.value;
  document.querySelector("#summary-size").textContent = `${width} × ${height} ft`;
  document.querySelector("#summary-quantity").textContent = quantity;
  document.querySelector("#summary-area").textContent = area.toFixed(area % 1 ? 1 : 0);
  document.querySelector("#printing-total").textContent = currency(printing);
  document.querySelector("#finishing-total").textContent = currency(finishing);
  document.querySelector("#design-total").textContent = currency(design);
  document.querySelector("#job-work-total").textContent = currency(jobWork);
  document.querySelector("#discount-total").textContent = `− ${currency(discount)}`;
  document.querySelector("#tax-total").textContent = currency(tax);
  document.querySelector("#order-total").textContent = currency(total);
  document.querySelector("#advance-total").textContent = currency(advance);
  document.querySelector("#balance-total").textContent = currency(total - advance);

  const delivery = orderFields.delivery.value ? new Date(orderFields.delivery.value) : null;
  document.querySelector("#summary-delivery").textContent = delivery && !Number.isNaN(delivery.valueOf())
    ? delivery.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })
    : "Not scheduled";
}

Object.values(orderFields).forEach((field) => field.addEventListener("input", updateOrderSummary));
document.querySelectorAll("[data-module-toggle]").forEach((button) => button.addEventListener("click", () => {
  const module = button.dataset.moduleToggle;
  if (attachedModules.has(module)) attachedModules.delete(module);
  else attachedModules.add(module);
  syncOrderModules();
}));
document.querySelectorAll("[data-remove-module]").forEach((button) => button.addEventListener("click", () => {
  attachedModules.delete(button.dataset.removeModule);
  syncOrderModules();
  document.querySelector(".module-picker").scrollIntoView({ behavior: "smooth", block: "center" });
}));
document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => {
  const [width, height] = button.dataset.size.split("x");
  orderFields.width.value = width;
  orderFields.height.value = height;
  updateOrderSummary();
}));
document.querySelectorAll("#save-order, #summary-save").forEach((button) => button.addEventListener("click", () => {
  showToast("Draft order ORD-1037 created for prototype");
}));
document.querySelector("#clear-order").addEventListener("click", () => {
  document.querySelector("#order-form").reset();
  updateOrderSummary();
  showToast("Order form reset");
});
document.querySelector("#add-job-work").addEventListener("click", () => {
  document.querySelector("#job-work-list").insertAdjacentHTML("beforeend", `
    <div class="job-work-row">
      <label>Work type<select><option>Flex installation</option><option>Frame fitting</option><option>Site measurement</option><option>Transportation</option><option>Electrician work</option><option selected>Other manual work</option></select></label>
      <label>Assigned to<input placeholder="Person or team" /></label>
      <label>Estimated cost (₹)<input class="job-work-cost" type="number" min="0" value="0" /></label>
      <label>Charge customer (₹)<input class="job-work-charge" type="number" min="0" value="0" /></label>
      <button type="button" class="remove-row" aria-label="Remove job work">×</button>
    </div>`);
});
document.querySelector("#job-work-list").addEventListener("input", updateOrderSummary);
document.querySelector("#job-work-list").addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-row");
  if (!removeButton) return;
  removeButton.closest(".job-work-row").remove();
  updateOrderSummary();
});
syncOrderModules();

const orderSearch = document.querySelector("#order-search");
const orderStageFilter = document.querySelector("#order-stage-filter");
const orderBillingFilter = document.querySelector("#order-billing-filter");
let orderStatusFilter = "all";

function filterOrders() {
  const query = orderSearch.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll("[data-order-row]").forEach((row) => {
    const statusMatch = orderStatusFilter === "all" || row.dataset.status === orderStatusFilter;
    const stageMatch = orderStageFilter.value === "all" || row.dataset.stage === orderStageFilter.value;
    const billingMatch = orderBillingFilter.value === "all" || row.dataset.billing === orderBillingFilter.value;
    const searchMatch = !query || row.dataset.search.includes(query);
    const show = statusMatch && stageMatch && billingMatch && searchMatch;
    row.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector("#empty-orders").hidden = visible !== 0;
  document.querySelector("#order-result-count").textContent = `Showing ${visible} prototype order${visible === 1 ? "" : "s"}`;
}

document.querySelectorAll("[data-order-filter]").forEach((button) => button.addEventListener("click", () => {
  orderStatusFilter = button.dataset.orderFilter;
  document.querySelectorAll("[data-order-filter]").forEach((item) => item.classList.toggle("active", item === button));
  filterOrders();
}));
orderSearch.addEventListener("input", filterOrders);
orderStageFilter.addEventListener("change", filterOrders);
orderBillingFilter.addEventListener("change", filterOrders);
filterOrders();

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

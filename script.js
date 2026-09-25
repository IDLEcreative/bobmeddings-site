const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  const setMenuOpen = (isOpen) => {
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(!document.body.classList.contains("menu-open"));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

const currentFile = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  const linkFile = link.getAttribute("href").split("#")[0] || "index.html";
  if (linkFile === currentFile) {
    link.setAttribute("aria-current", "page");
  }
});

const FORM_ENDPOINT = "https://formsubmit.co/ajax/bobbimeds@gmail.com";

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    delete data._honey;
    data._subject = `Website: ${form.dataset.form}`;
    data._template = "table";
    data.page = document.title;
    if (button) button.disabled = true;
    if (status) status.textContent = "Sending…";
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== "true") throw new Error(result.message || "Send failed");
      if (status) status.textContent = "Thank you, your note is on its way to Bobbi.";
      form.reset();
    } catch (error) {
      if (status) status.textContent = "Sorry, that didn't send. Please email bobbimeds@gmail.com instead.";
    } finally {
      if (button) button.disabled = false;
    }
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-recipe-count-for]").forEach((node) => {
  const category = document.getElementById(node.dataset.recipeCountFor);
  const categoryName = category?.dataset.recipeCategory;
  const cards = category ? Array.from(category.querySelectorAll(".recipe-card")) : [];
  const count = categoryName
    ? cards.filter((card) => card.dataset.recipeCategory === categoryName).length
    : cards.length;
  const singular = node.dataset.countSingular || "recipe";
  const plural = node.dataset.countPlural || "recipes";
  node.textContent = count;
  node.setAttribute("aria-label", `${count} ${count === 1 ? singular : plural}`);
  if (category) {
    category.classList.toggle("has-recipes", count > 0);
    category.classList.toggle("is-empty", count === 0);
  }
});

const latestRecipe = document.querySelector("[data-latest-recipe][id]");
if (latestRecipe) {
  document.querySelectorAll("[data-latest-recipe-link]").forEach((link) => {
    link.setAttribute("href", `#${latestRecipe.id}`);
  });
}

const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("visible"));
}

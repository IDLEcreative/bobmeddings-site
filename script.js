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

const FORM_EMAIL = "bobbimeds@gmail.com";
const FIELD_LABELS = { name: "Name", email: "Email", subject: "About", message: "Message", artwork: "Artwork", interest: "Interested in" };

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (data.get("_honey")) return;
    const lines = [];
    for (const [key, value] of data) {
      if (key.startsWith("_") || !String(value).trim()) continue;
      lines.push(`${FIELD_LABELS[key] || key}: ${value}`);
    }
    const subject = `Website: ${data.get("subject") || form.dataset.form}`;
    const body = `${lines.join("\n")}\n\n(Sent from bobmeddings.co.uk)`;
    window.location.href = `mailto:${FORM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = `Your email app should open with your note ready. Just press send. If it doesn't, email ${FORM_EMAIL}.`;
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

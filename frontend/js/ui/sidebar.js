
(() => {
  "use strict";

  const body = document.body;
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const close = document.querySelector("[data-sidebar-close]");
  const backdrop = document.querySelector("[data-sidebar-backdrop]");

  const setOpen = (open) => {
    body.classList.toggle("sidebar-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  };

  toggle?.addEventListener("click", () => {
    setOpen(!body.classList.contains("sidebar-open"));
  });

  close?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) setOpen(false);
    });
  });
})();

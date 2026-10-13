
(() => {
  "use strict";

  const search = document.querySelector("[data-history-search]");
  const items = [...document.querySelectorAll("[data-history-item]")];
  const empty = document.querySelector("[data-history-empty]");
  const count = document.querySelector("[data-history-count]");

  const update = () => {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const title = item.dataset.title?.toLowerCase() || "";
      const match = !query || title.includes(query);
      item.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    if (count) count.textContent = `${visible} percakapan`;
    empty?.classList.toggle("is-visible", visible === 0);
  };

  search?.addEventListener("input", update);

  document.querySelectorAll("[data-history-menu-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const item = button.closest("[data-history-item]");
      const menu = item?.querySelector("[data-history-menu]");

      document.querySelectorAll(".history-item-menu.is-open").forEach((openMenu) => {
        if (openMenu !== menu) openMenu.classList.remove("is-open");
      });

      menu?.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".history-item-menu.is-open")
      .forEach((menu) => menu.classList.remove("is-open"));
  });

  document.querySelectorAll("[data-history-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const action = button.dataset.historyAction;
      const item = button.closest("[data-history-item]");

      if (action === "delete") {
        item?.remove();
        const index = items.indexOf(item);
        if (index !== -1) items.splice(index, 1);
        update();
      }

      item?.querySelector("[data-history-menu]")?.classList.remove("is-open");
    });
  });

  update();
})();

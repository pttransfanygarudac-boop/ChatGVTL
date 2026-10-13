(() => {
  "use strict";
  const grid = document.querySelector("[data-project-grid]");
  const search = document.querySelector("[data-project-search]");
  const empty = document.querySelector("[data-project-empty]");
  const count = document.querySelector("[data-project-count]");
  const modal = document.querySelector("[data-project-modal]");
  const nameInput = document.querySelector("[data-new-project-name]");

  const updateCount = () => {
    const visible = [...document.querySelectorAll("[data-project]")].filter((el) => !el.hidden).length;
    if (count) count.textContent = `${visible} project${visible === 1 ? "" : "s"}`;
    if (empty) empty.hidden = visible !== 0;
  };

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-project]").forEach((card) => {
      card.hidden = query && !card.dataset.name.toLowerCase().includes(query);
    });
    updateCount();
  });

  document.querySelector("[data-project-search-focus]")?.addEventListener("click", () => search?.focus());

  const closeMenus = (except) => document.querySelectorAll(".project-menu.is-open").forEach((menu) => {
    if (menu !== except) menu.classList.remove("is-open");
  });

  document.querySelectorAll("[data-project-menu-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const menu = button.nextElementSibling;
      const open = menu.classList.contains("is-open");
      closeMenus(menu);
      menu.classList.toggle("is-open", !open);
    });
  });
  document.addEventListener("click", () => closeMenus());

  document.querySelectorAll("[data-project-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const action = button.dataset.projectAction;
      const card = button.closest("[data-project]");
      closeMenus();
      if (!card) return;
      if (action === "delete" && confirm(`Hapus project “${card.dataset.name}”?`)) {
        card.remove();
        updateCount();
      } else if (action === "rename") {
        const next = prompt("Nama project baru:", card.dataset.name);
        if (next?.trim()) { card.dataset.name = next.trim(); card.querySelector("h3").textContent = next.trim(); }
      } else if (action === "open") {
        alert(`Membuka project “${card.dataset.name}”. Backend project akan dihubungkan pada tahap berikutnya.`);
      }
    });
  });

  const setModal = (open) => {
    modal?.classList.toggle("is-open", open);
    modal?.setAttribute("aria-hidden", String(!open));
    if (open) setTimeout(() => nameInput?.focus(), 80);
  };
  document.querySelector("[data-create-project]")?.addEventListener("click", () => setModal(true));
  modal?.querySelectorAll("[data-project-modal-close]").forEach((el) => el.addEventListener("click", () => setModal(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setModal(false); });

  document.querySelector("[data-create-submit]")?.addEventListener("click", () => {
    const name = nameInput?.value.trim();
    if (!name) { nameInput?.focus(); return; }
    const description = document.querySelector("[data-new-project-description]")?.value.trim() || "Project baru di ChatGVTL.";
    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.project = "";
    card.dataset.name = name;
    card.innerHTML = `<div class="project-card-top"><div class="project-mark blue">✦</div><button class="project-menu-trigger" type="button" data-project-menu-toggle aria-label="Opsi ${name}">⋮</button><div class="project-menu"><button type="button" data-project-action="open">↗ Buka project</button><button type="button" data-project-action="rename">✎ Rename</button><button type="button" data-project-action="archive">□ Arsipkan</button><button type="button" data-project-action="delete" class="danger">⌫ Hapus</button></div></div><h3>${name.replace(/[<>&]/g, "")}</h3><p>${description.replace(/[<>&]/g, "")}</p><div class="project-meta"><span>0 chat</span><span>0 file</span></div><div class="project-date">Dibuat sekarang</div>`;
    grid?.prepend(card);
    setModal(false);
    nameInput.value = "";
    document.querySelector("[data-new-project-description]").value = "";
    location.reload();
  });
  updateCount();
})();

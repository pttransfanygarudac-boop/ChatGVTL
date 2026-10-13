
(() => {
  "use strict";

  const input = document.querySelector("[data-chat-input]");
  const form = document.querySelector("[data-chat-form]");
  const fileInput = document.querySelector("[data-file-input]");
  const uploadList = document.querySelector("[data-upload-list]");
  const attachMenu = document.querySelector("[data-attach-menu]");
  const attachButton = document.querySelector("[data-attach-toggle]");

  const selectedFiles = [];

  const resize = () => {
    if (!input) return;
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  };

  const closeAttachMenu = () => {
    attachMenu?.classList.remove("is-open");
    attachButton?.setAttribute("aria-expanded", "false");
  };

  const renderFiles = () => {
    if (!uploadList) return;
    uploadList.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const chip = document.createElement("div");
      chip.className = "upload-chip";

      const name = document.createElement("span");
      name.className = "upload-chip-name";
      name.textContent = file.name;

      const remove = document.createElement("button");
      remove.className = "upload-chip-remove";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Hapus ${file.name}`);

      remove.addEventListener("click", () => {
        selectedFiles.splice(index, 1);
        renderFiles();
      });

      chip.append(name, remove);
      uploadList.appendChild(chip);
    });
  };

  const addFiles = (files) => {
    [...files].forEach((file) => {
      const duplicate = selectedFiles.some(
        (item) => item.name === file.name && item.size === file.size
      );
      if (!duplicate) selectedFiles.push(file);
    });

    renderFiles();
  };

  input?.addEventListener("input", resize);

  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form?.requestSubmit();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input?.value.trim();
    if (!value && selectedFiles.length === 0) return;

    // UI-only stage. The API/upload pipeline will be connected later.
    input.value = "";
    selectedFiles.length = 0;
    renderFiles();
    resize();
    input.focus();
  });

  document.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!input) return;
      input.value = button.dataset.suggestion || "";
      resize();
      input.focus();
    });
  });

  // + button / attachment menu.
  attachButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = attachMenu?.classList.toggle("is-open");
    attachButton.setAttribute("aria-expanded", String(Boolean(open)));
  });

  document.addEventListener("click", (event) => {
    if (
      attachMenu?.classList.contains("is-open") &&
      !attachMenu.contains(event.target) &&
      !attachButton?.contains(event.target)
    ) {
      closeAttachMenu();
    }
  });

  // File picker actions.
  document.querySelectorAll("[data-file-action]").forEach((button) => {
    button.addEventListener("click", () => {
      closeAttachMenu();
      fileInput?.click();
    });
  });

  fileInput?.addEventListener("change", () => {
    if (fileInput.files?.length) addFiles(fileInput.files);
    fileInput.value = "";
  });

  // Drag & drop on composer.
  const composerBox = document.querySelector(".composer-box");

  composerBox?.addEventListener("dragover", (event) => {
    event.preventDefault();
    composerBox.classList.add("is-dragging");
  });

  composerBox?.addEventListener("dragleave", () => {
    composerBox.classList.remove("is-dragging");
  });

  composerBox?.addEventListener("drop", (event) => {
    event.preventDefault();
    composerBox.classList.remove("is-dragging");
    if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files);
  });

  // Conversation/message action menu.
  const messageMenu = document.querySelector("[data-message-menu]");
  const messageMenuToggle = document.querySelector("[data-message-menu-toggle]");

  messageMenuToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    messageMenu?.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    if (
      messageMenu?.classList.contains("is-open") &&
      !messageMenu.contains(event.target) &&
      !messageMenuToggle?.contains(event.target)
    ) {
      messageMenu.classList.remove("is-open");
    }
  });
})();

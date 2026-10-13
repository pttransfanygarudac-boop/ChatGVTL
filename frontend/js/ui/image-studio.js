
(() => {
  "use strict";

  const prompt = document.querySelector("[data-studio-prompt]");
  const generate = document.querySelector("[data-studio-generate]");
  const upload = document.querySelector("[data-studio-upload]");
  const uploadName = document.querySelector("[data-studio-upload-name]");
  const status = document.querySelector("[data-studio-status]");
  const modeInput = document.querySelector("[data-studio-mode-input]");
  const previewMode = document.querySelector("[data-preview-mode]");
  const previewSize = document.querySelector("[data-preview-size]");

  document.querySelectorAll("[data-studio-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-studio-mode]").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll("[data-studio-panel]").forEach((panel) => panel.classList.remove("is-active"));

      button.classList.add("is-active");
      const mode = button.dataset.studioMode;
      document.querySelector(`[data-studio-panel="${mode}"]`)?.classList.add("is-active");

      if (modeInput) modeInput.value = mode;
      if (previewMode) previewMode.textContent = mode.toUpperCase();

      if (status) {
        status.textContent =
          mode === "generate" ? "Generate — buat gambar baru dari prompt." :
          mode === "edit" ? "Edit — ubah gambar dengan instruksi baru." :
          "Enhancement — tingkatkan kualitas, detail, dan resolusi gambar.";
      }
    });
  });

  upload?.addEventListener("change", () => {
    const file = upload.files?.[0];
    if (!file) return;
    if (uploadName) uploadName.textContent = file.name;
    if (status) status.textContent = "Gambar referensi berhasil dipilih.";
  });

  document.querySelectorAll("[data-size-select]").forEach((select) => {
    select.addEventListener("change", () => {
      if (previewSize) previewSize.textContent = select.value;
    });
  });

  generate?.addEventListener("click", () => {
    const mode = modeInput?.value || "generate";
    const activePanel = document.querySelector(`[data-studio-panel="${mode}"]`);
    const activePrompt = activePanel?.querySelector("textarea") || prompt;
    const value = activePrompt?.value.trim();

    if (!value && mode !== "enhance") {
      if (status) status.textContent = "Tulis prompt terlebih dahulu.";
      activePrompt?.focus();
      return;
    }

    generate.disabled = true;
    if (status) {
      status.textContent =
        mode === "generate" ? "Menyiapkan generation request…" :
        mode === "edit" ? "Menyiapkan edit request…" :
        "Menyiapkan enhancement request…";
    }

    window.setTimeout(() => {
      generate.disabled = false;
      if (status) status.textContent = "UI siap. Image engine/backend akan disambungkan pada tahap berikutnya.";
    }, 900);
  });
})();

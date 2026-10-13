(() => {
  "use strict";
  const saveButton = document.querySelector("[data-profile-save]");
  const state = document.querySelector("[data-profile-state]");
  saveButton?.addEventListener("click", () => {
    if (!state) return;
    state.textContent = "Tersimpan ✓";
    window.setTimeout(() => { state.textContent = ""; }, 2200);
  });

  const avatarButton = document.querySelector("[data-avatar-button]");
  const avatarInput = document.querySelector("[data-avatar-input]");
  const avatars = document.querySelectorAll(".profile-avatar-large, .account-avatar");
  avatarButton?.addEventListener("click", () => avatarInput?.click());
  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    avatars.forEach((avatar) => {
      avatar.style.backgroundImage = `url("${url}")`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
      avatar.textContent = "";
    });
  });
})();

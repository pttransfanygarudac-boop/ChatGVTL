
(() => {
  "use strict";

  const loader = document.getElementById("app-loader");
  const status = document.getElementById("loader-status");

  if (!loader) return;

  const messages = [
    "Initializing workspace…",
    "Connecting to RENAI GVTL…",
    "Preparing ChatGVTL…"
  ];

  let index = 0;
  let statusTimer = null;

  if (status) {
    statusTimer = window.setInterval(() => {
      index = (index + 1) % messages.length;
      status.textContent = messages[index];
    }, 500);
  }

  const hide = () => {
    if (statusTimer) window.clearInterval(statusTimer);
    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 650);
  };

  window.addEventListener("load", () => {
    window.setTimeout(hide, 700);
  }, { once: true });
})();

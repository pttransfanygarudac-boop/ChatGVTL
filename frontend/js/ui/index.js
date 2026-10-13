
(() => {
  "use strict";

  document.querySelectorAll("[data-action='start-chat']").forEach((element) => {
    element.addEventListener("click", () => {
      element.setAttribute("aria-busy", "true");
    });
  });
})();

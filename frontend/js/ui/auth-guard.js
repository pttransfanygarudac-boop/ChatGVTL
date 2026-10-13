(() => {
  "use strict";
  const token = localStorage.getItem("chatgvtl_token");
  const page = location.pathname.split("/").pop() || "index.html";
  const publicPages = new Set(["index.html", "login.html", "register.html", "forgot-password.html", "verify-email.html", "legal.html"]);
  if (publicPages.has(page)) return;
  if (!token) {
    location.replace("login.html?returnTo=" + encodeURIComponent(page + location.search));
    return;
  }
  const api = window.ChatGVTL?.api;
  if (!api) return;
  api.request("/me").then(result => {
    if (result?.user) localStorage.setItem("chatgvtl_user", JSON.stringify(result.user));
  }).catch(error => {
    if (error.status === 401) {
      localStorage.removeItem("chatgvtl_token");
      localStorage.removeItem("chatgvtl_session");
      localStorage.removeItem("chatgvtl_user");
      location.replace("login.html?returnTo=" + encodeURIComponent(page + location.search));
    }
  });
})();

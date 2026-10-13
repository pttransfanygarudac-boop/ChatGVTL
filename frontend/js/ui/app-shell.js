
(() => {
  "use strict";

  const body = document.body;

  // Sidebar / drawer
  const sidebarToggles = document.querySelectorAll("[data-sidebar-toggle]");
  const backdrop = document.querySelector("[data-sidebar-backdrop]");

  const setSidebar = (open) => {
    body.classList.toggle("sidebar-open", open);
    sidebarToggles.forEach((button) => {
      button.setAttribute("aria-expanded", String(open));
    });
  };

  sidebarToggles.forEach((button) => {
    button.addEventListener("click", () => {
      setSidebar(!body.classList.contains("sidebar-open"));
    });
  });

  backdrop?.addEventListener("click", () => setSidebar(false));

  // Account menu
  const accountButton = document.querySelector("[data-account-toggle]");
  const accountMenu = document.querySelector("[data-account-menu]");

  const setAccount = (open) => {
    accountMenu?.classList.toggle("is-open", open);
    accountButton?.setAttribute("aria-expanded", String(open));
  };

  accountButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setAccount(!accountMenu?.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (accountMenu?.classList.contains("is-open") &&
        !accountMenu.contains(event.target) &&
        !accountButton?.contains(event.target)) {
      setAccount(false);
    }
  });

  // Conversation actions menu (the right-side menu in the chat header).
  const conversationButton = document.querySelector("[data-conversation-toggle]");
  const conversationMenu = document.querySelector("[data-conversation-menu]");

  const setConversationMenu = (open) => {
    conversationMenu?.classList.toggle("is-open", open);
    conversationButton?.setAttribute("aria-expanded", String(open));
  };

  conversationButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setConversationMenu(!conversationMenu?.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (
      conversationMenu?.classList.contains("is-open") &&
      !conversationMenu.contains(event.target) &&
      !conversationButton?.contains(event.target)
    ) {
      setConversationMenu(false);
    }
  });

  conversationMenu?.querySelectorAll("[data-conversation-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.conversationAction;

      // UI stage: actions are wired now; backend behavior will be connected later.
      if (action === "search") {
        setConversationMenu(false);
        document.querySelector("[data-search-open]")?.click();
        return;
      }

      setConversationMenu(false);
    });
  });

  // Search panel
  const searchPanel = document.querySelector("[data-search-panel]");
  const searchInput = document.querySelector("[data-search-input]");

  const setSearch = (open) => {
    searchPanel?.classList.toggle("is-open", open);
    if (open) {
      window.setTimeout(() => searchInput?.focus(), 50);
    }
  };

  document.querySelectorAll("[data-search-open]").forEach((button) => {
    button.addEventListener("click", () => setSearch(true));
  });

  document.querySelector("[data-search-close]")?.addEventListener("click", () => setSearch(false));

  searchPanel?.addEventListener("click", (event) => {
    if (event.target === searchPanel) setSearch(false);
  });

  // Close transient UI with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setSidebar(false);
    setAccount(false);
    setSearch(false);
    setConversationMenu(false);
  });

  // Global account logout: every visible "Keluar" action returns to login.
  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-logout]");
    if (!logout) return;
    event.preventDefault();
    localStorage.removeItem("chatgvtl_session");
    localStorage.removeItem("chatgvtl_token");
    localStorage.removeItem("chatgvtl_user");
    window.location.href = "login.html";
  });

  // Page transition for internal navigation.
  const transition = document.querySelector("[data-page-transition]");

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") ||
          href.startsWith("tel:") || link.target === "_blank" ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      setSidebar(false);
      setAccount(false);

      if (!transition) {
        window.location.href = url.href;
        return;
      }

      transition.classList.add("is-active");
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 180);
    });
  });
})();

(() => {
  "use strict";

  const status = document.querySelector("[data-auth-status]");
  const show = (message, type = "") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
  };
  const api = window.ChatGVTL?.api;

  const saveSession = (result) => {
    localStorage.setItem("chatgvtl_token", result.token);
    localStorage.setItem("chatgvtl_session", "active");
    localStorage.setItem("chatgvtl_user", JSON.stringify(result.user));
  };

  const returnTo = new URLSearchParams(location.search).get("returnTo");
  const safeReturnTo = returnTo && !returnTo.includes("://") && !returnTo.startsWith("/") ? returnTo : "chat.html";

  // Provider buttons are deliberately not faked as successful authentication.
  // They will use real OAuth credentials once configured on the backend.
  document.querySelectorAll("[data-provider]").forEach((button) => {
    button.addEventListener("click", async () => {
      const provider = button.dataset.provider || "Provider";
      if (["Google", "Facebook", "Apple", "Microsoft"].includes(provider)) {
        show(`${provider} belum dikonfigurasi. Hubungkan OAuth provider di backend untuk mengaktifkannya.`, "info");
        return;
      }
      if (provider === "Passkey") {
        if (!window.PublicKeyCredential) {
          show("Passkey tidak didukung di browser ini.", "error");
          return;
        }
        show("Passkey tersedia setelah credential akun didaftarkan.", "info");
        return;
      }
      if (provider === "Email code") {
        show("Masuk dengan kode email akan menggunakan endpoint kode sekali pakai setelah email dimasukkan.", "info");
      }
    });
  });

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".password-field")?.querySelector("input");
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.textContent = visible ? "Lihat" : "Sembunyikan";
      button.setAttribute("aria-label", visible ? "Tampilkan password" : "Sembunyikan password");
    });
  });

  document.querySelectorAll("[data-auth-method]").forEach((button) => {
    button.addEventListener("click", () => {
      const method = button.dataset.authMethod;
      document.querySelectorAll("[data-auth-method]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-method-panel]").forEach((panel) => {
        const active = panel.dataset.methodPanel === method;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      show("");
    });
  });

  document.querySelector("[data-login-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const active = form.querySelector("[data-method-panel].is-active");
    const method = active?.dataset.methodPanel || "email";

    if (method === "phone") {
      const phone = form.elements.phone?.value.trim();
      if (!phone) return show("Masukkan nomor telepon terlebih dahulu.", "error");
      try {
        show("Meminta kode OTP…");
        const result = await api.request("/auth/phone/request", { method: "POST", body: JSON.stringify({ phone }) });
        if (result.devCode) {
          show(`Kode OTP pengembangan: ${result.devCode}`, "info");
          localStorage.setItem("chatgvtl_pending_phone", phone);
        } else {
          show("Kode OTP telah dikirim. Masukkan kode untuk melanjutkan.", "success");
        }
      } catch (error) {
        show(error.message || "Gagal meminta kode OTP.", "error");
      }
      return;
    }

    const email = form.elements.email?.value.trim().toLowerCase();
    const password = form.elements.password?.value || "";
    if (!email || !password) return show("Email dan password wajib diisi.", "error");

    try {
      if (!api) throw new Error("API client tidak tersedia. Jalankan ChatGVTL Backend terlebih dahulu.");
      show("Memverifikasi akun…");
      const result = await api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember: Boolean(form.elements.remember?.checked) })
      });
      saveSession(result);
      show("Login berhasil. Membuka ChatGVTL…", "success");
      window.setTimeout(() => { location.href = safeReturnTo; }, 180);
    } catch (error) {
      const message = error.status === 401 ? "Email atau password salah." : error.code === 'BACKEND_UNREACHABLE' ? error.message : (error.message || "Login gagal.");
      show(message, "error");
    }
  });

  document.querySelector("[data-register-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.displayName?.value.trim();
    const email = form.elements.email?.value.trim();
    const phone = form.elements.phone?.value.trim();
    const pass = form.elements.password?.value || "";
    const confirm = form.elements.confirmPassword?.value || "";
    if (!name || !email || pass.length < 8 || pass !== confirm || !form.elements.terms?.checked) {
      return show(pass.length < 8 ? "Password minimal 8 karakter." : pass !== confirm ? "Konfirmasi password tidak sama." : !form.elements.terms?.checked ? "Setujui syarat dan kebijakan terlebih dahulu." : "Lengkapi data akun terlebih dahulu.", "error");
    }
    try {
      if (!api) throw new Error("API client tidak tersedia. Jalankan ChatGVTL Backend terlebih dahulu.");
      show("Membuat akun…");
      const result = await api.request("/auth/register", { method: "POST", body: JSON.stringify({ displayName: name, email, password: pass, phone }) });
      localStorage.setItem("chatgvtl_pending_verification", result.verificationToken);
      location.href = `verify-email.html?token=${encodeURIComponent(result.verificationToken)}`;
    } catch (error) {
      show(error.status === 409 ? "Email sudah terdaftar. Silakan masuk." : (error.message || "Pendaftaran gagal."), "error");
    }
  });
})();

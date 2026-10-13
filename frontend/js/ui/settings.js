(() => {
  "use strict";

  const modal = document.querySelector("[data-settings-modal]");
  const title = document.querySelector("#settings-modal-title");
  const text = document.querySelector("[data-settings-modal-text]");
  const options = document.querySelector("[data-settings-options]");
  const closeButton = document.querySelector("[data-settings-close]");

  const data = {
    personalization: ["Personalisasi", "Atur gaya respons, bahasa, dan preferensi pengalaman ChatGVTL.", ["Gaya respons", "Bahasa", "Preferensi AI"]],
    memory: ["Memori", "Kelola bagaimana ChatGVTL menggunakan konteks dan preferensi yang tersimpan.", ["Aktif", "Tinjau memori", "Preferensi memori"]],
    plugins: ["Plugins", "Kelola integrasi yang terhubung dengan workspace.", ["Plugin terhubung", "Izin akses", "Tambahkan integrasi"]],
    workspace: ["Workspace", "Workspace aktif kamu adalah RENAI GVTL.", ["Pribadi", "RENAI GVTL"]],
    upgrade: ["Upgrade ke Pro", "Bandingkan paket dan kemampuan yang tersedia.", ["Lihat paket Pro", "Bandingkan fitur"]],
    usage: ["Penggunaan dan batasan", "Pantau penggunaan fitur dan batas akun.", ["Penggunaan hari ini", "Batas Chat", "Batas Image Generator"]],
    trusted: ["Kontak tepercaya", "Kelola opsi pemulihan dan kontak tepercaya.", ["Tambah kontak", "Kelola kontak"]],
    parental: ["Pengawasan orang tua", "Kelola kontrol keluarga jika fitur ini diaktifkan.", ["Pengaturan kontrol", "Status pengawasan"]],
    email: ["Email", "Alamat email yang terhubung ke akun ChatGVTL.", ["redian@renaigvtl.id", "Ubah email"]],
    general: ["Umum", "Preferensi umum untuk aplikasi ChatGVTL.", ["Bahasa Indonesia", "Mulai percakapan baru", "Konfirmasi tindakan"]],
    notifications: ["Notifikasi", "Atur pemberitahuan dari ChatGVTL.", ["Notifikasi aplikasi", "Email", "Aktivitas workspace"]],
    sound: ["Suara", "Atur suara dan interaksi voice.", ["Efek suara", "Voice", "Volume"]],
    security: ["Keamanan", "Periksa perlindungan akun dan sesi.", ["Status keamanan", "Perangkat aktif", "Sesi"]],
    login: ["Keamanan dan masuk", "Kelola autentikasi dan metode masuk.", ["Password", "Autentikasi", "Sesi aktif"]],
    remote: ["Kontrol jarak jauh", "Kelola perangkat dan sesi yang terhubung.", ["Perangkat", "Cabut sesi", "Kontrol akses"]],
    storage: ["Penyimpanan", "Kelola ruang untuk file dan data workspace.", ["Penggunaan penyimpanan", "Kelola file", "Bersihkan data"]],
    data: ["Kontrol data", "Kelola privasi, ekspor, dan penggunaan data.", ["Ekspor data", "Privasi", "Penggunaan data"]],
    bug: ["Laporkan bug", "Kirim laporan masalah agar dapat ditindaklanjuti.", ["Laporkan masalah", "Kirim masukan"]],
    about: ["Tentang", "Informasi versi dan identitas ChatGVTL.", ["ChatGVTL", "RENAI GVTL Indonesia", "Versi aplikasi"]]
  };

  const openModal = (key) => {
    const item = data[key];
    if (!item || !modal) return;
    title.textContent = item[0];
    text.textContent = item[1];
    options.innerHTML = item[2].map((label, index) => `<button class="settings-option ${index === 0 ? "is-selected" : ""}" type="button"><span>${label}</span><small>${index === 0 ? "Aktif" : "›"}</small></button>`).join("");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll("[data-setting]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.setting));
  });

  const selectData = {
    appearance: { title: "Tampilan", text: "Pilih tema aplikasi.", values: ["Sistem (Default)", "Terang", "Gelap"], target: "[data-appearance-value]" },
    accent: { title: "Warna aksen", text: "Pilih warna utama antarmuka ChatGVTL.", values: ["Biru", "Cyan", "Ungu", "Hijau"], target: "[data-accent-value]" }
  };

  document.querySelectorAll("[data-setting-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.settingSelect;
      const item = selectData[key];
      if (!item) return;
      title.textContent = item.title;
      text.textContent = item.text;
      options.innerHTML = item.values.map((value, index) => `<button class="settings-option ${index === 0 ? "is-selected" : ""}" type="button" data-select-value="${value}"><span>${value}</span><small>${index === 0 ? "✓" : ""}</small></button>`).join("");
      options.querySelectorAll("[data-select-value]").forEach((option) => option.addEventListener("click", () => {
        document.querySelector(item.target).textContent = option.dataset.selectValue;
        options.querySelectorAll(".settings-option").forEach((el) => el.classList.remove("is-selected"));
        option.classList.add("is-selected");
        options.querySelectorAll(".settings-option small").forEach((el) => el.textContent = "");
        option.querySelector("small").textContent = "✓";
      }));
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

})();

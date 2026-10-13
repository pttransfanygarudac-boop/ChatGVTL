(() => {
  const input = document.querySelector('[data-file-input]');
  const trigger = document.querySelector('[data-upload-trigger]');
  const dropzone = document.querySelector('[data-dropzone]');
  const search = document.querySelector('[data-file-search]');
  const grid = document.querySelector('[data-files-grid]');
  const empty = document.querySelector('[data-empty]');
  const count = document.querySelector('[data-file-count]');
  if (!grid) return;

  let activeFilter = 'all';

  const items = () => [...grid.querySelectorAll('[data-file-item]')];
  const refresh = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    items().forEach(item => {
      const matchName = item.dataset.name.toLowerCase().includes(q);
      const matchType = activeFilter === 'all' || item.dataset.type === activeFilter;
      const show = matchName && matchType;
      item.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = `${visible} file${visible === 1 ? '' : ''}`;
  };

  trigger?.addEventListener('click', () => input?.click());
  input?.addEventListener('change', e => {
    [...e.target.files].forEach(file => addFile(file));
    e.target.value = '';
  });

  function addFile(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const type = ['jpg','jpeg','png','webp'].includes(ext) ? 'image' : ['csv','json'].includes(ext) ? 'data' : 'document';
    const label = ext.toUpperCase().slice(0,4);
    const card = document.createElement('article');
    card.className = 'file-card'; card.dataset.fileItem=''; card.dataset.type=type; card.dataset.name=file.name;
    card.innerHTML = `<div class="file-card-top"><div class="file-type ${type}">${label}</div><button class="file-menu-trigger" type="button" data-menu-toggle aria-label="Opsi file">⋮</button><div class="file-menu"><button type="button" data-action="open">↗ Buka</button><button type="button" data-action="download">↓ Download</button><button type="button" data-action="rename">✎ Rename</button><button type="button" data-action="delete" class="danger">⌫ Hapus</button></div></div><div class="file-name"></div><div class="file-meta"></div>`;
    card.querySelector('.file-name').textContent = file.name;
    card.querySelector('.file-meta').textContent = `${formatSize(file.size)} · Baru saja`;
    grid.prepend(card); bindCard(card); refresh();
  }
  function formatSize(bytes){ if(bytes < 1024) return `${bytes} B`; if(bytes < 1048576) return `${(bytes/1024).toFixed(0)} KB`; return `${(bytes/1048576).toFixed(1)} MB`; }

  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); activeFilter=btn.dataset.filter; refresh();
  }));
  document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); grid.classList.toggle('is-list', btn.dataset.view === 'list');
  }));
  search?.addEventListener('input', refresh);
  document.querySelector('[data-search-focus]')?.addEventListener('click', () => search?.focus());

  function bindCard(card){
    card.querySelector('[data-menu-toggle]')?.addEventListener('click', e => { e.stopPropagation(); document.querySelectorAll('.file-card.menu-open').forEach(x=>x!==card&&x.classList.remove('menu-open')); card.classList.toggle('menu-open'); });
    card.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => {
      const action=btn.dataset.action;
      if(action==='delete'){ card.remove(); refresh(); return; }
      if(action==='rename'){ const next=prompt('Nama file baru:', card.dataset.name); if(next?.trim()){card.dataset.name=next.trim(); card.querySelector('.file-name').textContent=next.trim();} }
      if(action==='open') alert(`Membuka ${card.dataset.name}`);
      if(action==='download') alert(`Download ${card.dataset.name} akan tersedia saat backend terhubung.`);
      card.classList.remove('menu-open');
    }));
  }
  items().forEach(bindCard);
  document.addEventListener('click', () => document.querySelectorAll('.file-card.menu-open').forEach(x=>x.classList.remove('menu-open')));
  ['dragenter','dragover'].forEach(type => dropzone?.addEventListener(type, e => {e.preventDefault(); dropzone.classList.add('is-dragging');}));
  ['dragleave','drop'].forEach(type => dropzone?.addEventListener(type, e => {e.preventDefault(); dropzone.classList.remove('is-dragging');}));
  dropzone?.addEventListener('drop', e => [...e.dataTransfer.files].forEach(addFile));
  refresh();
})();

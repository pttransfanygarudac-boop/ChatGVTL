(()=>{
  const api=window.ChatGVTL?.api; const box=document.querySelector('[data-billing-list]'); const status=document.querySelector('[data-billing-status]');
  if(!api||!box)return;
  (async()=>{try{const data=await api.request('/payments'); if(!data.payments.length){box.innerHTML='<div class="detail-row"><div class="detail-copy"><h2>Belum ada transaksi</h2><p>Riwayat pembayaran akan muncul setelah transaksi pertama.</p></div></div>';return;} box.innerHTML=data.payments.map(p=>`<div class="detail-row"><div class="detail-copy"><h2>${p.orderId}</h2><p>${p.provider} · ${new Intl.NumberFormat('id-ID',{style:'currency',currency:p.currency}).format(p.amount)}</p></div><div class="detail-control"><span class="detail-status">${p.status}</span></div></div>`).join('');}catch(e){if(status)status.textContent=e.message||'Gagal memuat pembayaran.';}})();
})();

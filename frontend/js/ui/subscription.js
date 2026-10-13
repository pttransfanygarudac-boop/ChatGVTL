(()=>{
  const api=window.ChatGVTL?.api;
  const status=document.querySelector('[data-subscription-status]');
  const current=document.querySelector('[data-current-plan]');
  const expires=document.querySelector('[data-plan-expires]');
  const show=m=>{if(status)status.textContent=m};
  const money=(n,c='IDR')=>new Intl.NumberFormat('id-ID',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
  async function load(){
    if(!api)return;
    try{
      const data=await api.request('/subscription');
      const plan=data.plans.find(p=>p.id===data.plan)||data.plans[0];
      if(current) current.textContent=plan.name;
      if(expires) expires.textContent=data.subscription?.expiresAt?`Aktif sampai ${new Date(data.subscription.expiresAt).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})}`:'Tidak ada tanggal kedaluwarsa';
      document.querySelectorAll('[data-plan-card]').forEach(card=>{
        const id=card.dataset.planCard; const p=data.plans.find(x=>x.id===id); if(!p)return;
        const price=card.querySelector('[data-plan-price]'); if(price)price.textContent=p.price?`${money(p.price,p.currency)} / bulan`:'Gratis';
        const btn=card.querySelector('[data-plan-buy]'); if(btn){btn.disabled=id===data.plan; btn.textContent=id===data.plan?'Sedang digunakan':id==='pro'?'Upgrade ke Pro':'Pilih paket';}
      });
    }catch(e){show(e.message||'Gagal memuat langganan.');}
  }
  document.querySelectorAll('[data-plan-buy]').forEach(btn=>btn.addEventListener('click',async()=>{
    const planId=btn.closest('[data-plan-card]')?.dataset.planCard;
    if(planId!=='pro'){show('Paket ini belum memerlukan checkout.');return;}
    if(!localStorage.getItem('chatgvtl_token')){location.href='login.html';return;}
    try{
      btn.disabled=true; show('Menyiapkan checkout Pro…');
      const data=await api.request('/payments/checkout',{method:'POST',body:JSON.stringify({planId:'pro',amount:149000,country:localStorage.getItem('chatgvtl_country')||'ID'})});
      if(data.checkoutUrl) location.href=data.checkoutUrl; else location.href=`payment-result.html?order=${encodeURIComponent(data.orderId)}`;
    }catch(e){btn.disabled=false;show(e.message||'Checkout gagal dibuat.');}
  }));
  load();
})();

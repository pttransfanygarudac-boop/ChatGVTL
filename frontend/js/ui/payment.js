(()=>{
  const api = window.ChatGVTL?.api;
  const status = document.querySelector('[data-payment-status]');
  const show = m => { if(status) status.textContent = m; };
  const countrySelect = document.querySelector('[data-country]');
  const methodSelect = document.querySelector('[data-payment-method]');
  const providerSelect = document.querySelector('[data-payment-provider]');
  const amountInput = document.querySelector('[data-payment-amount]');
  const methodHint = document.querySelector('[data-method-hint]');

  async function loadCountries(){
    if(!api || !countrySelect) return;
    try{
      const data=await api.request('/payments/countries');
      if(Array.isArray(data.countries) && data.countries.length){
        const current=countrySelect.value;
        countrySelect.innerHTML=data.countries.map(c=>`<option value="${c.code}" data-currency="${c.currency}">${c.label} — ${c.currency}</option>`).join('');
        countrySelect.value=data.countries.some(c=>c.code===current)?current:'ID';
      }
    }catch(_error){}
  }
  async function loadMethods(){
    if(!api || !countrySelect || !methodSelect) return;
    try{
      const data=await api.request(`/payments/methods?country=${encodeURIComponent(countrySelect.value)}`);
      if(providerSelect){
        const allowed = countrySelect.value === 'ID' ? ['midtrans','xendit'] : ['stripe','paypal'];
        [...providerSelect.options].forEach(o => { o.hidden = !allowed.includes(o.value); });
        providerSelect.value = allowed.includes(data.provider) ? data.provider : allowed[0];
      }
      methodSelect.innerHTML=data.methods.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
      const first=data.methods[0]; if(first&&methodHint) methodHint.textContent=first.description;
      methodSelect.onchange=()=>{const m=data.methods.find(x=>x.id===methodSelect.value); if(methodHint) methodHint.textContent=m?.description||'';};
    }catch(error){show(error.message||'Metode pembayaran gagal dimuat.');}
  }
  countrySelect?.addEventListener('change',loadMethods); loadCountries().finally(loadMethods);

  const start = async(amountOverride) => {
    const amount=Number(amountOverride || amountInput?.value||0); if(!amount||amount<=0){show('Masukkan nominal pembayaran.');return;}
    const token=localStorage.getItem('chatgvtl_token'); if(!token){show('Silakan login terlebih dahulu.');setTimeout(()=>location.href='login.html',500);return;}
    try{
      show('Membuat checkout…');
      const data=await api.request('/payments/checkout',{method:'POST',body:JSON.stringify({amount,country:countrySelect?.value||'ID',provider:providerSelect?.value,currency:countrySelect?.selectedOptions?.[0]?.dataset?.currency,paymentMethod:methodSelect?.value,planId:'pro'})});
      if(data.checkoutUrl) location.href=data.checkoutUrl; else location.href=`payment-result.html?order=${encodeURIComponent(data.orderId)}`;
    }catch(error){show(error.message||'Checkout gagal dibuat.');}
  };
  document.querySelector('[data-start-payment]')?.addEventListener('click',()=>start());
  document.querySelector('[data-upgrade=pro]')?.addEventListener('click',()=>{
    if(!localStorage.getItem('chatgvtl_token')){ location.href='login.html'; return; }
    if(!amountInput){ const input=document.createElement('input'); input.type='hidden'; document.body.appendChild(input); }
    start(149000);
  });
})();

(()=>{
  window.ChatGVTL = window.ChatGVTL || {};
  const sameOrigin = (location.protocol === 'http:' || location.protocol === 'https:') && location.hostname;
  const base = window.CHATGVTL_API_BASE || (sameOrigin ? '/api' : 'http://localhost:8787/api');
  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = localStorage.getItem('chatgvtl_token');
    if (token) headers.Authorization = `Bearer ${token}`;
    let response;
    try {
      response = await fetch(`${base}${path}`, { ...options, headers });
    } catch (networkError) {
      throw Object.assign(new Error(`Backend ChatGVTL tidak dapat dihubungi. Jalankan server backend di ${base.replace('/api','')}.`), { code: 'BACKEND_UNREACHABLE', cause: networkError });
    }
    const data = await response.json().catch(()=>({}));
    if (!response.ok) throw Object.assign(new Error(data.message || data.error || 'Request failed'), { status: response.status, data });
    return data;
  }
  window.ChatGVTL.api = { request, base };
})();

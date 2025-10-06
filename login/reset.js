// reset.js - valida token e atualiza senha do usuário
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const tokenInput = $('token');
  const pw = $('password');
  const confirm = $('confirm');
  const resetBtn = $('reset');
  const msg = $('msg');

  function getUsers(){ try{ const raw=localStorage.getItem('sc_users'); return raw?JSON.parse(raw):[] }catch(e){return[]} }
  function saveUsers(u){ localStorage.setItem('sc_users', JSON.stringify(u)); }
  function getTokens(){ try{ const r=localStorage.getItem('sc_reset_tokens'); return r?JSON.parse(r):{} }catch(e){return{}} }
  function saveTokens(t){ localStorage.setItem('sc_reset_tokens', JSON.stringify(t)); }

  async function hashPassword(password){
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const arr = Array.from(new Uint8Array(hash));
    return arr.map(b => b.toString(16).padStart(2,'0')).join('');
  }

  // pré-preenchimento do token via query string
  (function prefill(){
    try{
      const params = new URLSearchParams(window.location.search);
      const t = params.get('token');
      if(t) tokenInput.value = t;
    }catch(e){}
  })();

  resetBtn.addEventListener('click', async ()=>{
    msg.textContent='';
    const token = (tokenInput.value||'').trim();
    const password = pw.value;
    const c = confirm.value;
    if(!token){ msg.textContent='Informe o código.'; return; }
    if(!password || password.length < 8){ msg.textContent='Senha inválida (mínimo 8 caracteres).'; return; }
    if(password !== c){ msg.textContent='As senhas não coincidem.'; return; }

    const tokens = getTokens();
    if(!tokens[token]){ msg.textContent='Código inválido ou expirado.'; return; }

    const email = tokens[token].email;
    const users = getUsers();
    const idx = users.findIndex(u=>u.email && u.email.toLowerCase() === email.toLowerCase());
    if(idx === -1){ msg.textContent='Usuário não encontrado.'; return; }

    const hashed = await hashPassword(password);
    users[idx].passwordHash = hashed;
    saveUsers(users);

    // remover token
    delete tokens[token];
    saveTokens(tokens);

    alert('Senha redefinida com sucesso. Você será redirecionado ao login.');
    window.location.href = 'login.html';
  });
})();

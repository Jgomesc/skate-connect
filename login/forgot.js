// forgot.js - gera token de redefinição e exibe para o usuário (simulação)
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const emailInput = $('email');
  const sendBtn = $('send');
  const msg = $('msg');

  function getUsers(){ try{ const raw=localStorage.getItem('sc_users'); return raw?JSON.parse(raw):[] }catch(e){return[]} }
  function saveTokens(t){ localStorage.setItem('sc_reset_tokens', JSON.stringify(t)); }
  function getTokens(){ try{ const r=localStorage.getItem('sc_reset_tokens'); return r?JSON.parse(r):{} }catch(e){return{}} }

  function genToken(){ return Math.random().toString(36).slice(2,10).toUpperCase(); }

  sendBtn.addEventListener('click', ()=>{
    msg.textContent='';
    const email = (emailInput.value||'').trim().toLowerCase();
    if(!email){ msg.textContent='Preencha o e-mail'; return; }
    const users = getUsers();
    const user = users.find(u=>u.email && u.email.toLowerCase()===email);
    if(!user){ msg.textContent='E-mail não encontrado'; return; }

    const token = genToken();
    const tokens = getTokens();
    tokens[token] = { email: user.email, createdAt: new Date().toISOString() };
    saveTokens(tokens);

    // Mostrar token e link para reset
    alert('Código gerado: ' + token + '\nSerá necessário na próxima etapa.');
    window.location.href = 'reset.html?token=' + token;
  });
})();

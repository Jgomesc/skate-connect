// ui.js - toasts simples
window.ui = (function(){
  'use strict';
  function ensureContainer(){
    let c = document.getElementById('toastContainer');
    if(!c){ c = document.createElement('div'); c.id = 'toastContainer'; document.body.appendChild(c); }
    return c;
  }
  function show(message, type='info', timeout=3500){
    const c = ensureContainer();
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = message;
    c.appendChild(t);
    setTimeout(()=>{ t.classList.add('visible'); }, 10);
    setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, timeout);
  }
  return { show };
})();

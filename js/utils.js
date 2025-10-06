// utils.js - funções utilitárias reutilizáveis
window.utils = (function(){
  'use strict';

  async function hashPassword(password){
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const arr = Array.from(new Uint8Array(hash));
    return arr.map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function passwordStrength(pw){
    if(!pw) return 0;
    let score = 0;
    if(pw.length >= 8) score += 30;
    if(pw.length >= 12) score += 10;
    if(/[a-z]/.test(pw)) score += 15;
    if(/[A-Z]/.test(pw)) score += 15;
    if(/[0-9]/.test(pw)) score += 15;
    if(/[^A-Za-z0-9]/.test(pw)) score += 15;
    return Math.min(100, score);
  }

  function validEmail(e){
    if(!e) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e);
  }

  return { hashPassword, passwordStrength, validEmail };
})();

// register.js - lógica de cadastro
(function(){
  'use strict';

  const $ = id => document.getElementById(id);

  const form = $('registerForm');
  const usernameInput = $('username');
  const emailInput = $('email');
  const passwordInput = $('password');
  const confirmInput = $('confirmPassword');
  const fullnameInput = $('fullname');
  const termsCheckbox = $('terms');
  const formError = $('formError');
  const usernameInfo = $('usernameInfo');
  const emailInfo = $('emailInfo');
  const passwordInfo = $('passwordInfo');
  const togglePassword = $('togglePassword');
  const strengthBar = $('strengthBar');

  // Util: pega lista de usuários do localStorage
  function getUsers(){
    try{
      const raw = localStorage.getItem('sc_users');
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }

  // Util: salva usuário
  function saveUser(user){
    const users = getUsers();
    users.push(user);
    localStorage.setItem('sc_users', JSON.stringify(users));
  }

  // checa disponibilidade username/email
  function isAvailable({username, email}){
    const users = getUsers();
    return {
      username: !users.some(u => u.username.toLowerCase() === (username||'').toLowerCase()),
      email: !users.some(u => u.email && u.email.toLowerCase() === (email||'').toLowerCase())
    };
  }

  // Força da senha simples (0-100)
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

  // atualiza barra de força
  function updateStrength(){
    const val = passwordInput.value;
    const s = passwordStrength(val);
    strengthBar.style.width = s + '%';
  }

  // toggle show/hide password
  togglePassword.addEventListener('click', ()=>{
    const t = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = t;
    confirmInput.type = t;
    togglePassword.textContent = t === 'text' ? 'Ocultar' : 'Mostrar';
  });

  // valida email simples
  function validEmail(e){
    if(!e) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e);
  }

  // hashing de senha com SubtleCrypto (SHA-256) -> hex
  async function hashPassword(password){
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const arr = Array.from(new Uint8Array(hash));
    return arr.map(b => b.toString(16).padStart(2,'0')).join('');
  }

  // checa disponibilidade ao digitar
  usernameInput.addEventListener('input', ()=>{
    const val = usernameInput.value.trim();
    if(!val){ usernameInfo.textContent = ''; return; }
    const avail = isAvailable({username: val});
    usernameInfo.textContent = avail.username ? 'Nome disponível' : 'Nome já em uso';
    usernameInfo.className = avail.username ? 'field-info' : 'field-info error';
  });

  emailInput.addEventListener('input', ()=>{
    const val = emailInput.value.trim();
    if(!val){ emailInfo.textContent = ''; return; }
    if(!validEmail(val)){ emailInfo.textContent = 'E-mail inválido'; emailInfo.className='field-info error'; return; }
    const avail = isAvailable({email: val});
    emailInfo.textContent = avail.email ? 'E-mail disponível' : 'E-mail já cadastrado';
    emailInfo.className = avail.email ? 'field-info' : 'field-info error';
  });

  passwordInput.addEventListener('input', ()=>{
    updateStrength();
    passwordInfo.textContent = '';
  });

  confirmInput.addEventListener('input', ()=>{
    if(confirmInput.value !== passwordInput.value){ passwordInfo.textContent = 'As senhas não coincidem'; }
    else passwordInfo.textContent = '';
  });

  // validação completa
  async function validate(){
    formError.textContent = '';
    const fullname = fullnameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if(!fullname || fullname.length < 3) { formError.textContent = 'Nome inválido (mínimo 3 caracteres)'; return null; }
    if(!username || username.length < 3) { formError.textContent = 'Nome de usuário inválido (mínimo 3 caracteres)'; return null; }
    if(!validEmail(email)) { formError.textContent = 'E-mail inválido'; return null; }
    if(password.length < 8) { formError.textContent = 'Senha muito curta (mínimo 8 caracteres)'; return null; }
    if(password !== confirm) { formError.textContent = 'As senhas não coincidem'; return null; }
    if(!termsCheckbox.checked) { formError.textContent = 'Você deve aceitar os termos'; return null; }

    const avail = isAvailable({username, email});
    if(!avail.username) { formError.textContent = 'Nome de usuário já existe'; return null; }
    if(!avail.email) { formError.textContent = 'E-mail já cadastrado'; return null; }

    const hashed = await hashPassword(password);

    return { fullname, username, email, passwordHash: hashed, createdAt: new Date().toISOString() };
  }

  // On submit
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const payload = await validate();
    if(!payload) return;

    // salvar usuário
    saveUser(payload);

    // opcional: gravar último usuário logado
    localStorage.setItem('sc_last_registered', JSON.stringify({username: payload.username, email: payload.email}));

  alert('Cadastro realizado com sucesso! Você já pode fazer login.');
  // redireciona para login (mesmo diretório)
  window.location.href = 'login.html';
  });

})();

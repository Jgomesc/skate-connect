// login por email usando usuários salvos em localStorage (sc_users)
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    function getUsers(){
        try{ const raw = localStorage.getItem('sc_users'); return raw? JSON.parse(raw): []; }catch(e){ return []; }
    }

    function show(msg){ if(window.ui && ui.show) ui.show(msg); else alert(msg); }

    async function hashPassword(password){
        const enc = new TextEncoder();
        const data = enc.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const arr = Array.from(new Uint8Array(hash));
        return arr.map(b => b.toString(16).padStart(2,'0')).join('');
    }

    if(!email || !password){ show('Preencha e-mail e senha.'); return; }
    const users = getUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === email);
    if(!user){ show('E-mail não cadastrado.'); return; }

    const hash = await hashPassword(password);
    if(hash === user.passwordHash){
        // salvar sessão simples com horário local do usuário
        const now = new Date();
        const session = { email: user.email, username: user.username, loggedAt: now.toISOString(), loggedAtLocal: now.toLocaleString() };
        // também propagar avatar se existir
        if(user.avatar) session.avatar = user.avatar;
        localStorage.setItem('sc_session', JSON.stringify(session));
        show('Login realizado com sucesso!');
        // redirecionar para index
        window.location.href = '../index.html';
    } else {
        show('Senha incorreta.');
    }
});

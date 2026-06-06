import { supabase } from '../data/supabase.js';

let authEl = null;

export function initAuth(onLogin) {
  authEl = document.createElement('div');
  authEl.id = 'auth-screen';
  authEl.innerHTML = `
    <div id="auth-box">
      <div id="auth-flag">🗺️</div>
      <h1 id="auth-title">TravelMap</h1>
      <p id="auth-subtitle">O nosso mapa de aventuras</p>
      <div id="auth-form">
        <input type="email" id="auth-email" placeholder="Email" autocomplete="email"/>
        <input type="password" id="auth-password" placeholder="Password" autocomplete="current-password"/>
        <button id="auth-btn">Entrar</button>
        <div id="auth-error"></div>
      </div>
    </div>
  `;
  document.getElementById('app').appendChild(authEl);

  document.getElementById('auth-btn').addEventListener('click', async () => {
    const email = authEl.querySelector('#auth-email').value.trim();
    const password = authEl.querySelector('#auth-password').value.trim();
    const errorEl = authEl.querySelector('#auth-error');

    if (!email || !password) {
      errorEl.textContent = 'Preenche email e password.';
      return;
    }

    const btn = authEl.querySelector('#auth-btn');
    btn.textContent = 'A entrar...';
    btn.disabled = true;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Resultado:', data, 'Erro:', error);

    if (error) {
      errorEl.textContent = 'Email ou password incorrectos.';
      btn.textContent = 'Entrar';
      btn.disabled = false;
      return;
    }

    hideAuth();
    onLogin(data.user);
  });
}

export function hideAuth() {
  if (authEl) authEl.classList.add('hidden');
}

export function showAuth() {
  if (authEl) authEl.classList.remove('hidden');
}
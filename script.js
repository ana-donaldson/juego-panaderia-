// Portal "Del Horno a la Mano"
// Maneja el panel de inicio de sesión (a un costado) y el paso al juego.
// No hay backend: el "login" es una demo que guarda el nombre en localStorage
// para poder saludar al jugador. Cambiar esto por una autenticación real
// cuando el proyecto tenga servidor.

const overlay = document.getElementById('overlay');
const panelLogin = document.getElementById('panelLogin');
const abrirLogin = document.getElementById('abrirLogin');
const cerrarLogin = document.getElementById('cerrarLogin');
const formLogin = document.getElementById('formLogin');
const entrarInvitado = document.getElementById('entrarInvitado');
const loginNota = document.getElementById('loginNota');

function abrirPanel() {
  overlay.hidden = false;
  panelLogin.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('nombreUsuario').focus();
}

function cerrarPanel() {
  overlay.hidden = true;
  panelLogin.hidden = true;
  document.body.style.overflow = '';
}

abrirLogin.addEventListener('click', abrirPanel);
cerrarLogin.addEventListener('click', cerrarPanel);
overlay.addEventListener('click', cerrarPanel);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panelLogin.hidden) cerrarPanel();
});

function irAlJuego(nombre) {
  if (nombre) {
    localStorage.setItem('panaderiaJugador', nombre);
  }
  window.location.href = 'juego/index.html';
}

formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombreUsuario').value.trim();
  if (!nombre) return;
  loginNota.hidden = false;
  loginNota.textContent = `¡Hola, ${nombre}! Te llevamos al mostrador...`;
  setTimeout(() => irAlJuego(nombre), 700);
});

entrarInvitado.addEventListener('click', () => irAlJuego(null));

// Saludo si ya jugó antes (nombre guardado de una sesión previa)
const jugadorGuardado = localStorage.getItem('panaderiaJugador');
if (jugadorGuardado) {
  document.getElementById('nombreUsuario').value = jugadorGuardado;
}

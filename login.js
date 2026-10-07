/* ============================================================
   CONFIG
   API: poné acá la ruta del PHP (ej: 'php/auth.php') cuando esté
   listo el backend. Vacío = modo demo con localStorage.
   Se envía JSON: { accion: 'login'|'registro'|'recuperar', ... }
   y se espera:   { ok: true|false, mensaje: '...', usuario: '...', rol: '...' }
   El PHP debe guardar la clave con password_hash() y usar HTTPS.
   ============================================================ */

const API = 'php/auth.php';
const JUEGO = 'inicio.html';
const MAX_INTENTOS = 5, BLOQUEO_SEG = 30;

const $ = s => document.querySelector(s);
const form = $('#form'), estado = $('#estado');
let modo = 'login', intentos = 0, bloqueadoHasta = 0;

/* ---------- Filtro de malas palabras ---------- */
const MALAS = ['puta','puto','mierda','carajo','pelotud','forro','concha','verga','pija','culo','culiad',
  'gilipoll','cabron','pendej','maricon','marica','zorra','idiota','estupid','imbecil',
  'mogolic','trolo','sorete','choto','porno','nazi','hitler','fuck','shit','bitch','dick','cunt','nigg', "retard", "putaz", "trolaz"];
const LEET = {'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b','@':'a','$':'s','!':'i'};
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[0134578@$!]/g, c => LEET[c]).replace(/[^a-z]/g,'').replace(/(.)\1+/g,'$1');
const MALAS_N = MALAS.map(normalizar);
const tieneMalaPalabra = t => { const n = normalizar(t); return MALAS_N.some(m => n.includes(m)); };

/* ---------- Validadores (devuelven '' si está bien) ---------- */
const RE_USER = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9]+$/;
const RE_MAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const V = {
  usuario(v){
    v = v.trim();
    if (!v) return 'Ingresá tu usuario' + (modo==='login' ? ' o correo.' : '.');
    if (modo==='login') return v.includes('@') ? (RE_MAIL.test(v) ? '' : 'El correo no es válido.') : (RE_USER.test(v) ? '' : 'Solo letras y números, sin símbolos ni espacios.');
    if (v.length < 3 || v.length > 16) return 'Debe tener entre 3 y 16 caracteres.';
    if (!RE_USER.test(v)) return 'Solo letras y números: sin espacios ni caracteres especiales.';
    if (tieneMalaPalabra(v)) return 'Ese nombre no está permitido. Elegí otro.';
    return '';
  },
  email(v){
    v = v.trim();
    if (!v) return 'Ingresá tu correo.';
    if (!RE_MAIL.test(v)) return 'El correo no es válido (ej: nombre@dominio.com).';
    if (modo==='reg' && tieneMalaPalabra(v.split('@')[0])) return 'Ese correo contiene palabras no permitidas.';
    return '';
  },
  pass(v){
    if (!v) return 'Ingresá tu contraseña.';
    if (modo==='login') return '';
    if (v.length < 8) return 'Mínimo 8 caracteres.';
    if (v.length > 64) return 'Máximo 64 caracteres.';
    if (/\s/.test(v)) return 'No puede tener espacios.';
    if (/[<>"'`]/.test(v)) return 'No uses los símbolos < > " \' `.';
    if (!/[a-z]/.test(v) || !/[A-Z]/.test(v) || !/\d/.test(v)) return 'Necesita mayúscula, minúscula y número.';
    const u = $('#usuario').value.trim().toLowerCase();
    if (u.length >= 3 && v.toLowerCase().includes(u)) return 'No puede contener tu nombre de usuario.';
    return '';
  },
  pass2(v){ return v === $('#pass').value ? '' : 'Las contraseñas no coinciden.'; },
  terminos(){ return $('#terminos').checked ? '' : 'Tenés que aceptar las reglas para continuar.'; }
};

function validar(id, mostrar = true){
  const el = $('#' + id), err = $('#' + id + '-err');
  const msg = V[id](el.type === 'checkbox' ? '' : el.value);
  if (mostrar){
    err.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (el.type !== 'checkbox') el.classList.toggle('ok', !msg && modo !== 'login');
    el.setAttribute('aria-describedby', id + '-err');
  }
  return !msg;
}

const campos = () => ({
  login: ['usuario','pass'], reg: ['usuario','email','pass','pass2','terminos'], rec: ['email']
}[modo]);

/* ---------- Medidor de fuerza ---------- */
function fuerza(v){
  let n = 0;
  if (v.length >= 8) n++;
  if (v.length >= 12) n++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v)) n++;
  if (/[^A-Za-z0-9]/.test(v)) n++;
  return v ? Math.max(1, n) : 0;
}
$('#pass').addEventListener('input', e => {
  const n = fuerza(e.target.value);
  $('#medidor').dataset.n = n;
  if (modo === 'reg') $('#fuerza').textContent = n ? ['','Débil','Aceptable','Buena','Fuerte'][n] : 'Mínimo 8 caracteres, con mayúscula, minúscula y número.';
  if ($('#pass2').value) validar('pass2');
});

/* ---------- Modos ---------- */
function setModo(m){
  modo = m;
  form.reset(); estado.className = 'estado';
  document.querySelectorAll('.err').forEach(e => e.textContent = '');
  document.querySelectorAll('input,select').forEach(e => { e.removeAttribute('aria-invalid'); e.classList.remove('ok'); });
  $('#medidor').dataset.n = 0;
  document.querySelectorAll('[data-show]').forEach(el => {
    const on = el.dataset.show.split(' ').includes(m);
    el.hidden = !on;
  });
  $('#tabLogin').setAttribute('aria-pressed', m === 'login');
  $('#tabReg').setAttribute('aria-pressed', m === 'reg');
  $('.tabs').hidden = m === 'rec';
  $('#lblUsuario').textContent = m === 'login' ? 'Usuario o correo' : 'Nombre de usuario';
  $('#pass').autocomplete = m === 'reg' ? 'new-password' : 'current-password';
  $('#enviar').textContent = { login:'Entrar', reg:'Crear mi cuenta', rec:'Enviar enlace' }[m];
  $('#subtitulo').textContent = { login:'Identificate para entrar al mostrador.', reg:'Abrí tu cuenta y empezá a atender.', rec:'Te mandamos un enlace para crear una clave nueva.' }[m];
  $('#invitado').hidden = m === 'rec';
  $('#pieTxt').hidden = m === 'rec';
  $('#volver').hidden = m !== 'rec';
  if (m === 'login') {
    try { const r = localStorage.getItem('panaderiaRecordar'); if (r) { $('#usuario').value = r; $('#recordar').checked = true; } } catch(e){}
  }
}
$('#tabLogin').onclick = () => setModo('login');
$('#tabReg').onclick = () => setModo('reg');
$('#olvide').onclick = () => setModo('rec');
$('#volver').onclick = () => setModo('login');

/* ---------- Extras: mostrar contraseña, bloq mayús, validar al salir ---------- */
document.querySelectorAll('.ver').forEach(b => b.onclick = () => {
  const inp = $('#' + b.dataset.ver), oculto = inp.type === 'password';
  inp.type = oculto ? 'text' : 'password';
  b.textContent = oculto ? 'Ocultar' : 'Mostrar';
  b.setAttribute('aria-label', (oculto ? 'Ocultar' : 'Mostrar') + ' contraseña');
});
['keydown','keyup'].forEach(ev => $('#pass').addEventListener(ev, e => {
  $('#mayus').hidden = !(e.getModifierState && e.getModifierState('CapsLock'));
}));
$('#pass').addEventListener('blur', () => $('#mayus').hidden = true);
['usuario','email','pass','pass2'].forEach(id => $('#' + id).addEventListener('blur', () => { if ($('#' + id).value) validar(id); }));
$('#terminos').addEventListener('change', () => validar('terminos'));

/* ---------- Mensajes y envío ---------- */
function aviso(txt, tipo){ estado.textContent = txt; estado.className = 'estado show ' + tipo; }

async function enviar(d){
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d)
  });
  return r.json();
}

// ✅ MODIFICADO: ahora recibe el ID y lo guarda en localStorage
function irAlJuego(nombre, id){
  try {
    localStorage.setItem('panaderiaJugador', nombre);
    if (id) localStorage.setItem('jugador_id', id);  // ✅ GUARDA EL ID
  } catch(e){}
  setTimeout(() => location.href = JUEGO, 900);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  if ($('#web').value) return;
  const ahora = Date.now();
  if (ahora < bloqueadoHasta) return aviso(`Demasiados intentos. Esperá ${Math.ceil((bloqueadoHasta-ahora)/1000)} s.`, 'error');

  const ok = campos().map(id => validar(id)).every(Boolean);
  if (!ok){ aviso('Revisá los campos marcados.', 'error'); const p = campos().find(id => $('#'+id+'-err').textContent); if (p) $('#'+p).focus(); return; }

  const d = {
    accion: { login:'login', reg:'registro', rec:'recuperar' }[modo],
    usuario: $('#usuario').value.trim(),
    email: $('#email').value.trim(),
    pass: $('#pass').value,
    rol: $('#rol').value
  };

  const btn = $('#enviar'); btn.disabled = true;
  try {
    const r = await enviar(d);
    if (!r.ok){
      if (modo === 'login' && ++intentos >= MAX_INTENTOS){
        bloqueadoHasta = Date.now() + BLOQUEO_SEG*1000;
        intentos = 0;
        return aviso(`Demasiados intentos. Esperá ${BLOQUEO_SEG} s.`, 'error');
      }
      return aviso(r.mensaje || 'No se pudo completar la acción.', 'error');
    }
    aviso(r.mensaje, 'exito');
    if (modo === 'rec') return;
    try {
      $('#recordar').checked && modo === 'login'
        ? localStorage.setItem('panaderiaRecordar', d.usuario)
        : localStorage.removeItem('panaderiaRecordar');
    } catch(e){}
    irAlJuego(r.usuario || d.usuario, r.id);  // ✅ PASA EL ID
  } catch(err){
    aviso('No pudimos conectar con el servidor. Probá de nuevo.', 'error');
  } finally {
    btn.disabled = false;
  }
});

$('#invitado').onclick = () => { aviso('Entrando como invitado…', 'exito'); irAlJuego('Invitado'); };

setModo('login');

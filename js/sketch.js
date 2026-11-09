// ============================================
// SKETCH PRINCIPAL
// ============================================

let estado = "menu";
let modoSeleccionado = "cajero"; // ✅ AHORA ARRANCA EN CAJERO POR DEFECTO

// Variables del Cajero
let clienteY = 0;
let clienteDestinoY = 0;
let clienteVisible = false;
let clienteAnimando = false;
let clienteActual = 0;

let puntos = 0;
let vidas = 3;
let clientesAtendidos = 0;
let clientesMaximos = 5;
let caja = 500;

let pedidoActual = [];
let totalCorrecto = 0;
let vueltoCorrecto = 0;
let pagoCliente = 0;

let inputVuelto = "";
let mensaje = "";
let mensajeColor = 0;
let mensajeTemp = null;
let mostrandoResultado = false;
let clienteEnojado = false;

let bolsa = [];
let productoSeleccionado = 0;
let animaciones = [];
let arrastrando = null; 

// Variables del Cocinero
let recetaActual = null;
let pasoIngrediente = 0;
let hornoEncendido = false;
let progresoHorno = 0;
let temperaturaHorno = 0;
let brilloAplicado = false;
let indiceIngredienteSeleccionado = 0;
let productosPintados = [];
let indiceProductoPintar = 0;
let indiceRecetaSeleccionada = 0;
let imgRecetaActual = null;
let imagenesRecetas = {};
let imagenesPintado = {};   // piezas sin/con huevo: clave "Receta_sin" / "Receta_con"

// Variables Escena 4
let indiceDecoracionSeleccionada = 0;
let decoracionElegida = "";
let decoracionesRequeridas = [];
let decoracionesElegidas = [];
let desplazamientoDecoraciones = 0;
let arrastrandoDeslizador = false;

// Estado de la cocción
let coccionFallida = false;
let coccionFallidaDesde = 0;
let coccionExitosa = false;
let teclaTempDesde = 0;
let teclaTempUltimo = 0;

// Temporizador compartido por ambos modos
let tiempoInicio = 0;               // millis() al empezar la partida
let tiempoFin = 0;                  // millis() al terminar (0 = todavía corre)
let temporizadorCorriendo = false;
let resultadoGuardado = false;      // evita guardar dos veces la misma partida

// Ranking del menú
let rankingDatos = [];
let rankingEstado = "vacio";        // "vacio" | "cargando" | "ok" | "error"
let rankingCargadoEn = 0;           // millis() de la última carga correcta
let rankingVisibleDesde = 0;        // millis() desde que la tabla se muestra
let rankingPeticion = 0;            // para ignorar respuestas viejas
let estadoPrevio = "";
const RANKING_VISIBLE_MS = 30000;   // la tabla se ve completa
const RANKING_FADE_MS = 5000;       // y después desaparece gradualmente
const RANKING_CACHE_MS = 15000;     // no se vuelve a pedir si los datos son más nuevos que esto

// Variables de Imágenes
let imgCliente;
let imgMostrador;
let imagenesProductos = {};

function preload() {
    imgCliente = loadImage('assets/persona1.png');
    imgMostrador = loadImage('assets/mueblefeo.png');
    
    imagenesProductos["Pan"] = loadImage('assets/productos/pan.jpg');
    imagenesProductos["Factura"] = loadImage('assets/productos/factura.jpg');
    imagenesProductos["Medialuna"] = loadImage('assets/productos/medialuna.jpg');
    imagenesProductos["Galleta"] = loadImage('assets/productos/galleta.jpg');
    imagenesProductos["Torta"] = loadImage('assets/productos/torta.jpg');
    imagenesProductos["Alfajor"] = loadImage('assets/productos/alfajor.jpg');
    
    imagenesRecetas["Medialunas"] = loadImage('assets/recetas/medialuna.jpg');
    imagenesRecetas["Panes"] = imagenesProductos["Pan"];
    imagenesRecetas["Facturas"] = imagenesProductos["Factura"];
    imagenesRecetas["Galletas"] = imagenesProductos["Galleta"];
    imagenesRecetas["Tortas"] = imagenesProductos["Torta"];
    imagenesRecetas["Alfajores"] = imagenesProductos["Alfajor"];

    console.log("Imágenes cargadas:", imagenesProductos);
}

function cargarImagenOpcional(ruta, destino, clave) {
    loadImage(ruta, img => { destino[clave] = img; }, () => {});
}

function setup() {
    cargarImagenOpcional('assets/productos/torta.jpg', imagenesProductos, "Torta");
    cargarImagenOpcional('assets/recetas/torta.jpg', imagenesRecetas, "Tortas");
    cargarImagenOpcional('assets/productos/alfajor.jpg', imagenesProductos, "Alfajor");
    cargarImagenOpcional('assets/recetas/alfajor.jpg', imagenesRecetas, "Alfajores");

    // ---- Pintado con huevo: una imagen "sin" y otra "con" huevo por receta que lo usa ----
    for (let n of ["Medialunas", "Tortas", "Facturas"]) {
        cargarImagenOpcional('assets/huevo/' + n.toLowerCase() + '_sin.png', imagenesPintado, n + "_sin");
        cargarImagenOpcional('assets/huevo/' + n.toLowerCase() + '_con.png', imagenesPintado, n + "_con");
    }

    createCanvas(900, 600);
    textAlign(CENTER, CENTER);
    textSize(20);
    clienteY = height + 100;
    clienteDestinoY = height - 180;
}

function draw() {
    cursor(ARROW);
    
    // LÓGICA DEL HORNO
    if (estado === "cocinero_escena2" && hornoEncendido) {
        let velocidad = map(temperaturaHorno, 0, 300, 0.5, 2.5); 
        progresoHorno += velocidad; 

        let meta = recetaActual.tiempoIdeal * 15; 
        
        if (progresoHorno > meta + 40) {
            fallarCoccion("❌ ¡Se quemó por dejarlo mucho tiempo!");
        }
    }

    if (estado === "cocinero_escena2") actualizarTemperaturaMantenida();

    if (estado === "cocinero_escena2" && coccionFallida && millis() - coccionFallidaDesde >= AVISO_ERROR_TOTAL) {
        reintentarCoccion();
    }

    // Al terminar la partida: se frena el tiempo y se guarda el resultado (una sola vez)
    if (estado === "fin" && temporizadorCorriendo) {
        detenerTemporizador();
        guardarPartidaEnServidor();
    }

    // Ranking: se pide una sola vez cada vez que se entra al menú
    if (estado !== estadoPrevio) {
        if (estado === "menu") iniciarRanking();
        estadoPrevio = estado;
    }

    if (estado === "menu") {
        dibujarFondo();
        mostrarMenu(modoSeleccionado); // ✅ Le pasamos el modo actual
        dibujarRanking();
    } else if (estado === "instrucciones") {
        dibujarFondo();
        if (modoSeleccionado === "cajero") {
            mostrarInstrucciones(); 
        } else {
            mostrarInstruccionesCocinero(); 
        }
    } else if (estado === "cajero_escena1") {
        dibujarEscenaCajero1();
        mostrarInterfazEscena1();
    } else if (estado === "cajero_escena3") {
        dibujarEscenaCajero3();
        mostrarInterfazEscena3();
    } else if (estado === "cajero_escena2") {
        dibujarEscenaCajero2();
        mostrarInterfazEscena2();
    
    } else if (estado === "cocinero_seleccion") {
        dibujarFondo();
        mostrarSeleccionReceta();
    } else if (estado === "cocinero_escena1") {
        dibujarFondo();
        mostrarInterfazCocinero1();
    } else if (estado === "cocinero_escena2") {
        dibujarFondo();
        mostrarInterfazCocinero2(); 
    } else if (estado === "cocinero_escena3") {
        dibujarFondo();
        mostrarInterfazCocinero3(); 
    } else if (estado === "cocinero_escena4") {
        dibujarFondo();
        mostrarInterfazCocinero4(); 
    } else if (estado === "fin") {
        dibujarFondo();
        mostrarFin();
    }

    // Reloj de la partida
    if (tiempoInicio > 0 && (estado.startsWith("cajero_escena") || estado.startsWith("cocinero_escena") || estado === "fin")) {
        dibujarTemporizador();
    }
}

// ============================================
// FUNCIONES DE DIBUJO DEL CAJERO
// ============================================
function dibujarEscenaCajero1() {
    dibujarFondo();
    if (clienteAnimando) {
        clienteY = lerp(clienteY, clienteDestinoY, 0.05);
        if (abs(clienteY - clienteDestinoY) < 0.5) {
            clienteY = clienteDestinoY;
            clienteAnimando = false;
            clienteVisible = true;
        }
    }
    if (clienteVisible) dibujarCliente(clienteY, clienteEnojado);
    dibujarMostrador();
}

function dibujarEscenaCajero3() { dibujarFondo(); }
function dibujarEscenaCajero2() { dibujarFondo(); }

// ============================================
// TEMPORIZADOR (compartido por Cajero y Cocinero)
// ============================================
// Arranca al empezar de verdad una partida (Cajero: ENTER/clic en las instrucciones;
// Cocinero: al elegir la receta). Las transiciones entre etapas no lo tocan.
function iniciarTemporizador() {
    tiempoInicio = millis();
    tiempoFin = 0;
    temporizadorCorriendo = true;
    resultadoGuardado = false;
}

function detenerTemporizador() {
    if (!temporizadorCorriendo) return;
    tiempoFin = millis();
    temporizadorCorriendo = false;
}

function segundosTranscurridos() {
    if (tiempoInicio === 0) return 0;
    return ((temporizadorCorriendo ? millis() : tiempoFin) - tiempoInicio) / 1000;
}

// Cocinero: menos tiempo = más puntaje (1000 con 0 s, 500 con 60 s, 333 con 120 s...)
function calcularPuntajeCocinero() {
    return Math.round(PUNTOS_COCINERO_MAX * TIEMPO_REFERENCIA_COCINERO / (TIEMPO_REFERENCIA_COCINERO + segundosTranscurridos()));
}

// ============================================
// RANKING DEL MENÚ
// ============================================
// Pide el top 10 al servidor (una sola vez por visita al menú; si los datos tienen
// menos de 15 s se reutilizan). No bloquea nada: la tabla aparece cuando llega.
function iniciarRanking() {
    if (rankingEstado === "ok" && millis() - rankingCargadoEn < RANKING_CACHE_MS) {
        rankingVisibleDesde = millis();
        return;
    }
    let id = ++rankingPeticion;
    rankingEstado = "cargando";
    rankingVisibleDesde = 0;

    fetch('php/ranking.php')
        .then(res => res.json())
        .then(data => {
            if (id !== rankingPeticion) return;   // llegó una respuesta vieja
            if (data.success) {
                rankingDatos = data.ranking;
                rankingEstado = "ok";
                rankingCargadoEn = millis();
                rankingVisibleDesde = millis();
            } else {
                rankingEstado = "error";
            }
        })
        .catch(() => { if (id === rankingPeticion) rankingEstado = "error"; });
}

// ============================================
// COMENZAR PARTIDA
// ============================================
function comenzarPartida() {
    if (modoSeleccionado === "cajero") {
        reiniciarJuego(); 
        cargarCliente(0);
        iniciarTemporizador();
    } else if (modoSeleccionado === "cocinero") {
        estado = "cocinero_seleccion";
        indiceRecetaSeleccionada = 0;
        mensaje = "";
    }
}

// ============================================
// EVENTOS DEL TECLADO
// ============================================
function keyPressed() {
    // MENÚ
    if (estado === "menu") {
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
            modoSeleccionado = (modoSeleccionado === "cajero") ? "cocinero" : "cajero";
        }
        if (keyCode === ENTER || key === 'Enter') {
            estado = "instrucciones";
        }
        return; 
    }

    // INSTRUCCIONES
    if (estado === "instrucciones") {
        if (keyCode === ENTER || key === 'Enter') {
            comenzarPartida();
            return;   
        }
        if (key === 'Escape') { estado = "menu"; }
    }

    // MODO COCINERO: ELEGIR PRODUCTO
    if (estado === "cocinero_seleccion") {
        if (key === 'Escape') { estado = "menu"; return; }
        let n = recetas.length;
        if (keyCode === LEFT_ARROW) indiceRecetaSeleccionada = (indiceRecetaSeleccionada - 1 + n) % n;
        if (keyCode === RIGHT_ARROW) indiceRecetaSeleccionada = (indiceRecetaSeleccionada + 1) % n;
        if (keyCode === UP_ARROW) {
            let j = indiceRecetaSeleccionada - 3;
            if (j < 0) { j += 3 * Math.ceil(n / 3); if (j >= n) j -= 3; }
            indiceRecetaSeleccionada = j;
        }
        if (keyCode === DOWN_ARROW) {
            let j = indiceRecetaSeleccionada + 3;
            if (j >= n) j = indiceRecetaSeleccionada % 3;
            indiceRecetaSeleccionada = j;
        }
        if (keyCode === ENTER || key === 'Enter') iniciarReceta(indiceRecetaSeleccionada);
        return;
    }

    // MODO COCINERO: ESCENA 1 (Preparación)
    if (estado === "cocinero_escena1") {
        if (key === 'Escape') { estado = "menu"; return; }
        if (keyCode === LEFT_ARROW) indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado - 1 + ingredientesDisponibles.length) % ingredientesDisponibles.length;
        if (keyCode === RIGHT_ARROW) indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado + 1) % ingredientesDisponibles.length;
        if (keyCode === UP_ARROW) indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado - 2 + ingredientesDisponibles.length) % ingredientesDisponibles.length;
        if (keyCode === DOWN_ARROW) indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado + 2) % ingredientesDisponibles.length;
        if (keyCode === ENTER || key === 'Enter') agregarIngrediente(indiceIngredienteSeleccionado);
        if (key === ' ') { irAlHorno(); return; }
    }

    // MODO COCINERO: ESCENA 2 (Horno)
    if (estado === "cocinero_escena2") {
        if (key === 'Escape') { estado = "menu"; return; }
        if (coccionExitosa) {
            if (key === ' ') avanzarDesdeHorno();
            return;
        }
        if (coccionFallida) {
            if (key === 'r' || key === 'R') reintentarCoccion();
            return;
        }
        if (!hornoEncendido && progresoHorno === 0) {
            if (keyCode === LEFT_ARROW) { temperaturaHorno = Math.max(0, temperaturaHorno - 10); teclaTempDesde = millis(); teclaTempUltimo = millis(); }
            if (keyCode === RIGHT_ARROW) { temperaturaHorno = Math.min(300, temperaturaHorno + 10); teclaTempDesde = millis(); teclaTempUltimo = millis(); }
            if (keyCode === ENTER || key === 'Enter') {
                if (temperaturaHorno < 100) mostrarAvisoError("❌ ¡El horno está muy frío! Subí la temperatura.");
                else { hornoEncendido = true; progresoHorno = 0; mensaje = ""; }
            }
        } else if (hornoEncendido) {
            if (key === ' ') {
                hornoEncendido = false; 
                let meta = recetaActual.tiempoIdeal * 15; 
                let margen = 25; 
                if (progresoHorno >= meta - margen && progresoHorno <= meta + margen) {
                    coccionExitosa = true; mensaje = "✅ ¡Perfecto! Quedó en su punto."; mensajeColor = color(0, 150, 0);
                } else {
                    let motivo = progresoHorno < meta ? "crudo" : "quemado";
                    fallarCoccion("❌ ¡Quedó " + motivo + "!");
                }
                return;
            }
        }
    }

    // MODO COCINERO: ESCENA 3 (Pintar)
    if (estado === "cocinero_escena3") {
        if (key === 'Escape') { estado = "menu"; return; }
        if (keyCode === LEFT_ARROW) indiceProductoPintar = (indiceProductoPintar - 1 + 6) % 6;
        if (keyCode === RIGHT_ARROW) indiceProductoPintar = (indiceProductoPintar + 1) % 6;
        if (keyCode === UP_ARROW) indiceProductoPintar = (indiceProductoPintar - 3 + 6) % 6;
        if (keyCode === DOWN_ARROW) indiceProductoPintar = (indiceProductoPintar + 3) % 6;
        if (keyCode === ENTER || key === 'Enter') pintarProducto(indiceProductoPintar);
        if (key === ' ') { terminarPintado(); return; }
    }

    // MODO COCINERO: ESCENA 4 (Decoración)
    if (estado === "cocinero_escena4") {
        if (key === 'Escape') { estado = "menu"; return; }
        if (keyCode === LEFT_ARROW) indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada - 1 + decoracionesDisponibles.length) % decoracionesDisponibles.length;
        if (keyCode === RIGHT_ARROW) indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada + 1) % decoracionesDisponibles.length;
        if (keyCode === UP_ARROW) indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada - 2 + decoracionesDisponibles.length) % decoracionesDisponibles.length;
        if (keyCode === DOWN_ARROW) indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada + 2) % decoracionesDisponibles.length;
        asegurarDecoracionVisible();   
        if (keyCode === ENTER || key === 'Enter') agregarDecoracion(indiceDecoracionSeleccionada);
        if (key === ' ') { entregarProducto(); return; }
    }

    // MODO CAJERO: ESCENA 1
    if (estado === "cajero_escena1") {
        if (key === 'Escape') { estado = "menu"; ocultarCliente(); return; }
        if (key === ' ' && clienteVisible) { irAArmarPedido(); return; }
    }

    // MODO CAJERO: ESCENA 3
    if (estado === "cajero_escena3") {
        if (key === 'Escape') { estado = "menu"; ocultarCliente(); return; }
        if (keyCode === LEFT_ARROW) productoSeleccionado = (productoSeleccionado - 1 + productos.length) % productos.length;
        if (keyCode === RIGHT_ARROW) productoSeleccionado = (productoSeleccionado + 1) % productos.length;
        if (keyCode === UP_ARROW) productoSeleccionado = (productoSeleccionado - 3 + productos.length) % productos.length;
        if (keyCode === DOWN_ARROW) productoSeleccionado = (productoSeleccionado + 3) % productos.length;
        if (keyCode === ENTER || key === 'Enter') agregarProductoALaBolsa(productoSeleccionado);
        if (key === ' ') { irACobrar(); return; }
    }

    // MODO CAJERO: ESCENA 2
    if (estado === "cajero_escena2") {
        if (key === 'Escape') { estado = "menu"; ocultarCliente(); return; }
        if (mostrandoResultado) return;
        if (vueltoCorrecto === 0) { if (key === ' ') avanzarSinVuelto(); return; }
        if (vueltoCorrecto < 0) return;
        if (key >= '0' && key <= '9') { if (inputVuelto.length < 8) inputVuelto += key; }
        if (key === '.') { if (!inputVuelto.includes('.')) inputVuelto += '.'; }
        if (keyCode === BACKSPACE) inputVuelto = inputVuelto.slice(0, -1);
        if (keyCode === ENTER || key === 'Enter') confirmarVuelto();
    }

    // FIN
    if (estado === "fin") {
        if (key === 'r' || key === 'R') { reiniciarJuego(); estado = "menu"; }
        if (key === 'm' || key === 'M') estado = "menu";
    }
}

// ============================================
// EVENTOS DEL MOUSE
// ============================================
function mousePressed() {
    // ✅ Si estamos en el menú, el clic también sirve para elegir
    if (estado === "menu") {
        if (mouseY > 250 && mouseY < 310) { modoSeleccionado = "cajero"; estado = "instrucciones"; return; }
        if (mouseY > 330 && mouseY < 390) { modoSeleccionado = "cocinero"; estado = "instrucciones"; return; }
    }

    let cartel = cartelInteractivo();
    if (cartel && mouseSobreAviso(cartel.lineas, cartel.cx, cartel.cy, cartel.nivel)) {
        cartel.accion();
        return;
    }

    if (estado === "cocinero_seleccion") {
        let i = recetaBajoMouse(); if (i >= 0) iniciarReceta(i); return;
    }
    if (estado === "cocinero_escena1") {
        let i = ingredienteBajoMouse(); if (i >= 0) { indiceIngredienteSeleccionado = i; agregarIngrediente(i); } return;
    }
    if (estado === "cocinero_escena3") {
        let i = piezaBajoMouse(); if (i >= 0) { indiceProductoPintar = i; pintarProducto(i); } return;
    }
    if (estado === "cocinero_escena4") {
        if (hayDeslizador() && mouseSobreDeslizador()) { arrastrandoDeslizador = true; desplazarDesdeMouse(); return; }
        let i = decoracionBajoMouse(); if (i >= 0) { indiceDecoracionSeleccionada = i; agregarDecoracion(i); } return;
    }

    if (estado === "cajero_escena3") {
        if (botonCobrarVisible() && mouseSobreBotonCobrar()) { irACobrar(); return; }
        let i = productoBajoMouse();
        if (i >= 0) {
            productoSeleccionado = i;
            arrastrando = { indice: i, movido: false, xIni: mouseX, yIni: mouseY };
        }
    }
}

function mouseDragged() {
    if (arrastrandoDeslizador) desplazarDesdeMouse();
    if (arrastrando && dist(mouseX, mouseY, arrastrando.xIni, arrastrando.yIni) > 6) {
        arrastrando.movido = true;
    }
}

function mouseWheel(event) {
    if (estado === "cocinero_escena4" && hayDeslizador()) {
        desplazamientoDecoraciones = Math.max(0, Math.min(maxDesplazamiento(), desplazamientoDecoraciones + (event.delta > 0 ? 1 : -1)));
        return false;   
    }
}

function mouseReleased() {
    arrastrandoDeslizador = false;
    if (!arrastrando) return;
    let a = arrastrando;
    arrastrando = null;
    if (estado !== "cajero_escena3") return;

    if (!a.movido) {
        agregarProductoALaBolsa(a.indice);                        
    } else if (mouseSobreBolsa()) {
        agregarProductoALaBolsa(a.indice, mouseX - 50, mouseY - 40); 
    } else {
        mostrarAvisoError("Soltá el producto sobre la bolsa", color(200, 100, 0));
    }
}

// ============================================
// REINICIAR JUEGO
// ============================================
function reiniciarJuego() {
    clienteActual = 0;
    puntos = 0;
    vidas = 3;
    clientesAtendidos = 0;
    caja = 500;
    inputVuelto = "";
    mensaje = "";
    mostrandoResultado = false;
    clienteEnojado = false;
    bolsa = [];
    productoSeleccionado = 0;
}
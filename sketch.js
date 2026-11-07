// ============================================
// SKETCH PRINCIPAL
// ============================================

let estado = "menu";
let modoSeleccionado = "";

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
let mensajeTemp = null;   // mensaje que desaparece solo (ver mostrarMensajeTemporal en ui.js)
let mostrandoResultado = false;
let clienteEnojado = false;

let bolsa = [];
let productoSeleccionado = 0;
let animaciones = [];
let arrastrando = null;   // producto que se está arrastrando con el mouse

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

// ✅ Variables nuevas para la Escena 4
let indiceDecoracionSeleccionada = 0;
let decoracionElegida = "";
let decoracionesRequeridas = [];       // decoraciones que pide la receta (sorteadas)
let decoracionesElegidas = [];         // las que el jugador ya eligió bien
let desplazamientoDecoraciones = 0;    // primera fila visible de la lista
let arrastrandoDeslizador = false;

// Estado de la cocción
let coccionFallida = false;            // quedó crudo o quemado: se puede reintentar
let coccionFallidaDesde = 0;
let coccionExitosa = false;            // quedó en su punto: falta avanzar a la siguiente etapa
let teclaTempDesde = 0;                // para repetir ← → mantenidas
let teclaTempUltimo = 0;

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
    
    // Fotos del modo Cocinero (las recetas sin foto muestran un emoji)
    imagenesRecetas["Medialunas"] = loadImage('assets/recetas/medialuna.jpg');
    imagenesRecetas["Panes"] = imagenesProductos["Pan"];
    imagenesRecetas["Facturas"] = imagenesProductos["Factura"];
    imagenesRecetas["Galletas"] = imagenesProductos["Galleta"];

    console.log("Imágenes cargadas:", imagenesProductos);
}

// Carga una imagen sin trabar el juego si el archivo todavía no existe
// (mientras tanto se usa el emoji del producto)
function cargarImagenOpcional(ruta, destino, clave) {
    loadImage(ruta, img => { destino[clave] = img; }, () => {});
}

function setup() {
    // ---- Plantillas de imágenes (se ven cuando el archivo exista en assets) ----
    cargarImagenOpcional('assets/productos/torta.jpg', imagenesProductos, "Torta");     // Cajero
    cargarImagenOpcional('assets/recetas/torta.jpg', imagenesRecetas, "Tortas");        // Cocinero
    cargarImagenOpcional('assets/productos/alfajor.jpg', imagenesProductos, "Alfajor"); // Cajero
    cargarImagenOpcional('assets/recetas/alfajor.jpg', imagenesRecetas, "Alfajores");   // Cocinero

    createCanvas(900, 600);
    textAlign(CENTER, CENTER);
    textSize(20);
    clienteY = height + 100;
    clienteDestinoY = height - 180;
}

function draw() {
    cursor(ARROW);
    // ✅ LÓGICA DEL HORNO
    if (estado === "cocinero_escena2" && hornoEncendido) {
        let velocidad = map(temperaturaHorno, 0, 300, 0.5, 2.5); 
        progresoHorno += velocidad; 

        let meta = recetaActual.tiempoIdeal * 15; 
        
        if (progresoHorno > meta + 40) {
            fallarCoccion("❌ ¡Se quemó por dejarlo mucho tiempo!");
        }
    }

    // Temperatura con ← → mantenidas
    if (estado === "cocinero_escena2") actualizarTemperaturaMantenida();

    // Si nadie reintenta, cuando termina el aviso el horno se reinicia solo
    if (estado === "cocinero_escena2" && coccionFallida && millis() - coccionFallidaDesde >= AVISO_ERROR_TOTAL) {
        reintentarCoccion();
    }

    if (estado === "menu") {
        dibujarFondo();
        mostrarMenu();
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
    
    // ==========================================
    // ESCENAS DEL COCINERO
    // ==========================================
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

function dibujarEscenaCajero3() {
    dibujarFondo();
}

function dibujarEscenaCajero2() {
    dibujarFondo();
}

// ============================================
// COMENZAR PARTIDA (tecla ENTER o clic en el cartel)
// ============================================
function comenzarPartida() {
    if (modoSeleccionado === "cajero") {
        reiniciarJuego(); 
        cargarCliente(0);
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
        if (key === '1') {
            modoSeleccionado = "cajero";
            estado = "instrucciones";
        }
        if (key === '2') {
            modoSeleccionado = "cocinero";
            estado = "instrucciones";
        }
    }

    // INSTRUCCIONES
    if (estado === "instrucciones") {
        if (keyCode === ENTER || key === 'Enter') {
            comenzarPartida();
            return;   // que esta misma tecla no se procese también en la escena nueva
        }
        if (key === 'Escape') {
            estado = "menu";
        }
    }

    // ==========================================
    // MODO COCINERO: ELEGIR PRODUCTO
    // ==========================================
    if (estado === "cocinero_seleccion") {
        if (key === 'Escape') {
            estado = "menu";
            return;
        }
        let n = recetas.length;
        if (keyCode === LEFT_ARROW) {
            indiceRecetaSeleccionada = (indiceRecetaSeleccionada - 1 + n) % n;
        }
        if (keyCode === RIGHT_ARROW) {
            indiceRecetaSeleccionada = (indiceRecetaSeleccionada + 1) % n;
        }
        if (keyCode === UP_ARROW) {
            let j = indiceRecetaSeleccionada - 3;
            if (j < 0) {
                j += 3 * Math.ceil(n / 3);
                if (j >= n) j -= 3;
            }
            indiceRecetaSeleccionada = j;
        }
        if (keyCode === DOWN_ARROW) {
            let j = indiceRecetaSeleccionada + 3;
            if (j >= n) j = indiceRecetaSeleccionada % 3;
            indiceRecetaSeleccionada = j;
        }
        if (keyCode === ENTER || key === 'Enter') {
            iniciarReceta(indiceRecetaSeleccionada);
        }
        return;
    }

    // ==========================================
    // MODO COCINERO: ESCENA 1 (Preparación)
    // ==========================================
    if (estado === "cocinero_escena1") {
        if (key === 'Escape') {
            estado = "menu";
            return;
        }

        if (keyCode === LEFT_ARROW) {
            indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado - 1 + ingredientesDisponibles.length) % ingredientesDisponibles.length;
        }
        if (keyCode === RIGHT_ARROW) {
            indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado + 1) % ingredientesDisponibles.length;
        }
        if (keyCode === UP_ARROW) {
            indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado - 2 + ingredientesDisponibles.length) % ingredientesDisponibles.length;
        }
        if (keyCode === DOWN_ARROW) {
            indiceIngredienteSeleccionado = (indiceIngredienteSeleccionado + 2) % ingredientesDisponibles.length;
        }

        if (keyCode === ENTER || key === 'Enter') {
            agregarIngrediente(indiceIngredienteSeleccionado);
        }

        if (key === ' ') {
            irAlHorno();
            return;   // que este mismo ESPACIO no se procese también en el horno
        }
    }

    // ==========================================
    // MODO COCINERO: ESCENA 2 (Horno)
    // ==========================================
    if (estado === "cocinero_escena2") {
        if (key === 'Escape') {
            estado = "menu";
            return;
        }

        // Cocción terminada bien: ESPACIO avanza (igual que el cartel)
        if (coccionExitosa) {
            if (key === ' ') avanzarDesdeHorno();
            return;
        }
        // Cocción fallida: R reintenta (igual que el cartel)
        if (coccionFallida) {
            if (key === 'r' || key === 'R') reintentarCoccion();
            return;
        }

        if (!hornoEncendido && progresoHorno === 0) {
            if (keyCode === LEFT_ARROW) {
                temperaturaHorno = Math.max(0, temperaturaHorno - 10);
                teclaTempDesde = millis();    // desde acá cuenta para repetir si la mantiene
                teclaTempUltimo = millis();
            }
            if (keyCode === RIGHT_ARROW) {
                temperaturaHorno = Math.min(300, temperaturaHorno + 10);
                teclaTempDesde = millis();
                teclaTempUltimo = millis();
            }
            if (keyCode === ENTER || key === 'Enter') {
                if (temperaturaHorno < 100) {
                    mostrarAvisoError("❌ ¡El horno está muy frío! Subí la temperatura.");
                } else {
                    hornoEncendido = true;
                    progresoHorno = 0;
                    mensaje = "";
                }
            }
        } else if (hornoEncendido) {
            if (key === ' ') {
                hornoEncendido = false; 
                
                let meta = recetaActual.tiempoIdeal * 15; 
                let margen = 25; 

                if (progresoHorno >= meta - margen && progresoHorno <= meta + margen) {
                    coccionExitosa = true;
                    mensaje = "✅ ¡Perfecto! Quedó en su punto.";
                    mensajeColor = color(0, 150, 0);
                } else {
                    let motivo = progresoHorno < meta ? "crudo" : "quemado";
                    fallarCoccion("❌ ¡Quedó " + motivo + "!");
                }
                return;
            }
        }
    }

    // ==========================================
    // MODO COCINERO: ESCENA 3 (Pintar)
    // ==========================================
    if (estado === "cocinero_escena3") {
        if (key === 'Escape') {
            estado = "menu";
            return;
        }

        if (keyCode === LEFT_ARROW) {
            indiceProductoPintar = (indiceProductoPintar - 1 + 6) % 6;
        }
        if (keyCode === RIGHT_ARROW) {
            indiceProductoPintar = (indiceProductoPintar + 1) % 6;
        }
        if (keyCode === UP_ARROW) {
            indiceProductoPintar = (indiceProductoPintar - 3 + 6) % 6;
        }
        if (keyCode === DOWN_ARROW) {
            indiceProductoPintar = (indiceProductoPintar + 3) % 6;
        }

        if (keyCode === ENTER || key === 'Enter') {
            pintarProducto(indiceProductoPintar);
        }

        if (key === ' ') {
            terminarPintado();
            return;   // que este mismo ESPACIO no se procese también en la decoración
        }
    }

    // ==========================================
    // MODO COCINERO: ESCENA 4 (Decoración)
    // ==========================================
    if (estado === "cocinero_escena4") {
        if (key === 'Escape') {
            estado = "menu";
            return;
        }

        if (keyCode === LEFT_ARROW) {
            indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada - 1 + decoracionesDisponibles.length) % decoracionesDisponibles.length;
        }
        if (keyCode === RIGHT_ARROW) {
            indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada + 1) % decoracionesDisponibles.length;
        }
        if (keyCode === UP_ARROW) {
            indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada - 2 + decoracionesDisponibles.length) % decoracionesDisponibles.length;
        }
        if (keyCode === DOWN_ARROW) {
            indiceDecoracionSeleccionada = (indiceDecoracionSeleccionada + 2) % decoracionesDisponibles.length;
        }

        asegurarDecoracionVisible();   // si la selección bajó o subió de fila, la lista se desliza

        if (keyCode === ENTER || key === 'Enter') {
            agregarDecoracion(indiceDecoracionSeleccionada);
        }

        if (key === ' ') {
            entregarProducto();
            return;
        }
    }

    // ==========================================
    // MODO CAJERO: ESCENA 1
    // ==========================================
    if (estado === "cajero_escena1") {
        if (key === 'Escape') {
            estado = "menu";
            ocultarCliente();
            return;
        }
        if (key === ' ' && clienteVisible) {
            irAArmarPedido();
            return;   // que este mismo ESPACIO no se procese también en la escena de armar el pedido
        }
    }

    // ==========================================
    // MODO CAJERO: ESCENA 3
    // ==========================================
    if (estado === "cajero_escena3") {
        if (key === 'Escape') {
            estado = "menu";
            ocultarCliente();
            return;
        }

        if (keyCode === LEFT_ARROW) {
            productoSeleccionado = (productoSeleccionado - 1 + productos.length) % productos.length;
        }
        if (keyCode === RIGHT_ARROW) {
            productoSeleccionado = (productoSeleccionado + 1) % productos.length;
        }
        if (keyCode === UP_ARROW) {
            productoSeleccionado = (productoSeleccionado - 3 + productos.length) % productos.length;
        }
        if (keyCode === DOWN_ARROW) {
            productoSeleccionado = (productoSeleccionado + 3) % productos.length;
        }
        if (keyCode === ENTER || key === 'Enter') {
            agregarProductoALaBolsa(productoSeleccionado);
        }
        if (key === ' ') {
            irACobrar();
            return;   // que este mismo ESPACIO no se procese también en la caja
        }
    }

    // ==========================================
    // MODO CAJERO: ESCENA 2
    // ==========================================
    if (estado === "cajero_escena2") {
        if (key === 'Escape') {
            estado = "menu";
            ocultarCliente();
            return;
        }

        if (mostrandoResultado) return;

        if (vueltoCorrecto === 0) {
            if (key === ' ') avanzarSinVuelto();
            return;
        }

        if (vueltoCorrecto < 0) return;

        if (key >= '0' && key <= '9') {
            if (inputVuelto.length < 8) inputVuelto += key;
        }
        if (key === '.') {
            if (!inputVuelto.includes('.')) inputVuelto += '.';
        }
        if (keyCode === BACKSPACE) {
            inputVuelto = inputVuelto.slice(0, -1);
        }
        if (keyCode === ENTER || key === 'Enter') {
            confirmarVuelto();
        }
    }

    // FIN
    if (estado === "fin") {
        if (key === 'r' || key === 'R') {
            reiniciarJuego();
            estado = "menu";
        }
        if (key === 'm' || key === 'M') estado = "menu";
    }
}

// ============================================
// EVENTOS DEL MOUSE (escena de armar el pedido)
// ============================================
// Clic sobre un producto  -> lo agrega a la bolsa
// Arrastrar a la bolsa    -> lo agrega a la bolsa
function mousePressed() {
    // Carteles interactivos: el clic hace lo mismo que su tecla
    let cartel = cartelInteractivo();
    if (cartel && mouseSobreAviso(cartel.lineas, cartel.cx, cartel.cy, cartel.nivel)) {
        cartel.accion();
        return;
    }

    // Cocinero: elegir producto / ingrediente con clic
    if (estado === "cocinero_seleccion") {
        let i = recetaBajoMouse();
        if (i >= 0) iniciarReceta(i);
        return;
    }
    if (estado === "cocinero_escena1") {
        let i = ingredienteBajoMouse();
        if (i >= 0) {
            indiceIngredienteSeleccionado = i;
            agregarIngrediente(i);
        }
        return;
    }
    if (estado === "cocinero_escena3") {
        let i = piezaBajoMouse();
        if (i >= 0) {
            indiceProductoPintar = i;
            pintarProducto(i);
        }
        return;
    }
    if (estado === "cocinero_escena4") {
        if (hayDeslizador() && mouseSobreDeslizador()) {
            arrastrandoDeslizador = true;
            desplazarDesdeMouse();
            return;
        }
        let i = decoracionBajoMouse();
        if (i >= 0) {
            indiceDecoracionSeleccionada = i;
            agregarDecoracion(i);
        }
        return;
    }

    if (estado === "cajero_escena3") {
        // Botón "Ir a cobrar"
        if (botonCobrarVisible() && mouseSobreBotonCobrar()) {
            irACobrar();
            return;
        }
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

// Rueda del mouse: desliza la lista de decoraciones
function mouseWheel(event) {
    if (estado === "cocinero_escena4" && hayDeslizador()) {
        desplazamientoDecoraciones = Math.max(0, Math.min(maxDesplazamiento(), desplazamientoDecoraciones + (event.delta > 0 ? 1 : -1)));
        return false;   // que no se mueva la página
    }
}

function mouseReleased() {
    arrastrandoDeslizador = false;
    if (!arrastrando) return;
    let a = arrastrando;
    arrastrando = null;
    if (estado !== "cajero_escena3") return;

    if (!a.movido) {
        agregarProductoALaBolsa(a.indice);                        // clic simple
    } else if (mouseSobreBolsa()) {
        agregarProductoALaBolsa(a.indice, mouseX - 50, mouseY - 40); // arrastrar y soltar
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

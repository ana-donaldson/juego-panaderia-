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
let mostrandoResultado = false;
let clienteEnojado = false;

let bolsa = [];
let productoSeleccionado = 0;
let animaciones = [];

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

// ✅ Variables nuevas para la Escena 4
let indiceDecoracionSeleccionada = 0;
let decoracionElegida = "";

// Variables de Imágenes
let imgCliente;
let imgMostrador;
let imagenesProductos = {};



function preload() {
    imgCliente = loadImage('assets/persona1.png');
    imgMostrador = loadImage('assets/mueblefeo.png');
     imgRecetaActual = loadImage('assets/recetas/medialuna.jpg');
    
    imagenesProductos["Pan"] = loadImage('assets/productos/pan.jpg');
    imagenesProductos["Factura"] = loadImage('assets/productos/factura.jpg');
    imagenesProductos["Medialuna"] = loadImage('assets/productos/medialuna.jpg');
    imagenesProductos["Galleta"] = loadImage('assets/productos/galleta.jpg');
    
    console.log("Imágenes cargadas:", imagenesProductos);
}

function setup() {
    createCanvas(900, 600);
    textAlign(CENTER, CENTER);
    textSize(20);
    clienteY = height + 100;
    clienteDestinoY = height - 180;
}

function draw() {
    // ✅ LÓGICA DEL HORNO
    if (estado === "cocinero_escena2" && hornoEncendido) {
        let velocidad = map(temperaturaHorno, 0, 300, 0.5, 2.5); 
        progresoHorno += velocidad; 

        let meta = recetaActual.tiempoIdeal * 15; 
        
        if (progresoHorno > meta + 40) {
            mensaje = "❌ ¡Se quemó por dejarlo mucho tiempo!";
            mensajeColor = color(200, 0, 0);
            hornoEncendido = false;
            setTimeout(() => {
                progresoHorno = 0;
                mensaje = "";
            }, 2000);
        }
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
            if (modoSeleccionado === "cajero") {
                reiniciarJuego(); 
                cargarCliente(0);
            } else if (modoSeleccionado === "cocinero") {
                estado = "cocinero_escena1";
                recetaActual = recetas[0];
                pasoIngrediente = 0;
                indiceIngredienteSeleccionado = 0; 
                progresoHorno = 0;
                hornoEncendido = false;
                temperaturaHorno = 0;
                productosPintados = []; 
                indiceProductoPintar = 0;
                indiceDecoracionSeleccionada = 0;
                mensaje = "";
            }
        }
        if (key === 'Escape') {
            estado = "menu";
        }
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
            let ingSeleccionado = ingredientesDisponibles[indiceIngredienteSeleccionado];
            let ingNecesario = recetaActual.ingredientes[pasoIngrediente];

            if (ingSeleccionado === ingNecesario) {
                mensaje = "✅ ¡Bien! Agregaste " + ingSeleccionado;
                mensajeColor = color(0, 150, 0);
                pasoIngrediente++;

                if (pasoIngrediente >= recetaActual.ingredientes.length) {
                    mensaje = "✅ ¡Todo listo! Presiona ESPACIO para ir al horno.";
                }
            } else {
                mensaje = "❌ Ese no es el siguiente ingrediente.";
                mensajeColor = color(200, 0, 0);
            }
        }

        if (key === ' ') {
            if (pasoIngrediente >= recetaActual.ingredientes.length) {
                estado = "cocinero_escena2"; 
                mensaje = "";
                temperaturaHorno = 0;
                progresoHorno = 0;
                hornoEncendido = false;
            } else {
                mensaje = "❌ Faltan ingredientes en la mesa.";
                mensajeColor = color(200, 0, 0);
            }
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

        if (!hornoEncendido && progresoHorno === 0) {
            if (keyCode === LEFT_ARROW) {
                temperaturaHorno = Math.max(0, temperaturaHorno - 10);
            }
            if (keyCode === RIGHT_ARROW) {
                temperaturaHorno = Math.min(300, temperaturaHorno + 10);
            }
            if (keyCode === ENTER || key === 'Enter') {
                if (temperaturaHorno < 100) {
                    mensaje = "❌ ¡El horno está muy frío! Subí la temperatura.";
                    mensajeColor = color(200, 0, 0);
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
                    mensaje = "✅ ¡Perfecto! Quedó en su punto.";
                    mensajeColor = color(0, 150, 0);
                    setTimeout(() => {
                        estado = "cocinero_escena3"; 
                        mensaje = "";
                    }, 1500);
                } else {
                    let motivo = progresoHorno < meta ? "crudo" : "quemado";
                    mensaje = "❌ ¡Quedó " + motivo + "!";
                    mensajeColor = color(200, 0, 0);
                    setTimeout(() => {
                        progresoHorno = 0; 
                        mensaje = "";
                    }, 2000);
                }
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
            if (!productosPintados.includes(indiceProductoPintar)) {
                productosPintados.push(indiceProductoPintar);
                mensaje = "✅ ¡Pintado!";
                mensajeColor = color(0, 150, 0);
            } else {
                mensaje = "Ya está pintado";
                mensajeColor = color(200, 100, 0);
            }
        }

        if (key === ' ') {
            if (productosPintados.length === 6) {
                estado = "cocinero_escena4"; 
                mensaje = "";
            } else {
                mensaje = "❌ Faltan pintar algunas";
                mensajeColor = color(200, 0, 0);
            }
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

        if (keyCode === ENTER || key === 'Enter') {
            decoracionElegida = decoracionesDisponibles[indiceDecoracionSeleccionada];
            mensaje = "✅ ¡Elegiste " + decoracionElegida + "!";
            mensajeColor = color(0, 150, 0);
            
            setTimeout(() => {
                estado = "fin"; 
                mensaje = "";
            }, 1500);
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
            estado = "cajero_escena3";
            productoSeleccionado = 0;
            bolsa = [];
            mensaje = "";
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
            if (!bolsaCompleta()) {
                mensaje = "❌ Faltan productos en la bolsa";
                mensajeColor = color(200, 0, 0);
                return;
            }
            estado = "cajero_escena2";
            inputVuelto = "";
            mensaje = "";
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
            if (inputVuelto.length > 0) {
                let ingresado = parseFloat(inputVuelto);
                if (!isNaN(ingresado) && ingresado > pagoCliente) {
                    mensaje = "❌ El vuelto no puede ser mayor a $" + pagoCliente.toFixed(2);
                    mensajeColor = color(200, 0, 0);
                    return;
                }
                verificarVuelto();
            }
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
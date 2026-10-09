let imgPan, imgFactura, imgMedialuna, imgGalleta;

let estado = "menu";
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

let imgCliente;
let imgMostrador;

let imagenesProductos = {}; // Objeto vacío

function preload() {
    imgCliente = loadImage('assets/persona1.png');
    imgMostrador = loadImage('assets/mueblefeo.png');
    
    // Cargar imágenes y guardarlas en el objeto
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
    if (estado === "menu") {
        dibujarFondo();
        mostrarMenu();
    } else if (estado === "instrucciones") {
        dibujarFondo();
        mostrarInstrucciones();
    } else if (estado === "cajero_escena1") {
        dibujarEscenaCajero1();
        mostrarInterfazEscena1();
    } else if (estado === "cajero_escena3") {
        dibujarEscenaCajero3();
        mostrarInterfazEscena3();
    } else if (estado === "cajero_escena2") {
        dibujarEscenaCajero2();
        mostrarInterfazEscena2();
    } else if (estado === "fin") {
        dibujarFondo();
        mostrarFin();
    }
}

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

function keyPressed() {
    // MENÚ
    if (estado === "menu") {
        if (key === '1') estado = "instrucciones";
        if (key === '2') console.log("Modo Cocinero próximamente");
    }

    // INSTRUCCIONES
    if (estado === "instrucciones") {
        if (keyCode === ENTER || key === 'Enter') {
            reiniciarJuego();
            cargarCliente(0);
        }
        if (key === 'Escape') estado = "menu";
    }

    // ESCENA 1
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

    // ESCENA 3
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

    // ESCENA 2
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


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

let imgCliente;
let imgMostrador;


function preload() {
    imgCliente = loadImage('assets/persona1.png');
    imgMostrador = loadImage('assets/mueblefeo.png');
    console.log("Imágenes cargadas");
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
    } else if (estado === "cajero") {
        dibujarEscenaCajero();
        mostrarInterfazCajero();
    } else if (estado === "fin") {
        dibujarFondo();
        mostrarFin();
    }
}


function dibujarEscenaCajero() {
    dibujarFondo();

    if (clienteAnimando) {
        clienteY = lerp(clienteY, clienteDestinoY, 0.05);
        if (abs(clienteY - clienteDestinoY) < 0.5) {
            clienteY = clienteDestinoY;
            clienteAnimando = false;
            clienteVisible = true;
        }
    }

    if (clienteVisible) {
        dibujarCliente(clienteY, clienteEnojado);
    }

    dibujarMostrador();
}

function keyPressed() {
    // --- MENÚ ---
    if (estado === "menu") {
        if (key === '1') {
            estado = "instrucciones";
        }
        if (key === '2') {
            console.log("Modo Cocinero - Próximamente");
        }
    }

    // --- INSTRUCCIONES ---
    if (estado === "instrucciones") {
        if (keyCode === ENTER || key === 'Enter') {
            // Reiniciar todo
            clienteActual = 0;
            puntos = 0;
            vidas = 3;
            clientesAtendidos = 0;
            caja = 500;
            inputVuelto = "";
            mensaje = "";
            mostrandoResultado = false;
            clienteEnojado = false;

            estado = "cajero";
            cargarCliente(0);
        }
        if (key === 'Escape') {
            estado = "menu";
        }
    }

    // --- MODO CAJERO ---
    if (estado === "cajero") {
        if (key === 'Escape') {
            estado = "menu";
            ocultarCliente();
            return;
        }

        if (!clienteVisible || mostrandoResultado) return;

        if (vueltoCorrecto === 0) {
            if (key === ' ') {
                avanzarSinVuelto();
            }
            return;
        }

        if (vueltoCorrecto < 0) {
            return;
        }

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

    // --- PANTALLA FINAL ---
    if (estado === "fin") {
        if (key === 'r' || key === 'R') {
            estado = "menu";
            puntos = 0;
            vidas = 3;
            clientesAtendidos = 0;
            caja = 500;
            clienteActual = 0;
        }
        if (key === 'm' || key === 'M') {
            estado = "menu";
        }
    }
}
// ============================================
// CLIENTE - Dibujo y animación
// ============================================
// ============================================
// CLIENTE - Dibujo con imagen PNG
// ============================================

function dibujarCliente(y, enojado) {
    // Buscamos el nombre del cliente actual para saber qué imagen mostrar
    let nombreCliente = clientes[clienteActual].nombre;
    let imgClienteActual = imagenesClientes[nombreCliente];

    if (imgClienteActual) {
        // ✅ Si la imagen existe, la dibujamos
        let ancho = 250;
        let alto = 250;
        let x = width / 2 - ancho / 2;
           let yPos = y - alto / 2 - 20; // ✅ Sube bastante

        // Si está enojado, le ponemos un filtro rojizo (opcional)
        if (enojado) {
            tint(255, 100, 100); 
        } else {
            tint(255, 255, 255);
        }

        image(imgClienteActual, x, yPos, ancho, alto);
        noTint(); // Quitamos el filtro
    } else {
        // Si no hay imagen, dibuja el monigote viejo
        dibujarClienteFormas(y, enojado);
    }
}
// Función de respaldo (la que ya tenías)
function dibujarClienteFormas(y, enojado) {
    push();
    translate(width / 2, y);
    // ... todo el código de dibujo con las formas ya presentes.
    pop();
}

function mostrarCliente() {
    clienteY = height + 100;
    clienteDestinoY = height - 180;
    clienteAnimando = true;
    clienteVisible = false;
}

function ocultarCliente() {
    clienteY = height + 100;
    clienteVisible = false;
    clienteAnimando = false;
}

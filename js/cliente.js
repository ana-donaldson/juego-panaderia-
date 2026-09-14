// ============================================
// CLIENTE - Dibujo y animación
// ============================================
// ============================================
// CLIENTE - Dibujo con imagen PNG
// ============================================

function dibujarCliente(y, enojado) {
    // Si la imagen existe, dibujarla
    if (imgCliente) {
        // Ajustá estos valores según el tamaño de tu imagen
        let ancho = 180;
        let alto = 250;
        let x = width/2 - ancho/2;
        let yPos = y - alto/2 + 30; // +30 para que quede bien ubicado
        
        // Si está enojado, podrías agregar un filtro rojo (opcional)
        if (enojado) {
            tint(255, 100, 100); // Tinte rojizo
        } else {
            tint(255, 255, 255); // Normal
        }
        
        image(imgCliente, x, yPos, ancho, alto);
        noTint(); // Resetear el tinte
    } else {
        // Si no se cargó la imagen, dibujar el cliente con formas (fallback)
        dibujarClienteFormas(y, enojado);
    }
}

// Función de respaldo (la que ya tenías)
function dibujarClienteFormas(y, enojado) {
    push();
    translate(width / 2, y);
    // ... todo el código de dibujo con formas que ya tenías ...
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
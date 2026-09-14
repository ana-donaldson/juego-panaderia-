
function dibujarFondo() {
    background(245, 235, 220);

    fill(240, 230, 215);
    rect(0, 0, width, height - 100);

    fill(200, 180, 160);
    rect(0, height - 100, width, 100);

    fill(180, 160, 140);
    rect(0, height - 100, width, 5);
}
function dibujarMostrador() {
    if (imgMostrador) {
        let alto = 200;
        image(imgMostrador, 0, height - alto, width, alto);
    } else {
        dibujarMostradorFormas();
    }
}

function dibujarMostradorFormas() {
    fill(160, 130, 100);
    rect(0, height - 180, width, 180);
    fill(180, 150, 120);
    rect(0, height - 180, width, 15);
    fill(140, 110, 80);
    rect(50, height - 100, 150, 5);
    rect(700, height - 100, 150, 5);
    fill(120, 90, 60);
    rect(width / 2 - 80, height - 120, 160, 40, 5);
    fill(100, 70, 40);
    ellipse(width / 2, height - 100, 10, 10);
}

function mostrarMenu() {
    fill(100, 50, 20);
    textSize(50);
    text("🥖 PANADERÍA", width / 2 + 3, 123);
    fill(139, 69, 19);
    text("🥖 PANADERÍA", width / 2, 120);

    fill(100, 50, 20);
    textSize(26);
    text('"Del Horno a la Mano"', width / 2, 173);
    fill(80, 40, 10);
    text('"Del Horno a la Mano"', width / 2, 170);

    fill(0);
    textSize(22);
    text("Presiona 1 → Modo Cajero", width / 2, 280);
    text("Presiona 2 → Modo Cocinero (próximamente)", width / 2, 330);

    fill(150);
    textSize(14);
    text("v2.0 - Modo Cajero Mejorado", width / 2, 480);
}

// PANTALLA DE INSTRUCCIONES

function mostrarInstrucciones() {
    fill(139, 69, 19);
    textSize(36);
    text("🎮 INSTRUCCIONES", width / 2, 70);

    fill(255, 255, 255, 230);
    rect(width / 2 - 300, 110, 600, 320, 15);

    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);

    let x = width / 2 - 260;
    let y = 130;

    text("📌 Tu tarea:", x, y);
    text("   Atender a los clientes y darles el vuelto correcto.", x, y + 30);

    text("⌨️ CONTROLES:", x, y + 80);
    text("   Números (0-9)  → Escribir el vuelto", x, y + 110);
    text("   . (Punto)      → Punto decimal", x, y + 140);
    text("   ENTER          → Confirmar el vuelto", x, y + 170);
    text("   BACKSPACE      → Borrar el último dígito", x, y + 200);
    text("   ESC            → Volver al menú", x, y + 230);

    text("🎯 OBJETIVO:", x, y + 275);
    text("   Atender a 5 clientes sin perder todas las vidas.", x, y + 305);

    textAlign(CENTER, CENTER);
    fill(139, 69, 19);
    rect(width / 2 - 120, 450, 240, 50, 10);
    fill(255);
    textSize(20);
    text("▶  PRESIONA ENTER", width / 2, 475);

    fill(100);
    textSize(14);
    text("(Presiona ENTER para empezar)", width / 2, 530);
}

// INTERFAZ DEL CAJERO

function mostrarInterfazCajero() {
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text("⭐ Puntos: " + puntos, 20, 20);
    text("❤️ Vidas: " + vidas, 20, 50);
    text("👥 Clientes: " + clientesAtendidos + "/" + clientesMaximos, 20, 80);

    textAlign(RIGHT, TOP);
    textSize(20);
    if (caja < 0) {
        fill(200, 0, 0);
    } else if (caja < 100) {
        fill(200, 150, 0);
    } else {
        fill(0, 150, 0);
    }
    text("💰 Caja: $" + caja.toFixed(2), width - 20, 20);

    textAlign(CENTER, CENTER);

    if (clienteVisible && !mostrandoResultado) {

        let rect1X = 200;
        let rect1Y = 80;
        let rect1W = 500;
        let rect1H = 120;

        fill(255, 255, 255, 220);
        rect(rect1X, rect1Y, rect1W, rect1H, 10);

        fill(0);
        textSize(18);
        text("🧑 " + clientes[clienteActual].nombre, 450, 110);

        textSize(15);
        let pedidoTexto = "";
        for (let i = 0; i < pedidoActual.length; i++) {
            let item = pedidoActual[i];
            pedidoTexto += item.cantidad + " x " + item.producto + " ($" + (item.cantidad * item.precio).toFixed(2) + ")";
            if (i < pedidoActual.length - 1) pedidoTexto += ", ";
        }
        text(pedidoTexto, 450, 140);

        text("💰 TOTAL: $" + totalCorrecto.toFixed(2) + "   💵 Paga con: $" + pagoCliente, 450, 170);

        let rect2X = 250;
        let rect2Y = 280;
        let rect2W = 400;
        let rect2H = 130;

        if (vueltoCorrecto > 0) {
            fill(255, 255, 255, 200);
            rect(rect2X, rect2Y, rect2W, rect2H, 10);

            fill(0);
            textSize(18);
            text("🔄 ¿Cuál es el VUELTO?", 450, 310);

            textSize(30);
            fill(50, 50, 200);
            text("$ " + inputVuelto + "|", 450, 355);

            fill(100);
            textSize(14);
            text("Escribe el vuelto y presiona ENTER", 450, 395);

        } else if (vueltoCorrecto === 0) {
            let rect2B = 250;
            let rect2C = 280;
            let rect2D = 400;
            let rect2E = 80;

            fill(255, 255, 255, 200);
            rect(rect2B, rect2C, rect2D, rect2E, 10);

            fill(0);
            textSize(18);
            text("✅ ¡El cliente paga exacto!", 450, 315);
            text("Presiona ESPACIO para continuar", 450, 345);

        } else {
            let rect2B = 250;
            let rect2C = 280;
            let rect2D = 400;
            let rect2E = 80;

            fill(255, 200, 200);
            rect(rect2B, rect2C, rect2D, rect2E, 10);

            fill(200, 0, 0);
            textSize(16);
            text("⚠️ El cliente no tiene suficiente dinero", 450, 315);
            text("Presiona ESC para cancelar", 450, 345);
        }

        if (mensaje !== "") {
            fill(mensajeColor);
            textSize(18);
            text(mensaje, width / 2, 460);
        }

        fill(150);
        textSize(13);
        text("ESC para volver al menú", width / 2, height - 20);

    } else if (clienteAnimando) {
        fill(100);
        textSize(20);
        text("👋 El cliente está llegando...", width / 2, height / 2 + 50);
    }
}

// ============================================
// PANTALLA FINAL
// ============================================
function mostrarFin() {
    fill(0);
    textSize(30);

    if (caja <= 0) {
        text("💀 ¡LA PANADERÍA QUEBRÓ!", width / 2, 160);
        text("Te quedaste sin dinero en caja", width / 2, 210);
        text("Atendiste " + clientesAtendidos + " clientes", width / 2, 260);
        text("⭐ Puntuación: " + puntos, width / 2, 310);
    } else if (vidas <= 0) {
        text("💀 GAME OVER", width / 2, 200);
        text("Atendiste " + clientesAtendidos + " clientes", width / 2, 250);
        text("⭐ Puntuación: " + puntos, width / 2, 300);
    } else {
        text("🎉 ¡PANADERO EXCEPCIONAL!", width / 2, 180);
        text("Atendiste a TODOS los clientes", width / 2, 230);
        text("💰 Caja final: $" + caja.toFixed(2), width / 2, 280);
        text("⭐ Puntuación final: " + puntos, width / 2, 330);
    }

    textSize(18);
    text("Presiona R para reiniciar", width / 2, 400);
    text("Presiona M para volver al menú", width / 2, 440);
}
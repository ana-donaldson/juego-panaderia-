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
function mostrarMenu(modoSeleccionado) {
    // Título
     textAlign(CENTER, CENTER);
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

    // OPCIÓN 1: MODO CAJERO
    let yCajero = 280;
    if (modoSeleccionado === "cajero") {
        fill(255, 220, 100); // Brillo
        stroke(200, 150, 0);
        strokeWeight(4);
    } else {
        fill(255, 255, 255, 150);
        noStroke();
    }
    rect(width / 2 - 200, yCajero - 30, 400, 60, 10);
    noStroke();
    fill(0);
    textSize(22);
    text("Modo Cajero", width / 2, yCajero);

    // OPCIÓN 2: MODO COCINERO
    let yCocinero = 360;
    if (modoSeleccionado === "cocinero") {
        fill(255, 220, 100); // Brillo
        stroke(200, 150, 0);
        strokeWeight(4);
    } else {
        fill(255, 255, 255, 150);
        noStroke();
    }
    rect(width / 2 - 200, yCocinero - 30, 400, 60, 10);
    noStroke();
    fill(0);
    textSize(22);
    text("Modo Cocinero", width / 2, yCocinero);

    // Instrucción
    fill(150);
    textSize(16);
    text("Usa ↑ ↓ para elegir y ENTER para jugar", width / 2, 480);
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

    if (modoSeleccionado === "cocinero") {
        // ✅ ACÁ REVISAMOS SI PERDIÓ O GANÓ
        if (vidasCocinero <= 0) {
            text("💀 GAME OVER", width / 2, 200);
            text("Te equivocaste demasiadas veces.", width / 2, 250);
            textSize(18);
            text("¡Intentá de nuevo!", width / 2, 300);
        } else {
            text("🎉 ¡DELICIOSO!", width / 2, 200);
            text("Preparaste " + recetaActual.nombre, width / 2, 250);
            if (decoracionElegida !== "") text("Con: " + decoracionElegida, width / 2, 290);
            textSize(18);
            text("¡Sos un maestro pastelero!", width / 2, 350);
        }
    } 
    else if (caja <= 0) {
        text("💀 ¡LA PANADERÍA QUEBRÓ!", width / 2, 160);
        text("Te quedaste sin dinero en caja.", width / 2, 210);
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
    text("Presiona R para reiniciar", width / 2, 450);
    text("Presiona M para volver al menú", width / 2, 490);
}
// ============================================
// ESCENA 1: ATENCIÓN AL CLIENTE
// ============================================
function mostrarInterfazEscena1() {
    // Info superior
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text("⭐ Puntos: " + puntos, 20, 20);
    text("❤️ Vidas: " + vidas, 20, 50);
    text("👥 Clientes: " + clientesAtendidos + "/" + clientesMaximos, 20, 80);

    textAlign(RIGHT, TOP);
    textSize(20);
    if (caja < 0) fill(200, 0, 0);
    else if (caja < 100) fill(200, 150, 0);
    else fill(0, 150, 0);
    text("💰 Caja: $" + caja.toFixed(2), width - 20, 20);

    textAlign(CENTER, CENTER);

    if (clienteVisible && !clienteAnimando) {
        // --- DIÁLOGO DEL CLIENTE ---
        fill(255, 255, 255, 230);
        rect(width / 2 - 250, 60, 500, 140, 10);

        fill(0);
        textSize(20);
        text("🧑 " + clientes[clienteActual].nombre, width / 2, 90);

        textSize(15);
        let pedidoTexto = "";
        for (let i = 0; i < pedidoActual.length; i++) {
            let item = pedidoActual[i];
            pedidoTexto += item.cantidad + " x " + item.producto;
            if (i < pedidoActual.length - 1) pedidoTexto += ", ";
        }
        text("Quiero: " + pedidoTexto, width / 2, 130);
        text("💵 Paga con: $" + pagoCliente, width / 2, 160);

        // Instrucción (destacada)
        dibujarCartelInteractivo();
    } else if (clienteAnimando) {
        fill(100);
        textSize(20);
        text("👋 El cliente está llegando...", width / 2, height / 2 + 50);
    }
}

// ============================================
// ESCENA 3: ARMAR PEDIDO
// ============================================
function mostrarInterfazEscena3() {
    // Info superior
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text("⭐ Puntos: " + puntos, 20, 20);
    text("❤️ Vidas: " + vidas, 20, 50);
    text("👥 Clientes: " + clientesAtendidos + "/" + clientesMaximos, 20, 80);

    textAlign(RIGHT, TOP);
    textSize(20);
    if (caja < 0) fill(200, 0, 0);
    else if (caja < 100) fill(200, 150, 0);
    else fill(0, 150, 0);
    text("💰 Caja: $" + caja.toFixed(2), width - 20, 20);

    textAlign(CENTER, CENTER);

    // Título
    fill(139, 69, 19);
    textSize(28);
    text("🥖 ARMÁ EL PEDIDO", width / 2, 120);

    // Pedido a armar
    fill(0);
    textSize(16);
    let pedidoTexto = "Pedido: ";
    for (let i = 0; i < pedidoActual.length; i++) {
        let item = pedidoActual[i];
        pedidoTexto += item.cantidad + " x " + item.producto;
        if (i < pedidoActual.length - 1) pedidoTexto += ", ";
    }
    text(pedidoTexto, width / 2, 160);

    // Productos en una sola fila
    let productosMostrar = productos;
    let anchoProducto = 132;
    let altoProducto = 150;
    let espacio = 10;
    let totalAncho = productosMostrar.length * anchoProducto + (productosMostrar.length - 1) * espacio;
    let inicioX = width / 2 - totalAncho / 2;

    for (let i = 0; i < productosMostrar.length; i++) {
        let x = inicioX + i * (anchoProducto + espacio);
        let y = 190;

        // Resaltar el seleccionado
        if (i === productoSeleccionado) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else {
            fill(255, 255, 255, 220);
            noStroke();
        }
        rect(x, y, anchoProducto, altoProducto, 10);
        noStroke();

        // ✅ IMAGEN DEL PRODUCTO (desde el objeto imagenesProductos)
        let img = imagenesProductos[productosMostrar[i].nombre];
        if (img) {
            image(img, x + 10, y + 5, 112, 84);
        } else {
            fill(200, 180, 140);
            ellipse(x + anchoProducto / 2, y + 50, 80, 80);
            if (productosMostrar[i].emoji) {   // sin foto: se muestra el emoji
                fill(0);
                textSize(40);
                text(productosMostrar[i].emoji, x + anchoProducto / 2, y + 50);
            }
        }

        // Nombre del producto
        fill(0);
        textSize(14);
        text(productosMostrar[i].nombre, x + anchoProducto / 2, y + 115);

        // Precio
        fill(100);
        textSize(13);
        text("$" + productosMostrar[i].precio.toFixed(2), x + anchoProducto / 2, y + 135);
    }

    // Bolsa (se resalta cuando se arrastra un producto encima)
    if (arrastrando && arrastrando.movido && mouseSobreBolsa()) {
        fill(230, 200, 130);
        stroke(200, 150, 0);
        strokeWeight(4);
    } else {
        fill(200, 180, 140);
    }
    rect(width / 2 - 200, 370, 400, 100, 10);
    noStroke();

    fill(0);
    textSize(16);
    text("🛍️ BOLSA:", width / 2, 390);

          // Dibujar los productos dentro de la bolsa uno por uno
    if (bolsa.length === 0) {
        fill(80);
        textSize(14);
        text("(vacía) — hacé clic o arrastrá productos acá", width / 2, 430);
    } else {
        let inicioXBolsa = width / 2 - 170;
        let yBolsa = 415;
        let anchoIcono = 40;
        let espacioIcono = 10;

        for (let i = 0; i < bolsa.length; i++) {
            let prod = bolsa[i];
            let x = inicioXBolsa + i * (anchoIcono + espacioIcono);
            
            // Si el mouse está encima de este icono
            let sobreIcono = mouseX > x && mouseX < x + anchoIcono && mouseY > yBolsa - 20 && mouseY < yBolsa + 20;

            if (sobreIcono) {
                // Si pasa el mouse, mostramos fondo rojo y la "X"
                fill(255, 200, 200);
                rect(x, yBolsa - 20, anchoIcono, 40, 5);
                fill(200, 0, 0);
                textSize(20);
                text("X", x + anchoIcono/2, yBolsa);
                cursor(HAND);
            } else {
                // Si no, mostramos la imagen del producto
                let img = imagenesProductos[prod.nombre];
                if (img) {
                    image(img, x, yBolsa - 20, anchoIcono, 40);
                } else {
                    fill(200);
                    rect(x, yBolsa - 20, anchoIcono, 40);
                }
            }
        }
    }
    // Cartel de aviso (dura 5 s y se difumina en 2 s) o, con el pedido armado
    // y sin cartel en pantalla, el botón "Ir a cobrar" en ese mismo lugar
    if (botonCobrarVisible()) {
        dibujarAviso("Ir a cobrar", width / 2, 497, "fuerte");
    } else if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 497, "suave", mensajeColor, alfaMensaje());
    }

    // Instrucciones (destacadas, una línea debajo de la otra)
    dibujarCartelInteractivo();

    // Producto que se está arrastrando con el mouse
    if (arrastrando && arrastrando.movido) {
        let prodArrastre = productos[arrastrando.indice];
        let imgArrastre = imagenesProductos[prodArrastre.nombre];
        if (imgArrastre) {
            image(imgArrastre, mouseX - 60, mouseY - 45, 120, 90);
        } else if (prodArrastre.emoji) {   // sin foto: se arrastra el emoji
            push();
            fill(0);
            textSize(50);
            text(prodArrastre.emoji, mouseX, mouseY);
            pop();
        }
    }

    // Cursor de mano sobre los productos
    if (arrastrando && arrastrando.movido) cursor('grabbing');
    else if (productoBajoMouse() >= 0 || (botonCobrarVisible() && mouseSobreBotonCobrar())) cursor(HAND);

    // Dibujar animaciones de productos volando a la bolsa
    dibujarAnimaciones();
}
// ============================================
// ESCENA 3: CAJA REGISTRADORA
// ============================================
function mostrarInterfazEscena2() {
    // Info superior
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text("⭐ Puntos: " + puntos, 20, 20);
    text("❤️ Vidas: " + vidas, 20, 50);
    text("👥 Clientes: " + clientesAtendidos + "/" + clientesMaximos, 20, 80);

    textAlign(RIGHT, TOP);
    textSize(20);
    if (caja < 0) fill(200, 0, 0);
    else if (caja < 100) fill(200, 150, 0);
    else fill(0, 150, 0);
    text("💰 Caja: $" + caja.toFixed(2), width - 20, 20);

    textAlign(CENTER, CENTER);

    // Título
    fill(139, 69, 19);
    textSize(28);
    text("💰 CAJA REGISTRADORA", width / 2, 120);

    // Resumen de la compra
    fill(255, 255, 255, 220);
    rect(width / 2 - 200, 160, 400, 100, 10);

    fill(0);
    textSize(18);
    text("TOTAL: $" + totalCorrecto.toFixed(2), width / 2, 190);
    text("PAGA CON: $" + pagoCliente, width / 2, 220);

    // Área de ingreso del vuelto
    if (vueltoCorrecto > 0) {
        fill(255, 255, 255, 220);
        rect(width / 2 - 200, 290, 400, 120, 10);

        fill(0);
        textSize(18);
        text("🔄 ¿CUÁL ES EL VUELTO?", width / 2, 315);

        textSize(32);
        fill(50, 50, 200);
        text("$ " + inputVuelto + "|", width / 2, 360);

        fill(100);
        textSize(14);
        text("Escribí el vuelto y presioná ENTER o el botón", width / 2, 395);
    } else if (vueltoCorrecto === 0) {
        fill(255, 255, 255, 220);
        rect(width / 2 - 200, 290, 400, 80, 10);

        fill(0);
        textSize(18);
        text("✅ ¡El cliente paga exacto!", width / 2, 320);
        text("Presioná ESPACIO para continuar", width / 2, 350);
    }

    // Mensaje de resultado
    if (mensaje !== "") {
        let alfa = alfaMensaje();   // los avisos temporales se difuminan solos
        fill(red(mensajeColor), green(mensajeColor), blue(mensajeColor), alfa);
        textSize(16);
        text(mensaje, width / 2, 505);
    }

    // Botón "Dar vuelto" (clic = tecla ENTER)
    dibujarCartelInteractivo();

    // Instrucciones
    fill(100);
    textSize(13);
    text("ESC para volver al menú", width / 2, height - 20);
}

// ============================================
// AGREGAR PRODUCTO A LA BOLSA (escena 2)
// ============================================
function agregarProductoALaBolsa(indice, xOrigen, yOrigen) {
    if (indice < 0 || indice >= productos.length) return;

    let producto = productos[indice];

    let pedidoItem = pedidoActual.find(p => p.producto === producto.nombre);
    let cantidadPedida = pedidoItem ? pedidoItem.cantidad : 0;

    // Contar cuántos de ese producto ya están en la bolsa
      let enBolsa = bolsa.filter(p => p.nombre === producto.nombre).length;
    if (enBolsa >= cantidadPedida && cantidadPedida > 0) { // ✅ SOLUCIONADO
        mostrarAvisoError("❌ Ya agregaste todos los " + producto.nombre);
        return;
    }

   // ✅ Agregar a la bolsa
    bolsa.push(producto);
    mostrarMensajeTemporal("✅ " + producto.nombre + " agregado", color(0, 150, 0));

    // ✅ CREAR ANIMACIÓN
    // Calcular posición inicial (donde está el producto)
    let productosMostrar = productos;
    let anchoProducto = 132;
    let espacio = 10;
    let totalAncho = productosMostrar.length * anchoProducto + (productosMostrar.length - 1) * espacio;
    let inicioX = width / 2 - totalAncho / 2;
    let xInicial = (xOrigen !== undefined) ? xOrigen : inicioX + indice * (anchoProducto + espacio) + 10;
    let yInicial = (yOrigen !== undefined) ? yOrigen : 190 + 5;

    // Posición final (la bolsa)
    let xFinal = width / 2;
    let yFinal = 420;

    // Crear la animación
    animaciones.push({
        img: imagenesProductos[producto.nombre],
        emoji: producto.emoji,
        x: xInicial,
        y: yInicial,
        xInicial: xInicial,
        yInicial: yInicial,
        xFinal: xFinal,
        yFinal: yFinal,
        progreso: 0
    });
}
function dibujarAnimaciones() {
    for (let i = animaciones.length - 1; i >= 0; i--) {
        let anim = animaciones[i];
        
        // Avanzar el progreso
        anim.progreso += 0.05;
        
        // Interpolar posición
        anim.x = lerp(anim.xInicial, anim.xFinal, anim.progreso);
        anim.y = lerp(anim.yInicial, anim.yFinal, anim.progreso);
        
        // Dibujar la imagen con transparencia (se desvanece)
        let alpha = map(anim.progreso, 0, 1, 255, 0);
        tint(255, alpha);
        if (anim.img) {
            image(anim.img, anim.x, anim.y, 100, 80);
        } else if (anim.emoji) {   // sin foto: vuela el emoji
            push();
            fill(0, alpha);
            textSize(50);
            text(anim.emoji, anim.x + 50, anim.y + 40);
            pop();
        }
        noTint();
        
        // Si terminó, eliminar la animación
        if (anim.progreso >= 1) {
            animaciones.splice(i, 1);
        }
    }
}

// ============================================
// AVISOS DESTACADOS (cartel con remarco y hover)
// ============================================
// lineas: un texto o una lista de textos (uno debajo del otro)
// nivel:  "fuerte" (llamado principal) o "suave" (recordatorio o mensaje)
// col:    color opcional del borde y del texto (nivel "suave")
// alfa:   opcional, 0-255 (255 = totalmente visible). Sirve para el difuminado.
function dibujarAviso(lineas, cx, cy, nivel, col, alfa) {
    if (alfa === undefined) alfa = 255;
    if (alfa <= 0) return;
    if (!Array.isArray(lineas)) lineas = String(lineas).split("\n");
    let fuerte = (nivel === "fuerte");
    let tam = fuerte ? 20 : 14;
    let altoLinea = tam + 6;
    let medidas = medirAviso(lineas, nivel);
    let ancho = medidas.ancho;
    let alto = medidas.alto;

    push();
    textStyle(BOLD);
    textSize(tam);
    textAlign(CENTER, CENTER);

    // ¿El mouse está encima?
    let encima = mouseX > cx - ancho / 2 && mouseX < cx + ancho / 2 &&
                 mouseY > cy - alto / 2 && mouseY < cy + alto / 2;

    translate(cx, cy);
    if (encima) scale(1.04);

    // Sombra
    noStroke();
    fill(80, 40, 10, 50 * alfa / 255);
    rect(-ancho / 2 + 3, -alto / 2 + 4, ancho, alto, 12);

    // Fondo y borde
    if (fuerte) {
        let pulso = 3 + sin(frameCount * 0.08);          // latido suave del borde
        if (encima) fill(160, 82, 30, alfa); else fill(139, 69, 19, alfa);
        stroke(217, 164, 65, alfa);
        strokeWeight(encima ? 5 : pulso);
    } else {
        if (encima) fill(255, 238, 195, alfa); else fill(255, 248, 232, alfa);
        if (col !== undefined) stroke(red(col), green(col), blue(col), alfa);
        else stroke(217, 164, 65, alfa);
        strokeWeight(encima ? 3 : 2);
    }
    rect(-ancho / 2, -alto / 2, ancho, alto, 12);

    // Texto
    noStroke();
    if (fuerte) fill(255, alfa);
    else if (col !== undefined) fill(red(col), green(col), blue(col), alfa);
    else fill(100, 50, 20, alfa);
    let y0 = -((lineas.length - 1) * altoLinea) / 2;
    for (let i = 0; i < lineas.length; i++) text(lineas[i], 0, y0 + i * altoLinea);
    pop();
}

// ============================================
// MENSAJES TEMPORALES (5 s visibles + 2 s de difuminado)
// ============================================
const MENSAJE_DURACION = 5000;   // ms que el cartel se ve completo
const MENSAJE_DIFUMINADO = 3000; // ms que tarda en desaparecer
// Avisos de equivocación: duran 5 s EN TOTAL (2 s completos + 3 s de difuminado)
const AVISO_ERROR_TOTAL = 5000;

// Muestra un mensaje que desaparece solo.
// esError = true -> aviso de equivocación (5 s en total, incluyendo el difuminado)
function mostrarMensajeTemporal(texto, col, esError) {
    mensaje = texto;
    mensajeColor = col;
    let visible = esError ? AVISO_ERROR_TOTAL - MENSAJE_DIFUMINADO : MENSAJE_DURACION;
    mensajeTemp = { texto: texto, inicio: millis(), visible: visible };
}

// Aviso de equivocación (rojo por defecto): 5 s en total, 2 s de difuminado
function mostrarAvisoError(texto, col) {
    mostrarMensajeTemporal(texto, col !== undefined ? col : color(200, 0, 0), true);
}

// Transparencia actual del mensaje (255 = visible, 0 = ya desapareció).
// Los mensajes que no son temporales siempre devuelven 255.
function alfaMensaje() {
    if (mensajeTemp === null || mensaje !== mensajeTemp.texto) return 255;
    let t = millis() - mensajeTemp.inicio;
    if (t < mensajeTemp.visible) return 255;
    if (t >= mensajeTemp.visible + MENSAJE_DIFUMINADO) {
        mensaje = "";
        mensajeTemp = null;
        return 0;
    }
    return 255 * (1 - (t - mensajeTemp.visible) / MENSAJE_DIFUMINADO);
}

// ============================================
// AYUDAS PARA EL MOUSE (escena de armar el pedido)
// ============================================
// Rectángulo de cada producto (mismas medidas que en el dibujo)
function rectProducto(i) {
    let cantidad = productos.length, ancho = 132, alto = 150, espacio = 10;
    let totalAncho = cantidad * ancho + (cantidad - 1) * espacio;
    let inicioX = width / 2 - totalAncho / 2;
    return { x: inicioX + i * (ancho + espacio), y: 190, w: ancho, h: alto };
}

// Índice del producto que está bajo el mouse (-1 si no hay ninguno)
function productoBajoMouse() {
    for (let i = 0; i < productos.length; i++) {
        let r = rectProducto(i);
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
    }
    return -1;
}

function mouseSobreBolsa() {
    return mouseX >= width / 2 - 200 && mouseX <= width / 2 + 200 && mouseY >= 370 && mouseY <= 470;
}

// Botón "Ir a cobrar": aparece con el pedido armado, cuando ya no hay un
// cartel temporal ocupando su lugar
function botonCobrarVisible() {
    if (!bolsaCompleta()) return false;
    let cartelTemporal = mensajeTemp !== null && mensaje === mensajeTemp.texto;
    return !cartelTemporal;
}

function mouseSobreBotonCobrar() {
    return mouseSobreAviso("Ir a cobrar", width / 2, 497, "fuerte");
}

// ============================================
// CARTELES INTERACTIVOS (equivalen a una tecla)
// ============================================
// Tamaño de un cartel (las mismas medidas que usa dibujarAviso)
function medirAviso(lineas, nivel) {
    if (!Array.isArray(lineas)) lineas = String(lineas).split("\n");
    let fuerte = (nivel === "fuerte");
    push();
    textStyle(BOLD);
    textSize(fuerte ? 20 : 14);
    let ancho = 0;
    for (let i = 0; i < lineas.length; i++) ancho = Math.max(ancho, textWidth(lineas[i]));
    pop();
    ancho += fuerte ? 60 : 36;
    let alto = lineas.length * ((fuerte ? 20 : 14) + 6) + 12 + (fuerte ? 10 : 0);
    return { ancho: ancho, alto: alto };
}

function mouseSobreAviso(lineas, cx, cy, nivel) {
    let m = medirAviso(lineas, nivel);
    return mouseX > cx - m.ancho / 2 && mouseX < cx + m.ancho / 2 &&
           mouseY > cy - m.alto / 2 && mouseY < cy + m.alto / 2;
}

// Cartel interactivo de la pantalla actual (o null si no hay):
// { lineas, cx, cy, nivel, col, alfa, accion }
// "accion" es la MISMA función que ejecuta la tecla correspondiente.
function cartelInteractivo() {
    if (estado === "instrucciones") {
        return { lineas: "Haz click aquí o presiona la tecla ENTER para comenzar",
                 cx: width / 2, cy: 480, nivel: "fuerte", accion: comenzarPartida };
    }
    if (estado === "cajero_escena1") {
        if (!(clienteVisible && !clienteAnimando)) return null;
        return { lineas: "Haz click aquí o presiona la tecla ESPACIO para comenzar el pedido",
                 cx: width / 2, cy: 245, nivel: "fuerte", accion: irAArmarPedido };
    }
    if (estado === "cajero_escena2") {
        if (mostrandoResultado || !(vueltoCorrecto > 0)) return null;
        return { lineas: "Dar vuelto", cx: width / 2, cy: 445, nivel: "fuerte", accion: confirmarVuelto };
    }
    if (estado === "cajero_escena3") {
        return { lineas: [
                    "Presione las teclas '← →' para seleccionar un producto y 'ENTER' para agregarlo",
                    "Haz click aquí o presiona la tecla 'ESPACIO' para ir a cobrar"
                 ], cx: width / 2, cy: 563, nivel: "suave", accion: irACobrar };
    }
    if (estado === "cocinero_escena1") {
        if (pasoIngrediente >= recetaActual.ingredientes.length) {
            return { lineas: "¡Todo listo! Haz click aquí o presiona la tecla ESPACIO para ir al horno",
                     cx: width / 2, cy: 565, nivel: "fuerte", accion: irAlHorno };
        }
        return { lineas: [
                    "Presione las teclas '← → ↑ ↓' y 'ENTER', o haga clic en un ingrediente, para agregarlo",
                    "Haz click aquí o presiona la tecla 'ESPACIO' para ir al horno"
                 ], cx: width / 2, cy: 565, nivel: "suave", accion: irAlHorno };
    }
    if (estado === "cocinero_escena2") {
        if (coccionExitosa) {
            return { lineas: "Haz click aquí o presiona la tecla ESPACIO para " + siguienteEtapa("cocinero_escena2").texto,
                     cx: width / 2, cy: 569, nivel: "fuerte", accion: avanzarDesdeHorno };
        }
        if (coccionFallida) {
            let alfa = alfaMensaje();
            if (mensaje === "" || alfa <= 0) return null;
            return { lineas: mensaje, cx: width / 2, cy: 122, nivel: "suave",
                     col: mensajeColor, alfa: alfa, accion: reintentarCoccion };
        }
        return null;
    }
    if (estado === "cocinero_escena3") {
        if (productosPintados.length === 6) {
            return { lineas: "¡Todo pintado! Haz click aquí o presiona la tecla ESPACIO para " + siguienteEtapa("cocinero_escena3").texto,
                     cx: width / 2, cy: 569, nivel: "fuerte", accion: terminarPintado };
        }
        return { lineas: [
                    "Presione las teclas '← → ↑ ↓' y 'ENTER', o haga clic en una pieza, para pintarla",
                    "Haz click aquí o presiona la tecla 'ESPACIO' para terminar"
                 ], cx: width / 2, cy: 569, nivel: "suave", accion: terminarPintado };
    }
    if (estado === "cocinero_escena4") {
        if (decoracionesElegidas.length >= decoracionesRequeridas.length) {
            return { lineas: "¡Decoración lista! Haz click aquí o presiona la tecla ESPACIO para entregar",
                     cx: width / 2, cy: 569, nivel: "fuerte", accion: entregarProducto };
        }
        return { lineas: [
                    "Presione las teclas '← → ↑ ↓' y 'ENTER', o haga clic en una decoración, para agregarla",
                    "Haz click aquí o presiona la tecla 'ESPACIO' para entregar"
                 ], cx: width / 2, cy: 569, nivel: "suave", accion: entregarProducto };
    }
    return null;
}

// Dibuja el cartel interactivo actual (con manito al pasar el mouse)
function dibujarCartelInteractivo() {
    let c = cartelInteractivo();
    if (!c) return;
    dibujarAviso(c.lineas, c.cx, c.cy, c.nivel, c.col, c.alfa);
    if (mouseSobreAviso(c.lineas, c.cx, c.cy, c.nivel)) cursor(HAND);
}
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
    text("   Atender a los clientes y darles el vuelto.", x, y + 30);

    text("⌨️ CONTROLES:", x, y + 80);
    text("   Números (0-9)  → Escribir el vuelto", x, y + 110);
    text("   . (Punto)      → Punto decimal", x, y + 140);
    text("   ENTER          → Confirmar el vuelto", x, y + 170);
    text("   BACKSPACE      → Borrar el último dígito", x, y + 200);
    text("   ESC            → Volver al menú", x, y + 230);

    text("🎯 OBJETIVO:", x, y + 275);
    text("   Atender a 5 clientes.", x, y + 305);

    textAlign(CENTER, CENTER);
    dibujarCartelInteractivo(); // Usa los carteles de Coro
}

// ============================================
// TEMPORIZADOR Y RANKING (dibujo)
// ============================================
// Reloj de la partida (arriba, al centro): cuenta hacia arriba y se congela al terminar
function dibujarTemporizador() {
    let seg = Math.floor(segundosTranscurridos());
    push();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(16);
    fill(60);
    text("⏱️ " + Math.floor(seg / 60) + ":" + String(seg % 60).padStart(2, "0"), width / 2, 16);
    pop();
}
// Tabla de mejores jugadores del menú: 30 s completa + 5 s de difuminado, y después no se dibuja
// Tabla de mejores jugadores del menú: siempre visible
function dibujarRanking() {
    // Si todavía no cargaron los datos, no dibujamos nada
    if (rankingEstado !== "ok") return;

    push();

    // Definimos el tamaño de las tablas
    let ancho = 220;
    let x = width - ancho - 20; // Pegado al costado derecho
    let yCajero = 120; // Arriba
    let yCocinero = 360; // Abajo

    // ==========================================
    // TABLA 1: CAJERO (Arriba)
    // ==========================================
    dibujarTablaRanking(x, yCajero, ancho, "🏆 MEJORES CAJEROS", rankingDatos.cajero);

    // ==========================================
    // TABLA 2: COCINERO (Abajo)
    // ==========================================
    dibujarTablaRanking(x, yCocinero, ancho, "🏆 MEJORES COCINEROS", rankingDatos.cocinero);

    pop();
}

// Función auxiliar para dibujar una tabla sola
function dibujarTablaRanking(x, y, ancho, titulo, datos) {
    let filas = datos ? datos.length : 0;
    if (filas === 0) filas = 1; // Para que el cuadro no quede achatado si está vacío
    
    // Calculamos el alto dinámicamente según los jugadores (máximo 10)
    let filasMostrar = Math.min(filas, 10);
    let alto = 50 + filasMostrar * 20 + 10;

    noStroke();
    fill(80, 40, 10, 50);
    rect(x + 3, y + 4, ancho, alto, 12); // Sombra
    fill(255, 248, 232);
    stroke(217, 164, 65);
    strokeWeight(2);
    rect(x, y, ancho, alto, 12); // Fondo
    noStroke();

    textStyle(BOLD);
    textSize(14);
    textAlign(CENTER, CENTER);
    fill(139, 69, 19);
    text(titulo, x + ancho / 2, y + 22);

    textSize(13);
    fill(100, 50, 20);
    
    if (!datos || datos.length === 0) {
        text("Sin puntajes aún", x + ancho / 2, y + 50);
    } else {
        for (let i = 0; i < filasMostrar; i++) {
            let f = datos[i];
            let fy = y + 45 + i * 20;
            let nombre = String(f.nombre);
            
            if (nombre.length > 12) nombre = nombre.substring(0, 11) + "…";
            
            textAlign(LEFT, CENTER);
            text(f.posicion + ".", x + 10, fy);
            text(nombre, x + 30, fy);
            
            textAlign(RIGHT, CENTER);
            text(f.puntaje, x + ancho - 10, fy);
        }
    }
}
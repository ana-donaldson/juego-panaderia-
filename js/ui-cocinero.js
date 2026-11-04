function mostrarInstruccionesCocinero() {
    fill(139, 69, 19);
    textSize(36);
    text("👨‍🍳 INSTRUCCIONES - COCINERO", width / 2, 70);

    fill(255, 255, 255, 230);
    rect(width / 2 - 300, 110, 600, 320, 15);

    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);

    let x = width / 2 - 260;
    let y = 130;

    text("📌 Tu tarea:", x, y);
    text("   Preparar la receta siguiendo los pasos.", x, y + 30);

    text("⌨️ CONTROLES:", x, y + 80);
    text("   ← → ↑ ↓  → Seleccionar ingredientes/herramientas", x, y + 110);
    text("   ENTER    → Confirmar acción", x, y + 140);
    text("   ESPACIO  → Hornear / Avanzar", x, y + 170);
    text("   ESC      → Volver al menú", x, y + 200);

    text("🎯 OBJETIVO:", x, y + 250);
    text("   Completar la receta sin quemar la comida.", x, y + 280);

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
function mostrarInterfazCocinero1() {
    // --- PANEL IZQUIERDO: Lista de Ingredientes ---
    fill(255, 255, 255, 220);
    rect(20, 20, 250, 250, 10);

        // Mostrar Vidas (Arriba a la derecha)
    fill(0);
    textAlign(RIGHT, TOP);
    textSize(20);
    text("❤️ Vidas: " + vidasCocinero, width - 30, 30);
    textAlign(CENTER, CENTER); // Volver a centrar para el resto del código
    
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Receta: " + recetaActual.nombre, 145, 45);
    
    textAlign(LEFT, CENTER);
    textSize(14);
        let yIng = 80;
    for (let i = 0; i < recetaActual.ingredientes.length; i++) {
        let ing = recetaActual.ingredientes[i];
        
        // ✅ Verificamos si el ingrediente está en la lista de los que ya pusimos
        let agregado = ingredientesEnBowl.includes(ing);

        if (agregado) {
            fill(0, 150, 0);
            text("✅ " + ing, 40, yIng);
        } else {
            fill(100);
            text("⬜ " + ing, 40, yIng);
        }
        yIng += 30;
    }

    if (imgRecetaActual) {
        image(imgRecetaActual, width / 2 - 60, 20, 120, 80);
    } else {
        fill(200);
        rect(width / 2 - 60, 20, 120, 80, 10);
        fill(100);
        textAlign(CENTER, CENTER);
        textSize(12);
        text("[Foto]", width / 2, 60);
    }

    // --- BOWL CENTRAL (Donde caen los ingredientes) ---
    fill(150, 150, 150);
    ellipse(width / 2, 200, 150, 100); // El bol
    fill(100);
    text("Bowl", width / 2, 200);
    
    // --- ABAJO: Mesa de trabajo (horizontal) ---
    fill(180, 140, 100); // Color madera
    rect(0, 350, width, 250); // La mesa ocupa todo el ancho abajo

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Mesa de trabajo", width / 2, 380);

    // Dibujar ingredientes en fila horizontal
    let inicioX = 100;
    let anchoCaja = 100;
    let altoCaja = 80;
    let espacio = 20;

    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let x = inicioX + i * (anchoCaja + espacio);
        let y = 450;

        // Resaltar el seleccionado
        if (i === indiceIngredienteSeleccionado) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(4);
        } else {
            fill(255, 255, 255);
            noStroke();
        }
        rect(x, y, anchoCaja, altoCaja, 10);
        noStroke();

        fill(0);
        textSize(14);
        text(ingredientesDisponibles[i], x + anchoCaja / 2, y + altoCaja / 2);
    }

    // Mensaje de estado
    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(18);
        text(mensaje, width / 2, height - 30);
    }

    // Instrucciones de teclado
    fill(255);
    textSize(14);
    text("← → Seleccionar  |  ENTER Agregar al Bowl  |  ESPACIO Ir al Horno", width / 2, height - 10);
}
function mostrarInterfazCocinero2() {
    // Título
    fill(139, 69, 19);
    textSize(28);
    text("🔥 HORNEANDO", width / 2, 50);

    // Recuadro del horno
    fill(80, 80, 80); // Gris oscuro
    rect(100, 100, 700, 400, 20);

    // Ventanita del horno
    fill(40, 40, 40);
    rect(150, 150, 600, 250, 10);

    // Dibujar la comida adentro del horno (por ahora un rectángulo naranja)
    if (hornoEncendido) {
        fill(255, 150, 50); // Naranja brillante
    } else {
        fill(200, 150, 100); // Masa cruda
    }
    rect(350, 220, 200, 100, 10);

    // Panel de control del horno
    fill(255, 255, 255, 220);
    rect(250, 420, 400, 120, 10);

    // ==========================================
    // TEMPERATURA
    // ==========================================
    fill(0);
    textSize(18);
    text("Temperatura:", 300, 450);
    
    // Si está encendido, mostrar la que eligió, si no, la de la receta como guía
    textSize(24);
    text(temperaturaHorno + "°C", 300, 480);

    // Indicador de si está bien o mal (solo cuando está encendido)
    if (hornoEncendido) {
        if (temperaturaHorno === recetaActual.temperatura) {
            fill(0, 150, 0); // Verde
        } else {
            fill(200, 0, 0); // Rojo
        }
        textSize(14);
        text("(Receta: " + recetaActual.temperatura + "°C)", 300, 510);
    }
    // ==========================================
    // BARRA DE TIEMPO
    // ==========================================
    fill(0);
    textSize(18);
    text("Tiempo:", 650, 450);

    // Fondo de la barra (Ahora mide 300 de ancho)
    fill(200);
    rect(450, 470, 300, 20, 5);

    // Relleno de la barra
    if (hornoEncendido || progresoHorno > 0) {
        fill(255, 100, 0);
        rect(450, 470, progresoHorno, 20, 5);
    }

    // Meta ideal (Calculada para que la línea verde esté en el lugar correcto)
    let metaX = 450 + (recetaActual.tiempoIdeal * 15); // 👈 Multiplicamos por 15
    stroke(0, 255, 0);
    strokeWeight(3);
    line(metaX, 465, metaX, 495);
    noStroke();
    // ==========================================
    // INSTRUCCIONES
    // ==========================================
    fill(100);
    textSize(14);
    if (!hornoEncendido) {
        text("← → Ajustar Temp  |  ENTER Encender Horno", width / 2, height - 30);
    } else {
        text("¡Cuidado! Presioná ESPACIO justo en la línea verde", width / 2, height - 30);
    }

    // Mensaje (error o acierto)
    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(18);
        text(mensaje, width / 2, 580);
    }
}

function mostrarInterfazCocinero3() {
    // Título
    fill(139, 69, 19);
    textSize(28);
    text("🥐 DAR BRILLO", width / 2, 50);

    // Bandeja de horno
    fill(100, 100, 100);
    rect(100, 100, 700, 400, 20);

    // Instrucción
    fill(0);
    textSize(18);
    text("Usá las flechas para pintar todas las " + recetaActual.nombre + " con huevo.", width / 2, 130);

    // Dibujar los productos en la bandeja
    let totalProductos = 6; // Simulamos una bandeja con 6 medialunas
    let inicioX = 180;
    let inicioY = 200;
    
    for (let i = 0; i < totalProductos; i++) {
        let col = i % 3; // 3 columnas
        let fil = Math.floor(i / 3); // 2 filas
        let x = inicioX + col * 200;
        let y = inicioY + fil * 160;

        // Color de la masa (cambia si ya está pintada)
        if (productosPintados.includes(i)) {
            fill(255, 200, 100); // Dorado/Brillante
        } else {
            fill(240, 220, 190); // Masa cruda
        }
        
        // Dibujamos la medialuna (por ahora un óvalo)
        ellipse(x, y, 120, 80);

        // Si está seleccionada con el cursor, le ponemos un borde
        if (i === indiceProductoPintar) {
            stroke(255, 0, 0);
            strokeWeight(4);
            noFill();
            ellipse(x, y, 130, 90);
            noStroke();
        }
    }

    // Barra de progreso del brillo
    let progreso = (productosPintados.length / totalProductos) * 100;
    fill(200);
    rect(250, 520, 400, 20, 10);
    fill(255, 200, 0);
    rect(250, 520, map(progreso, 0, 100, 0, 400), 20, 10);
    
    fill(0);
    textSize(14);
    text("Progreso: " + Math.floor(progreso) + "%", width / 2, 560);

    // Instrucciones abajo
    fill(100);
    textSize(14);
    text("← → ↑ ↓ Moverse  |  ENTER Pintar  |  ESPACIO Terminar", width / 2, height - 20);

    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(16);
        text(mensaje, width / 2, 590);
    }
}
function mostrarInterfazCocinero4() {
    // Título
    fill(139, 69, 19);
    textSize(28);
    text("🎂 DECORACIÓN FINAL", width / 2, 50);

    // Mostrar el producto ya horneado y brillante
    fill(255, 200, 100);
    rect(250, 100, 400, 200, 20);
    fill(0);
    textSize(20);
    text("Producto Listo:", width / 2, 130);
    text(recetaActual.nombre, width / 2, 170);

    // Panel de decoraciones
    fill(255, 255, 255, 220);
    rect(200, 330, 500, 150, 10);

    fill(0);
    textSize(18);
    text("Elegí la decoración:", width / 2, 360);

    // Grilla de 2x2 para las 4 decoraciones
    let inicioX = 250;
    let inicioY = 390;
    let anchoCaja = 200;
    let altoCaja = 40;
    
    for (let i = 0; i < decoracionesDisponibles.length; i++) {
        let col = i % 2;
        let fil = Math.floor(i / 2);
        let x = inicioX + col * (anchoCaja + 20);
        let y = inicioY + fil * (altoCaja + 10);

        // Resaltar si está seleccionado
        if (i === indiceDecoracionSeleccionada) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else {
            fill(255, 255, 255);
            noStroke();
        }
        rect(x, y, anchoCaja, altoCaja, 5);
        noStroke();

        fill(0);
        textSize(14);
        text(decoracionesDisponibles[i], x + anchoCaja / 2, y + altoCaja / 2);
    }

    // Instrucciones
    fill(100);
    textSize(14);
    text("← → ↑ ↓ Seleccionar  |  ENTER Confirmar y Entregar", width / 2, height - 30);

    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(16);
        text(mensaje, width / 2, 520);
    }
}
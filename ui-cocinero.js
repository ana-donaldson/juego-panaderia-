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
    text("   ENTER o CLIC → Confirmar acción", x, y + 140);
    text("   ESPACIO  → Hornear / Avanzar", x, y + 170);
    text("   ESC      → Volver al menú", x, y + 200);

    text("🎯 OBJETIVO:", x, y + 250);
    text("   Completar la receta sin quemar la comida.", x, y + 280);

    textAlign(CENTER, CENTER);
    dibujarAviso("Presione la tecla 'ENTER' para comenzar", width / 2, 480, "fuerte");
}
function mostrarInterfazCocinero1() {
    // Título
    fill(139, 69, 19);
    textSize(28);
    text("👨‍🍳 PREPARACIÓN", width / 2, 50);

    // ==========================================
    // PANEL IZQUIERDO: La Receta
    // ==========================================
    fill(255, 255, 255, 220);
    rect(50, 80, 350, 450, 10);

    fill(0);
    textSize(20);
    text("Receta: " + recetaActual.nombre, 225, 110);

    // Foto de la receta (Simulada con un rectángulo por ahora)
    // En mostrarInterfazCocinero1()
if (imgRecetaActual) {
    image(imgRecetaActual, 100, 130, 250, 150);
} else {
    fill(200); rect(100, 130, 250, 150, 10); // El recuadro gris
    textSize(60);
    text(recetaActual.emoji || "🍽️", 225, 205);  // sin foto: se muestra el emoji
}
    // Lista de ingredientes necesarios
    fill(0);
    textSize(16);
    text("Ingredientes necesarios:", 80, 310);
    
    let yIng = 340;
    for (let i = 0; i < recetaActual.ingredientes.length; i++) {
        let ing = recetaActual.ingredientes[i];
        let agregado = pasoIngrediente > i; // Si ya lo agregó

        if (agregado) {
            fill(0, 150, 0); // Verde si ya está
            text("✅ " + ing, 80, yIng);
        } else {
            fill(0);
            text("⬜ " + ing, 80, yIng);
        }
        yIng += 30;
    }

    // ==========================================
    // PANEL DERECHO: La Mesa de Ingredientes
    // ==========================================
    fill(255, 255, 255, 220);
    rect(450, 80, 400, 450, 10);

    fill(0);
    textSize(18);
    text("Mesa de trabajo:", 650, 110);

    // Dibujar ingredientes disponibles (grilla de 2x4)
    let inicioX = 480;
    let inicioY = 150;
    let anchoCaja = 160;
    let altoCaja = 80;
    let espacioX = 20;
    let espacioY = 20;

    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let col = i % 2;
        let fil = Math.floor(i / 2);
        let x = inicioX + col * (anchoCaja + espacioX);
        let y = inicioY + fil * (altoCaja + espacioY);

        // Resaltar si está seleccionado
        if (i === indiceIngredienteSeleccionado) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else {
            fill(255, 255, 255);
            noStroke();
        }
        rect(x, y, anchoCaja, altoCaja, 10);
        noStroke();

        // Nombre del ingrediente
        fill(0);
        textSize(16);
        text(ingredientesDisponibles[i], x + anchoCaja / 2, y + altoCaja / 2);
    }

    // Mensaje de estado
    if (mensaje !== "") {
        let alfa = alfaMensaje();   // los mensajes temporales se difuminan solos
        fill(red(mensajeColor), green(mensajeColor), blue(mensajeColor), alfa);
        textSize(18);
        text(mensaje, 650, 480);
    }

    // Manito al pasar el mouse sobre un ingrediente
    if (ingredienteBajoMouse() >= 0) cursor(HAND);

    // Instrucciones abajo (destacadas)
    dibujarAviso([
        "Presione las teclas '← → ↑ ↓' y 'ENTER', o haga clic en un ingrediente, para agregarlo",
        "Presione la tecla 'ESPACIO' para ir al horno"
    ], width / 2, 565, "suave");
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
    // Temperatura pedida por la receta (cartel resaltado)
    dibujarAviso("🌡️ Temperatura pedida: " + recetaActual.temperatura + "°C", width / 2, 176, "suave");

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
    if (!hornoEncendido) {
        dibujarAviso([
            "Presione las teclas '← →' para ajustar la temperatura",
            "Presione la tecla 'ENTER' para encender el horno"
        ], width / 2, 569, "suave");
    } else {
        dibujarAviso([
            "¡Cuidado!",
            "Presione la tecla 'ESPACIO' justo en la línea verde"
        ], width / 2, 569, "suave");
    }

    // Mensaje (error o acierto)
    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 122, "suave", mensajeColor);
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
    text("Usá las flechas para pintar con huevo todo el lote de " + recetaActual.nombre + ".", width / 2, 130);

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
    
    push();
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(14);
    text("Progreso: " + Math.floor(progreso) + "%", 660, 530);
    pop();

    // Instrucciones abajo (destacadas)
    dibujarAviso([
        "Presione las teclas '← → ↑ ↓' para moverse",
        "Presione la tecla 'ENTER' para pintar y 'ESPACIO' para terminar"
    ], width / 2, 569, "suave");

    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 82, "suave", mensajeColor);
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

    // Instrucciones (destacadas)
    dibujarAviso([
        "Presione las teclas '← → ↑ ↓' para seleccionar la decoración",
        "Presione la tecla 'ENTER' para confirmar y entregar"
    ], width / 2, 569, "suave");

    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(16);
        text(mensaje, width / 2, 520);
    }
}

// ============================================
// ESCENA 0: ELEGIR QUÉ PRODUCTO PREPARAR
// ============================================
// Rectángulo de cada tarjeta (3 columnas)
function rectReceta(i) {
    let ancho = 240, alto = 170, espacio = 30;
    let inicioX = width / 2 - (3 * ancho + 2 * espacio) / 2;
    return { x: inicioX + (i % 3) * (ancho + espacio), y: 100 + Math.floor(i / 3) * (alto + espacio), w: ancho, h: alto };
}

// Índice de la receta bajo el mouse (-1 si no hay ninguna)
function recetaBajoMouse() {
    for (let i = 0; i < recetas.length; i++) {
        let r = rectReceta(i);
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
    }
    return -1;
}

function mostrarSeleccionReceta() {
    fill(139, 69, 19);
    textSize(28);
    text("👨‍🍳 ¿QUÉ VAS A PREPARAR?", width / 2, 50);

    for (let i = 0; i < recetas.length; i++) {
        let r = rectReceta(i);
        let rec = recetas[i];

        if (i === indiceRecetaSeleccionada) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else {
            fill(255, 255, 255, 220);
            noStroke();
        }
        rect(r.x, r.y, r.w, r.h, 10);
        noStroke();

        // Foto (o emoji si todavía no hay foto)
        let img = imagenesRecetas[rec.nombre];
        if (img) {
            image(img, r.x + 40, r.y + 8, 160, 100);
        } else {
            fill(235, 215, 180);
            rect(r.x + 40, r.y + 8, 160, 100, 8);
            fill(0);
            textSize(50);
            text(rec.emoji || "🍽️", r.x + r.w / 2, r.y + 58);
        }

        fill(0);
        textSize(18);
        text(rec.nombre, r.x + r.w / 2, r.y + 130);
        fill(100);
        textSize(13);
        text(rec.ingredientes.length + " ingredientes · " + rec.temperatura + "°C", r.x + r.w / 2, r.y + 153);
    }

    if (recetaBajoMouse() >= 0) cursor(HAND);

    dibujarAviso([
        "Presione las teclas '← → ↑ ↓' y 'ENTER', o haga clic en un producto, para elegirlo",
        "Presione la tecla 'ESC' para volver al menú"
    ], width / 2, 565, "suave");
}

// Arranca la preparación de la receta elegida
function iniciarReceta(i) {
    indiceRecetaSeleccionada = i;
    recetaActual = recetas[i];
    imgRecetaActual = imagenesRecetas[recetaActual.nombre] || null;
    estado = "cocinero_escena1";
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

// ============================================
// ESCENA 1: INGREDIENTES (teclado y mouse)
// ============================================
// Rectángulo de cada ingrediente (mismas medidas que en mostrarInterfazCocinero1)
function rectIngrediente(i) {
    let ancho = 160, alto = 80, espacioX = 20, espacioY = 20;
    return { x: 480 + (i % 2) * (ancho + espacioX), y: 150 + Math.floor(i / 2) * (alto + espacioY), w: ancho, h: alto };
}

// Índice del ingrediente bajo el mouse (-1 si no hay ninguno)
function ingredienteBajoMouse() {
    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let r = rectIngrediente(i);
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
    }
    return -1;
}

// Agrega el ingrediente (lo usan ENTER y el clic del mouse)
function agregarIngrediente(indice) {
    let ingSeleccionado = ingredientesDisponibles[indice];
    let ingNecesario = recetaActual.ingredientes[pasoIngrediente];

    if (ingSeleccionado === ingNecesario) {
        mostrarMensajeTemporal("✅ ¡Bien! Agregaste " + ingSeleccionado, color(0, 150, 0));
        pasoIngrediente++;

        if (pasoIngrediente >= recetaActual.ingredientes.length) {
            mensaje = "✅ ¡Todo listo! Presiona ESPACIO para ir al horno.";
        }
    } else {
        mensaje = "❌ Ese no es el siguiente ingrediente.";
        mensajeColor = color(200, 0, 0);
    }
}

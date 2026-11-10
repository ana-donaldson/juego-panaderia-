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
    dibujarCartelInteractivo();
}function mostrarInterfazCocinero1() {
    // --- PANEL IZQUIERDO: Lista de Ingredientes ---
    fill(255, 255, 255, 220);
    rect(20, 20, 250, 250, 10);
    
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Receta: " + recetaActual.nombre, 145, 45);
    
    textAlign(LEFT, CENTER);
    textSize(14);
    let yIng = 80;
    for (let i = 0; i < recetaActual.ingredientes.length; i++) {
        let ing = recetaActual.ingredientes[i];
        
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

    // --- ARRIBA CENTRO: Foto de la receta ---
    if (imagenesRecetas[recetaActual.nombre]) {
        image(imagenesRecetas[recetaActual.nombre], width / 2 - 60, 20, 120, 80);
    } else {
        fill(200); rect(width / 2 - 60, 20, 120, 80, 10);
        fill(100); textSize(12); text("[Foto]", width / 2, 60);
    }

    // --- EL BOL CENTRAL ---
    // ✅ SI YA ESTÁ LISTA LA MASA, NO DIBUJAMOS EL BOL GRIS
    if (ingredientesEnBowl.length === recetaActual.ingredientes.length) {
        if (imagenesRecetas["Masa"]) {
            image(imagenesRecetas["Masa"], width / 2 - 90, 160, 180, 120);
        } else {
            fill(240, 220, 180);
            ellipse(width / 2, 220, 160, 110);
            fill(150, 100, 50);
            textSize(16);
            text("¡Masa Lista!", width / 2, 220);
        }
    } else {
        // Si todavía NO terminó, dibujamos el bol gris y los ingredientes
        fill(150, 150, 150);
        ellipse(width / 2, 220, 160, 120);
        fill(120, 120, 120);
        ellipse(width / 2, 225, 160, 110); // El 3D

        if (ingredientesEnBowl.length === 0) {
            fill(80);
            textSize(14);
            text("Tirá los ingredientes acá", width / 2, 220);
        } else {
            for (let i = 0; i < ingredientesEnBowl.length; i++) {
                let ing = ingredientesEnBowl[i];
                let img = imagenesIngredientes[ing];
                
                let angulo = (i / recetaActual.ingredientes.length) * TWO_PI;
                let x = width / 2 + cos(angulo) * 40;
                let y = 220 + sin(angulo) * 30;

                if (img) {
                    image(img, x - 20, y - 20, 40, 40);
                } else {
                    fill(255, 100, 100);
                    rect(x - 15, y - 15, 30, 30);
                }
            }
        }
    }

    // --- ABAJO: Mesa de trabajo ---
    fill(180, 140, 100);
    rect(0, 350, width, 250);
    fill(0);
    textSize(16);
    text("Mesa de trabajo", width / 2, 380);

    let inicioX = 100;
    let anchoCaja = 100;
    let altoCaja = 80;
    let espacio = 20;

    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let x = inicioX + i * (anchoCaja + espacio);
        let y = 450;

        if (i === indiceIngredienteSeleccionado) {
            fill(255, 220, 100); stroke(200, 150, 0); strokeWeight(4);
        } else {
            fill(255, 255, 255); noStroke();
        }
        rect(x, y, anchoCaja, altoCaja, 10);
        noStroke();

        let img = imagenesIngredientes[ingredientesDisponibles[i]];
        if (img) {
            image(img, x + 20, y + 10, 60, 60);
        } else {
            fill(0); textSize(14);
            text(ingredientesDisponibles[i], x + anchoCaja / 2, y + altoCaja / 2);
        }
    }

    // Instrucciones y mensajes
    if (mensaje !== "") {
        fill(mensajeColor);
        textSize(18);
        text(mensaje, width / 2, height - 30);
    }

    fill(0);
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
    if (coccionFallida || coccionExitosa) {
        // sin instrucciones del horno: abajo (o arriba, si falló) va el cartel interactivo
    } else if (!hornoEncendido) {
        dibujarAviso([
            "Presione las teclas '← →' (o manténgalas) para ajustar la temperatura",
            "Presione la tecla 'ENTER' para encender el horno"
        ], width / 2, 569, "suave");
    } else {
        dibujarAviso([
            "¡Cuidado!",
            "Presione la tecla 'ESPACIO' justo en la línea verde"
        ], width / 2, 569, "suave");
    }

    // Mensaje (error o acierto). Si la cocción falló, el cartel de reintento lo dibuja dibujarCartelInteractivo()
    if (mensaje !== "" && !coccionFallida) {
        dibujarAviso(mensaje, width / 2, 122, "suave", mensajeColor, alfaMensaje());
    }
    dibujarCartelInteractivo();
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
    text("Usá las flechas o hacé clic para pintar con huevo todo el lote de " + recetaActual.nombre + ".", width / 2, 130);

    // Dibujar los productos en la bandeja
    let totalProductos = 6; // Simulamos una bandeja con 6 medialunas
    let inicioX = 180;
    let inicioY = 200;
    
    for (let i = 0; i < totalProductos; i++) {
        let col = i % 3; // 3 columnas
        let fil = Math.floor(i / 3); // 2 filas
        let x = inicioX + col * 200;
        let y = inicioY + fil * 160;

        // Imagen de la pieza: sin huevo / con huevo (si todavía no hay imagen, queda el óvalo)
        let imgPieza = imagenesPintado[recetaActual.nombre + (productosPintados.includes(i) ? "_con" : "_sin")];
        if (imgPieza) {
            image(imgPieza, x - 60, y - 40, 120, 80);
        } else {
            if (productosPintados.includes(i)) {
                fill(255, 200, 100); // Dorado/Brillante
            } else {
                fill(240, 220, 190); // Masa cruda
            }
            ellipse(x, y, 120, 80);
        }

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

    // Manito al pasar el mouse sobre una pieza
    if (piezaBajoMouse() >= 0) cursor(HAND);

    // Instrucciones abajo (cartel interactivo: clic = tecla ESPACIO)
    dibujarCartelInteractivo();

    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 82, "suave", mensajeColor, alfaMensaje());
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

    // Decoraciones que pide la receta (se sortean al empezar; ✅ = ya elegida)
    let lista = decoracionesRequeridas.map(d => (decoracionesElegidas.includes(d) ? "✅ " : "⬜ ") + d).join("   ");
    dibujarAviso(["Decoraciones de la receta:", lista], width / 2, 235, "suave");

    // Grilla de 2 columnas (se ven 2 filas; el resto se desliza)
    let anchoCaja = 200;
    let altoCaja = 40;

    for (let i = 0; i < decoracionesDisponibles.length; i++) {
        let r = rectDecoracion(i);
        if (!r) continue;   // fuera de la zona visible

        // Resaltar si está seleccionado (verde si ya fue elegida)
        if (i === indiceDecoracionSeleccionada) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else if (decoracionesElegidas.includes(decoracionesDisponibles[i])) {
            fill(200, 240, 200);
            noStroke();
        } else {
            fill(255, 255, 255);
            noStroke();
        }
        rect(r.x, r.y, anchoCaja, altoCaja, 5);
        noStroke();

        fill(0);
        textSize(14);
        text(decoracionesDisponibles[i], r.x + anchoCaja / 2, r.y + altoCaja / 2);
    }

    dibujarDeslizadorDecoraciones();
    if (decoracionBajoMouse() >= 0 || (hayDeslizador() && mouseSobreDeslizador())) cursor(HAND);

    // Instrucciones (cartel interactivo: clic = tecla ESPACIO)
    dibujarCartelInteractivo();

    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 515, "suave", mensajeColor, alfaMensaje());
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
    vidasCocinero = 3; 
    indiceRecetaSeleccionada = i;
    recetaActual = recetas[i];

    ingredientesEnBowl = [];
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
    coccionFallida = false;
    coccionExitosa = false;
    decoracionElegida = "";
    decoracionesElegidas = [];
    decoracionesRequeridas = recetaActual.necesitaDecoracion ? sortearDecoraciones(recetaActual) : [];
    desplazamientoDecoraciones = 0;
    mensaje = "";
    iniciarTemporizador();   // el tiempo corre desde que se elige la receta
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
    } else {
        mostrarAvisoError("❌ Ese no es el siguiente ingrediente.");
    }
}

// ============================================
// AVANZAR DE ETAPA (las usan las teclas y los carteles interactivos)
// ============================================
// Etapa que sigue a la actual según lo que necesita la receta
function siguienteEtapa(actual) {
    if (actual === "cocinero_escena2" && recetaActual.necesitaBrillo) return { estado: "cocinero_escena3", texto: "dar brillo" };
    if (actual !== "cocinero_escena4" && recetaActual.necesitaDecoracion) return { estado: "cocinero_escena4", texto: "decorar" };
    return { estado: "fin", texto: "entregar" };
}

function irAlHorno() {
    // ✅ Cambiamos pasoIngrediente por ingredientesEnBowl
    if (ingredientesEnBowl.length < recetaActual.ingredientes.length) {
        mostrarAvisoError("❌ Faltan ingredientes en la mesa.");
        return;
    }
    estado = "cocinero_escena2";
    mensaje = "";
    temperaturaHorno = 0;
    progresoHorno = 0;
    hornoEncendido = false;
    coccionFallida = false;
    coccionExitosa = false;
}

// Horno -> siguiente etapa (solo si la cocción salió bien)
function avanzarDesdeHorno() {
    if (!coccionExitosa) return;
    estado = siguienteEtapa("cocinero_escena2").estado;
    coccionExitosa = false;
    mensaje = "";
}

// Pintado -> siguiente etapa (solo si están todas pintadas)
function terminarPintado() {
    if (productosPintados.length < 6) {
        mostrarAvisoError("❌ Faltan pintar algunas");
        return;
    }
    estado = siguienteEtapa("cocinero_escena3").estado;
    mensaje = "";
}

// Decoración -> pantalla final (solo si están todas las decoraciones de la receta)
function entregarProducto() {
    if (decoracionesElegidas.length < decoracionesRequeridas.length) {
        mostrarAvisoError("❌ Faltan decoraciones de la receta");
        return;
    }
    decoracionElegida = decoracionesElegidas.join(", ");
    estado = "fin";
    mensaje = "";
}

// ============================================
// COCCIÓN FALLIDA Y REINTENTO
// ============================================
function fallarCoccion(texto) {
    hornoEncendido = false;
    coccionFallida = true;
    coccionFallidaDesde = millis();
    mostrarAvisoError(texto + "\nHaz click aquí o presiona la tecla R para reintentar");
}

// Vuelve a dejar el horno listo para otro intento (la usan la tecla R y el cartel)
function reintentarCoccion() {
    if (!coccionFallida) return;
    coccionFallida = false;
    hornoEncendido = false;
    progresoHorno = 0;
    mensaje = "";
    mensajeTemp = null;
}

// Temperatura del horno manteniendo ← o → (cada paso = 10 °C)
function actualizarTemperaturaMantenida() {
    if (hornoEncendido || progresoHorno !== 0 || coccionFallida || coccionExitosa) return;
    let dir = (keyIsDown(RIGHT_ARROW) ? 1 : 0) - (keyIsDown(LEFT_ARROW) ? 1 : 0);
    if (dir === 0) { teclaTempDesde = 0; return; }
    if (teclaTempDesde === 0) {   // tecla ya sostenida: empezar a contar desde ahora
        teclaTempDesde = millis();
        teclaTempUltimo = millis();
        return;
    }
    if (millis() - teclaTempDesde >= 400 && millis() - teclaTempUltimo >= 150) {
        temperaturaHorno = Math.max(0, Math.min(300, temperaturaHorno + dir * 10));
        teclaTempUltimo = millis();
    }
}

// ============================================
// PINTAR CON HUEVO (teclado y mouse)
// ============================================
// Índice de la pieza bajo el mouse (-1 si no hay ninguna). Mismas posiciones que en mostrarInterfazCocinero3
function piezaBajoMouse() {
    for (let i = 0; i < 6; i++) {
        let x = 180 + (i % 3) * 200;
        let y = 200 + Math.floor(i / 3) * 160;
        let dx = (mouseX - x) / 60, dy = (mouseY - y) / 40;
        if (dx * dx + dy * dy <= 1) return i;
    }
    return -1;
}

// Pinta una pieza (la usan ENTER y el clic del mouse)
function pintarProducto(indice) {
    if (!productosPintados.includes(indice)) {
        productosPintados.push(indice);
        mensaje = "✅ ¡Pintado!";
        mensajeColor = color(0, 150, 0);
    } else {
        mostrarAvisoError("Ya está pintado", color(200, 100, 0));
    }
}

// ============================================
// DECORACIONES (teclado, mouse y deslizador)
// ============================================
const DECORACIONES_FILAS_VISIBLES = 2;

// Rectángulo de cada decoración (null si está fuera de la zona visible)
function rectDecoracion(i) {
    let fil = Math.floor(i / 2) - desplazamientoDecoraciones;
    if (fil < 0 || fil >= DECORACIONES_FILAS_VISIBLES) return null;
    return { x: 250 + (i % 2) * 220, y: 390 + fil * 50, w: 200, h: 40 };
}

function decoracionBajoMouse() {
    for (let i = 0; i < decoracionesDisponibles.length; i++) {
        let r = rectDecoracion(i);
        if (r && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
    }
    return -1;
}

// Agrega la decoración (la usan ENTER y el clic del mouse)
function agregarDecoracion(indice) {
    let d = decoracionesDisponibles[indice];
    if (decoracionesElegidas.includes(d)) {
        mostrarAvisoError("❌ Ya elegiste esa decoración");
    } else if (!decoracionesRequeridas.includes(d)) {
        mostrarAvisoError("❌ Eso no está en la receta");
    } else {
        decoracionesElegidas.push(d);
        mostrarMensajeTemporal("✅ ¡Elegiste " + d + "!", color(0, 150, 0));
    }
}

// --- Deslizador (aparece solo si hay más filas que las visibles) ---
function filasDecoraciones() { return Math.ceil(decoracionesDisponibles.length / 2); }
function hayDeslizador() { return filasDecoraciones() > DECORACIONES_FILAS_VISIBLES; }
function maxDesplazamiento() { return Math.max(0, filasDecoraciones() - DECORACIONES_FILAS_VISIBLES); }

function geometriaDeslizador() {
    let g = { x: 682, y: 392, w: 10, h: 84 };
    g.thumbH = Math.max(20, g.h * DECORACIONES_FILAS_VISIBLES / filasDecoraciones());
    let t = maxDesplazamiento() > 0 ? desplazamientoDecoraciones / maxDesplazamiento() : 0;
    g.thumbY = g.y + (g.h - g.thumbH) * t;
    return g;
}

function mouseSobreDeslizador() {
    let g = geometriaDeslizador();
    return mouseX >= g.x - 6 && mouseX <= g.x + g.w + 6 && mouseY >= g.y && mouseY <= g.y + g.h;
}

// Mueve el deslizador según la posición del mouse
function desplazarDesdeMouse() {
    let g = geometriaDeslizador();
    let t = (mouseY - g.y - g.thumbH / 2) / (g.h - g.thumbH);
    t = Math.max(0, Math.min(1, t));
    desplazamientoDecoraciones = Math.round(t * maxDesplazamiento());
}

// Mantiene a la vista la decoración seleccionada con el teclado
function asegurarDecoracionVisible() {
    let fil = Math.floor(indiceDecoracionSeleccionada / 2);
    if (fil < desplazamientoDecoraciones) desplazamientoDecoraciones = fil;
    if (fil >= desplazamientoDecoraciones + DECORACIONES_FILAS_VISIBLES) desplazamientoDecoraciones = fil - DECORACIONES_FILAS_VISIBLES + 1;
}

function dibujarDeslizadorDecoraciones() {
    if (!hayDeslizador()) return;
    let g = geometriaDeslizador();
    noStroke();
    fill(220);
    rect(g.x, g.y, g.w, g.h, 5);
    fill(arrastrandoDeslizador ? color(200, 150, 0) : color(139, 69, 19));
    rect(g.x, g.thumbY, g.w, g.thumbH, 5);
}

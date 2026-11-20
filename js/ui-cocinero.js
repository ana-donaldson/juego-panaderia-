function mostrarInstruccionesCocinero() {
    // 1. Dibujamos la imagen de fondo (igual que en el cajero)
    if (imgInstruccionesCocinero) {
        image(imgInstruccionesCocinero, 0, 0, width, 500); // Ajustá el 500 si querés que sea más corta/larga
    } else {
        // Respaldo por si no encuentra la imagen
        fill(240, 230, 215);
        rect(0, 0, width, height);
        fill(0);
        textSize(24);
        text("Falta la imagen de instrucciones del cocinero", width / 2, height / 2);
    }

    // 2. Dibujamos el botón de comenzar (que ya tenés programado)
    dibujarCartelInteractivo(); 
}
// Ingrediente que se está arrastrando con el mouse (null si ninguno)
let ingArrastrando = null;
// Zona del bowl donde se puede soltar un ingrediente arrastrado
function mouseSobreBowl() {
    return mouseX >= 340 && mouseX <= 560 && mouseY >= 150 && mouseY <= 300;
}

// Contador de vidas del modo Cocinero (mismo formato que el del modo Cajero)
function dibujarVidasCocinero() {
    push();
    noStroke();
    fill(0);
    textSize(18);
    textAlign(LEFT, TOP);
    text("❤️ Vidas: " + vidasCocinero, 20, 20);
    pop();
}

function mostrarInterfazCocinero1() {
    // --- PANEL IZQUIERDO: Lista de Ingredientes ---
    fill(255, 255, 255, 220);
    rect(20, 60, 250, 250, 10);
    
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Receta: " + recetaActual.nombre, 145, 85);
    
    textAlign(LEFT, CENTER);
    textSize(14);
    let yIng = 120;
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
    textAlign(CENTER, CENTER);   // de acá en adelante todo va centrado

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
        if (ingArrastrando && ingArrastrando.movido && mouseSobreBowl()) {
            stroke(255, 220, 100); strokeWeight(5);   // resalta el bowl al arrastrar encima
        } else {
            noStroke();
        }
        fill(150, 150, 150);
        ellipse(width / 2, 220, 160, 120);
        noStroke();
        fill(120, 120, 120);
        ellipse(width / 2, 225, 160, 110); // El 3D

        if (ingredientesEnBowl.length === 0) {
            dibujarAviso("Tirá los ingredientes acá", width / 2, 220, "suave");
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
    noStroke();
    fill(180, 140, 100);
    rect(0, 350, width, 250);
    fill(0);
    textSize(16);
    text("Mesa de trabajo", width / 2, 375);

    // Ingredientes centrados en la pantalla, con su nombre debajo de la imagen
    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let r = rectIngrediente(i);

        if (i === indiceIngredienteSeleccionado) {
            fill(255, 220, 100); stroke(200, 150, 0); strokeWeight(4);
        } else {
            fill(255, 255, 255); noStroke();
        }
        rect(r.x, r.y, r.w, r.h, 10);
        noStroke();

        let img = imagenesIngredientes[ingredientesDisponibles[i]];
        if (img) {
            image(img, r.x + 22, r.y + 8, 56, 56);
        } else {
            fill(235, 215, 180);
            rect(r.x + 22, r.y + 8, 56, 56, 8);
        }
        fill(0);
        textSize(12);
        text(ingredientesDisponibles[i], r.x + r.w / 2, r.y + 80);
    }

    // Mensajes (con cartel)
    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 126, "suave", mensajeColor, alfaMensaje());
    }

    // Instrucciones (cartel interactivo)
    dibujarCartelInteractivo();

    // Ingrediente arrastrado siguiendo al mouse
    if (ingArrastrando && ingArrastrando.movido) {
        let img = imagenesIngredientes[ingredientesDisponibles[ingArrastrando.indice]];
        if (img) image(img, mouseX - 30, mouseY - 30, 60, 60);
        else { fill(235, 215, 180); rect(mouseX - 30, mouseY - 30, 60, 60, 8); }
        cursor('grabbing');
    } else if (ingredienteBajoMouse() >= 0) {
        cursor(HAND);
    }
}

// ============================================
// BOTONES DEL HORNO (alternativa al teclado)
// Fila: Temperatura: [◀] 0°C [▶] {hueco} [⏯] {hueco} [⏸] {hueco}   (panel de x 150 a 750)
// ============================================
function geomBotonesHorno() {
    const X0 = 170, X1 = 730, Y = 430, ALTO = 30;   // márgenes del panel y centro vertical de la fila
    const ANCHO_FLECHA = 22, ANCHO_MEDIA = 40, ANCHO_VALOR = 76;
    push();
    textStyle(NORMAL);
    textSize(18);
    let anchoEtiqueta = textWidth("Temperatura:");
    pop();
    let xMenos = X0 + anchoEtiqueta + 10;
    let xValor = xMenos + ANCHO_FLECHA + 8;
    let xMas = xValor + ANCHO_VALOR + 8;
    let hueco = (X1 - (xMas + ANCHO_FLECHA) - 2 * ANCHO_MEDIA) / 3;   // el espacio que sobra se reparte en 3 partes iguales
    let xPlay = xMas + ANCHO_FLECHA + hueco;
    let xStop = xPlay + ANCHO_MEDIA + hueco;
    let y = Y - ALTO / 2;
    return {
        etiquetaX: X0,
        valorX: xValor + ANCHO_VALOR / 2,
        menos: { x: xMenos, y: y, w: ANCHO_FLECHA, h: ALTO },
        mas:   { x: xMas,   y: y, w: ANCHO_FLECHA, h: ALTO },
        play:  { x: xPlay,  y: y, w: ANCHO_MEDIA,  h: ALTO },
        stop:  { x: xStop,  y: y, w: ANCHO_MEDIA,  h: ALTO },
        reintentar: { x: X1 - ANCHO_MEDIA, y: 500 - ALTO / 2, w: ANCHO_MEDIA, h: ALTO }   // [↻] a la derecha de la barra de tiempo
    };
}

// Qué botones se pueden usar ahora (mismas condiciones que el teclado en keyPressed)
function botonesHornoActivos() {
    return {
        temp: !coccionExitosa && !hornoEncendido && (coccionFallida ? coccionFallidaPorTemp : progresoHorno === 0),
        play: !coccionExitosa && !coccionFallida && !hornoEncendido && progresoHorno === 0,
        stop: hornoEncendido,
        reintentar: coccionFallida
    };
}

function mouseSobreBotonHorno(r) {
    return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function dibujarBotonesHorno() {
    let g = geomBotonesHorno();
    let act = botonesHornoActivos();
    dibujarBotonHorno(g.menos, "menos", act.temp);
    dibujarBotonHorno(g.mas, "mas", act.temp);
    dibujarBotonHorno(g.play, "play", act.play);
    dibujarBotonHorno(g.stop, "stop", act.stop);
    dibujarBotonHorno(g.reintentar, "reintentar", act.reintentar);
}

// Botón monocromático (solo grises y negro). Los símbolos se dibujan con formas para que
// se vean siempre iguales y en un solo color: ◀ ▶ altos y angostos, ⏯ (play + pausa), ⏸ (pausa).
function dibujarBotonHorno(r, icono, activo) {
    let encima = activo && mouseSobreBotonHorno(r);
    if (encima) cursor(HAND);
    push();
    stroke(20);
    strokeWeight(2);
    fill(!activo ? 190 : (encima ? 165 : 130));
    rect(r.x, r.y, r.w, r.h, 6);
    noStroke();
    fill(activo ? 25 : 120);
    let cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    if (icono === "menos") triangle(cx + 4, cy - 9, cx + 4, cy + 9, cx - 5, cy);        // ◀
    else if (icono === "mas") triangle(cx - 4, cy - 9, cx - 4, cy + 9, cx + 5, cy);     // ▶
    else if (icono === "play") {                                                         // ⏯
        triangle(cx - 14, cy - 9, cx - 14, cy + 9, cx - 3, cy);
        rect(cx + 2, cy - 9, 4, 18);
        rect(cx + 9, cy - 9, 4, 18);
    } else if (icono === "stop") {                                                       // ⏸
        rect(cx - 7, cy - 9, 5, 18);
        rect(cx + 2, cy - 9, 5, 18);
    } else {                                                                             // ↻
        let a0 = -PI / 6, a1 = a0 + 1.55 * PI, rad = 8;
        noFill();
        stroke(activo ? 25 : 120);
        strokeWeight(2.5);
        arc(cx, cy, rad * 2, rad * 2, a0, a1);
        noStroke();
        fill(activo ? 25 : 120);
        let px = cx + rad * cos(a1), py = cy + rad * sin(a1);   // punta de la flecha, en sentido horario
        triangle(px - sin(a1) * 6, py + cos(a1) * 6, px + cos(a1) * 4, py + sin(a1) * 4, px - cos(a1) * 4, py - sin(a1) * 4);
    }
    pop();
}

// Clic en un botón del horno. Reutiliza keyPressed() con la tecla equivalente, así la interacción
// es exactamente la del teclado: ◀ = flecha izquierda, ▶ = flecha derecha, ⏯ = ENTER, ⏸ = ESPACIO, ↻ = R.
function clicBotonesHorno() {
    let g = geomBotonesHorno();
    let act = botonesHornoActivos();
    let tecla = null;
    if (act.temp && mouseSobreBotonHorno(g.menos)) tecla = { k: "ArrowLeft", c: LEFT_ARROW };
    else if (act.temp && mouseSobreBotonHorno(g.mas)) tecla = { k: "ArrowRight", c: RIGHT_ARROW };
    else if (act.play && mouseSobreBotonHorno(g.play)) tecla = { k: "Enter", c: ENTER };
    else if (act.stop && mouseSobreBotonHorno(g.stop)) tecla = { k: " ", c: 32 };
    else if (act.reintentar && mouseSobreBotonHorno(g.reintentar)) tecla = { k: "r", c: 82 };
    if (!tecla) return false;
    if (sonidoBoton) sonidoBoton.play();
    let keyPrev = key, keyCodePrev = keyCode;
    key = tecla.k;
    keyCode = tecla.c;
    try { keyPressed(); } finally { key = keyPrev; keyCode = keyCodePrev; }
    return true;
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

    // Panel de control del horno (más alto: temperatura arriba, barra de tiempo abajo)
    fill(255, 255, 255, 220);
    rect(150, 408, 600, 124, 10);   // más ancho para que entren los botones

    // ==========================================
    // TEMPERATURA
    // ==========================================
    let gb = geomBotonesHorno();   // posiciones de la fila: Temperatura: [◀] 0°C [▶] ... [⏯] ... [⏸]
    fill(0);
    textSize(18);
    push(); textAlign(LEFT, CENTER); text("Temperatura:", gb.etiquetaX, 430); pop();
    
    // Si está encendido, mostrar la que eligió, si no, la de la receta como guía
    textSize(24);
    text(temperaturaHorno + "°C", gb.valorX, 430);
    dibujarBotonesHorno();

    // Indicador de si está bien o mal (solo cuando está encendido)
    if (hornoEncendido) {
        if (temperaturaHorno === recetaActual.temperatura) {
            fill(0, 150, 0); // Verde
        } else {
            fill(200, 0, 0); // Rojo
        }
        textSize(14);
        push(); textAlign(LEFT, CENTER); text("(Receta: " + recetaActual.temperatura + "°C)", gb.etiquetaX, 466); pop();   // debajo de "Temperatura:" (la fila ahora lleva los botones)
    }
    // Temperatura pedida por la receta (cartel resaltado)
    dibujarAviso("🌡️ Temperatura pedida: " + recetaActual.temperatura + "°C", width / 2, 176, "suave");

    // ==========================================
    // BARRA DE TIEMPO (debajo de la temperatura)
    // ==========================================
    fill(0);
    textSize(18);
    text("Tiempo:", width / 2, 465);

    // Fondo de la barra (300 de ancho, centrada en el panel)
    fill(200);
    rect(300, 490, 300, 20, 5);

    // Relleno de la barra
    if (hornoEncendido || progresoHorno > 0) {
        fill(255, 100, 0);
        rect(300, 490, progresoHorno, 20, 5);
    }

    // Meta ideal (Calculada para que la línea verde esté en el lugar correcto)
    let metaX = 300 + (recetaActual.tiempoIdeal * 15); // 👈 Multiplicamos por 15
    // La línea verde titila (parpadeo de color)
    let parpadeo = (Math.sin(millis() * 0.012) + 1) / 2;
    stroke(lerpColor(color(0, 110, 0), color(150, 255, 120), parpadeo));
    strokeWeight(3 + parpadeo * 2);
    line(metaX, 485, metaX, 515);
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
        ], width / 2, 561, "suave");
    } else {
        dibujarAviso([
            "¡Cuidado!",
            "Presione la tecla 'ESPACIO' justo en la línea verde"
        ], width / 2, 561, "suave");
    }

    // Mensaje (error o acierto). Si la cocción falló, el cartel de reintento lo dibuja dibujarCartelInteractivo()
    if (mensaje !== "" && (!coccionFallida || coccionFallidaPorTemp)) {   // el aviso de temperatura se dibuja acá (sin clic)
        dibujarAviso(mensaje, width / 2, 122, "suave", mensajeColor, alfaMensaje());
    }
    dibujarCartelInteractivo();
}

// Desplazamiento que centra TODO el conjunto de piezas dentro de la bandeja gris (rect 100,100,700x400).
// Se calcula con la cantidad de piezas (3 columnas, separación 200x160, pieza 120x80), así sirve para cualquier cantidad.
function desplazamientoBandeja(total) {
    let cols = Math.min(3, total);
    let filas = Math.ceil(total / 3);
    let anchoConjunto = (cols - 1) * 200 + 120;
    let altoConjunto = (filas - 1) * 160 + 80;
    return {
        x: (100 + 700 / 2) - (180 - 60 + anchoConjunto / 2),
        y: (100 + 400 / 2) - (200 - 40 + altoConjunto / 2)
    };
}

function mostrarInterfazCocinero3() {
    // Título
    fill(139, 69, 19);
    textSize(28);
    text(" DAR BRILLO", width / 2, 50);

    // Bandeja de horno (con la imagen si existe; si no, el cuadro gris de siempre)
    if (imagenesPintado["bandeja"]) {
        image(imagenesPintado["bandeja"], 100, 100, 700, 400);
    } else {
        fill(100, 100, 100);
        rect(100, 100, 700, 400, 20);
    }

    // Instrucción (cartel solo informativo: no está en cartelInteractivo(), así que no responde a clics)
    dibujarAviso("Usá las flechas o hacé clic para pintar con huevo todo el lote de " + recetaActual.nombre + ".", width / 2, 130, "suave", undefined, undefined, true);

    // Dibujar los productos en la bandeja
    let totalProductos = 6; // Simulamos una bandeja con 6 medialunas
    let desp = desplazamientoBandeja(totalProductos);
    let inicioX = 180 + desp.x;
    let inicioY = 200 + desp.y;
    
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
            stroke(255, 248, 232);
            strokeWeight(4);
            noFill();
            ellipse(x, y, 130, 90);
            noStroke();
        }
    }

    // Barra de progreso del brillo
    let progreso = (productosPintados.length / totalProductos) * 100;
    fill(200);
    rect(250, 514, 400, 20, 10);
    fill(255, 200, 0);
    rect(250, 514, map(progreso, 0, 100, 0, 400), 20, 10);
    
    push();
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(14);
    text("Progreso: " + Math.floor(progreso) + "%", 660, 524);
    pop();

    // Manito al pasar el mouse sobre una pieza
    if (piezaBajoMouse() >= 0) cursor(HAND);

    // Instrucciones abajo (cartel interactivo: clic = tecla ESPACIO)
    dibujarCartelInteractivo();

    if (mensaje !== "") {
        dibujarAviso(mensaje, width / 2, 82, "suave", mensajeColor, alfaMensaje());
    }
}function mostrarInterfazCocinero4() {
    // ✅ FORZAMOS EL CENTRADO Y TAMAÑO DE TEXTO AL ENTRAR
    textAlign(CENTER, CENTER);
    textSize(20);

    // Título
    fill(139, 69, 19);
    textSize(28);
    text("🎂 DECORACIÓN FINAL", width / 2, 50);
    
   // --- DIBUJO DEL PRODUCTO ---
let imagenBase = imagenesDecoraciones["base"];

let decoracionTerminada =
    (recetaActual.nombre === "Tortas" ||
     recetaActual.nombre === "Facturas" ||
     recetaActual.nombre === "Galletas" ||
     recetaActual.nombre === "Alfajores") &&
    decoracionesElegidas.length >= 2;

if (decoracionTerminada) {
    let imagenFinal;

    if (recetaActual.nombre === "Tortas") {
    imagenFinal = obtenerImagenFinalTorta();
} else if (recetaActual.nombre === "Facturas") {
    imagenFinal = obtenerImagenFinalFactura();
} else if (recetaActual.nombre === "Galletas") {
    imagenFinal = obtenerImagenFinalGalleta();
} else if (recetaActual.nombre === "Alfajores") {
    imagenFinal = obtenerImagenFinalAlfajor();
}

    if (imagenFinal) {
        image(imagenFinal, width / 2 - 90, 80, 180, 120);
    } else {
        fill(200, 150, 100);
        rect(width / 2 - 90, 80, 180, 120, 20);
    }

} else {
    if (recetaActual.nombre === "Medialunas" && imagenesDecoraciones["Medialunas"]) {
        imagenBase = imagenesDecoraciones["Medialunas"];
    } else if (recetaActual.nombre === "Facturas" && imagenesDecoraciones["Facturas"]) {
        imagenBase = imagenesDecoraciones["Facturas"];
    } else if (recetaActual.nombre === "Galletas" && imagenesDecoraciones["Galletas"]) {
        imagenBase = imagenesDecoraciones["Galletas"];
    } else if (recetaActual.nombre === "Alfajores" && imagenesDecoraciones["Alfajores"]) {
        imagenBase = imagenesDecoraciones["Alfajores"];
    }

    if (imagenBase) {
        image(imagenBase, width / 2 - 90, 80, 180, 120);
    } else {
        fill(200, 150, 100);
        rect(width / 2 - 90, 80, 180, 120, 20);
    }

    // Mostrar decoraciones mientras todavía se está preparando
    if (typeof decoracionesElegidas !== 'undefined') {
        for (let i = 0; i < decoracionesElegidas.length; i++) {
            let deco = decoracionesElegidas[i];
            let imgDeco = imagenesDecoraciones[deco];

            if (imgDeco) {
                image(imgDeco, width / 2 - 90, 80, 180, 120);
            }
        }
    }
}
    // Superponemos las decoraciones elegidas
    if (typeof decoracionesElegidas !== 'undefined') {
        for (let i = 0; i < decoracionesElegidas.length; i++) {
            let deco = decoracionesElegidas[i];
            let imgDeco = imagenesDecoraciones[deco];
            
            if (imgDeco) {
                image(imgDeco, width / 2 - 90, 80, 180, 120);
            }
        }
    }

    // TEXTO DE LA RECETA
    fill(0);
    textSize(16);
    text("Producto: " + recetaActual.nombre, width / 2, 210);

    // Decoraciones requeridas
    let lista = decoracionesRequeridas.map(d => (decoracionesElegidas.includes(d) ? "✅ " : "⬜ ") + d).join("   ");
    textSize(14);
    text("Falta decorar con: " + (lista || "Nada más"), width / 2, 240);

    // 3. PANEL DE OPCIONES
    fill(255, 255, 255, 230);
    rect(150, 280, 600, 248, 10);   // más alto para que entren las 5 filas de decoraciones

    fill(0);
    textSize(18);
    text("Elegí la decoración:", width / 2, 310);

    // GRILLA
    let anchoCaja = 210; 
    let altoCaja = 30;   
    let inicioX = width / 2 - 220;
    let inicioY = 330;   
    let espacioX = 15;
    let espacioY = 10;   

    for (let i = 0; i < decoracionesDisponibles.length; i++) {
        let col = i % 2;
        let fil = Math.floor(i / 2);
        let x = inicioX + col * (anchoCaja + espacioX);
        let y = inicioY + fil * (altoCaja + espacioY);

        if (i === indiceDecoracionSeleccionada) {
            fill(255, 220, 100);
            stroke(200, 150, 0);
            strokeWeight(3);
        } else if (decoracionesElegidas.includes(decoracionesDisponibles[i])) {
            fill(200, 240, 200);
            noStroke();
        } else {
            fill(255, 255, 255);
            stroke(200);
            strokeWeight(1);
        }
        rect(x, y, anchoCaja, altoCaja, 8);
        noStroke();

        // ✅ CENTRAMOS EL TEXTO DENTRO DE CADA CAJA
        textAlign(CENTER, CENTER); 
        fill(0);
        textSize(12); 
        text(decoracionesDisponibles[i], x + anchoCaja / 2, y + altoCaja / 2);
    }

    // Instrucciones
    dibujarCartelInteractivo();

    if (mensaje !== "") {
        textAlign(CENTER, CENTER);
        dibujarAviso(mensaje, width / 2, 270, "suave", mensajeColor, alfaMensaje());
    }
    function obtenerImagenFinalTorta() {
    let decoraciones = decoracionesRequeridas.slice().sort();

    const combinaciones = {
        "Coco Rallado|Crema de Chocolate": "chocolate_coco",
        "Crema Pastelera|Frutillas": "frutilla_cremapastelera",
        "Dulce de Leche|Granas de Colores": "dulceleche_gramas",
        "Chips de Chocolate|Coco Rallado": "chips_coco",
        "Baño de Chocolate|Crema de Vainilla": "baño_vainilla"
    };

    return imagenesFinalesTorta[combinaciones[decoraciones.join("|")]];
}

function obtenerImagenFinalFactura() {
    let decoraciones = decoracionesRequeridas.slice().sort();

    const combinaciones = {
        "Coco Rallado|Crema de Chocolate": "chocolate_coco",
        "Crema Pastelera|Frutillas": "frutilla_cremapastelera",
        "Dulce de Leche|Granas de Colores": "dulceleche_gramas",
        "Chips de Chocolate|Coco Rallado": "chips_coco",
        "Baño de Chocolate|Crema de Vainilla": "baño_vainilla"
    };

    return imagenesFinalesFactura[combinaciones[decoraciones.join("|")]];
}
function obtenerImagenFinalGalleta() {
    let decoraciones = decoracionesRequeridas.slice().sort();

    const combinaciones = {
        "Coco Rallado|Crema de Chocolate": "chocolate_coco",
        "Crema Pastelera|Frutillas": "frutilla_cremapastelera",
        "Dulce de Leche|Granas de Colores": "dulceleche_gramas",
        "Chips de Chocolate|Coco Rallado": "chips_coco",
        "Baño de Chocolate|Crema de Vainilla": "baño_vainilla"
    };

    return imagenesFinalesGalleta[combinaciones[decoraciones.join("|")]];
}
function obtenerImagenFinalAlfajor() {
    let decoraciones = decoracionesRequeridas.slice().sort();

    const combinaciones = {
        "Coco Rallado|Crema de Chocolate": "chocolate_coco",
        "Crema Pastelera|Frutillas": "frutilla_cremapastelera",
        "Dulce de Leche|Granas de Colores": "dulceleche_gramas",
        "Chips de Chocolate|Coco Rallado": "chips_coco",
        "Baño de Chocolate|Crema de Vainilla": "baño_vainilla"
    };

    return imagenesFinalesAlfajor[combinaciones[decoraciones.join("|")]];
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
    ], width / 2, 557, "suave");
}

// Arranca la preparación de la receta elegida
// Puntos de etapas ya sumados para la receta en curso (se descuentan del puntaje final)
let etapasRecetaPuntos = 0;
function sumarPuntosEtapaCocinero() {
    pendCocinero.puntos += PUNTOS_ETAPA_COCINERO;
    etapasRecetaPuntos += PUNTOS_ETAPA_COCINERO;
}

function iniciarReceta(i) {
    etapasRecetaPuntos = 0;
    mensaje = "";
    mensajeTemp = null;
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
    coccionFallidaPorTemp = false;
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
// Rectángulo de cada ingrediente (mismas medidas que en mostrarInterfazCocinero1):
// una sola fila centrada en la pantalla
function rectIngrediente(i) {
    let ancho = 100, alto = 100, espacio = 20;
    let total = ingredientesDisponibles.length * ancho + (ingredientesDisponibles.length - 1) * espacio;
    return { x: width / 2 - total / 2 + i * (ancho + espacio), y: 400, w: ancho, h: alto };
}

// Índice del ingrediente bajo el mouse (-1 si no hay ninguno)
function ingredienteBajoMouse() {
    for (let i = 0; i < ingredientesDisponibles.length; i++) {
        let r = rectIngrediente(i);
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return i;
    }
    return -1;
}

// Agrega el ingrediente (lo usan ENTER, el clic y el arrastre al bowl): misma regla para todos
function agregarIngrediente(indice) {
    let ingSeleccionado = ingredientesDisponibles[indice];
    let estaEnReceta = recetaActual.ingredientes.includes(ingSeleccionado);

    if (!estaEnReceta) {
        if (vidasCocinero === undefined) vidasCocinero = 3;
        vidasCocinero--;
        mostrarAvisoError("❌ ¡Ese ingrediente no va! Vidas: " + vidasCocinero);
        if (vidasCocinero <= 0) {
            estado = "fin";
            mensaje = "";
        }
        return;
    }
    if (ingredientesEnBowl.includes(ingSeleccionado)) {
        mostrarAvisoError("❌ Ya agregaste " + ingSeleccionado);
        return;
    }
    ingredientesEnBowl.push(ingSeleccionado);
    mensaje = "✅ ¡Bien! Agregaste " + ingSeleccionado;
    mensajeColor = color(0, 150, 0);
    if (ingredientesEnBowl.length === recetaActual.ingredientes.length) {
        mensaje = "✅ ¡Todo listo! Presiona ESPACIO para ir al horno.";
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
    sumarPuntosEtapaCocinero();   // etapa de ingredientes completada
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
    sumarPuntosEtapaCocinero();   // etapa del horno completada
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
    sumarPuntosEtapaCocinero();   // etapa de brillo completada
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
    sumarPuntosEtapaCocinero();   // etapa de decoración completada
    estado = "fin";
    mensaje = "";
}

// ============================================
// COCCIÓN FALLIDA Y REINTENTO
// ============================================
function fallarCoccion(texto) {
    hornoEncendido = false;
    coccionFallida = true;
    coccionFallidaPorTemp = false;
    coccionFallidaDesde = millis();
    mostrarAvisoError(texto + "\nHaz click aquí o presiona la tecla R para reintentar");
}

// Falla por temperatura (más de 30 °C de diferencia con la receta): mismo aviso rojo con fade,
// pero solo informativo (no clicable). Se puede ajustar la temperatura y reintentar con R.
function fallarCoccionPorTemperatura(texto) {
    hornoEncendido = false;
    coccionFallida = true;
    coccionFallidaPorTemp = true;
    coccionFallidaDesde = millis();
    mostrarAvisoError(texto);
}

// Vuelve a dejar el horno listo para otro intento (la usan la tecla R y el cartel)
function reintentarCoccion() {
    if (!coccionFallida) return;
    coccionFallida = false;
    coccionFallidaPorTemp = false;
    hornoEncendido = false;
    progresoHorno = 0;
    mensaje = "";
    mensajeTemp = null;
}

// Temperatura del horno manteniendo ← o → (cada paso = 10 °C)
function actualizarTemperaturaMantenida() {
    if (hornoEncendido || coccionExitosa) return;
    if (!coccionFallidaPorTemp && (progresoHorno !== 0 || coccionFallida)) return;   // tras fallar por temperatura se puede ajustar
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
        let desp = desplazamientoBandeja(6);
        let x = 180 + desp.x + (i % 3) * 200;
        let y = 200 + desp.y + Math.floor(i / 3) * 160;
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
const DECORACIONES_FILAS_VISIBLES = 5;   // entran todas las filas: no hace falta deslizador

// Rectángulo de cada decoración (null si está fuera de la zona visible)
function rectDecoracion(i) {
    let fil = Math.floor(i / 2) - desplazamientoDecoraciones;
    if (fil < 0 || fil >= DECORACIONES_FILAS_VISIBLES) return null;
    // misma geometría que la grilla de mostrarInterfazCocinero4
    return { x: width / 2 - 220 + (i % 2) * 225, y: 330 + fil * 40, w: 210, h: 30 };
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

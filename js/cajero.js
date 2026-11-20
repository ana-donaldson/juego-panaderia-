// ============================================
// MODO CAJERO - Lógica completa
// ============================================

// Puntos / clientes ganados que todavía no se enviaron al servidor (se suman a lo anterior)
let pendCajero = { puntos: 0, clientes: 0 };
let pendCocinero = { puntos: 0, recetas: 0 };

function cargarCliente(indice) {
    if (indice > 0) pendCajero.clientes++;   // el cliente anterior ya fue atendido
    if (indice >= clientes.length) {
        estado = "fin";
        guardarPartidaEnServidor();
        return;
    }

 // ✅ CONTADOR: incrementa apenas llega el cliente
    clientesAtendidos = indice + 1;
    
    clienteActual = indice;
    pedidoActual = generarPedidoAleatorio();            // 🎲 pedido al azar
    totalCorrecto = calcularTotal(pedidoActual);
    pagoCliente = generarPagoAleatorio(totalCorrecto);  // 🎲 pago al azar
    vueltoCorrecto = Math.round((pagoCliente - totalCorrecto) * 100) / 100;

    inputVuelto = "";
    mensaje = "";
    mostrandoResultado = false;
    clienteEnojado = false;
    bolsa = [];

    mostrarCliente();
    estado = "cajero_escena1";
}

function calcularTotal(pedido) {
    let total = 0;
    for (let i = 0; i < pedido.length; i++) {
        total += pedido[i].cantidad * pedido[i].precio;
    }
    return Math.round(total * 100) / 100;
}

// Confirma el vuelto escrito (tecla ENTER o botón "Dar vuelto"): mismas validaciones
function confirmarVuelto() {
    if (mostrandoResultado || vueltoCorrecto <= 0) return;
    if (inputVuelto.length === 0) {
        mostrarAvisoError("❌ Escribí el vuelto primero");
        return;
    }
    let ingresado = parseFloat(inputVuelto);
    if (!isNaN(ingresado) && ingresado > pagoCliente) {
        mostrarAvisoError("❌ El vuelto no puede ser mayor a $" + pagoCliente.toFixed(2));
        return;
    }
    verificarVuelto();
}

function verificarVuelto() {
    if (!clienteVisible) return;
    if (vueltoCorrecto <= 0) return;

    let ingresado = parseFloat(inputVuelto);
    if (isNaN(ingresado)) {
        mostrarAvisoError("❌ Ingresá un número válido");
        return;
    }

    ingresado = Math.round(ingresado * 100) / 100;
    let correcto = Math.round(vueltoCorrecto * 100) / 100;

    // --- CASO 1: Vuelto EXACTO ---
    if (ingresado === correcto) {
          if (sonidoMoneda) sonidoMoneda.play();
        mensaje = "✅ ¡Perfecto! Vuelto exacto de $" + correcto.toFixed(2) + " 🎉";
        mensajeColor = color(0, 150, 0);
        puntos += PUNTOS_POR_VUELTO;
        pendCajero.puntos += PUNTOS_POR_VUELTO;
        clientesAtendidos++;
        caja = Math.round((caja + totalCorrecto) * 100) / 100;

        mostrandoResultado = true;
        setTimeout(() => {
            clienteActual++;
            cargarCliente(clienteActual);
        }, 2000);
        return;
    }

    // --- CASO 2: Vuelto de MÁS ---
    if (ingresado > correcto) {
        let diferencia = Math.round((ingresado - correcto) * 100) / 100;
        caja = Math.round((caja - diferencia) * 100) / 100;

        if (caja <= 0) {
            mensaje = "💀 El vuelto era $" + correcto.toFixed(2) + " y le diste $" + ingresado.toFixed(2) + ". ¡La panadería quebró!";
            mensajeColor = color(200, 0, 0);
            setTimeout(() => {
                estado = "fin";
                guardarPartidaEnServidor();
            }, 3000);
        } else {
            mensaje = "❌ El vuelto era $" + correcto.toFixed(2) + " y le diste $" + ingresado.toFixed(2) + ". Perdiste $" + diferencia.toFixed(2);
            mensajeColor = color(200, 100, 0);
                vidas--;
            clienteEnojado = true;
        }

        mostrandoResultado = true;
        setTimeout(() => {
            if (estado !== "fin") {
                if (vidas > 0) {
                    clienteActual++;
                    cargarCliente(clienteActual);
                } else {
                    estado = "fin";
                    guardarPartidaEnServidor();
                }
            }
        }, 3500);
        return;
    }

    // --- CASO 3: Vuelto de MENOS ---
    if (ingresado < correcto) {
        let diferencia = Math.round((correcto - ingresado) * 100) / 100;
        caja = Math.round((caja + diferencia) * 100) / 100;

        mensaje = "❌ El vuelto era $" + correcto.toFixed(2) + " y le diste $" + ingresado.toFixed(2) + ". Le faltaron $" + diferencia.toFixed(2);
        mensajeColor = color(200, 0, 0);
        vidas--;
        clienteEnojado = true;

        mostrandoResultado = true;
        setTimeout(() => {
            if (estado !== "fin") {
                if (vidas > 0) {
                    clienteActual++;
                    cargarCliente(clienteActual);
                } else {
                    estado = "fin";
                    guardarPartidaEnServidor();
                }
            }
        }, 3500);
        return;
    }
}

function avanzarSinVuelto() {
      if (sonidoMoneda) sonidoMoneda.play();
    mensaje = "✅ ¡Pago exacto! Cliente feliz 🎉";
    mensajeColor = color(0, 150, 0);
    puntos += PUNTOS_POR_VUELTO;   // pago exacto = el vuelto ($0) también está bien dado
    pendCajero.puntos += PUNTOS_POR_VUELTO;
    clientesAtendidos++;
    caja = Math.round((caja + totalCorrecto) * 100) / 100;

    mostrandoResultado = true;
    setTimeout(() => {
        clienteActual++;
        cargarCliente(clienteActual);
    }, 2000);
}

// Pasa de la atención del cliente a armar el pedido (tecla ESPACIO o clic en el cartel)
function irAArmarPedido() {
    if (!clienteVisible) return;
    estado = "cajero_escena3";
    recordatorioPedidoDesde = 0;   // el recordatorio del pedido solo aparece tras un intento fallido de cobrar
    productoSeleccionado = 0;
    bolsa = [];
    mensaje = "";
}

// Pasa de armar el pedido a la caja (tecla ESPACIO o botón "Ir a cobrar")
function irACobrar() {
    // Si la bolsa no está completa o tiene cosas de más...
    if (!bolsaCompleta()) {
        recordatorioPedidoDesde = millis();   // dispara el recordatorio del pedido (fade-in de 3 s)
        if (vidas > 0) {
            vidas--;
            mostrarAvisoError("❌ ¡Pedido incorrecto! Se descontó 1 vida.");
            if (vidas <= 0) {
                estado = "fin";
                return;
            }
            return; // No avanza a la caja, se queda en la escena para que corrija
        }
    }

    // Si está todo bien, pasa a la caja
    estado = "cajero_escena2";
    inputVuelto = "";
    mensaje = "";
}

function bolsaCompleta() {
    for (let i = 0; i < pedidoActual.length; i++) {
        let item = pedidoActual[i];
        let enBolsa = bolsa.filter(p => p.nombre === item.producto).length;
        if (enBolsa < item.cantidad) {
            return false;
        }
    }
    if (bolsa.length !== pedidoActual.reduce((sum, item) => sum + item.cantidad, 0)) {
        return false;
    }
    return true;
}

// ============================================
// GUARDAR PARTIDA EN EL SERVIDOR
// ============================================
function guardarPartidaEnServidor() {
    if (resultadoGuardado) return;   // una sola vez por partida

    let jugador_id = localStorage.getItem('jugador_id');

    if (!jugador_id) {
        console.log("No hay jugador logueado. No se guarda la partida.");
        return;
    }
    resultadoGuardado = true;

    if (modoSeleccionado === 'cocinero') {
        // Puntaje de la receta menos lo que ya se fue sumando por etapas
        // Solo si la receta se completó (no se perdieron todas las vidas) suma el resto del puntaje
        if (vidasCocinero > 0) {
            pendCocinero.puntos += Math.max(0, calcularPuntajeCocinero() - etapasRecetaPuntos);
            pendCocinero.recetas++;
        }
        etapasRecetaPuntos = 0;
        enviarProgreso('cocinero');
    } else {
        enviarProgreso('cajero');
    }
}

// Envía al servidor lo acumulado desde el último envío (el servidor lo SUMA al total del jugador).
// Se llama al terminar la partida y al presionar ESC.
function enviarProgreso(modo) {
    let jugador_id = localStorage.getItem('jugador_id');
    if (!jugador_id) return;

    let datos, pend;
    if (modo === 'cocinero') {
        pend = { puntos: pendCocinero.puntos, recetas: pendCocinero.recetas };
        if (pend.puntos === 0 && pend.recetas === 0) return;
        datos = {
            jugador_id: parseInt(jugador_id),
            puntuacion: pend.puntos,
            modo: 'cocinero',
            recetas_completadas: pend.recetas
        };
        pendCocinero.puntos = 0; pendCocinero.recetas = 0;
    } else {
        pend = { puntos: pendCajero.puntos, clientes: pendCajero.clientes };
        if (pend.puntos === 0 && pend.clientes === 0) return;
        datos = {
            jugador_id: parseInt(jugador_id),
            puntuacion: pend.puntos,
            modo: 'cajero',
            clientes_atendidos: pend.clientes,
            caja_final: caja
        };
        pendCajero.puntos = 0; pendCajero.clientes = 0;
    }

    console.log("Guardando partida:", datos);

    fetch('php/guardar_partida.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        keepalive: true
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) throw new Error(data.mensaje);
        console.log("✅ Partida guardada correctamente");
    })
    .catch(err => {
        console.error("❌ Error al guardar:", err);
        // no se pierde: vuelve a quedar pendiente para el próximo intento
        if (modo === 'cocinero') { pendCocinero.puntos += pend.puntos; pendCocinero.recetas += pend.recetas; }
        else { pendCajero.puntos += pend.puntos; pendCajero.clientes += pend.clientes; }
    });
}

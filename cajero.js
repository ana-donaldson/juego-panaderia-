// ============================================
// MODO CAJERO - Lógica completa
// ============================================

function cargarCliente(indice) {
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
        mensaje = "✅ ¡Perfecto! Vuelto exacto de $" + correcto.toFixed(2) + " 🎉";
        mensajeColor = color(0, 150, 0);
        puntos += 50;
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
            puntos -= 10;
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
        puntos -= 15;
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
    mensaje = "✅ ¡Pago exacto! Cliente feliz 🎉";
    mensajeColor = color(0, 150, 0);
    puntos += 30;
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
    productoSeleccionado = 0;
    bolsa = [];
    mensaje = "";
}

// Pasa de armar el pedido a la caja (tecla ESPACIO o botón "Ir a cobrar")
function irACobrar() {
    if (!bolsaCompleta()) {
        mostrarAvisoError("❌ Faltan productos en la bolsa");
        return;
    }
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
    let jugador_id = localStorage.getItem('jugador_id');

    if (!jugador_id) {
        console.log("No hay jugador logueado. No se guarda la partida.");
        return;
    }

    let datos = {
        jugador_id: parseInt(jugador_id),
        puntuacion: puntos,
        modo: 'cajero',
        clientes_atendidos: clientesAtendidos,
        caja_final: caja
    };

    console.log("Guardando partida:", datos);

    fetch('php/guardar_partida.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (data.success) {
            console.log("✅ Partida guardada correctamente");
        } else {
            console.error("❌ Error al guardar:", data.mensaje);
        }
    })
    .catch(err => console.error("❌ Error de conexión:", err));
}

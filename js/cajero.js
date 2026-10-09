// ============================================
// MODO CAJERO - Lógica completa
// ============================================

function cargarCliente(indice) {
    if (indice >= clientes.length) {
        estado = "fin";
        guardarPartidaEnServidor();
        return;
    }

    let cliente = clientes[indice];
    clienteActual = indice;
    pedidoActual = cliente.pedido;
    totalCorrecto = calcularTotal(pedidoActual);
    pagoCliente = cliente.pago;
    vueltoCorrecto = Math.round((pagoCliente - totalCorrecto) * 100) / 100;

    inputVuelto = "";
    mensaje = "";
    mostrandoResultado = false;
    clienteEnojado = false;
    bolsa = [];

    mostrarCliente();

    // Asegurar que estamos en la escena 1
    estado = "cajero_escena1";
}

function calcularTotal(pedido) {
    let total = 0;
    for (let i = 0; i < pedido.length; i++) {
        total += pedido[i].cantidad * pedido[i].precio;
    }
    return Math.round(total * 100) / 100;
}

function verificarVuelto() {
    if (!clienteVisible) return;
    if (vueltoCorrecto <= 0) return;

    let ingresado = parseFloat(inputVuelto);
    if (isNaN(ingresado)) {
        mensaje = "❌ Ingresá un número válido";
        mensajeColor = color(200, 0, 0);
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
                guardarPartidaEnServidor();  // ✅ GUARDAR AL PERDER
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
                    guardarPartidaEnServidor();  // ✅ GUARDAR AL PERDER
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
                    guardarPartidaEnServidor();  // ✅ GUARDAR AL PERDER
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
function bolsaCompleta() {
    // Recorrer el pedido y verificar que cada producto esté completo en la bolsa
    for (let i = 0; i < pedidoActual.length; i++) {
        let item = pedidoActual[i];
        let enBolsa = bolsa.filter(p => p.nombre === item.producto).length;
        if (enBolsa < item.cantidad) {
            return false;
        }
    }
    // Verificar que no haya productos de más
    if (bolsa.length !== pedidoActual.reduce((sum, item) => sum + item.cantidad, 0)) {
        return false;
    }
    return true;
}
// ============================================
// ✅ NUEVA FUNCIÓN: GUARDAR PARTIDA EN EL SERVIDOR
// ============================================
function guardarPartidaEnServidor() {
    let jugador_id = localStorage.getItem('jugador_id');

    // Si no hay jugador logueado, no guardamos
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


function cargarCliente(indice) {
    if (indice >= clientes.length) {
        estado = "fin";
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

    mostrarCliente();

    console.log("Cliente cargado:", cliente.nombre);
    console.log("Total: $" + totalCorrecto.toFixed(2));
    console.log("Pago: $" + pagoCliente.toFixed(2));
    console.log("Vuelto: $" + vueltoCorrecto.toFixed(2));
}

function calcularTotal(pedido) {
    let total = 0;
    for (let i = 0; i < pedido.length; i++) {
        total += pedido[i].cantidad * pedido[i].precio;
    }
    return Math.round(total * 100) / 100;
}

function verificarVuelto() {
    if (!clienteVisible) {
        console.log("Error: Cliente no visible");
        return;
    }

    if (vueltoCorrecto <= 0) {
        console.log("Error: No hay vuelto que calcular");
        return;
    }

    let ingresado = parseFloat(inputVuelto);
    if (isNaN(ingresado)) {
        mensaje = "❌ Ingresá un número válido";
        mensajeColor = color(200, 0, 0);
        return;
    }

    ingresado = Math.round(ingresado * 100) / 100;
    let correcto = Math.round(vueltoCorrecto * 100) / 100;

    console.log("Vuelto ingresado: $" + ingresado.toFixed(2));
    console.log("Vuelto correcto: $" + correcto.toFixed(2));

    if (ingresado === correcto) {
        mensaje = "✅ ¡Perfecto! Vuelto exacto de $" + correcto.toFixed(2) + " 🎉";
        mensajeColor = color(0, 150, 0);
        puntos += 50;
        clientesAtendidos++;

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
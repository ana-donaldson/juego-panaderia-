// Los pedidos y los pagos ya NO son fijos: se generan al azar en
// cargarCliente() usando generarPedidoAleatorio() y generarPagoAleatorio()
// (más abajo en este archivo). Acá solo quedan los nombres.
const clientes = [
    { nombre: "Doña Rosa" },
    { nombre: "Don José" },
    { nombre: "Señora Marta" },
    { nombre: "Don Carlos" },
    { nombre: "Señora Laura" }
];

// ---------- PRODUCTOS (solo 4) ----------
const productos = [
    { nombre: "Pan", precio: 0.50, fraccion: "unidad", imagen: "pan.jpg" },
    { nombre: "Factura", precio: 0.75, fraccion: "unidad", imagen: "factura.jpg" },
    { nombre: "Medialuna", precio: 0.80, fraccion: "unidad", imagen: "medialuna.jpg" },
    { nombre: "Galleta", precio: 0.40, fraccion: "unidad", imagen: "galleta.jpg" }
];

// ---------- RECETAS DEL MODO COCINERO ----------
const recetas = [
    {
        nombre: "Medialunas",
        emoji: "🥐",
        imagen: "productos/recetas/medialuna.jpg", 
        ingredientes: ["Harina", "Manteca", "Leche", "Azúcar"],
        temperatura: 180,
        tiempoIdeal: 15,
        necesitaBrillo: true,
        necesitaDecoracion: false
    },
    {
        nombre: "Tortas",
        emoji: "🍰",
        imagen: "torta.jpg",
        ingredientes: ["Harina", "Huevos", "Leche", "Azúcar"],
        temperatura: 170,
        tiempoIdeal: 20,
        necesitaBrillo: false,
        necesitaDecoracion: true
    },
    {
        nombre: "Panes",
        emoji: "🍞",
        ingredientes: ["Harina", "Levadura", "Sal", "Manteca"],
        temperatura: 200,
        tiempoIdeal: 12,
        necesitaBrillo: false,
        necesitaDecoracion: false
    },
    {
        nombre: "Facturas",
        emoji: "🧁",
        ingredientes: ["Harina", "Manteca", "Huevos", "Azúcar"],
        temperatura: 190,
        tiempoIdeal: 14,
        necesitaBrillo: true,
        necesitaDecoracion: true
    },
    {
        nombre: "Galletas",
        emoji: "🍪",
        ingredientes: ["Harina", "Manteca", "Azúcar", "Huevos"],
        temperatura: 160,
        tiempoIdeal: 10,
        necesitaBrillo: false,
        necesitaDecoracion: true
    }
];

// Ingredientes que van a aparecer en la mesa para elegir
const ingredientesDisponibles = [
    "Harina", "Manteca", "Leche", "Azúcar", "Huevos", "Sal", "Levadura"
];

const decoracionesDisponibles = [
    "Crema de Chocolate",
    "Crema de Vainilla",
    "Frutillas",
    "Azúcar Impalpable"
];

// ============================================
// RANDOMIZER DEL MODO CAJERO
// ============================================
// Número entero al azar entre min y max (ambos incluidos)
function numeroAlAzar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pedido al azar: 1 a 3 productos distintos, de 1 a 8 unidades cada uno.
// Los precios salen de la lista "productos", así nunca se desincronizan.
function generarPedidoAleatorio() {
    let disponibles = productos.slice();
    for (let i = disponibles.length - 1; i > 0; i--) {   // mezclar
        let j = numeroAlAzar(0, i);
        [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
    }
    let cuantosProductos = numeroAlAzar(1, 3);
    let pedido = [];
    for (let i = 0; i < cuantosProductos; i++) {
        pedido.push({
            producto: disponibles[i].nombre,
            cantidad: numeroAlAzar(1, 8),
            precio: disponibles[i].precio
        });
    }
    return pedido;
}

// Pago al azar: el cliente paga con un billete que alcance para cubrir el total.
// (Solo se sortea lo que paga; el vuelto lo sigue calculando cargarCliente().)
const billetes = [5, 10, 15, 20, 50, 100];
function generarPagoAleatorio(total) {
    let posibles = billetes.filter(b => b >= total).slice(0, 3);
    if (posibles.length === 0) return Math.ceil(total / 10) * 10;
    return posibles[numeroAlAzar(0, posibles.length - 1)];
}

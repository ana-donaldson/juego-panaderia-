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

// ---------- PRODUCTOS DEL MODO CAJERO ----------
// emoji: se muestra si todavía no hay foto. maxCantidad (opcional): tope por pedido (por defecto 8).
const productos = [
    { nombre: "Pan", precio: 0.50, fraccion: "unidad", imagen: "pan.jpg" },
    { nombre: "Factura", precio: 0.75, fraccion: "unidad", imagen: "factura.jpg" },
    { nombre: "Medialuna", precio: 0.80, fraccion: "unidad", imagen: "medialuna.jpg" },
    { nombre: "Galleta", precio: 0.40, fraccion: "unidad", imagen: "galleta.jpg" },
    { nombre: "Torta", precio: 4.00, fraccion: "unidad", imagen: "torta.jpg", emoji: "🍰", maxCantidad: 2 },
    { nombre: "Alfajor", precio: 0.90, fraccion: "unidad", imagen: "alfajor.jpg", emoji: "🍯" }
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
        necesitaDecoracion: true,
        decoraciones: ["Azúcar Impalpable", "Dulce de Leche", "Crema Pastelera", "Baño de Chocolate"]
    },
    {
        nombre: "Tortas",
        emoji: "🍰",
        imagen: "productos/recetas/torta.jpg",
        ingredientes: ["Harina", "Huevos", "Leche", "Azúcar"],
        temperatura: 170,
        tiempoIdeal: 20,
        necesitaBrillo: true,
        necesitaDecoracion: true,
        decoraciones: ["Crema de Chocolate", "Crema de Vainilla", "Frutillas", "Chips de Chocolate", "Azúcar Impalpable"]
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
        necesitaDecoracion: true,
        decoraciones: ["Crema Pastelera", "Dulce de Leche", "Azúcar Impalpable", "Granas de Colores"]
    },
    {
        nombre: "Galletas",
        emoji: "🍪",
        ingredientes: ["Harina", "Manteca", "Azúcar", "Huevos"],
        temperatura: 160,
        tiempoIdeal: 10,
        necesitaBrillo: false,
        necesitaDecoracion: true,
        decoraciones: ["Chips de Chocolate", "Granas de Colores", "Baño de Chocolate", "Azúcar Impalpable"]
    },
    {
        nombre: "Alfajores",
        emoji: "🍯",
        ingredientes: ["Harina", "Manteca", "Huevos", "Azúcar"],
        temperatura: 170,
        tiempoIdeal: 12,
        necesitaBrillo: false,
        necesitaDecoracion: true,
        decoraciones: ["Dulce de Leche", "Coco Rallado", "Baño de Chocolate", "Azúcar Impalpable"]
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
    "Azúcar Impalpable",
    "Dulce de Leche",
    "Coco Rallado",
    "Chips de Chocolate",
    "Granas de Colores",
    "Baño de Chocolate",
    "Crema Pastelera"
];

// Cuántas decoraciones se le asignan al azar al jugador en cada receta
const DECORACIONES_POR_RECETA = 2;

// Elige al azar (sin repetir) las decoraciones que pide la receta, dentro de las que le corresponden
function sortearDecoraciones(receta) {
    let pool = receta.decoraciones.slice();
    for (let i = pool.length - 1; i > 0; i--) {   // mezclar
        let j = numeroAlAzar(0, i);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, DECORACIONES_POR_RECETA);
}

// ============================================
// RANDOMIZER DEL MODO CAJERO
// ============================================
// Número entero al azar entre min y max (ambos incluidos)
function numeroAlAzar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pedido al azar: 1 a 3 productos distintos, de 1 a 8 unidades cada uno (la Torta, hasta 2).
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
            cantidad: numeroAlAzar(1, disponibles[i].maxCantidad || 8),
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

// ============================================
// PUNTAJE (el que se guarda y se usa en el ranking)
// ============================================
const PUNTOS_POR_VUELTO = 200;           // Cajero: puntos por cada vuelto correcto
const PUNTOS_COCINERO_MAX = 1000;        // Cocinero: puntaje con tiempo 0
const TIEMPO_REFERENCIA_COCINERO = 60;   // Cocinero: con este tiempo (en segundos) el puntaje es la mitad

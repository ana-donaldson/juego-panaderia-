const clientes = [
    {
        nombre: "Doña Rosa",
        pedido: [
            { producto: "Pan", cantidad: 2, precio: 0.50 },
            { producto: "Factura", cantidad: 6, precio: 0.75 }
        ],
        pago: 10
    },
    {
        nombre: "Don José",
        pedido: [
            { producto: "Medialuna", cantidad: 4, precio: 0.80 },
            { producto: "Galleta", cantidad: 8, precio: 0.40 }
        ],
        pago: 20
    },
    {
        nombre: "Señora Marta",
        pedido: [
            { producto: "Pan", cantidad: 1, precio: 0.50 },
            { producto: "Factura", cantidad: 12, precio: 0.75 }
        ],
        pago: 50
    },
    {
        nombre: "Don Carlos",
        pedido: [
            { producto: "Pan", cantidad: 1, precio: 0.50 },
            { producto: "Medialuna", cantidad: 6, precio: 0.80 }
        ],
        pago: 20
    },
    {
        nombre: "Señora Laura",
        pedido: [
            { producto: "Pan", cantidad: 3, precio: 0.50 },
            { producto: "Galleta", cantidad: 12, precio: 0.40 }
        ],
        pago: 15
    }
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
        imagen: "productos/recetas/medialuna.jpg", 
        ingredientes: ["Harina", "Manteca", "Leche", "Azúcar"],
        temperatura: 180,
        tiempoIdeal: 15,
        necesitaBrillo: true,
        necesitaDecoracion: false
    },
    {
        nombre: "Torta",
        imagen: "torta.jpg",
        ingredientes: ["Harina", "Huevos", "Leche", "Azúcar"],
        temperatura: 170,
        tiempoIdeal: 20,
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
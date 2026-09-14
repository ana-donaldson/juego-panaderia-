
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
            { producto: "Pan (1/2 kg)", cantidad: 1, precio: 1.25 },
            { producto: "Factura", cantidad: 12, precio: 0.75 }
        ],
        pago: 50
    },
    {
        nombre: "Don Carlos",
        pedido: [
            { producto: "Pan (1 kg)", cantidad: 1, precio: 2.50 },
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

// ---------- PRODUCTOS (para futura expansión) ----------
const productos = [
    { nombre: "Pan", precio: 0.50, fraccion: "unidad" },
    { nombre: "Factura", precio: 0.75, fraccion: "unidad" },
    { nombre: "Medialuna", precio: 0.80, fraccion: "unidad" },
    { nombre: "Galleta", precio: 0.40, fraccion: "unidad" },
    { nombre: "Pan (1/2 kg)", precio: 1.25, fraccion: "1/2 kg" },
    { nombre: "Pan (1 kg)", precio: 2.50, fraccion: "1 kg" }
];
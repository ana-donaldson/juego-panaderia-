# juego-panaderia-

# Del Horno a la Mano — Portal + Juego

Estructura del proyecto:

```
panaderia-portal/
├── index.html        ← Portal de entrada (reglas + iniciar sesión + botón Jugar)
├── style.css          ← Estilos del portal
├── script.js           ← Lógica del panel de login y el pase al juego
└── juego/
    ├── index.html      ← El juego (tal como estaba en el repo original)
    ├── style.css
    ├── js/
    │   ├── datos.js
    │   ├── cliente.js
    │   ├── cajero.js
    │   ├── ui.js
    │   └── sketch.js
    └── assets/
        ├── persona1.png     ← PLACEHOLDER, reemplazar por el arte real
        └── mueblefeo.png    ← PLACEHOLDER, reemplazar por el arte real
```

## Cómo funciona

1. `index.html` (en la raíz) es el **portal**: explica de qué se trata el
   juego, cómo se juega y los controles, y tiene un botón de **"Iniciar
   sesión"** arriba a la derecha que abre un panel lateral.
2. El botón **"Jugar ahora"** lleva directamente a `juego/index.html`, que es
   el juego original sin cambios de lógica (solo se reubicaron los archivos
   dentro de la carpeta `juego/`).
3. El panel de login es una **demo sin backend**: guarda el nombre ingresado
   en `localStorage` para saludar al jugador y después redirige al juego.
   También hay una opción de **"Seguir como invitado"**. Si en algún momento
   se conecta un backend real (por ejemplo con cuentas de usuario), hay que
   reemplazar la función `irAlJuego` en `script.js` por una llamada real de
   autenticación.

## Los assets son placeholders

Los archivos `juego/assets/persona1.png` y `juego/assets/mueblefeo.png` son
imágenes genéricas generadas para que el juego no se rompa al cargar. Hay
que reemplazarlas por las imágenes reales del cliente y del mostrador
(mismo nombre de archivo, o si cambian el nombre, actualizar la ruta en
`juego/js/sketch.js`, función `preload()`).

## Cómo probarlo

Como el juego usa `p5.js` con `loadImage`, hace falta servirlo con un
servidor local (no abrir el `index.html` con doble clic, por las
restricciones de `file://` en el navegador). Por ejemplo:

```bash
cd panaderia-portal
python3 -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador.

## Deploy en GitHub Pages

`index.html` en la raíz queda como portada y
`/juego/` queda accesible desde el botón "Jugar ahora" sin configuración
extra.

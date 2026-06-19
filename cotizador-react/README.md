# Codensolar · Cotizador Inteligente (React SPA)

Aplicación web de una sola página (SPA) construida con **React 19 + Vite + Tailwind CSS** que reemplaza el cotizador Django original. Permite a los usuarios seleccionar productos solares, ajustar horas de uso y obtener una cotización completa del sistema solar (paneles, baterías, reguladores, breakers, etc.) mediante llamadas a la API de Django.

---

## Stack tecnológico

- **React 19** con Vite 8 como bundler
- **Tailwind CSS v4** para todo el estilado
- **PropTypes** para validación de props
- **Vitest + React Testing Library** para pruebas unitarias y de integración
- **ESLint + Prettier** con reglas estándar
- **Bootstrap 5** (solo CSS para componentes base)

---

## Instalación

```bash
# 1. Entrar al directorio del proyecto
cd cotizador-react

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:5173/static/cotizador/` (configurado para integrarse con Django).

---

## Estructura de carpetas

```
cotizador-react/
├── public/                    # Archivos estáticos públicos
├── src/
│   ├── assets/
│   │   └── images/            # Imágenes del carrusel y placeholders
│   ├── components/
│   │   ├── ui/                # Componentes genéricos de interfaz
│   │   │   ├── Button.jsx     # Botón reutilizable con variantes
│   │   │   └── Spinner.jsx    # Loader animado
│   │   ├── Navbar.jsx         # Barra de navegación con búsqueda
│   │   ├── HeroCarousel.jsx   # Carrusel de imágenes destacadas
│   │   ├── ProductCard.jsx    # Tarjeta de producto individual
│   │   ├── ProductGallery.jsx # Grilla de tarjetas de producto
│   │   ├── CotizadorPanel.jsx # Panel lateral del cotizador
│   │   ├── QuoteItem.jsx      # Ítem individual en el cotizador
│   │   ├── RequirementsPanel.jsx # Acordeón de requerimientos
│   │   └── Footer.jsx         # Footer con enlaces y suscripción
│   ├── hooks/
│   │   └── useQuoteCalculation.js  # Custom hook para cálculos
│   ├── services/
│   │   └── api.js             # Funciones de llamadas a la API
│   ├── utils/
│   │   └── formatCurrency.js  # Formateo de moneda y números
│   ├── App.jsx                # Componente principal orquestador
│   ├── App.test.jsx           # Pruebas de integración
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales + Tailwind
├── tailwind.config.js         # Extensión de colores corporativos
├── vite.config.js             # Configuración de Vite + Vitest
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

---

## Construcción para producción

```bash
npm run build
```

Esto genera los archivos en la carpeta `dist/`:

- `dist/bundle.js` — Script principal
- `dist/index.css` — Estilos compilados

Estos archivos se copian a la carpeta de estáticos de Django (`static/cotizador/`).

---

## Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch (desarrollo)
npm run test:watch
```

### Pruebas incluidas

- **ProductCard.test.jsx** — Renderizado de nombre/precio, llamadas a callbacks Agregar/Eliminar, cambio de estado cuando el producto está en el cotizador
- **CotizadorPanel.test.jsx** — Visualización correcta de totales, mensaje de estado vacío
- **App.test.jsx** — Prueba de integración: renderizado con datos mock, clic en Agregar y verificación de llamada a la API

---

## Datos iniciales

Los datos de productos y usuario se inyectan desde Django mediante elementos `<script>` con `json_script`:

```html
{{ products|json_script:"products-data" }}
{{ usuario|json_script:"user-data" }}
```

En `App.jsx`, estos datos se leen en un `useEffect`:

```jsx
const productsEl = document.getElementById('products-data')
const userEl = document.getElementById('user-data')
if (productsEl) {
  setProducts(JSON.parse(productsEl.textContent))
}
```

### Estructura de productos esperada

```json
[
  {
    "id": 1,
    "name": "Panel Solar 300W",
    "price": 850000,
    "description": "Panel solar monocristalino...",
    "image": "/media/products/panel.jpg",
    "category_id": 1,
    "tiempo_uso": 24
  }
]
```

### Estructura de usuario esperada

```json
{
  "name": "Juan",
  "email": "juan@ejemplo.com",
  "lastname": "Pérez"
}
```

---

## Endpoints de la API utilizados

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| POST | `/products/vista_prueba` | Enviar productos seleccionados y recibir la cotización completa del sistema solar |
| POST | `/products/sendQuote` | Enviar la cotización por correo electrónico en PDF |
| GET | `/products/pdf_vista` | Visualizar el PDF de la cotización en el navegador |

### Formato de petición a `vista_prueba`

```json
[
  {
    "product_id": 1,
    "amount": 2,
    "hours": 24,
    "borrar": false,
    "eliminar_requeimientos": ["regulator_needed"]
  }
]
```

---

## Integración con Django

1. Construir el bundle: `npm run build`
2. Copiar `dist/` a `static/cotizador/` en el proyecto Django
3. En el template `shopping_car.html`, reemplazar el contenido del cotizador por:

```html
<div id="root"></div>
{{ products|json_script:"products-data" }}
{{ usuario|json_script:"user-data" }}
<script src="{% static 'cotizador/dist/bundle.js' %}"></script>
```

4. Mantener `NVProducts.js` solo para la función `window.createandsendpdf`

---

## Personalización de colores

Los colores corporativos se definen en `src/index.css` mediante la directiva `@theme` de Tailwind v4 y también en `tailwind.config.js` para referencia:

| Clase CSS | Color | Descripción |
|-----------|-------|-------------|
| `bg-green` | `#40C92A` | Verde corporativo principal |
| `text-green-dark` | `#2FA31F` | Verde oscuro (precios) |
| `bg-surface` | `#FFFFFF` | Fondo blanco (tarjetas, panel) |
| `bg-surface-2` | `#F4F9F2` | Fondo secundario claro |
| `text-text` | `#2D3A28` | Color de texto principal |
| `text-text-3` | `#8A9E82` | Gris para texto secundario |
| `text-premium` | `#7C3AED` | Púrpura para precio Llave en mano |
| `bg-ink` | `#0D1B09` | Fondo footer oscuro |
| `font-display` | Plus Jakarta Sans | Tipografía principal |
| `font-num` | Manrope | Tipografía para números |

---

## Créditos

**Autor:** Miguel Ángel Quiroga Durán  
**Proyecto:** Codensolar · Cotizador Inteligente de Energía Solar  
**Licencia:** Uso interno Codensolar

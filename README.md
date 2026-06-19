# Codensolar - Cotizador Inteligente de Energía Solar

Plataforma web para cotización de sistemas de energía solar fotovoltaica. Incluye un motor de cálculo automático que dimensiona paneles, baterías, reguladores y demás componentes según el consumo del cliente.

## Stack

**Backend:** Django 4.2 + Django REST Framework + Redis (caché)  
**Frontend:** React 19 + Vite 8 + Tailwind CSS v4  
**Base de datos:** SQLite (desarrollo)  
**Contenedorización:** Docker Compose (Redis + web)  
**PDF:** xhtml2pdf + WeasyPrint  
**Social Login:** django-allauth (Google OAuth)

## Estructura

```
codensolar-ecomerce-main/
├── codensolar/              # Configuración Django (settings, urls, wsgi)
├── products/                # App principal: modelos, vistas, API, tests
├── users/                   # App de usuarios: login, registro, recuperación
├── home/                    # App home
├── cotizador-react/         # Frontend React SPA
│   ├── src/components/      # Componentes React
│   ├── tests/responsive/    # Pruebas Playwright CT
│   └── package.json
├── templetes/               # Templates HTML Django (legacy)
├── statics/                 # Archivos estáticos (CSS/JS build)
├── media/                   # Imágenes subidas (carousel, productos)
├── scripts/                 # Scripts auxiliares
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## Inicio rápido

### Con Docker

```bash
docker compose up -d --build
```

Servidor en `http://localhost:8000`.

### Sin Docker

```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd cotizador-react
npm install
npm run dev
```

## API

| Endpoint | Descripción |
|----------|-------------|
| `GET /products/api/products` | Lista de productos |
| `GET /products/api/categories` | Categorías |
| `GET /products/api/carousel-slides` | Slides del carrusel |
| `GET /products/api/me` | Usuario actual |
| `POST /products/vista_prueba` | Calcular cotización |
| `POST /products/sendQuote` | Enviar cotización por email |

## Frontend (cotizador-react)

SPA React en `/products/cotizador-react`. Compilar con:

```bash
cd cotizador-react
npm run build
xcopy /e /y "dist\*" "..\statics\cotizador\"
```

### Pruebas

```bash
# Vitest (unitarias)
npm test

# Playwright CT (responsive)
npm run test:ct
```

## Características

- Cotizador en tiempo real con cálculo automático de componentes
- Dos modalidades de presupuesto: **Estándar** (módulo centralizado) y **Llave en mano** (con unidad de potencia)
- Generación de PDF de cotización
- Carrusel de imágenes con generación automática de variantes (small/large)
- Responsive design con Tailwind CSS
- Tema verde/light corporativo
- Autenticación con Google

## Licencia

Uso interno — Codensolar

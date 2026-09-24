# PoliTech Digital – Entrega 2

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/Harols34/trabajofrontend)
[![Demo GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-2ea44f?style=flat&logo=githubpages)](https://harols34.github.io/trabajofrontend/)

> 🌐 **Sitio web desplegado en vivo:** [https://harols34.github.io/trabajofrontend/](https://harols34.github.io/trabajofrontend/)

Portal web de noticias tecnológicas desarrollado como proyecto académico de Front End. Implementa renderizado dinámico de contenidos, filtrado interactivo, persistencia en el navegador con `localStorage`, validación de formularios y un panel de administración local (CRUD).

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos sencillos pasos para clonar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
Abre tu terminal y ejecuta:
```bash
git clone https://github.com/Harols34/trabajofrontend.git
cd trabajofrontend
```

### 2. Ejecutar un servidor local
Dado que la aplicación carga datos dinámicos mediante `fetch()` desde `data/noticias.json`, se recomienda utilizar un servidor HTTP local para evitar bloqueos por políticas de origen cruzado (CORS).

Puedes elegir cualquiera de las siguientes opciones:

#### Opción A: Visual Studio Code + Live Server (Recomendada)
1. Abre la carpeta del proyecto en **VS Code**.
2. Instala la extensión **Live Server** (creada por *Ritwick Dey*).
3. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.
4. Se abrirá automáticamente en tu navegador predeterminado (usualmente en `http://127.0.0.1:5500`).

#### Opción B: Con Python (Rápido y sin librerías externas)
Si tienes Python instalado, ejecuta en la raíz del proyecto:
```bash
python -m http.server 5500
```
Luego abre en tu navegador: [http://localhost:5500](http://localhost:5500)

#### Opción C: Con Node.js / npx
Si tienes Node.js instalado, puedes usar:
```bash
npx serve .
# o también:
npx http-server -p 5500
```

> **Nota:** La aplicación incluye un mecanismo de contingencia (`data-fallback.js`) que garantiza la visualización de datos incluso si se abre directamente el archivo `index.html` sin servidor local.

---

## 📁 Estructura del Proyecto

```text
├── index.html            # Portada principal con noticias destacadas y recientes
├── noticias.html         # Catálogo completo con buscador y filtros
├── categorias.html       # Navegación y agrupación por categorías temáticas
├── detalle.html          # Vista en detalle de la noticia seleccionada
├── favoritos.html        # Sección de artículos guardados por el usuario
├── contacto.html         # Formulario de contacto con validación en tiempo real
├── administrar.html      # Panel mini-CRUD (creación y eliminación de noticias)
├── data/
│   └── noticias.json     # Base de datos local en formato JSON
├── assets/
│   └── images/           # Recursos visuales e imágenes de las noticias
├── css/
│   └── styles.css        # Hoja de estilos principal (diseño responsive y componentes)
└── js/
    ├── app.js            # Lógica central, manejo de estado y renderizado general
    ├── news-page.js      # Lógica para filtrado, búsqueda y detalle de noticias
    └── data-fallback.js  # Respaldo de datos ante restricciones de fetch local
```

---

## ✨ Funcionalidades Principales

- **Renderizado Dinámico:** Carga asíncrona de artículos y metadatos desde un archivo JSON.
- **Búsqueda y Filtros en Tiempo Real:** Filtrado por categoría tecnológica y búsqueda instantánea por palabras clave.
- **Vista de Detalle:** Despliegue completo del artículo con tiempo estimado de lectura y noticias relacionadas.
- **Favoritos con Persistencia:** Marcado de noticias favoritas guardadas en `localStorage` para persistir entre sesiones.
- **Formulario de Contacto:** Validación exhaustiva de campos requeridos (nombre, email, mensaje) con retroalimentación visual al usuario.
- **Panel CRUD Local:** Permite dar de alta nuevas publicaciones y eliminar noticias existentes localmente.
- **Diseño Responsive:** Adaptabilidad completa para dispositivos móviles, tabletas y computadoras de escritorio.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico y accesible.
- **CSS3:** Flexbox, CSS Grid, variables CSS personalizadas y diseño adaptativo.
- **JavaScript (ES6+):** Manipulación del DOM, Web APIs (`Fetch`, `LocalStorage`, `URLSearchParams`) y programación modular.

---

## 👥 Autores y Créditos

- **Subgrupo:** 11
- **Integrante:** Harold Sneider Alvarez Carrillo
- **Institución:** Politécnico Grancolombiano  
- **Módulo:** Front End (Entrega 2)

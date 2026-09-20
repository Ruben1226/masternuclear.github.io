# 🎓 Portal Académico del Máster

Plataforma web personal moderna, rápida y profesional diseñada para organizar, centralizar y gestionar todo el contenido, recursos, entregas y calendario de tu curso de máster.

Construido con **HTML5 semántico, CSS3 moderno (Custom Properties, Flexbox, Grid) y JavaScript Vanilla**, listo para ser publicado gratis en **GitHub Pages** sin necesidad de Node.js, compilación ni configuración de servidores.

---

## 🌟 Características Principales

1. **Dashboard & Resumen General**:
   - Estadísticas del curso (60 ECTS, 10 asignaturas distribuidas en 2 cuatrimestres).
   - Indicador de próximas entregas y exámenes con cuenta atrás automática ("¡Vence hoy!", "En 3 días", etc.).
   - Modo Oscuro y Modo Claro con memoria en el navegador (`localStorage`).
   - Buscador global instantáneo (`Ctrl + K`) para localizar cualquier tema, apunte, examen o enlace en segundos.

2. **Gestión Integral de Asignaturas (10 Materias)**:
   - Filtros rápidos: *Todas*, *1º Cuatrimestre*, *2º Cuatrimestre* y *En Curso*.
   - Panel detallado para cada asignatura organizado en pestañas:
     - 📚 **Apuntes & Temas**: Diapositivas, lecturas y notas con botón de descarga.
     - 📝 **Ejercicios & Problemas**: Boletines de problemas e indicador de soluciones.
     - 💻 **Prácticas & Laboratorios**: Fechas límite de entrega, estado y enlace directo al repositorio de código (GitHub).
     - 🎯 **Exámenes & Pruebas**: Fechas de parciales y finales, aula, notas y modelos de exámenes anteriores.
     - ℹ️ **Guía & Criterios**: Ponderación porcentual de evaluación, competencias y bibliografía.

3. **Calendario Académico & Fechas Límite**:
   - Calendario mensual interactivo con navegación entre meses.
   - Puntos de colores según el tipo de evento (Exámenes en rojo, Entregas en azul, Días no lectivos en ámbar).
   - **Exportación a `.ics`**: Descarga un archivo compatible con Google Calendar, Apple Calendar y Outlook para sincronizar tus fechas con tu móvil o portátil.

4. **Hub de Enlaces Rápidos**:
   - Acceso con un clic a: Aula Virtual (Moodle), Secretaría, Correo institucional, Biblioteca/VPN, Overleaf (LaTeX), GitHub, Google Drive, Google Scholar, arXiv, etc.

5. **Herramientas Académicas Extras**:
   - 📊 **Calculadora de Calificaciones Ponderadas**: Elige cualquier asignatura, introduce tus notas parciales y calcula automáticamente tu nota final ponderada y estado (Aprobado, Notable, Sobresaliente).
   - 📋 **Gestor de Tareas / To-Do List**: Anota pendientes rápidos con guardado persistente en tu navegador.

---

## 📁 Estructura del Proyecto

```text
Pagina web master/
├── index.html              # Estructura principal de la aplicación web
├── css/
│   ├── main.css            # Variables de diseño, temas (oscuro/claro) y tipografía
│   └── components.css      # Estilos de tarjetas, modal panorámico, calendario y buscador
├── js/
│   ├── data.js             # 👈 ARCHIVO DE DATOS (edita aquí tus asignaturas, fechas y links)
│   ├── calendar.js         # Lógica interactiva del calendario y exportación a .ics
│   └── app.js              # Controlador principal, buscador Ctrl+K, calculadora y tareas
├── docs/                   # Carpeta para almacenar tus PDFs y apuntes
│   ├── README.md           # Guía para organizar tus documentos
│   └── asignaturas/        # Subcarpetas para cada asignatura
└── README.md               # Este archivo de documentación
```

---

## 🚀 Cómo Visualizarlo en Local

Simplemente haz doble clic en el archivo `index.html` para abrirlo en tu navegador favorito (Chrome, Firefox, Edge, Safari).

Si prefieres abrirlo con un servidor local:
- **Con Python**:
  ```bash
  python -m http.server 8080
  ```
  y abre `http://localhost:8080` en tu navegador.

---

## 🌐 Cómo Publicarlo en GitHub Pages (En 3 Pasos)

1. **Crea un repositorio en GitHub**:
   - Entra en [GitHub](https://github.com/new) y crea un nuevo repositorio (por ejemplo, `master-portal` o `mi-master`).
   - Puedes marcarlo como **Público** o Privado (GitHub Pages soporta repositorios públicos en cuentas gratuitas).

2. **Sube tus archivos al repositorio**:
   Abre una terminal en esta carpeta y ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Inicializar portal del master"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
   git push -u origin main
   ```

3. **Activa GitHub Pages**:
   - En tu repositorio de GitHub, ve a **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
   - En **Build and deployment** > **Branch**, selecciona la rama `main` y la carpeta `/ (root)`.
   - Haz clic en **Save**.
   - ¡Listo! En un minuto tu portal estará disponible en internet en la URL:  
     `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`

---

## ✏️ Cómo Personalizar el Contenido (`js/data.js`)

**No necesitas tocar el código HTML ni CSS para cambiar o añadir información.** Todo está centralizado en el archivo `js/data.js`:

### Cambiar el título del máster y la universidad:
Edita las primeras líneas de `js/data.js`:
```javascript
info: {
  title: "Máster en Inteligencia Artificial y Datos",
  subtitle: "Portal Académico & Cuaderno Centralizado del Curso",
  university: "Universidad Complutense de Madrid",
  academicYear: "2026 - 2027",
  // ...
}
```

### Cambiar el nombre de una asignatura o añadir apuntes:
Busca la asignatura (ejemplo `id: "asig-1"`):
```javascript
{
  id: "asig-1",
  code: "MIA-01",
  name: "Aprendizaje Automático Avanzado",
  shortName: "Machine Learning",
  semester: 1,
  ects: 6,
  color: "#6366f1",
  // ...
  sections: {
    apuntes: [
      {
        id: "ap-1-1",
        title: "Tema 1: Redes Neuronales y Backpropagation",
        description: "Transparencias oficiales de la sesión 1 y 2.",
        date: "2026-09-22",
        fileUrl: "docs/asignaturas/asig-1/tema1.pdf", // Ruta a tu PDF
        type: "pdf"
      }
    ],
    // ...
  }
}
```

> **Consejo**: Si tus apuntes están en **Google Drive** o **OneDrive**, puedes pegar el enlace de compartir directamente en `fileUrl: "https://drive.google.com/file/d/..."`.

---

## ⌨️ Atajos de Teclado Útiles

- <kbd>Ctrl</kbd> + <kbd>K</kbd> (o <kbd>Cmd</kbd> + <kbd>K</kbd> en Mac): Abre el buscador instantáneo global.
- <kbd>Esc</kbd>: Cierra cualquier ventana modal o panel de búsqueda abierto.

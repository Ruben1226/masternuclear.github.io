# ⚛️ Portal del Máster Interuniversitario en Física Nuclear (UCM)

Web personal, luminosa y adaptada a móvil para centralizar las asignaturas, el calendario del curso y **todos tus documentos** (apuntes, problemas, prácticas y exámenes). Se publica gratis con **GitHub Pages**.

---

## ✨ Qué incluye

| Sección | Qué hace |
|---|---|
| **Asignaturas** | Una tarjeta por materia con su color, fechas clave, nº de documentos y progreso de lectura. |
| **Biblioteca** | Todos los documentos de tus carpetas, con buscador y filtro por tipo. Léelos en la propia web o descárgalos. |
| **Lector integrado** | Visor de PDF a pantalla completa (←/→ para cambiar de documento, `Esc` para cerrar), con enlace directo compartible (`index.html#leer=<ruta>`). En móvil abre el PDF con el visor nativo. |
| **Calendario** | Vista *Mes* con barras de color por asignatura, vista *Curso* (cronograma de octubre a julio), detalle del día, agenda con cuenta atrás, filtro por asignatura y exportación `.ics` para el móvil. |
| **Ctrl + K** | Buscador global de asignaturas **y documentos**. |
| **Herramientas** | Calculadora de nota ponderada y lista de tareas (se guardan en tu navegador). |

Las carpetas **vacías no aparecen** en la web: solo se muestra lo que tiene archivos.

---

## 📁 Estructura del proyecto

```text
/
├── index.html
├── README.md
├── actualizar-documentos.bat        ← doble clic: regenera el índice de documentos (Windows)
├── .nojekyll  ·  .gitignore
├── .github/workflows/
│   └── actualizar-documentos.yml    ← regenera el índice solo, en cada push a GitHub
├── tools/
│   └── generar-manifiesto.mjs       ← escanea las carpetas y crea js/docs-manifest.js
├── css/   main.css · components.css · docs.css · calendar.css
├── js/
│   ├── data.js                      ← asignaturas, fechas, evaluación, enlaces  (EDITABLE)
│   ├── docs-meta.js                 ← títulos bonitos para los PDFs             (EDITABLE, opcional)
│   ├── docs-manifest.js             ← índice de archivos   (GENERADO, no editar)
│   ├── ui.js · docs.js · calendar.js · app.js
│
├── Estructura Nuclear/              ┐
├── Reacciones nucleares/            │  Carpetas de documentos: cada una es una asignatura
├── Fisica nuclear experimental/     │  y cada subcarpeta (TEMAS, Ejercicios, Examenes,
├── Aplicada I/                      │  Practicas, Documentacion) una pestaña de la web.
├── Aplicada II/                     │
└── Radioprotección/                 ┘
```

---

## ➕ Añadir o cambiar documentos

1. Copia el archivo a la carpeta de la asignatura, dentro de la subcarpeta que corresponda
   (`TEMAS`, `Ejercicios`, `Examenes`, `Practicas`, `Documentacion`). Puedes crear subcarpetas; se muestran agrupadas.
   Cualquier otra subcarpeta que crees (p. ej. `Laboratorio`) aparece también como una pestaña nueva.
2. Actualiza el índice de una de estas dos formas:
   - **Automático:** sube los cambios a GitHub (con `git push` o arrastrando los archivos en la web). El workflow regenera `js/docs-manifest.js` en menos de un minuto.
   - **Local:** doble clic en `actualizar-documentos.bat` (o `node tools/generar-manifiesto.mjs`) antes de subir.
3. *(Opcional)* Dale un título legible en `js/docs-meta.js`. Si no lo haces, la web genera uno a partir del nombre del archivo.

> Tras un push automático, GitHub tiene un commit nuevo del bot: haz `git pull` antes de tu siguiente `git push`.

### Subir documentos desde la propia web (también desde el móvil)
GitHub Pages es un servidor estático y **no puede recibir archivos por sí mismo**. Lo que sí hace la web es llevarte, en un toque, a la página de subida de GitHub ya apuntando a la carpeta correcta:

1. Abre una asignatura → pestaña **Subir** (o el botón *Subir* de su tarjeta) → elige la carpeta (Temas, Ejercicios, Exámenes…).
2. Se abre GitHub: arrastra los archivos (en el móvil, *choose your files*) y pulsa **Commit changes**.
3. En 1–3 minutos aparecen en la web: el workflow regenera el índice solo.

- La pestaña **Subir** aparece cuando la web está en `https://USUARIO.github.io/REPO/` (se detecta sola). En local o con dominio propio, rellena `info.github` en `js/data.js`.
- Necesitas haber iniciado sesión en GitHub con permiso de escritura en el repositorio.
- Desde el navegador GitHub admite **hasta 25 MB por archivo**. De 25 a 100 MB usa GitHub Desktop o `git push`.

### El ZIP de 2 GB de Estructura Nuclear
No cabe en el repositorio (límite de 100 MB por archivo), por eso no se sube. Opciones:

- **GitHub Release** (gratis, hasta 2 GiB por archivo; este ZIP pesa 1,94 GiB): en el repo → *Releases* → *Draft a new release* → arrastra el ZIP → *Publish*. Copia el enlace del archivo (clic derecho → copiar enlace).
- **Drive / OneDrive:** sube el ZIP y copia el enlace de descarga compartido.

Pega el enlace en `js/data.js`, en la entrada *DRIVE 25-26 completo (ZIP)* de `extraDocs` de Estructura Nuclear (`url: ""`). Mientras esté vacío no se muestra; al rellenarlo aparece en la pestaña *Documentación* con su botón **Descargar**.

### Enlazar una carpeta de Drive o una web
En `js/data.js`, dentro de la asignatura, añade a `extraDocs` (ya hay un ejemplo en Estructura Nuclear):

```js
extraDocs: [
  { category: "Documentacion", title: "Carpeta de Drive del curso", desc: "Presentaciones y programas.", url: "https://drive.google.com/..." }
]
```

### Asignaturas sin documentos todavía
Técnicas Avanzadas, Astrofísica Nuclear y TFM ya tienen `docsFolder` (`Tecnicas Avanzadas`, `Astrofisica Nuclear`, `TFM`) aunque sus carpetas no existan: se crean al subir el primer archivo (Git no guarda carpetas vacías). Para una asignatura nueva, crea su carpeta y pon en `js/data.js` `docsFolder: "Nombre exacto de la carpeta"`.

---

## ⚠️ Límites de GitHub

- Un archivo **no puede pesar más de 100 MB** (avisa a partir de 50 MB). El generador **excluye** automáticamente cualquier archivo mayor de 95 MB y **todos los ZIP/RAR/7z**; `.gitignore` también evita que se intenten subir. Para material muy pesado usa un enlace de Drive (`extraDocs`).
- El repositorio recomendado no debería pasar de ~1 GB en total.
- **Los archivos de un repositorio público los puede descargar cualquiera** con el enlace. La web incluye `noindex` para que Google no la indexe, pero no es una protección. Ten en cuenta los derechos de autor de apuntes de terceros y el material del profesorado; si dudas, usa un repositorio **privado**.
- Revisa que ningún PDF contenga contraseñas o datos personales (p. ej. la guía de Estructura Nuclear incluye la contraseña de la videoconferencia).

---

## 🚀 Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Portal máster física nuclear"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
git push -u origin main
```

Después, en el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
Para verlo en local: `python -m http.server 8000` y abre <http://localhost:8000>.

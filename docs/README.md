# Carpeta de Documentos y Recursos del Máster (`docs/`)

En esta carpeta puedes guardar todos tus archivos PDF, presentaciones, guías y documentos para que se puedan visualizar o descargar directamente desde la página web (tanto en tu ordenador como en GitHub Pages).

## Estructura Recomendada:

```
docs/
└── asignaturas/
    ├── asig-1/
    │   ├── tema1.pdf
    │   ├── tema2.pdf
    │   ├── boletin1.pdf
    │   ├── practica1.pdf
    │   └── examen-modelo-2025.pdf
    ├── asig-2/
    │   └── ...
    ├── asig-3/
    └── ... hasta asig-10/
```

## ¿Cómo vincular un nuevo documento en la web?
Solo tienes que abrir el archivo `js/data.js`, buscar la asignatura correspondiente y en la sección deseada (`apuntes`, `ejercicios`, `practicas` o `examenes`) añadir el nombre y la ruta relativa:

```javascript
{
  id: "ap-1-4",
  title: "Tema 4: Algoritmos de Optimización",
  description: "Diapositivas y apuntes del profesor.",
  date: "2026-11-02",
  fileUrl: "docs/asignaturas/asig-1/tema4.pdf",
  type: "pdf"
}
```

> **Consejo**: Si prefieres enlazar archivos alojados en **Google Drive**, **OneDrive** o **GitHub**, en lugar de una ruta local como `docs/...`, ¡puedes poner directamente la URL compartida de Drive (`https://drive.google.com/...`) en el campo `fileUrl`!

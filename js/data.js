/**
 * ====================================================================
 * BASE DE DATOS DEL MÁSTER (DATA.JS)
 * ====================================================================
 * Aquí puedes editar fácilmente toda la información de tu máster:
 * - Datos generales y universidad
 * - Las 10 asignaturas con sus apuntes, ejercicios, prácticas y exámenes
 * - El calendario de eventos y fechas límite
 * - La lista de enlaces útiles
 * 
 * ¡No necesitas modificar código HTML para añadir nuevos apuntes o enlaces!
 */

const MASTER_DATA = {
  info: {
    title: "Máster Universitario en Ciencia e Ingeniería de Datos",
    subtitle: "Portal Académico & Cuaderno Centralizado del Curso",
    university: "Universidad Politécnica / Facultad de Informática",
    academicYear: "2026 - 2027",
    totalCredits: 60,
    enrolledCredits: 60,
    passedCredits: 0,
    currentSemester: 1
  },

  // 10 ASIGNATURAS (5 en 1º Cuatrimestre y 5 en 2º Cuatrimestre)
  subjects: [
    {
      id: "asig-1",
      code: "ASIG-101",
      name: "Asignatura 1",
      shortName: "Asig 1",
      semester: 1,
      ects: 6,
      color: "#6366f1", // Indigo
      status: "en_curso", // "en_curso" | "pendiente" | "superada"
      grade: null, // Nota final si ya está cursada
      professor: {
        name: "Dr. Juan Pérez Martínez",
        email: "jperez@universidad.edu",
        office: "Edificio Norte - Despacho 204",
        tutoring: "Lunes y Miércoles de 10:00 a 12:00 (o Teams)"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Final Oficial", weight: 50 },
        { item: "Prácticas de Laboratorio", weight: 35 },
        { item: "Entregas Continuas y Casos", weight: 15 }
      ],
      sections: {
        apuntes: [
          { id: "ap-1-1", title: "Tema 1: Fundamentos e Introducción", description: "Diapositivas y notas teóricas de la sesión inaugural.", date: "2026-09-22", fileUrl: "docs/asignaturas/asig-1/tema1.pdf", type: "pdf" },
          { id: "ap-1-2", title: "Tema 2: Modelos Teóricos y Arquitectura", description: "Guía de estudio y conceptos clave para la primera evaluación.", date: "2026-10-06", fileUrl: "docs/asignaturas/asig-1/tema2.pdf", type: "pdf" },
          { id: "ap-1-3", title: "Tema 3: Métodos Avanzados de Análisis", description: "Material de profundización y lecturas recomendadas.", date: "2026-10-20", fileUrl: "docs/asignaturas/asig-1/tema3.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-1-1", title: "Boletín 1: Problemas Básicos", description: "Ejercicios numéricos y analíticos para resolver en clase.", date: "2026-09-28", fileUrl: "docs/asignaturas/asig-1/boletin1.pdf", hasSolutions: true },
          { id: "ej-1-2", title: "Boletín 2: Casos de Estudio y Análisis", description: "Cuestiones de examen resueltas paso a paso.", date: "2026-10-14", fileUrl: "docs/asignaturas/asig-1/boletin2.pdf", hasSolutions: false }
        ],
        practicas: [
          { id: "pr-1-1", title: "Práctica 1: Configuración de Entorno y Pruebas", description: "Configuración inicial, scripts básicos y reporte en PDF.", deadline: "2026-10-18", status: "en_progreso", fileUrl: "docs/asignaturas/asig-1/practica1.pdf", repoUrl: "https://github.com" },
          { id: "pr-1-2", title: "Práctica 2: Proyecto Grupal Intermedio", description: "Desarrollo completo de la solución y presentación técnica.", deadline: "2026-11-25", status: "pendiente", fileUrl: "docs/asignaturas/asig-1/practica2.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-1-1", title: "Examen Parcial (Temas 1 y 2)", date: "2026-11-04", weight: "20%", location: "Aula Magna 1.2", notes: "Calculadora no programable permitida.", fileUrl: "docs/asignaturas/asig-1/examen-modelo-2025.pdf" },
          { id: "ex-1-2", title: "Examen Final Ordinario", date: "2027-01-18", weight: "50%", location: "Aula 201", notes: "Convocatoria oficial del 1º Cuatrimestre.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Esta asignatura proporciona la base conceptual necesaria para afrontar con éxito el resto del bloque de especialidad.",
          competencias: ["Dominio del marco teórico principal", "Capacidad de resolución analítica de problemas", "Trabajo experimental en laboratorio"],
          bibliografia: "Libro de referencia: Smith & Jones (2024), Academic Press."
        }
      }
    },
    {
      id: "asig-2",
      code: "ASIG-102",
      name: "Asignatura 2",
      shortName: "Asig 2",
      semester: 1,
      ects: 6,
      color: "#0284c7", // Sky blue
      status: "en_curso",
      grade: null,
      professor: {
        name: "Dra. Elena Gómez Soler",
        email: "egomez@universidad.edu",
        office: "Edificio Sur - Despacho 110",
        tutoring: "Viernes 09:30 a 13:30"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Proyecto Práctico Final", weight: 60 },
        { item: "Exámenes Cortos de Seguimiento", weight: 30 },
        { item: "Participación y Foros", weight: 10 }
      ],
      sections: {
        apuntes: [
          { id: "ap-2-1", title: "Tema 1: Arquitectura y Componentes", description: "Principios de diseño y especificaciones técnicas.", date: "2026-09-25", fileUrl: "docs/asignaturas/asig-2/tema1.pdf", type: "pdf" },
          { id: "ap-2-2", title: "Tema 2: Protocolos y Conectividad", description: "Estándares actuales y patrones de comunicación.", date: "2026-10-10", fileUrl: "docs/asignaturas/asig-2/tema2.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-2-1", title: "Relación de Problemas 1", description: "Cálculo de rendimientos y latencias de sistema.", date: "2026-10-02", fileUrl: "docs/asignaturas/asig-2/problemas1.pdf", hasSolutions: true }
        ],
        practicas: [
          { id: "pr-2-1", title: "Práctica 1: Implementación Básica", description: "Construcción del primer prototipo funcional.", deadline: "2026-10-22", status: "pendiente", fileUrl: "docs/asignaturas/asig-2/practica1.pdf", repoUrl: "https://github.com" },
          { id: "pr-2-2", title: "Práctica 2: Despliegue y Pruebas de Carga", description: "Entorno contenerizado y evaluación de métricas.", deadline: "2026-12-05", status: "pendiente", fileUrl: "docs/asignaturas/asig-2/practica2.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-2-1", title: "Control Teórico 1", date: "2026-10-28", weight: "15%", location: "Aula Virtual", notes: "Cuestionario online cronometrado.", fileUrl: "" },
          { id: "ex-2-2", title: "Examen Final Global", date: "2027-01-22", weight: "40%", location: "Aula 104", notes: "Parte teórica y problemas prácticos.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Enfoque práctico centrado en la implementación y optimización de soluciones escalables.",
          competencias: ["Diseño de sistemas distribuidos", "Optimización de rendimiento", "Despliegue en la nube"],
          bibliografia: "Documentation oficial y artículos IEEE."
        }
      }
    },
    {
      id: "asig-3",
      code: "ASIG-103",
      name: "Asignatura 3",
      shortName: "Asig 3",
      semester: 1,
      ects: 6,
      color: "#10b981", // Emerald green
      status: "en_curso",
      grade: null,
      professor: {
        name: "Dr. Carlos Fernández Luque",
        email: "cfernandez@universidad.edu",
        office: "Edificio Central - Despacho 312",
        tutoring: "Martes 16:00 a 19:00"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Final", weight: 40 },
        { item: "Trabajos de Laboratorio", weight: 40 },
        { item: "Presentación Oral", weight: 20 }
      ],
      sections: {
        apuntes: [
          { id: "ap-3-1", title: "Tema 1: Fundamentos Matemáticos", description: "Álgebra y cálculo aplicados al ámbito del máster.", date: "2026-09-23", fileUrl: "docs/asignaturas/asig-3/tema1.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-3-1", title: "Ejercicios de Modelado", description: "Demostraciones y ejercicios prácticos de optimización.", date: "2026-10-05", fileUrl: "docs/asignaturas/asig-3/ejercicios1.pdf", hasSolutions: true }
        ],
        practicas: [
          { id: "pr-3-1", title: "Práctica 1: Simulación Numérica", description: "Código en Python / R con análisis estadístico.", deadline: "2026-11-10", status: "pendiente", fileUrl: "docs/asignaturas/asig-3/practica1.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-3-1", title: "Examen Final de Cuatrimestre", date: "2027-01-26", weight: "40%", location: "Aula 301", notes: "Se permite una hoja de fórmulas manuscrita.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Bases analíticas rigurosas para la modelización y validación formal de hipótesis.",
          competencias: ["Modelado matemático", "Inferencia estadística", "Simulación computacional"],
          bibliografia: "Bishop, C. M. Pattern Recognition and Machine Learning."
        }
      }
    },
    {
      id: "asig-4",
      code: "ASIG-104",
      name: "Asignatura 4",
      shortName: "Asig 4",
      semester: 1,
      ects: 6,
      color: "#8b5cf6", // Violet
      status: "en_curso",
      grade: null,
      professor: {
        name: "Dra. Lucía Navarro Rivas",
        email: "lnavarro@universidad.edu",
        office: "Edificio Este - Despacho 405",
        tutoring: "Jueves 11:00 a 14:00"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Teórico-Práctico", weight: 50 },
        { item: "Proyecto Aplicado", weight: 50 }
      ],
      sections: {
        apuntes: [
          { id: "ap-4-1", title: "Tema 1: Metodologías y Marcos de Trabajo", description: "Gestión ágil de proyectos y buenas prácticas de ingeniería.", date: "2026-09-24", fileUrl: "docs/asignaturas/asig-4/tema1.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-4-1", title: "Casos Prácticos de Planificación", description: "Estimación de esfuerzos, plazos y riesgos.", date: "2026-10-08", fileUrl: "docs/asignaturas/asig-4/casos.pdf", hasSolutions: false }
        ],
        practicas: [
          { id: "pr-4-1", title: "Práctica Continua: Sprint 1", description: "Definición de requerimientos y arquitectura inicial.", deadline: "2026-10-31", status: "pendiente", fileUrl: "docs/asignaturas/asig-4/sprint1.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-4-1", title: "Examen Final", date: "2027-01-29", weight: "50%", location: "Aula 202", notes: "Examen de preguntas abiertas y caso práctico.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Metodologías ágiles, calidad del software y gobernanza técnica.",
          competencias: ["Liderazgo técnico", "Gestión de ciclos de vida", "Diseño orientado a la calidad"],
          bibliografia: "Guías estándar de ingeniería y calidad ISO/IEC."
        }
      }
    },
    {
      id: "asig-5",
      code: "ASIG-105",
      name: "Asignatura 5",
      shortName: "Asig 5",
      semester: 1,
      ects: 6,
      color: "#f59e0b", // Amber
      status: "en_curso",
      grade: null,
      professor: {
        name: "Dr. Roberto Santos Vega",
        email: "rsantos@universidad.edu",
        office: "Edificio Polivalente - Despacho 15",
        tutoring: "Miércoles y Viernes 12:00 a 14:00"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Parcial", weight: 25 },
        { item: "Examen Final", weight: 35 },
        { item: "Talleres y Laboratorios", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-5-1", title: "Tema 1: Aspectos Éticos, Legales y Seguridad", description: "Normativa RGPD, seguridad de la información y privacidad.", date: "2026-09-26", fileUrl: "docs/asignaturas/asig-5/tema1.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-5-1", title: "Análisis de Riesgos y Cumplimiento", description: "Auditoría de un caso real simulado.", date: "2026-10-15", fileUrl: "docs/asignaturas/asig-5/auditoria.pdf", hasSolutions: true }
        ],
        practicas: [
          { id: "pr-5-1", title: "Laboratorio 1: Cifrado y Control de Acceso", description: "Implementación de políticas y hardening.", deadline: "2026-11-18", status: "pendiente", fileUrl: "docs/asignaturas/asig-5/lab1.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-5-1", title: "Evaluación Final", date: "2027-02-02", weight: "35%", location: "Aula Magna 2.1", notes: "Convocatoria ordinaria.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Ciberseguridad, legislación y consideraciones éticas en proyectos tecnológicos.",
          competencias: ["Auditoría de seguridad", "Cumplimiento normativo", "Privacidad desde el diseño"],
          bibliografia: "Material del INCIBE y guías ENS (Esquema Nacional de Seguridad)."
        }
      }
    },

    // --- SEGUNDO CUATRIMESTRE ---
    {
      id: "asig-6",
      code: "ASIG-201",
      name: "Asignatura 6",
      shortName: "Asig 6",
      semester: 2,
      ects: 6,
      color: "#ec4899", // Pink / Rose
      status: "pendiente",
      grade: null,
      professor: {
        name: "Dra. Marta Morales Gil",
        email: "mmorales@universidad.edu",
        office: "Edificio Norte - Despacho 308",
        tutoring: "Por determinar en 2º Semestre"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Final Oficial", weight: 50 },
        { item: "Práctica Avanzada", weight: 50 }
      ],
      sections: {
        apuntes: [
          { id: "ap-6-1", title: "Tema 1: Introducción a la Materia Avanzada", description: "Próximamente disponible al inicio del 2º cuatrimestre.", date: "2027-02-15", fileUrl: "", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-6-1", title: "Examen Final Ordinario", date: "2027-06-10", weight: "50%", location: "Aula Magna", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Asignatura de especialización avanzada impartida durante el segundo cuatrimestre.",
          competencias: ["Especialización temática", "Resolución de problemas de alta complejidad"],
          bibliografia: "Se publicará en la guía docente oficial."
        }
      }
    },
    {
      id: "asig-7",
      code: "ASIG-202",
      name: "Asignatura 7",
      shortName: "Asig 7",
      semester: 2,
      ects: 6,
      color: "#14b8a6", // Teal
      status: "pendiente",
      grade: null,
      professor: {
        name: "Dr. Antonio Ruiz Blanco",
        email: "aruiz@universidad.edu",
        office: "Edificio Sur - Despacho 215",
        tutoring: "Por determinar en 2º Semestre"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Proyecto Integral", weight: 70 },
        { item: "Defensa y Cuestionario", weight: 30 }
      ],
      sections: {
        apuntes: [],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-7-1", title: "Examen Final Ordinario", date: "2027-06-14", weight: "30%", location: "Aula 102", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Desarrollo de proyectos completos con enfoque industrial.",
          competencias: ["Capacidad integradora", "Trabajo en equipo multidisciplinar"],
          bibliografia: "Artículos y documentación técnica."
        }
      }
    },
    {
      id: "asig-8",
      code: "ASIG-203",
      name: "Asignatura 8",
      shortName: "Asig 8",
      semester: 2,
      ects: 6,
      color: "#3b82f6", // Blue
      status: "pendiente",
      grade: null,
      professor: {
        name: "Dra. Sofía Castillo Ortiz",
        email: "scastillo@universidad.edu",
        office: "Edificio Central - Despacho 120",
        tutoring: "Por determinar en 2º Semestre"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Examen Final", weight: 50 },
        { item: "Prácticas y Casos", weight: 50 }
      ],
      sections: {
        apuntes: [],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-8-1", title: "Examen Final Ordinario", date: "2027-06-18", weight: "50%", location: "Aula 205", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Técnicas innovadoras y herramientas punteras del sector.",
          competencias: ["Innovación tecnológica", "Pensamiento crítico"],
          bibliografia: "Bibliografía recomendada por el departamento."
        }
      }
    },
    {
      id: "asig-9",
      code: "ASIG-204",
      name: "Asignatura 9",
      shortName: "Asig 9",
      semester: 2,
      ects: 6,
      color: "#d97706", // Dark Amber
      status: "pendiente",
      grade: null,
      professor: {
        name: "Dr. Manuel Herrero Pons",
        email: "mherrero@universidad.edu",
        office: "Edificio Este - Despacho 310",
        tutoring: "Por determinar en 2º Semestre"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Evaluación Teórica", weight: 40 },
        { item: "Trabajos de Campo", weight: 60 }
      ],
      sections: {
        apuntes: [],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-9-1", title: "Examen Final Ordinario", date: "2027-06-22", weight: "40%", location: "Aula 304", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Análisis experimental y validación de campo.",
          competencias: ["Diseño de experimentos", "Tratamiento de resultados"],
          bibliografia: "Guías de laboratorio especializadas."
        }
      }
    },
    {
      id: "asig-10",
      code: "ASIG-205",
      name: "Asignatura 10 (TFM / Optativa)",
      shortName: "Asig 10 (TFM)",
      semester: 2,
      ects: 6,
      color: "#84cc16", // Lime
      status: "pendiente",
      grade: null,
      professor: {
        name: "Comisión Académica del Máster",
        email: "master.coordinacion@universidad.edu",
        office: "Secretaría de Másteres - Despacho 0.05",
        tutoring: "Lunes a Viernes 09:00 a 14:00"
      },
      campusUrl: "https://campusvirtual.universidad.es",
      evaluation: [
        { item: "Memoria Escrita del Trabajo", weight: 60 },
        { item: "Defensa Pública ante Tribunal", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-10-1", title: "Guía de Elaboración del Trabajo Fin de Máster", description: "Normativa de formato, estructura y plazos de entrega.", date: "2027-02-01", fileUrl: "docs/asignaturas/asig-10/guia-tfm.pdf", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [
          { id: "pr-10-1", title: "Entrega del Anteproyecto / Propuesta", description: "Aprobación de temática, tutor y cronograma.", deadline: "2027-03-15", status: "pendiente", fileUrl: "", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-10-1", title: "Defensa Pública de TFM (Convocatoria Ordinaria)", date: "2027-07-08", weight: "100%", location: "Salón de Actos", notes: "Presentación de 20 minutos + preguntas del tribunal.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Culminación de los estudios de máster demostrando la adquisición integral de competencias.",
          competencias: ["Investigación autónoma", "Redacción científica y técnica", "Defensa oral rigurosa"],
          bibliografia: "Reglamento oficial de TFM de la Universidad."
        }
      }
    }
  ],

  // ENLACES RÁPIDOS AGRUPADOS POR CATEGORÍA
  links: [
    {
      category: "Campus & Universidad",
      items: [
        { title: "Aula Virtual (Moodle)", desc: "Entregas oficiales, foros y avisos del profesorado", url: "https://campusvirtual.universidad.es", icon: "school", badge: "Oficial" },
        { title: "Secretaría Virtual", desc: "Matrícula, expediente académico y tasas universitarias", url: "https://secretaria.universidad.es", icon: "badge", badge: "Gestión" },
        { title: "Correo Institucional", desc: "Bandeja de entrada corporativa (@universidad.edu)", url: "https://correo.universidad.es", icon: "mail", badge: "Email" },
        { title: "Biblioteca & VPN", desc: "Acceso remoto a bases de datos y revistas científicas", url: "https://biblioteca.universidad.es", icon: "book", badge: "Recursos" }
      ]
    },
    {
      category: "Herramientas de Estudio & Desarrollo",
      items: [
        { title: "Overleaf (LaTeX)", desc: "Redactor online para memorias de prácticas y artículos", url: "https://www.overleaf.com", icon: "edit", badge: "Escritura" },
        { title: "GitHub / GitLab", desc: "Repositorios de código, control de versiones y proyectos", url: "https://github.com", icon: "code", badge: "Dev" },
        { title: "Google Drive / OneDrive", desc: "Almacenamiento en la nube de documentos y carpetas", url: "https://drive.google.com", icon: "cloud", badge: "Nube" },
        { title: "Microsoft Teams / Zoom", desc: "Salas de videoconferencia, clases híbridas y tutorías", url: "https://teams.microsoft.com", icon: "video", badge: "Videollamada" }
      ]
    },
    {
      category: "Investigación & Documentación Científica",
      items: [
        { title: "Google Scholar", desc: "Buscador de literatura científica y citas académicas", url: "https://scholar.google.com", icon: "search", badge: "Papers" },
        { title: "arXiv.org", desc: "Preprints de acceso abierto en ciencias de la computación", url: "https://arxiv.org", icon: "article", badge: "Preprints" },
        { title: "IEEE Xplore", desc: "Biblioteca digital de ingeniería y telecomunicaciones", url: "https://ieeexplore.ieee.org", icon: "library_books", badge: "Revistas" },
        { title: "Connected Papers", desc: "Herramienta visual para explorar grafos de referencias", url: "https://www.connectedpapers.com", icon: "hub", badge: "Visual" }
      ]
    }
  ],

  // CALENDARIO DE EVENTOS ACADÉMICOS (Fechas realistas del curso)
  events: [
    {
      id: "ev-1",
      subjectId: "asig-1",
      subjectName: "Asignatura 1",
      title: "Boletín 1 de Problemas",
      date: "2026-09-28",
      time: "23:59",
      type: "entrega", // "examen" | "entrega" | "clase" | "festivo"
      description: "Subir resolución de problemas a la plataforma virtual."
    },
    {
      id: "ev-2",
      subjectId: "asig-2",
      subjectName: "Asignatura 2",
      title: "Práctica 1: Prototipo Inicial",
      date: "2026-10-22",
      time: "23:59",
      type: "entrega",
      description: "Entrega del primer hito de la práctica y repositorio."
    },
    {
      id: "ev-3",
      subjectId: "asig-2",
      subjectName: "Asignatura 2",
      title: "Control Teórico 1 (Online)",
      date: "2026-10-28",
      time: "17:30",
      type: "examen",
      description: "Cuestionario en el Aula Virtual (Duración: 45 min)."
    },
    {
      id: "ev-4",
      subjectId: "asig-4",
      subjectName: "Asignatura 4",
      title: "Entrega Sprint 1 de Práctica",
      date: "2026-10-31",
      time: "23:59",
      type: "entrega",
      description: "Documento de diseño y avance de desarrollo."
    },
    {
      id: "ev-5",
      subjectId: "asig-1",
      subjectName: "Asignatura 1",
      title: "Examen Parcial (Temas 1 y 2)",
      date: "2026-11-04",
      time: "10:00",
      type: "examen",
      description: "Aula Magna 1.2. Ponderación: 20% de la nota final."
    },
    {
      id: "ev-6",
      subjectId: "asig-3",
      subjectName: "Asignatura 3",
      title: "Entrega Simulación Numérica",
      date: "2026-11-10",
      time: "23:59",
      type: "entrega",
      description: "Notebook de Python con los experimentos ejecutados."
    },
    {
      id: "ev-7",
      subjectId: "general",
      subjectName: "Festivo",
      title: "Día de Todos los Santos (No lectivo)",
      date: "2026-11-01",
      time: "Todo el día",
      type: "festivo",
      description: "Puente universitario / Sin docencia."
    },
    {
      id: "ev-8",
      subjectId: "asig-5",
      subjectName: "Asignatura 5",
      title: "Laboratorio 1 de Hardening",
      date: "2026-11-18",
      time: "23:59",
      type: "entrega",
      description: "Informe de configuración y capturas del laboratorio."
    },
    {
      id: "ev-9",
      subjectId: "asig-1",
      subjectName: "Asignatura 1",
      title: "Examen Final Ordinario 1º Semestre",
      date: "2027-01-18",
      time: "09:00",
      type: "examen",
      description: "Convocatoria oficial en Aula 201."
    },
    {
      id: "ev-10",
      subjectId: "asig-2",
      subjectName: "Asignatura 2",
      title: "Examen Final Ordinario 1º Semestre",
      date: "2027-01-22",
      time: "09:00",
      type: "examen",
      description: "Convocatoria oficial en Aula 104."
    }
  ]
};

// Exportar globalmente para scripts del cliente
window.MASTER_DATA = MASTER_DATA;

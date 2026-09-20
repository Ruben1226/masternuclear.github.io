/**
 * ====================================================================
 * BASE DE DATOS DEL MÁSTER EN FÍSICA NUCLEAR (UCM)
 * ====================================================================
 * Máster Interuniversitario en Física Nuclear - Curso 2026-2027
 * Sede de Matrícula: Universidad Complutense de Madrid (Facultad de Ciencias Físicas)
 */

const MASTER_DATA = {
  info: {
    title: "Máster Interuniversitario en Física Nuclear",
    subtitle: "Facultad de Ciencias Físicas - Universidad Complutense de Madrid",
    university: "Universidad Complutense de Madrid (UCM)",
    participatingUniversities: "UCM, UAM, US (Coordinadora), UGR, UB, USAL, CSIC, CIEMAT",
    academicYear: "2026 - 2027",
    totalCredits: 60,
    structure: "18 ECTS Obligatorias + 18 ECTS Optativas + 24 ECTS TFM",
    currentSemester: 1
  },

  // ASIGNATURAS MATRICULADAS (3 Obligatorias + 5 Optativas seleccionadas + TFM)
  subjects: [
    // --- 1. OBLIGATORIAS (18 ECTS) ---
    {
      id: "asig-en",
      code: "FN-OB1",
      name: "Estructura Nuclear: Propiedades y Modelos",
      shortName: "Estructura Nuclear",
      type: "Obligatoria",
      ects: 6,
      sede: "Granada / Madrid",
      color: "#2563eb", // Royal blue
      status: "en_curso",
      schedule: {
        distancia: "5 - 9 octubre 2026 (presencial a distancia)",
        presencial: "13 - 16 octubre 2026 (presencial en Granada / UCM)",
        limiteEntrega: "2026-10-23",
        limiteTexto: "23 octubre 2026"
      },
      professor: {
        name: "José Manuel Udías Moinelo / Óscar Moreno Díaz (UCM)",
        email: "jmudiasm@ucm.es, osmoreno@ucm.es",
        office: "Despacho 03.226 / 03.239 (EMFTEL, Fac. Físicas)",
        tutoring: "M y J 15:00-16:30 (acordar cita previa)"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Examen Tipo Test / Examen Final", weight: 40 },
        { item: "Entrega de Problemas y Trabajos", weight: 60 }
      ],
      sections: {
        apuntes: [
          { id: "ap-en-1", title: "Tema 1: Propiedades Globales del Núcleo", description: "Estado fundamental, números cuánticos, tamaño, forma y energía de ligadura.", date: "2026-10-05", fileUrl: "docs/asignaturas/estructura-nuclear/tema1.pdf", type: "pdf" },
          { id: "ap-en-2", title: "Tema 2: Modelos Colectivos y Gota Líquida", description: "Vibraciones y rotaciones nucleares. Modelo unificado de Bohr-Mottelson.", date: "2026-10-08", fileUrl: "docs/asignaturas/estructura-nuclear/tema2.pdf", type: "pdf" },
          { id: "ap-en-3", title: "Tema 3: Modelo de Capas y Campo Medio", description: "Modelo de capas esférico y deformado (Nilsson). Hartree-Fock y apareamiento.", date: "2026-10-14", fileUrl: "docs/asignaturas/estructura-nuclear/tema3.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-en-1", title: "Boletín de Problemas Oficiales", description: "Relación de problemas sobre energías de excitación y transiciones electromagnéticas.", date: "2026-10-09", fileUrl: "docs/asignaturas/estructura-nuclear/problemas.pdf", hasSolutions: false }
        ],
        practicas: [],
        examenes: [
          { id: "ex-en-1", title: "Examen y Límite de Entrega de Trabajos", date: "2026-10-23", weight: "40% Test + 60% Trabajos", location: "Sede del Máster / Aula UCM", notes: "Límite oficial de entrega y evaluación.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Estudio riguroso de los modelos nucleares, tanto colectivos como de partículas independientes, espectroscopía y desintegraciones alfa, beta y gamma.",
          competencias: ["Comprensión del estado fundamental y excitado del núcleo", "Manejo del modelo de capas y modelos colectivos", "Cálculo de transiciones nucleares"],
          bibliografia: "K. Heyde, 'The Nuclear Shell Model' (Springer-Verlag) / Cottingham & Greenwood, 'An Introduction to Nuclear Physics'."
        }
      }
    },

    {
      id: "asig-rn",
      code: "FN-OB2",
      name: "Introducción a las Reacciones Nucleares",
      shortName: "Reacciones Nucleares",
      type: "Obligatoria",
      ects: 6,
      sede: "Sevilla",
      color: "#0891b2", // Cyan
      status: "en_curso",
      schedule: {
        distancia: "2 - 6 noviembre 2026 (presencial a distancia)",
        presencial: "26 - 30 octubre 2026 (presencial en Sevilla)",
        limiteEntrega: "2026-11-13",
        limiteTexto: "13 noviembre 2026"
      },
      professor: {
        name: "Profesorado de la Universidad de Sevilla (FAMN)",
        email: "master@nuclear.fis.ucm.es",
        office: "Facultad de Física, Universidad de Sevilla",
        tutoring: "A convenir vía telemática o presencial durante la semana"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Examen Teórico / Prueba Escrita", weight: 50 },
        { item: "Prácticas de Cálculo de Secciones Eficaces y Problemas", weight: 50 }
      ],
      sections: {
        apuntes: [
          { id: "ap-rn-1", title: "Tema 1: Fenomenología y Leyes de Conservación", description: "Secciones eficaces, magnitudes experimentales y tipos de reacciones.", date: "2026-10-26", fileUrl: "docs/asignaturas/reacciones-nucleares/tema1.pdf", type: "pdf" },
          { id: "ap-rn-2", title: "Tema 2: Teoría Clásica y Cuántica de la Dispersión", description: "Ondas parciales, matriz S, corrimientos de fase y potencial coulombiano.", date: "2026-10-29", fileUrl: "docs/asignaturas/reacciones-nucleares/tema2.pdf", type: "pdf" },
          { id: "ap-rn-3", title: "Tema 3: Canales Acoplados y Reacciones de Transferencia", description: "Método de canales acoplados (CC/CRC), aproximación DWBA y núcleos halo.", date: "2026-11-03", fileUrl: "docs/asignaturas/reacciones-nucleares/tema3.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-rn-1", title: "Problemas de Dispersión y Colisiones", description: "Cálculo de secciones eficaces diferenciales y funciones de deflexión.", date: "2026-10-30", fileUrl: "docs/asignaturas/reacciones-nucleares/boletin.pdf", hasSolutions: false }
        ],
        practicas: [
          { id: "pr-rn-1", title: "Programa de Cálculo de Secciones Eficaces", description: "Simulación numérica de secciones eficaces clásica y cuántica.", deadline: "2026-11-13", status: "en_progreso", fileUrl: "docs/asignaturas/reacciones-nucleares/guion-practica.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-rn-1", title: "Límite Entrega de Trabajos / Examen", date: "2026-11-13", weight: "50%", location: "Sevilla / Sede UCM", notes: "Fecha límite de evaluación.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Teoría clásica y cuántica de la dispersión elástica e inelástica, reacciones de núcleo compuesto, reacciones directas y cálculo computacional de secciones eficaces.",
          competencias: ["Dominio formal del scattering cuántico", "Cálculo analítico y numérico de colisiones nucleares", "Uso de códigos de canales acoplados"],
          bibliografia: "G.R. Satchler, 'Introduction to Nuclear Reactions' / Frobrich & Lipperheide, 'Theory of Nuclear Reactions'."
        }
      }
    },

    {
      id: "asig-fne",
      code: "FN-OB3",
      name: "Física Nuclear Experimental",
      shortName: "Física Experimental",
      type: "Obligatoria",
      ects: 6,
      sede: "Madrid (UCM) / Sevilla",
      color: "#059669", // Emerald
      status: "en_curso",
      schedule: {
        distancia: "16 - 20 noviembre 2026 (presencial para UCM, síncrono fuera)",
        presencial: "23 - 27 noviembre 2026 (prácticas presenciales en Madrid/UCM)",
        limiteEntrega: "2026-12-11",
        limiteTexto: "11 diciembre 2026"
      },
      professor: {
        name: "Dr. José Antonio Briz Monago / Dr. Andrés Illana Sisón (UCM)",
        email: "josebriz@ucm.es, andres.illana@ucm.es",
        office: "Despacho 03.261.0 / 03.230.0 (EMFTEL, Fac. Físicas UCM)",
        tutoring: "M y J 14:00-16:00 (o acordar con los profesores)"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Examen Final (Nex)", weight: 40 },
        { item: "Prácticas de Laboratorio e Informes (Nlab)", weight: 40 },
        { item: "Evaluación Continua y Problemas (Nec)", weight: 20 }
      ],
      sections: {
        apuntes: [
          { id: "ap-fne-1", title: "Tema 1: Interacción de la Radiación con la Materia", description: "Pérdida de energía de partículas cargadas, radiación electromagnética y neutrones.", date: "2026-11-16", fileUrl: "docs/asignaturas/nuclear-experimental/tema1.pdf", type: "pdf" },
          { id: "ap-fne-2", title: "Tema 2: Detectores Nucleares y Electrónica", description: "Detectores gaseosos, de centelleo y de semiconductor (HPGe, Si). Procesado de pulsos.", date: "2026-11-18", fileUrl: "docs/asignaturas/nuclear-experimental/tema2.pdf", type: "pdf" },
          { id: "ap-fne-3", title: "Tema 3: Simulación Monte Carlo y Análisis de Datos", description: "Herramientas GEANT4, MCNP, PENELOPE, ROOT y calibración experimental.", date: "2026-11-20", fileUrl: "docs/asignaturas/nuclear-experimental/tema3.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-fne-1", title: "Problemas de Instrumentación Nuclear", description: "Cálculo de eficiencia, resolución energética, tiempos de coincidencia y estadística.", date: "2026-11-21", fileUrl: "docs/asignaturas/nuclear-experimental/problemas.pdf", hasSolutions: false }
        ],
        practicas: [
          { id: "pr-fne-1", title: "Laboratorio L1: Detectores de Semiconductor y Espectroscopía", description: "Calibración de detectores de HPGe para radiación gamma y Si para partículas alfa/beta.", deadline: "2026-12-11", status: "en_progreso", fileUrl: "docs/asignaturas/nuclear-experimental/guion-L1.pdf", repoUrl: "" },
          { id: "pr-fne-2", title: "Laboratorio L2: Coincidencias Temporales y Detectores de Centelleo", description: "Montaje, ajuste de umbrales y medidas de coincidencias gamma-gamma.", deadline: "2026-12-11", status: "en_progreso", fileUrl: "docs/asignaturas/nuclear-experimental/guion-L2.pdf", repoUrl: "" },
          { id: "pr-fne-3", title: "Laboratorio L3: Simulación Monte Carlo de Detectores", description: "Simulación de transporte y eficiencia en aula de informática.", deadline: "2026-12-11", status: "en_progreso", fileUrl: "docs/asignaturas/nuclear-experimental/guion-L3.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-fne-1", title: "Examen Final de Física Nuclear Experimental", date: "2026-12-11", weight: "40% (mínimo 4/10)", location: "Facultad de Físicas UCM", notes: "Problemas y cuestiones teóricas. No se permite material.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Técnicas instrumentales avanzadas, detección de radiación ionizante, electrónica nuclear rápida, espectroscopía y 14 horas de prácticas experimentales en el Laboratorio de Física Atómica y Nuclear de la UCM.",
          competencias: ["Manejo de detectores de radiación y cadenas electrónicas", "Tratamiento riguroso de datos experimentales y errores", "Elaboración de informes científicos de laboratorio"],
          bibliografia: "G.F. Knoll, 'Radiation Detection and Measurement' (Wiley) / W.R. Leo, 'Techniques for Nuclear and Particle Physics Experiments'."
        }
      }
    },

    // --- 2. OPTATIVAS ELEGIDAS POR EL USUARIO (5 Asignaturas) ---
    {
      id: "asig-fna1",
      code: "FN-OP1",
      name: "Física Nuclear Aplicada I (Materiales y Medio Ambiente)",
      shortName: "Nuclear Aplicada I",
      type: "Optativa",
      ects: 6,
      sede: "Sevilla (CNA / CITIUS)",
      color: "#d97706", // Amber
      status: "pendiente",
      schedule: {
        distancia: "30 noviembre - 4 diciembre 2026 (a distancia)",
        presencial: "14 - 18 diciembre 2026 (presencial en Sevilla)",
        limiteEntrega: "2027-01-08",
        limiteTexto: "8 enero 2027"
      },
      professor: {
        name: "Profesorado Universidad de Sevilla / Centro Nacional de Aceleradores",
        email: "master@nuclear.fis.ucm.es",
        office: "CNA Sevilla",
        tutoring: "Consultar horario en Campus Virtual"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Trabajos Prácticos e Informes de Laboratorio", weight: 60 },
        { item: "Examen / Evaluación Continua", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-fna1-1", title: "Tema 1: Técnicas de Análisis con Haces de Iones (IBA)", description: "Retrodispersión Rutherford (RBS), emisión de rayos X inducida por protones (PIXE) y ERDA.", date: "2026-11-30", fileUrl: "", type: "pdf" },
          { id: "ap-fna1-2", title: "Tema 2: Datación y Espectrometría de Masas (AMS)", description: "Fechado mediante isótopos radiactivos (C-14) y aceleradores dedicados.", date: "2026-12-03", fileUrl: "", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [
          { id: "pr-fna1-1", title: "Práctica XRF y PIXE en el CNA", description: "Análisis de muestras de patrimonio cultural y medioambientales en acelerador.", deadline: "2027-01-08", status: "pendiente", fileUrl: "", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-fna1-1", title: "Límite Entrega de Informes y Trabajos", date: "2027-01-08", weight: "100%", location: "Campus Virtual", notes: "Límite oficial de evaluación.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Utilización de aceleradores de partículas para la investigación multidisciplinar en caracterización de materiales, patrimonio histórico, medioambiente y geocronología.",
          competencias: ["Manejo conceptual de técnicas IBA (PIXE, RBS, ERDA)", "Espectrometría de masas con aceleradores", "Visitas científicas a instalaciones singulares (CNA y CITIUS)"],
          bibliografia: "Artículos especializados y guías técnicas del CNA."
        }
      }
    },

    {
      id: "asig-rad",
      code: "FN-OP2",
      name: "Radioprotección",
      shortName: "Radioprotección",
      type: "Optativa",
      ects: 6,
      sede: "Salamanca",
      color: "#e11d48", // Rose
      status: "pendiente",
      schedule: {
        distancia: "11 - 15 enero 2027 (presencial a distancia)",
        presencial: "18 - 22 enero 2027 (presencial en Salamanca)",
        limiteEntrega: "2027-03-05",
        limiteTexto: "5 marzo 2027"
      },
      professor: {
        name: "Profesorado Universidad de Salamanca (USAL)",
        email: "master@nuclear.fis.ucm.es",
        office: "Facultad de Ciencias, Salamanca",
        tutoring: "Vía telemática y tutor asignado"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Ejercicios Prácticos y Casos", weight: 50 },
        { item: "Examen / Informe del Tutor", weight: 50 }
      ],
      sections: {
        apuntes: [
          { id: "ap-rad-1", title: "Tema 1: Dosimetría de Radiaciones Ionizantes", description: "Magnitudes, unidades, efectos biológicos estocásticos y no estocásticos.", date: "2027-01-11", fileUrl: "", type: "pdf" },
          { id: "ap-rad-2", title: "Tema 2: Legislación y Protección Operacional", description: "Sistemas de protección, blindajes, normativa española/europea y gestión de residuos.", date: "2027-01-14", fileUrl: "", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [
          { id: "pr-rad-1", title: "Seminarios de Análisis de Programas de Protección", description: "Cálculo de blindajes y dosimetría operacional en instalaciones médicas e industriales.", deadline: "2027-03-05", status: "pendiente", fileUrl: "", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-rad-1", title: "Límite Entrega de Trabajos", date: "2027-03-05", weight: "100%", location: "Campus Virtual", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Fundamentos físicos y normativos de la protección radiológica en instalaciones nucleares, radiactivas y hospitalarias.",
          competencias: ["Cálculo dosimétrico", "Diseño de blindajes y zonas radiológicas", "Gestión segura de residuos radiactivos"],
          bibliografia: "J.E. Martin, 'Physics for Radiation Protection' (Wiley-VCH) / Normativa CSN."
        }
      }
    },

    {
      id: "asig-teafn",
      code: "FN-OP3",
      name: "Técnicas Experimentales Avanzadas en Física Nuclear",
      shortName: "Técnicas Avanzadas",
      type: "Optativa",
      ects: 6,
      sede: "Madrid / Valencia (IFIC)",
      color: "#7c3aed", // Violet
      status: "pendiente",
      schedule: {
        distancia: "25 - 29 enero 2027 (presencial a distancia)",
        presencial: "1 - 5 febrero 2027 (presencial)",
        limiteEntrega: "2027-03-15",
        limiteTexto: "15 marzo 2027"
      },
      professor: {
        name: "Profesorado del IFIC (CSIC-UV) y UCM",
        email: "master@nuclear.fis.ucm.es",
        office: "IFIC / UCM",
        tutoring: "Consultar tutorías en campus virtual"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Informes de Seminarios y Prácticas", weight: 60 },
        { item: "Evaluación Continua", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-tea-1", title: "Tema 1: Detectores Avanzados y Calorimetría", description: "Digitalizadores rápidos, detectores phoswich, espectrometría gamma de alta resolución.", date: "2027-01-25", fileUrl: "", type: "pdf" },
          { id: "ap-tea-2", title: "Tema 2: Instalaciones Internacionales de Haces Radiactivos", description: "Experimentos en FAIR, ISOLDE (CERN), SPIRAL y n_TOF.", date: "2027-01-28", fileUrl: "", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-tea-1", title: "Límite Entrega de Evaluación", date: "2027-03-15", weight: "100%", location: "Campus Virtual", notes: "", fileUrl: "" }
        ],
        guia: {
          descripcion: "Profundización en técnicas punteras de experimentación en laboratorios internacionales: detección de neutrones, absorción total y cinemática inversa.",
          competencias: ["Comprensión de instrumentación de última generación", "Diseño experimental en grandes aceleradores"],
          bibliografia: "Debertin & Helmer, 'Gamma- and X-ray Spectrometry with Semiconductor Detectors'."
        }
      }
    },

    {
      id: "asig-fna2",
      code: "FN-OP4",
      name: "Física Nuclear Aplicada II (Energía y Aplicaciones Biomédicas)",
      shortName: "Nuclear Aplicada II",
      type: "Optativa",
      ects: 6,
      sede: "Madrid (UCM / CIEMAT)",
      color: "#0284c7", // Sky blue
      status: "pendiente",
      schedule: {
        distancia: "8 - 12 febrero 2027 (presencial para UCM, telemática fuera)",
        presencial: "15 - 19 febrero 2027 (presencial en Madrid / CIEMAT)",
        limiteEntrega: "2027-03-22",
        limiteTexto: "22 marzo 2027"
      },
      professor: {
        name: "Dr. Joaquín López Herraiz / Dra. Paula Ibáñez García / Dr. Daniel Cano Ott",
        email: "jlherraiz@fis.ucm.es, pbibanez@ucm.es, Daniel.cano@ciemat.es",
        office: "Despacho 03.235.0 / 03.237.0 (EMFTEL UCM y CIEMAT)",
        tutoring: "M y J 11:00-13:00 / 15:00-17:00 (o confirmar por email)"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Entrega de Lista de Problemas (NProb)", weight: 50 },
        { item: "Examen Test Teórico (NExam)", weight: 25 },
        { item: "Prácticas de Laboratorio y CIEMAT (Nlab)", weight: 25 }
      ],
      sections: {
        apuntes: [
          { id: "ap-fna2-1", title: "Parte I: Tecnología Nuclear, Reactores y Neutrónica", description: "Fisión, fusión nuclear, reactores Gen-IV, neutrónica y ciclo de combustible.", date: "2027-02-08", fileUrl: "docs/asignaturas/nuclear-aplicada-2/parte1-reactores.pdf", type: "pdf" },
          { id: "ap-fna2-2", title: "Parte II: Física Médica e Imagen Molecular", description: "Radioterapia, aceleradores clínicos, protonterapia, CT, PET, SPECT y radiofármacos.", date: "2027-02-15", fileUrl: "docs/asignaturas/nuclear-aplicada-2/parte2-medica.pdf", type: "pdf" }
        ],
        ejercicios: [
          { id: "ej-fna2-1", title: "Lista de Problemas Oficiales de Evaluación", description: "50% problemas de tecnología nuclear y 50% de física médica.", date: "2027-02-19", fileUrl: "docs/asignaturas/nuclear-aplicada-2/problemas-fna2.pdf", hasSolutions: false }
        ],
        practicas: [
          { id: "pr-fna2-1", title: "Prácticas de Computación en CIEMAT y UCM", description: "Masa crítica por Monte Carlo, simulación de detector PET y reconstrucción tomográfica.", deadline: "2027-03-22", status: "pendiente", fileUrl: "docs/asignaturas/nuclear-aplicada-2/practicas-ciemat.pdf", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-fna2-1", title: "Examen Test Oficial y Límite de Entrega de Problemas", date: "2027-03-22", weight: "25% Test + 50% Problemas + 25% Lab (mínimo 4/10)", location: "Facultad de Físicas UCM", notes: "Calificación = 0.25*NExam + 0.5*NProb + 0.25*Nlab", fileUrl: "" }
        ],
        guia: {
          descripcion: "Aplicaciones cruciales de la física nuclear en dos campos de gran impacto: generación de energía (reactores de fisión y fusión) y medicina (imagen diagnóstica PET/CT y radioterapia/protonterapia). Prácticas en el CIEMAT.",
          competencias: ["Cálculo de cinética de reactores y transporte de neutrones", "Comprensión de imagen nuclear tomográfica y dosimetría clínica", "Simulación Monte Carlo aplicada"],
          bibliografia: "Glasstone & Sesonske, 'Ingeniería de Reactores Nucleares' / Allisy-Roberts & Williams, 'Farr's Physics for Medical Imaging'."
        }
      }
    },

    {
      id: "asig-astro",
      code: "FN-OP5",
      name: "Astrofísica Nuclear",
      shortName: "Astrofísica Nuclear",
      type: "Optativa",
      ects: 6,
      sede: "Barcelona (UB)",
      color: "#4f46e5", // Indigo
      status: "pendiente",
      schedule: {
        distancia: "3 - 7 mayo 2027 (presencial a distancia)",
        presencial: "26 - 30 abril 2027 (presencial en Barcelona)",
        limiteEntrega: "2027-05-31",
        limiteTexto: "31 mayo 2027"
      },
      professor: {
        name: "Profesorado Universidad de Barcelona (UB)",
        email: "master@nuclear.fis.ucm.es",
        office: "Facultat de Física, Universitat de Barcelona",
        tutoring: "Vía telemática y foros de la asignatura"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Resolución de Problemas y Modelización", weight: 60 },
        { item: "Examen Final / Seminario", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-ast-1", title: "Tema 1: Nucleosíntesis Primordial y Estelar", description: "Ciclos de combustión de H y He, procesos s y r, y explosiones de supernova.", date: "2027-04-26", fileUrl: "", type: "pdf" },
          { id: "ap-ast-2", title: "Tema 2: Ecuación de Estado y Estrellas de Neutrones", description: "Materia nuclear densa, enanas blancas, masas límites y remanentes compactos.", date: "2027-04-29", fileUrl: "", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [],
        examenes: [
          { id: "ex-ast-1", title: "Límite Entrega de Evaluación de Astrofísica", date: "2027-05-31", weight: "100%", location: "Campus Virtual", notes: "Fin del periodo docente.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Procesos de generación de materia y energía en el Universo, nucleosíntesis en estrellas y supernovas, y física nuclear de objetos compactos (estrellas de neutrones).",
          competencias: ["Comprensión del origen cósmico de los elementos químicos", "Aplicación de la ecuación de estado nuclear a la astrofísica"],
          bibliografia: "A.C. Phillips, 'The Physics of Stars' (Wiley) / D.H. Perkins, 'Particle Astrophysics'."
        }
      }
    },

    // --- 3. TRABAJO FIN DE MÁSTER (24 ECTS) ---
    {
      id: "asig-tfm",
      code: "FN-TFM",
      name: "Trabajo Fin de Máster (TFM)",
      shortName: "TFM (Investigación)",
      type: "TFM",
      ects: 24,
      sede: "Madrid (UCM / CIEMAT / IEM-CSIC)",
      color: "#16a34a", // Green
      status: "en_curso",
      schedule: {
        distancia: "Desarrollo tutelado continuo a lo largo del curso (600 horas)",
        presencial: "Defensa oral pública ante tribunal en la UCM",
        limiteEntrega: "2027-07-05",
        limiteTexto: "Convocatoria Ordinaria (Julio 2027)"
      },
      professor: {
        name: "Tutor/a de Investigación asignado en la UCM",
        email: "master@nuclear.fis.ucm.es",
        office: "Departamento EMFTEL / Institutos Asociados",
        tutoring: "Seguimiento personalizado semanal con el director del trabajo"
      },
      campusUrl: "https://cv.ucm.es",
      evaluation: [
        { item: "Memoria Escrita del Trabajo de Investigación", weight: 60 },
        { item: "Exposición Oral y Defensa ante Tribunal de 3 Doctores", weight: 40 }
      ],
      sections: {
        apuntes: [
          { id: "ap-tfm-1", title: "Guía Oficial de Elaboración y Defensa del TFM", description: "Normativa de extensión, formato LaTeX/PDF y plazos administrativos.", date: "2026-10-01", fileUrl: "docs/asignaturas/tfm/guia-tfm.pdf", type: "pdf" }
        ],
        ejercicios: [],
        practicas: [
          { id: "pr-tfm-1", title: "Propuesta de Tema y Asignación de Tutor", description: "Elección de línea de investigación (Estructura, Reacciones, Médica, Instrumental o Astrofísica).", deadline: "2026-12-15", status: "en_progreso", fileUrl: "", repoUrl: "" }
        ],
        examenes: [
          { id: "ex-tfm-1", title: "Defensa Pública del TFM (Convocatoria Junio/Julio)", date: "2027-07-05", weight: "100%", location: "Facultad de Ciencias Físicas UCM", notes: "Exposición de 20 min + preguntas del tribunal.", fileUrl: "" }
        ],
        guia: {
          descripcion: "Realización de un trabajo de investigación original tutelado en una de las líneas científicas del máster dentro de la UCM o centros colaboradores (CIEMAT, IEM-CSIC).",
          competencias: ["Capacidad investigadora autónoma", "Manejo avanzado de bibliografía científica", "Redacción rigurosa y comunicación pública de resultados"],
          bibliografia: "Artículos científicos especializados según el tema de investigación."
        }
      }
    }
  ],

  // ENLACES RÁPIDOS PERSONALIZADOS PARA ESTUDIANTE DE LA UCM
  links: [
    {
      category: "Plataformas Oficiales UCM & Máster",
      items: [
        { title: "Campus Virtual UCM", desc: "Moodle UCM para entregas de ejercicios, foros y anuncios", url: "https://cv.ucm.es", badge: "Imprescindible" },
        { title: "Web Máster Interuniversitario", desc: "Web general oficial coordinada por la Universidad de Sevilla", url: "https://master.us.es/fisicanuclear/", badge: "Portal Oficial" },
        { title: "Web Máster en Física Nuclear UCM", desc: "Información departamental del grupo de Física Nuclear UCM", url: "http://nuclear.fis.ucm.es/fisica_nuclear/", badge: "Sede UCM" },
        { title: "Correo Institucional UCM", desc: "Bandeja de correo corporativo @ucm.es", url: "https://correo.ucm.es", badge: "Email" },
        { title: "Secretaría Virtual UCM (GEA)", desc: "Expediente oficial, certificados y matrícula", url: "https://geapre.ucm.es", badge: "Gestión" },
        { title: "Biblioteca & Acceso Remoto UCM", desc: "Acceso con proxy/VPN a revistas científicas (APS, Elsevier, Springer)", url: "https://biblioteca.ucm.es", badge: "Acceso VPN" }
      ]
    },
    {
      category: "Centros de Investigación & Laboratorios",
      items: [
        { title: "CIEMAT", desc: "Centro de Investigaciones Energéticas, Medioambientales y Tecnológicas (Madrid)", url: "https://www.ciemat.es", badge: "Madrid" },
        { title: "CNA (Sevilla)", desc: "Centro Nacional de Aceleradores (prácticas de Física Nuclear Aplicada I)", url: "https://cna.us.es", badge: "Aceleradores" },
        { title: "CMAM", desc: "Centro de Micro-Análisis de Materiales (UAM - Madrid)", url: "https://www.cmam.uam.es", badge: "IBA" },
        { title: "IEM - CSIC", desc: "Instituto de Estructura de la Materia (Madrid)", url: "https://www.iem.csic.es", badge: "CSIC" }
      ]
    },
    {
      category: "Herramientas de Trabajo & Literatura Científica",
      items: [
        { title: "arXiv (nucl-th / nucl-ex)", desc: "Preprints diarios de física nuclear teórica y experimental", url: "https://arxiv.org/archive/nucl-th", badge: "Papers" },
        { title: "Overleaf (LaTeX)", desc: "Redacción colaborativa de memorias de prácticas y del TFM", url: "https://www.overleaf.com", badge: "LaTeX" },
        { title: "NNDC (NuDat)", desc: "National Nuclear Data Center - Niveles de energía y desintegraciones", url: "https://www.nndc.bnl.gov/nudat3/", badge: "Datos Nucleares" },
        { title: "Google Scholar", desc: "Búsqueda bibliográfica de artículos y citas", url: "https://scholar.google.com", badge: "Buscador" }
      ]
    }
  ],

  // CRONOGRAMA ACADÉMICO OFICIAL DEL CURSO (Intensivos y Fechas Límite de Entrega)
  events: [
    {
      id: "ev-1",
      subjectId: "asig-en",
      subjectName: "Estructura Nuclear",
      title: "Clases a Distancia (Presencial virtual)",
      date: "2026-10-05",
      endDate: "2026-10-09",
      type: "clase",
      sede: "Granada (Virtual)",
      description: "Semana de clases teóricas preparatorias a distancia."
    },
    {
      id: "ev-2",
      subjectId: "asig-en",
      subjectName: "Estructura Nuclear",
      title: "Semana Presencial (Granada / UCM)",
      date: "2026-10-13",
      endDate: "2026-10-16",
      type: "presencial",
      sede: "Granada / Madrid",
      description: "Semana intensiva presencial de teoría y resolución de problemas."
    },
    {
      id: "ev-3",
      subjectId: "asig-en",
      subjectName: "Estructura Nuclear",
      title: "Límite Entrega Trabajos / Evaluación",
      date: "2026-10-23",
      type: "examen",
      sede: "Sede UCM",
      description: "Fecha límite oficial para la entrega de trabajos y examen de Estructura Nuclear."
    },
    {
      id: "ev-4",
      subjectId: "asig-rn",
      subjectName: "Reacciones Nucleares",
      title: "Semana Presencial (Sevilla)",
      date: "2026-10-26",
      endDate: "2026-10-30",
      type: "presencial",
      sede: "Sevilla",
      description: "Semana intensiva presencial en la Facultad de Física de la Universidad de Sevilla."
    },
    {
      id: "ev-5",
      subjectId: "asig-rn",
      subjectName: "Reacciones Nucleares",
      title: "Clases a Distancia",
      date: "2026-11-02",
      endDate: "2026-11-06",
      type: "clase",
      sede: "Sevilla (Virtual)",
      description: "Semana de sesiones y tutorías a distancia."
    },
    {
      id: "ev-6",
      subjectId: "asig-rn",
      subjectName: "Reacciones Nucleares",
      title: "Límite Entrega Trabajos / Examen",
      date: "2026-11-13",
      type: "examen",
      sede: "Sevilla / UCM",
      description: "Fecha límite de entrega de problemas y evaluación de Reacciones Nucleares."
    },
    {
      id: "ev-7",
      subjectId: "asig-fne",
      subjectName: "Física Nuclear Experimental",
      title: "Clases Teóricas (Presencial UCM / Telemática fuera)",
      date: "2026-11-16",
      endDate: "2026-11-20",
      type: "clase",
      sede: "Madrid (Fac. Físicas UCM)",
      description: "Clases teóricas de instrumentación y detectores en la Facultad de Físicas de la UCM."
    },
    {
      id: "ev-8",
      subjectId: "asig-fne",
      subjectName: "Física Nuclear Experimental",
      title: "Semana de Prácticas de Laboratorio (UCM)",
      date: "2026-11-23",
      endDate: "2026-11-27",
      type: "presencial",
      sede: "Madrid (Lab. Física Atómica y Nuclear UCM)",
      description: "14 horas obligatorias de prácticas experimentales (detectores HPGe, Si, centelleo y coincidencias)."
    },
    {
      id: "ev-9",
      subjectId: "asig-fne",
      subjectName: "Física Nuclear Experimental",
      title: "Examen Final y Entrega de Informes de Lab",
      date: "2026-12-11",
      type: "examen",
      sede: "Facultad de Físicas UCM",
      description: "Examen final presencial oficial y entrega de memorias de laboratorio (40% Examen + 40% Lab + 20% Cont)."
    },
    {
      id: "ev-10",
      subjectId: "asig-fna1",
      subjectName: "Nuclear Aplicada I",
      title: "Clases a Distancia",
      date: "2026-11-30",
      endDate: "2026-12-04",
      type: "clase",
      sede: "Sevilla (Virtual)",
      description: "Introducción teórica a aceleradores y técnicas IBA."
    },
    {
      id: "ev-11",
      subjectId: "asig-fna1",
      subjectName: "Nuclear Aplicada I",
      title: "Semana Presencial en Sevilla (CNA)",
      date: "2026-12-14",
      endDate: "2026-12-18",
      type: "presencial",
      sede: "Sevilla (Centro Nac. Aceleradores)",
      description: "Sesiones prácticas y visitas experimentales en el CNA y CITIUS."
    },
    {
      id: "ev-12",
      subjectId: "asig-fna1",
      subjectName: "Nuclear Aplicada I",
      title: "Límite Entrega Trabajos",
      date: "2027-01-08",
      type: "examen",
      sede: "Campus Virtual",
      description: "Límite para remitir informes de prácticas y trabajos."
    },
    {
      id: "ev-13",
      subjectId: "asig-rad",
      subjectName: "Radioprotección",
      title: "Clases a Distancia",
      date: "2027-01-11",
      endDate: "2027-01-15",
      type: "clase",
      sede: "Salamanca (Virtual)",
      description: "Bases dosimétricas y radiológicas teóricas."
    },
    {
      id: "ev-14",
      subjectId: "asig-rad",
      subjectName: "Radioprotección",
      title: "Semana Presencial en Salamanca",
      date: "2027-01-18",
      endDate: "2027-01-22",
      type: "presencial",
      sede: "Salamanca",
      description: "Semana intensiva en la Universidad de Salamanca."
    },
    {
      id: "ev-15",
      subjectId: "asig-rad",
      subjectName: "Radioprotección",
      title: "Límite Entrega de Trabajos",
      date: "2027-03-05",
      type: "examen",
      sede: "Campus Virtual",
      description: "Fecha límite de entrega de memorias de Radioprotección."
    },
    {
      id: "ev-16",
      subjectId: "asig-teafn",
      subjectName: "Técnicas Avanzadas",
      title: "Semana Presencial (Madrid/Valencia)",
      date: "2027-02-01",
      endDate: "2027-02-05",
      type: "presencial",
      sede: "Madrid / Valencia",
      description: "Técnicas de detección de última generación."
    },
    {
      id: "ev-17",
      subjectId: "asig-teafn",
      subjectName: "Técnicas Avanzadas",
      title: "Límite Entrega de Evaluación",
      date: "2027-03-15",
      type: "examen",
      sede: "Campus Virtual",
      description: "Límite de entrega de actividades y seminarios."
    },
    {
      id: "ev-18",
      subjectId: "asig-fna2",
      subjectName: "Nuclear Aplicada II",
      title: "Clases Teóricas (Presencial UCM)",
      date: "2027-02-08",
      endDate: "2027-02-12",
      type: "clase",
      sede: "Madrid (Fac. Físicas UCM)",
      description: "Sesiones de tecnología nuclear y física médica."
    },
    {
      id: "ev-19",
      subjectId: "asig-fna2",
      subjectName: "Nuclear Aplicada II",
      title: "Semana de Prácticas en CIEMAT y UCM",
      date: "2027-02-15",
      endDate: "2027-02-19",
      type: "presencial",
      sede: "Madrid (CIEMAT y UCM)",
      description: "Laboratorio de informática en CIEMAT (cálculo neutrónico, PET y Monte Carlo)."
    },
    {
      id: "ev-20",
      subjectId: "asig-fna2",
      subjectName: "Nuclear Aplicada II",
      title: "Examen Tipo Test y Entrega de Problemas",
      date: "2027-03-22",
      type: "examen",
      sede: "Facultad de Físicas UCM",
      description: "Examen test + entrega de problemas (fórmula: 0.25*NExam + 0.5*NProb + 0.25*Nlab)."
    },
    {
      id: "ev-21",
      subjectId: "asig-astro",
      subjectName: "Astrofísica Nuclear",
      title: "Semana Presencial en Barcelona",
      date: "2027-04-26",
      endDate: "2027-04-30",
      type: "presencial",
      sede: "Barcelona (UB)",
      description: "Docencia presencial en la Universitat de Barcelona."
    },
    {
      id: "ev-22",
      subjectId: "asig-astro",
      subjectName: "Astrofísica Nuclear",
      title: "Límite Entrega Evaluación",
      date: "2027-05-31",
      type: "examen",
      sede: "Campus Virtual",
      description: "Límite de entrega para evaluación de Astrofísica Nuclear."
    }
  ]
};

window.MASTER_DATA = MASTER_DATA;

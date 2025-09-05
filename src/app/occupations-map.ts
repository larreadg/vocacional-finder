// occupations.ts
import { SectionCode } from './models';

/** 1) Diccionario canónico (reutilizable) */
export const OCC = {
  // Aire libre / Mecánico / Cálculo / Científico
  IngenieroAgronomo: 'Ingeniero agrónomo',
  IngenieroAgronomoMaquinaria: 'Ingeniero agrónomo (maquinaria agrícola)',
  IngenieroAgronomoEstadistica: 'Ingeniero agrónomo (estadística)',
  IngenieroAgronomoEconomia: 'Ingeniero agrónomo (economía)',
  IngenieroAgronomoFitotecnia: 'Ingeniero agrónomo (fitotecnia)',
  IngenieroAgronomoParasitologia: 'Ingeniero agrónomo (parasitología)',
  IngenieroForestal: 'Ingeniero forestal',
  IngenieroMinas: 'Ingeniero de minas',
  IngenieroNaval: 'Ingeniero naval',
  IngenieroCivil: 'Ingeniero civil',
  IngenieroCivilHidraulica: 'Ingeniero civil (hidráulica)',
  IngenieroCivilVias: 'Ingeniero civil (vías de comunicación)',
  IngenieroElectricista: 'Ingeniero electricista',
  IngenieroIndustrial: 'Ingeniero industrial',
  IngenieroMecanico: 'Ingeniero mecánico',
  IngenieroMetalurgico: 'Ingeniero metalúrgico',
  IngenieroQuimico: 'Ingeniero químico',
  IngenieroPetroleos: 'Ingeniero de petróleos',
  IngenieroSonido: 'Ingeniero del sonido',
  IngenieroInformatico: 'Ingeniero Informático',
  IngenieroElectronico: 'Ingeniero Electrónico',
  IngenieroMecatronico: 'Ingeniero Mecatrónico',
  IngenieroSP: 'Ingeniero en Sistemas de Producción',
  IngenieroAeronautico: 'Ingeniero Aero­náutico',
  IngenieroComercial: 'Ingeniero Comercial',
  IngenieroMarketing: 'Ingeniero en Marketing',
  AnalistaSistemas: 'Analista de Sistemas',
  ProgramadorInformatico: 'Programador Informático',
  Geologo: 'Geólogo',
  Topografo: 'Topógrafo',
  Aviador: 'Aviador',

  Economista: 'Economista',
  ContadorPublico: 'Contador público',
  Auditor: 'Auditor',
  Estadigrafo: 'Estadígrafo',
  Actuario: 'Actuario',
  Matematico: 'Matemático',
  ProfesorMatematicas: 'Profesor de matemáticas',
  EspecialistaComputacion: 'Especialista en computación',

  Antropologo: 'Antropólogo',
  Arqueologo: 'Arqueólogo',
  Astronomo: 'Astrónomo',
  Biologo: 'Biólogo',
  Quimico: 'Químico',
  Farmaceutico: 'Farmacéutico',
  QuimicoFarmaceutico: 'Químico farmacéutico',
  Medico: 'Médico',
  Cirujano: 'Médico-cirujano',
  MedicoVeterinario: 'Médico veterinario',
  Odontologo: 'Odontólogo',
  Psicologo: 'Psicólogo',
  PsicologoClinico: 'Psicólogo clínico',
  TecnicoLaboratorio: 'Técnico de laboratorio',
  Optometra: 'Optómetra',
  Filologo: 'Filólogo',

  // Persuasivo
  Escritor: 'Escritor',
  Periodista: 'Periodista',
  Jurista: 'Jurista (abogado, juez, consejero jurídico)',
  AgentePublicidad: 'Agente de publicidad',
  DibujantePublicitario: 'Dibujante publicitario',
  JefeDeVisitas: 'Jefe de visitas',
  LocutorRadio: 'Locutor de radio',
  LocutorTV: 'Locutor de TV',

  // Artístico–plástico
  Arquitecto: 'Arquitecto',
  ArquitectoUrbanista: 'Arquitecto-urbanista',
  DecoradorInteriores: 'Decorador de interiores',
  Dibujante: 'Dibujante',
  Escultor: 'Escultor',
  Pintor: 'Pintor',

  // Musical / Literario
  Compositor: 'Compositor',
  Musico: 'Músico',
  ProfesorMusica: 'Profesor de música',
  ProfesorCanto: 'Profesor de canto',
  DirectorConjunto: 'Director de conjunto vocal o instrumental',
  ActorActriz: 'Actor/Actriz',
  FilologoLetras: 'Profesor de letras',

  // Servicio social
  Sacerdote: 'Sacerdote',
  Pedagogo: 'Pedagogo',
  Bibliotecario: 'Bibliotecario',
  Bibliotecologo: 'Bibliotecólogo',
  TrabajadorSocial: 'Trabajador social',
  Enfermero: 'Enfermero',
  ConsejeroVocacional: 'Consejero vocacional',
  ProfesorMateriasTecnicas: 'Profesor de materias técnicas',
  ProfesorMateriasComerciales: 'Profesor de materias comerciales',
  ProfesorCiencias: 'Profesor de ciencias',
  ProfesorBaile: 'Profesor de baile',
  ProfesorEducFisica: 'Profesor de educación física',

  // Oficina
  Archivista: 'Archivista',
  Secretario: 'Secretario',
  Mecanografo: 'Mecanógrafo',
  TenedorLibros: 'Tenedor de libros',
  Taquigrafo: 'Taquígrafo',

  // Seguridad / Fuerzas
  OficialEjercito: 'Oficial del ejército',
  OficialMarina: 'Oficial de marina',
  OficialAviacion: 'Oficial de aviación',
  Policia: 'Policía',
  Fisico: 'Físico'
} as const;

/** 2) Lista plana (por si necesitas autocompletar/validar) */
export const ALL_OCCUPATIONS: string[] = Object.values(OCC);

/** 3) Profesiones por área (fallback por sección) */
export const AREA_OCCUPATIONS: Record<SectionCode, string[]> = {
  A: [
    OCC.IngenieroAgronomo, OCC.IngenieroForestal, OCC.IngenieroMinas,
    OCC.Geologo, OCC.OficialEjercito, OCC.OficialMarina, OCC.OficialAviacion,
    OCC.Policia, OCC.ProfesorEducFisica,
  ],
  B: [
    OCC.IngenieroCivil, OCC.IngenieroElectricista, OCC.IngenieroIndustrial,
    OCC.IngenieroMecanico, OCC.IngenieroMetalurgico, OCC.IngenieroQuimico,
    OCC.Aviador, OCC.IngenieroElectronico, OCC.IngenieroMecatronico, OCC.IngenieroSP
  ],
  C: [
    OCC.Economista, OCC.ContadorPublico, OCC.Auditor, OCC.Estadigrafo,
    OCC.ProfesorMatematicas, OCC.EspecialistaComputacion,
    OCC.IngenieroInformatico, OCC.AnalistaSistemas, OCC.ProgramadorInformatico
  ],
  D: [
    OCC.Antropologo, OCC.Arqueologo, OCC.Astronomo, OCC.Biologo,
    OCC.IngenieroElectricista, OCC.IngenieroQuimico, OCC.Medico, OCC.Cirujano,
    OCC.MedicoVeterinario, OCC.Quimico, OCC.QuimicoFarmaceutico,
    OCC.Odontologo, OCC.Psicologo, OCC.TecnicoLaboratorio, OCC.Optometra,
  ],
  E: [
    OCC.Escritor, OCC.Jurista, OCC.AgentePublicidad, OCC.JefeDeVisitas,
    OCC.LocutorRadio, OCC.LocutorTV, OCC.Periodista, OCC.IngenieroComercial, OCC.IngenieroMarketing
  ],
  F: [
    OCC.Arquitecto, OCC.DecoradorInteriores, OCC.Dibujante, OCC.Escultor, OCC.Pintor,
  ],
  G: [
    OCC.Escritor, OCC.Periodista, OCC.Filologo, OCC.FilologoLetras, // (literario)
  ],
  H: [
    OCC.Compositor, OCC.Musico, OCC.ProfesorMusica, OCC.ActorActriz,
  ],
  I: [
    OCC.Sacerdote, OCC.Pedagogo, OCC.Bibliotecario, OCC.TrabajadorSocial,
    OCC.Enfermero, OCC.ConsejeroVocacional, OCC.Psicologo,
  ],
  J: [
    OCC.Archivista, OCC.ContadorPublico, OCC.Mecanografo, OCC.Secretario,
    OCC.TenedorLibros, OCC.Taquigrafo,
  ],
};

/** 4) Combinaciones por código de sección (reutilizando OCC) */
export const COMBO_OCCUPATIONS: Record<string, string[]> = {
  // "01" Aire libre – Mecánico
  'A-B': [
    OCC.IngenieroAgronomoMaquinaria, OCC.IngenieroCivilHidraulica,
    OCC.IngenieroCivilVias, OCC.IngenieroMinas, OCC.IngenieroPetroleos,
    OCC.IngenieroNaval, OCC.Topografo,
  ],
  // "02" Aire libre – Cálculo
  'A-C': [OCC.IngenieroAgronomoEstadistica, OCC.IngenieroAgronomoEconomia],
  // "03" Aire libre – Científico
  'A-D': [
    OCC.Arqueologo, OCC.Antropologo, OCC.IngenieroAgronomoFitotecnia,
    OCC.IngenieroAgronomoParasitologia, OCC.IngenieroForestal, OCC.Geologo,
    OCC.MedicoVeterinario,
  ],
  // "08" Aire libre – Servicio social
  'A-I': [OCC.ProfesorEducFisica, OCC.TrabajadorSocial],
  // "12" Mecánico – Cálculo
  'B-C': [OCC.IngenieroCivil, OCC.IngenieroElectricista, OCC.IngenieroMecanico],
  // "13" Mecánico – Científico
  'B-D': [
    OCC.IngenieroCivil, OCC.IngenieroElectricista, OCC.IngenieroIndustrial,
    OCC.IngenieroMecanico, OCC.IngenieroMinas, OCC.IngenieroQuimico,
    OCC.Geologo, OCC.Odontologo, OCC.Optometra, OCC.TecnicoLaboratorio,
  ],
  // "14" Mecánico – Persuasivo
  'B-E': [OCC.IngenieroIndustrial, OCC.AgentePublicidad],
  // "15" Mecánico – Artístico-plástico
  'B-F': [
    OCC.Arquitecto, OCC.ArquitectoUrbanista, OCC.DecoradorInteriores, OCC.DibujantePublicitario,
  ],
  // "17" Mecánico – Musical
  'B-H': [OCC.IngenieroSonido],
  // "18" Mecánico – Servicio social
  'B-I': [OCC.ProfesorMateriasTecnicas],
  // "23" Cálculo – Científico
  'C-D': [
    OCC.IngenieroCivil, OCC.IngenieroElectricista, OCC.IngenieroIndustrial,
    OCC.IngenieroMecanico, OCC.IngenieroPetroleos, OCC.IngenieroQuimico,
    OCC.Estadigrafo, OCC.Astronomo, OCC.Fisico, // <- ver nota abajo
    OCC.Economista, OCC.Actuario, OCC.Geologo, OCC.Matematico, OCC.ProfesorMatematicas,
  ].filter(Boolean),
  // "24" Cálculo – Persuasivo
  'C-E': [OCC.Economista],
  // "25" Cálculo – Artístico-plástico
  'C-F': [OCC.Arquitecto, OCC.IngenieroCivil],
  // "28" Cálculo – Servicio social
  'C-I': [
    OCC.ProfesorMatematicas, OCC.ProfesorMateriasComerciales, OCC.Economista, OCC.Estadigrafo,
  ],
  // "29" Cálculo – Trabajo de oficina
  'C-J': [OCC.ContadorPublico, OCC.TenedorLibros],
  // "34" Científico – Persuasivo
  'D-E': [OCC.IngenieroIndustrial, OCC.Farmaceutico, OCC.ProfesorCiencias],
  // "35" Científico – Artístico-plástico
  'D-F': [OCC.Arquitecto, OCC.Odontologo, OCC.Cirujano],
  // "36" Científico – Literario
  'D-G': [OCC.Medico, OCC.Psicologo, OCC.Filologo],
  // "37" Científico – Musical
  'D-H': [OCC.IngenieroSonido],
  // "38" Científico – Servicio social
  'D-I': [
    OCC.ProfesorCiencias, OCC.Odontologo, OCC.Medico, OCC.PsicologoClinico, OCC.ConsejeroVocacional,
  ],
  // "45" Persuasivo – Artístico-plástico
  'E-F': [OCC.DecoradorInteriores, OCC.DibujantePublicitario],
  // "46" Persuasivo – Literario
  'E-G': [OCC.Escritor, OCC.Periodista, OCC.Jurista, OCC.FilologoLetras],
  // "47" Persuasivo – Musical
  'E-H': [OCC.ActorActriz, OCC.ProfesorCanto, OCC.ProfesorMusica, OCC.DirectorConjunto],
  // "56" Artístico-plástico – Literario
  'F-G': [OCC.Escritor, OCC.ActorActriz], // (según lámina “Artístico-plástico–literario”)
  // "58" Artístico-plástico – Servicio social
  'F-I': [OCC.ProfesorMateriasTecnicas], // “profesores de artes manuales/materias técnicas”
  // "67" Literario – Musical
  'G-H': [OCC.ActorActriz, OCC.ProfesorMusica],
  // "68" Literario – Servicio social
  'G-I': [OCC.Escritor, OCC.Periodista, OCC.TrabajadorSocial, OCC.FilologoLetras],
  // "69" Literario – Trabajo de oficina
  'G-J': [OCC.Bibliotecologo, OCC.Secretario],
  // "78" Musical – Servicio social
  'H-I': [OCC.Musico, OCC.ProfesorMusica, OCC.ProfesorBaile],
  // "89" Servicio social – Oficina
  'I-J': [OCC.ProfesorMateriasComerciales],
};

import { db, defaultSections } from './db';
import { Question } from './models';

const QUESTIONS: Question[] = [
  // ---- Sección A: Aire libre ----
  { section:'A', order:1, text:'Salir de excursión' },
  { section:'A', order:2, text:'Pertenecer a un club de exploradores' },
  { section:'A', order:3, text:'Vivir al aire libre, fuera de la ciudad' },
  { section:'A', order:4, text:'Sembrar y plantar en una granja durante las vacaciones' },
  { section:'A', order:5, text:'Criar animales en un rancho durante las vacaciones' },
  { section:'A', order:6, text:'Ser técnico agrícola en una región algodonera' },

  // ---- Sección B: Mecánico ----
  { section:'B', order:1, text:'Armar o desarmar objetos mecánicos' },
  { section:'B', order:2, text:'Manejar herramientas y maquinarias' },
  { section:'B', order:3, text:'Construir objetos o muebles de madera' },
  { section:'B', order:4, text:'Reparar las instalaciones eléctricas de tu casa' },
  { section:'B', order:5, text:'Proyectar y dirigir la construcción de un pozo o noria' },
  { section:'B', order:6, text:'Ser perito mecánico en un gran taller' },

  // ---- Sección C: Cálculo ----
  { section:'C', order:1, text:'Resolver mecanizaciones numéricas' },
  { section:'C', order:2, text:'Resolver problemas de aritmética' },
  { section:'C', order:3, text:'Llevar las cuentas de una cooperativa escolar' },
  { section:'C', order:4, text:'Explicar a otros cómo resolver problemas de aritmética' },
  { section:'C', order:5, text:'Participar en concursos de aritmética' },
  { section:'C', order:6, text:'Ser experto calculista en una industria' },

  // ---- Sección D: Científico ----
  { section:'D', order:1, text:'Conocer y estudiar las estructuras de las plantas y los animales' },
  { section:'D', order:2, text:'Hacer experimentos de biología, física o química' },
  { section:'D', order:3, text:'Investigar el origen de las costumbres de los pueblos' },
  { section:'D', order:4, text:'Estudiar y entender las causas de los movimientos sociales' },
  { section:'D', order:5, text:'Leer revistas y libros científicos' },
  { section:'D', order:6, text:'Ser investigador de un laboratorio de biología, física o química' },

  // ---- Sección E: Persuasivo ----
  { section:'E', order:1, text:'Discutir en clase' },
  { section:'E', order:2, text:'Ser jefe de un club o sociedad' },
  { section:'E', order:3, text:'Dirigir la campaña política de un candidato estudiantil' },
  { section:'E', order:4, text:'Hacer propaganda para la venta de un periódico estudiantil' },
  { section:'E', order:5, text:'Leer biografías de políticos eminentes' },
  { section:'E', order:6, text:'Ser agente de ventas de una empresa comercial' },

  // ---- Sección F: Artístico-plástico ----
  { section:'F', order:1, text:'Dibujar y pintar a colores' },
  { section:'F', order:2, text:'Modelar en barro' },
  { section:'F', order:3, text:'Encargarte del decorado de una exposición escolar' },
  { section:'F', order:4, text:'Idear y diseñar el escudo de un club o sociedad' },
  { section:'F', order:5, text:'Diseñar el vestuario para una función teatral' },
  { section:'F', order:6, text:'Ser perito dibujante en una empresa industrial' },

  // ---- Sección G: Literario ----
  { section:'G', order:1, text:'Escribir cuentos, crónicas o artículos' },
  { section:'G', order:2, text:'Leer obras literarias' },
  { section:'G', order:3, text:'Escribir versos para su periódico' },
  { section:'G', order:4, text:'Representar un papel en una obra teatral' },
  { section:'G', order:5, text:'Participar en un concurso de oratoria' },
  { section:'G', order:6, text:'Ser redactor de un periódico' },

  // ---- Sección H: Musical ----
  { section:'H', order:1, text:'Cantar en un orfeón estudiantil' },
  { section:'H', order:2, text:'Escuchar música clásica' },
  { section:'H', order:3, text:'Aprender a tocar un instrumento musical' },
  { section:'H', order:4, text:'Ser miembro de una asociación musical' },
  { section:'H', order:5, text:'Leer biografías de músicos eminentes' },
  { section:'H', order:6, text:'Ser miembro de una sinfónica' },

  // ---- Sección I: Servicio social ----
  { section:'I', order:1, text:'Atender a los enfermos y cuidar de ellos' },
  { section:'I', order:2, text:'Proteger a los muchachos menores del grupo' },
  { section:'I', order:3, text:'Ser miembro de una sociedad de ayuda y asistencia' },
  { section:'I', order:4, text:'Enseñar a leer a los analfabetos' },
  { section:'I', order:5, text:'Ayudar a tus compañeros en sus dificultades y preocupaciones' },
  { section:'I', order:6, text:'Ser miembro del servicio de la clase humilde' },

  // ---- Sección J: Trabajo de oficina ----
  { section:'J', order:1, text:'Llevar en orden tus libros y cuadernos' },
  { section:'J', order:2, text:'Ordenar y clasificar los libros de la biblioteca' },
  { section:'J', order:3, text:'Aprender a escribir en máquina y taquigrafía' },
  { section:'J', order:4, text:'Ayudar a calificar pruebas' },
  { section:'J', order:5, text:'Encargarme del archivo y los documentos de una sociedad' },
  { section:'J', order:6, text:'Ser técnico organizador de oficinas' },
];

// Ejecuta el seed solo si la DB está vacía
export async function seedIfNeeded(): Promise<void> {
  const qCount = await db.questions.count();
  if (qCount > 0) return;

  await db.transaction('rw', db.sections, db.questions, async () => {
    await db.sections.bulkPut(defaultSections());
    await db.questions.bulkAdd(QUESTIONS.map(q => ({ ...q, active: true })));
  });
}

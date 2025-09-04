// Áreas y secciones
export type SectionCode =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J';

export const SECTION_NAMES: Record<SectionCode, string> = {
  A: 'Aire libre',
  B: 'Mecánico',
  C: 'Cálculo',
  D: 'Científico',
  E: 'Persuasivo',
  F: 'Artístico-plástico',
  G: 'Literario',
  H: 'Musical',
  I: 'Servicio social',
  J: 'Trabajo de oficina',
};

// Entidades básicas
export interface Section {
  code: SectionCode; // p.ej. "A"
  name: string; // p.ej. "Aire libre"
}

export interface Question {
  id?: number; // autoincrement
  section: SectionCode; // "A".."J"
  order: number; // 1..6
  text: string; // enunciado
  active?: boolean; // por si luego querés desactivar ítems
}

// (Opcional) respuestas y sesiones
export interface Answer {
  id?: number;
  questionId: number;
  value: 1 | 2 | 3 | 4 | 5;
  attemptId: string; // UUID de la sesión de test
}

export interface Person {
  id?: number; // autoincrement
  firstName: string;
  lastName: string;
  birthDate: string;            // formato ISO (YYYY-MM-DD)
  email: string; // para enviar el resultado
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// Vinculamos la sesión (Attempt) con la persona
export interface Attempt {
  id: string; // UUID
  createdAt: string; // ISO
  personId: number; // FK -> Person.id
}

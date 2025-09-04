import Dexie, { Table } from 'dexie';
import { Section, Question, Answer, Attempt, SECTION_NAMES, SectionCode, Person } from './models';

export class VocationalDb extends Dexie {
  sections!: Table<Section, string>; // PK: code
  questions!: Table<Question, number>;
  answers!: Table<Answer, number>;
  attempts!: Table<Attempt, string>;
  persons!: Table<Person, number>;

  constructor() {
    super('vocational-db');
    this.version(1).stores({
        sections: 'code',
        questions: '++id, section, order',
        answers: '++id, attemptId, questionId',
        attempts: 'id, createdAt, personId',
        persons: '++id, email, lastName, firstName'
    })
  }
}

export const db = new VocationalDb();

// util para crear secciones A..J desde SECTION_NAMES
export function defaultSections(): Section[] {
  return (Object.keys(SECTION_NAMES) as SectionCode[])
    .map(code => ({ code, name: SECTION_NAMES[code] }));
}

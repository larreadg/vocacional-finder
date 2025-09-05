// src/app/person.service.ts
import { Injectable } from '@angular/core';
import { db } from '../db';
import { Person, Answer } from '../models';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

@Injectable({ providedIn: 'root' })
export class PersonService {
/**
 * Crea o actualiza la primera Persona de la base.
 * Si no existe, inserta un nuevo registro.
 * Si existe, actualiza siempre el primer registro.
 * Retorna el personId.
 */
async upsertPerson(input: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = new Date().toISOString();

  return db.transaction('rw', db.persons, async () => {
    // Obtener el primer registro de la tabla
    const firstRecord = await db.persons.orderBy('id').first();

    if (firstRecord) {
      // Actualizar siempre el primer registro
      await db.persons.update(firstRecord.id!, {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        birthDate: input.birthDate,
        updatedAt: now
      });
      return firstRecord.id!;
    } else {
      // Insertar nuevo registro si la tabla está vacía
      return await db.persons.add({
        ...input,
        createdAt: now,
        updatedAt: now
      });
    }
  });
}


  /**
   * Elimina TODAS las respuestas de una persona.
   * Útil para un botón "Reiniciar test".
   * Retorna la cantidad de respuestas borradas.
   */
  async resetAnswersForPerson(personId: number): Promise<number> {
    return db.transaction('rw', db.answers, async () => {
      const toDelete = await db.answers
        .where('personId')
        .equals(personId)
        .primaryKeys();
      if (toDelete.length === 0) return 0;
      await db.answers.bulkDelete(toDelete as number[]);
      return toDelete.length;
    });
  }

  /**
   * Devuelve la primera persona registrada (o null si no hay).
   */
  async getFirstPerson(): Promise<Person | null> {
    const person = await db.persons.orderBy('id').first();
    return person ?? null;
  }

  /**
   * Guarda respuesta (upsert por persona+pregunta).
   * Si ya existe, actualiza el value; si no, crea.
   */
  async saveAnswer(
    personId: number,
    questionId: number,
    value: 1 | 2 | 3 | 4 | 5
  ): Promise<void> {
    await db.transaction('rw', db.answers, async () => {
      const existing = await db.answers.where({ personId, questionId }).first();
      if (existing) {
        await db.answers.update(existing.id!, { value });
      } else {
        const answer: Answer = { personId, questionId, value };
        await db.answers.add(answer);
      }
    });
  }

  async getProgress(personId: number) {
    // Obtener todas las preguntas y respuestas de la persona
    const [questions, answers] = await Promise.all([
      db.questions.toArray(),
      db.answers.where('personId').equals(personId).toArray(),
    ]);

    const total = questions.length;
    const answered = answers.length;
    const remaining = total - answered;

    // ---- Totales por sección ----
    const totalsBySection: Record<
      string,
      { total: number; answered: number; remaining: number }
    > = {};

    // Inicializar totales con base en las preguntas
    for (const q of questions) {
      if (!totalsBySection[q.section]) {
        totalsBySection[q.section] = { total: 0, answered: 0, remaining: 0 };
      }
      totalsBySection[q.section].total++;
    }

    // Contabilizar respuestas por sección
    for (const ans of answers) {
      const question = questions.find((q) => q.id === ans.questionId);
      if (question) {
        totalsBySection[question.section].answered++;
      }
    }

    // Calcular las pendientes por sección
    for (const key of Object.keys(totalsBySection)) {
      totalsBySection[key].remaining =
        totalsBySection[key].total - totalsBySection[key].answered;
    }

    return {
      total,
      answered,
      remaining,
      totalsBySection,
    };
  }

  async getAnswer(
    personId: number,
    questionId: number
  ): Promise<Answer | null> {
    const row = await db.answers
      .where('[personId+questionId]')
      .equals([personId, questionId])
      .first();
    return row ?? null;
  }

  async getAnswerValue(
    personId: number,
    questionId: number
  ): Promise<1 | 2 | 3 | 4 | 5 | null> {
    const row = await this.getAnswer(personId, questionId);
    return row ? row.value : null;
  }
}

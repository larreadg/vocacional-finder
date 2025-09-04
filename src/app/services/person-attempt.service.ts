import { Injectable } from '@angular/core';
import { db } from '../db';
import { Attempt, Person } from '../models';

function uuid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

@Injectable({ providedIn: 'root' })
export class PersonAttemptService {

  /** Crea o actualiza persona por email y abre un Attempt vinculado */
  async upsertPersonAndStartAttempt(input: Omit<Person, 'id'|'createdAt'|'updatedAt'>)
  : Promise<{ personId: number; attemptId: string; }> {

    if (!isValidEmail(input.email)) {
      throw new Error('Correo electrónico inválido.');
    }

    const now = new Date().toISOString();

    return db.transaction('rw', db.persons, db.attempts, async () => {
      const existing = await db.persons.where('email').equals(input.email).first();

      let personId: number;
      if (existing) {
        personId = existing.id!;
        await db.persons.update(personId, {
          firstName: input.firstName,
          lastName: input.lastName,
          birthDate: input.birthDate,
          updatedAt: now
        });
      } else {
        personId = await db.persons.add({
          ...input,
          createdAt: now,
          updatedAt: now
        });
      }

      const attemptId = uuid();
      await db.attempts.add(<Attempt>{
        id: attemptId,
        createdAt: now,
        personId
      });

      return { personId, attemptId };
    });
  }

  /** Calcula edad a partir de birthDate */
  static calculateAge(birthDate: string): number {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  async getPersonWithAttempts(email: string) {
    const person = await db.persons.where('email').equals(email).first();
    if (!person) return null;
    const attempts = await db.attempts
      .where('personId')
      .equals(person.id!)
      .reverse()
      .sortBy('createdAt');
    return { person, attempts };
  }

  async getFirstPerson(): Promise<Person | null> {
    const person = await db.persons.orderBy('id').first();
    return person ?? null;
  }
}

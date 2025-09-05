import { Injectable } from '@angular/core';
import { db } from '../db';
import { Question, SECTION_NAMES, SectionCode } from '../models';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  getAll(): Promise<Question[]> {
    return db.questions.orderBy('[section+order]').toArray();
  }
  getBySection(code: SectionCode): Promise<Question[]> {
    return db.questions.where('section').equals(code).sortBy('order');
  }

  /**
   * AGRUPADO: devuelve Record<SectionCode, Question[]>
   * { A: [...], B: [...], ... }
   */
  async getAllBySectionMap(activeOnly = true): Promise<Record<SectionCode, Question[]>> {
    const all = await db.questions.toArray();
    const map = {} as Record<SectionCode, Question[]>;

    for (const q of all) {
      if (activeOnly && q.active === false) continue;
      (map[q.section] ??= []).push(q);
    }

    // ordenar internamente por order
    (Object.keys(map) as SectionCode[]).forEach(sec => {
      map[sec].sort((a, b) => a.order - b.order);
    });

    return map;
  }

  /**
   * AGRUPADO para UI: [{ section, name, items: Question[] }, ...]
   * Útil para *ngFor sobre grupos en la plantilla.
   */
  async getAllBySectionList(activeOnly = true): Promise<Array<{ section: SectionCode; name: string; items: Question[] }>> {
    const map = await this.getAllBySectionMap(activeOnly);
    const groups: Array<{ section: SectionCode; name: string; items: Question[] }> = [];

    (Object.keys(map) as SectionCode[]).sort().forEach(section => {
      groups.push({
        section,
        name: SECTION_NAMES[section],
        items: map[section]
      });
    });

    return groups;
  }
}

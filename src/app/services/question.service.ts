import { Injectable } from '@angular/core';
import { db } from '../db';
import { Question, SectionCode } from '../models';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  getAll(): Promise<Question[]> {
    return db.questions.orderBy('[section+order]').toArray();
  }
  getBySection(code: SectionCode): Promise<Question[]> {
    return db.questions.where('section').equals(code).sortBy('order');
  }
}

// src/app/results.service.ts
import { Injectable } from '@angular/core';
import { db } from '../db';
import { Question, SectionCode, SECTION_NAMES } from '../models';

export interface SectionScore {
  section: SectionCode;          // A..J
  name: string;                  // Aire libre, Mecánico, ...
  answered: number;              // # de respuestas en esa sección
  totalQuestions: number;        // # de preguntas de la sección (6)
  score: number;                 // suma de valores (1..5)
  maxScore: number;              // totalQuestions * 5
  percentage: number;            // score / maxScore (0..100)
}

@Injectable({ providedIn: 'root' })
export class ResultsService {

  /** Calcula puntajes por sección para una persona. */
  async getSectionScores(personId: number): Promise<SectionScore[]> {
    // Traemos TODO una sola vez
    const [questions, answers] = await Promise.all([
      db.questions.toArray(),
      db.answers.where('personId').equals(personId).toArray()
    ]);

    // Pre-añadimos todas las secciones (A..J) con totales de preguntas
    const bySec = new Map<SectionCode, SectionScore>();
    for (const q of questions) {
      if (!bySec.has(q.section)) {
        const totalQuestions = questions.filter(x => x.section === q.section).length;
        bySec.set(q.section, {
          section: q.section,
          name: SECTION_NAMES[q.section],
          answered: 0,
          totalQuestions,
          score: 0,
          maxScore: totalQuestions * 5,
          percentage: 0
        });
      }
    }

    // Acumular respuestas
    for (const ans of answers) {
      const q = questions.find(x => x.id === ans.questionId);
      if (!q) continue;
      const bucket = bySec.get(q.section)!;
      bucket.answered += 1;
      bucket.score += Number(ans.value || 0);
    }

    // Calcular porcentaje
    for (const v of bySec.values()) {
      v.percentage = v.maxScore ? Math.round((v.score / v.maxScore) * 100) : 0;
    }

    // Ordenar por mayor puntaje (o porcentaje)
    return Array.from(bySec.values()).sort((a, b) => b.score - a.score);
  }

  /** Construye ChartData para PrimeNG Chart.js (barras).  */
  buildBarChartData(scores: SectionScore[], topN?: number) {
    const data = topN ? scores.slice(0, topN) : scores;

    return {
      data: {
        labels: data.map(s => `${s.section} - ${s.name}`),
        datasets: [
          {
            label: 'Puntaje',
            data: data.map(s => s.score),
            borderWidth: 2
          }
        ]
      },
      options: <any>{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              // Tooltip con extra info
              afterLabel: (ctx: any) => {
                const s = data[ctx.dataIndex];
                return `  (${s.score}/${s.maxScore}) • ${s.percentage}%`;
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, suggestedMax: Math.max(...data.map(d => d.maxScore)) }
        }
      }
    };
  }
}

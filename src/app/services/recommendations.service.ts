// src/app/recommendations.service.ts
import { Injectable } from '@angular/core';
import { ResultsService, SectionScore } from './results.service';
import { SectionCode } from '../models';
import { ProfesionesService, Profesion } from './profesiones.service';
import { firstValueFrom, map, shareReplay } from 'rxjs';

export interface RecommendationsResult {
  top3: SectionScore[];
  top2Key: string | null;                // p.ej. "A-D"
  combo: Profesion[];                    // profesiones por combinación Top-2 (objetos completos)
  area1: { section: SectionCode | null; list: Profesion[] };
  area2: { section: SectionCode | null; list: Profesion[] };
  merged: Profesion[];                   // combinación + áreas (sin duplicados, objetos completos)
  allScores: SectionScore[];
}

export interface RecommendationOptions {
  comboLimit?: number;
  perAreaLimit?: number;
  mergedLimit?: number;
  dedupeCaseInsensitive?: boolean; // default true (dedupe por nombre de profesión)
}

type AreasMap = Record<SectionCode, Profesion[]>;
type PairKey =
  | 'A-B'|'A-C'|'A-D'|'A-I'
  | 'B-C'|'B-D'|'B-E'|'B-F'|'B-H'|'B-I'
  | 'C-D'|'C-E'|'C-F'|'C-I'|'C-J'
  | 'D-E'|'D-F'|'D-G'|'D-H'|'D-I'
  | 'E-F'|'E-G'|'E-H'
  | 'F-G'|'F-I'
  | 'G-H'|'G-I'|'G-J'
  | 'H-I'
  | 'I-J';
type CombosMap = Record<PairKey, Profesion[]>;

const SINGLES: SectionCode[] = ['A','B','C','D','E','F','G','H','I','J'];
const PAIRS: PairKey[] = [
  'A-B','A-C','A-D','A-I',
  'B-C','B-D','B-E','B-F','B-H','B-I',
  'C-D','C-E','C-F','C-I','C-J',
  'D-E','D-F','D-G','D-H','D-I',
  'E-F','E-G','E-H',
  'F-G','F-I',
  'G-H','G-I','G-J',
  'H-I',
  'I-J'
];

@Injectable({ providedIn: 'root' })
export class RecommendationsService {
  constructor(
    private results: ResultsService,
    private profesiones: ProfesionesService
  ) {}

  // ===== NUEVO: mapas derivados del JSON (objetos completos) =====
  private areasMap$ = this.profesiones.load$().pipe(
    map(list => {
      const out: AreasMap = { A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[] };
  
      for (const item of list) {
        const name = item.profesion?.trim();
        if (!name) continue;
  
        // ✅ SOLO códigos simples (A..J). NO expandimos pares.
        for (const s of SINGLES) {
          if (item.intereses?.some(c => c === s) && !this.existsIn(out[s], name)) {
            out[s].push(item); // ← push del objeto completo
          }
        }
      }
  
      // ordenar por nombre para UI estable
      for (const s of SINGLES) {
        out[s].sort((a, b) => a.profesion.localeCompare(b.profesion, 'es'));
      }
      return out;
    }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  private combosMap$ = this.profesiones.load$().pipe(
    map(list => {
      const out = Object.fromEntries(PAIRS.map(p => [p, [] as Profesion[]])) as CombosMap;

      for (const item of list) {
        const name = item.profesion?.trim();
        if (!name) continue;
        for (const p of PAIRS) {
          if (item.intereses?.includes(p) && !this.existsIn(out[p], name)) {
            out[p].push(item);
          }
        }
      }

      // ordenar por nombre
      for (const p of PAIRS) {
        out[p].sort((a, b) => a.profesion.localeCompare(b.profesion, 'es'));
      }
      return out;
    }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // ===== Método principal =====
  async getTopAndRecommendations(
    personId: number,
    opts: RecommendationOptions = {}
  ): Promise<RecommendationsResult> {
    const {
      comboLimit,
      perAreaLimit,
      mergedLimit,
      dedupeCaseInsensitive = true,
    } = opts;

    const [scores, areasMap, combosMap] = await Promise.all([
      this.results.getSectionScores(personId),         // ya ordenado desc
      firstValueFrom(this.areasMap$),
      firstValueFrom(this.combosMap$),
    ]);

    const top3 = scores.slice(0, 3);
    const s1 = top3[0]?.section ?? null;
    const s2 = top3[1]?.section ?? null;

    console.log(top3, s1, s2)

    if (!s1 || !s2) {
      return {
        top3,
        top2Key: null,
        combo: [],
        area1: { section: s1, list: s1 ? (areasMap[s1] ?? []).slice(0, perAreaLimit) : [] },
        area2: { section: s2, list: s2 ? (areasMap[s2] ?? []).slice(0, perAreaLimit) : [] },
        merged: [],
        allScores: scores,
      };
    }

    const key = this.buildComboKey(s1, s2) as PairKey;

    // 1) combo exacto (objetos)
    let combo = combosMap[key] ?? [];
    if (comboLimit && combo.length) combo = combo.slice(0, comboLimit);

    // 2) áreas por sección (objetos)
    let area1List = areasMap[s1] ?? [];
    let area2List = areasMap[s2] ?? [];
    if (perAreaLimit) {
      area1List = area1List.slice(0, perAreaLimit);
      area2List = area2List.slice(0, perAreaLimit);
    }

    console.log(area1List)

    // 3) merge con dedupe por nombre (conservar objetos completos)
    const merged = this.mergeUniqueObjects(
      [area1List, area2List, combo],
      dedupeCaseInsensitive,
      mergedLimit
    );

    return {
      top3,
      top2Key: key,
      combo,
      area1: { section: s1, list: area1List },
      area2: { section: s2, list: area2List },
      merged,
      allScores: scores,
    };
  }

  // ===== Helpers =====
  private buildComboKey(a: SectionCode, b: SectionCode): string {
    return [a, b].sort().join('-');
  }

  /** Verifica existencia por nombre (para no duplicar el mismo objeto en listas) */
  private existsIn(arr: Profesion[], nombre: string, ci = true): boolean {
    const norm = (s: string) => (ci ? s.toLocaleLowerCase() : s);
    const k = norm(nombre);
    return arr.some(p => norm(p.profesion) === k);
  }

  /** Une listas de objetos Profesion sin duplicar por nombre; respeta orden y límites */
  private mergeUniqueObjects(
    lists: Profesion[][],
    caseInsensitive: boolean,
    limit?: number
  ): Profesion[] {
    const seen = new Set<string>();
    const out: Profesion[] = [];
    const norm = (s: string) => (caseInsensitive ? s.toLocaleLowerCase() : s);

    for (const list of lists) {
      for (const item of list) {
        const k = norm(item.profesion);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
          if (limit && out.length >= limit) return out;
        }
      }
    }
    return out;
    }

  // Accesores por si querés usar los mapas fuera del servicio
  getAreasMapOnce(): Promise<AreasMap> {
    return firstValueFrom(this.areasMap$);
  }
  getCombosMapOnce(): Promise<CombosMap> {
    return firstValueFrom(this.combosMap$);
  }
}

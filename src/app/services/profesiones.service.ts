import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, shareReplay, tap } from "rxjs";

// modelos
export interface Univ { ies: string; sede?: string; tipo?: string; documento?: string; antecedentes?: string }
export interface Profesion { profesion: string; intereses: string[]; universidades: Univ[] }

// servicio
@Injectable({ providedIn: 'root' })
export class ProfesionesService {
  private data?: Profesion[];
  private byNombre = new Map<string, Profesion>();
  private byInteres = new Map<string, Profesion[]>();
  private byIES = new Map<string, Profesion[]>();

  constructor(private http: HttpClient) {}

  load$(): Observable<Profesion[]> {
    if (this.data) return of(this.data);
    return this.http.get<Profesion[]>('assets/json/profesiones.json').pipe(
      tap(arr => {
        this.data = arr;
        // índices para O(1)/O(n) pequeño
        for (const p of arr) {
          this.byNombre.set(p.profesion.toLowerCase(), p);
          for (const code of p.intereses) {
            const k = code.toUpperCase();
            (this.byInteres.get(k) ?? this.byInteres.set(k, []).get(k)!)?.push(p);
          }
          for (const u of p.universidades ?? []) {
            const k = (u.ies || '').toLowerCase();
            if (!k) continue;
            (this.byIES.get(k) ?? this.byIES.set(k, []).get(k)!)?.push(p);
          }
        }
      }),
      shareReplay(1)
    );
  }

  // consultas
  byNombreExacto(nombre: string) {
    return this.byNombre.get(nombre.toLowerCase()) ?? null;
  }
  porInteres(code: string) {
    return this.byInteres.get(code.toUpperCase()) ?? [];
  }
  porUniversidad(ies: string) {
    return this.byIES.get(ies.toLowerCase()) ?? [];
  }
  buscarTexto(q: string) {
    const Q = q.trim().toLowerCase();
    return (this.data ?? []).filter(p => p.profesion.toLowerCase().includes(Q));
  }
}

import { Component, inject } from '@angular/core';
import { Person } from '../../../models';
import { PersonService } from '../../../services/person.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { RecommendationsService } from '../../../services/recommendations.service';
Chart.register(ChartDataLabels);
import { Profesion, Univ } from '../../../services/profesiones.service';
import emailjs from '@emailjs/browser';
import { SectionScore } from '../../../services/results.service';
import { Router } from '@angular/router';

import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CONSTANTS } from '../../../const';
const baseColor = '#2dd4bf';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [
    ChartModule,
    DividerModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ToastModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './test-results.component.html',
  styleUrl: './test-results.component.scss'
})
export class TestResultsComponent {
  private reco = inject(RecommendationsService);
  private apiPerson = inject(PersonService)
  private router = inject(Router)
  private toast = inject(MessageService)
  person!: Person;
  chartData: any;
  chartOptions: any;
  sectionScores: any[] = [];
  recommendations: Profesion[] = [];
  top2Key: string | null = null;
  testFinished: boolean = true
  top3: SectionScore[] = []
  appName = CONSTANTS.appName
  targetUnis: Univ[] = []
  targetVisible: boolean = false
  targetProfesion: string = ''

  resetVisible: boolean = false

  async ngOnInit() {
    this.person = <Person> await this.apiPerson.getFirstPerson()
    const { top3, merged, allScores, top2Key } = await this.reco.getTopAndRecommendations(this.person.id!);

    for(let score of allScores) {
      if(score.answered < score.totalQuestions) this.testFinished = false
    }

    this.sectionScores = allScores;     // tabla completa
    this.recommendations = merged;
    this.top2Key = top2Key;
    this.top3 = top3

    // Top-3 chart
    const labels = top3.map(s => `${s.section} - ${s.name}`);
    const data = top3.map(s => s.score);

    this.chartData = {
      labels,
      datasets: [{
        label: 'Puntaje',
        data,
        backgroundColor: baseColor + '33',
        borderColor: baseColor,
        borderWidth: 2,
        borderRadius: 6
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end', align: 'start', color: '#fff',
          formatter: (_: number, ctx: any) => top3[ctx.dataIndex].score,
          font: { weight: 'bold' }
        }
      },
      scales: {
        x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,.1)' } },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(...top3.map(s => s.maxScore)),
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,.1)' }
        }
      }
    };
  }

  targetOpen = (item: Profesion) => {
    this.targetUnis = item.universidades
    this.targetProfesion = item.profesion
    this.targetVisible = true
  }

  abrirEnNuevaPestana(url: string) {
    window.open(url, '_blank');
  }

  sendResults = () => {

    const recommendationsHtml = this.recommendations.map(r => {
      // 1. Crear un Set para eliminar duplicados
      const uniqueUniversities = [...new Set(r.universidades.map(u => u.ies))];
    
      // 2. Tomar solo las primeras 5 universidades
      const limitedUniversities = uniqueUniversities.slice(0, 5);
    
      // 3. Generar lista <ul> con estilos inline
      const universitiesList = `
        <ul style="margin:0; padding-left:16px; color:#d4d4d8; list-style-type:disc;">
          ${limitedUniversities.map(u => `
            <li style="margin-bottom:4px;">${u}</li>
          `).join('')}
        </ul>
      `;
    
      // 4. Retornar fila completa
      return `
        <tr>
          <td style="border-bottom:1px solid #2d2d30; color:#ffffff;">${r.profesion}</td>
          <td style="border-bottom:1px solid #2d2d30;">${universitiesList}</td>
        </tr>
      `;
    }).join('');    

    emailjs.send('service_t7h94z3', 'template_vf_results', {
      user_name: this.person.firstName + ' ' + this.person.lastName,
      top1: this.top3[0].name,
      top2: this.top3[1].name,
      top3: this.top3[2].name,
      total_score: this.sectionScores.reduce((sum, s) => sum + s.score, 0),
      recommendations: recommendationsHtml,
      name: 'Vocacional Finder',
      to_email: this.person.email
    }, 'MVcM7HA-dBNaWXXZI');

    this.toast.add({ severity: 'success', summary: this.appName, detail: `Te enviamos los resultados a: ${this.person.email}` })
  }

  reset = async() => {
    this.apiPerson.resetAnswersForPerson(<number> this.person.id)
    this.router.navigate(['/vf'])
  }
}

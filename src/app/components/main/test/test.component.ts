import { Component, inject, OnInit } from '@angular/core';
import { QuestionsService } from '../../../services/question.service';
import { Person, Question, SectionCode } from '../../../models';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from '../shared/question/question.component';
import { PersonService } from '../../../services/person.service';
import { RouterLink } from '@angular/router';

// Primeng
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessagesModule } from 'primeng/messages';
import { PanelMenuModule } from "primeng/panelmenu";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    FieldsetModule,
    ProgressBarModule,
    MessagesModule,
    PanelMenuModule,
    CommonModule,
    RouterLink,
    QuestionComponent,
],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  private apiQuestion = inject(QuestionsService)
  private apiPerson = inject(PersonService)
  sections: Array<{ section: SectionCode; name: string; items: Question[] }> = []
  person: Person | null = null
  
  progressTotal:number = 1
  progressCurrent: number = 0
  progressSections: any = {}

  async ngOnInit() {
    this.person = await this.apiPerson.getFirstPerson()
    this.sections = await this.apiQuestion.getAllBySectionList()
    this.watchProgress()
  }

  async watchProgress() {
    if(this.person) {
      const data = await this.apiPerson.getProgress(<number> this.person.id)
      this.progressTotal = data.total
      this.progressCurrent = data.answered
      
      for(let key in data.totalsBySection) {
        this.progressSections[key] = data.totalsBySection[key].remaining === 0
      }
    }
  }
}

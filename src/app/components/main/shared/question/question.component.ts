import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Person, Question } from '../../../../models';
import { CONSTANTS } from '../../../../const';

// Primeng
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../../../services/person.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    FieldsetModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  @Input() set person(p: Person | null) {
    this.currentUser = p;
    this.tryLoadSelected();
  }
  
  @Input() set question(q: Question) {
    this._question = q;
    this.tryLoadSelected();
  }
  
  @Output() answered = new EventEmitter<boolean>()
  _question!: Question;
  currentUser: Person | null = null;
  selectedValue: (1|2|3|4|5) | null = null;
  optionValues = CONSTANTS.optionValues
  private apiPerson = inject(PersonService);
  
  private async tryLoadSelected() {
    const pid = this.currentUser?.id;
    const qid = this._question?.id;
    if (!pid || !qid) return; // aún no están listos
  
    // getAnswerValue debe devolver (1|2|3|4|5)|null
    this.selectedValue = await this.apiPerson.getAnswerValue(pid, qid);
  }

  onChangeSelectedValue = async () => {
    const pid = this.currentUser?.id;
    const qid = this._question?.id;
    if (!pid || !qid || this.selectedValue == null) return;
  
    await this.apiPerson.saveAnswer(
      pid,
      qid,
      this.selectedValue as 1|2|3|4|5
    );

    this.answered.emit(true)
  };

}

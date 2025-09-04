import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../const';
import { PersonAttemptService } from '../../../services/person-attempt.service';
import { CommonModule } from '@angular/common';
import { Person } from '../../../models';
import dayjs from 'dayjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DividerModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './me.component.html',
  styleUrl: './me.component.scss'
})
export class MeComponent implements OnInit {
  appName = CONSTANTS.appName
  submitted = false
  private toast = inject(MessageService)
  private api = inject(PersonAttemptService)
  private fb   = inject(FormBuilder)
  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control(
      '',
      [Validators.required, Validators.email]
    ),
    firstName: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)
      ]
    ),
    lastName: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)
      ]
    ),
    birthDate: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
      ]
    )
  });

  async ngOnInit() {
    const person: Person | null = await this.api.getFirstPerson()
    if(person) {
      this.form.controls['email'].setValue(person.email)
      this.form.controls['firstName'].setValue(person.firstName)
      this.form.controls['lastName'].setValue(person.lastName)
      this.form.controls['birthDate'].setValue(person.birthDate)
    }
  }

  async submit() {
    
    if (this.form.invalid) return;
    this.submitted = true
    const body = this.form.getRawValue()
    
    await this.api.upsertPersonAndStartAttempt({
      birthDate: dayjs(body.birthDate).format('YYYY-MM-DD'),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName
    })

    this.submitted = false

    this.toast.add({ severity: 'success', summary: this.appName, detail: `Tus datos fueron actualizados` })

  }

  get f() { return this.form.controls }
}

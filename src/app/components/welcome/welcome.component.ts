import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONSTANTS } from '../../const';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models';
import { Router } from '@angular/router';
import dayjs from 'dayjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  appName = CONSTANTS.appName
  submitted = false
  private api = inject(PersonService)
  private fb   = inject(FormBuilder)
  private router = inject(Router)
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
    
    await this.api.upsertPerson({
      birthDate: dayjs(body.birthDate).format('YYYY-MM-DD'),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName
    })

    this.submitted = false

    this.router.navigate(['/vf'])

  }

  get f() { return this.form.controls }
}

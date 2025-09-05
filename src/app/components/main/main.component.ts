import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Person } from '../../models';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  template: `
    <app-navbar></app-navbar>
    <section class="p-4">
      <router-outlet></router-outlet>
    </section>
  `,
})
export class MainComponent implements OnInit {
  private api = inject(PersonService)
  private router = inject(Router)
  async ngOnInit() {
    const person: Person | null = await this.api.getFirstPerson()
    if(person === null) this.router.navigate(['/welcome'])
  }
}

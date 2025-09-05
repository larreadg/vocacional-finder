import { Component, inject, OnInit } from '@angular/core';
import { CONSTANTS } from '../../../../const';
import { Person } from '../../../../models';
import { PersonService } from '../../../../services/person.service';

// Primeng
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    SidebarModule,
    PanelMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private api = inject(PersonService)
  appName = CONSTANTS.appName
  email: string = ''
  sidebarVisible: boolean = false
  aboutUsVisible: boolean = false
  sidebarItems: MenuItem[] = [
    {
      label: 'Test Vocacional',
      icon: 'pi pi-sparkles',
      routerLink: '/vf',
      command: () => this.toggleSidebar()
    },
    {
      label: 'Mis datos',
      icon: 'pi pi-user',
      routerLink: '/vf/me',
      command: () => this.toggleSidebar()
    },
    {
      label: 'Mis resultados',
      icon: 'pi pi-chart-line',
      routerLink: '/vf/results',
      command: () => this.toggleSidebar()
    },
    // {
    //   label: 'Acerca de nosotros',
    //   icon: 'pi pi-info-circle',
    //   command: () => {
    //     this.aboutUsVisible = true
    //     this.toggleSidebar()
    //   }
    // }
  ]
  async ngOnInit() {
    const person: Person | null = await this.api.getFirstPerson()
    if(person) this.email = person.email
  }

  toggleSidebar = () => this.sidebarVisible = !this.sidebarVisible
}

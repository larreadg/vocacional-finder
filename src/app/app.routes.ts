import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadComponent: () => import('./components/welcome/welcome.component').then((m) => m.WelcomeComponent),
    },
    {
        path: 'vf',
        loadChildren: () => import('./components/main/main.routes').then((m) => m.mainRoutes),
    },
    {
        path: '**',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
];

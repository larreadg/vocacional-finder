import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main.component').then((m) => m.MainComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./test/test.component').then((m) => m.TestComponent),
            },
            {
                path: 'me',
                loadComponent: () => import('./me/me.component').then((m) => m.MeComponent),
            },
            {
                path: 'results',
                loadComponent: () => import('./test-results/test-results.component').then((m) => m.TestResultsComponent),
            }
        ]
    }
];

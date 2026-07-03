import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  {
    path: 'games',
    loadChildren: () => import('./features/games/games.routes').then((m) => m.GAMES_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then((component) => component.NotFound),
    title: 'Page not found',
  },
];

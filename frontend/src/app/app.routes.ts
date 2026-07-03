import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  {
    path: 'games',
    loadChildren: () => import('./features/games/games.routes').then((m) => m.GAMES_ROUTES),
  },
  { path: '**', redirectTo: 'games' },
];

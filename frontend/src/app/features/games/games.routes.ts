import type { Routes } from '@angular/router';

export const GAMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./games-list/games-list').then((m) => m.GamesList),
    title: 'Games',
  },
  {
    path: 'new',
    loadComponent: () => import('./game-form/game-form').then((m) => m.GameForm),
    title: 'New game',
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./game-form/game-form').then((m) => m.GameForm),
    title: 'Edit game',
  },
];

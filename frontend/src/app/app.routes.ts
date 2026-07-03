import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  {
    path: 'games',
    loadComponent: () => import('./games/games-list').then((m) => m.GamesList),
    title: 'Games',
  },
  {
    path: 'games/new',
    loadComponent: () => import('./games/game-form').then((m) => m.GameForm),
    title: 'New game',
  },
  {
    path: 'games/:id/edit',
    loadComponent: () => import('./games/game-form').then((m) => m.GameForm),
    title: 'Edit game',
  },
  { path: '**', redirectTo: 'games' },
];

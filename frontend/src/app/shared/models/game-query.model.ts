import type { Game } from './game.model';

export type GameSortField = 'title' | 'genre' | 'developer' | 'releaseDate' | 'price';
export type SortDirection = 'asc' | 'desc';

export interface GameQuery {
  search: string;
  genre: string;
  sort: GameSortField;
  order: SortDirection;
  page: number;
  pageSize: number;
}

export interface PagedGames {
  items: Game[];
  totalCount: number;
  page: number;
  pageSize: number;
}

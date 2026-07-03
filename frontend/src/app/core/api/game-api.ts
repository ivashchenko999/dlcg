import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '@shared/constants/app.constants';
import { GameQuery, PagedGames } from '@shared/models/game-query.model';
import { Game, SaveGameRequest } from '@shared/models/game.model';
import { Genre } from '@shared/models/genre.model';

/**
 * Typed wrapper around the catalogue REST API. In development, requests to
 * /api are forwarded to the ASP.NET Core backend by the dev-server proxy
 * (see proxy.conf.json).
 */
@Injectable({ providedIn: 'root' })
export class GameApi {
  private readonly http = inject(HttpClient);

  getGames(query: GameQuery): Observable<PagedGames> {
    let params = new HttpParams()
      .set('sort', query.sort)
      .set('order', query.order)
      .set('page', query.page)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.genre) {
      params = params.set('genre', query.genre);
    }

    return this.http.get<unknown>(`${API_BASE_URL}/games`, { params }).pipe(
      map((response) => {
        if (!isPagedGames(response)) {
          throw new Error('The games API returned an unexpected response.');
        }
        return response;
      }),
    );
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${API_BASE_URL}/games/${id}`);
  }

  createGame(request: SaveGameRequest): Observable<Game> {
    return this.http.post<Game>(`${API_BASE_URL}/games`, request);
  }

  updateGame(id: number, request: SaveGameRequest): Observable<Game> {
    return this.http.put<Game>(`${API_BASE_URL}/games/${id}`, request);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/games/${id}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${API_BASE_URL}/genres`);
  }
}

function isPagedGames(value: unknown): value is PagedGames {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as Partial<PagedGames>;
  return (
    Array.isArray(result.items) &&
    typeof result.totalCount === 'number' &&
    typeof result.page === 'number' &&
    typeof result.pageSize === 'number'
  );
}

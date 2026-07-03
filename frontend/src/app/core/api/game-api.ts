import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '@shared/constants/app.constants';
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

  getGames(search?: string): Observable<Game[]> {
    let params = new HttpParams();
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Game[]>(`${API_BASE_URL}/games`, { params });
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

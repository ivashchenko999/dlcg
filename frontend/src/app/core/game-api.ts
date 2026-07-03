import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Game, Genre, SaveGameRequest } from './models';

/**
 * Typed wrapper around the catalogue REST API. In development, requests to
 * /api are forwarded to the ASP.NET Core backend by the dev-server proxy
 * (see proxy.conf.json).
 */
@Injectable({ providedIn: 'root' })
export class GameApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getGames(search?: string): Observable<Game[]> {
    let params = new HttpParams();
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Game[]>(`${this.baseUrl}/games`, { params });
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/games/${id}`);
  }

  createGame(request: SaveGameRequest): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}/games`, request);
  }

  updateGame(id: number, request: SaveGameRequest): Observable<Game> {
    return this.http.put<Game>(`${this.baseUrl}/games/${id}`, request);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/games/${id}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }
}

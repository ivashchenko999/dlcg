import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Observable, catchError, map, shareReplay, tap, throwError } from 'rxjs';

import {
  API_BASE_URL,
  GAME_QUERY_CACHE_MAX_ENTRIES,
  GAME_QUERY_CACHE_TTL_MS,
  GENRE_CACHE_TTL_MS,
} from '@shared/constants/app.constants';
import type { GameQuery, PagedGames } from '@shared/models/game-query.model';
import type { Game, SaveGameRequest } from '@shared/models/game.model';
import type { Genre } from '@shared/models/genre.model';

/**
 * Typed wrapper around the catalogue REST API. In development, requests to
 * /api are forwarded to the ASP.NET Core backend by the dev-server proxy
 * (see proxy.conf.json).
 */
@Injectable({ providedIn: 'root' })
export class GameApi {
  private readonly http = inject(HttpClient);
  private readonly gamesCache = new Map<string, CacheEntry<PagedGames>>();
  private genresCache: CacheEntry<Genre[]> | undefined;

  getGames(query: GameQuery): Observable<PagedGames> {
    const cacheKey = this.gameQueryCacheKey(query);
    const cached = this.gamesCache.get(cacheKey);
    if (cached !== undefined && cached.expiresAt > Date.now()) {
      // Refresh insertion order so the size bound behaves as a small LRU cache.
      this.gamesCache.delete(cacheKey);
      this.gamesCache.set(cacheKey, cached);
      return cached.value$;
    }
    this.gamesCache.delete(cacheKey);

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

    const value$ = this.http.get<unknown>(`${API_BASE_URL}/games`, { params }).pipe(
      map((response) => {
        if (!isPagedGames(response)) {
          throw new Error('The games API returned an unexpected response.');
        }
        return response;
      }),
      catchError((error: unknown) => {
        this.gamesCache.delete(cacheKey);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.gamesCache.set(cacheKey, {
      expiresAt: Date.now() + GAME_QUERY_CACHE_TTL_MS,
      value$,
    });
    this.trimGamesCache();
    return value$;
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${API_BASE_URL}/games/${String(id)}`);
  }

  createGame(request: SaveGameRequest): Observable<Game> {
    return this.http
      .post<Game>(`${API_BASE_URL}/games`, request)
      .pipe(
        tap(() => {
          this.gamesCache.clear();
        }),
      );
  }

  updateGame(id: number, request: SaveGameRequest): Observable<Game> {
    return this.http
      .put<Game>(`${API_BASE_URL}/games/${String(id)}`, request)
      .pipe(
        tap(() => {
          this.gamesCache.clear();
        }),
      );
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete(`${API_BASE_URL}/games/${String(id)}`).pipe(
      tap(() => {
        this.gamesCache.clear();
      }),
      map(() => undefined),
    );
  }

  getGenres(): Observable<Genre[]> {
    if (this.genresCache !== undefined && this.genresCache.expiresAt > Date.now()) {
      return this.genresCache.value$;
    }

    const value$ = this.http.get<Genre[]>(`${API_BASE_URL}/genres`).pipe(
      catchError((error: unknown) => {
        this.genresCache = undefined;
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.genresCache = { expiresAt: Date.now() + GENRE_CACHE_TTL_MS, value$ };
    return value$;
  }

  private gameQueryCacheKey(query: GameQuery): string {
    return [
      query.search.trim().toLocaleLowerCase(),
      query.genre.trim().toLocaleLowerCase(),
      query.sort,
      query.order,
      query.page,
      query.pageSize,
    ].join('|');
  }

  private trimGamesCache(): void {
    while (this.gamesCache.size > GAME_QUERY_CACHE_MAX_ENTRIES) {
      const oldestKey = this.gamesCache.keys().next().value;
      if (oldestKey === undefined) {
        return;
      }
      this.gamesCache.delete(oldestKey);
    }
  }
}

interface CacheEntry<T> {
  readonly expiresAt: number;
  readonly value$: Observable<T>;
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

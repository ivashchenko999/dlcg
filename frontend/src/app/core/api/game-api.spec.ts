import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GameApi } from './game-api';
import { GameQuery, PagedGames } from '@shared/models/game-query.model';
import { Game, SaveGameRequest } from '@shared/models/game.model';

describe('GameApi', () => {
  let api: GameApi;
  let http: HttpTestingController;

  const sampleGame: Game = {
    id: 1,
    title: 'Hades',
    developer: 'Supergiant Games',
    releaseDate: '2020-09-17',
    price: 24.99,
    genreId: 1,
    genreName: 'Action',
  };
  const query: GameQuery = {
    search: '',
    genre: '',
    sort: 'title',
    order: 'asc',
    page: 1,
    pageSize: 10,
  };
  const page: PagedGames = { items: [sampleGame], totalCount: 1, page: 1, pageSize: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(GameApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('passes paging and sorting parameters', () => {
    let result: PagedGames | undefined;
    api.getGames(query).subscribe((games) => (result = games));

    const req = http.expectOne('/api/games?sort=title&order=asc&page=1&pageSize=10');
    expect(req.request.method).toBe('GET');
    req.flush(page);

    expect(result).toEqual(page);
  });

  it('passes search and genre filters as query parameters', () => {
    api.getGames({ ...query, search: 'witcher', genre: 'RPG' }).subscribe();

    const req = http.expectOne(
      '/api/games?sort=title&order=asc&page=1&pageSize=10&search=witcher&genre=RPG',
    );
    expect(req.request.params.get('search')).toBe('witcher');
    expect(req.request.params.get('genre')).toBe('RPG');
    req.flush({ ...page, items: [] });
  });

  it('rejects the legacy array response instead of leaving the UI in a broken state', () => {
    const error = vi.fn();
    api.getGames(query).subscribe({ error });

    const req = http.expectOne('/api/games?sort=title&order=asc&page=1&pageSize=10');
    req.flush([sampleGame]);

    expect(error).toHaveBeenCalledOnce();
  });

  it('posts the payload when creating a game', () => {
    const request: SaveGameRequest = {
      title: 'Hades',
      developer: 'Supergiant Games',
      releaseDate: '2020-09-17',
      price: 24.99,
      genreId: 1,
    };
    api.createGame(request).subscribe();

    const req = http.expectOne('/api/games');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(sampleGame);
  });

  it('puts the payload to the game URL when updating', () => {
    api.updateGame(1, {} as SaveGameRequest).subscribe();

    const req = http.expectOne('/api/games/1');
    expect(req.request.method).toBe('PUT');
    req.flush(sampleGame);
  });

  it('issues a delete request for the game', () => {
    api.deleteGame(1).subscribe();

    const req = http.expectOne('/api/games/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

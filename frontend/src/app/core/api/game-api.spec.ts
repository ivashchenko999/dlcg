import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GameApi } from './game-api';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(GameApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests all games without a search parameter', () => {
    let result: Game[] | undefined;
    api.getGames().subscribe((games) => (result = games));

    const req = http.expectOne('/api/games');
    expect(req.request.method).toBe('GET');
    req.flush([sampleGame]);

    expect(result).toEqual([sampleGame]);
  });

  it('passes a trimmed search term as a query parameter', () => {
    api.getGames('  witcher  ').subscribe();

    const req = http.expectOne('/api/games?search=witcher');
    expect(req.request.params.get('search')).toBe('witcher');
    req.flush([]);
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

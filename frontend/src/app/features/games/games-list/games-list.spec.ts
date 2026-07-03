import { FormControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { GameApi } from '@core/api/game-api';

import { GamesList } from './games-list';

describe('GamesList URL state', () => {
  const api = {
    getGames: vi.fn(() =>
      of({
        items: [
          {
            id: 1,
            title: 'Halo',
            developer: 'Bungie',
            releaseDate: '2001-11-15',
            price: 59.99,
            genreId: 1,
            genreName: 'Action',
          },
        ],
        totalCount: 11,
        page: 1,
        pageSize: 10,
      }),
    ),
    getGenres: vi.fn(() => of([{ id: 1, name: 'Action' }])),
  };

  beforeEach(() => {
    api.getGames.mockClear();
    api.getGenres.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'games', component: GamesList }]),
        { provide: GameApi, useValue: api },
      ],
    });
  });

  it('restores search, genre and page from a shareable URL', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/games?q=Halo&genre=Action&page=2', GamesList);
    const state = component as unknown as {
      search: FormControl<string>;
      query(): { genre: string; page: number; sort: string; order: string };
    };

    expect(state.search.value).toBe('Halo');
    expect(state.query().genre).toBe('Action');
    expect(state.query().page).toBe(2);
    expect(api.getGames).toHaveBeenCalledWith({
      search: 'Halo',
      genre: 'Action',
      sort: 'title',
      order: 'asc',
      page: 2,
      pageSize: 10,
    });
  });

  it('writes filters and pagination to query parameters', async () => {
    const harness = await RouterTestingHarness.create('/games');
    const component = harness.routeDebugElement!.componentInstance as {
      filterByGenre(genre: string): Promise<boolean>;
      changePage(page: number): Promise<boolean>;
    };
    const router = TestBed.inject(Router);

    await component.filterByGenre('Action');
    await component.changePage(2);

    expect(router.url).toBe('/games?genre=Action&page=2');

    await component.filterByGenre('');

    expect(router.url).toBe('/games');
  });

  it('stores sorting in the URL and toggles its direction', async () => {
    const harness = await RouterTestingHarness.create('/games');
    const component = harness.routeDebugElement!.componentInstance as {
      sortBy(field: 'price'): Promise<boolean>;
    };
    const router = TestBed.inject(Router);

    await component.sortBy('price');
    expect(router.url).toBe('/games?sort=price');

    await component.sortBy('price');
    expect(router.url).toBe('/games?sort=price&order=desc');
  });

  it('redirects an empty out-of-range page to the last available page', async () => {
    api.getGames.mockImplementationOnce(() =>
      of({ items: [], totalCount: 7, page: 99, pageSize: 10 }),
    );
    const harness = await RouterTestingHarness.create('/games?page=99');
    const router = TestBed.inject(Router);

    await vi.waitFor(() => expect(router.url).toBe('/games'));

    expect(api.getGames).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));
    harness.detectChanges();
  });

  it('exposes genre loading errors and allows retrying', async () => {
    api.getGenres.mockImplementationOnce(() => throwError(() => new Error('Unavailable')));
    const harness = await RouterTestingHarness.create('/games');
    const component = harness.routeDebugElement!.componentInstance as {
      genres(): string[];
      genresError(): string | null;
      loadGenres(): void;
    };

    expect(component.genresError()).toBe('Genres are unavailable.');

    component.loadGenres();

    expect(component.genres()).toEqual(['Action']);
    expect(component.genresError()).toBeNull();
  });
});

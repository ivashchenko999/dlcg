import type { FormControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { GameApi } from '@core/api/game-api';

import { GamesList } from './games-list';

function routeComponent(harness: RouterTestingHarness): unknown {
  const route = harness.routeDebugElement;
  if (route === null) {
    throw new Error('Routed component was not rendered.');
  }
  return route.componentInstance as unknown;
}

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
    const component = routeComponent(harness) as {
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
    const component = routeComponent(harness) as {
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

    await vi.waitFor(() => {
      expect(router.url).toBe('/games');
    });

    expect(api.getGames).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));
    harness.detectChanges();
  });

  it('keeps the page when a search input event does not change the text', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/games?page=2', GamesList);
    const state = component as unknown as { search: FormControl<string> };
    const router = TestBed.inject(Router);

    // Simulates a clear-button click or autofill event with unchanged text.
    state.search.setValue('');
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(router.url).toBe('/games?page=2');
  });

  it('keeps catalogue state in the row edit links', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/games?page=2', GamesList);
    harness.detectChanges();

    const editLink = harness.routeNativeElement?.querySelector('a[aria-label="Edit Halo"]');
    expect(editLink?.getAttribute('href')).toBe('/games/1/edit?page=2');
  });

  it('collapses long page lists with ellipses', async () => {
    api.getGames.mockImplementationOnce(() =>
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
        totalCount: 1000,
        page: 50,
        pageSize: 10,
      }),
    );
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/games?page=50', GamesList);
    harness.detectChanges();

    const items = Array.from(
      harness.routeNativeElement?.querySelectorAll('ngb-pagination li') ?? [],
    );
    // ‹ 1 … three-page window … 100 › — instead of one button per page.
    expect(items.length).toBeLessThanOrEqual(9);
    expect(items.some((item) => item.textContent.includes('...'))).toBe(true);
  });

  it('exposes genre loading errors and allows retrying', async () => {
    api.getGenres.mockImplementationOnce(() => throwError(() => new Error('Unavailable')));
    const harness = await RouterTestingHarness.create('/games');
    const component = routeComponent(harness) as {
      genres(): string[];
      genresError(): string | null;
      loadGenres(): void;
    };

    expect(component.genresError()).toBe('Genres are unavailable.');

    component.loadGenres();

    expect(component.genres()).toEqual(['Action']);
    expect(component.genresError()).toBeNull();
  });

  it('uses a neutral add action when filters have no matches', async () => {
    api.getGames.mockImplementationOnce(() =>
      of({ items: [], totalCount: 0, page: 1, pageSize: 10 }),
    );
    const harness = await RouterTestingHarness.create('/games?q=missing');
    harness.detectChanges();

    const addLink = harness.routeNativeElement?.querySelector('a[href="/games/new"]');
    expect(addLink?.textContent).toContain('Add game');
    expect(addLink?.textContent).not.toContain('first');
  });
});

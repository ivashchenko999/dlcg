import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';

import { GameApi } from '@core/api/game-api';
import { ToastService } from '@core/services/toast.service';
import { ConfirmModal } from '@shared/components/confirm-modal/confirm-modal';
import { ErrorAlert } from '@shared/components/error-alert/error-alert';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@shared/constants/app.constants';
import { GameQuery, GameSortField, SortDirection } from '@shared/models/game-query.model';
import { Game } from '@shared/models/game.model';

const DEFAULT_QUERY: GameQuery = {
  search: '',
  genre: '',
  sort: 'title',
  order: 'asc',
  page: 1,
  pageSize: PAGE_SIZE,
};

const SORT_FIELDS: readonly GameSortField[] = [
  'title',
  'genre',
  'developer',
  'releaseDate',
  'price',
];

@Component({
  selector: 'app-games-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    NgbPagination,
    NgbTooltip,
    ErrorAlert,
    LoadingSpinner,
  ],
  templateUrl: './games-list.html',
})
export class GamesList {
  private readonly api = inject(GameApi);
  private readonly modalService = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);
  private readonly queryRequests = new Subject<GameQuery>();

  protected readonly games = signal<Game[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal<GameQuery>(DEFAULT_QUERY);

  protected readonly search = new FormControl('', { nonNullable: true });

  protected readonly genres = signal<string[]>([]);
  protected readonly genresLoading = signal(true);
  protected readonly genresError = signal<string | null>(null);
  protected readonly pageSize = PAGE_SIZE;

  constructor() {
    this.queryRequests
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((query) =>
          this.api.getGames(query).pipe(
            catchError(() => {
              this.error.set('Failed to load games. Is the backend running?');
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        const lastPage = Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE));
        if (this.query().page > lastPage) {
          void this.changePage(lastPage);
          return;
        }

        this.games.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      });

    this.loadGenres();

    this.search.valueChanges
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((search) => {
        void this.updateQueryParams({ q: search.trim() || null, page: null }, true);
      });

    this.route.queryParamMap
      .pipe(
        map((params) => ({
          search: params.get('q')?.trim() ?? '',
          genre: params.get('genre')?.trim() ?? '',
          sort: this.parseSortField(params.get('sort')),
          order: this.parseSortDirection(params.get('order')),
          page: this.parsePage(params.get('page')),
          pageSize: PAGE_SIZE,
        })),
        takeUntilDestroyed(),
      )
      .subscribe((query) => {
        this.search.setValue(query.search, { emitEvent: false });
        this.query.set(query);
        this.load(query);
      });
  }

  protected load(query = this.query()): void {
    this.queryRequests.next(query);
  }

  protected loadGenres(): void {
    this.genresLoading.set(true);
    this.genresError.set(null);
    this.api
      .getGenres()
      .pipe(finalize(() => this.genresLoading.set(false)))
      .subscribe({
        next: (genres) => this.genres.set(genres.map((genre) => genre.name)),
        error: () => {
          this.genres.set([]);
          this.genresError.set('Genres are unavailable.');
        },
      });
  }

  protected filterByGenre(genre: string): Promise<boolean> {
    return this.updateQueryParams({ genre: genre || null, page: null });
  }

  protected changePage(page: number): Promise<boolean> {
    return this.updateQueryParams({ page: page > 1 ? page : null });
  }

  protected sortBy(field: GameSortField): Promise<boolean> {
    const current = this.query();
    const order: SortDirection = current.sort === field && current.order === 'asc' ? 'desc' : 'asc';

    return this.updateQueryParams({
      sort: field === DEFAULT_QUERY.sort ? null : field,
      order: order === DEFAULT_QUERY.order ? null : order,
      page: null,
    });
  }

  protected sortAria(field: GameSortField): 'ascending' | 'descending' | 'none' {
    if (this.query().sort !== field) {
      return 'none';
    }
    return this.query().order === 'asc' ? 'ascending' : 'descending';
  }

  protected sortIcon(field: GameSortField): string {
    if (this.query().sort !== field) {
      return 'bi bi-arrow-down-up ms-1 text-body-tertiary';
    }
    return this.query().order === 'asc' ? 'bi bi-sort-up ms-1' : 'bi bi-sort-down ms-1';
  }

  protected confirmDelete(game: Game): void {
    const modal = this.modalService.open(ConfirmModal);
    modal.componentInstance.title = 'Delete game';
    modal.componentInstance.message = `Are you sure you want to delete "${game.title}"? This cannot be undone.`;
    modal.componentInstance.confirmLabel = 'Delete';

    modal.result.then(
      () => this.delete(game),
      () => {}, // dismissed — nothing to do
    );
  }

  private delete(game: Game): void {
    this.api.deleteGame(game.id).subscribe({
      next: () => {
        this.toasts.success(`"${game.title}" was deleted.`);
        this.load();
      },
      error: () => this.toasts.error(`Failed to delete "${game.title}".`),
    });
  }

  private updateQueryParams(
    queryParams: {
      q?: string | null;
      genre?: string | null;
      sort?: GameSortField | null;
      order?: SortDirection | null;
      page?: number | null;
    },
    replaceUrl = false,
  ): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  private parsePage(value: string | null): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private parseSortField(value: string | null): GameSortField {
    return SORT_FIELDS.includes(value as GameSortField)
      ? (value as GameSortField)
      : DEFAULT_QUERY.sort;
  }

  private parseSortDirection(value: string | null): SortDirection {
    return value === 'desc' ? 'desc' : DEFAULT_QUERY.order;
  }
}

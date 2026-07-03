import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { GameApi } from '@core/api/game-api';
import { ToastService } from '@core/services/toast.service';
import { ConfirmModal } from '@shared/components/confirm-modal/confirm-modal';
import { ErrorAlert } from '@shared/components/error-alert/error-alert';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@shared/constants/app.constants';
import { Game } from '@shared/models/game.model';

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
  private readonly toasts = inject(ToastService);

  protected readonly games = signal<Game[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly search = new FormControl('', { nonNullable: true });

  /** Genre name to filter by; empty string means "all genres". */
  protected readonly genreFilter = signal('');
  protected readonly genres = computed(() =>
    [...new Set(this.games().map((g) => g.genreName))].sort(),
  );
  protected readonly filteredGames = computed(() => {
    const genre = this.genreFilter();
    return genre ? this.games().filter((g) => g.genreName === genre) : this.games();
  });

  protected readonly page = signal(1);
  protected readonly pageSize = PAGE_SIZE;
  protected readonly pagedGames = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredGames().slice(start, start + this.pageSize);
  });

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.load());
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getGames(this.search.value).subscribe({
      next: (games) => {
        this.games.set(games);
        this.page.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load games. Is the backend running?');
        this.loading.set(false);
      },
    });
  }

  protected filterByGenre(genre: string): void {
    this.genreFilter.set(genre);
    this.page.set(1);
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
}

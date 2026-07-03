import { Component, TemplateRef, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { GameApi } from '../core/game-api';
import { Game } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-games-list',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink, NgbPagination, NgbTooltip],
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
  protected readonly pageSize = 10;
  protected readonly pagedGames = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredGames().slice(start, start + this.pageSize);
  });

  /** Game the user is about to delete; shown in the confirmation modal. */
  protected pendingDelete: Game | null = null;

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
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

  protected confirmDelete(modal: TemplateRef<unknown>, game: Game): void {
    this.pendingDelete = game;
    this.modalService.open(modal).result.then(
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

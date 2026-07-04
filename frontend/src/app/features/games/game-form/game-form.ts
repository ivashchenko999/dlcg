import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbDateAdapter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { GameApi } from '@core/api/game-api';
import { ToastService } from '@core/services/toast.service';
import { ErrorAlert } from '@shared/components/error-alert/error-alert';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';
import type { Genre } from '@shared/models/genre.model';
import type { SaveGameRequest } from '@shared/models/game.model';
import { IsoStringDateAdapter } from '@shared/utils/iso-date-adapter';

@Component({
  selector: 'app-game-form',
  imports: [ReactiveFormsModule, RouterLink, NgbInputDatepicker, ErrorAlert, LoadingSpinner],
  providers: [{ provide: NgbDateAdapter, useClass: IsoStringDateAdapter }],
  templateUrl: './game-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameForm implements OnInit {
  private readonly api = inject(GameApi);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toasts = inject(ToastService);

  /** Route parameter, bound by the router (withComponentInputBinding). */
  readonly id = input<string>();

  protected readonly isEdit = computed(() => this.id() !== undefined);
  protected readonly genres = signal<Genre[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    developer: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    releaseDate: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    genreId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.api.getGenres().subscribe({
      next: (genres) => {
        this.genres.set(genres);
      },
      error: () => {
        this.error.set('Failed to load genres.');
      },
    });

    const id = this.gameId();
    if (id === null) {
      void this.router.navigateByUrl('/not-found', { replaceUrl: true });
    } else if (id !== undefined) {
      this.loading.set(true);
      this.api.getGame(id).subscribe({
        next: (game) => {
          this.form.patchValue(game);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            void this.router.navigateByUrl('/not-found', { replaceUrl: true });
            return;
          }
          this.error.set('Unable to load the requested game.');
          this.loading.set(false);
        },
      });
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.genreId === null) {
      return;
    }
    const request: SaveGameRequest = { ...value, genreId: value.genreId };

    this.saving.set(true);
    this.error.set(null);

    const id = this.gameId();
    if (id === null) {
      void this.router.navigateByUrl('/not-found', { replaceUrl: true });
      return;
    }
    const save$ =
      id === undefined ? this.api.createGame(request) : this.api.updateGame(id, request);
    save$.subscribe({
      next: (game) => {
        this.toasts.success(`"${game.title}" was ${id === undefined ? 'created' : 'updated'}.`);
        // Catalogue state (page, sort, filters) rides along in the query string,
        // so returning to the list restores the view the user came from.
        void this.router.navigate(['/games'], { queryParamsHandling: 'preserve' });
      },
      error: (error: unknown) => {
        console.error('Failed to save the game', error);
        if (error instanceof HttpErrorResponse && error.status === 404) {
          // The game was deleted while the form was open; retrying cannot succeed.
          void this.router.navigateByUrl('/not-found', { replaceUrl: true });
          return;
        }
        this.error.set('Failed to save the game. Please try again.');
        this.saving.set(false);
      },
    });
  }

  protected isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private gameId(): number | null | undefined {
    const raw = this.id();
    if (raw === undefined) {
      return undefined;
    }

    const id = Number(raw);
    return Number.isInteger(id) && id > 0 && id <= 2_147_483_647 ? id : null;
  }
}

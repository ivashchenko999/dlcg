import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbDateAdapter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { GameApi } from '../core/game-api';
import { IsoStringDateAdapter } from '../core/iso-date-adapter';
import { Genre, SaveGameRequest } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-game-form',
  imports: [ReactiveFormsModule, RouterLink, NgbInputDatepicker],
  providers: [{ provide: NgbDateAdapter, useClass: IsoStringDateAdapter }],
  templateUrl: './game-form.html',
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
    title: ['', [Validators.required, Validators.maxLength(200)]],
    developer: ['', [Validators.required, Validators.maxLength(200)]],
    releaseDate: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    genreId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.api.getGenres().subscribe({
      next: (genres) => this.genres.set(genres),
      error: () => this.error.set('Failed to load genres.'),
    });

    const id = this.gameId();
    if (id !== null) {
      this.loading.set(true);
      this.api.getGame(id).subscribe({
        next: (game) => {
          this.form.patchValue(game);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load the game. It may have been deleted.');
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
    const request: SaveGameRequest = { ...value, genreId: value.genreId! };

    this.saving.set(true);
    this.error.set(null);

    const id = this.gameId();
    const save$ = id === null ? this.api.createGame(request) : this.api.updateGame(id, request);
    save$.subscribe({
      next: (game) => {
        this.toasts.success(`"${game.title}" was ${id === null ? 'created' : 'updated'}.`);
        this.router.navigate(['/games']);
      },
      error: () => {
        this.error.set('Failed to save the game. Please try again.');
        this.saving.set(false);
      },
    });
  }

  protected isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private gameId(): number | null {
    const raw = this.id();
    return raw === undefined ? null : Number(raw);
  }
}

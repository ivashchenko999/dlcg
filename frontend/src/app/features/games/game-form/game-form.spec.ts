import type { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { GameApi } from '@core/api/game-api';
import type { Game } from '@shared/models/game.model';

import { GameForm } from './game-form';

@Component({ template: '' })
class ListStub {}

describe('GameForm', () => {
  const existingGame: Game = {
    id: 7,
    title: 'Hades',
    developer: 'Supergiant Games',
    releaseDate: '2020-09-17',
    price: 24.99,
    genreId: 1,
    genreName: 'Action',
  };

  const api = {
    getGenres: () => of([{ id: 1, name: 'Action' }]),
    getGame: vi.fn((): Observable<Game> => throwError(() => new Error('Not found'))),
    createGame: vi.fn((): Observable<Game> => of(existingGame)),
    updateGame: vi.fn((): Observable<Game> => of(existingGame)),
  };

  beforeEach(() => {
    api.getGame.mockClear();
    api.createGame.mockClear();
    api.updateGame.mockClear();
    TestBed.configureTestingModule({
      imports: [GameForm],
      providers: [
        provideRouter(
          [
            { path: 'games', component: ListStub },
            { path: 'games/:id/edit', component: GameForm },
            { path: 'not-found', component: ListStub },
          ],
          withComponentInputBinding(),
        ),
        { provide: GameApi, useValue: api },
      ],
    });
  });

  it('enables Save only when every required field is valid', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { form: FormGroup };
    const saveButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button[type="submit"]',
    );

    expect(saveButton).not.toBeNull();
    if (!(saveButton instanceof HTMLButtonElement)) {
      throw new Error('Save button was not rendered.');
    }

    expect(saveButton.disabled).toBe(true);

    component.form.setValue({
      title: 'Hades',
      developer: 'Supergiant Games',
      genreId: 1,
      releaseDate: '2020-09-17',
      price: 24.99,
    });
    fixture.detectChanges();

    expect(saveButton.disabled).toBe(false);
  });

  it('marks every field as required for users and assistive technology', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('All fields are required.');
    expect(element.querySelectorAll('input[required], select[required]')).toHaveLength(5);
  });

  it('treats whitespace-only title and developer as invalid', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { form: FormGroup };

    component.form.patchValue({ title: '   ', developer: '\t' });

    expect(component.form.controls['title'].invalid).toBe(true);
    expect(component.form.controls['developer'].invalid).toBe(true);
  });

  it('routes an invalid edit id to not-found without sending an API request', async () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.componentRef.setInput('id', 'not-a-real-id');
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(TestBed.inject(Router).url).toBe('/not-found');
    });
    expect(api.getGame).not.toHaveBeenCalled();
  });

  it.each(['0', '-1', '2147483648', 'NaN'])(
    'routes the out-of-range edit id %s to not-found',
    async (id) => {
      const fixture = TestBed.createComponent(GameForm);
      fixture.componentRef.setInput('id', id);
      fixture.detectChanges();

      await vi.waitFor(() => {
        expect(TestBed.inject(Router).url).toBe('/not-found');
      });
      expect(api.getGame).not.toHaveBeenCalled();
    },
  );

  it('routes a missing game response to not-found', async () => {
    api.getGame.mockImplementationOnce(() =>
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/games/404/edit', GameForm);

    await vi.waitFor(() => {
      expect(TestBed.inject(Router).url).toBe('/not-found');
    });
  });

  it('keeps non-404 load failures on the edit page', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.componentRef.setInput('id', '7');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Unable to load the requested game.',
    );
    expect(TestBed.inject(Router).url).not.toBe('/not-found');
  });

  it('returns to the catalogue page the user came from after saving', async () => {
    api.getGame.mockImplementationOnce(() => of(existingGame));
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/games/7/edit?page=2&sort=price', GameForm);
    harness.detectChanges();

    const backLink = harness.routeNativeElement?.querySelector('a');
    expect(backLink?.getAttribute('href')).toBe('/games?page=2&sort=price');

    (component as unknown as { save(): void }).save();

    await vi.waitFor(() => {
      expect(TestBed.inject(Router).url).toBe('/games?page=2&sort=price');
    });
  });

  it('creates a game through the POST branch and returns to the catalogue', async () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as {
      form: FormGroup;
      save(): void;
    };
    component.form.setValue({
      title: 'Hades',
      developer: 'Supergiant Games',
      genreId: 1,
      releaseDate: '2020-09-17',
      price: 24.99,
    });

    component.save();

    expect(api.createGame).toHaveBeenCalledWith({
      title: 'Hades',
      developer: 'Supergiant Games',
      genreId: 1,
      releaseDate: '2020-09-17',
      price: 24.99,
    });
    await vi.waitFor(() => {
      expect(TestBed.inject(Router).url).toBe('/games');
    });
  });

  it('unlocks the form and preserves its values after a save failure', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    api.updateGame.mockImplementationOnce(() => throwError(() => new Error('Unavailable')));
    const fixture = TestBed.createComponent(GameForm);
    fixture.componentRef.setInput('id', '7');
    api.getGame.mockImplementationOnce(() => of(existingGame));
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as {
      form: FormGroup;
      saving(): boolean;
      error(): string | null;
      save(): void;
    };

    component.save();

    expect(component.saving()).toBe(false);
    expect(component.error()).toBe('Failed to save the game. Please try again.');
    expect(component.form.controls['title'].value).toBe('Hades');
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('routes a save-time 404 to not-found', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    api.getGame.mockImplementationOnce(() => of(existingGame));
    api.updateGame.mockImplementationOnce(() =>
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/games/7/edit', GameForm);
    harness.detectChanges();

    (component as unknown as { save(): void }).save();

    await vi.waitFor(() => {
      expect(TestBed.inject(Router).url).toBe('/not-found');
    });
    consoleError.mockRestore();
  });
});

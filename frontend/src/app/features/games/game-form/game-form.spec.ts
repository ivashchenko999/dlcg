import type { FormGroup } from '@angular/forms';
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
    updateGame: vi.fn((): Observable<Game> => of(existingGame)),
  };

  beforeEach(() => {
    api.getGame.mockClear();
    api.updateGame.mockClear();
    TestBed.configureTestingModule({
      imports: [GameForm],
      providers: [
        provideRouter(
          [
            { path: 'games', component: ListStub },
            { path: 'games/:id/edit', component: GameForm },
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

  it('treats whitespace-only title and developer as invalid', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { form: FormGroup };

    component.form.patchValue({ title: '   ', developer: '\t' });

    expect(component.form.controls['title'].invalid).toBe(true);
    expect(component.form.controls['developer'].invalid).toBe(true);
  });

  it('shows a universal error when the edit URL does not resolve to a game', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.componentRef.setInput('id', 'not-a-real-id');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Unable to load the requested game.');
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
});

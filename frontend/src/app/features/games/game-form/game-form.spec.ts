import type { FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { GameApi } from '@core/api/game-api';

import { GameForm } from './game-form';

describe('GameForm', () => {
  const api = {
    getGenres: () => of([{ id: 1, name: 'Action' }]),
    getGame: vi.fn(() => throwError(() => new Error('Not found'))),
  };

  beforeEach(() => {
    api.getGame.mockClear();
    TestBed.configureTestingModule({
      imports: [GameForm],
      providers: [provideRouter([]), { provide: GameApi, useValue: api }],
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
});

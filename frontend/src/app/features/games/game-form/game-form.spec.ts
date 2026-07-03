import { FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { GameApi } from '@core/api/game-api';

import { GameForm } from './game-form';

describe('GameForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameForm],
      providers: [
        provideRouter([]),
        {
          provide: GameApi,
          useValue: { getGenres: () => of([{ id: 1, name: 'Action' }]) },
        },
      ],
    });
  });

  it('enables Save only when every required field is valid', () => {
    const fixture = TestBed.createComponent(GameForm);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { form: FormGroup };
    const saveButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

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
});

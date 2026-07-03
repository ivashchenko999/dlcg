import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastService } from '@core/services/toast.service';

import { ToastContainer } from './toast-container';

describe('ToastContainer', () => {
  let fixture: ComponentFixture<ToastContainer>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastContainer] }).compileComponents();

    fixture = TestBed.createComponent(ToastContainer);
    toastService = TestBed.inject(ToastService);
  });

  it('renders notifications supplied by ToastService', () => {
    toastService.success('Game saved.');
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('ngb-toast');
    expect(toast.textContent).toContain('Game saved.');
    expect(toast.classList).toContain('text-bg-success');
  });
});

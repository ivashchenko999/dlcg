import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  let fixture: ComponentFixture<ConfirmModal>;
  let activeModal: { close: ReturnType<typeof vi.fn>; dismiss: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    activeModal = { close: vi.fn(), dismiss: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
      providers: [{ provide: NgbActiveModal, useValue: activeModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
  });

  it('renders configured content', () => {
    const component = fixture.componentInstance;
    component.title = 'Delete game';
    component.message = 'This cannot be undone.';
    component.confirmLabel = 'Delete';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Delete game');
    expect(fixture.nativeElement.textContent).toContain('This cannot be undone.');
    expect(fixture.nativeElement.textContent).toContain('Delete');
  });

  it('closes on confirmation and dismisses on cancellation', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[2].click();
    buttons[1].click();

    expect(activeModal.close).toHaveBeenCalledOnce();
    expect(activeModal.dismiss).toHaveBeenCalledOnce();
  });
});

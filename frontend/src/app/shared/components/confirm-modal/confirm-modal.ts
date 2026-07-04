import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Reusable confirmation dialog. Open it through NgbModal and configure via
 * the component instance; the modal closes on confirm and dismisses on cancel:
 *
 *   const modal = modalService.open(ConfirmModal);
 *   modal.componentInstance.message = '…';
 *   modal.result.then(onConfirm, () => {});
 */
@Component({
  selector: 'app-confirm-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-header">
      <h5 class="modal-title"><i class="bi bi-exclamation-circle me-2"></i>{{ title }}</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">{{ message }}</div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        Cancel
      </button>
      <button type="button" class="btn" [class]="confirmClass" (click)="activeModal.close()">
        {{ confirmLabel }}
      </button>
    </div>
  `,
})
export class ConfirmModal {
  protected readonly activeModal = inject(NgbActiveModal);

  title = 'Please confirm';
  message = 'Are you sure?';
  confirmLabel = 'Confirm';
  confirmClass = 'btn-danger';
}

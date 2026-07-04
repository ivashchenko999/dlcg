import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from '@core/services/toast.service';
import { TOAST_DELAY_MS } from '@shared/constants/app.constants';

/** Renders app-wide toast notifications in the bottom-right corner. */
@Component({
  selector: 'app-toast-container',
  imports: [NgbToast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      @for (toast of toastService.toasts(); track toast) {
        <ngb-toast
          [class]="toast.classname"
          [autohide]="true"
          [delay]="delay"
          (hidden)="toastService.remove(toast)"
        >
          {{ toast.message }}
        </ngb-toast>
      }
    </div>
  `,
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
  protected readonly delay = TOAST_DELAY_MS;
}

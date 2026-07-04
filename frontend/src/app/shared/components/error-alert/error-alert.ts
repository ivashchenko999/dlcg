import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Bootstrap danger alert; renders nothing while the message is empty. */
@Component({
  selector: 'app-error-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <div class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ message() }}
      </div>
    }
  `,
})
export class ErrorAlert {
  readonly message = input<string | null>(null);
}

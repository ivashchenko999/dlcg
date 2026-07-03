import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  classname: string;
}

/** Collects app-wide notifications rendered by the toast container in the shell. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.show(message, 'text-bg-success');
  }

  error(message: string): void {
    this.show(message, 'text-bg-danger');
  }

  remove(toast: Toast): void {
    this.toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  private show(message: string, classname: string): void {
    this.toasts.update((toasts) => [...toasts, { message, classname }]);
  }
}

import { Component } from '@angular/core';

/** Centered Bootstrap spinner shown while a page is loading data. */
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>
  `,
})
export class LoadingSpinner {}

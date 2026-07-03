import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="text-center py-5" aria-labelledby="not-found-title">
      <div class="display-1 fw-bold text-primary" aria-hidden="true">404</div>
      <h1 id="not-found-title" class="h2 mt-2">Page not found</h1>
      <p class="text-body-secondary mx-auto mt-3 mb-4 not-found-message">
        The page you are looking for may have been moved, deleted, or never existed.
      </p>
      <a routerLink="/games" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2" aria-hidden="true"></i>Back to catalogue
      </a>
    </section>
  `,
  styles: `
    .not-found-message {
      max-width: 32rem;
    }
  `,
})
export class NotFound {}

import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from './core/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgbToast],
  templateUrl: './app.html',
})
export class App {
  protected readonly toastService = inject(ToastService);
}

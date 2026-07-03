import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ToastContainer } from '@shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastContainer],
  templateUrl: './app.html',
})
export class App {}

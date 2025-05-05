import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../auth/data-access/auth.store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dev-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isDev" class="debug-panel">
      <pre>User: {{ user$$() | json }}</pre>
      <pre>Token: {{ token$$() }}</pre>
    </div>
  `,
  styles: [`
    .debug-panel {
      position: fixed;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      color: #fff;
      font-size: 12px;
      padding: 10px;
      max-width: 300px;
      z-index: 1000;
    }
  `]
})
export class DevDebugComponent {
  private readonly authStore = inject(AuthStore);
  user$$ = this.authStore.user$$;
  token$$ = this.authStore.token$$;

  isDev = !environment.production;
}

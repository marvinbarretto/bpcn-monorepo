import { Component, computed, inject, effect } from '@angular/core';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';

@Component({
    selector: 'app-user-info',
    imports: [CommonModule, RouterModule, FeatureFlagPipe],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  private readonly auth = inject(AuthStore);

  readonly ready = this.auth.ready$$;
  readonly user = this.auth.user$$;
  readonly token = this.auth.token$$;

  readonly isLoggedIn = computed(() =>
    this.ready() && !!this.token() && !!this.user()
  );

  readonly username = computed(() => this.user()?.username ?? 'Unknown');
  readonly role = computed(() => this.user()?.role?.name ?? 'No role');

  logout() {
    this.auth.logout();
  }

  // Optional debug effect
  constructor() {
    effect(() => {
      console.log('[UserInfo] ready:', this.ready(), 'isLoggedIn:', this.isLoggedIn());
    });
  }
}
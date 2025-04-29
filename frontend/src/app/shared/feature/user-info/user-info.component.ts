import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Roles } from '../../../auth/utils/roles.enum';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';
import { BackendHealthService } from '../../data-access/backend-health.service';

@Component({
    selector: 'app-user-info',
    imports: [CommonModule, RouterModule, FeatureFlagPipe],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  public Roles = Roles;
  backendService = inject(BackendHealthService);

  constructor(public authStore: AuthStore) {}

  get isBackendAvailable(): boolean {
    return this.backendService.isStrapiAvailable$$();
  }

  get isLoggedIn(): boolean {
    return !!this.authStore.token$$();
  }

  get username(): string | null {
    return this.authStore.user$$()?.username || null;
  }

  get role(): string | null {
    return this.authStore.user$$()?.role?.name || 'No Role';
  }


  // Console out the contents of authStore
  ngOnInit() {
    console.log('Logged in User signal', this.authStore.user$$());

  }
}

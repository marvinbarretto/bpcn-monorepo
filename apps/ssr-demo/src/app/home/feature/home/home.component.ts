import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { FeatureFlagPipe } from '../../../shared/utils/feature-flag.pipe';

@Component({
    selector: 'app-home',
    imports: [RouterModule, CommonModule, FeatureFlagPipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  authStore = inject(AuthStore);
}

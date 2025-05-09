import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { FeatureFlagPipe } from '../../../shared/utils/feature-flag.pipe';
import { NextEventWidgetComponent } from '../next-event-widget/next-event-widget.component';
import { RecentNewsWidgetComponent } from '../recent-news-widget/recent-news-widget.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    CommonModule,
    FeatureFlagPipe,
    NextEventWidgetComponent,
    RecentNewsWidgetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStore = inject(AuthStore);
}

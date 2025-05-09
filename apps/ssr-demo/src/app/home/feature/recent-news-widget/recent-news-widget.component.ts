import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../news/data-access/news.service';
import { NewsSnippet } from '../../../news/utils/news/news.model';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/data-access/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recent-news-widget',
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-news-widget.component.html',
  styleUrl: './recent-news-widget.component.scss',
})
export class RecentNewsWidgetComponent {
  private readonly newsService = inject(NewsService);
  private readonly notificationService = inject(NotificationService);

  readonly news$$ = signal<NewsSnippet[]>([]);
  readonly loaded$$ = computed(() => this.news$$().length > 0);
  readonly recentNews = computed(() => {
    return this.news$$()
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 3);
  });
  
  constructor() {
    this.newsService.getNews()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (news) => {
          this.news$$.set(news);
        },
        error: (err) => {
          // TODO: Replace with ToastService
          // this.notificationService.error(err);
        }
      });
  }
}

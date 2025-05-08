import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../news/data-access/news.service';
import { NewsSnippet } from '../../../news/utils/news/news.model';
import { RelativeDatePipe } from "../../../shared/utils/pipes/relative-date.pipe";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-news-widget',
  imports: [CommonModule, RelativeDatePipe, RouterModule],
  templateUrl: './recent-news-widget.component.html',
  styleUrl: './recent-news-widget.component.scss',
})
export class RecentNewsWidgetComponent {
  private readonly newsService = inject(NewsService);

  readonly news$$ = signal<NewsSnippet[]>([]);
  readonly loaded$$ = computed(() => this.news$$().length > 0);
  readonly recentNews = computed(() => {
    return this.news$$()
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 3);
  });
  
  constructor() {
    this.newsService.getNews().subscribe(news => this.news$$.set(news));
  }

  
}

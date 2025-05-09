import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSnippet } from '../../utils/news/news.model';
import { NewsService } from '../../data-access/news.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaginationService } from '../../../shared/data-access/pagination.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination.component';
@Component({
  selector: 'app-news-list',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent {
  news: NewsSnippet[] = [];
  paginatedNews: NewsSnippet[] = [];
  errorMessage: string | null = null;
  isLoading = true;

  // TODO: Fix this to use the new PaginationService
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  sortDescending = true;

  constructor(
    private newsService: NewsService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    this.newsService
      .getNews()
      .pipe(
        catchError((error) => {
          console.error('Error fetching news', error);
          this.errorMessage = 'Error fetching news';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe((news: NewsSnippet[]) => {
        this.news = news;
        this.isLoading = false;

        this.totalPages = this.paginationService.getTotalPages(
          this.news.length,
          this.pageSize
        );
        this.updatePaginatedNews();
      });
  }

  updatePaginatedNews() {
    this.paginatedNews = this.paginationService.paginate(
      this.news,
      this.currentPage,
      this.pageSize,
      this.sortDescending ? this.sortByDateDesc : undefined
    );
  }

  sortByDateDesc(a: NewsSnippet, b: NewsSnippet): number {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedNews();
  }

  getDate(dateString: string): Date {
    return new Date(dateString);
  }
}

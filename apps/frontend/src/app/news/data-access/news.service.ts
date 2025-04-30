import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewsSnippet } from '../utils/news/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNews(): Observable<NewsSnippet[]> {
    return this.http.get('http://localhost:3000/api/news', { responseType: 'text' }).pipe(
      map((rssData: string) => {
        return this.parseXML(rssData);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => 'Something went wrong; please try again later.');
  }

  // Parsing the XML response from Google News RSS
  private parseXML(rssData: string): any[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(rssData, 'text/xml');
    const items = xml.querySelectorAll('item');
    const parsedNews: any[] = [];

    items.forEach(item => {
      parsedNews.push({
        title: item.querySelector('title')?.textContent,
        link: item.querySelector('link')?.textContent,
        pubDate: item.querySelector('pubDate')?.textContent,
        description: item.querySelector('description')?.textContent,
      });
    });

    return parsedNews;
  }
}

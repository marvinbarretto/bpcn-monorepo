import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { XMLParser } from 'fast-xml-parser';
import { NewsSnippet } from '../utils/news/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsSnippet[]> {
    return this.http.get('/api/news', { responseType: 'text' }).pipe(
      map((rssData: string) => {
        try {
          if (isPlatformBrowser(this.platformId)) {
            console.log('[🧠 NewsService] Parsing RSS with DOMParser (Browser)');
            return this.parseXMLWithDOMParser(rssData);
          } else {
            console.log('[🧠 NewsService] Parsing RSS with fast-xml-parser (Node)');
            return this.parseXMLWithNodeParser(rssData);
          }
        } catch (err) {
          console.error('❌ Error during RSS parsing:', err);
          return [];
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ NewsService HTTP Error:', error.message);
        return throwError(() => new Error(`Failed to load news: ${error.message}`));
      })
    );
  }

  private parseXMLWithDOMParser(rssData: string): NewsSnippet[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(rssData, 'text/xml');
    const items = xml.querySelectorAll('item');
    const parsed: NewsSnippet[] = [];

    items.forEach(item => {
      parsed.push({
        title: item.querySelector('title')?.textContent ?? '',
        link: item.querySelector('link')?.textContent ?? '',
        pubDate: item.querySelector('pubDate')?.textContent ?? '',
        description: item.querySelector('description')?.textContent ?? '',
      });
    });

    console.log(`[✅ NewsService] Parsed ${parsed.length} items with DOMParser`);
    return parsed;
  }

  private parseXMLWithNodeParser(rssData: string): NewsSnippet[] {
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(rssData);
    const items = jsonObj.rss?.channel?.item ?? [];

    if (!Array.isArray(items)) {
      console.warn('[⚠️ NewsService] RSS feed returned no items or non-array');
      return [];
    }

    const parsed = items.map((item: any) => ({
      title: item.title ?? '',
      link: item.link ?? '',
      pubDate: item.pubDate ?? '',
      description: item.description ?? '',
    }));

    console.log(`[✅ NewsService] Parsed ${parsed.length} items with fast-xml-parser`);
    return parsed;
  }
}

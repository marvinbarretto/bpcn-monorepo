import { Injectable } from '@angular/core';
import { StrapiService } from '../../shared/data-access/strapi.service';
import { Page, PageResponse, PrimaryNavLink } from '../utils/page.model';
import { catchError, map, tap, Observable, of } from 'rxjs';
import { StrapiResponse, PageAttributes } from '../../shared/utils/strapi.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PageService extends StrapiService {

  // https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication#filtering
  getPageBySlug(slug: string): Observable<Page | null> {
    return this.get<PageResponse>(`pages?filters[slug][$eq]=${slug}&populate=parentPage`)
    .pipe(
      tap(response => {
        console.log('API Response for slug:', slug, response);
      }),
      map(response => {
        // Check if we have at least one page in the response
        return response.data.length > 0 ? response.data[0] : null;
      }),
      catchError(error => {
        console.error('Error fetching page by slug:', error);
        return of(null);  // Return null if there's an error
      })
    );
  }

  getPages(): Observable<Page[]> {
    return this.get<PageResponse>('pages?populate[parentPage]=*').pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }



  

  getPrimaryNavPageLinks(): Observable<PrimaryNavLink[]> {
    const params = new HttpParams()
    .set('filters[primaryNavigation][$eq]', 'true')
    .set('fields[0]', 'title')
    .set('fields[1]', 'slug');
    
    return this.get<StrapiResponse<PageAttributes>>('pages', { params }).pipe(
      tap(res => console.log('[Strapi] Got response with', res.data.length, 'items')),
      map(res =>
        res.data.map(item => ({
          id: item.id,
          documentId: item.id.toString(),
          title: item.attributes.title,
          slug: item.attributes.slug,
        }))
      )
    );
  }
}




  // NOTE: Use this syntax later for specific queries
  // getSiteMap() {
  //   return this.get<PageResponse>(
  //     `pages?fields[0]=id&fields[1]=title&fields[2]=slug
  //     &populate[parentPage][fields][0]=id
  //     &populate[parentPage][fields][1]=title
  //     &populate[parentPage][fields][2]=slug`
  //   );
  // }
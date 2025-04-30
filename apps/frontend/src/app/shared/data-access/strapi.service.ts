import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError,  map,  Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private http = inject(HttpClient);
  private baseUrl = environment.strapiUrl;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  getStrapiUrl() {
    return environment.strapiUrl;
  }

  getStrapiToken() {
    return environment.strapiToken;
  }

  private getAuthToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // TODO: Replace with interceptor, make use of HttpClient
  protected getGetHeaders(): HttpHeaders {
    const token = this.getAuthToken() || this.getStrapiToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }

  protected getPostHeaders(): HttpHeaders {
    const token = this.getAuthToken() || this.getStrapiToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    })
  }

  get<T>(endpoint: string): Observable<T> {
    const headers = this.getGetHeaders();
    return this.http.get<T>(`${this.baseUrl}/api/${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getPostHeaders();
    return this.http.post<T>(`${this.baseUrl}/api/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if ( error.error instanceof ErrorEvent ) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.statusText}`;

      // Indlude strapi specific error messages
      if (error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }

    console.error('StrapiService error:', errorMessage, error);

    return throwError(() => new Error('StrapiService error'));
  }

  ping(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/api/users-permissions/roles`).pipe(
      map(() => true),
      catchError( () => of(false) )
    );
  }
}

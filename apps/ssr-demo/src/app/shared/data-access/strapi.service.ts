import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  protected http = inject(HttpClient);

  private readonly baseUrl = environment.strapiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/api/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/api/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.statusText}`;

      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }

    console.error('StrapiService error:', errorMessage, error);

    return throwError(() => new Error(errorMessage));
  }

  ping(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/api/users-permissions/roles`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}

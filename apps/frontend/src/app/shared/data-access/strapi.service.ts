import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StrapiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.strapiUrl;

  protected get<T>(
    endpoint: string,
    options?: { params?: any; headers?: any }
  ): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/api/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  protected post<T>(
    endpoint: string,
    body: any,
    options?: { params?: any; headers?: any }
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/api/${endpoint}`, body, options)
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

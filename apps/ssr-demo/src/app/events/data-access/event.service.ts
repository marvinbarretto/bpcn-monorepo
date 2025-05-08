import { Injectable } from '@angular/core';
import { StrapiService } from '../../shared/data-access/strapi.service';
import { Observable, map, catchError, of } from 'rxjs';
import { EventModel, StrapiEvent, StrapiEventsResponse } from '../utils/event.model';
import { HttpParams } from '@angular/common/http';
import { normaliseEvent } from '../utils/event.normaliser';

@Injectable({
  providedIn: 'root'
})
export class EventService extends StrapiService {
  getEventBySlug(slug: string): Observable<EventModel | null> {
    const params = new HttpParams()
      .set('filters[slug][$eq]', slug)
      .set('populate', '*');

    return this.get<StrapiEventsResponse>('events', { params }).pipe(
      map(res => res.data[0] ?? null),
      map(raw => raw ? normaliseEvent(raw) : null),
      catchError(error => {
        console.error('Error fetching event:', error);
        return of(null);
      })
    );
  }

  getEvents(): Observable<EventModel[]> {
    return this.get<StrapiEventsResponse>('events?populate=*').pipe(
      map(res => res.data.map(normaliseEvent)),
      catchError(error => {
        console.error('Error fetching events:', error);
        return of([]);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { StrapiService } from '../../shared/data-access/strapi.service';
import { Observable, map, catchError, of } from 'rxjs';
import {
  EventModel,
  StrapiEvent,
  StrapiEventsResponse,
} from '../utils/event.model';
import { HttpParams } from '@angular/common/http';
import { normaliseEvent } from '../utils/event.normaliser';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService extends StrapiService {
  async getEventBySlug(slug: string): Promise<EventModel | null> {
    console.log('[EventService] Fetching event for slug:', slug);

    const params = new HttpParams()
      .set('filters[slug][$eq]', slug)
      .set('populate', '*');

    try {
      // Uses firstValueFrom() to unwrap the observable as a Promise
      const res = await firstValueFrom(
        this.get<StrapiEventsResponse>('events', { params })
      );
      const raw = res.data[0] ?? null;
      return raw ? normaliseEvent(raw) : null;
    } catch (error) {
      console.error('[EventService] Failed to fetch event:', error);
      return null;
    }
  }

  getEvents(): Observable<EventModel[]> {
    return this.get<StrapiEventsResponse>('events?populate=*').pipe(
      map((res) => res.data.map(normaliseEvent)),
      catchError((error) => {
        console.error('Error fetching events:', error);
        return of([]);
      })
    );
  }
}

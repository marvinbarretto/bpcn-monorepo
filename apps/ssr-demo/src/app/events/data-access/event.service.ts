import { Injectable } from '@angular/core';
import { StrapiService } from '../../shared/data-access/strapi.service';
import { Observable, map, catchError } from 'rxjs';
import { IEvent, IEventsResponse, IEventsRequest } from '../utils/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService extends StrapiService {

  /**
   * Fetch all events from the server without filtering
   */
  getAllEvents(): Observable<IEvent[]> {
    return this.get<IEventsResponse>('events')
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * @deprecated Use getAllEvents() instead
   */
  getEvents(): Observable<IEvent[]> {
    // TODO: REthink strategy, i think probably we should
    // just use the getEvent() method to get everything instead of populating with all here...
    return this.get<IEventsResponse>('events')
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }


  /**
   * Fetch only upcoming events from the server
   */
  getUpcomingEvents(): Observable<IEvent[]> {
    const now = new Date().toISOString();
    const url = `events?filters[date][$gt]=${now}&sort=date:asc`;
    return this.get<IEventsResponse>(url)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getEvent(documentId: string): Observable<IEvent> {
    return this.get<{ data: IEvent }>(`events/${documentId}?populate=*`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }



  createEvent(event: IEvent): Observable<IEvent> {
    const payload: IEventsRequest = { data: event };

    return this.post<{ data: IEvent }>('events', payload)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
}

import { Injectable, signal } from "@angular/core";
import { of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { IEvent } from "../utils/event.model";
import { EventService } from "./event.service";

@Injectable({
  providedIn: 'root'
})
export class EventStore {
  currentEvent$$ = signal<IEvent | null>(null);
  events$$ = signal<IEvent[]>([]);
  loading$$ = signal<boolean>(false);
  error$$ = signal<string | null>(null);

  constructor(private eventService: EventService) {}

  loadEvents() {
    console.log('Loading events from server...');
    this.loading$$.set(true);
    this.error$$.set(null);

    this.eventService.getEvents().pipe(
      tap((events: IEvent[]) => {
        console.log('Events loaded from server:', events);
        this.events$$.set(events);
        this.loading$$.set(false);
      }),
      catchError((error) => {
        console.log('Error loading events:', error);
        this.error$$.set(`Failed to load events. ${error.message}`);
        this.loading$$.set(false);
        return of([]);
      })
    ).subscribe();
  }


  loadUpcomingEvents() {
    console.log('Loading upcoming events from server...');
    this.loading$$.set(true);
    this.error$$.set(null);

    this.eventService.getUpcomingEvents().pipe(
      tap((events: IEvent[]) => {
        console.log('Upcoming events loaded from server:', events);
        this.events$$.set(events);
        this.loading$$.set(false);
      }),
      catchError((error) => {
        console.log('Error loading upcoming events:', error);
        this.error$$.set(`Failed to load upcoming events. ${error.message}`);
        this.loading$$.set(false);
        return of([]);
      })
    ).subscribe();
  }

  createEvent(newEvent: IEvent) {
    console.log('Creating a new event...');
    this.loading$$.set(true);
    this.error$$.set(null);

    this.eventService.createEvent(newEvent).pipe(
      tap((createdEvent: IEvent) => {
        console.log('Event created:', createdEvent);

        // Add the new event to the events list
        this.events$$.set([...this.events$$(), createdEvent]);

        // Log the contents of events$$ to observe the new state
        console.log('Updated events list:', this.events$$());

        // Set the newly created event as the current event
        this.currentEvent$$.set(createdEvent);

        // Set loading to false after the event is created
        this.loading$$.set(false);
      }),
      catchError((error) => {
        console.error('Error creating event:', error);
        this.error$$.set('Failed to create the event.');
        this.loading$$.set(false);
        return of(null);
      })
    ).subscribe();
  }



  /**
   * Select an event by slug, if not found in store, fetch from service by documentId
   * @param slug
   */
  selectEventBySlug(slug: string) {
    console.log(`Checking if event with slug "${slug}" exists in store...`);
    const event = this.events$$().find(e => e.slug === slug);

    if (event) {
      console.log(`Event found in store for slug "${slug}":`, event);

      // Check if the event is incomplete (e.g., missing `hero`, `content`, etc.)
      if (!event.hero || !event.content) {
        console.log(`Event with slug "${slug}" is incomplete. Fetching full details...`);
        this.fetchEventByDocumentId(event.documentId!);
      } else {
        console.log(`Event with slug "${slug}" is complete. Setting as current event.`);
        this.currentEvent$$.set(event); // Use the existing event if it's complete
      }
    } else {
      console.log(`Event not found in store for slug "${slug}". Fetching from server...`);
      this.fetchEventBySlug(slug); // Fetch from server if not in the store
    }
  }


  // Fetch event from the service based on the slug (assumes you need the documentId)
  private fetchEventBySlug(slug: string) {
    console.log(`Fetching event list from server to find documentId for slug "${slug}"...`);

    this.loading$$.set(true);

    // FIXME: We should aim to call getEvent() singular
    this.eventService.getAllEvents().pipe(
      tap((events: IEvent[]) => {
        // Find the event with the matching slug to get the documentId
        const event = events.find(event => event.slug === slug);
        if (event && event.documentId) {
          console.log(`Event found on server for slug "${slug}". Fetching full details using documentId "${event.documentId}"...`);

          // If the event is found, fetch it by documentId
          this.fetchEventByDocumentId(event.documentId);
        } else {
          console.log(`Event with slug "${slug}" not found on server.`);

          this.error$$.set('Event not found');
          this.loading$$.set(false);
        }
      }),
      catchError((error) => {
        console.log('Error loading event list:', error);

        this.error$$.set(`Failed to load event. ${error}`);
        this.loading$$.set(false);
        return of([]);
      }),
      finalize(() => {
        this.loading$$.set(false);
      })
    ).subscribe();
  }


  // Fetch event by documentId
  private fetchEventByDocumentId(documentId: string) {
    console.log(`Fetching full event details from server using documentId "${documentId}"...`);

    this.eventService.getEvent(documentId).pipe(
      tap(fullEvent => {
        console.log(`Full event details loaded from server for documentId "${documentId}":`, fullEvent);

        // Update the event in the store
        const updatedEvents = this.events$$().map(event =>
          event.documentId === documentId ? { ...event, ...fullEvent } : event
        );
        this.events$$.set(updatedEvents);

        // Set the current event
        this.currentEvent$$.set(fullEvent);
      }),
      catchError(error => {
        console.error('Error loading full event details:', error);
        this.error$$.set('Failed to load event details.');
        return of(null);
      })
    ).subscribe();
  }

  clearCurrentEvent() {
    console.log('Clearing current event...');

    this.currentEvent$$.set(null);
  }
}

import { Injectable, signal, inject } from "@angular/core";
import { of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { EventModel } from "../utils/event.model";
import { EventService } from "./event.service";

@Injectable({ providedIn: 'root' })
export class EventStore {
  private readonly eventService = inject(EventService);

  private readonly currentSlug = signal<string | null>(null);
  private readonly event = signal<EventModel | null>(null);

  readonly event$ = this.event.asReadonly();

  /**
   * Called by routed component or resolver
   */
  loadEvent(slug: string): void {
    if (this.currentSlug() === slug && this.event()) return;

    this.currentSlug.set(slug);
    this.eventService.getEventBySlug(slug).subscribe(data => {
      this.event.set(data);
    });
  }
}
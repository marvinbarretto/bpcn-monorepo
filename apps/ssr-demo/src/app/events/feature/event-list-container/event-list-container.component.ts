/**
 * EventListContainer
 * 
 * Responsibilities:
    Fetch all events via EventService

    Filter events by role:

    Normal users see only APPROVED events

    Admins see all events and are prompted if any are PENDING

    Highlight the next upcoming event

    Display all events via <event-list [events]>

    Each item rendered with <event-card [event]>

    Provide links to:

    Create a new event (if allowed)

    Review pending events (if allowed and any pending exist)

    Add utilities:

    daysToGo pipe

    isUpcoming pipe

    TODOs:

    Implement pagination and event caching

    Add sorting helpers if needed

 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { EventStore } from '../../data-access/event.store';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { EventModel, EventStatus } from '../../utils/event.model';
import { EventListComponent } from '../../ui/event-list/event-list.component';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../data-access/event.service';
import { EventListItemComponent } from '../../ui/event-list-item/event-list-item.component';
import { PaginationService } from '../../../shared/data-access/pagination.service';
import { PaginationComponent } from "../../../shared/ui/pagination/pagination.component";

@Component({
    selector: 'app-event-list-container',
    imports: [CommonModule, RouterModule, EventListItemComponent, PaginationComponent],
    templateUrl: './event-list-container.component.html',
    styleUrl: './event-list-container.component.scss'
})
export class EventListContainerComponent implements OnInit {
  authStore = inject(AuthStore);
  eventService = inject(EventService);
  paginationService = inject(PaginationService);

  allEvents: EventModel[] = [];
  paginatedEvents: EventModel[] = [];

  pageSize = 1;
  currentPage = signal(1);
  totalPages = signal(1);
  nextEvent: EventModel | null = null;
  error = signal<string | null>(null);

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.allEvents = this.filterByRole(events);
        this.totalPages.set(this.paginationService.getTotalPages(this.allEvents.length, this.pageSize));
        this.updatePaginatedEvents();
        this.nextEvent = this.findNextEvent(this.allEvents);
      },
      error: () => {
        this.error.set('Unable to load events. Please try again later.');
      }
    });
  }

  private filterByRole(events: EventModel[]): EventModel[] {
    return this.authStore.isAdmin()
      ? events
      : events.filter(e => e.eventStatus === EventStatus.APPROVED);
  }

  private updatePaginatedEvents(): void {
    const page = this.currentPage();
    this.paginatedEvents = this.paginationService.paginate(this.allEvents, page, this.pageSize, (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.updatePaginatedEvents();
  }

  private findNextEvent(events: EventModel[]): EventModel | null {
    const upcoming = events
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] ?? null;
  }

  onItemClicked(event: EventModel): void {
    // e.g. analytics or debugging
    console.log('Clicked', event.title);
  }
}


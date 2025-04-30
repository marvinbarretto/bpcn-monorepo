import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit } from '@angular/core';
import { EventStore } from '../../data-access/event.store';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { EventStatus } from '../../utils/event.model';
import { EventListComponent } from '../../ui/event-list/event-list.component';
import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from '../../../shared/ui/hero/hero.component';

@Component({
    selector: 'app-event-list-container',
    imports: [CommonModule, RouterModule, EventListComponent, HeroComponent],
    templateUrl: './event-list-container.component.html',
    styleUrl: './event-list-container.component.scss'
})
export class EventListContainerComponent implements OnInit {
  eventStore = inject(EventStore);
  authStore = inject(AuthStore);

  EventStatus = EventStatus;

  filteredEvents = computed(() =>
    this.eventStore.events$$().filter(
      (event) => event.eventStatus === this.filterStatus
    )
  );

  @Input() filterStatus: EventStatus = EventStatus.APPROVED;
  loading = this.eventStore.loading$$();
  error = this.eventStore.error$$();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.filterStatus = data['filterStatus'];
      if (this.eventStore.events$$().length === 0) {
        console.log('No events found in store, fetching from server...');
        this.eventStore.loadUpcomingEvents();
      } else {
        console.log('Events already loaded in store, no need to fetch.');
      }
    });
  }
}

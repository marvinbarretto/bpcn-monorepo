import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input, OnInit, signal } from '@angular/core';
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

  filterStatus = signal<EventStatus>(EventStatus.APPROVED);
  filteredEvents = computed(() =>
    this.eventStore.events$$().filter(
      (event) => event.eventStatus === this.filterStatus()
    )
  );

  loading = this.eventStore.loading$$();
  error = this.eventStore.error$$();

  constructor(private route: ActivatedRoute) {
    effect(() => {
      const currentStatus = this.filterStatus();
      const allEvents = this.eventStore.events$$();
      console.log('[Debug] All events from store:', allEvents);
      console.log('[Debug] Current filter status:', currentStatus);
    
      const matching = allEvents.filter(e => e.eventStatus === currentStatus);
      console.log('[Debug] Matching filtered events:', matching);
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log('[EventListContainer] Filter status from route:', data['filterStatus']);
      this.filterStatus.set(data['filterStatus'] || EventStatus.APPROVED);
    
      if (this.eventStore.events$$().length === 0) {
        console.log('No events in store, loading...');
        this.eventStore.loadUpcomingEvents();
      } else {
        console.log('Events already in store, skipping fetch.');
      }
    });
  }
}

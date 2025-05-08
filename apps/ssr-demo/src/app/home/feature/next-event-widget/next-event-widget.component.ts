import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../events/data-access/event.service';
import { EventModel } from '../../../events/utils/event.model';
import { RouterModule } from '@angular/router';
import { RelativeDatePipe } from "../../../shared/utils/pipes/relative-date.pipe";

@Component({
  selector: 'app-next-event-widget',
  imports: [CommonModule, RouterModule, RelativeDatePipe],
  templateUrl: './next-event-widget.component.html',
  styleUrl: './next-event-widget.component.scss',
})
export class NextEventWidgetComponent {
  private readonly eventService = inject(EventService);

  readonly events$$ = signal<EventModel[]>([]);
  readonly nextEvent = computed(() => {
    return this.events$$()
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;
  });
  
  readonly loaded$$ = computed(() => this.events$$().length > 0);

  constructor() {
    this.eventService.getEvents().subscribe(events => this.events$$.set(events));
  }
}


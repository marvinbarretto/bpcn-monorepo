import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventModel } from '../../utils/event.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      EventDetail
    </div>
  `
})
export class EventDetailComponent {
  @Input() event!: EventModel;
}

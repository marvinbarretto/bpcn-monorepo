import { Component, Input } from '@angular/core';
import { EventModel, StrapiEvent } from '../../utils/event.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateComponent } from '../../../shared/ui/date/date.component';
import { EventListItemComponent } from "../event-list-item/event-list-item.component";

@Component({
    selector: 'app-event-list',
    imports: [CommonModule, RouterModule, DateComponent, EventListItemComponent],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  @Input() events: EventModel[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
}

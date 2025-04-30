import { Component, Input } from '@angular/core';
import { IEvent } from '../../utils/event.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateComponent } from '../../../shared/ui/date/date.component';

@Component({
    selector: 'app-event-list',
    imports: [CommonModule, RouterModule, DateComponent],
    templateUrl: './event-list.component.html',
    styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  @Input() events: IEvent[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  parseDate(date: string): Date {
    return new Date(date);
  }
}

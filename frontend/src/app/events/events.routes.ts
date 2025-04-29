import { Routes } from "@angular/router";
import { EventStatus } from "./utils/event.model";

export const EVENTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./feature/create-event/create-event.component').then(m => m.CreateEventComponent)
  },
  {
    path: 'review',
    data: { filterStatus: EventStatus.PENDING },
    loadComponent: () => import('./feature/event-list-container/event-list-container.component').then(m => m.EventListContainerComponent)
  },
  {
    path: ':slug',
    loadComponent: () => import('./ui/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: '',
    data: { filterStatus: EventStatus.APPROVED },
    loadComponent: () => import('./feature/event-list-container/event-list-container.component').then(m => m.EventListContainerComponent)
  },
  {
    path: 'archived',
    data: { filterStatus: EventStatus.ARCHIVED },
    loadComponent: () => import('./feature/event-list-container/event-list-container.component').then(m => m.EventListContainerComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
]

import { Component, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventStore } from '../../data-access/event.store';
import { inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { IEvent, IEventContentBlock } from '../../utils/event.model';
import { HeroComponent } from '../../../shared/ui/hero/hero.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-event-detail',
    imports: [CommonModule, HeroComponent],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {

  eventStore = inject(EventStore);
  route = inject(ActivatedRoute);

  private titleService = inject(Title);
  private metaService = inject(Meta);

  event = this.eventStore.currentEvent$$;
  loading = this.eventStore.loading$$;
  error = this.eventStore.error$$;

  assetPath = 'http://localhost:1337'; // FIXME: This is a temporary fix to allow the app to build. We need to find a better way to handle this.

  // TODO: The page title should be dynamic based on the event title

  getFullImageUrl(relativeUrl: string | undefined): string {
    return relativeUrl ? `${this.assetPath}${relativeUrl}` : '';
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      console.log('Loading event by slug:', slug);
      this.eventStore.selectEventBySlug(slug);
    }


  }

  constructor() {
    // Update meta tags when the event signal changes
    effect(() => {
      const currentEvent = this.event(); // React to changes in the `currentEvent$$` signal
      if (currentEvent) {
        this.updateMetaTags(currentEvent);
      }
    });
  }

  // Helper method to format date
  formatEventDate(date: string): string {
    const eventDate = new Date(date);
    return formatDate(eventDate, 'MMMM d, yyyy, h:mm a', 'en-US');
  }

  // Check if the block has any meaningful content
  hasContent(block: IEventContentBlock): boolean {
    return block.children.some(child => child.text?.trim().length > 0);
  }


  ngOnDestroy() {
    // Optionally clear the selected event when leaving the component
    this.eventStore.clearCurrentEvent();
  }


  renderBlockText(block: IEventContentBlock): string {
    return block.children?.map(child => child.text).join(' ') || '';
  }

  shareEvent() {
    // Implement sharing logic, e.g., via navigator.share() API
    console.log('Sharing event...');
  }

  printEvent() {
    window.print();
  }

  addToCalendar(event: IEvent) {
    // Implement calendar addition logic
    console.log('Adding event to calendar:', event);
  }

  updateMetaTags(event: IEvent) {
    console.log('Updating meta tags for event:', event);

    if (event.seo) {
      this.titleService.setTitle(event.seo.metaTitle || event.title);

      const metaDescription = event.seo.metaDescription || `Details about ${event.title}`;
      const keywords = event.seo.keywords || '';

      this.metaService.updateTag({ name: 'description', content: metaDescription });
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    } else {
      console.warn('No SEO data found for this event.');
    }
  }



}

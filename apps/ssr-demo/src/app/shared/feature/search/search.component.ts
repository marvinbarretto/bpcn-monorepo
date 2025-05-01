import { AfterViewInit, Component, effect, ElementRef, HostListener, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal, ViewChild, WritableSignal } from '@angular/core';
import { SearchService } from '../../data-access/search.service';
import { SearchInputComponent } from '../../ui/search-input/search-input.component';
import { Page } from '../../../pages/utils/page.model';
import { IEvent } from '../../../events/utils/event.model';
import { SearchResultsComponent } from '../../ui/search-results/search-results.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayService } from '../../data-access/overlay.service';


@Component({
    selector: 'app-search',
    imports: [SearchInputComponent, SearchResultsComponent, CommonModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('triggerElement', { static: false }) triggerElement!: ElementRef;
  backdropTop = signal<number>(0);

  query = signal<string>('');
  results = signal<any[]>([]);
  loading = signal<boolean>(false);
  private focusTrap!: FocusTrap;

  constructor(
    private searchService: SearchService,
    private focusTrapFactory: FocusTrapFactory,
    private overlayService: OverlayService,
    @Inject(PLATFORM_ID) private platformId: Object // Detect platform (SSR or browser)
  ) {

    effect(() => {
      const searchTerm = this.query();

      if (searchTerm.length >= 3) {
        console.log('Searching for:', searchTerm);
        this.loading.set(true);


        this.searchService.sitewideSearch(searchTerm).subscribe({
          next: (data) => {
            const combinedResults = [
              ...data.events.map((event: Partial<IEvent>) => ({ type: 'Event', ...event })),
              ...data.pages.map((page: Page) => ({ type: 'Page', ...page })),
            ];
            console.log('Search results:', combinedResults);
            this.results.set(combinedResults);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Search error:', err);
            this.results.set([]);
            this.loading.set(false);
          },
        });


      }
    }, { allowSignalWrites: true });
  }



  ngOnInit(): void {
    console.log('Search component initialized');

    if (isPlatformBrowser(this.platformId)) {
      this.focusTrap = this.focusTrapFactory.create(document.querySelector('app-search')!);
      this.focusTrap.focusInitialElement();
    }

  }

  ngOnDestroy(): void {
    console.log('Search component destroyed');
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }

  closeOverlay(): void {
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
    this.overlayService.hideOverlay();
  }

  // Listen for `Escape` key and ensure it's not triggered inside an input
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeOverlay();
      event.preventDefault(); // Prevent default behavior if needed
    }
  }


  onQueryChange(query: string) {
    console.log('Query changed:', query); // Handle query changes
    this.query.set(query); // Update the query
  }

  onResultSelect(result: any) {
    console.log('Selected result:', result); // Handle result selection (e.g., navigation)
  }
}


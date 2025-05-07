import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsrPlatformService } from '../../utils/ssr/ssr-platform.service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  private readonly ssr = inject(SsrPlatformService);
  readonly isMobile$$ = signal(false);

  constructor() {
    if (this.ssr.isBrowser) {
      const check = () => this.isMobile$$.set(window.innerWidth < 600);
      window.addEventListener('resize', check);
      check(); // initial
    }
  }
}

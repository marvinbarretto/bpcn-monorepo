import { Component, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  template: `
    <h1>Hello World!</h1>
    <p *ngIf="localStorageAvailable">LocalStorage is available</p>
    <p *ngIf="!localStorageAvailable">LocalStorage is NOT available</p>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {
  localStorageAvailable: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.localStorageAvailable = false;

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('test', 'value');
        this.localStorageAvailable = true;
      } catch {
        this.localStorageAvailable = false;
      }
    }
  }
}

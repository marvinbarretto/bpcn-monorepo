import { Injectable, signal } from '@angular/core';
import { StrapiService } from './strapi.service';

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private strapiAvailable$$ = signal<boolean>(false);

  readonly isStrapiAvailable$$ = this.strapiAvailable$$.asReadonly();

  constructor(private strapiService: StrapiService) {
    this.startHeathCheck();
  }

  setBackendUnavailable() {
    this.strapiAvailable$$.set(false);
  }

  private checkHeath() {
    this.strapiService.ping().subscribe({
      next: (isAvailable) => this.strapiAvailable$$.set(isAvailable),
      error: () => this.strapiAvailable$$.set(false)
    });
  }

  private startHeathCheck() {
    this.checkHeath();
    setInterval(() => this.checkHeath(), 30000);
    // TODO: Make this 30000 configurable
    // TODO: Make this whole fucntionality optional as it might be expensive?
  }

}

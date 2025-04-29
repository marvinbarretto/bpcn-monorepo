import { HostListener, Injectable, signal } from '@angular/core';

export type OverlayType = 'search' | 'accessibility';

@Injectable({
  providedIn: 'root'
})

export class OverlayService {
  private activeOverlay = signal<OverlayType | null>(null);

  showOverlay(overlay: OverlayType): void {
    this.activeOverlay.set(overlay);
  }

  hideOverlay(): void {
    this.activeOverlay.set(null);
  }

  isOverlayActive(overlay: OverlayType): boolean {
    return this.activeOverlay() === overlay;
  }

  getActiveOverlay(): OverlayType | null {
    return this.activeOverlay();
  }
}

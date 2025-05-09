import { signal, computed } from '@angular/core';
import { Injectable } from '@angular/core';

export type PanelType = 'theme' | 'search' | 'nav' | null;

@Injectable({
  providedIn: 'root',
})
export class PanelStore {
  private activePanel$$ = signal<PanelType>(null);

  readonly activePanel = computed(() => this.activePanel$$());
  readonly isOpen = computed(() => !!this.activePanel$$());

  private originY$$ = signal<number>(0);
  readonly originY = computed(() => this.originY$$());

  setOriginY(y: number) {
    this.originY$$.set(y);
  }

  open(panel: PanelType) {
    this.activePanel$$.set(panel);
  }

  openAt(panel: PanelType, originY: number) {
    this.originY$$.set(originY);
    this.open(panel);
  }

  close() {
    this.activePanel$$.set(null);
  }

  toggle(panel: PanelType) {
    if (this.activePanel$$()?.toString() === panel) {
      this.close();
    } else {
      this.open(panel);
    }
  }
}

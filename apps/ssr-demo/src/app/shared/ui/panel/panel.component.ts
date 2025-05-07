import {
  Component,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { PanelStore } from './panel.store';
import { SsrPlatformService } from '../../../shared/utils/ssr/ssr-platform.service';
import { computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  readonly panelStore = inject(PanelStore);
  private readonly ssr = inject(SsrPlatformService);

  readonly isVisible = computed(() => this.panelStore.activePanel() !== null);

  @HostBinding('class.visible') get visibleClass() {
    return this.isVisible();
  }

  constructor() {
    this.ssr.onlyOnBrowser(() => {
      effect(() => {
        document.body.style.overflow = this.isVisible() ? 'hidden' : '';
      });
    });
  }

  close() {
    this.panelStore.close();
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isVisible()) {
      this.close();
    }
  }


}
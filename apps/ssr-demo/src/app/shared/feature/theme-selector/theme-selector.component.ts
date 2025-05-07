import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeStore } from '../../data-access/theme.store';
import { ThemeType } from '../../utils/theme.tokens';

@Component({
  selector: 'app-theme-selector',
  imports: [CommonModule],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
})
export class ThemeSelectorComponent {
  private readonly themeStore = inject(ThemeStore);

  themeOptions: ThemeType[] = [
    'Default',
    'HighContrast',
    'Tritanopia',
    'LowContrast',
    'Purple',
    'RedGreen'
  ];

  setTheme(type: ThemeType) {
    this.themeStore.setTheme(type);
  }

  get currentTheme() {
    return this.themeStore.themeType();
  }

}

import { signal, computed, effect, Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { CookieService } from './cookie.service';
import { SsrPlatformService } from '../utils/ssr/ssr-platform.service';
import { Theme, ThemeType, defaultTheme, themeTokens } from '../utils/theme.tokens';

const THEME_COOKIE_KEY = 'userTheme';

@Injectable({
  providedIn: 'root'
})
export class ThemeStore {
  private readonly cookie = inject(CookieService);
  private readonly platform = inject(SsrPlatformService);

  private themeType$$ = signal<ThemeType>(defaultTheme.type);

  readonly theme = computed(() => themeTokens[this.themeType$$()]);
  readonly themeType = computed(() => this.themeType$$());

  constructor() {
    this.platform.onlyOnBrowser(() => {
      const cookieTheme = this.cookie.getCookie(THEME_COOKIE_KEY) as ThemeType;

      if (cookieTheme && themeTokens[cookieTheme]) {
        this.themeType$$.set(cookieTheme);
      }

      this.applyThemeToDOM(this.theme());
    });

    // Reactively apply theme changes
    effect(() => {
      this.platform.onlyOnBrowser(() => {
        this.applyThemeToDOM(this.theme());
      });
    });
  }

  setTheme(type: ThemeType): void {
    if (!themeTokens[type]) {
      console.warn(`[ThemeStore] Unknown theme type: ${type}`);
      return;
    }

    this.themeType$$.set(type);
    this.cookie.setCookie(THEME_COOKIE_KEY, type);

    // TODO: If user is logged in, update their saved profile theme here
  }

  private applyThemeToDOM(theme: Theme): void {
    const root = this.platform.getDocument()?.documentElement;
    if (!root) return;

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${this.kebabCase(key)}`, value);
    });

    root.classList.remove(...Object.keys(themeTokens));
    root.classList.add(`theme--${this.themeType$$()}`);
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

import { signal, computed, effect, Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { CookieService } from './cookie.service';
import { SsrPlatformService } from '../utils/ssr/ssr-platform.service';
import {
  Theme,
  ThemeType,
  defaultTheme,
  themeTokens,
} from '../utils/theme.tokens';
import { Inject } from '@angular/core';
import { USER_THEME_TOKEN } from '../../../libs/tokens/user-theme.token';

const THEME_COOKIE_KEY = 'userTheme';

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  private readonly cookie = inject(CookieService);
  private readonly platform = inject(SsrPlatformService);

  private themeType$$ = signal<ThemeType>(defaultTheme.type);

  readonly theme = computed(() => themeTokens[this.themeType$$()]);
  readonly themeType = computed(() => this.themeType$$());

  constructor(@Inject(USER_THEME_TOKEN) serverTheme?: ThemeType) {
    console.log('[ThemeStore] Injected server theme:', serverTheme);

    const initial =
      serverTheme && themeTokens[serverTheme] ? serverTheme : defaultTheme.type;
    this.themeType$$.set(initial);

    this.platform.onlyOnBrowser(() => {
      const cookieTheme = this.cookie.getCookie(THEME_COOKIE_KEY) as ThemeType;

      if (cookieTheme && cookieTheme !== initial && themeTokens[cookieTheme]) {
        this.themeType$$.set(cookieTheme);
        console.log(`[ThemeStore] Cookie theme overridden: ${cookieTheme}`);
      }

      this.applyThemeToDOM(this.theme());
    });

    effect(() => {
      this.platform.onlyOnBrowser(() => {
        this.applyThemeToDOM(this.theme());
        console.log(`[ThemeStore] Theme applied:`, this.theme());
      });
    });
  }

  setTheme(type: ThemeType): void {
    if (!themeTokens[type]) {
      console.warn(`[ThemeStore] Unknown theme type: ${type}`);
      return;
    }

    console.log(`[ThemeStore] Setting theme to ${type}`);
    this.themeType$$.set(type);
    this.cookie.setCookie(THEME_COOKIE_KEY, type);
    console.log(
      `[ThemeStore] Theme cookie set: ${this.cookie.getCookie(
        THEME_COOKIE_KEY
      )}`
    );

    // TODO: If user is logged in, update their saved profile theme here
  }

  private applyThemeToDOM(theme: Theme): void {
    const root = this.platform.getDocument()?.documentElement;
    if (!root) return;

    Object.entries(theme.tokens).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.classList.remove(
      ...Object.keys(themeTokens).map((t) => `theme--${t}`)
    );
    root.classList.add(`theme--${theme.name}`);
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

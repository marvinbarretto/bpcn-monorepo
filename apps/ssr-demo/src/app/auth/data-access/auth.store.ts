// The idea is that this store is the single source of truth for authentication state


import { Roles } from "../utils/roles.enum";
import { AuthResponse, RegisterPayload } from "../utils/auth.model";
import { AuthService } from "./auth.service";
import { UserService } from "../../users/data-access/user.service";
import { CookieService } from "../../shared/data-access/cookie.service";
import { SsrPlatformService } from "../../shared/utils/ssr/ssr-platform.service";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap, take, catchError } from "rxjs/operators";
import { User } from "../../users/utils/user.model";
import { of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly cookieService = inject(CookieService);
  private readonly ssr = inject(SsrPlatformService);
  private readonly router = inject(Router);

  user$$ = signal<User | null>(null);
  token$$ = signal<string | null>(null);
  loading$$ = signal<boolean>(false);
  error$$ = signal<string | null>(null);
  ready$$ = signal<boolean>(false);

  constructor() {
    this.ssr.onlyOnBrowser(() => {
      const token = this.cookieService.getCookie('authToken');
      console.log('[AuthStore] Bootstrapping from cookie — token:', token);
  
      const user = localStorage.getItem('user');
      console.log('[AuthStore] Bootstrapping from localStorage — user:', user);
  
      this.loadUserFromStorage();
    });
  }

  bootstrapFromCookie(): void {
    if (!this.ssr.isBrowser) return;
  
    const token = this.cookieService.getCookie('authToken');
    if (!token) {
      this.token$$.set(null);
      this.user$$.set(null);
      this.ready$$.set(true);
      return;
    }
  
    this.token$$.set(token);
  
    this.userService.getUserDetails().subscribe({
      next: (user) => {
        this.user$$.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: () => {
        this.user$$.set(null);
      },
      complete: () => {
        this.ready$$.set(true);
      }
    });
  }
  

  private loadUserFromStorage() {
    if (!this.ssr.isBrowser) return;
    
    const token = this.cookieService.getCookie('authToken');
    const user = localStorage.getItem('user');

    if (token) {
      this.token$$.set(token);

      if (user) {
        this.user$$.set(JSON.parse(user));
      } else {
        this.userService.getUserDetails().subscribe((user: User) => {
          this.user$$.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        });
      }
    }
  }

  login(identifier: string, password: string) {
    this.loading$$.set(true);
    this.error$$.set(null);

    return this.authService.login({ identifier, password }).pipe(
      tap((response: AuthResponse) => this.handleLoginSuccess(response)),
      catchError((error: any) => {
        this.error$$.set(`Login failed ${error}`);
        this.loading$$.set(false);
        return of(null);
      }),
      take(1)
    ).subscribe();
  }

  logout() {
    this.cookieService.deleteCookie('authToken');

    this.ssr.onlyOnBrowser(() => {
      localStorage.removeItem('user');
    });

    this.token$$.set(null);
    this.user$$.set(null);

    this.router.navigate(['/login']);
  }

  register(payload: RegisterPayload) {
    this.loading$$.set(true);
    this.error$$.set(null);

    return this.authService.register(payload).pipe(
      tap((response: AuthResponse) => this.handleLoginSuccess(response)),
      catchError((error: any) => {
        this.error$$.set(`Login failed ${error}`);
        this.loading$$.set(false);
        return of(null);
      }),
      take(1)
    ).subscribe();
  }

  private handleLoginSuccess(response: AuthResponse) {
    this.token$$.set(response.jwt);
    this.cookieService.setCookie('authToken', response.jwt);
  
    this.userService.getUserDetails().subscribe({
      next: (user) => {
        this.user$$.set(user);
        this.ssr.onlyOnBrowser(() => {
          localStorage.setItem('user', JSON.stringify(user));
        });
        this.loading$$.set(false);
        this.error$$.set(null);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.error$$.set(`Login failed ${error}`);
        this.loading$$.set(false);
      }
    });
  }
  

  isAuthenticated(): boolean {
    return !!this.token$$();
  }

  hasRole(role: Roles): boolean {
    return this.user$$()?.role.name === role;
  }

  canCreateEvent(): boolean {
    return this.hasRole(Roles.Authenticated) || this.hasRole(Roles.Author) || this.hasRole(Roles.Admin);
  }

  canCreateArticle(): boolean {
    return this.hasRole(Roles.Authenticated) || this.hasRole(Roles.Author) || this.hasRole(Roles.Admin);
  }

  canCreateUser(): boolean {
    return this.hasRole(Roles.Admin);
  }

  canReviewEvents(): boolean {
    return this.hasRole(Roles.Admin);
  }

  canReviewArticles(): boolean {
    return this.hasRole(Roles.Admin);
  }
}

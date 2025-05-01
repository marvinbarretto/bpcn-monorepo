import { Injectable, signal, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { of } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';
import { User } from "../../users/utils/user.model";
import { AuthResponse, RegisterPayload } from "../utils/auth.model";
import { Roles } from "../utils/roles.enum";
import { AuthService } from "./auth.service";
import { UserService } from "../../users/data-access/user.service";

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  user$$ = signal<User | null>(null);
  token$$ = signal<string | null>(null);
  loading$$ = signal<boolean>(false);
  error$$ = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.token$$.set(token);
      this.user$$.set(JSON.parse(user));
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }

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

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', response.jwt);
    }

    this.userService.getUserDetails().subscribe((user: User) => {
      this.user$$.set(user);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      this.loading$$.set(false);
      this.error$$.set(null);

      this.router.navigate(['/']);
    }, (error: any) => {
      this.error$$.set(`Login failed ${error}`);
      this.loading$$.set(false);
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

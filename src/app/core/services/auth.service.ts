import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '@envs/environment';
import { ApiService } from '@core/services/api.service';
import { User } from '@shared/models/user';
import { ApiResponse } from '@shared/models/api-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  private _user = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  private _loading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly fullName = computed(() => {
    const u = this._user();
    return u ? `${u.name} ${u.lastName}` : '';
  });

  login(email: string): Observable<ApiResponse<{ emailSent: boolean; message: string }>> {
    this._loading.set(true);
    const baseUrl = window.location.origin;
    return this.api.login(email, baseUrl).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        return of(err);
      })
    );
  }

  handleCallback(): Observable<ApiResponse<null>> {
    this._loading.set(true);
    return this.api.callback().pipe(
      tap(() => this.fetchCurrentUser()),
      catchError(err => {
        this._loading.set(false);
        return of(err);
      })
    );
  }

  fetchCurrentUser(): Observable<ApiResponse<User>> {
    return this.api.getUsers().pipe(
      map(response => {
        if (response.statusCode === 200 && response.data && response.data.length > 0) {
          this._user.set(response.data[0]);
          this._isAuthenticated.set(true);
        } else {
          this._user.set(null);
          this._isAuthenticated.set(false);
        }
        this._loading.set(false);
        return response;
      }),
      catchError(err => {
        this._user.set(null);
        this._isAuthenticated.set(false);
        this._loading.set(false);
        return of(err);
      })
    );
  }

  refreshToken(): Observable<ApiResponse<null>> {
    return this.api.refresh().pipe(
      catchError(err => {
        this.logout();
        return of(err);
      })
    );
  }

  logout(): Observable<ApiResponse<null>> {
    this._user.set(null);
    this._isAuthenticated.set(false);
    return this.api.logout();
  }

  checkAuth(): boolean {
    return this._isAuthenticated();
  }
}
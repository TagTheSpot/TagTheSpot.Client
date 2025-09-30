import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private baseUrl = environment.userServiceUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/api/login`,
      { email, password }
    );
  }

  signInWithGoogle(googleIdToken: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/api/google-login`,
      { googleIdToken }
    );
  }

  register(email: string, password: string) {
    return this.http.post(
      `${this.baseUrl}/api/register`,
      { email, password }
    )
  }

  storeTokens(access: string, refresh: string) {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  hasAnyRole(roles: string[]): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRoles: string[] = payload['role'] || [];
      return roles.some(r => userRoles.includes(r));
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getEmail(): string | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['email'] || null;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] || null;
    } catch {
      return null;
    }
  }

  isRegularUser() : boolean {
    const role = this.getRole();
    
    return !!role && role == 'RegularUser';
  }

  hasAdminRights() : boolean {
    const role = this.getRole();

    return !!role && (role == 'Admin' || role == 'Owner');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/api/refresh-token`,
      { refreshToken }
    ).pipe(
      tap(tokens => this.storeTokens(tokens.accessToken, tokens.refreshToken))
    );
  }

  confirmEmail(userId: string, token: string) : Observable<any> {
    return this.http.post(`${this.baseUrl}/api/confirm-email`, {
      userId: userId,
      token: token
    })
  }

  forgotPassword(email: string) : Observable<any> {
    return this.http.post(`${this.baseUrl}/api/request-password-reset`, {
      email: email
    });
  }
}


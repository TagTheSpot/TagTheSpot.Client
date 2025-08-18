import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      'https://localhost:18001/api/login',
      { email, password }
    );
  }

  register(email: string, password: string) {
    return this.http.post(
      'https://localhost:18001/api/register',
      { email, password }
    )
  }

  storeTokens(access: string, refresh: string) {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem('refreshToken', refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem('refreshToken');
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
}


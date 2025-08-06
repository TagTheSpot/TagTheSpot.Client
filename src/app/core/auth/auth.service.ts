import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string | null = null;
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
    this.accessToken = access;
    localStorage.setItem('refreshToken', refresh);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('refreshToken');
  }
}

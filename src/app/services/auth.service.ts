// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private http = inject(HttpClient);

  login(usernameOrEmail: string, password: string) {
    const url = `${environment.apiUrl}/api/auth/login`;
    const body: LoginRequest = { usernameOrEmail, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(res => {
        this.setToken(res.accessToken);
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

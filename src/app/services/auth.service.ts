import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

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
  private readonly REFRESH_KEY = 'refresh_token';
  private http = inject(HttpClient);

  login(usernameOrEmail: string, password: string): Observable<any> {
    const url = `${environment.apiUrl}/api/auth/login`;
    const body: LoginRequest = { usernameOrEmail, password };

    // observe: 'response' para obtener el cuerpo/estado y withCredentials para permitir que el servidor escriba cookies
    return this.http.post<LoginResponse>(url, body, { observe: 'response', withCredentials: true }).pipe(
      tap(resp => {
        const resBody = resp.body;
        if (resBody?.accessToken) {
          this.setToken(resBody.accessToken);
        }
      })
    );
  }

  // Ejemplo de método para solicitar un nuevo access token usando endpoint de refresh
  // El servidor debe devolver el nuevo accessToken y (opcionalmente) actualizar la cookie refreshToken
  fetchAccessTokenWithRefresh(): Observable<any> {
    const url = `${environment.apiUrl}/api/auth/refresh`;
    return this.http.post<LoginResponse>(url, {}, { observe: 'response', withCredentials: true }).pipe(
      tap(resp => {
        const resBody = resp.body;
        if (resBody?.accessToken) {
          this.setToken(resBody.accessToken);
        }
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
    localStorage.removeItem(this.REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

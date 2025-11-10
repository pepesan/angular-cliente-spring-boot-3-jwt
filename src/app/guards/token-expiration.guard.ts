// src/app/guards/token-expiration.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number; // tiempo de expiración en segundos desde epoch
}

export const TokenExpirationGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expiration = decoded?.exp ? decoded.exp * 1000 : 0;
    const now = Date.now();

    // Token válido (no caducado)
    if (expiration > now) {
      return true;
    }

    // Token caducado → intentar refrescar
    console.warn('Access token expirado, intentando renovar...');
    return auth.fetchAccessTokenWithRefresh().pipe(
      map(() => true),
      catchError(() => {
        console.error('No se pudo renovar el token, redirigiendo a login.');
        auth.logout();
        router.navigate(['/login']);
        return of(false);
      })
    );
  } catch (err) {
    console.error('Error al decodificar el token JWT:', err);
    auth.logout();
    router.navigate(['/login']);
    return false;
  }
};

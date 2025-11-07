// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.getToken();

  // opcional: no adjuntar tokens a estos endpoints:
  const isAuthUrl =
    req.url.startsWith(`${environment.apiUrl}/api/auth/login`) ||
    req.url.startsWith(`${environment.apiUrl}/api/auth/refresh`);

  if (isAuthUrl) {
    return next(req);
  }

  let headers: Record<string, string> = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }


  const clonedReq: HttpRequest<any> = req.clone({
    setHeaders: headers,
    withCredentials: true // por si sigues usando cookies en el server
  });

  return next(clonedReq);
};

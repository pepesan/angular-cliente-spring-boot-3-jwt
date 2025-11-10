import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  roles?: string[] | string;
}

export const RoleAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const roles = decoded.roles;

    const isAdmin = Array.isArray(roles)
      ? roles.includes('ROLE_ADMIN')
      : roles === 'ROLE_ADMIN';

    if (isAdmin) {
      return true;
    } else {
      // 🚨 Redirige directamente a /unauthorized
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (err) {
    console.error('Error al decodificar token:', err);
    router.navigate(['/unauthorized']);
    return false;
  }
};

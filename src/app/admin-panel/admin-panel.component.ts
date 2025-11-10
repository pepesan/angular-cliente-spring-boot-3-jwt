import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 1rem">
      <h2>Panel de Administración</h2>

      @if (isAdmin) {
        <p style="color: green">
          ✅ Bienvenido, administrador. Tienes acceso completo al sistema.
        </p>
        <div>
          <h3>Información del token</h3>
          <pre>{{ decodedToken | json }}</pre>
        </div>
      } @else {
        <p style="color: red">
          🚫 No tienes permisos de administrador.
        </p>
      }
    </section>
  `
})
export class AdminPanelComponent {
  private auth = inject(AuthService);

  token: string | null = null;
  decodedToken: any = null;
  isAdmin = false;

  ngOnInit() {
    this.token = this.auth.getToken();

    if (this.token) {
      try {
        this.decodedToken = jwtDecode(this.token);
        const roles = this.decodedToken?.roles;
        this.isAdmin = Array.isArray(roles)
          ? roles.includes('ROLE_ADMIN')
          : roles === 'ROLE_ADMIN';
      } catch (err) {
        this.decodedToken = { error: 'Token inválido o corrupto' };
      }
    }
  }
}

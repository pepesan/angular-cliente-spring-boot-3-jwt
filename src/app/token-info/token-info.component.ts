// src/app/token-info/token-info.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-token-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Información del Token JWT</h2>

    @if (!token) {
      <p style="color: red">No hay token disponible. Inicia sesión primero.</p>
    } @else {
      <p><strong>Token almacenado:</strong></p>
      <pre>{{ token }}</pre>

      <h3>Payload decodificado:</h3>
      <pre>{{ decodedToken | json }}</pre>

      <div>
        <p><strong>Expira:</strong> {{ expirationDate | date:'medium' }}</p>
        <p><strong>Expirado:</strong> {{ isExpired ? 'Sí' : 'No' }}</p>
      </div>
    }
  `
})
export class TokenInfoComponent {
  private auth = inject(AuthService);

  token: string | null = null;
  decodedToken: any = null;
  expirationDate: Date | null = null;
  isExpired = false;

  ngOnInit() {
    this.token = this.auth.getToken();

    if (this.token) {
      try {
        this.decodedToken = jwtDecode(this.token);

        // Si el token tiene "exp", convertirlo a fecha legible
        if (this.decodedToken?.exp) {
          const expMillis = this.decodedToken.exp * 1000;
          this.expirationDate = new Date(expMillis);
          this.isExpired = Date.now() > expMillis;
        }
      } catch (err) {
        console.error('Error al decodificar token:', err);
        this.decodedToken = { error: 'Token no válido o corrupto' };
      }
    }
  }
}

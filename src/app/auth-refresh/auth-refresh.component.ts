import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-refresh',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-refresh.component.html'
})
export class AuthRefreshComponent {
  private authService = inject(AuthService);

  // estados simples
  loading = signal(false);
  message = signal<string | null>(null);
  accessToken = signal<string | null>(null);

  refreshAccessToken() {
    this.loading.set(true);
    this.message.set(null);

    this.authService.fetchAccessTokenWithRefresh().subscribe({
      next: (resp) => {
        // el servicio ya guarda el token en localStorage en el tap
        const body = resp.body;
        if (body?.accessToken) {
          this.accessToken.set(body.accessToken);
          this.message.set('Access token renovado y guardado.');
        } else {
          this.message.set('La respuesta no traía access token.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.message.set('No se ha podido refrescar el token (¿cookie de refresh inexistente o expirada?).');
        this.loading.set(false);
      }
    });
  }
}

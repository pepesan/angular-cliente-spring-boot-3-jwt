// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Login</h2>

    @if (isLoggedIn) {
      <p>Ya tienes una sesión activa.</p>
      <button (click)="logout()">Cerrar sesión</button>
    } @else {
      <form (ngSubmit)="onSubmit()">
        <h2>admin/admin</h2>
        <div>
          <label>Usuario o email</label><br />
          <input
            type="text"
            [(ngModel)]="usernameOrEmail"
            name="usernameOrEmail"
            required
          />
        </div>
        <div>
          <label>Password</label><br />
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            required
          />
        </div>
        <button type="submit">Entrar</button>

        @if (error) {
          <p style="color:red">{{ error }}</p>
        }
      </form>
    }
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usernameOrEmail = '';
  password = '';
  error: string | null = null;
  isLoggedIn = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onSubmit() {
    this.error = null;
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.router.navigate(['/admin-test']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas o error en el servidor';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}

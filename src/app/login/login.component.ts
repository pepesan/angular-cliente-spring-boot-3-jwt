// src/app/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()">
      <div>
        <label>Usuario o email</label><br />
        <input type="text" [(ngModel)]="usernameOrEmail" name="usernameOrEmail" required />
      </div>
      <div>
        <label>Password</label><br />
        <input type="password" [(ngModel)]="password" name="password" required />
      </div>
      <button type="submit">Entrar</button>

      @if (error) {
        <p style="color:red">{{ error }}</p>
      }
    </form>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usernameOrEmail = 'admin';
  password = 'admin';
  error: string | null = null;

  onSubmit() {
    console.log("logueando");
    this.error = null;
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: () => {
        // si quieres, rediriges al admin
        this.router.navigate(['/admin-test']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas o error en el servidor';
      }
    });
  }
}

// src/app/admin-test/admin-test.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NgIf, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-admin-test',
  standalone: true,
  imports: [NgIf, JsonPipe],
  template: `
    <h2>Probar endpoint protegido</h2>
    <button (click)="callAdmin()">Llamar /api/admin</button>

    <pre *ngIf="response">{{ response | json }}</pre>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `
})
export class AdminTestComponent {
  private http = inject(HttpClient);

  response: any;
  error: string | null = null;

  callAdmin() {
    this.error = null;
    const url = `${environment.apiUrl}/api/query/admin`;
    this.http.get(url).subscribe({
      next: res => this.response = res,
      error: err => {
        console.error(err);
        this.error = 'No autorizado (401/403) o error en el backend';
      }
    });
  }
}

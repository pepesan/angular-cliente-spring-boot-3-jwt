import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <h2 style="color:red">Acceso no autorizado</h2>
    <p>No tienes permisos para acceder a esta sección.</p>
  `
})
export class UnauthorizedComponent {}

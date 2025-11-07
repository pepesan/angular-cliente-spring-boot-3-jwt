import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AdminTestComponent} from './admin-test/admin-test.component';
import {AuthRefreshComponent} from './auth-refresh/auth-refresh.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-test', component: AdminTestComponent },
  { path: 'auth-refresh', component: AuthRefreshComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

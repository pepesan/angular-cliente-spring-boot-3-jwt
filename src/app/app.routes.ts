import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AdminTestComponent} from './admin-test/admin-test.component';
import {AuthRefreshComponent} from './auth-refresh/auth-refresh.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {TokenInfoComponent} from './token-info/token-info.component';
import {TokenExpirationGuard} from './guards/token-expiration.guard';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {RoleAdminGuard} from './guards/role-admin.guard';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-test', component: AdminTestComponent },
  { path: 'auth-refresh', component: AuthRefreshComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'token-info', component: TokenInfoComponent, canActivate: [TokenExpirationGuard] },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [TokenExpirationGuard, RoleAdminGuard]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

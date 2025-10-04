import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.routing').then(m => m.AuthenticationRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.routing').then(m => m.DashboardRoutes)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

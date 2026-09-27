import { Routes } from '@angular/router';

import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then(m => m.SettingsPageComponent)
      }
    ]
  }
];

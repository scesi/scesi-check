import { Routes } from '@angular/router';

import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full'
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then(m => m.SettingsPageComponent)
      }
    ]
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin/settings',
    loadComponent: () => import('./pages/admin/settings/settings').then(m => m.SettingsPageComponent)
  },
  {
    path: '',
    redirectTo: '/admin/settings',
    pathMatch: 'full'
  }
];

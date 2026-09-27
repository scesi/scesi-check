import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/components/button/button';
import { CardComponent } from '@shared/components/card/card';

interface StatItem {
  label: string;
  value: string;
  change: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Panel</p>
          <h1 class="text-3xl font-semibold text-text">Resumen del sistema</h1>
        </div>

        <app-button size="sm" routerLink="/admin/users">Ver usuarios</app-button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @for (stat of stats; track stat.label) {
          <app-card>
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-text-muted">{{ stat.label }}</p>
                <p class="mt-2 text-3xl font-semibold text-text">{{ stat.value }}</p>
              </div>
              <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {{ stat.change }}
              </span>
            </div>
          </app-card>
        }
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <app-card title="Actividad reciente" description="Últimas acciones registradas en el sistema.">
          <div class="mt-5 space-y-4">
            @for (item of recentActivity; track item.title) {
              <div class="flex items-start justify-between gap-4 border-b border-[#e7e7e7] pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p class="font-medium text-text">{{ item.title }}</p>
                  <p class="text-sm text-text-muted">{{ item.time }}</p>
                </div>
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" [class.bg-green-100]="item.status === 'ok'" [class.text-green-700]="item.status === 'ok'" [class.bg-amber-100]="item.status === 'pending'" [class.text-amber-700]="item.status === 'pending'" [class.bg-red-100]="item.status === 'alert'" [class.text-red-700]="item.status === 'alert'">
                  {{ item.label }}
                </span>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Acciones rápidas" description="Atajos para gestionar el control de acceso.">
          <div class="mt-5 space-y-3">
            <app-button variant="secondary" [fullWidth]="true" routerLink="/admin/users">Administrar usuarios</app-button>
            <app-button variant="secondary" [fullWidth]="true" routerLink="/admin/settings">Configurar sistema</app-button>
            <app-button variant="ghost" [fullWidth]="true" routerLink="/admin/login">Ir a login</app-button>
          </div>
        </app-card>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  readonly stats: StatItem[] = [
    { label: 'Usuarios activos', value: '1,248', change: '+8%' },
    { label: 'Asistencias hoy', value: '94%', change: '+3%' },
    { label: 'Multas pendientes', value: '32', change: '-5%' },
    { label: 'Dispositivos online', value: '14', change: '+2' }
  ];

  readonly recentActivity = [
    { title: 'Se registró una nueva asistencia', time: 'Hace 12 min', label: 'OK', status: 'ok' },
    { title: 'Se actualizó la configuración de multas', time: 'Hace 1 h', label: 'PENDIENTE', status: 'pending' },
    { title: 'Se detectó un dispositivo sin conexión', time: 'Hace 2 h', label: 'ALERTA', status: 'alert' }
  ];
}

import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/components/button/button';
import { CardComponent } from '@shared/components/card/card';

interface StatCard {
  title: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'primary' | 'success' | 'neutral';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <main class="space-y-6">
      <section class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Panel</p>
          <h1 class="text-3xl font-semibold text-text">Resumen del sistema</h1>
        </div>

        <div class="flex items-center gap-3">
          <app-button variant="secondary" size="sm" routerLink="/admin/settings">
            Configuración
          </app-button>
          <app-button size="sm" routerLink="/admin/users">
            Ver usuarios
          </app-button>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @for (stat of stats(); track stat.title) {
          <article data-testid="stat-card" class="rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-md">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-text-muted">{{ stat.title }}</p>
              <span class="rounded-full px-2 py-1 text-xs font-semibold" [class]="badgeClass(stat.tone)">
                {{ stat.trend }}
              </span>
            </div>

            <div class="mt-4">
              <p class="text-3xl font-semibold text-text">{{ stat.value }}</p>
              <p class="mt-1 text-sm text-text-muted">{{ stat.detail }}</p>
            </div>
          </article>
        }
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <app-card title="Actividad reciente" description="Últimas acciones registradas en el sistema.">
          <div class="mt-4 space-y-4">
            @for (activity of recentActivity(); track activity.title) {
              <div class="flex items-start gap-3 rounded-xl bg-off-white p-3">
                <span class="mt-1 inline-flex h-2.5 w-2.5 rounded-full" [class]="activityDot(activity.type)"></span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <p class="font-medium text-text">{{ activity.title }}</p>
                    <span class="text-xs text-text-muted">{{ activity.time }}</span>
                  </div>
                  <p class="mt-1 text-sm text-text-muted">{{ activity.summary }}</p>
                </div>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Acciones rápidas" description="Atajos para gestionar el control de acceso.">
          <div class="mt-4 space-y-3">
            <app-button variant="secondary" [fullWidth]="true" routerLink="/admin/users">
              Administrar usuarios
            </app-button>
            <app-button variant="secondary" [fullWidth]="true" routerLink="/admin/settings">
              Configurar sistema
            </app-button>
            <app-button variant="ghost" [fullWidth]="true" routerLink="/admin/login">
              Ir a login
            </app-button>
          </div>
        </app-card>
      </section>
    </main>
  `
})
export class AdminDashboardComponent {
  readonly today = signal(new Date());

  readonly stats = computed<StatCard[]>(() => [
    { title: 'Usuarios activos', value: '1,284', detail: 'vs 1,241 ayer', trend: '+3.5%', tone: 'primary' },
    { title: 'Asistencias', value: '92.4%', detail: 'en tiempo', trend: '+1.8%', tone: 'success' },
    { title: 'Multas pendientes', value: '38', detail: 'requieren revisión', trend: '-6.1%', tone: 'neutral' },
    { title: 'Eventos activos', value: '7', detail: 'disponibles hoy', trend: '2 nuevos', tone: 'primary' }
  ]);

  readonly recentActivity = computed<Array<{ title: string; summary: string; time: string; type: 'primary' | 'success' | 'neutral' }>>(() => [
    { title: 'Cargado CSV de asistencia', summary: 'Se importaron 248 registros desde el turno matutino.', time: 'Hace 18 min', type: 'success' },
    { title: 'Actualización de configuración', summary: 'Se guardaron cambios en costes y umbrales del sistema.', time: 'Hace 1 h', type: 'primary' },
    { title: 'Nueva solicitud de acceso', summary: 'Un usuario solicitó permisos de administración.', time: 'Hace 2 h', type: 'neutral' }
  ]);

  badgeClass(tone: 'primary' | 'success' | 'neutral'): string {
    switch (tone) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-[#f3f4f6] text-text-muted';
    }
  }

  activityDot(type: 'primary' | 'success' | 'neutral'): string {
    switch (type) {
      case 'primary':
        return 'bg-primary';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-[#8c8c8c]';
    }
  }
}

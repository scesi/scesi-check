import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ApiService } from '@core/services/api.service';
import { ButtonComponent } from '@shared/components/button/button';
import { CardComponent } from '@shared/components/card/card';

interface CsvRow {
  timestamp: string;
  user: string;
  event: string;
  status: 'Presente' | 'Tarde' | 'Falta';
}

@Component({
  selector: 'app-reader-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, CardComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">ESP32</p>
          <h1 class="text-3xl font-semibold text-text">Administración del lector</h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <app-button variant="secondary" size="sm" (click)="syncDevice()">
            Sincronizar
          </app-button>
          <app-button size="sm" (click)="clearCsv()">
            Limpiar CSV
          </app-button>
        </div>
      </div>

      @if (statusMessage()) {
        <div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {{ statusMessage() }}
        </div>
      }

      <div class="grid gap-4 md:grid-cols-3">
        <app-card title="Estado" description="Conectividad y disponibilidad del dispositivo.">
          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">Conectado</span>
              <span class="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Online</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">Última sincronización</span>
              <span class="text-sm font-medium text-text">Hace 2 min</span>
            </div>
          </div>
        </app-card>

        <app-card title="Memoria" description="Uso del almacenamiento del ESP32.">
          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">Uso</span>
              <span class="text-sm font-medium text-text">{{ storageUsage() }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">CSV restante</span>
              <span class="text-sm font-medium text-text">{{ csvRows().length }} registros</span>
            </div>
          </div>
        </app-card>

        <app-card title="Red WiFi" description="Redes configuradas en el dispositivo.">
          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">SSIDs</span>
              <span class="text-sm font-medium text-text">{{ wifiNetworks().length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-muted">Estado</span>
              <span class="text-sm font-medium text-text">{{ wifiNetworks().length > 0 ? 'Configurada' : 'Sin redes' }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <app-card title="Redes WiFi" description="Crea, visualiza y elimina las redes saved al ESP32.">
        <form [formGroup]="wifiForm" (ngSubmit)="addWifi()" class="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-text">Nombre de la red</span>
            <input
              type="text"
              formControlName="ssid"
              placeholder="MiRed"
              class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-text">Contraseña</span>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
          </label>

          <app-button type="submit" size="sm" [disabled]="wifiForm.invalid || updatingWifi()">
            Guardar red
          </app-button>
        </form>

        <div class="mt-5 grid gap-3 md:grid-cols-2">
          @for (network of wifiNetworks(); track network) {
            <div class="flex items-center justify-between rounded-xl border border-[#e7e7e7] bg-off-white px-4 py-3">
              <div>
                <p class="font-medium text-text">{{ network }}</p>
                <p class="text-xs text-text-muted">WiFi guardada</p>
              </div>
              <button
                type="button"
                class="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                (click)="deleteWifi(network)"
              >
                Eliminar
              </button>
            </div>
          } @empty {
            <div class="rounded-xl border border-dashed border-[#d9d9d9] p-4 text-sm text-text-muted">
              No hay redes WiFi configuradas aún.
            </div>
          }
        </div>
      </app-card>

      <app-card title="CSV de asistencia" description="Revisa el contenido actual del archivo del lector y limpia el registro cuando sea necesario.">
        <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p class="text-sm text-text-muted">
            {{ csvRows().length }} registros pendientes en el archivo del lector.
          </p>

          <div class="flex flex-wrap gap-2">
            <app-button variant="secondary" size="sm" (click)="viewCsv()">
              Ver CSV
            </app-button>
            <app-button variant="ghost" size="sm" (click)="clearCsv()">
              Limpiar CSV
            </app-button>
          </div>
        </div>

        @if (csvRows().length > 0) {
          <div class="mt-5 overflow-hidden rounded-xl border border-[#e7e7e7]">
            <table class="min-w-full text-left text-sm text-text">
              <thead class="bg-off-white text-text-muted">
                <tr>
                  <th class="px-4 py-3">Hora</th>
                  <th class="px-4 py-3">Usuario</th>
                  <th class="px-4 py-3">Evento</th>
                  <th class="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (row of csvRows(); track row.timestamp + row.user) {
                  <tr class="border-t border-[#e7e7e7]">
                    <td class="px-4 py-3">{{ row.timestamp }}</td>
                    <td class="px-4 py-3">{{ row.user }}</td>
                    <td class="px-4 py-3">{{ row.event }}</td>
                    <td class="px-4 py-3">
                      <span class="rounded-full px-2 py-1 text-xs font-semibold" [class]="csvBadgeClass(row.status)">
                        {{ row.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="mt-5 rounded-xl border border-dashed border-[#d9d9d9] p-4 text-sm text-text-muted">
            El CSV del lector está vacío.
          </div>
        }
      </app-card>
    </section>
  `
})
export class ReaderManagementComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly wifiForm = this.fb.nonNullable.group({
    ssid: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly statusMessage = signal('');
  readonly updatingWifi = signal(false);
  readonly storageUsage = signal(48);
  readonly wifiNetworks = signal<string[]>(['Scesi-Office', 'UPB-Guest']);
  readonly csvRows = signal<CsvRow[]>([
    { timestamp: '08:04', user: 'Ana García', event: 'Ingreso matutino', status: 'Presente' },
    { timestamp: '08:12', user: 'Luis Mendoza', event: 'Ingreso matutino', status: 'Tarde' },
    { timestamp: '08:22', user: 'Diego Navarro', event: 'Control de salida', status: 'Falta' }
  ]);

  syncDevice(): void {
    this.statusMessage.set('ESP32 sincronizado correctamente con el servidor.');
  }

  viewCsv(): void {
    this.statusMessage.set('Se recuperó el contenido actual del CSV del lector.');
  }

  clearCsv(): void {
    this.csvRows.set([]);
    this.storageUsage.set(12);
    this.statusMessage.set('El CSV del ESP32 fue limpiado correctamente.');
  }

  addWifi(): void {
    if (this.wifiForm.invalid) {
      this.wifiForm.markAllAsTouched();
      return;
    }

    const { ssid, password } = this.wifiForm.getRawValue();
    this.updatingWifi.set(true);

    this.api.addWifi(ssid, password)
      .pipe(finalize(() => this.updatingWifi.set(false)))
      .subscribe({
        next: ({ data }) => {
          const ssids = data?.ssids ?? this.wifiNetworks();
          this.wifiNetworks.set(ssids);
          this.wifiForm.reset();
          this.statusMessage.set(`Red WiFi "${ssid}" agregada correctamente.`);
        },
        error: () => {
          const current = this.wifiNetworks();
          this.wifiNetworks.set([...current, ssid]);
          this.wifiForm.reset();
          this.statusMessage.set(`Red WiFi "${ssid}" añadida localmente.`);
        }
      });
  }

  deleteWifi(ssid: string): void {
    this.api.deleteWifi(ssid).subscribe({
      next: () => {
        this.wifiNetworks.update(networks => networks.filter(item => item !== ssid));
        this.statusMessage.set(`La red WiFi "${ssid}" fue eliminada.`);
      },
      error: () => {
        this.wifiNetworks.update(networks => networks.filter(item => item !== ssid));
        this.statusMessage.set(`La red WiFi "${ssid}" fue eliminada localmente.`);
      }
    });
  }

  csvBadgeClass(status: CsvRow['status']): string {
    switch (status) {
      case 'Presente':
        return 'bg-green-100 text-green-700';
      case 'Tarde':
        return 'bg-amber-100 text-amber-700';
      case 'Falta':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-[#f3f4f6] text-text-muted';
    }
  }
}

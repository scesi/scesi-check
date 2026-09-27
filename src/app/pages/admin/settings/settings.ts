import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '@shared/components/button/button';
import { CardComponent } from '@shared/components/card/card';
import { ApiService } from '@core/services/api.service';
import { Settings, UpdateSettingsRequest } from '@shared/models/settings';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, CardComponent, DatePipe],
  template: `
    <main class="min-h-screen bg-off-white px-5 py-8 md:px-10 lg:px-16">
      <div class="mx-auto max-w-5xl">
        <section class="mb-6">
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Configuración</p>
          <h1 class="text-3xl font-semibold text-text md:text-4xl">Parámetros del sistema</h1>
        </section>

        <app-card title="Configuración de ausencias y multas" description="Ajusta los costos y los umbrales que se usan para la generación automática de sanciones.">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-6 space-y-6">
            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-sm font-medium text-text">Costo por ausencia</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  formControlName="absenceCost"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="2.00"
                >
              </label>

              <label class="block">
                <span class="mb-2 block text-sm font-medium text-text">Costo por llegada tardía</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  formControlName="lateArrivalCost"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="20.00"
                >
              </label>

              <label class="block">
                <span class="mb-2 block text-sm font-medium text-text">Tiempo de tolerancia (min)</span>
                <input
                  type="number"
                  min="0"
                  formControlName="toleranceTimeMinutes"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="5"
                >
              </label>

              <label class="block">
                <span class="mb-2 block text-sm font-medium text-text">Umbral de ausencia (min)</span>
                <input
                  type="number"
                  min="0"
                  formControlName="absenceThresholdMinutes"
                  class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="30"
                >
              </label>
            </div>

            <div class="flex flex-col justify-between gap-4 border-t border-[#e7e7e7] pt-5 md:flex-row md:items-center">
              <div class="text-sm text-text-muted">
                @if (lastLateFeeGenerationDate()) {
                  <span>Última generación: {{ lastLateFeeGenerationDate() | date:'dd/MM/yyyy HH:mm' }}</span>
                } @else {
                  <span>Sin registro previo</span>
                }
              </div>

              <div class="flex justify-end gap-3">
                <app-button type="button" variant="secondary" [disabled]="loading() || !isDirty()" (clicked)="resetForm()">
                  Restablecer
                </app-button>
                <app-button type="submit" [loading]="loading()" [disabled]="form.invalid || loading() || !isDirty()">
                  Guardar cambios
                </app-button>
              </div>
            </div>
          </form>
        </app-card>
      </div>
    </main>
  `
})
export class SettingsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  loading = signal(false);
  isLoaded = signal(false);

  form = this.fb.nonNullable.group({
    absenceCost: ['', [Validators.required]],
    lateArrivalCost: ['', [Validators.required]],
    toleranceTimeMinutes: [0, [Validators.required, Validators.min(0)]],
    absenceThresholdMinutes: [0, [Validators.required, Validators.min(0)]]
  });

  originalValues = signal<Partial<Settings>>({});
  lastLateFeeGenerationDate = signal<string>('');

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.loading.set(true);

    this.api.getSettings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ data }) => {
          if (!data) return;

          const settings: Settings = data;
          this.originalValues.set({
            absenceCost: settings.absenceCost,
            lateArrivalCost: settings.lateArrivalCost,
            toleranceTimeMinutes: settings.toleranceTimeMinutes,
            absenceThresholdMinutes: settings.absenceThresholdMinutes
          });

          this.form.patchValue({
            absenceCost: settings.absenceCost,
            lateArrivalCost: settings.lateArrivalCost,
            toleranceTimeMinutes: settings.toleranceTimeMinutes,
            absenceThresholdMinutes: settings.absenceThresholdMinutes
          });

          this.lastLateFeeGenerationDate.set(settings.lastLateFeeGenerationDate ?? '');
          this.isLoaded.set(true);
        },
        error: () => {
          this.isLoaded.set(false);
        }
      });
  }

  isDirty(): boolean {
    const current = this.form.getRawValue();
    const original = this.originalValues();

    return JSON.stringify({
      absenceCost: current.absenceCost,
      lateArrivalCost: current.lateArrivalCost,
      toleranceTimeMinutes: current.toleranceTimeMinutes,
      absenceThresholdMinutes: current.absenceThresholdMinutes
    }) !== JSON.stringify({
      absenceCost: original.absenceCost ?? '',
      lateArrivalCost: original.lateArrivalCost ?? '',
      toleranceTimeMinutes: original.toleranceTimeMinutes ?? 0,
      absenceThresholdMinutes: original.absenceThresholdMinutes ?? 0
    });
  }

  resetForm(): void {
    const original = this.originalValues();
    this.form.patchValue({
      absenceCost: original.absenceCost ?? '',
      lateArrivalCost: original.lateArrivalCost ?? '',
      toleranceTimeMinutes: original.toleranceTimeMinutes ?? 0,
      absenceThresholdMinutes: original.absenceThresholdMinutes ?? 0
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.isDirty()) return;

    this.loading.set(true);

    const payload: UpdateSettingsRequest = {
      absenceCost: this.form.get('absenceCost')?.value,
      lateArrivalCost: this.form.get('lateArrivalCost')?.value,
      toleranceTimeMinutes: this.form.get('toleranceTimeMinutes')?.value,
      absenceThresholdMinutes: this.form.get('absenceThresholdMinutes')?.value
    };

    this.api.updateSettings(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ data }) => {
          if (!data) return;

          this.originalValues.set({
            absenceCost: data.absenceCost,
            lateArrivalCost: data.lateArrivalCost,
            toleranceTimeMinutes: data.toleranceTimeMinutes,
            absenceThresholdMinutes: data.absenceThresholdMinutes
          });

          this.form.patchValue({
            absenceCost: data.absenceCost,
            lateArrivalCost: data.lateArrivalCost,
            toleranceTimeMinutes: data.toleranceTimeMinutes,
            absenceThresholdMinutes: data.absenceThresholdMinutes
          });
        }
      });
  }
}

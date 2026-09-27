import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonComponent } from '@shared/components/button/button';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <section class="w-full">
      <div class="mb-6 text-center">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Administración</p>
        <h1 class="text-3xl font-semibold text-text">Acceso administrativo</h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-text">Correo electrónico</span>
          <input
            type="email"
            formControlName="email"
            autocomplete="email"
            placeholder="admin@check.com"
            class="w-full rounded-lg border border-[#d9d9d9] bg-white px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            [class.border-red-500]="emailCtrl.invalid && (emailCtrl.touched || emailCtrl.dirty)"
          />
        </label>

        @if (emailCtrl.invalid && (emailCtrl.touched || emailCtrl.dirty)) {
          <p class="text-sm text-red-600">
            @if (emailCtrl.hasError('required')) {
              <span>El correo es obligatorio.</span>
            } @else if (emailCtrl.hasError('email')) {
              <span>Ingresa un correo válido.</span>
            }
          </p>
        }

        @if (errorMessage()) {
          <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ errorMessage() }}
          </div>
        }

        <div class="pt-2">
          <app-button type="submit" [disabled]="form.invalid || loading()" [loading]="loading()" [fullWidth]="true">
            Enviar enlace de acceso
          </app-button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-text-muted">
        Se enviará un enlace seguro a tu correo para iniciar sesión.
      </p>
    </section>
  `
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get emailCtrl() {
    return this.form.controls.email;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.emailCtrl.value.trim();
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response?.statusCode === 200 || response?.statusCode === 201) {
            this.errorMessage.set('');
            this.form.reset();
            return;
          }

          this.errorMessage.set(response?.message ?? 'No se pudo enviar el enlace de acceso.');
        },
        error: () => {
          this.errorMessage.set('No se pudo enviar el enlace de acceso. Inténtalo nuevamente.');
        }
      });
  }
}

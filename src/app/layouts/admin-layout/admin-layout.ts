import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer';
import { HeaderComponent, NavLink } from '@shared/components/header/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-off-white">
      <app-header
        [navLinks]="adminNavLinks"
        [showCta]="true"
        ctaLabel="Guardar"
        ctaRoute="/admin/settings"
      />

      <div class="pt-[74px]">
        <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
          <aside class="w-full rounded-2xl bg-white p-4 shadow-md ring-1 ring-[#e7e7e7] lg:w-72">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Administración</p>

            <nav class="space-y-2" aria-label="Menú administrativo">
              @for (link of sidebarLinks; track link.route) {
                <a
                  [routerLink]="link.route"
                  routerLinkActive="bg-off-white text-primary ring-1 ring-primary/20"
                  [routerLinkActiveOptions]="{ exact: link.exact ?? false }"
                  class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-off-white hover:text-primary"
                >
                  <span>{{ link.label }}</span>
                </a>
              }
            </nav>
          </aside>

          <main class="min-w-0 flex-1">
            <router-outlet />
          </main>
        </div>
      </div>

      <app-footer />
    </div>
  `
})
export class AdminLayoutComponent {
  readonly adminNavLinks: NavLink[] = [
    { label: 'Dashboard', route: '/admin' },
    { label: 'Configuración', route: '/admin/settings' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'ESP32', route: '/admin/reader' },
    { label: 'Eventos', route: '/admin/events' }
  ];

  readonly sidebarLinks: NavLink[] = [
    { label: 'Inicio', route: '/admin', exact: true },
    { label: 'Configuración', route: '/admin/settings' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'ESP32', route: '/admin/reader' },
    { label: 'Eventos', route: '/admin/events' }
  ];
}

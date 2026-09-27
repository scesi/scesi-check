import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer';
import { HeaderComponent, NavLink } from '@shared/components/header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-off-white">
      <app-header
        [navLinks]="navLinks"
        [showCta]="true"
        ctaLabel="Configuración"
        ctaRoute="/admin/settings"
      />

      <div class="pt-[74px]">
        <router-outlet />
      </div>

      <app-footer />
    </div>
  `
})
export class MainLayoutComponent {
  readonly navLinks: NavLink[] = [
    { label: 'Inicio', route: '/', exact: true },
    { label: 'Panel', route: '/admin/settings' },
    { label: 'Configuración', route: '/admin/settings' },
    { label: 'Soporte', route: '/support' }
  ];
}
